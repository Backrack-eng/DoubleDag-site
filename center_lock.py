#!/usr/bin/env python3
"""Subject-centering lock (Phase 1).

Offline CLI: pick a subject ROI, track it with CSRT, smooth the path, then
either crop a digitally-stabilized/centered output or write a tracking-preview
overlay. Final video is encoded with ffmpeg (libx264), not cv2.VideoWriter.

Setup (local, not part of the Next.js site deploy):
    pip install opencv-contrib-python
    ffmpeg must be available on PATH

Known limitations (Phase 1):
- Single subject only, no multi-target support.
- No automatic recovery when the tracker drifts or the subject is occluded
  (Phase 2). Failed frames hold the last known-good center.
- Translation + uniform zoom only — no rotation compensation.
- CSRT is accurate but slow; expect roughly real-time-or-slower processing
  on a typical clip. This is an offline tool, not a live preview.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
import threading

import cv2

# Progress cadence for the long tracking / render loops.
PROGRESS_EVERY = 30


# ---------------------------------------------------------------------------
# Small plumbing helpers (kept here on purpose — no extra modules)
# ---------------------------------------------------------------------------

def require_ffmpeg():
    """Fail fast if ffmpeg isn't on PATH; encoding and muxing depend on it."""
    if shutil.which("ffmpeg") is None:
        sys.exit(
            "error: ffmpeg not found on PATH. Install ffmpeg and retry. "
            "This tool shells out to ffmpeg for encoding; it does not use "
            "cv2.VideoWriter for the final file."
        )


def create_csrt_tracker():
    """Return a CSRT tracker.

    The Phase 1 spec calls for cv2.TrackerCSRT_create(). OpenCV has moved that
    constructor around (top-level, TrackerCSRT.create, cv2.legacy), so try the
    spec name first and fall back so contrib builds actually work.
    """
    if hasattr(cv2, "TrackerCSRT_create"):
        return cv2.TrackerCSRT_create()
    if hasattr(cv2, "TrackerCSRT"):
        return cv2.TrackerCSRT.create()
    legacy = getattr(cv2, "legacy", None)
    if legacy is not None:
        if hasattr(legacy, "TrackerCSRT_create"):
            return legacy.TrackerCSRT_create()
        if hasattr(legacy, "TrackerCSRT"):
            return legacy.TrackerCSRT.create()
    sys.exit(
        "error: CSRT tracker is unavailable in this OpenCV build. "
        "Install opencv-contrib-python (not opencv-python) and retry."
    )


def open_capture(video_path, start_frame=0):
    """Open a video and seek to start_frame. Decode-skip if the seek is a miss."""
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        sys.exit(f"error: could not open video: {video_path}")

    if start_frame < 0:
        cap.release()
        sys.exit("error: --start-frame must be >= 0")

    if start_frame > 0:
        cap.set(cv2.CAP_PROP_POS_FRAMES, float(start_frame))
        landed = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
        if landed != start_frame:
            # Some codecs ignore CAP_PROP_POS_FRAMES. Fall back to grabbing.
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            for i in range(start_frame):
                if not cap.grab():
                    cap.release()
                    sys.exit(
                        f"error: could not seek to --start-frame {start_frame} "
                        f"(stopped at frame {i})"
                    )
    return cap


def video_fps(cap):
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps is None or fps <= 1e-3:
        print(
            "WARNING: could not read source frame rate; defaulting to 30 fps",
            file=sys.stderr,
            flush=True,
        )
        return 30.0
    return float(fps)


def expected_frame_count(cap, start_frame):
    """Best-effort remaining-frame count for progress (container metadata)."""
    reported = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if reported <= 0:
        return None
    remaining = reported - start_frame
    return remaining if remaining > 0 else None


def progress(phase, processed, total):
    denom = str(total) if total else "?"
    print(f"[{phase}] {processed}/{denom} frames", flush=True)


def warn(msg):
    print(f"WARNING: {msg}", file=sys.stderr, flush=True)


def has_audio_stream(path):
    """True if the file has at least one audio stream. Never raises."""
    ffprobe = shutil.which("ffprobe")
    if ffprobe:
        result = subprocess.run(
            [
                ffprobe,
                "-v",
                "error",
                "-select_streams",
                "a",
                "-show_entries",
                "stream=codec_type",
                "-of",
                "csv=p=0",
                path,
            ],
            capture_output=True,
            text=True,
        )
        return bool(result.stdout.strip())

    # ffprobe isn't always packaged separately; parse ffmpeg's probe banner.
    result = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", path],
        capture_output=True,
        text=True,
    )
    return "Audio:" in (result.stderr or "")


# ---------------------------------------------------------------------------
# 1. ROI
# ---------------------------------------------------------------------------

def select_roi(video_path, start_frame):
    """Open the video, seek to start_frame, let the user drag a subject box.

    Returns (x, y, w, h). Works for both a tight "point" box and a larger area.
    """
    cap = open_capture(video_path, start_frame)
    ok, frame = cap.read()
    cap.release()
    if not ok or frame is None:
        sys.exit(
            f"error: could not read frame {start_frame} from {video_path}"
        )

    window = "Select subject — drag a box, ENTER/SPACE to confirm, ESC/c to cancel"
    try:
        cv2.namedWindow(window, cv2.WINDOW_NORMAL)
        roi = cv2.selectROI(window, frame, showCrosshair=True, fromCenter=False)
    except cv2.error as exc:
        sys.exit(
            "error: ROI selection requires a display (OpenCV GUI). "
            f"Underlying error: {exc}"
        )
    finally:
        cv2.destroyAllWindows()
        # Extra waitKey so some backends actually close the window.
        cv2.waitKey(1)

    x, y, w, h = (int(v) for v in roi)
    return (x, y, w, h)


# ---------------------------------------------------------------------------
# 2. Track
# ---------------------------------------------------------------------------

def track_subject(video_path, roi, start_frame):
    """Walk the clip from start_frame with CSRT.

    Returns a list of dicts:
        {frame_idx, cx, cy, w, h, tracker_ok}

    If tracking fails on a frame: log a warning and HOLD the last known-good
    center rather than crashing.
    # Phase 1 limitation: no auto re-detection / recovery. That is Phase 2.
    """
    x, y, w, h = roi
    cap = open_capture(video_path, start_frame)
    total = expected_frame_count(cap, start_frame)

    ok, frame = cap.read()
    if not ok or frame is None:
        cap.release()
        sys.exit(f"error: could not read frame {start_frame} from {video_path}")

    tracker = create_csrt_tracker()
    # OpenCV 4 returns True/False; OpenCV 5 returns None on success. Only False is failure.
    init_ok = tracker.init(frame, (x, y, w, h))
    if init_ok is False:
        cap.release()
        sys.exit("error: CSRT tracker failed to initialize on the selected ROI")

    points = [
        {
            "frame_idx": start_frame,
            "cx": x + w / 2.0,
            "cy": y + h / 2.0,
            "w": float(w),
            "h": float(h),
            "tracker_ok": True,
        }
    ]

    processed = 1
    if processed % PROGRESS_EVERY == 0 or processed == total:
        progress("tracking", processed, total)

    frame_idx = start_frame
    while True:
        ok, frame = cap.read()
        if not ok or frame is None:
            break
        frame_idx += 1
        processed += 1

        track_ok, box = tracker.update(frame)
        if not track_ok or box is None:
            # Phase 1 limitation: hold last good center. Auto re-detection /
            # recovery is coming in Phase 2 — do not crash the run here.
            warn(
                f"tracker lost subject at frame {frame_idx}; "
                "holding last known-good center "
                "(Phase 1 limitation: no auto recovery)"
            )
            last = points[-1]
            points.append(
                {
                    "frame_idx": frame_idx,
                    "cx": last["cx"],
                    "cy": last["cy"],
                    "w": last["w"],
                    "h": last["h"],
                    "tracker_ok": False,
                }
            )
        else:
            bx, by, bw, bh = (float(v) for v in box)
            points.append(
                {
                    "frame_idx": frame_idx,
                    "cx": bx + bw / 2.0,
                    "cy": by + bh / 2.0,
                    "w": bw,
                    "h": bh,
                    "tracker_ok": True,
                }
            )

        if processed % PROGRESS_EVERY == 0:
            progress("tracking", processed, total)

    cap.release()
    if processed % PROGRESS_EVERY != 0:
        progress("tracking", processed, processed if total is None else total)
    return points


# ---------------------------------------------------------------------------
# 3. Smooth (non-causal; we have the whole clip)
# ---------------------------------------------------------------------------

def smooth_centers(raw_points, window):
    """Centered moving average of (cx, cy).

    Offline, so each point uses frames on BOTH sides. Edges shrink the window
    rather than padding with zeros (which would pull the path toward origin).
    """
    n = len(raw_points)
    if n == 0:
        return []

    window = max(1, int(window))
    half = window // 2
    smoothed = []
    for i in range(n):
        start = max(0, i - half)
        end = min(n, i + half + 1)
        span = raw_points[start:end]
        cx = sum(p["cx"] for p in span) / len(span)
        cy = sum(p["cy"] for p in span) / len(span)
        smoothed.append((cx, cy))
    return smoothed


# ---------------------------------------------------------------------------
# 4. Render (preview overlay OR zoom + crop), encoded via ffmpeg
# ---------------------------------------------------------------------------

def _start_ffmpeg_raw_writer(width, height, fps, dest_path):
    """Pipe BGR frames into libx264. Caller must close stdin and wait."""
    cmd = [
        "ffmpeg",
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "bgr24",
        "-s",
        f"{width}x{height}",
        "-r",
        str(fps),
        "-i",
        "pipe:0",
        "-an",
        "-c:v",
        "libx264",
        "-crf",
        "16",
        "-pix_fmt",
        "yuv420p",
        dest_path,
    ]
    proc = subprocess.Popen(
        cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    err_chunks = []

    def _drain():
        try:
            err_chunks.append(proc.stderr.read())
        except Exception:
            pass

    drainer = threading.Thread(target=_drain, daemon=True)
    drainer.start()
    return proc, drainer, err_chunks


def _finish_ffmpeg(proc, drainer, err_chunks, what):
    if proc.stdin:
        try:
            proc.stdin.close()
        except BrokenPipeError:
            pass
    ret = proc.wait()
    drainer.join(timeout=5)
    err_text = b"".join(err_chunks).decode("utf-8", errors="replace").strip()
    if ret != 0:
        detail = f"\n{err_text}" if err_text else ""
        sys.exit(f"error: ffmpeg {what} failed (exit {ret}).{detail}")


def _write_frame(proc, frame):
    try:
        proc.stdin.write(frame.tobytes())
    except BrokenPipeError:
        sys.exit("error: ffmpeg encode pipe closed unexpectedly")


def _draw_preview(frame, raw_point, smoothed_xy):
    """Red tracked box + green smoothed-center crosshair on the full frame."""
    overlay = frame.copy()
    w = raw_point["w"]
    h = raw_point["h"]
    x = int(round(raw_point["cx"] - w / 2.0))
    y = int(round(raw_point["cy"] - h / 2.0))
    cv2.rectangle(
        overlay,
        (x, y),
        (x + int(round(w)), y + int(round(h))),
        (0, 0, 255),
        2,
    )
    cx, cy = (int(round(smoothed_xy[0])), int(round(smoothed_xy[1])))
    arm = 18
    cv2.line(overlay, (cx - arm, cy), (cx + arm, cy), (0, 255, 0), 2)
    cv2.line(overlay, (cx, cy - arm), (cx, cy + arm), (0, 255, 0), 2)
    return overlay


def _crop_centered(frame, cx, cy, zoom, orig_w, orig_h, frame_idx):
    """Scale up by zoom, crop orig_w x orig_h around the scaled center.

    Returns (crop_bgr, clamped: bool). Clamping means --zoom wasn't enough
    headroom for this frame's motion.
    """
    scaled_w = max(orig_w, int(round(orig_w * zoom)))
    scaled_h = max(orig_h, int(round(orig_h * zoom)))
    scaled = cv2.resize(frame, (scaled_w, scaled_h), interpolation=cv2.INTER_CUBIC)

    # Use the actual scale (after rounding) so the center lands on the resized grid.
    scale_x = scaled_w / float(orig_w)
    scale_y = scaled_h / float(orig_h)
    cx_s = cx * scale_x
    cy_s = cy * scale_y

    desired_x = int(round(cx_s - orig_w / 2.0))
    desired_y = int(round(cy_s - orig_h / 2.0))
    max_x = scaled_w - orig_w
    max_y = scaled_h - orig_h
    x1 = min(max(desired_x, 0), max_x)
    y1 = min(max(desired_y, 0), max_y)
    clamped = x1 != desired_x or y1 != desired_y
    if clamped:
        warn(
            f"crop clamped at frame {frame_idx} "
            f"(desired origin ({desired_x}, {desired_y}); "
            f"used ({x1}, {y1})). Increase --zoom for more headroom."
        )

    crop = scaled[y1 : y1 + orig_h, x1 : x1 + orig_w]
    return crop, clamped


def render_output(
    video_path,
    smoothed_points,
    output_path,
    zoom,
    preview,
    raw_points,
    start_frame,
):
    """Encode either the debug overlay or the zoom-and-crop result via ffmpeg.

    Writes a temp silent file. Returns (silent_path, clamp_warning_count).
    Caller is responsible for muxing audio and deleting the temp file.
    """
    cap = open_capture(video_path, start_frame)
    fps = video_fps(cap)
    orig_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    orig_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    if orig_w <= 0 or orig_h <= 0:
        # Metadata can be empty; read one frame to learn the size.
        pos = cap.get(cv2.CAP_PROP_POS_FRAMES)
        ok, probe = cap.read()
        if not ok or probe is None:
            cap.release()
            sys.exit("error: could not determine source resolution")
        orig_h, orig_w = probe.shape[:2]
        cap.set(cv2.CAP_PROP_POS_FRAMES, pos)

    n = min(len(smoothed_points), len(raw_points))
    if n == 0:
        cap.release()
        sys.exit("error: nothing to render (no tracked frames)")

    out_dir = os.path.dirname(os.path.abspath(output_path))
    if out_dir and not os.path.isdir(out_dir):
        cap.release()
        sys.exit(f"error: output directory does not exist: {out_dir}")

    fd, silent_path = tempfile.mkstemp(
        suffix=".mp4", prefix="center_lock_silent_", dir=out_dir or None
    )
    os.close(fd)

    out_w, out_h = orig_w, orig_h
    proc, drainer, err_chunks = _start_ffmpeg_raw_writer(out_w, out_h, fps, silent_path)

    clamp_count = 0
    processed = 0
    try:
        for i in range(n):
            ok, frame = cap.read()
            if not ok or frame is None:
                warn(f"ran out of source frames during render at index {i}")
                break

            raw = raw_points[i]
            sm_cx, sm_cy = smoothed_points[i]
            frame_idx = raw.get("frame_idx", start_frame + i)

            if preview:
                out_frame = _draw_preview(frame, raw, (sm_cx, sm_cy))
            else:
                out_frame, clamped = _crop_centered(
                    frame, sm_cx, sm_cy, zoom, orig_w, orig_h, frame_idx
                )
                if clamped:
                    clamp_count += 1

            if out_frame.shape[1] != out_w or out_frame.shape[0] != out_h:
                out_frame = cv2.resize(out_frame, (out_w, out_h), interpolation=cv2.INTER_AREA)

            _write_frame(proc, out_frame)
            processed += 1
            if processed % PROGRESS_EVERY == 0:
                progress("rendering", processed, n)
    except Exception:
        # Don't leave a half-written ffmpeg child if we crash mid-loop.
        try:
            proc.kill()
        except Exception:
            pass
        cap.release()
        raise

    cap.release()
    if processed % PROGRESS_EVERY != 0:
        progress("rendering", processed, n)
    _finish_ffmpeg(proc, drainer, err_chunks, "encode")
    return silent_path, clamp_count


# ---------------------------------------------------------------------------
# 5. Mux original audio onto the silent encode
# ---------------------------------------------------------------------------

def mux_audio(silent_video_path, original_input_path, final_output_path, start_seconds=0.0):
    """Map video from the silent encode + audio from the original.

    Exact Phase 1 mapping: -map 0:v -map 1:a -c:v copy -c:a copy.
    If the source has no audio, copy the silent video to the final path.
    start_seconds offsets the original when --start-frame skipped into the clip.
    Always removes the temp silent file.
    """
    try:
        if not has_audio_stream(original_input_path):
            print("No audio stream in source; writing video-only output.", flush=True)
            shutil.copy2(silent_video_path, final_output_path)
            return

        cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", silent_video_path]
        # Offset audio so it lines up when the output starts mid-clip.
        if start_seconds > 0:
            cmd += ["-ss", f"{start_seconds:.6f}"]
        cmd += [
            "-i",
            original_input_path,
            "-map",
            "0:v",
            "-map",
            "1:a",
            "-c:v",
            "copy",
            "-c:a",
            "copy",
            "-shortest",
            final_output_path,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            warn(
                "audio mux failed; writing video-only output. "
                f"ffmpeg said: {(result.stderr or result.stdout or '').strip()}"
            )
            shutil.copy2(silent_video_path, final_output_path)
    finally:
        try:
            os.remove(silent_video_path)
        except OSError:
            pass


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def parse_args(argv=None):
    parser = argparse.ArgumentParser(
        description="Phase 1 subject-centering lock: track, smooth, crop (or preview)."
    )
    parser.add_argument("--input", required=True, help="source video file")
    parser.add_argument("--output", required=True, help="output video file")
    parser.add_argument(
        "--zoom",
        type=float,
        default=1.15,
        help="scale-up factor before cropping (headroom for digital pan). Default: 1.15",
    )
    parser.add_argument(
        "--smoothing",
        type=int,
        default=15,
        help="centered moving-average window in frames. Default: 15",
    )
    parser.add_argument(
        "--preview",
        action="store_true",
        help="write a debug overlay (tracked box + smoothed crosshair) instead of the crop",
    )
    parser.add_argument(
        "--start-frame",
        type=int,
        default=0,
        dest="start_frame",
        help="start partway into the clip (0-based). Default: 0",
    )
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)

    if not os.path.isfile(args.input):
        sys.exit(f"error: input file not found: {args.input}")
    if args.zoom < 1.0:
        sys.exit("error: --zoom must be >= 1.0 (need at least source resolution to crop)")
    if args.smoothing < 1:
        sys.exit("error: --smoothing must be >= 1")
    if args.start_frame < 0:
        sys.exit("error: --start-frame must be >= 0")

    require_ffmpeg()

    probe = open_capture(args.input, 0)
    fps = video_fps(probe)
    probe.release()
    start_seconds = args.start_frame / fps if fps else 0.0

    print(f"Input:  {args.input}", flush=True)
    print(f"Output: {args.output}", flush=True)
    print(
        f"zoom={args.zoom}  smoothing={args.smoothing}  "
        f"start_frame={args.start_frame}  preview={args.preview}",
        flush=True,
    )

    print("Phase: ROI selection — drag a box around the subject.", flush=True)
    roi = select_roi(args.input, args.start_frame)
    x, y, w, h = roi
    if w <= 0 or h <= 0:
        sys.exit("ROI was cancelled or empty. Exiting.")
    print(f"ROI: x={x} y={y} w={w} h={h}", flush=True)

    print("Phase: tracking", flush=True)
    raw_points = track_subject(args.input, roi, args.start_frame)
    if not raw_points:
        sys.exit("error: tracking produced no frames")
    fail_count = sum(1 for p in raw_points if not p["tracker_ok"])

    print("Phase: smoothing", flush=True)
    smoothed = smooth_centers(raw_points, args.smoothing)
    print(f"[smoothing] {len(smoothed)}/{len(smoothed)} frames", flush=True)

    print("Phase: rendering", flush=True)
    silent_path, clamp_count = render_output(
        args.input,
        smoothed,
        args.output,
        args.zoom,
        args.preview,
        raw_points,
        args.start_frame,
    )

    # Preview is still a watchable video; mux audio when the source has it.
    print("Phase: audio mux", flush=True)
    mux_audio(silent_path, args.input, args.output, start_seconds=start_seconds)

    total = len(raw_points)
    print("", flush=True)
    print("=== Summary ===", flush=True)
    print(f"Total frames:          {total}", flush=True)
    print(f"Tracker-failure frames: {fail_count}", flush=True)
    print(f"Clamp-warning frames:   {clamp_count}", flush=True)
    print(f"Wrote: {args.output}", flush=True)
    if fail_count:
        print(
            "Tracker failures mean the box was held still on those frames "
            "(Phase 1). Re-pick a tighter ROI or start later if the lock drifted.",
            flush=True,
        )
    if clamp_count:
        print(
            "Clamp warnings mean --zoom was not enough headroom for the motion. "
            "Try a larger --zoom.",
            flush=True,
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())

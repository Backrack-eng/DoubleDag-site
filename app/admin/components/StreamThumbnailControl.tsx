"use client";

import { useEffect, useMemo, useState } from "react";

/** Matches getPortfolioVideos thumbnail URL resolution. */
export function streamThumbnailUrl(
  uid: string,
  orientation: "landscape" | "portrait",
  thumbnailTime?: string | null,
): string {
  const base = `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg`;
  if (thumbnailTime === null) {
    return base;
  }
  if (typeof thumbnailTime === "string" && thumbnailTime.trim()) {
    return `${base}?time=${thumbnailTime.trim()}`;
  }
  return orientation === "landscape" ? `${base}?time=3s` : base;
}

export function formatThumbnailTime(seconds: number): string {
  const clamped = Math.max(0, seconds);
  const rounded = Math.round(clamped * 10) / 10;
  if (Number.isInteger(rounded)) {
    return `${rounded}s`;
  }
  return `${rounded}s`;
}

export function parseThumbnailTimeSeconds(
  value: string | null | undefined,
  orientation: "landscape" | "portrait",
): number {
  if (value === null) {
    return 0;
  }
  if (typeof value === "string" && value.trim()) {
    const match = /^(\d+(?:\.\d+)?)\s*s?$/i.exec(value.trim());
    if (match) {
      return Number(match[1]);
    }
  }
  return orientation === "landscape" ? 3 : 0;
}

type StreamThumbnailControlProps = {
  uid: string;
  title: string;
  orientation: "landscape" | "portrait";
  durationSeconds: number | undefined;
  thumbnailTime: string | null | undefined;
  onChange: (thumbnailTime: string | null | undefined) => void;
};

export function StreamThumbnailControl({
  uid,
  title,
  orientation,
  durationSeconds,
  thumbnailTime,
  onChange,
}: StreamThumbnailControlProps) {
  const maxSeconds =
    typeof durationSeconds === "number" && durationSeconds > 0
      ? durationSeconds
      : 0;
  const [open, setOpen] = useState(false);
  const [draftSeconds, setDraftSeconds] = useState(() =>
    parseThumbnailTimeSeconds(thumbnailTime, orientation),
  );
  const [secondsInput, setSecondsInput] = useState(() =>
    String(
      Number(
        parseThumbnailTimeSeconds(thumbnailTime, orientation).toFixed(1),
      ),
    ),
  );
  const [previewTime, setPreviewTime] = useState<string | null | undefined>(
    thumbnailTime,
  );

  useEffect(() => {
    const seconds = parseThumbnailTimeSeconds(thumbnailTime, orientation);
    setDraftSeconds(seconds);
    setSecondsInput(String(Number(seconds.toFixed(1))));
    setPreviewTime(thumbnailTime);
  }, [thumbnailTime, orientation, uid]);

  const previewSrc = useMemo(
    () => streamThumbnailUrl(uid, orientation, previewTime),
    [uid, orientation, previewTime],
  );
  const chipSrc = useMemo(
    () => streamThumbnailUrl(uid, orientation, thumbnailTime),
    [uid, orientation, thumbnailTime],
  );

  function clampSeconds(value: number) {
    if (maxSeconds <= 0) {
      return Math.max(0, value);
    }
    return Math.min(maxSeconds, Math.max(0, value));
  }

  function commitSeconds(raw: number) {
    const seconds = clampSeconds(raw);
    setDraftSeconds(seconds);
    setSecondsInput(String(Number(seconds.toFixed(1))));
    const formatted = formatThumbnailTime(seconds);
    setPreviewTime(formatted);
    onChange(formatted);
  }

  function resetToDefault() {
    const seconds = orientation === "landscape" ? 3 : 0;
    setDraftSeconds(seconds);
    setSecondsInput(String(seconds));
    setPreviewTime(undefined);
    onChange(undefined);
  }

  const isPortrait = orientation === "portrait";
  const hasOverride =
    typeof thumbnailTime === "string" || thumbnailTime === null;

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <img
          src={chipSrc}
          alt=""
          draggable={false}
          className={
            isPortrait
              ? "h-12 w-[27px] shrink-0 rounded object-cover bg-black"
              : "h-9 w-16 shrink-0 rounded object-cover bg-black"
          }
        />
        <button
          type="button"
          draggable={false}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-neutral-300 transition hover:border-violet-400/40 hover:text-violet-100"
          aria-expanded={open}
          aria-label={`Thumbnail frame for ${title}`}
        >
          Thumbnail{hasOverride ? " · custom" : ""}
        </button>
      </div>

      {open && (
        <div
          className="mt-3 rounded-lg border border-white/10 bg-black/40 p-3"
          draggable={false}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {maxSeconds <= 0 ? (
            <p className="text-xs text-neutral-500">
              Duration unavailable for this video — can&apos;t scrub frames.
            </p>
          ) : (
            <>
              <div
                className={
                  isPortrait
                    ? "mx-auto w-28 overflow-hidden rounded-md bg-black aspect-[9/16]"
                    : "w-full max-w-xs overflow-hidden rounded-md bg-black aspect-video"
                }
              >
                <img
                  src={previewSrc}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <label className="mt-3 block text-xs text-neutral-400">
                Frame time (0–{formatThumbnailTime(maxSeconds).replace(/s$/, "")}
                s)
                <input
                  type="range"
                  min={0}
                  max={maxSeconds}
                  step={0.1}
                  value={draftSeconds}
                  onChange={(event) => {
                    const next = clampSeconds(Number(event.target.value));
                    setDraftSeconds(next);
                    setSecondsInput(String(Number(next.toFixed(1))));
                  }}
                  onPointerUp={(event) =>
                    commitSeconds(Number(event.currentTarget.value))
                  }
                  onMouseUp={(event) =>
                    commitSeconds(Number(event.currentTarget.value))
                  }
                  onTouchEnd={(event) =>
                    commitSeconds(Number(event.currentTarget.value))
                  }
                  onKeyUp={(event) => {
                    if (
                      event.key === "ArrowLeft" ||
                      event.key === "ArrowRight" ||
                      event.key === "Home" ||
                      event.key === "End"
                    ) {
                      commitSeconds(Number(event.currentTarget.value));
                    }
                  }}
                  className="mt-2 w-full accent-violet-400"
                  aria-label={`Thumbnail time slider for ${title}`}
                />
              </label>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={maxSeconds}
                  step={0.1}
                  value={secondsInput}
                  onChange={(event) => {
                    setSecondsInput(event.target.value);
                    const next = Number(event.target.value);
                    if (Number.isFinite(next)) {
                      setDraftSeconds(clampSeconds(next));
                    }
                  }}
                  onBlur={() => {
                    const next = Number(secondsInput);
                    if (Number.isFinite(next)) {
                      commitSeconds(next);
                      return;
                    }
                    setSecondsInput(String(Number(draftSeconds.toFixed(1))));
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      const next = Number(secondsInput);
                      if (Number.isFinite(next)) {
                        commitSeconds(next);
                      }
                      event.currentTarget.blur();
                    }
                  }}
                  className="w-24 rounded-md border border-white/15 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 outline-none focus:border-violet-400/60"
                  aria-label={`Thumbnail time in seconds for ${title}`}
                />
                <span className="text-xs text-neutral-500">seconds</span>
                <button
                  type="button"
                  onClick={resetToDefault}
                  className="ml-auto text-xs font-medium text-neutral-400 underline decoration-white/20 underline-offset-2 hover:text-neutral-200"
                >
                  Reset to default
                </button>
              </div>
              <p className="mt-2 text-[11px] text-neutral-500">
                Saved as{" "}
                <code className="text-neutral-400">
                  {typeof thumbnailTime === "string"
                    ? thumbnailTime
                    : thumbnailTime === null
                      ? "null (base frame)"
                      : isPortrait
                        ? "default (base)"
                        : "default (3s)"}
                </code>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

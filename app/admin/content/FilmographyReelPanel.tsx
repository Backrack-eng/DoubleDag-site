"use client";

import { useEffect, useState } from "react";
import {
  StreamThumbnailControl,
} from "../components/StreamThumbnailControl";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

type FilmographyReelPanelProps = {
  content: JsonObject;
  updatePath: (path: (string | number)[], nextValue: JsonValue) => void;
};

function asString(value: JsonValue | undefined): string {
  return typeof value === "string" ? value : "";
}

export function FilmographyReelPanel({
  content,
  updatePath,
}: FilmographyReelPanelProps) {
  const reelUid = asString(content.reelUid).trim();
  const reelLabel = asString(content.reelLabel);
  const reelTitle = asString(content.reelTitle);
  const reelDescription = asString(content.reelDescription);
  const thumbnailRaw = content.reelThumbnailTime;
  const thumbnailTime: string | null | undefined =
    thumbnailRaw === "" || thumbnailRaw === undefined
      ? undefined
      : thumbnailRaw === null
        ? null
        : typeof thumbnailRaw === "string"
          ? thumbnailRaw
          : undefined;

  const [durationSeconds, setDurationSeconds] = useState<number | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!reelUid) {
      setDurationSeconds(undefined);
      return;
    }

    let cancelled = false;

    async function loadDuration() {
      try {
        const response = await fetch("/api/admin/overrides", {
          cache: "no-store",
        });
        const data: unknown = await response.json();
        if (!response.ok || cancelled) {
          return;
        }
        if (
          typeof data === "object" &&
          data !== null &&
          "durations" in data &&
          typeof (data as { durations: unknown }).durations === "object" &&
          (data as { durations: unknown }).durations !== null
        ) {
          const durations = (data as { durations: Record<string, unknown> })
            .durations;
          const value = durations[reelUid];
          if (typeof value === "number" && value > 0) {
            setDurationSeconds(value);
            return;
          }
        }
        if (!cancelled) {
          setDurationSeconds(undefined);
        }
      } catch {
        if (!cancelled) {
          setDurationSeconds(undefined);
        }
      }
    }

    void loadDuration();
    return () => {
      cancelled = true;
    };
  }, [reelUid]);

  return (
    <section className="rounded-xl border border-violet-400/30 bg-violet-500/5 p-5">
      <h2 className="text-sm uppercase tracking-[0.3em] text-violet-300">
        Filmography Reel
      </h2>
      <p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-500">
        Same title, description, and thumbnail controls as portfolio videos.
        Label shows above the reel; title and description show under it. Saved
        with Save Changes above.
      </p>

      <div className="mt-5 space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Stream UID
          </span>
          <input
            type="text"
            value={asString(content.reelUid)}
            onChange={(event) => updatePath(["reelUid"], event.target.value)}
            placeholder="Cloudflare Stream video UID"
            className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-violet-400/60"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Label (above video)
          </span>
          <input
            type="text"
            value={reelLabel}
            onChange={(event) => updatePath(["reelLabel"], event.target.value)}
            placeholder="Portfolio Highlight"
            className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-violet-400/60"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Title
          </span>
          <input
            type="text"
            value={reelTitle}
            onChange={(event) => updatePath(["reelTitle"], event.target.value)}
            placeholder="Title shown under the reel"
            className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-violet-400/60"
          />
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
            Description
          </span>
          <textarea
            value={reelDescription}
            onChange={(event) =>
              updatePath(["reelDescription"], event.target.value)
            }
            rows={4}
            placeholder="Description shown under the reel"
            className="w-full resize-y rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm leading-6 text-neutral-100 outline-none focus:border-violet-400/60"
          />
        </label>

        {reelUid ? (
          <StreamThumbnailControl
            uid={reelUid}
            title={reelTitle || reelLabel || reelUid}
            orientation="landscape"
            durationSeconds={durationSeconds}
            thumbnailTime={thumbnailTime}
            onChange={(next) => {
              if (next === undefined) {
                // Empty string = portfolio "default" (omit / 3s landscape).
                updatePath(["reelThumbnailTime"], "");
                return;
              }
              updatePath(["reelThumbnailTime"], next);
            }}
          />
        ) : (
          <p className="text-xs text-neutral-500">
            Enter a Stream UID to edit the thumbnail frame.
          </p>
        )}
      </div>
    </section>
  );
}

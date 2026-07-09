"use client";

import { useState } from "react";
import { photographyImages } from "@/lib/photography-images";

export function PhotographyScroller() {
  const [isPaused, setIsPaused] = useState(false);
  const track = [...photographyImages, ...photographyImages];

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-neutral-950 to-transparent sm:w-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-neutral-950 to-transparent sm:w-20"
      />

      <button
        type="button"
        onClick={() => setIsPaused((paused) => !paused)}
        aria-pressed={isPaused}
        aria-label={
          isPaused ? "Resume scrolling photos" : "Pause scrolling photos"
        }
        className="block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
      >
        <div
          className="flex w-max animate-photo-scroll gap-4 motion-reduce:overflow-x-auto motion-reduce:animate-none"
          style={{ animationPlayState: isPaused ? "paused" : "running" }}
        >
          {track.map((filename, index) => (
            <div
              key={`${filename}-${index}`}
              className="h-[26rem] w-[36rem] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-[28rem] sm:w-[40rem]"
            >
              <img
                src={`/Photography/${encodeURIComponent(filename)}`}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="pointer-events-none h-full w-full select-none object-cover"
              />
            </div>
          ))}
        </div>
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { PortfolioVideo } from "../../lib/portfolio-videos";

function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function ClickToPlayVideo({ video }: { video: PortfolioVideo }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`${video.playbackUrl}?autoplay=true`}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        title={video.title}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${video.title}`}
      className="absolute inset-0"
    >
      <img
        src={video.thumbnailUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/55 transition duration-300 group-hover:bg-black/70 hover:bg-black/70">
          <span
            className="ml-1 h-0 w-0 border-y-8 border-y-transparent border-l-[14px] border-l-white"
            aria-hidden="true"
          />
        </span>
      </span>
    </button>
  );
}

function VideoCard({
  video,
  variant,
}: {
  video: PortfolioVideo;
  variant: "landscape" | "portrait";
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
      <div
        className={
          variant === "portrait"
            ? "relative aspect-[9/16] w-full bg-black"
            : "relative w-full bg-black pt-[56.25%]"
        }
      >
        <ClickToPlayVideo video={video} />
      </div>
      <div className="p-5">
        <h2 className="text-base font-medium text-white">{video.title}</h2>
        {video.duration !== null && (
          <p className="mt-1 text-sm text-neutral-400">
            {formatDuration(video.duration)}
          </p>
        )}
      </div>
      {video.emmyBadge && (
        <img
          src="/emmy-winner-badge.png"
          alt="Emmy Winner"
          className="emmy-badge pointer-events-none absolute right-2 bottom-2 w-1/3 max-w-[180px] select-none"
        />
      )}
    </article>
  );
}

export default function PortfolioGrid({
  videos,
  variant = "landscape",
}: {
  videos: PortfolioVideo[];
  variant?: "landscape" | "portrait";
}) {
  if (videos.length === 0) {
    return (
      <p className="py-20 text-center text-neutral-400">
        No videos yet — check back soon.
      </p>
    );
  }

  return (
    <div
      className={
        variant === "portrait"
          ? "grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
          : "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      }
    >
      {videos.map((video) => (
        <VideoCard key={video.uid} video={video} variant={variant} />
      ))}
    </div>
  );
}

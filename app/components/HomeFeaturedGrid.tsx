"use client";

import type { PortfolioVideo } from "../../lib/portfolio-videos";
import { ClickToPlayVideo } from "../portfolio/PortfolioGrid";
import { CollapsibleCaption } from "./CollapsibleCaption";

function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function isBigCard(index: number) {
  return index % 4 === 0;
}

function HomeFeaturedCard({
  video,
  size,
}: {
  video: PortfolioVideo;
  size: "big" | "small";
}) {
  const needsLetterbox =
    video.orientation === "portrait" || video.source === "youtube";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
      <div className="relative aspect-video w-full bg-black">
        <ClickToPlayVideo
          video={video}
          objectFit={needsLetterbox ? "contain" : "cover"}
        />
        {video.emmyBadge && (
          <img
            src="/emmy-winner-badge.png"
            alt="Emmy Winner"
            className="emmy-badge pointer-events-none absolute right-2 bottom-2 w-1/3 max-w-[180px] select-none"
          />
        )}
      </div>
      <div className={size === "big" ? "p-6 sm:p-7" : "p-4 sm:p-5"}>
        <h2
          className={
            size === "big"
              ? "text-xl font-semibold tracking-tight text-white sm:text-2xl"
              : "text-base font-medium text-white"
          }
        >
          {video.title}
        </h2>
        {video.duration !== null && (
          <p className="mt-1 text-sm text-neutral-400">
            {formatDuration(video.duration)}
          </p>
        )}
        {video.caption && (
          <CollapsibleCaption
            caption={video.caption}
            className={
              size === "big"
                ? "mt-3 whitespace-pre-line text-sm leading-7 text-neutral-300 sm:text-base sm:leading-8"
                : "mt-3 whitespace-pre-line text-sm leading-7 text-neutral-300 sm:text-[15px] sm:leading-8"
            }
          />
        )}
      </div>
    </article>
  );
}

export function HomeFeaturedGrid({ videos }: { videos: PortfolioVideo[] }) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video, index) => {
        const big = isBigCard(index);
        return (
          <div
            key={video.uid}
            className={big ? "col-span-1 sm:col-span-2 lg:col-span-3" : undefined}
          >
            <HomeFeaturedCard video={video} size={big ? "big" : "small"} />
          </div>
        );
      })}
    </div>
  );
}

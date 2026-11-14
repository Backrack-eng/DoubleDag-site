"use client";

import { useEffect, useState } from "react";
import { CollapsibleCaption } from "../components/CollapsibleCaption";
import {
  buildPlaybackSrc,
  clickPlaybackSrc,
  formatCount,
  PAUSE_INLINE_VIDEOS_EVENT,
  type PortfolioGridItem,
  type PortfolioVideo,
} from "../../lib/portfolio-videos";

function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function PlaceholderMedia({ title }: { title: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-black"
      aria-label={`${title} — video coming soon`}
    >
      <div className="px-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">
          Video coming soon
        </p>
      </div>
    </div>
  );
}

export function ClickToPlayVideo({
  video,
  objectFit = "cover",
}: {
  video: PortfolioVideo;
  objectFit?: "cover" | "contain";
}) {
  const [playing, setPlaying] = useState(false);
  const [suppressed, setSuppressed] = useState(false);
  const fitClass = objectFit === "contain" ? "object-contain" : "object-cover";

  useEffect(() => {
    const onPause = () => {
      setPlaying(false);
      setSuppressed(true);
    };
    window.addEventListener(PAUSE_INLINE_VIDEOS_EVENT, onPause);
    return () => {
      window.removeEventListener(PAUSE_INLINE_VIDEOS_EVENT, onPause);
    };
  }, []);

  if (video.placeholder || !video.playbackUrl) {
    return <PlaceholderMedia title={video.title} />;
  }

  if ((video.autoplay || playing) && !suppressed) {
    return (
      <iframe
        src={video.autoplay ? buildPlaybackSrc(video) : clickPlaybackSrc(video)}
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
      onClick={() => {
        setSuppressed(false);
        setPlaying(true);
      }}
      aria-label={`Play ${video.title}`}
      className="absolute inset-0"
    >
      <img
        src={video.thumbnailUrl}
        alt=""
        className={`absolute inset-0 h-full w-full ${fitClass}`}
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
  layout,
}: {
  video: PortfolioVideo;
  variant: "landscape" | "portrait";
  layout: "grid" | "row";
}) {
  const isRow = layout === "row";
  const mediaClass = [
    "relative w-full bg-black",
    variant === "portrait" ? "aspect-[9/16]" : "pt-[56.25%]",
    isRow
      ? "overflow-hidden rounded-3xl border border-white/10 transition duration-300 group-hover:border-white/20"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={
        isRow
          ? "group md:grid md:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] md:items-start md:gap-8"
          : "group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
      }
    >
      <div className={mediaClass}>
        <ClickToPlayVideo video={video} />
        {video.emmyBadge && (
          <img
            src="/emmy-winner-badge.png"
            alt="Emmy Winner"
            className="emmy-badge pointer-events-none absolute right-2 bottom-2 w-1/3 max-w-[180px] select-none"
          />
        )}
      </div>
      <div className={isRow ? "min-w-0 px-1 py-5 md:py-1" : "p-5"}>
        <h2 className="text-base font-medium text-white">{video.title}</h2>
        {video.duration !== null && (
          <p className="mt-1 text-sm text-neutral-400">
            {formatDuration(video.duration)}
          </p>
        )}
        {video.stats && (
          <p className="mt-1 text-sm text-neutral-400">
            {formatCount(video.stats.viewCount)} views ·{" "}
            {formatCount(video.stats.likeCount)} likes
          </p>
        )}
        {variant !== "portrait" && video.caption && isRow && (
          <CollapsibleCaption caption={video.caption} />
        )}
        {variant !== "portrait" && video.caption && !isRow && (
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-300">
            {video.caption}
          </p>
        )}
      </div>
    </article>
  );
}

function SectionBreak({ label }: { label: string }) {
  return (
    <div className="col-span-full py-4 md:py-6">
      <div className="flex items-center gap-4">
        <h2 className="shrink-0 text-sm font-medium uppercase tracking-[0.3em] text-violet-300/80">
          {label}
        </h2>
        <div className="h-px flex-1 bg-white/10" aria-hidden="true" />
      </div>
    </div>
  );
}

export default function PortfolioGrid({
  videos,
  items,
  variant = "landscape",
  layout = "grid",
  gridClassName,
  itemClassName,
}: {
  videos?: PortfolioVideo[];
  items?: PortfolioGridItem[];
  variant?: "landscape" | "portrait";
  layout?: "grid" | "row";
  /** Optional override for the outer grid/flex container (e.g. Creators portrait layout). */
  gridClassName?: string;
  /** Optional wrapper class around each video card (e.g. fixed column widths). */
  itemClassName?: string;
}) {
  const resolvedItems: PortfolioGridItem[] =
    items ??
    (videos ?? []).map((video) => ({
      type: "video" as const,
      video,
    }));

  if (resolvedItems.length === 0) {
    return (
      <p className="py-20 text-center text-neutral-400">
        No videos yet — check back soon.
      </p>
    );
  }

  const defaultGridClass =
    variant === "portrait"
      ? "grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4"
      : layout === "row"
        ? "grid gap-6"
        : "grid gap-6 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={gridClassName ?? defaultGridClass}>
      {resolvedItems.map((item) =>
        item.type === "section" ? (
          <SectionBreak key={item.uid} label={item.label} />
        ) : itemClassName ? (
          <div key={item.video.uid} className={itemClassName}>
            <VideoCard
              video={item.video}
              variant={variant}
              layout={layout}
            />
          </div>
        ) : (
          <VideoCard
            key={item.video.uid}
            video={item.video}
            variant={variant}
            layout={layout}
          />
        ),
      )}
    </div>
  );
}

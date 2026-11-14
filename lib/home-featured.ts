import fs from "node:fs";
import path from "node:path";
import HOME_FEATURED from "./home-featured.json";
import type { PortfolioVideo } from "./portfolio-videos";

export type HomeFeaturedEntry = {
  uid: string;
  order: number;
  hidden?: boolean;
  /** When non-empty, overrides portfolio title. */
  title?: string;
  /** When non-empty, overrides portfolio caption. Empty/missing falls back. */
  caption?: string;
  /** When set, overrides portfolio Emmy badge. When omitted, falls back. */
  emmyBadge?: boolean;
};

const HOME_FEATURED_PATH = path.join(
  process.cwd(),
  "lib",
  "home-featured.json",
);

export function homeFeaturedFilePath() {
  return HOME_FEATURED_PATH;
}

/**
 * - Development: re-read from disk so admin Save + reload works.
 * - Production / build: static import (no fs).
 */
export function loadHomeFeatured(): HomeFeaturedEntry[] {
  if (process.env.NODE_ENV === "development") {
    const raw = JSON.parse(fs.readFileSync(HOME_FEATURED_PATH, "utf8"));
    return Array.isArray(raw) ? (raw as HomeFeaturedEntry[]) : [];
  }
  return Array.isArray(HOME_FEATURED)
    ? (HOME_FEATURED as HomeFeaturedEntry[])
    : [];
}

export function resolveHomeFeaturedVideos(
  entries: HomeFeaturedEntry[],
  videos: PortfolioVideo[],
): PortfolioVideo[] {
  const byUid = new Map(videos.map((video) => [video.uid, video]));

  return [...entries]
    .filter((entry) => !entry.hidden)
    .sort((a, b) => a.order - b.order)
    .flatMap((entry) => {
      const base = byUid.get(entry.uid);
      if (!base) {
        return [];
      }

      const title =
        typeof entry.title === "string" && entry.title.trim()
          ? entry.title.trim()
          : base.title;
      const caption =
        typeof entry.caption === "string" && entry.caption.trim()
          ? entry.caption
          : base.caption;
      const emmyBadge =
        typeof entry.emmyBadge === "boolean"
          ? entry.emmyBadge
          : base.emmyBadge;

      return [
        {
          ...base,
          title,
          caption,
          emmyBadge,
        },
      ];
    });
}

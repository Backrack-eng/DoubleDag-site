import fs from "node:fs";
import path from "node:path";
import PLACEHOLDERS from "./portfolio-placeholders.json";
import OVERRIDES from "./portfolio-overrides.json";
import type {
  GridSectionItem,
  GridVideoItem,
  PortfolioGridItem,
  PortfolioVideo,
  SectionBreakEntry,
  YouTubeOverrideEntry,
} from "./portfolio-videos";

type OverrideEntry = {
  title: string;
  order: number;
  hidden?: boolean;
  thumbnailTime?: string | null;
  caption?: string;
  emmyBadge?: boolean;
  featured?: boolean;
  mainReel?: boolean;
  spotlight?: { meta: string; award?: string; paragraphs: string[] };
  loop?: boolean;
  autoplay?: boolean;
};

type AnyOverrideEntry = OverrideEntry | YouTubeOverrideEntry | SectionBreakEntry;

type PlaceholderEntry = {
  id: string;
  title: string;
  order: number;
  orientation: "landscape" | "portrait";
  caption?: string;
  emmyBadge?: boolean;
  hidden?: boolean;
};

const OVERRIDES_PATH = path.join(process.cwd(), "lib", "portfolio-overrides.json");
const PLACEHOLDERS_PATH = path.join(
  process.cwd(),
  "lib",
  "portfolio-placeholders.json",
);

/**
 * - Development: re-read from disk so /admin/portfolio Save shows on /portfolio and /creators.
 * - Production / build: static import (no fs).
 */
function loadOverrides(): Record<string, AnyOverrideEntry> {
  if (process.env.NODE_ENV === "development") {
    return JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8")) as Record<
      string,
      AnyOverrideEntry
    >;
  }
  return OVERRIDES as Record<string, AnyOverrideEntry>;
}

function loadPlaceholders(): PlaceholderEntry[] {
  if (process.env.NODE_ENV === "development") {
    const raw = JSON.parse(fs.readFileSync(PLACEHOLDERS_PATH, "utf8"));
    return Array.isArray(raw) ? (raw as PlaceholderEntry[]) : [];
  }
  return PLACEHOLDERS as PlaceholderEntry[];
}

interface StreamVideo {
  uid: string;
  duration: number;
  created: string;
  status: { state: string };
  meta?: { name?: string };
  input?: { width: number; height: number };
}

interface StreamListResponse {
  result: StreamVideo[];
}

interface YoutubeVideoListResponse {
  items?: Array<{
    id?: string;
    statistics?: {
      viewCount?: string;
      likeCount?: string;
    };
  }>;
}

function isYouTubeOverride(
  key: string,
  entry: AnyOverrideEntry,
): entry is YouTubeOverrideEntry {
  return (
    key.startsWith("youtube:") ||
    ("source" in entry && entry.source === "youtube")
  );
}

function isSectionOverride(
  key: string,
  entry: AnyOverrideEntry,
): entry is SectionBreakEntry {
  return (
    key.startsWith("section:") ||
    ("type" in entry && entry.type === "section")
  );
}

function youtubeIdFromOverride(
  key: string,
  entry: YouTubeOverrideEntry,
): string {
  if (entry.youtubeId) {
    return entry.youtubeId;
  }
  return key.startsWith("youtube:") ? key.slice("youtube:".length) : key;
}

function entryOrder(
  uid: string,
  overrides: Record<string, AnyOverrideEntry>,
  placeholderOrder: Map<string, number>,
): number | undefined {
  return overrides[uid]?.order ?? placeholderOrder.get(uid);
}

async function getYoutubeStats(
  youtubeIds: string[],
): Promise<Map<string, { viewCount: number; likeCount: number }>> {
  const ids = [...new Set(youtubeIds.filter(Boolean))];
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || ids.length === 0) {
    return new Map();
  }

  const stats = new Map<string, { viewCount: number; likeCount: number }>();

  try {
    for (let index = 0; index < ids.length; index += 50) {
      const batch = ids.slice(index, index + 50);
      const url = new URL("https://www.googleapis.com/youtube/v3/videos");
      url.searchParams.set("part", "statistics");
      url.searchParams.set("id", batch.join(","));
      url.searchParams.set("key", apiKey);

      const response = await fetch(url.toString(), {
        next: { revalidate: 3600 },
      });
      if (!response.ok) {
        return new Map();
      }

      const data = (await response.json()) as YoutubeVideoListResponse;
      for (const item of data.items ?? []) {
        if (!item.id) {
          continue;
        }
        const viewCount = Number(item.statistics?.viewCount);
        const likeCount = Number(item.statistics?.likeCount);
        if (!Number.isFinite(viewCount)) {
          continue;
        }
        stats.set(item.id, {
          viewCount,
          likeCount: Number.isFinite(likeCount) ? likeCount : 0,
        });
      }
    }
  } catch {
    return new Map();
  }

  return stats;
}

export async function getPortfolioVideos(): Promise<PortfolioVideo[]> {
  const overrides = loadOverrides();
  const placeholders = loadPlaceholders();
  const placeholderOrder = new Map(
    placeholders.map((entry) => [entry.id, entry.order]),
  );

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/stream?per_page=1000`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_STREAM_API_TOKEN}`,
      },
      next: { revalidate: 300 },
    },
  );

  const data = (await response.json()) as StreamListResponse;
  const result = data.result ?? [];
  const createdByUid = new Map(result.map((video) => [video.uid, video.created]));

  const streamVideos: PortfolioVideo[] = result
    .filter((video) => video.status.state === "ready")
    .filter((video) => !overrides[video.uid]?.hidden)
    .map((video) => {
      const width = video.input?.width ?? null;
      const height = video.input?.height ?? null;
      const orientation: PortfolioVideo["orientation"] =
        width !== null && height !== null && height > width
          ? "portrait"
          : "landscape";
      const override = overrides[video.uid];
      const streamOverride: OverrideEntry | undefined =
        override &&
        !isYouTubeOverride(video.uid, override) &&
        !isSectionOverride(video.uid, override)
          ? override
          : undefined;
      const baseThumbnailUrl = `https://videodelivery.net/${video.uid}/thumbnails/thumbnail.jpg`;
      const thumbnailUrl =
        streamOverride?.thumbnailTime === null
          ? baseThumbnailUrl
          : streamOverride?.thumbnailTime
            ? `${baseThumbnailUrl}?time=${streamOverride.thumbnailTime}`
            : orientation === "landscape"
              ? `${baseThumbnailUrl}?time=3s`
              : baseThumbnailUrl;

      return {
        uid: video.uid,
        title: streamOverride?.title ?? video.meta?.name ?? video.uid,
        duration: video.duration === -1 ? null : video.duration,
        thumbnailUrl,
        playbackUrl: `https://iframe.videodelivery.net/${video.uid}`,
        width,
        height,
        orientation,
        source: "stream" as const,
        stats: null,
        caption: streamOverride?.caption,
        emmyBadge: streamOverride?.emmyBadge ?? false,
        featured: streamOverride?.featured ?? false,
        mainReel: streamOverride?.mainReel ?? false,
        spotlight: streamOverride?.spotlight,
        loop: streamOverride?.loop ?? false,
        autoplay: streamOverride?.autoplay ?? false,
      };
    });

  const placeholderVideos: PortfolioVideo[] = placeholders
    .filter((entry) => !entry.hidden)
    .map((entry) => ({
      uid: entry.id,
      title: entry.title,
      duration: null,
      thumbnailUrl: "",
      playbackUrl: "",
      width: null,
      height: null,
      orientation: entry.orientation,
      source: "stream" as const,
      stats: null,
      caption: entry.caption,
      emmyBadge: entry.emmyBadge ?? false,
      featured: false,
      mainReel: false,
      loop: false,
      autoplay: false,
      placeholder: true,
    }));

  const youtubeOverrides = Object.entries(overrides).filter(([key, entry]) =>
    isYouTubeOverride(key, entry),
  ) as Array<[string, YouTubeOverrideEntry]>;
  const youtubeStats = await getYoutubeStats(
    youtubeOverrides
      .filter(([, entry]) => !entry.hidden)
      .map(([key, entry]) => youtubeIdFromOverride(key, entry)),
  );

  const youtubeVideos: PortfolioVideo[] = youtubeOverrides
    .filter(([, entry]) => !entry.hidden)
    .map(([key, entry]) => {
      const youtubeId = youtubeIdFromOverride(key, entry);
      return {
        uid: key.startsWith("youtube:") ? key : `youtube:${youtubeId}`,
        title: entry.title,
        duration: null,
        thumbnailUrl: entry.thumbnailOverrideUrl
          ? entry.thumbnailOverrideUrl
          : `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        playbackUrl: `https://www.youtube.com/embed/${youtubeId}`,
        width: null,
        height: null,
        orientation: "landscape" as const,
        source: "youtube" as const,
        youtubeId,
        stats: youtubeStats.get(youtubeId) ?? null,
        featured: entry.featured ?? false,
        mainReel: entry.mainReel ?? false,
        spotlight: entry.spotlight,
        loop: entry.loop ?? false,
        autoplay: entry.autoplay ?? false,
      };
    });

  return [...streamVideos, ...placeholderVideos, ...youtubeVideos].sort(
    (a, b) => {
      const aOrder = entryOrder(a.uid, overrides, placeholderOrder);
      const bOrder = entryOrder(b.uid, overrides, placeholderOrder);
      const aHasOrder = aOrder !== undefined;
      const bHasOrder = bOrder !== undefined;

      if (aHasOrder && bHasOrder) {
        return aOrder - bOrder;
      }
      if (aHasOrder) {
        return -1;
      }
      if (bHasOrder) {
        return 1;
      }

      return (
        Date.parse(createdByUid.get(b.uid) ?? "0") -
        Date.parse(createdByUid.get(a.uid) ?? "0")
      );
    },
  );
}

export async function getPortfolioGridItems(): Promise<PortfolioGridItem[]> {
  const overrides = loadOverrides();
  const placeholders = loadPlaceholders();
  const placeholderOrder = new Map(
    placeholders.map((entry) => [entry.id, entry.order]),
  );
  const videos = await getPortfolioVideos();
  const streamVideos = videos.filter((video) => video.source !== "youtube");

  const sectionItems: GridSectionItem[] = Object.entries(overrides)
    .filter(([key, entry]) => isSectionOverride(key, entry))
    .filter(([, entry]) => !entry.hidden)
    .map(([key, entry]) => {
      const section = entry as SectionBreakEntry;
      return {
        type: "section" as const,
        uid: key.startsWith("section:") ? key : `section:${key}`,
        label: section.label,
        order: section.order,
      };
    });

  const videoItems: GridVideoItem[] = streamVideos.map((video) => ({
    type: "video" as const,
    video,
  }));

  return [...videoItems, ...sectionItems].sort((a, b) => {
    const aOrder =
      a.type === "section"
        ? a.order
        : entryOrder(a.video.uid, overrides, placeholderOrder);
    const bOrder =
      b.type === "section"
        ? b.order
        : entryOrder(b.video.uid, overrides, placeholderOrder);
    const aHasOrder = aOrder !== undefined;
    const bHasOrder = bOrder !== undefined;

    if (aHasOrder && bHasOrder) {
      return aOrder - bOrder;
    }
    if (aHasOrder) {
      return -1;
    }
    if (bHasOrder) {
      return 1;
    }
    return 0;
  });
}

import PLACEHOLDERS from "./portfolio-placeholders.json";
import OVERRIDES from "./portfolio-overrides.json";

export { FEATURED_WORK_COUNT } from "./portfolio-constants";

export interface PortfolioVideo {
  uid: string;
  title: string;
  duration: number | null;
  thumbnailUrl: string;
  playbackUrl: string;
  width: number | null;
  height: number | null;
  orientation: "landscape" | "portrait";
  source: "stream" | "youtube";
  stats: { viewCount: number; likeCount: number } | null;
  youtubeId?: string;
  caption?: string;
  emmyBadge?: boolean;
  featured?: boolean;
  spotlight?: { meta: string; award?: string; paragraphs: string[] };
  loop?: boolean;
  autoplay?: boolean;
  /** True when the entry is listed before a Stream clip is attached. */
  placeholder?: boolean;
}

type OverrideEntry = {
  title: string;
  order: number;
  hidden?: boolean;
  thumbnailTime?: string | null;
  caption?: string;
  emmyBadge?: boolean;
  featured?: boolean;
  spotlight?: { meta: string; award?: string; paragraphs: string[] };
  loop?: boolean;
  autoplay?: boolean;
};

export interface YouTubeOverrideEntry {
  source: "youtube";
  youtubeId: string;
  title: string;
  order: number;
  hidden?: boolean;
  featured?: boolean;
  spotlight?: { meta: string; award?: string; paragraphs: string[] };
  loop?: boolean;
  autoplay?: boolean;
}

type AnyOverrideEntry = OverrideEntry | YouTubeOverrideEntry;

type PlaceholderEntry = {
  id: string;
  title: string;
  order: number;
  orientation: "landscape" | "portrait";
  caption?: string;
  emmyBadge?: boolean;
  hidden?: boolean;
};

const overrides = OVERRIDES as Record<string, AnyOverrideEntry>;
const placeholders = PLACEHOLDERS as PlaceholderEntry[];
const placeholderOrder = new Map(
  placeholders.map((entry) => [entry.id, entry.order]),
);

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

function youtubeIdFromOverride(
  key: string,
  entry: YouTubeOverrideEntry,
): string {
  if (entry.youtubeId) {
    return entry.youtubeId;
  }
  return key.startsWith("youtube:") ? key.slice("youtube:".length) : key;
}

function entryOrder(uid: string): number | undefined {
  return overrides[uid]?.order ?? placeholderOrder.get(uid);
}

export async function getYoutubeStats(
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
      const streamOverride =
        override && !isYouTubeOverride(video.uid, override)
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
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
        playbackUrl: `https://www.youtube.com/embed/${youtubeId}`,
        width: null,
        height: null,
        orientation: "landscape" as const,
        source: "youtube" as const,
        youtubeId,
        stats: youtubeStats.get(youtubeId) ?? null,
        featured: entry.featured ?? false,
        spotlight: entry.spotlight,
        loop: entry.loop ?? false,
        autoplay: entry.autoplay ?? false,
      };
    });

  return [...streamVideos, ...placeholderVideos, ...youtubeVideos].sort(
    (a, b) => {
      const aOrder = entryOrder(a.uid);
      const bOrder = entryOrder(b.uid);
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

export function buildPlaybackSrc(video: PortfolioVideo) {
  const params = new URLSearchParams();

  if (video.source === "youtube") {
    const youtubeId =
      video.youtubeId ??
      (video.uid.startsWith("youtube:")
        ? video.uid.slice("youtube:".length)
        : video.uid);
    if (video.autoplay) {
      params.set("autoplay", "1");
      params.set("mute", "1");
    }
    if (video.loop) {
      params.set("loop", "1");
      params.set("playlist", youtubeId);
    }
    const qs = params.toString();
    return qs ? `${video.playbackUrl}?${qs}` : video.playbackUrl;
  }

  if (video.autoplay) {
    params.set("autoplay", "true");
    params.set("muted", "true"); // browsers block unmuted autoplay, this is required for it to actually play
  }
  if (video.loop) {
    params.set("loop", "true");
  }
  const qs = params.toString();
  return qs ? `${video.playbackUrl}?${qs}` : video.playbackUrl;
}

export function formatCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) {
    return "0";
  }
  if (n < 1000) {
    return String(Math.round(n));
  }

  const compact = (value: number, suffix: string) =>
    `${value.toFixed(1).replace(/\.0$/, "")}${suffix}`;

  if (n < 1_000_000) {
    return compact(n / 1000, "K");
  }
  if (n < 1_000_000_000) {
    return compact(n / 1_000_000, "M");
  }
  return compact(n / 1_000_000_000, "B");
}

export function extractFeatured(videos: PortfolioVideo[]) {
  const featured = videos.filter((v) => v.featured);
  const rest = videos.filter((v) => !v.featured);
  return { featured, rest };
}

export function groupByOrientation(videos: PortfolioVideo[]) {
  return {
    landscape: videos.filter((v) => v.orientation === "landscape"),
    portrait: videos.filter((v) => v.orientation === "portrait"),
  };
}

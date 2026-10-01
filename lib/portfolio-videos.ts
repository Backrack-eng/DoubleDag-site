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
  caption?: string;
  emmyBadge?: boolean;
  featured?: boolean;
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
};

type PlaceholderEntry = {
  id: string;
  title: string;
  order: number;
  orientation: "landscape" | "portrait";
  caption?: string;
  emmyBadge?: boolean;
  hidden?: boolean;
};

const overrides = OVERRIDES as Record<string, OverrideEntry>;
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

function entryOrder(uid: string): number | undefined {
  return overrides[uid]?.order ?? placeholderOrder.get(uid);
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
      const baseThumbnailUrl = `https://videodelivery.net/${video.uid}/thumbnails/thumbnail.jpg`;
      const thumbnailUrl =
        override?.thumbnailTime === null
          ? baseThumbnailUrl
          : override?.thumbnailTime
            ? `${baseThumbnailUrl}?time=${override.thumbnailTime}`
            : orientation === "landscape"
              ? `${baseThumbnailUrl}?time=3s`
              : baseThumbnailUrl;

      return {
        uid: video.uid,
        title: override?.title ?? video.meta?.name ?? video.uid,
        duration: video.duration === -1 ? null : video.duration,
        thumbnailUrl,
        playbackUrl: `https://iframe.videodelivery.net/${video.uid}`,
        width,
        height,
        orientation,
        caption: override?.caption,
        emmyBadge: override?.emmyBadge ?? false,
        featured: override?.featured ?? false,
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
    caption: entry.caption,
    emmyBadge: entry.emmyBadge ?? false,
    featured: false,
    placeholder: true,
  }));

  return [...streamVideos, ...placeholderVideos].sort((a, b) => {
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
  });
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

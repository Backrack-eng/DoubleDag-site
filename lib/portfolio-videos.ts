import OVERRIDES from "./portfolio-overrides.json";

export interface PortfolioVideo {
  uid: string;
  title: string;
  duration: number | null;
  thumbnailUrl: string;
  playbackUrl: string;
  width: number | null;
  height: number | null;
  orientation: "landscape" | "portrait";
  emmyBadge?: boolean;
  featured?: boolean;
}

type OverrideEntry = {
  title: string;
  order: number;
  hidden?: boolean;
  thumbnailTime?: string | null;
  emmyBadge?: boolean;
  featured?: boolean;
};

const overrides = OVERRIDES as Record<string, OverrideEntry>;

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

  return data.result
    .filter((video) => video.status.state === "ready")
    .filter((video) => !overrides[video.uid]?.hidden)
    .sort((a, b) => {
      const aOrder = overrides[a.uid]?.order;
      const bOrder = overrides[b.uid]?.order;
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

      return Date.parse(b.created) - Date.parse(a.created);
    })
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
        emmyBadge: override?.emmyBadge ?? false,
        featured: override?.featured ?? false,
      };
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

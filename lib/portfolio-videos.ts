export interface PortfolioVideo {
  uid: string;
  title: string;
  duration: number | null;
  thumbnailUrl: string;
  playbackUrl: string;
  width: number | null;
  height: number | null;
  orientation: "landscape" | "portrait";
}

const OVERRIDES: Record<
  string,
  {
    title: string;
    order: number;
    hidden?: boolean;
    thumbnailTime?: string | null;
  }
> = {
  "066a9989e5e134d2816590ebf77751b8": {
    title: "Demo Reel 2023",
    order: 0,
    thumbnailTime: null,
  },
  "a42a57c872cd17d7e4da780d17a380dd": {
    title: "Mock and Roll — 30 Sec Trailer",
    order: 10,
  },
  "415cb57aea41d58299ed11870fd21e26": { title: "Reporting 911", order: 20 },
  "d3cad11639aa7927a4687d44a0dc12a3": { title: "The Banjo", order: 30 },
  "e421e6122b84e8f7b372676b9ba2bc5e": { title: "Mayan World", order: 40 },
  "cf532871a841fb0c63618f5deceaf514": {
    title: "Grills Gone Wild",
    order: 50,
    thumbnailTime: "11s",
  },
  "be6c7d79482614ebf509ff25f442789a": { title: "Going to the Devil", order: 60 },
  "ecdaa3539a4fc2ec8d262505700a05ba": {
    title: "Archaeological Mysteries — Promo",
    order: 70,
  },
  "7e7f780089fa702e5427fee2b5e011e1": {
    title: "Artificial Intelligence — Promo",
    order: 80,
  },
  "ddeb6d07f295cac1b2555f918c033444": {
    title: "Prop Firm Match",
    order: 90,
  }, // TODO: real title
  "390e589cee07f747aa6056dcd8713948": {
    title: "Double Dag Logo",
    order: 999,
    hidden: true,
  },
  "78ce0177456a85c04cada42dfeb24d5e": {
    title: "Mayan World (small)",
    order: 999,
    hidden: true,
  },
};

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
    .filter((video) => !OVERRIDES[video.uid]?.hidden)
    .sort((a, b) => {
      const aOrder = OVERRIDES[a.uid]?.order;
      const bOrder = OVERRIDES[b.uid]?.order;
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
      const override = OVERRIDES[video.uid];
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
      };
    });
}

export function groupByOrientation(videos: PortfolioVideo[]) {
  return {
    landscape: videos.filter((v) => v.orientation === "landscape"),
    portrait: videos.filter((v) => v.orientation === "portrait"),
  };
}

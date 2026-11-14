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
  /** Large violet Demo Reel player; at most one featured video. */
  mainReel?: boolean;
  spotlight?: { meta: string; award?: string; paragraphs: string[] };
  loop?: boolean;
  autoplay?: boolean;
  /** True when the entry is listed before a Stream clip is attached. */
  placeholder?: boolean;
}

export interface YouTubeOverrideEntry {
  source: "youtube";
  youtubeId: string;
  title: string;
  order: number;
  hidden?: boolean;
  featured?: boolean;
  mainReel?: boolean;
  spotlight?: { meta: string; award?: string; paragraphs: string[] };
  loop?: boolean;
  autoplay?: boolean;
  thumbnailOverrideUrl?: string;
}

export interface SectionBreakEntry {
  type: "section";
  label: string;
  order: number;
  hidden?: boolean;
}

export type GridVideoItem = {
  type: "video";
  video: PortfolioVideo;
};

export type GridSectionItem = {
  type: "section";
  uid: string;
  label: string;
  order: number;
};

export type PortfolioGridItem = GridVideoItem | GridSectionItem;

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

/** Playback URL after a user click — autoplay with sound (no mute). */
export function clickPlaybackSrc(video: PortfolioVideo) {
  if (video.source === "youtube") {
    const params = new URLSearchParams();
    params.set("autoplay", "1");
    if (video.loop) {
      const youtubeId =
        video.youtubeId ??
        (video.uid.startsWith("youtube:")
          ? video.uid.slice("youtube:".length)
          : video.uid);
      params.set("loop", "1");
      params.set("playlist", youtubeId);
    }
    return `${video.playbackUrl}?${params.toString()}`;
  }

  const base = buildPlaybackSrc({ ...video, autoplay: false });
  const join = base.includes("?") ? "&" : "?";
  return `${base}${join}autoplay=true`;
}

/** Stops inline ClickToPlayVideo iframes elsewhere on the page. */
export const PAUSE_INLINE_VIDEOS_EVENT = "doubledag:pause-inline-videos";

export function pauseInlineVideos() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(PAUSE_INLINE_VIDEOS_EVENT));
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

export function selectDemoReels(featured: PortfolioVideo[]) {
  const mainReel =
    featured.find((video) => video.mainReel) ??
    featured.find((video) => video.title.toLowerCase().includes("2023")) ??
    featured[0];
  const archiveReels = featured.filter((video) => video.uid !== mainReel?.uid);
  return { mainReel, archiveReels };
}

export function groupByOrientation(videos: PortfolioVideo[]) {
  return {
    landscape: videos.filter((v) => v.orientation === "landscape"),
    portrait: videos.filter((v) => v.orientation === "portrait"),
  };
}

/** Landscape grid items for Featured/Selected Work (excludes demo reels + portrait). */
export function getMainLandscapeGridItems(
  gridItems: PortfolioGridItem[],
  videos: PortfolioVideo[],
): PortfolioGridItem[] {
  const { featured, rest } = extractFeatured(videos);
  const streamRest = rest.filter((video) => video.source !== "youtube");
  const { portrait } = groupByOrientation(streamRest);
  const demoUids = new Set(featured.map((video) => video.uid));
  const portraitUids = new Set(portrait.map((video) => video.uid));

  return gridItems.filter((item) => {
    if (item.type === "section") {
      return true;
    }
    if (demoUids.has(item.video.uid) || portraitUids.has(item.video.uid)) {
      return false;
    }
    return item.video.orientation === "landscape";
  });
}

export function splitHighlightSelected(
  items: PortfolioGridItem[],
  count: number,
) {
  const highlight: PortfolioGridItem[] = [];
  const selected: PortfolioGridItem[] = [];
  let videoCount = 0;

  for (const item of items) {
    if (item.type === "section") {
      if (videoCount < count) {
        highlight.push(item);
      } else {
        selected.push(item);
      }
      continue;
    }

    if (videoCount < count) {
      highlight.push(item);
      videoCount += 1;
    } else {
      selected.push(item);
    }
  }

  return { highlight, selected };
}

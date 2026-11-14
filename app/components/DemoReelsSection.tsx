"use client";

import { useCallback, useState } from "react";
import {
  pauseInlineVideos,
  type PortfolioVideo,
} from "../../lib/portfolio-videos";
import { ClickToPlayVideo } from "../portfolio/PortfolioGrid";
import { VideoLightbox } from "./VideoLightbox";

type DemoReelsSectionProps = {
  mainReel: PortfolioVideo;
  archiveReels: PortfolioVideo[];
  /** Extra top border / padding variants for page context. */
  className?: string;
};

function ArchiveReelCard({
  reel,
  onOpen,
}: {
  reel: PortfolioVideo;
  onOpen: (reel: PortfolioVideo, trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className="w-full max-w-sm shrink-0 sm:w-96">
      <div className="featured-reel-turquoise">
        <div className="featured-reel-turquoise__ring">
          <div className="featured-reel-turquoise__frame">
            <div className="featured-reel-turquoise__media">
              <button
                type="button"
                onClick={(event) => onOpen(reel, event.currentTarget)}
                aria-label={`Play ${reel.title}`}
                className="absolute inset-0"
              >
                <img
                  src={reel.thumbnailUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-contain"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 transition duration-300 hover:bg-black/70 sm:h-16 sm:w-16">
                    <span
                      className="ml-1 h-0 w-0 border-y-8 border-y-transparent border-l-[14px] border-l-white"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-neutral-400 sm:text-sm">
        {reel.title}
      </p>
    </div>
  );
}

export function DemoReelsSection({
  mainReel,
  archiveReels,
  className = "py-16",
}: DemoReelsSectionProps) {
  const [lightboxVideo, setLightboxVideo] = useState<PortfolioVideo | null>(
    null,
  );
  const [returnFocusTo, setReturnFocusTo] = useState<HTMLElement | null>(null);

  const openLightbox = useCallback(
    (reel: PortfolioVideo, trigger: HTMLButtonElement) => {
      pauseInlineVideos();
      setReturnFocusTo(trigger);
      setLightboxVideo(reel);
    },
    [],
  );

  const closeLightbox = useCallback(() => {
    setLightboxVideo(null);
  }, []);

  return (
    <section className={className}>
      <p className="mb-6 text-sm uppercase tracking-[0.3em] text-violet-300/80">
        Demo Reel
      </p>

      <div className="featured-reel mx-1 my-2 sm:mx-3 sm:my-4">
        <div className="featured-reel__ring">
          <div className="featured-reel__frame">
            <div className="featured-reel__media">
              <ClickToPlayVideo video={mainReel} />
            </div>
          </div>
        </div>
      </div>
      <p className="mt-4 px-1 text-sm font-medium text-neutral-200 sm:px-3">
        {mainReel.title}
      </p>

      {archiveReels.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-6 sm:gap-8">
          {archiveReels.map((reel) => (
            <ArchiveReelCard key={reel.uid} reel={reel} onOpen={openLightbox} />
          ))}
        </div>
      )}

      {lightboxVideo && (
        <VideoLightbox
          video={lightboxVideo}
          onClose={closeLightbox}
          returnFocusTo={returnFocusTo}
        />
      )}
    </section>
  );
}

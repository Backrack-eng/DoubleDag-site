"use client";

import type { PortfolioVideo } from "../../lib/portfolio-videos";
import { ClickToPlayVideo } from "../portfolio/PortfolioGrid";

type DemoReelsSectionProps = {
  mainReel: PortfolioVideo;
  archiveReels: PortfolioVideo[];
  /** Extra top border / padding variants for page context. */
  className?: string;
};

export function DemoReelsSection({
  mainReel,
  archiveReels,
  className = "py-16",
}: DemoReelsSectionProps) {
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
        <div className="mt-10 flex flex-wrap gap-6">
          {archiveReels.map((reel) => (
            <div key={reel.uid} className="max-w-xs">
              <div className="featured-reel-turquoise mx-1 my-2 sm:mx-3 sm:my-4">
                <div className="featured-reel-turquoise__ring">
                  <div className="featured-reel-turquoise__frame">
                    <div className="featured-reel-turquoise__media">
                      <ClickToPlayVideo video={reel} />
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 px-1 text-xs font-medium text-neutral-400 sm:px-3">
                {reel.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

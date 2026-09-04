import type { Metadata } from "next";
import {
  extractFeatured,
  getPortfolioVideos,
  groupByOrientation,
} from "../../lib/portfolio-videos";
import PortfolioGrid, { ClickToPlayVideo } from "./PortfolioGrid";

export const metadata: Metadata = {
  title: "Video Portfolio | Double Dag Productions",
  description:
    "A curated collection of video editing and post-production work by Ben Bacharach-White.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PortfolioPage() {
  const videos = await getPortfolioVideos();
  const { featured, rest } = extractFeatured(videos);
  const { landscape, portrait } = groupByOrientation(rest);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Portfolio
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Selected Work
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300">
            A curated collection of video editing and post-production work —
            documentary, branded, and cinematic pieces. Click a thumbnail to
            play.
          </p>
        </section>

        {featured.length > 0 && (
          <section className="mb-16">
            <p className="mb-6 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Demo Reel
            </p>
            <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 -mx-6 px-6 sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
              {featured.map((video) => (
                <div
                  key={video.uid}
                  className="w-[85vw] shrink-0 snap-center sm:w-[520px]"
                >
                  <div className="featured-reel group mx-1 my-2 sm:mx-3 sm:my-4">
                    <div className="featured-reel__ring">
                      <div className="featured-reel__frame">
                        <div className="featured-reel__media">
                          <ClickToPlayVideo video={video} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 px-1 text-sm font-medium text-neutral-200 sm:px-3">
                    {video.title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <PortfolioGrid videos={landscape} />

        {portrait.length > 0 && (
          <section className="mt-16 border-t border-white/10 pt-14">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Social Cuts
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Social / Vertical
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
              Short-form and vertical cuts made for Reels, TikTok, and Shorts.
            </p>
            <div className="mt-10">
              <PortfolioGrid videos={portrait} variant="portrait" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

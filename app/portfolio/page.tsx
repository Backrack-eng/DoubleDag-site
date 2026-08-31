import type { Metadata } from "next";
import {
  getPortfolioVideos,
  groupByOrientation,
} from "../../lib/portfolio-videos";
import PortfolioGrid from "./PortfolioGrid";

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
  const { landscape, portrait } = groupByOrientation(videos);

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

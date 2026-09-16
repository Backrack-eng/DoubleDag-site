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

  const mainReel =
    featured.find((v) => v.title.toLowerCase().includes("2023")) ??
    featured[0];
  const archiveReel = featured.find((v) => v.uid !== mainReel?.uid);

  const highlightWork = landscape.slice(0, 3);
  const selectedWork = landscape.slice(3);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        {/* Hero */}
        <section className="border-b border-white/10 pb-16">
          <div className="w-40 sm:w-48 lg:w-56">
            <img
              src="/Portfolio_avatar.png"
              alt="Ben Bacharach-White"
              className="hero-avatar w-full h-auto select-none"
            />
          </div>

          <p className="hero-eyebrow-shadow relative z-10 -mt-8 sm:-mt-10 mb-4 text-sm font-medium uppercase tracking-[0.3em]">
            Senior Editor &amp; Creative Technologist · Double Dag Productions, Petersburg, VA
          </p>

          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            24+ years of editing and post-production for documentary, educational, and branded storytelling.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
            Emmy Award-winning editorial work on Weaving Nature (PBS American Masters), a Webby Award for John Lewis: Witness to History, and three Telly Awards, including a Gold Telly for Urban Legends Explained, just to name a few. Clients include PBS, Smithsonian, and National Geographic.
          </p>

          <a
            href="mailto:hello@doubledagproductions.com"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:opacity-90"
          >
            Get in Touch
          </a>
        </section>

        {/* Demo reels */}
        {mainReel && (
          <section className="py-16">
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

            {archiveReel && (
              <div className="mt-10 max-w-xs">
                <div className="featured-reel-turquoise mx-1 my-2 sm:mx-3 sm:my-4">
                  <div className="featured-reel-turquoise__ring">
                    <div className="featured-reel-turquoise__frame">
                      <div className="featured-reel-turquoise__media">
                        <ClickToPlayVideo video={archiveReel} />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-3 px-1 text-xs font-medium text-neutral-400 sm:px-3">
                  {archiveReel.title}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Established */}
        <section className="grid gap-8 border-t border-white/10 py-16 sm:grid-cols-[auto_1fr] sm:gap-16">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Established
            </p>
            <p className="mt-4 text-6xl font-semibold tracking-tight text-neutral-100 sm:text-7xl">
              2005
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              A seasoned editor with a wide creative range.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-300">
              Double Dag Productions is my creative home, founded in 2005. I spent 14 years leading edit teams, working on The Great Courses, PBS, Smithsonian and National Geographic projects, and represented companies at NAB to evaluate emerging production and AI tools. My work spans documentary, educational, and branded storytelling, built on strong editorial instincts, technical polish, and tools I&apos;ve built myself, including AutoThirds and Thinkonaut.
            </p>
          </div>
        </section>

        {/* Featured documentary work */}
        {highlightWork.length > 0 && (
          <section className="border-t border-white/10 py-16">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Featured Work
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Emmy-recognized editing across documentary and series work
            </h2>
            <div className="mt-10">
              <PortfolioGrid videos={highlightWork} />
            </div>
          </section>
        )}

        {/* Selected work grid */}
        {selectedWork.length > 0 && (
          <section className="border-t border-white/10 py-16">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Selected Work
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Additional edits, promos, and full-length projects
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-300">
              Editorial and graphics work by Ben Bacharach-White across branded, educational, and feature-length projects for Double Dag Productions and past studio engagements.
            </p>
            <div className="mt-10">
              <PortfolioGrid videos={selectedWork} />
            </div>
          </section>
        )}

        {/* Social / vertical */}
        {portrait.length > 0 && (
          <section className="mt-4 border-t border-white/10 pt-16">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Social Cuts
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Social / Vertical
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
              Short-form and vertical cuts made for Reels, TikTok, and
              Shorts.
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

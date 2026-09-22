import type { Metadata } from "next";
import Link from "next/link";
import GenreAccordion from "./GenreAccordion";

export const metadata: Metadata = {
  title: "Double Dag Productions | Pricing by Genre",
  description:
    "Editing rates by genre for YouTube, podcasts, social shorts, documentary, corporate, and comedy. Emmy-recognized editor Ben Bacharach-White — starting points tailored to your project.",
};

export default function ContentPricingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Double Dag Productions
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Editing Rates, By Genre
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            Every kind of content cuts different, so the price should too. Pick
            your format below to see how it breaks down.
          </p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-400">
            20+ years cutting documentaries, docuseries, and branded work for
            PBS, Smithsonian, and National Geographic. Emmy-recognized.
          </p>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <GenreAccordion />
        </section>

        <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/40 via-neutral-950 to-neutral-950 p-10 sm:p-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Let&apos;s talk about the next project.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            Send me what you have got and I will turn it into a real quote. The
            numbers above are starting points, not the final word, final price
            depends on scope and footage.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="mailto:hello@doubledagproductions.com?subject=Pricing%20Inquiry"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
            >
              Email Me
            </a>
            <Link
              href="/filmography"
              className="inline-flex h-12 items-center justify-center px-2 text-sm font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline sm:px-4"
            >
              View Full Filmography
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

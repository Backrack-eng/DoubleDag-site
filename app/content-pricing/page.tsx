import type { Metadata } from "next";
import Link from "next/link";
import { loadContent } from "../../lib/content/load-content";
import GenreAccordion, { type Genre } from "./GenreAccordion";

type Hideable = { hidden?: boolean };

type ContentPricingData = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    heading: string;
    intro: string;
    note: string;
  };
  genres: Genre[];
  cta: {
    heading: string;
    body: string;
    buttons: Array<
      Hideable & {
        label: string;
        href: string;
        style: "primary" | "secondary";
      }
    >;
  };
};

function visible<T extends Hideable>(items: T[]): T[] {
  return items.filter((item) => !item.hidden);
}

export function generateMetadata(): Metadata {
  const content = loadContent<ContentPricingData>("content-pricing");
  return {
    title: content.meta.title,
    description: content.meta.description,
  };
}

export default function ContentPricingPage() {
  const content = loadContent<ContentPricingData>("content-pricing");
  const genres = visible(content.genres);
  const ctaButtons = visible(content.cta.buttons);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.hero.eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {content.hero.heading}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            {content.hero.intro}
          </p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-400">
            {content.hero.note}
          </p>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <GenreAccordion genres={genres} />
        </section>

        <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/40 via-neutral-950 to-neutral-950 p-10 sm:p-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {content.cta.heading}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            {content.cta.body}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            {ctaButtons.map((button) =>
              button.style === "primary" ? (
                <a
                  key={button.label}
                  href={button.href}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
                >
                  {button.label}
                </a>
              ) : button.href.startsWith("mailto:") ||
                button.href.startsWith("http") ? (
                <a
                  key={button.label}
                  href={button.href}
                  className="inline-flex h-12 items-center justify-center px-2 text-sm font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline sm:px-4"
                >
                  {button.label}
                </a>
              ) : (
                <Link
                  key={button.label}
                  href={button.href}
                  className="inline-flex h-12 items-center justify-center px-2 text-sm font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline sm:px-4"
                >
                  {button.label}
                </Link>
              ),
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

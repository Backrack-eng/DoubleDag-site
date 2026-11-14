import type { Metadata } from "next";
import { loadContent } from "../../lib/content/load-content";
import { getPortfolioVideos } from "../../lib/portfolio-data";
import {
  extractFeatured,
  groupByOrientation,
} from "../../lib/portfolio-videos";
import PortfolioGrid from "../portfolio/PortfolioGrid";

/** Revalidate Stream-backed portrait list hourly (ISR). No per-request render. */
export const revalidate = 3600;

type Hideable = { hidden?: boolean };

type CardItem = Hideable & {
  title: string;
  body: string;
};

type CtaButton = Hideable & {
  label: string;
  href: string;
  style: "primary" | "secondary";
};

type FaqItem = Hideable & {
  question: string;
  answer: string;
};

type CreatorsData = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    heading: string;
    lead: string;
    intro: string;
    buttons: CtaButton[];
  };
  howItWorks: {
    id: string;
    eyebrow: string;
    heading: string;
    steps: CardItem[];
  };
  audience: {
    eyebrow: string;
    heading: string;
    items: CardItem[];
  };
  why: {
    eyebrow: string;
    heading: string;
    body: string;
  };
  packages: {
    eyebrow: string;
    heading: string;
    items: CardItem[];
    pricingButton: { label: string; href: string };
    retainerNote: {
      before: string;
      linkLabel: string;
      linkHref: string;
      after: string;
    };
  };
  socialCuts: Hideable & {
    eyebrow: string;
    heading: string;
    intro: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: FaqItem[];
  };
  cta: {
    eyebrow: string;
    heading: string;
    body: string;
    buttons: CtaButton[];
  };
};

function visible<T extends Hideable>(items: T[]): T[] {
  return items.filter((item) => !item.hidden);
}

function renderButtons(buttons: CtaButton[]) {
  return buttons.map((button) =>
    button.style === "primary" ? (
      <a
        key={button.label}
        href={button.href}
        className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
      >
        {button.label}
      </a>
    ) : (
      <a
        key={button.label}
        href={button.href}
        className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
      >
        {button.label}
      </a>
    ),
  );
}

export function generateMetadata(): Metadata {
  const content = loadContent<CreatorsData>("creators");
  return {
    title: content.meta.title,
    description: content.meta.description,
  };
}

export default async function CreatorsPage() {
  const content = loadContent<CreatorsData>("creators");
  const heroButtons = visible(content.hero.buttons);
  const steps = visible(content.howItWorks.steps);
  const audience = visible(content.audience.items);
  const packages = visible(content.packages.items);
  const faqs = visible(content.faq.items);
  const ctaButtons = visible(content.cta.buttons);
  const note = content.packages.retainerNote;
  const socialCuts = content.socialCuts;

  let portrait: Awaited<ReturnType<typeof getPortfolioVideos>> = [];
  try {
    const videos = await getPortfolioVideos();
    const { rest } = extractFeatured(videos);
    const streamRest = rest.filter((video) => video.source !== "youtube");
    portrait = groupByOrientation(streamRest).portrait;
  } catch {
    // Build/runtime without Stream access: omit the section rather than failing the page.
    portrait = [];
  }
  const showSocialCuts = !socialCuts.hidden && portrait.length > 0;

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
          <p className="mt-6 max-w-3xl text-xl font-medium leading-8 text-neutral-200 sm:text-2xl">
            {content.hero.lead}
          </p>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            {content.hero.intro}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {renderButtons(heroButtons)}
          </div>
        </section>

        <section
          id={content.howItWorks.id}
          className="mb-14 border-t border-white/10 pt-14"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.howItWorks.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.howItWorks.heading}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.audience.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.audience.heading}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {audience.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.why.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.why.heading}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            {content.why.body}
          </p>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.packages.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.packages.heading}
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {packages.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <a
              href={content.packages.pricingButton.href}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
            >
              {content.packages.pricingButton.label}
            </a>
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-7 text-neutral-400">
            {note.before}
            <a
              href={note.linkHref}
              className="font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
            >
              {note.linkLabel}
            </a>
            {note.after}
          </p>
        </section>

        {showSocialCuts && (
          <section className="mb-14 border-t border-white/10 pt-14">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              {socialCuts.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {socialCuts.heading}
            </h2>
            {socialCuts.intro.trim() && (
              <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
                {socialCuts.intro}
              </p>
            )}
            <div className="mt-10">
              <PortfolioGrid
                videos={portrait}
                variant="portrait"
                gridClassName="flex flex-wrap justify-center gap-6"
                itemClassName="w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)] lg:w-[calc((100%-6rem)/5)]"
              />
            </div>
          </section>
        )}

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.faq.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.faq.heading}
          </h2>
          <div className="mt-10 space-y-6">
            {faqs.map((item) => (
              <div
                key={item.question}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
              >
                <h3 className="text-lg font-semibold text-white">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/40 via-neutral-950 to-neutral-950 p-10 sm:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.cta.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {content.cta.heading}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            {content.cta.body}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {renderButtons(ctaButtons)}
          </div>
        </section>
      </main>
    </div>
  );
}

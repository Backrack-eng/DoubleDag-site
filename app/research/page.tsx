import type { Metadata } from "next";
import Link from "next/link";
import { loadContent } from "../../lib/content/load-content";

type Hideable = { hidden?: boolean };

type TextItem = Hideable & { text: string };

type CardItem = Hideable & {
  title: string;
  body: string;
};

type CtaButton = Hideable & {
  label: string;
  href: string;
  style: "primary" | "secondary";
};

type ResearchData = {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogImageAlt: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    lead: string;
    intro: string;
    note: string;
  };
  offerings: {
    eyebrow: string;
    heading: string;
    items: CardItem[];
  };
  expertise: {
    eyebrow: string;
    heading: string;
    body: string;
    tags: TextItem[];
  };
  whyItMatters: {
    eyebrow: string;
    heading: string;
    paragraphs: TextItem[];
    formats: {
      eyebrow: string;
      items: TextItem[];
    };
  };
  collaboration: {
    eyebrow: string;
    heading: string;
    body: string;
    audiences: CardItem[];
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

export function generateMetadata(): Metadata {
  const content = loadContent<ResearchData>("research");
  return {
    title: content.meta.title,
    description: content.meta.description,
    openGraph: {
      title: content.meta.ogTitle,
      description: content.meta.ogDescription,
      images: [
        {
          url: content.meta.ogImage,
          width: 1200,
          height: 630,
          alt: content.meta.ogImageAlt,
        },
      ],
    },
  };
}

export default function ResearchPage() {
  const content = loadContent<ResearchData>("research");
  const offerings = visible(content.offerings.items);
  const tags = visible(content.expertise.tags);
  const paragraphs = visible(content.whyItMatters.paragraphs);
  const formats = visible(content.whyItMatters.formats.items);
  const audiences = visible(content.collaboration.audiences);
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
          <p className="mt-8 max-w-3xl text-xl font-medium leading-8 text-neutral-200 sm:text-2xl">
            {content.hero.lead}
          </p>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300">
            {content.hero.intro}
          </p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            {content.hero.note}
          </p>
        </section>

        <div className="mb-16 h-px w-full bg-gradient-to-r from-violet-500/0 via-violet-400/40 to-violet-500/0" />

        <section className="mb-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.offerings.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.offerings.heading}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {offerings.map((item) => (
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

        <section className="mb-14 rounded-3xl border border-violet-400/10 bg-white/5 p-8 sm:p-10">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.expertise.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {content.expertise.heading}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            {content.expertise.body}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag.text}
                className="rounded-full border border-violet-400/20 bg-neutral-900/70 px-4 py-2 text-sm font-medium text-neutral-200 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10"
              >
                {tag.text}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 border-t border-white/10 pt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              {content.whyItMatters.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {content.whyItMatters.heading}
            </h2>
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph.text}
                className={
                  index === 0
                    ? "mt-6 text-base leading-8 text-neutral-300"
                    : "mt-4 text-base leading-8 text-neutral-300"
                }
              >
                {paragraph.text}
              </p>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
              {content.whyItMatters.formats.eyebrow}
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-neutral-300">
              {formats.map((item) => (
                <li key={item.text}>{item.text}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14 rounded-3xl border border-violet-400/10 bg-white/5 p-8 sm:p-10">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.collaboration.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {content.collaboration.heading}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            {content.collaboration.body}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {audiences.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {item.body}
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
                button.href.startsWith("http") ||
                button.href.startsWith("#") ? (
                <a
                  key={button.label}
                  href={button.href}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {button.label}
                </a>
              ) : (
                <Link
                  key={button.label}
                  href={button.href}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
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

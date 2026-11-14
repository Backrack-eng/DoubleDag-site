import type { Metadata } from "next";
import { loadContent } from "../../lib/content/load-content";

type Hideable = { hidden?: boolean };

type ToolButton = {
  label: string;
  href: string;
  style: "primary" | "secondary";
};

type ToolItem = Hideable & {
  title: string;
  body: string;
  note?: string;
  accent?: boolean;
  fullWidth?: boolean;
  button?: ToolButton;
};

type CtaButton = Hideable & {
  label: string;
  href: string;
  style: "primary" | "secondary";
};

type CreativeTechnologistData = {
  meta: {
    title: string;
    description: string;
    ogImage: string;
    ogImageAlt: string;
  };
  hero: {
    eyebrow: string;
    heading: string;
    intro: string;
  };
  premiereTools: {
    eyebrow: string;
    heading: string;
    items: ToolItem[];
  };
  creatorTools: {
    eyebrow: string;
    heading: string;
    items: ToolItem[];
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

function ToolCard({ tool }: { tool: ToolItem }) {
  return (
    <div
      className={
        tool.accent
          ? "group rounded-3xl border border-violet-400/15 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/10"
          : "group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
      }
    >
      <h3 className="text-xl font-semibold text-white">{tool.title}</h3>
      <p
        className={
          tool.fullWidth || tool.button
            ? "mt-4 max-w-3xl text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200"
            : "mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200"
        }
      >
        {tool.body}
      </p>
      {tool.note && (
        <p className="mt-4 text-xs uppercase tracking-widest text-neutral-500">
          {tool.note}
        </p>
      )}
      {tool.button &&
        (tool.button.style === "primary" ? (
          <a
            href={tool.button.href}
            target={tool.button.href.startsWith("http") ? "_blank" : undefined}
            rel={
              tool.button.href.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
          >
            {tool.button.label}
          </a>
        ) : (
          <a
            href={tool.button.href}
            target={tool.button.href.startsWith("http") ? "_blank" : undefined}
            rel={
              tool.button.href.startsWith("http")
                ? "noopener noreferrer"
                : undefined
            }
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
          >
            {tool.button.label}
          </a>
        ))}
    </div>
  );
}

export function generateMetadata(): Metadata {
  const content = loadContent<CreativeTechnologistData>(
    "creative-technologist",
  );
  return {
    title: content.meta.title,
    description: content.meta.description,
    openGraph: {
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

export default function CreativeTechnologistPage() {
  const content = loadContent<CreativeTechnologistData>(
    "creative-technologist",
  );
  const premiereTools = visible(content.premiereTools.items);
  const gridTools = premiereTools.filter((tool) => !tool.fullWidth);
  const featuredTools = premiereTools.filter((tool) => tool.fullWidth);
  const creatorTools = visible(content.creatorTools.items);
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
        </section>

        <div className="mb-16 h-px w-full bg-gradient-to-r from-violet-500/0 via-violet-400/40 to-violet-500/0" />

        <section className="mb-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.premiereTools.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.premiereTools.heading}
          </h2>
          {gridTools.length > 0 && (
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {gridTools.map((tool) => (
                <ToolCard key={tool.title} tool={tool} />
              ))}
            </div>
          )}
          {featuredTools.map((tool) => (
            <div key={tool.title} className="mt-6">
              <ToolCard tool={tool} />
            </div>
          ))}
        </section>

        <section className="mb-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.creatorTools.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {content.creatorTools.heading}
          </h2>
          <div className="mt-10 space-y-6">
            {creatorTools.map((tool) => (
              <ToolCard key={tool.title} tool={tool} />
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
          <div className="mt-10">
            {ctaButtons.map((button) => (
              <a
                key={button.label}
                href={button.href}
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
              >
                {button.label}
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

import Link from "next/link";
import { connection } from "next/server";
import { loadContent } from "../lib/content/load-content";
import {
  loadHomeFeatured,
  resolveHomeFeaturedVideos,
} from "../lib/home-featured";
import { getPortfolioVideos } from "../lib/portfolio-data";
import {
  extractFeatured,
  selectDemoReels,
} from "../lib/portfolio-videos";
import { DemoReelsSection } from "./components/DemoReelsSection";
import { HomeFeaturedGrid } from "./components/HomeFeaturedGrid";
import { PhotographyScroller } from "./components/PhotographyScroller";

type Hideable = { hidden?: boolean };

type CtaButton = Hideable & {
  label: string;
  href: string;
  style: "primary" | "secondary";
  external?: boolean;
};

type TextItem = Hideable & { text: string };

type ExperienceItem = Hideable & {
  eyebrow: string;
  heading: string;
  body: string;
};

type SelectedItem = Hideable & {
  title: string;
  body: string;
};

type HomeData = {
  hero: {
    eyebrow: string;
    heading: string;
    intro: string;
    buttons: CtaButton[];
  };
  featuredWork: {
    eyebrow: string;
  };
  experience: {
    items: ExperienceItem[];
  };
  about: {
    eyebrow: string;
    heading: string;
    paragraphs: TextItem[];
    note: {
      before: string;
      pricingLabel: string;
      pricingHref: string;
      middle: string;
      researchLabel: string;
      researchHref: string;
      after: string;
    };
    focus: {
      eyebrow: string;
      items: TextItem[];
    };
  };
  selectedWork: {
    eyebrow: string;
    items: SelectedItem[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    body: string;
    buttons: CtaButton[];
    footnote: {
      before: string;
      linkLabel: string;
      linkHref: string;
      after: string;
    };
  };
  photography: {
    caption: string;
  };
};

function visible<T extends Hideable>(items: T[]): T[] {
  return items.filter((item) => !item.hidden);
}

function renderButtons(buttons: CtaButton[]) {
  return buttons.map((button) => {
    const className =
      button.style === "primary"
        ? "inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:opacity-90"
        : "inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10";

    if (
      button.external ||
      button.href.startsWith("mailto:") ||
      button.href.startsWith("http") ||
      button.href.startsWith("#")
    ) {
      return (
        <a
          key={button.label}
          href={button.href}
          className={className}
          target={button.external ? "_blank" : undefined}
          rel={button.external ? "noopener noreferrer" : undefined}
        >
          {button.label}
        </a>
      );
    }

    return (
      <Link key={button.label} href={button.href} className={className}>
        {button.label}
      </Link>
    );
  });
}

export default async function Home() {
  await connection();
  const content = loadContent<HomeData>("home");
  const videos = await getPortfolioVideos();
  const { featured } = extractFeatured(videos);
  const { mainReel, archiveReels } = selectDemoReels(featured);
  const homeFeaturedVideos = resolveHomeFeaturedVideos(
    loadHomeFeatured(),
    videos,
  );

  const heroButtons = visible(content.hero.buttons);
  const experience = visible(content.experience.items);
  const aboutParagraphs = visible(content.about.paragraphs);
  const focusItems = visible(content.about.focus.items);
  const selectedWork = visible(content.selectedWork.items);
  const contactButtons = visible(content.contact.buttons);
  const note = content.about.note;
  const footnote = content.contact.footnote;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="flex min-h-[70vh] flex-col justify-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.hero.eyebrow}
          </p>

          <h1 className="max-w-5xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            {content.hero.heading}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            {content.hero.intro}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {renderButtons(heroButtons)}
          </div>
        </section>

        {mainReel && (
          <DemoReelsSection
            mainReel={mainReel}
            archiveReels={archiveReels}
            className="border-t border-white/10 py-14"
          />
        )}

        {homeFeaturedVideos.length > 0 && (
          <section className="border-t border-white/10 py-14">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              {content.featuredWork.eyebrow}
            </p>
            <div className="mt-10">
              <HomeFeaturedGrid videos={homeFeaturedVideos} />
            </div>
          </section>
        )}

        <section className="grid gap-6 border-t border-white/10 py-14 md:grid-cols-3">
          {experience.map((item) => (
            <div
              key={item.heading}
              className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
                {item.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold">{item.heading}</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                {item.body}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-8 py-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              {content.about.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {content.about.heading}
            </h2>
            {aboutParagraphs.map((paragraph, index) => (
              <p
                key={paragraph.text}
                className={
                  index === 0
                    ? "mt-6 max-w-3xl text-base leading-8 text-neutral-300"
                    : "mt-4 max-w-3xl text-base leading-8 text-neutral-300"
                }
              >
                {paragraph.text}
              </p>
            ))}
            <p className="mt-6 text-sm text-neutral-400">
              {note.before}
              <a
                href={note.pricingHref}
                className="font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
              >
                {note.pricingLabel}
              </a>
              {note.middle}
              <Link
                href={note.researchHref}
                className="font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
              >
                {note.researchLabel}
              </Link>
              {note.after}
            </p>
          </div>

          <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
              {content.about.focus.eyebrow}
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
              {focusItems.map((item) => (
                <li key={item.text}>{item.text}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {content.selectedWork.eyebrow}
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {selectedWork.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              {content.contact.eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {content.contact.heading}
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-300">
              {content.contact.body}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              {renderButtons(contactButtons)}
            </div>

            <p className="mt-8 text-sm text-neutral-500">
              {footnote.before}
              <a
                href={footnote.linkHref}
                className="transition hover:text-violet-400"
              >
                {footnote.linkLabel}
              </a>
              {footnote.after}
            </p>
          </div>
        </section>
      </main>

      <section className="border-t border-white/10 pb-16 pt-10">
        <p className="mb-6 text-center text-sm text-neutral-400">
          {content.photography.caption}
        </p>
        <PhotographyScroller />
      </section>
    </div>
  );
}

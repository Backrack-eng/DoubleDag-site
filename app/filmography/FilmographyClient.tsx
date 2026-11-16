"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CollapsibleCaption } from "../components/CollapsibleCaption";
import { buildPlaybackSrc, type PortfolioVideo } from "../../lib/portfolio-videos";

export type TextPart = {
  text: string;
  emphasis?: "strong" | "violet" | "white";
};

export type GalleryImageItem = {
  src: string;
  alt: string;
};

export type CtaButton = {
  label: string;
  href: string;
  style: "primary" | "secondary";
  external?: boolean;
};

export type FilmographyClientProps = {
  hero: {
    eyebrow: string;
    heading: string;
    introParts: TextPart[];
    planningNote: {
      before: string;
      pricingLabel: string;
      pricingHref: string;
      middle: string;
      researchLabel: string;
      researchHref: string;
      after: string;
    };
  };
  reelUid: string;
  reelLabel: string;
  reelTitle: string;
  reelDescription: string;
  reelThumbnailTime?: string | null;
  selectedSeries: {
    heading: string;
    introParts: TextPart[];
    columns: Array<{
      title: string;
      items: Array<{ text: string }>;
    }>;
  };
  documentary: {
    heading: string;
    introParts: TextPart[];
    cards: Array<{
      featured?: boolean;
      badge?: string;
      title: string;
      titleSemibold?: boolean;
      body: string;
    }>;
  };
  youtube: {
    heading: string;
    introParts: TextPart[];
    body: string;
    cards: Array<{ title: string; body: string }>;
  };
  featureFilm: {
    heading: string;
    introParts: TextPart[];
    title: string;
    bodyParts: TextPart[];
  };
  emmyVideoSrc: string;
  behindTheScenes: {
    eyebrow: string;
    heading: string;
    items: GalleryImageItem[];
  };
  cta: {
    eyebrow: string;
    heading: string;
    body: string;
    buttons: CtaButton[];
  };
};

function renderParts(parts: TextPart[]) {
  return parts.map((part, index) => {
    if (part.emphasis === "violet") {
      return (
        <strong key={index} className="text-violet-200">
          {part.text}
        </strong>
      );
    }
    if (part.emphasis === "white") {
      return (
        <strong key={index} className="text-white">
          {part.text}
        </strong>
      );
    }
    if (part.emphasis === "strong") {
      return <strong key={index}>{part.text}</strong>;
    }
    return <span key={index}>{part.text}</span>;
  });
}

function reelPosterUrl(uid: string, thumbnailTime?: string | null): string {
  const base = `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg`;
  if (thumbnailTime === null) {
    return base;
  }
  if (typeof thumbnailTime === "string" && thumbnailTime.trim()) {
    return `${base}?time=${thumbnailTime.trim()}`;
  }
  return `${base}?time=3s`;
}

function streamReelSrc(
  uid: string,
  title: string,
  thumbnailTime?: string | null,
): string {
  const video: PortfolioVideo = {
    uid,
    title,
    duration: null,
    thumbnailUrl: "",
    playbackUrl: `https://iframe.videodelivery.net/${uid}`,
    width: null,
    height: null,
    orientation: "landscape",
    source: "stream",
    stats: null,
  };
  const base = buildPlaybackSrc(video);
  const poster = reelPosterUrl(uid, thumbnailTime);
  const join = base.includes("?") ? "&" : "?";
  return `${base}${join}poster=${encodeURIComponent(poster)}`;
}

function buttonClass(style: CtaButton["style"]) {
  return style === "primary"
    ? "inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:opacity-90"
    : "inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10";
}

export default function FilmographyClient({
  hero,
  reelUid,
  reelLabel,
  reelTitle,
  reelDescription,
  reelThumbnailTime,
  selectedSeries,
  documentary,
  youtube,
  featureFilm,
  emmyVideoSrc,
  behindTheScenes,
  cta,
}: FilmographyClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const galleryItems = behindTheScenes.items;
  const showReel = reelUid.trim().length > 0;
  const note = hero.planningNote;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      if (event.key === "Escape") {
        setLightboxIndex(null);
      } else if (event.key === "ArrowRight") {
        setLightboxIndex((current) => {
          if (current === null) return null;
          return current === galleryItems.length - 1 ? 0 : current + 1;
        });
      } else if (event.key === "ArrowLeft") {
        setLightboxIndex((current) => {
          if (current === null) return null;
          return current === 0 ? galleryItems.length - 1 : current - 1;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, galleryItems.length]);

  useEffect(() => {
    if (lightboxIndex !== null || galleryItems.length === 0) return;

    const timer = window.setInterval(() => {
      setSlideIndex((current) =>
        current === galleryItems.length - 1 ? 0 : current + 1,
      );
    }, 10000);

    return () => window.clearInterval(timer);
  }, [lightboxIndex, galleryItems.length]);

  useEffect(() => {
    if (galleryItems.length === 0) {
      setSlideIndex(0);
      return;
    }
    if (slideIndex >= galleryItems.length) {
      setSlideIndex(0);
    }
  }, [galleryItems.length, slideIndex]);

  const openLightboxBySrc = (src: string) => {
    const index = galleryItems.findIndex((item) => item.src === src);
    if (index !== -1) setLightboxIndex(index);
  };

  const goToPrev = () => {
    setLightboxIndex((current) => {
      if (current === null) return null;
      return current === 0 ? galleryItems.length - 1 : current - 1;
    });
  };

  const goToNext = () => {
    setLightboxIndex((current) => {
      if (current === null) return null;
      return current === galleryItems.length - 1 ? 0 : current + 1;
    });
  };

  const lightboxItem =
    lightboxIndex === null ? null : (galleryItems[lightboxIndex] ?? null);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {hero.eyebrow}
          </p>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            {hero.heading}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            {renderParts(hero.introParts)}
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-neutral-400">
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
        </section>

        <section className="mb-10 rounded-3xl border border-violet-400/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">
            {selectedSeries.heading}
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-300">
            {renderParts(selectedSeries.introParts)}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {selectedSeries.columns.map((column) => (
              <div
                key={column.title}
                className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm leading-7 text-neutral-300">
                  {column.items.map((item) => (
                    <li key={item.text}>{item.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {showReel && (
            <div className="mx-auto mt-8 max-w-4xl">
              {reelLabel.trim() && (
                <p className="mb-3 text-sm font-bold text-violet-300/80">
                  {reelLabel}
                </p>
              )}
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="relative w-full pt-[56.25%]">
                  <iframe
                    src={streamReelSrc(
                      reelUid.trim(),
                      reelTitle.trim() || reelLabel.trim() || "Filmography reel",
                      reelThumbnailTime === ""
                        ? undefined
                        : reelThumbnailTime,
                    )}
                    className="absolute left-0 top-0 h-full w-full"
                    allow="encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={
                      reelTitle.trim() || reelLabel.trim() || "Filmography reel"
                    }
                  />
                </div>
              </div>
              {reelTitle.trim() && (
                <h3 className="mt-4 text-base font-medium text-white">
                  {reelTitle}
                </h3>
              )}
              {reelDescription.trim() && (
                <div className="mt-2">
                  <CollapsibleCaption caption={reelDescription} />
                </div>
              )}
            </div>
          )}
        </section>

        <div className="mb-10 h-px w-full bg-gradient-to-r from-violet-500/0 via-violet-400/40 to-violet-500/0" />

        <section className="mb-10 rounded-3xl border border-violet-400/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white">
            {documentary.heading}
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            {renderParts(documentary.introParts)}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {documentary.cards.map((card) => (
              <div
                key={card.title}
                className={
                  card.featured
                    ? "group rounded-2xl border border-violet-400/20 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300/40 hover:bg-neutral-900 md:col-span-2"
                    : "group rounded-2xl border border-white/10 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900"
                }
              >
                {card.badge && (
                  <p className="mb-2 text-xs uppercase tracking-widest text-violet-300">
                    {card.badge}
                  </p>
                )}
                <h3
                  className={
                    card.titleSemibold
                      ? "text-xl font-semibold leading-tight tracking-tight text-white"
                      : "text-xl font-medium text-white"
                  }
                >
                  <strong className="text-violet-200">{card.title}</strong>
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-violet-400/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">
            {youtube.heading}
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            {renderParts(youtube.introParts)}
          </p>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            {youtube.body}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {youtube.cards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm text-neutral-300">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-violet-400/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">
            {featureFilm.heading}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            {renderParts(featureFilm.introParts)}
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900">
            <h3 className="text-xl font-medium text-white">
              <strong className="text-violet-200">{featureFilm.title}</strong>
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              {renderParts(featureFilm.bodyParts)}
            </p>
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <div className="relative h-[680px] overflow-hidden rounded-2xl border border-white/5">
            <video
              src={emmyVideoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain"
            />
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {behindTheScenes.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {behindTheScenes.heading}
          </h2>
          {galleryItems.length > 0 && (
            <div
              className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/70"
              aria-roledescription="carousel"
              aria-label="Behind the scenes photos"
            >
              <div className="relative aspect-[16/10] w-full">
                {galleryItems.map((item, index) => (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => openLightboxBySrc(item.src)}
                    className={`absolute inset-0 cursor-zoom-in transition-opacity duration-700 ${
                      index === slideIndex
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
                    aria-hidden={index !== slideIndex}
                    tabIndex={index === slideIndex ? 0 : -1}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <p className="sr-only" aria-live="polite">
                Image {slideIndex + 1} of {galleryItems.length}
              </p>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-violet-400/10 bg-white/5 p-8">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {cta.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {cta.heading}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            {cta.body}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {cta.buttons.map((button) => {
              const className = buttonClass(button.style);
              if (
                button.external ||
                button.href.startsWith("mailto:") ||
                button.href.startsWith("http")
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
                <Link
                  key={button.label}
                  href={button.href}
                  className={className}
                >
                  {button.label}
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {lightboxItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 px-4 py-6"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white transition hover:bg-white/10"
          >
            Close
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-3 text-white transition hover:bg-white/10"
          >
            ←
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-4 py-3 text-white transition hover:bg-white/10"
          >
            →
          </button>

          <div
            className="max-h-[90vh] max-w-[92vw] overflow-hidden rounded-2xl bg-neutral-950"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxItem.src}
              alt={lightboxItem.alt}
              className="max-h-[90vh] max-w-[92vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

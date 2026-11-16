"use client";

import { useEffect, useState } from "react";
import type { PortfolioRecommendation } from "../../lib/portfolio-recommendations";

type RecommendationsCarouselProps = {
  items: PortfolioRecommendation[];
};

export function RecommendationsCarousel({
  items,
}: RecommendationsCarouselProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const count = items.length;
  const multi = count > 1;

  useEffect(() => {
    if (slideIndex >= count) {
      setSlideIndex(0);
    }
  }, [count, slideIndex]);

  useEffect(() => {
    if (!multi) return;

    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current === count - 1 ? 0 : current + 1));
    }, 10000);

    return () => window.clearInterval(timer);
  }, [multi, count, slideIndex]);

  if (count === 0) {
    return null;
  }

  const goToNext = () => {
    setSlideIndex((current) => (current === count - 1 ? 0 : current + 1));
  };

  return (
    <section
      className="border-t border-white/10 py-16"
      aria-labelledby="portfolio-recommendations-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p
          id="portfolio-recommendations-heading"
          className="text-sm uppercase tracking-[0.3em] text-violet-300/80"
        >
          Recommendations
        </p>
        {multi && (
          <button
            type="button"
            onClick={goToNext}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            aria-label="Next recommendation"
          >
            Next →
          </button>
        )}
      </div>

      <div
        className="relative mt-8 min-h-[10rem]"
        aria-roledescription="carousel"
        aria-label="Recommendations"
      >
        {items.map((item, index) => {
          const quoteClass =
            item.color === "violet" ? "text-violet-200" : "text-white";
          const active = index === slideIndex;
          return (
            <blockquote
              key={item.id}
              className={`max-w-3xl transition-opacity duration-700 ${
                active
                  ? "relative opacity-100"
                  : "pointer-events-none absolute inset-x-0 top-0 opacity-0"
              }`}
              aria-hidden={!active}
            >
              <p
                className={`text-xl font-medium leading-9 sm:text-2xl sm:leading-10 ${quoteClass}`}
              >
                {item.quote}
              </p>
              {item.attribution.trim() && (
                <footer
                  className={`mt-4 text-sm ${
                    item.color === "violet"
                      ? "text-violet-300/80"
                      : "text-neutral-400"
                  }`}
                >
                  — {item.attribution}
                </footer>
              )}
            </blockquote>
          );
        })}
        {multi && (
          <p className="sr-only" aria-live="polite">
            Recommendation {slideIndex + 1} of {count}
          </p>
        )}
      </div>
    </section>
  );
}

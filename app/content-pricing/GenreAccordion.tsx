"use client";

import { useState } from "react";
import { BulletList } from "../../components/BulletList";
import { genres, type PricingTier } from "./genre-data";

function TierCard({ tier }: { tier: PricingTier }) {
  const isPopular = tier.name === "Standard";

  return (
    <div
      className={
        isPopular
          ? "relative rounded-3xl border border-violet-400/40 bg-violet-950/30 p-6 sm:p-8"
          : "rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8"
      }
    >
      {isPopular && (
        <span className="absolute -top-3 left-6 rounded-full border border-violet-400/40 bg-neutral-950 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-300">
          Most Popular
        </span>
      )}
      <p
        className={`text-sm uppercase tracking-[0.2em] ${
          isPopular ? "text-violet-300" : "text-violet-300/80"
        }`}
      >
        {tier.name}
      </p>
      <p className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
        {tier.price}
      </p>
      <p className="mt-2 text-sm text-neutral-400">{tier.turnaround}</p>
      <BulletList items={tier.features} />
    </div>
  );
}

export default function GenreAccordion() {
  const [openId, setOpenId] = useState<string>("");

  return (
    <div className="space-y-4">
      {genres.map((genre) => {
        const isOpen = openId === genre.id;
        const panelId = `genre-panel-${genre.id}`;
        const headerId = `genre-header-${genre.id}`;

        return (
          <div
            key={genre.id}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
          >
            <h2 className="m-0">
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? "" : genre.id)}
                className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition hover:bg-white/5 sm:px-8 sm:py-6"
              >
                <span className="min-w-0">
                  <span className="block text-xl font-semibold text-white sm:text-2xl">
                    {genre.title}
                  </span>
                  <span className="mt-2 block text-sm leading-7 text-neutral-400 sm:text-base sm:leading-8">
                    {genre.description}
                  </span>
                </span>
                <span
                  className={`mt-1 shrink-0 text-violet-300 transition duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
            </h2>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={isOpen ? "border-t border-white/10" : undefined}
            >
              {isOpen && (
                <div className="grid gap-6 p-6 pt-8 min-[760px]:grid-cols-3 sm:p-8 sm:pt-10">
                  {genre.tiers.map((tier) => (
                    <TierCard key={tier.name} tier={tier} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

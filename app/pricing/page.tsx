import type { Metadata } from "next";
import Link from "next/link";
import { BulletList } from "../../components/BulletList";
import { loadContent } from "../../lib/content/load-content";

type Hideable = { hidden?: boolean };

type Bullet = Hideable & { text: string };

type CoreTier = Hideable & {
  name: string;
  price: string;
  unit: string;
  description: string;
};

type PackageItem = Hideable & {
  id?: string;
  name: string;
  price: string;
  bullets: Bullet[];
  bestFor: string;
};

type AddOn = Hideable & {
  label: string;
  price: string;
  accent?: boolean;
};

type FaqItem = Hideable & {
  question: string;
  answer: string;
};

type CtaButton = Hideable & {
  label: string;
  href: string;
  style: "primary" | "secondary";
};

type PricingData = {
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    heading: string;
    intro: string;
    note: string;
  };
  coreRates: {
    eyebrow: string;
    heading: string;
    tiers: CoreTier[];
  };
  packages: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: PackageItem[];
  };
  retainer: {
    eyebrow: string;
    heading: string;
    price: string;
    bullets: Bullet[];
  };
  addOns: {
    eyebrow: string;
    items: AddOn[];
  };
  howPricingWorks: {
    eyebrow: string;
    heading: string;
    factors: Bullet[];
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

function bulletTexts(items: Bullet[]): string[] {
  return visible(items).map((item) => item.text);
}

export function generateMetadata(): Metadata {
  const pricing = loadContent<PricingData>("pricing");
  return {
    title: pricing.meta.title,
    description: pricing.meta.description,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function PricingPage() {
  const pricing = loadContent<PricingData>("pricing");
  const coreTiers = visible(pricing.coreRates.tiers);
  const packages = visible(pricing.packages.items);
  const retainerBullets = bulletTexts(pricing.retainer.bullets);
  const addOns = visible(pricing.addOns.items);
  const factors = visible(pricing.howPricingWorks.factors);
  const faqs = visible(pricing.faq.items);
  const ctaButtons = visible(pricing.cta.buttons);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {pricing.hero.eyebrow}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {pricing.hero.heading}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            {pricing.hero.intro}
          </p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-400">
            {pricing.hero.note}
          </p>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {pricing.coreRates.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {pricing.coreRates.heading}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {coreTiers.map((tier) => (
              <div
                key={tier.name}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
                  {tier.name}
                </p>
                <p className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                  {tier.price}{" "}
                  <span className="text-lg font-normal text-neutral-400">
                    {tier.unit}
                  </span>
                </p>
                <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                  {tier.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {pricing.packages.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {pricing.packages.heading}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            {pricing.packages.intro}
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {packages.map((item) => (
              <div
                key={item.id ?? item.name}
                id={item.id}
                className="rounded-3xl border border-violet-400/15 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:border-violet-300/30"
              >
                <p className="text-xs uppercase tracking-widest text-violet-300/90">
                  {item.name}
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {item.price}
                </p>
                <BulletList items={bulletTexts(item.bullets)} />
                <p className="mt-6 text-sm leading-7 text-neutral-400">
                  <span className="font-medium text-neutral-200">Best for:</span>{" "}
                  {item.bestFor}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 border-t border-white/10 pt-14 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              {pricing.retainer.eyebrow}
            </p>
            <h2 className="text-2xl font-semibold text-white">
              {pricing.retainer.heading}
            </h2>
            <p className="mt-4 text-2xl font-semibold text-violet-200">
              {pricing.retainer.price}
            </p>
            <BulletList items={retainerBullets} />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              {pricing.addOns.eyebrow}
            </p>
            <ul className="space-y-4 text-sm leading-7 text-neutral-300">
              {addOns.map((item, index) => (
                <li
                  key={item.label}
                  className={
                    index === addOns.length - 1
                      ? "flex justify-between gap-4 pt-1"
                      : "flex justify-between gap-4 border-b border-white/5 pb-4"
                  }
                >
                  <span>{item.label}</span>
                  <span
                    className={
                      item.accent
                        ? "shrink-0 text-violet-200/90"
                        : "shrink-0 text-neutral-400"
                    }
                  >
                    {item.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14 rounded-3xl border border-violet-400/10 bg-white/5 p-8 sm:p-10">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {pricing.howPricingWorks.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {pricing.howPricingWorks.heading}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {factors.map((factor) => (
              <li
                key={factor.text}
                className="rounded-2xl border border-white/10 bg-neutral-900/60 px-5 py-4 text-sm font-medium text-neutral-200"
              >
                {factor.text}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            {pricing.faq.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {pricing.faq.heading}
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
            {pricing.cta.eyebrow}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {pricing.cta.heading}
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            {pricing.cta.body}
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
                button.href.startsWith("http") ? (
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

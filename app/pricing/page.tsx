import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editing Rates & Services | Double Dag Productions",
  description:
    "Transparent video editing rates for documentary, series, branded, and digital content. Day rates, project packages, retainers, and add-ons from Emmy-recognized editor Ben Bacharach-White.",
  robots: {
    index: false,
    follow: false,
  },
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm leading-7 text-neutral-300">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400/80" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Services &amp; Rates
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Expert Video Editing — Built for Story, Not Just Assembly
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            I&apos;m a senior editor with over two decades of experience shaping
            documentaries, series, and high-end digital content. This isn&apos;t
            just cutting footage — it&apos;s editorial judgment, pacing,
            structure, and polish that elevates the final piece.
          </p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-400">
            Clear pricing helps you plan, but don&apos;t let the numbers scare
            you. Final quotes are always tailored to your project, and I&apos;m
            absolutely open to working with Non-Profits, students, small productions, and
            people with limited budgets when I can.
          </p>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Core Rates
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Flexible ways to work together
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
                Day Rate
              </p>
              <p className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                $600 – $800 <span className="text-lg font-normal text-neutral-400">/ day</span>
              </p>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Best for ongoing projects, collaborative edits, or agency work.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
                Hourly
              </p>
              <p className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                $75 – $100 <span className="text-lg font-normal text-neutral-400">/ hour</span>
              </p>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Used for smaller updates, fixes, or overflow work.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
                Project Minimum
              </p>
              <p className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                $1,500 <span className="text-lg font-normal text-neutral-400">minimum</span>
              </p>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Ensures proper time for quality editorial work.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Project Packages
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Structured options for common needs
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            Packages are starting points — scope, complexity, and timeline shape
            the final estimate.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-violet-400/15 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:border-violet-300/30">
              <p className="text-xs uppercase tracking-widest text-violet-300/90">
                Short-Form / Social
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                Starting at $1,500
              </p>
              <BulletList
                items={[
                  "1–3 short videos (30–90 seconds)",
                  "Tight pacing, captions, platform-ready formatting",
                  "1 round of revisions",
                  "Fast turnaround available",
                ]}
              />
              <p className="mt-6 text-sm leading-7 text-neutral-400">
                <span className="font-medium text-neutral-200">Best for:</span>{" "}
                social campaigns, promos, quick-turn content
              </p>
            </div>

            <div className="rounded-3xl border border-violet-400/15 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:border-violet-300/30">
              <p className="text-xs uppercase tracking-widest text-violet-300/90">
                Long-Form / YouTube / Branded Content
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                $3,000 – $6,000
              </p>
              <BulletList
                items={[
                  "5–20 minute edited piece",
                  "Full narrative shaping + pacing",
                  "Graphics, music, audio polish",
                  "2 rounds of revisions",
                ]}
              />
              <p className="mt-6 text-sm leading-7 text-neutral-400">
                <span className="font-medium text-neutral-200">Best for:</span>{" "}
                YouTube channels, branded storytelling, interviews
              </p>
            </div>

            <div className="rounded-3xl border border-violet-400/15 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:border-violet-300/30">
              <p className="text-xs uppercase tracking-widest text-violet-300/90">
                Documentary / Premium Content
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">$7,500+</p>
              <BulletList
                items={[
                  "Deep story structure + editorial development",
                  "Multi-layered edits (interviews, b-roll, archival)",
                  "Advanced pacing, tone, and narrative flow",
                  "Collaboration with producers / directors",
                ]}
              />
              <p className="mt-6 text-sm leading-7 text-neutral-400">
                <span className="font-medium text-neutral-200">Best for:</span>{" "}
                documentaries, series, high-end branded films
              </p>
            </div>

            <div className="rounded-3xl border border-violet-400/15 bg-white/5 p-8 backdrop-blur-sm transition duration-300 hover:border-violet-300/30">
              <p className="text-xs uppercase tracking-widest text-violet-300/90">
                Campaign / Multi-Deliverable Projects
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">$10,000+</p>
              <BulletList
                items={[
                  "Hero video + multiple cutdowns",
                  "Versioning for platforms",
                  "Structured review workflow",
                  "Consistent creative across deliverables",
                ]}
              />
              <p className="mt-6 text-sm leading-7 text-neutral-400">
                <span className="font-medium text-neutral-200">Best for:</span>{" "}
                agencies, marketing teams, launches
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14 grid gap-6 border-t border-white/10 pt-14 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Retainer Options
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Monthly Editorial Partner
            </h2>
            <p className="mt-4 text-2xl font-semibold text-violet-200">
              $5,000 – $12,000 / month
            </p>
            <BulletList
              items={[
                "Reserved editing time each month",
                "Priority scheduling",
                "Consistent output and turnaround",
                "Ideal for ongoing content pipelines",
              ]}
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Add-Ons
            </p>
            <ul className="space-y-4 text-sm leading-7 text-neutral-300">
              <li className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <span>Motion graphics / animation</span>
                <span className="shrink-0 text-neutral-400">custom quote</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <span>Advanced color grading</span>
                <span className="shrink-0 text-violet-200/90">+$500–$1,500</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <span>Audio cleanup / mix</span>
                <span className="shrink-0 text-violet-200/90">+$300–$1,000</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <span>Additional revisions</span>
                <span className="shrink-0 text-neutral-400">billed hourly</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <span>Rush turnaround</span>
                <span className="shrink-0 text-violet-200/90">+25–50%</span>
              </li>
              <li className="flex justify-between gap-4 border-b border-white/5 pb-4">
                <span>Project file delivery</span>
                <span className="shrink-0 text-violet-200/90">+$500+</span>
              </li>
              <li className="flex justify-between gap-4 pt-1">
                <span>Long-term archive</span>
                <span className="shrink-0 text-neutral-400">custom</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-14 rounded-3xl border border-violet-400/10 bg-white/5 p-8 sm:p-10">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            How Pricing Works
          </p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Every project is different. Pricing is based on:
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Footage volume and organization",
              "Story complexity",
              "Number of revisions",
              "Graphics / finishing needs",
              "Turnaround speed",
            ].map((label) => (
              <li
                key={label}
                className="rounded-2xl border border-white/10 bg-neutral-900/60 px-5 py-4 text-sm font-medium text-neutral-200"
              >
                {label}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            FAQ
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Common questions
          </h2>
          <div className="mt-10 space-y-6">
            {[
              {
                q: "How many revisions are included?",
                a: "Most projects include 1–2 rounds. Additional revisions are billed hourly.",
              },
              {
                q: "Do you work hourly or per project?",
                a: "Both. Projects are typically fixed-rate; ongoing work is often hourly or retainer-based.",
              },
              {
                q: "Can you match a lower budget?",
                a: "If scope can be adjusted, sometimes. The focus is always maintaining quality.",
              },
              {
                q: "Do you handle raw footage organization?",
                a: "Yes — but heavily disorganized footage may affect pricing.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
              >
                <h3 className="text-lg font-semibold text-white">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/40 via-neutral-950 to-neutral-950 p-10 sm:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Next Step
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Let&apos;s talk about your project.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            Tell me what you&apos;re working on, and I&apos;ll put together a
            tailored estimate.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="mailto:hello@doubledagproductions.com?subject=Editing%20%26%20Post-Production%20Inquiry"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
            >
              Email for a Quote
            </a>
            <Link
              href="/research"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Research &amp; Fact Checking
            </Link>
            <Link
              href="/filmography"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View Filmography
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Research & Fact Checking | L. Viola Kozak, PhD | Double Dag Productions",
  description:
    "Premium research and fact checking for documentary, educational, branded, and scripted content. PhD-level rigor, clear sourcing, and production-ready support from L. Viola Kozak.",
};

const expertiseTags = [
  "Math & science",
  "History",
  "Culture",
  "Music",
  "Language",
  "Food & cooking",
  "Travel",
  "Technology",
  "Folklore & urban legends",
  "Broad nonfiction & general knowledge",
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Double Dag Productions
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Research &amp; Fact Checking by L. Viola Kozak, PhD
          </h1>
          <p className="mt-8 max-w-3xl text-xl font-medium leading-8 text-neutral-200 sm:text-2xl">
            Meticulous, high-level research and fact checking for productions
            that need accuracy, clarity, and confidence on the page and on
            screen.
          </p>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300">
            When a script makes a claim, cites a date, references a study, or
            leans on cultural detail, audiences feel the difference between
            &quot;close enough&quot; and truly sound. This service exists for
            teams who want the latter — rigorous inquiry, careful verification,
            and sourcing you can stand behind — delivered with the pace and
            pragmatism real productions require.
          </p>
        </section>

        <div className="mb-16 h-px w-full bg-gradient-to-r from-violet-500/0 via-violet-400/40 to-violet-500/0" />

        <section className="mb-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            What You Get
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            A complete research partnership
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Rigorous research &amp; verification
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Deep dives into primary and secondary sources, cross-checking
                claims, dates, names, statistics, and contextual details so your
                narrative rests on solid ground.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Clear, accurate sourcing
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Notes and references organized for editorial review — what was
                checked, what was confirmed, what needs a softer line, and where
                additional clearance may be wise.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Script review &amp; factual QA
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Passes tailored to your draft stage: line-level flags,
                scene-level questions, and constructive suggestions that respect
                creative intent while protecting accuracy.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Dependable, detail-oriented support
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Fast turnarounds when schedules tighten, steady communication
                with writers and producers, and a calm, methodical approach when
                complexity stacks up.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14 rounded-3xl border border-violet-400/10 bg-white/5 p-8 sm:p-10">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Areas of Expertise
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Scholarly range, real-world fluency
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            L. Viola Kozak, PhD has contributed research and fact checking across
            thousands of scripts — from rigorous math and science, history, and
            academic subjects to vivid nonfiction lanes like cooking, culture,
            design, music, travel, technology, language, and even folklore and
            urban legends. If it needs to be right, it&apos;s likely in
            familiar territory.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {expertiseTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-violet-400/20 bg-neutral-900/70 px-4 py-2 text-sm font-medium text-neutral-200 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-14 grid gap-6 border-t border-white/10 pt-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Why It Matters
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Credibility is part of the craft
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-300">
              In documentary and educational media, accuracy is trust. In
              branded and digital work, it&apos;s brand safety. In scripted
              storytelling, it&apos;s the invisible scaffolding that lets
              performances shine without distraction. Strong research does not
              flatten creativity — it clears the runway for it.
            </p>
            <p className="mt-4 text-base leading-8 text-neutral-300">
              Expect a balance of scholarly rigor and production practicality:
              tight feedback, plain-language explanations, and recommendations
              that work for editors, showrunners, and legal review alike.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-neutral-900/50 p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
              Formats Supported
            </p>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-neutral-300">
              <li>Documentary &amp; docuseries</li>
              <li>Educational series &amp; course libraries</li>
              <li>Branded films &amp; marketing campaigns</li>
              <li>Scripted &amp; hybrid formats</li>
              <li>Digital series, podcasts, and short-form</li>
            </ul>
          </div>
        </section>

        <section className="mb-14 rounded-3xl border border-violet-400/10 bg-white/5 p-8 sm:p-10">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Collaboration
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for how teams actually work
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            Whether you are shaping a treatment, locking narration, stress-testing
            a sensitive scene, or running a final accuracy pass before delivery,
            research integrates best as a conversation — not a gate. Engagements
            can scale from targeted spot checks to comprehensive script support
            across multiple drafts.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">Writers &amp; producers</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                Collaborative notes that sharpen language without fighting the
                voice of the piece.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">Editorial &amp; post</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                Late-stage verification for on-screen text, archival captions,
                and evolving cuts.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">Institutions &amp; brands</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                Documentation-minded workflows for teams who answer to
                stakeholders and standards.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/40 via-neutral-950 to-neutral-950 p-10 sm:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Start a Conversation
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Bring the script. We&apos;ll bring the rigor.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            Share your timeline, subject matter, and where you are in the
            process — outline, draft, or picture lock — and we&apos;ll outline a
            research plan that fits.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="mailto:hello@doubledagproductions.com?subject=Research%20%26%20Fact%20Checking%20Inquiry"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
            >
              Inquire About Research
            </a>
            <a
              href="mailto:info@DoubleDagProductions.com?subject=Pricing%20Sheet%20Request"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Request Pricing Sheet
            </a>
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

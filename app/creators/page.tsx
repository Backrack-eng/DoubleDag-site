import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Video Editing for Content Creators | Double Dag Productions",
  description:
    "You shoot it, I cut it. Professional video editing for YouTubers, podcasters, and creators who'd rather make content than sit in a timeline.",
};

export default function CreatorsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            For Creators
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            You shoot it. I cut it.
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-medium leading-8 text-neutral-200 sm:text-2xl">
            You have fun. Leave the work to me.
          </p>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            Editing eats hours you don&apos;t have. Send me your footage and
            I&apos;ll turn it into something worth posting, so you spend your
            time filming instead of stuck in a timeline at midnight.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="mailto:hello@doubledagproductions.com?subject=Creator%20Edit%20Inquiry"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
            >
              Send Me Your Footage
            </a>
            <a
              href="mailto:info@DoubleDagProductions.com?subject=Pricing%20Sheet%20Request"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Request Pricing Sheet
            </a>
            <a
              href="#how-it-works"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
            >
              How It Works
            </a>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mb-14 border-t border-white/10 pt-14"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            How It Works
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps. That&apos;s it.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Upload Your Footage
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Drop your raw clips in your own file-sharing service — Dropbox
                is fine — or I can send you a link to upload everything. No
                special export, no formatting rules. Just get it to me.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                I Cut the Story
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Not just an assembly of your clips in order. Pacing, structure,
                hooks, the stuff that actually keeps people watching.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                You Get It Back Ready to Post
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Formatted for wherever it&apos;s going. Captions and graphics
                included if you want them.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Who This Is For
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Long-form, short-form, or both.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Long-Form Creators
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                YouTubers, podcasters, vloggers who need consistent weekly or
                biweekly turnaround without burning out on the edit.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Short-Form Creators
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Reels, TikTok, Shorts. High volume, fast turnaround, cut for the
                scroll.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Anyone Done Teaching Themselves Premiere
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                You already have a full-time job being the talent. You don&apos;t
                need a second one in the timeline.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Why Double Dag
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Broadcast chops, creator turnaround.
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            20+ years cutting documentaries and series for PBS, National
            Geographic, Smithsonian, and The Great Courses. Emmy-recognized
            editorial work. That&apos;s the same story sense going into your
            content, not just cuts on the beat from a preset pack.
          </p>
        </section>

        <section className="mb-14 border-t border-white/10 pt-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Packages
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Two ways to work together.
          </h2>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Short-Form / Social
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Fast-turnaround edits for Reels, TikTok, and Shorts.
              </p>
            </div>
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                Long-Form / YouTube
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Full edits for YouTube, vlogs, and episodic content.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="mailto:info@DoubleDagProductions.com?subject=Pricing%20Sheet%20Request"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Request Pricing Sheet
            </a>
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-7 text-neutral-400">
            Posting every week?{" "}
            <a
              href="mailto:hello@doubledagproductions.com?subject=Creator%20Edit%20Inquiry"
              className="font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
            >
              Ask about a standing editorial retainer
            </a>{" "}
            so your queue never backs up.
          </p>
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
                q: "Do I need to shoot a certain way?",
                a: "No. Send me what you've got. If you want shot list tips before you film, ask, happy to help.",
              },
              {
                q: "How fast is turnaround?",
                a: "Depends on length and complexity, but most short-form turns around in days, not weeks. Rush available.",
              },
              {
                q: "Can you do captions, thumbnails, or graphics?",
                a: "Yes, all add-ons. Ask for a quote with your project.",
              },
              {
                q: "What if I post every week?",
                a: "That's what the retainer option is for. Reserved editing time so you're never waiting in a queue.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
              >
                <h3 className="text-lg font-semibold text-white">{item.q}</h3>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/40 via-neutral-950 to-neutral-950 p-10 sm:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Next Step
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to hand off the edit?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            Send your footage and tell me what it&apos;s for. I&apos;ll take
            it from there.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="mailto:hello@doubledagproductions.com?subject=Creator%20Edit%20Inquiry"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
            >
              Email Double Dag
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

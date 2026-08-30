import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creative Technologist | Double Dag Productions",
  description:
    "Editing tools built by an editor. DagToolkit, Script Reader, and AutoThirds for Premiere Pro workflows.",
  openGraph: {
    images: ["/banner2.png"],
  },
};

export default function CreativeTechnologistPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Creative Technologist
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            I build tools too.
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            Twenty years in the timeline means I&apos;ve hit the same friction
            points every editor hits. So I build the fix. These are tools built
            from real production problems, and they&apos;re in daily use, not
            side projects.
          </p>
        </section>

        <div className="mb-16 h-px w-full bg-gradient-to-r from-violet-500/0 via-violet-400/40 to-violet-500/0" />

        <section className="mb-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Premiere Pro Tools
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built in the edit bay, for the edit bay.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">
                DagToolkit
              </h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                A full production toolkit built directly into Premiere. Import a
                Word script with comments, match it to captions, and drop
                sequence markers on the lines being spoken. Search, copy, and
                recolor markers from one list. Place graphics from the script,
                kick off After Effects renders, pull Excel bin reports, and check
                Photoshop stills without leaving the panel.
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-neutral-500">
                In use on every project I edit
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">Script Reader</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Loads your script and your captions, then follows the playhead
                live during playback, highlighting the line being spoken as it
                plays. Click any word and the playhead jumps straight there. It
                compares what was written against what was actually said and
                marks the differences like track changes, so nothing gets
                missed in review.
              </p>
              <p className="mt-4 text-xs uppercase tracking-widest text-neutral-500">
                In use on every project I edit
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="group rounded-3xl border border-violet-400/15 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">AutoThirds</h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                For editors, by editors. AutoThirds turns scripts and
                transcripts into polished, broadcast-safe lower thirds in
                seconds, no more typing them out one at a time. Import or
                paste a script, style the graphics, and export PNGs, PSDs, or
                full sequences ready to drop straight into your timeline.
              </p>
              <a
                href="https://autothirds.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-medium text-black transition hover:opacity-90"
              >
                Visit AutoThirds
              </a>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Creator Tools
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Not every tool lives in the timeline.
          </h2>
          <div className="mt-10">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold text-white">Thinkonaut</h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                A place to capture ideas by voice or text and watch how they
                connect. Thinkonaut turns raw thoughts into structured notes,
                links them to projects, and maps the relationships in a
                constellation view called Galaxy. It will turn a thought into
                a video idea and build the hooks, tags, and key points. Built
                for anyone who thinks out loud, on set, in the edit bay, or
                in between.
              </p>
              <a
                href="https://thinkonaut.app"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-8 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Visit Thinkonaut
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-950/40 via-neutral-950 to-neutral-950 p-10 sm:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Questions
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Want to hear about what&apos;s next?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-300">
            More tools are in development. If you want early access or have a
            workflow problem worth solving, reach out.
          </p>
          <div className="mt-10">
            <a
              href="mailto:hello@doubledagproductions.com?subject=Creative%20Technologist%20Inquiry"
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

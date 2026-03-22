export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16">
        <div className="max-w-4xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-400">
            Double Dag Productions
          </p>

          <h1 className="max-w-4xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Editorial craft, story instinct, and polished post-production.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300 sm:text-xl">
            Double Dag Productions is the creative home of Ben Bacharach-White,
            delivering expert editing, finishing, motion design, and
            post-production support for documentaries, series, branded content,
            and digital storytelling.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="mailto:hello@doubledagproductions.com"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:opacity-90"
            >
              Get in Touch
            </a>

            <a
              href="#services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View Services
            </a>
          </div>
        </div>

        <section id="services" className="mt-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Editing</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Documentary, branded, educational, and narrative editorial with a
              strong emphasis on pacing, clarity, and emotional impact.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Finishing</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Color polish, graphics integration, cleanup, versioning, and
              delivery support that helps projects cross the finish line cleanly.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Creative Post Workflow</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Practical support for modern post pipelines, AI-assisted workflows,
              and production-ready systems built for speed and quality.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
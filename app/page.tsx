"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Player from "@vimeo/player";
import { PhotographyScroller } from "./components/PhotographyScroller";

export default function Home() {
  const weavingIframeRef = useRef<HTMLIFrameElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!weavingIframeRef.current) return;

    const player = new Player(weavingIframeRef.current);

    let hasFaded = false;
    let isResetting = false;

    const handleTimeUpdate = (data: { seconds: number }) => {
      if (data.seconds >= 96.5 && !hasFaded) {
        hasFaded = true;
        if (overlayRef.current) {
          overlayRef.current.style.opacity = "1";
        }
      }

      if (data.seconds >= 97 && !isResetting) {
        isResetting = true;

        player.setCurrentTime(0).then(() => {
          player.play();

          setTimeout(() => {
            if (overlayRef.current) {
              overlayRef.current.style.opacity = "0";
            }
            hasFaded = false;
            isResetting = false;
          }, 300);
        });
      }
    };

    player.on("timeupdate", handleTimeUpdate);

    return () => {
      player.off("timeupdate", handleTimeUpdate);
      player.destroy().catch(() => {});
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="flex min-h-[70vh] flex-col justify-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Double Dag Productions
          </p>

          <h1 className="max-w-5xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Editing, finishing, and story-driven post-production for films,
            series, branded content, and digital media.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300 sm:text-xl">
            Ben Bacharach-White is an Emmy-recognized editor and post-production
            professional with more than two decades of experience crafting
            documentaries, educational series, branded storytelling, and
            feature work for respected clients and platforms.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="/filmography"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:opacity-90"
            >
              View Filmography
            </a>

            <Link
              href="/research"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Research &amp; Fact Checking
            </Link>

            <a
              href="mailto:hello@doubledagproductions.com"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Get in Touch
            </a>
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <div className="mb-6">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Featured Reel
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Emmy-recognized editorial across documentary, series, and branded
              storytelling
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
              View editorial reel showcasing selected work and creative
              post-production.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div className="relative w-full pt-[56.25%]">
              <iframe
                src="https://player.vimeo.com/video/889986920?title=0&byline=0&portrait=0&badge=0&autoplay=1&muted=0"
                className="absolute left-0 top-0 h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Ben Bacharach-White Demo Reel"
              />
            </div>
          </div>
        </section>

        <section className="space-y-10 border-t border-white/10 py-14">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Featured Work
            </p>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  ref={weavingIframeRef}
                  src="https://player.vimeo.com/video/1003754390#t=4s&autopause=1&muted=0"                  className="absolute left-0 top-0 h-full w-full"
                  allow="fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Weaving Nature"
                />
                <div
                  ref={overlayRef}
                  className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-700"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src="https://player.vimeo.com/video/852486359?title=0&byline=0&portrait=0"
                  className="absolute left-0 top-0 h-full w-full"
                  allow="fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Reporting 9/11 and Why It Still Matters"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src="https://player.vimeo.com/video/852488982?title=0&byline=0&portrait=0"
                  className="absolute left-0 top-0 h-full w-full"
                  allow="fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Exploring the Mayan World"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 md:col-span-2">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src="https://player.vimeo.com/video/57553817?autoplay=1&muted=1&loop=1"
                  className="absolute left-0 top-0 h-full w-full"
                  allow="autoplay; fullscreen; picture-in-picture;"
                  allowFullScreen
                  title="Previous Work (2006 - 2012)"
                />
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 md:col-span-2">
              <div className="relative w-full pt-[56.25%]">
                <iframe
                  src="https://player.vimeo.com/video/852487298?title=0&byline=0&portrait=0"
                  className="absolute left-0 top-0 h-full w-full"
                  allow="fullscreen; picture-in-picture"
                  loading="lazy"
                  title="The Banjo: Music, History, and Heritage"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 border-t border-white/10 py-14 md:grid-cols-3">
          <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
              Experience
            </p>
            <h2 className="mt-3 text-2xl font-semibold">20+ Years</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
              Deep experience across editorial, finishing, documentary
              structure, branded storytelling, and post workflows.
            </p>
          </div>

          <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
              Recognition
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Emmy-Recognized</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
              Award-winning and festival-recognized work, including documentary
              and feature projects with broad public reach.
            </p>
          </div>

          <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
              Clients & Platforms
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Trusted Partners</h2>
            <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
              Projects connected to PBS, National Geographic, Smithsonian, The
              Great Courses, and other educational and cultural institutions.
            </p>
          </div>
        </section>

        <section className="grid gap-8 py-14 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              About
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A seasoned editor with a wide creative range.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
              Double Dag Productions is the creative home of Ben
              Bacharach-White, a seasoned post-production professional whose
              work spans documentary, music, history, science, travel, culinary,
              educational programming, branded storytelling, social media, and
              feature film.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
              His approach combines strong editorial instincts, technical polish,
              and a deep respect for story, performance, pacing, and emotional
              clarity.
            </p>
            <p className="mt-6 text-sm text-neutral-400">
              Need{" "}
              <Link
                href="/research"
                className="font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
              >
                PhD-level research &amp; fact checking
              </Link>
              ? It&apos;s part of how Double Dag supports serious productions.
            </p>
          </div>

          <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-violet-300/80">
              Focus Areas
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
              <li>Documentary & Docuseries</li>
              <li>Educational & Cultural Programming</li>
              <li>Branded & Corporate Storytelling</li>
              <li>Feature Film & Narrative Work</li>
              <li>Finishing, Delivery, and Post Workflow</li>
            </ul>
          </div>
        </section>

        <section className="py-14">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Selected Work
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold">
                Reporting 9/11 and Why It Still Matters
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Feature documentary storytelling with nationally recognized
                journalists reflecting on the experience of reporting through
                September 11.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold">
                The Banjo: Music, History, and Heritage
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                A rich exploration of music, culture, and history hosted by
                Rhiannon Giddens.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold">
                Exploring the Mayan World
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Historical and archaeological storytelling shaped through
                cinematic editorial structure.
              </p>
            </div>

            <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold">Mock &amp; Roll</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Multi-award-winning mockumentary feature film directed and
                edited by Ben Bacharach-White.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <div className="mb-8">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Tools
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Check out tools designed to make your workflow easier.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
              From everyday thinking to professional post-production, these
              tools are built to streamline the way you work.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold">Thinkonaut</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                A clean, powerful space for capturing thoughts, organizing
                ideas, and turning them into something actionable.
              </p>
              <a
                href="https://www.thinkonaut.app"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-12 w-fit items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:opacity-90"
              >
                Visit Thinkonaut
              </a>
            </div>

            <div className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10">
              <h3 className="text-xl font-semibold">AutoThirds</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Built for editors and producers, AutoThirds helps you quickly
                generate clean, professional lower thirds and on-screen text.
              </p>
              <a
                href="https://autothirds.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-12 w-fit items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:opacity-90"
              >
                Visit AutoThirds
              </a>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
              Contact
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Let&apos;s talk about the next project.
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-300">
              For editing, post-production, finishing, or creative collaboration
              inquiries, get in touch directly.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a
                href="mailto:hello@doubledagproductions.com"
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:opacity-90"
              >
                Email Double Dag
              </a>

              <a
                href="https://www.linkedin.com/in/doubledag/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10"
              >
                LinkedIn
              </a>

              <a
                href="/filmography"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Explore Full Filmography
              </a>

              <Link
                href="/research"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Research Services
              </Link>
            </div>

            <p className="mt-8 text-sm text-neutral-500">
              Please{" "}
              <a
                href="mailto:hello@doubledagproductions.com"
                className="transition hover:text-violet-400"
              >
                contact me
              </a>{" "}
              for a current price sheet.
            </p>
          </div>
        </section>
      </main>

      <section className="border-t border-white/10 pb-16 pt-10">
        <p className="mb-6 text-center text-sm text-neutral-400">
          Photography by Ben Bacharach-White
        </p>
        <PhotographyScroller />
      </section>
    </div>
  );
}
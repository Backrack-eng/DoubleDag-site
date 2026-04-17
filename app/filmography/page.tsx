"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type GalleryImageItem = {
  kind: "image";
  src: string;
  alt: string;
  featured?: "top" | "bottom" | "large" | "wide";
};

type GalleryVideoItem = {
  kind: "video";
  src: string;
  alt: string;
};

type GalleryPairItem = {
  kind: "pair";
  images: {
    src: string;
    alt: string;
  }[];
};

type GalleryItem = GalleryImageItem | GalleryVideoItem | GalleryPairItem;

type Shape = "landscape" | "portrait" | "square";

export default function FilmographyPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imageShapes, setImageShapes] = useState<Record<string, Shape>>({});

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      if (event.key === "Escape") {
        setLightboxIndex(null);
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === "ArrowLeft") {
        goToPrev();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex]);

  const galleryItems: GalleryItem[] = useMemo(
    () => [
      {
        kind: "image",
        src: "/projects/Timeline1.webp",
        alt: "Timeline still 1",
        featured: "top",
      },
      {
        kind: "pair",
        images: [
          {
            src: "/projects/MnR-poster.webp",
            alt: "Mock and Roll poster",
          },
          {
            src: "/projects/Premiere-Cup.webp",
            alt: "Premiere cup",
          },
        ],
      },
  
      { kind: "image", src: "/projects/Ben-cam.webp", alt: "Ben on camera" },
      { kind: "image", src: "/projects/Ben-edit.webp", alt: "Ben editing" },
      { kind: "image", src: "/projects/Ben-Tony.webp", alt: "Ben and Tony" },
      {
        kind: "image",
        src: "/projects/MnR-crew.webp",
        alt: "Mock and Roll crew",
      },
      { kind: "image", src: "/projects/NAB.webp", alt: "NAB" },
      { kind: "image", src: "/projects/Outdoor.webp", alt: "Outdoor still" },
      {
        kind: "image",
        src: "/projects/DSCN2267.JPG",
        alt: "Gallery still DSCN2267",
      },
      {
        kind: "image",
        src: "/projects/IMG_1679.jpeg",
        alt: "Gallery still IMG 1679",
      },
      {
        kind: "video",
        src: "/projects/EmmyWinner.mp4",
        alt: "Emmy Winner video",
      },
      {
        kind: "image",
        src: "/projects/IMG_3002.jpeg",
        alt: "Gallery still IMG 3002",
      },
      {
        kind: "image",
        src: "/projects/IMG_3049.jpeg",
        alt: "Gallery still IMG 3049",
      },
      {
        kind: "image",
        src: "/projects/IMG_4627.JPG",
        alt: "Gallery still IMG 4627",
      },
      {
        kind: "image",
        src: "/projects/IMG_4713.jpeg",
        alt: "Gallery still IMG 4713",
      },
      {
        kind: "image",
        src: "/projects/IMG_8134.JPG",
        alt: "Gallery still IMG 8134",
      },
      {
        kind: "image",
        src: "/projects/IMG_8846.JPG",
        alt: "Gallery still IMG 8846",
      },
      {
        kind: "image",
        src: "/projects/IMG_8920.JPG",
        alt: "Gallery still IMG 8920",
      },
      {
        kind: "image",
        src: "/projects/IMG_9989.JPG",
        alt: "Gallery still IMG 9989",
      },
      {
        kind: "image",
        src: "/projects/Timeline2.webp",
        alt: "Timeline still 2",
        featured: "bottom",
      },
    ],
    []
  );

  const lightboxImages = galleryItems.flatMap((item) => {
    if (item.kind === "image") return [item];
    if (item.kind === "pair") {
      return item.images.map((img) => ({
        kind: "image" as const,
        src: img.src,
        alt: img.alt,
      }));
    }
    return [];
  });

  const getLightboxItem = () => {
    if (lightboxIndex === null) return null;
    return lightboxImages[lightboxIndex] ?? null;
  };

  const openLightboxBySrc = (src: string) => {
    const index = lightboxImages.findIndex((item) => item.src === src);
    if (index !== -1) setLightboxIndex(index);
  };

  const goToPrev = () => {
    setLightboxIndex((current) => {
      if (current === null) return null;
      return current === 0 ? lightboxImages.length - 1 : current - 1;
    });
  };

  const goToNext = () => {
    setLightboxIndex((current) => {
      if (current === null) return null;
      return current === lightboxImages.length - 1 ? 0 : current + 1;
    });
  };

  const registerShape = (src: string, img: HTMLImageElement) => {
    const { naturalWidth, naturalHeight } = img;
    if (!naturalWidth || !naturalHeight) return;

    let shape: Shape = "landscape";
    const ratio = naturalWidth / naturalHeight;

    if (ratio < 0.9) {
      shape = "portrait";
    } else if (ratio > 1.15) {
      shape = "landscape";
    } else {
      shape = "square";
    }

    setImageShapes((prev) => (prev[src] === shape ? prev : { ...prev, [src]: shape }));
  };

  const getTileClasses = (item: GalleryItem) => {
    if (item.kind === "pair") {
      return "md:col-span-12 grid grid-cols-2 gap-2";
    }
  
    if (item.kind === "image" && item.featured === "top") {
      return "md:col-span-12";
    }
  
    if (item.kind === "image" && item.featured === "bottom") {
      return "md:col-span-12";
    }
  
    if (item.kind === "image" && item.featured === "wide") {
      return "md:col-span-6 h-[260px]";
    }
  
    if (item.kind === "video") {
      return "md:col-span-12 h-[680px]";
    }
  
    const shape = item.kind === "image" ? imageShapes[item.src] : undefined;
  
    if (shape === "portrait") {
      return "md:col-span-3 h-[320px]";
    }
  
    if (shape === "square") {
      return "md:col-span-3 h-[260px]";
    }
  
    return "md:col-span-3 h-[240px]";
  };

  const lightboxItem = getLightboxItem();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 lg:px-16 animate-fade-in-up">
        <section className="mb-16">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Double Dag Productions
          </p>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Filmography
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            Selected work spanning <strong>documentary</strong>,{" "}
            <strong>docuseries</strong>, <strong>feature film</strong>,{" "}
            <strong>educational programming</strong>, and{" "}
            <strong>digital storytelling</strong> for major institutions,
            platforms, and audiences.
          </p>
          <p className="mt-6 max-w-3xl text-sm leading-7 text-neutral-400">
            Planning a project? Explore{" "}
            <Link
              href="/pricing"
              className="font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
            >
              editing rates &amp; packages
            </Link>{" "}
            or{" "}
            <Link
              href="/research"
              className="font-medium text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
            >
              research &amp; fact checking
            </Link>{" "}
            by L. Viola Kozak, PhD.
          </p>
        </section>

        <section className="mb-12">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Categories of Work
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Science / Math",
              "History",
              "Music",
              "Arts & Culture",
              "Travel",
              "Food & Culinary",
              "Nature & Environment",
              "Technology",
              "Education",
              "Business / Financial",
              "YouTube / Digital",
              "Short-Form / Social",
              "Feature Film",
              "Language",
              "Non-Profits",
              "Corporate / Branded",
            ].map((category) => (
              <div
                key={category}
                className="rounded-2xl border border-violet-400/10 bg-white/5 px-4 py-3 text-sm font-medium text-neutral-200 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
              >
                {category}
              </div>
            ))}
          </div>
        </section>

        <div className="mb-10 h-px w-full bg-gradient-to-r from-violet-500/0 via-violet-400/40 to-violet-500/0" />

        <section className="mb-10 rounded-3xl border border-violet-400/10 bg-white/5 p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-white">
            Documentary &amp; Docuseries
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            <strong className="text-white">
              Over two decades of documentary and educational editorial
              experience, with hundreds of projects completed across long-form
              series, feature-length documentaries, and large-scale course
              productions.
            </strong>{" "}
            Work spans collaborations with{" "}
            <strong className="text-violet-200">PBS</strong>,{" "}
            <strong className="text-violet-200">National Geographic</strong>,{" "}
            <strong className="text-violet-200">Smithsonian</strong>, and{" "}
            <strong className="text-violet-200">The Great Courses</strong>,
            covering subjects from history, science, and culture to technology,
            travel, and the arts.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="group rounded-2xl border border-violet-400/20 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300/40 hover:bg-neutral-900 md:col-span-2">
              <p className="mb-2 text-xs uppercase tracking-widest text-violet-300">
                Emmy Winner
              </p>
              <h3 className="text-xl font-medium text-white">
                <strong className="text-violet-200">
                  Weaving Nature (PBS American Masters)
                </strong>
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Emmy-recognized documentary work connected to PBS American
                Masters, representing high-level editorial storytelling within a
                prestige documentary framework.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900">
              <h3 className="text-xl font-medium text-white">
                <strong className="text-violet-200">
                  Reporting 9/11 and Why It Still Matters
                </strong>
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Feature-length documentary featuring major broadcast journalists
                reflecting on reporting through 9/11.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900">
              <h3 className="text-xl font-medium text-white">
                <strong className="text-violet-200">
                  The Banjo: Music, History, and Heritage
                </strong>
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                A multi-episode series hosted by Rhiannon Giddens exploring the
                roots and evolution of American music.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900">
              <h3 className="text-xl font-medium text-white">
                <strong className="text-violet-200">
                  John Lewis: Witness to History
                </strong>
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Webby Award winning documentary that walks in the inspiring footsteps
                of one of the most impactful leaders in America’s civil rights movement.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900">
              <h3 className="text-xl font-semibold leading-tight tracking-tight text-white">
                <strong className="text-violet-200">
                  Decorate like a Designer, with Jonathan Adler
                </strong>
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-300 transition group-hover:text-neutral-200">
                Master potter and designer Jonathan Adler leads a unique 13-episode series exploring
                how design and decoration can be used to express your personal style and brand.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-violet-400/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">
            YouTube &amp; Short-Form Content
          </h2>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            Extensive experience crafting content for <strong>YouTube</strong>,{" "}
            <strong>digital platforms</strong>, and{" "}
            <strong>short-form media</strong>, with a focus on{" "}
            <strong className="text-violet-200">engagement</strong>,{" "}
            <strong className="text-violet-200">retention</strong>, and{" "}
            <strong className="text-violet-200">
              clarity of storytelling
            </strong>
            .
          </p>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            Work includes editorial and finishing across educational videos,
            branded content, promotional cuts, and fast-turnaround social media
            pieces — combining traditional storytelling instincts with modern
            pacing, graphics, and platform-specific optimization.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">
                Platform-Focused Editing
              </h3>
              <p className="mt-3 text-sm text-neutral-300">
                Tailored edits for YouTube, social, and digital platforms with
                an emphasis on audience retention and flow.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">
                Short-Form Storytelling
              </h3>
              <p className="mt-3 text-sm text-neutral-300">
                Condensing narrative, clarity, and impact into highly efficient
                short-form content.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">
                Modern Post Workflow
              </h3>
              <p className="mt-3 text-sm text-neutral-300">
                Fast-turnaround pipelines integrating motion, graphics, and
                AI-assisted tools for scalable production.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-violet-400/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">Feature Film</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-300">
            Narrative and feature-length storytelling with a focus on{" "}
            <strong>character</strong>, <strong>timing</strong>, and{" "}
            <strong>editorial rhythm</strong>.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-neutral-900/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-neutral-900">
            <h3 className="text-xl font-medium text-white">
              <strong className="text-violet-200">Mock &amp; Roll</strong>
            </h3>
            <p className="mt-3 text-sm leading-7 text-neutral-300">
              Multi-award-winning mockumentary feature film. Served as{" "}
              <strong>Director and Editor</strong>.
            </p>
          </div>
        </section>

        <section className="mb-10 rounded-3xl border border-violet-400/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold text-white">
            Selected Series, Clients &amp; Institutions
          </h2>
          <p className="mt-4 text-base leading-8 text-neutral-300">
            A broad body of work across educational programming, documentary
            series, branded storytelling, and digital media — including
            collaborations with{" "}
            <strong className="text-violet-200">
              The Culinary Institute of America
            </strong>
            , <strong className="text-violet-200">National Geographic</strong>,{" "}
            <strong className="text-violet-200">Smithsonian</strong>, and large
            course libraries such as <strong>The Great Tours</strong>,{" "}
            <strong>Foundations of Eastern Civilization</strong>,{" "}
            <strong>America&apos;s Musical Heritage</strong>, and a wide range
            of <strong>science</strong>, <strong>history</strong>,{" "}
            <strong>language</strong>, and <strong>cultural</strong> programs.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">
                Highlighted Areas
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-neutral-300">
                <li>Science / Math</li>
                <li>History</li>
                <li>Music</li>
                <li>Arts &amp; Culture</li>
                <li>Travel</li>
                <li>Food &amp; Culinary</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">
                Additional Categories
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-neutral-300">
                <li>Language</li>
                <li>Business / Financial</li>
                <li>Technology</li>
                <li>Educational Content</li>
                <li>Corporate / Branded</li>
                <li>Social / Digital</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-neutral-900/70 p-6">
              <h3 className="text-lg font-semibold text-white">Other Work</h3>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-neutral-300">
                <li>Music Videos</li>
                <li>Non-Profit Storytelling</li>
                <li>Feature Film</li>
                <li>Promo / Trailer Editing</li>
                <li>Long-Form Series Work</li>
                <li>Post Workflow Support</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-14">
  <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
    Visual Highlights
  </p>

  <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
    A glimpse into the work.
  </h2>

  <div className="mt-10 grid grid-cols-1 gap-2 md:grid-cols-12 auto-rows-auto">
    {galleryItems.map((item) => {
      const tileClasses = getTileClasses(item);

      if (item.kind === "pair") {
        return (
          <div key={item.images[0].src} className={tileClasses}>
            {item.images.map((img) => (
              <button
                key={img.src}
                type="button"
                onClick={() => openLightboxBySrc(img.src)}
                className="overflow-hidden rounded-2xl border border-white/5 text-left cursor-zoom-in"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  onLoad={(e) => registerShape(img.src, e.currentTarget)}
                  className="h-[320px] md:h-[420px] w-full object-contain transition duration-500 hover:scale-105"
                />
              </button>
            ))}
          </div>
        );
      }

      if (item.kind === "video") {
        return (
          <div
            key={item.src}
            className={`relative overflow-hidden rounded-2xl border border-white/5 ${tileClasses}`}
          >
            <video
              src={item.src}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain"
            />
          </div>
        );
      }

      const isTimeline =
        item.featured === "top" || item.featured === "bottom";

      return (
        <button
          key={item.src}
          type="button"
          onClick={() => openLightboxBySrc(item.src)}
          className={`overflow-hidden rounded-2xl border border-white/5 text-left cursor-zoom-in ${tileClasses}`}
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            onLoad={(e) => registerShape(item.src, e.currentTarget)}
            className={
              isTimeline
                ? "w-full h-auto object-contain transition duration-500 hover:scale-105"
                : "h-full w-full object-contain transition duration-500 hover:scale-105"
            }
          />
        </button>
      );
    })}
  </div>
</section>

        <section className="rounded-3xl border border-violet-400/10 bg-white/5 p-8">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-violet-300/80">
            Explore More
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Want the full credit range?
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            This page highlights selected work, but Ben&apos;s broader portfolio
            includes extensive credits across documentary, educational,
            institutional, branded, and digital media projects.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="https://www.imdb.com/name/nm3118409/?ref_=nv_sr_srsg_0_tt_2_nm_6_in_0_q_ben%20bacharach"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:opacity-90"
            >
              View IMDb
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
              href="mailto:hello@doubledagproductions.com"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Get in Touch
            </a>

            <Link
              href="/pricing"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10"
            >
              View Pricing
            </Link>

            <Link
              href="/research"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 px-6 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Research Services
            </Link>
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
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import bannerWeb from "../public/Banner-web.png";

export default function Header() {
  const pathname = usePathname();
  const isPortfolio =
    pathname === "/portfolio" || pathname.startsWith("/portfolio/");
  const [collapsed, setCollapsed] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (!isPortfolio) {
      setCollapsed(false);
      return;
    }

    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;

      if (y < 16) {
        setCollapsed(false);
      } else if (delta > 6) {
        setCollapsed(true);
      } else if (delta < -6) {
        setCollapsed(false);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPortfolio]);

  const linkClass = (href: string) =>
    `transition ${
      pathname === href
        ? "text-violet-300"
        : "text-neutral-300 hover:text-white"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        isPortfolio && collapsed ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="relative w-full">
        <Link href="/" className="inline-block max-w-full">
          <Image
            src={bannerWeb}
            alt="Double Dag Productions"
            priority
            sizes="100vw"
            className="banner-web-mask h-auto w-auto max-h-[72px] max-w-full"
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        <div className="border-t border-white/10 bg-neutral-950 px-6 py-3 md:pointer-events-none md:absolute md:inset-0 md:border-t-0 md:bg-transparent md:px-0 md:py-0">
          <div className="mx-auto flex max-w-6xl items-center justify-end md:h-full md:px-10 lg:px-16">
            <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm md:pointer-events-auto md:gap-x-5">
              <Link href="/" className={linkClass("/")}>
                Home
              </Link>
              <Link href="/creators" className={linkClass("/creators")}>
                Creators
              </Link>
              <Link href="/filmography" className={linkClass("/filmography")}>
                Filmography
              </Link>
              <Link href="/research" className={linkClass("/research")}>
                Research
              </Link>
              <Link
                href="/creative-technologist"
                className={linkClass("/creative-technologist")}
              >
                Creative Technologist
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

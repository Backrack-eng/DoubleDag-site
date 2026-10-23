"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import bannerWeb from "../public/Banner-web.png";

export default function Header() {
  const pathname = usePathname();

  const linkClass = (href: string) =>
    `transition ${
      pathname === href
        ? "text-violet-300"
        : "text-neutral-300 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950">
      <div className="relative w-full">
        <Link href="/" className="block">
          <Image
            src={bannerWeb}
            alt="Double Dag Productions"
            priority
            sizes="100vw"
            className="banner-web-mask h-[clamp(48px,7.55vw,72px)] w-full object-contain object-left"
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
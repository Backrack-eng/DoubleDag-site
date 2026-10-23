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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-16">
        <Link href="/" className="group min-w-0 flex-1">
          <Image
            src={bannerWeb}
            alt="Double Dag Productions"
            priority
            sizes="520px"
            className="h-auto w-full max-w-[520px] object-contain object-left transition duration-300 group-hover:opacity-80"
          />
        </Link>

        <nav className="flex shrink-0 flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm">
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
    </header>
  );
}
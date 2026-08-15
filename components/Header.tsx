"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/banner2.png"
            alt="Double Dag Productions"
            width={640}
            height={160}
            className="object-contain transition duration-300 group-hover:opacity-80"
          />
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/filmography" className={linkClass("/filmography")}>
            Filmography
          </Link>
          <Link href="/research" className={linkClass("/research")}>
            Research
          </Link>
        </nav>
      </div>
    </header>
  );
}
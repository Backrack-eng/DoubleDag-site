import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { CONTENT_PAGES } from "../../lib/content/registry";

export default async function AdminIndexPage() {
  await connection();
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
          Local Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Editable pages
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-400">
          Content editors write JSON under{" "}
          <code className="text-neutral-300">lib/content/</code>. Commit and
          deploy to publish. Portfolio videos still use the dedicated editor.
        </p>

        <ul className="mt-10 space-y-3">
          {CONTENT_PAGES.map((page) => (
            <li key={page.key}>
              <Link
                href={`/admin/content/${page.key}`}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-violet-400/30 hover:bg-violet-500/5"
              >
                <span>
                  <span className="block text-base font-medium text-white">
                    {page.label}
                  </span>
                  <span className="mt-1 block text-xs text-neutral-500">
                    {page.href} · lib/content/{page.fileName}
                  </span>
                </span>
                <span className="text-sm text-violet-300">Edit →</span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/admin/home-featured"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-violet-400/30 hover:bg-violet-500/5"
            >
              <span>
                <span className="block text-base font-medium text-white">
                  Home Featured Work
                </span>
                <span className="mt-1 block text-xs text-neutral-500">
                  / · lib/home-featured.json
                </span>
              </span>
              <span className="text-sm text-violet-300">Edit →</span>
            </Link>
          </li>
          <li>
            <Link
              href="/admin/portfolio"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-violet-400/30 hover:bg-violet-500/5"
            >
              <span>
                <span className="block text-base font-medium text-white">
                  Portfolio videos
                </span>
                <span className="mt-1 block text-xs text-neutral-500">
                  /portfolio · lib/portfolio-overrides.json
                </span>
              </span>
              <span className="text-sm text-violet-300">Open →</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

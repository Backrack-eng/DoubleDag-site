"use client";

import { useEffect, useState, type DragEvent } from "react";
import Link from "next/link";
import type { HomeFeaturedEntry } from "../../../lib/home-featured";
import { moveItemInList } from "../lib/drag-reorder";

type CatalogItem = {
  uid: string;
  title: string;
  thumbnailUrl: string;
  caption: string;
  emmyBadge: boolean;
  source: "stream" | "youtube";
};

type Row = {
  uid: string;
  catalogTitle: string;
  catalogCaption: string;
  catalogEmmy: boolean;
  thumbnailUrl: string;
  title?: string;
  caption?: string;
  emmyBadge?: boolean;
  /** Present in home-featured.json on load. */
  inFile: boolean;
  /** Edited, moved, or otherwise needs a JSON entry. */
  dirty: boolean;
};

type SectionId = "featured" | "hidden";

type Groups = {
  featured: Row[];
  hidden: Row[];
};

type DragState = { section: SectionId; index: number };

const SECTIONS: { id: SectionId; title: string; hint: string }[] = [
  {
    id: "featured",
    title: "Featured on Home",
    hint: "Shown in Featured Work on the home page, in this order. Drag to reorder or move to Hidden.",
  },
  {
    id: "hidden",
    title: "Hidden (not on home)",
    hint: "Every portfolio Stream/YouTube video not currently featured. Drag to Featured, or use Add to Home. Untouched videos are not written to home-featured.json.",
  },
];

function hasOverrides(row: Row): boolean {
  if (typeof row.title === "string" && row.title.trim()) {
    return true;
  }
  if (typeof row.caption === "string" && row.caption.trim()) {
    return true;
  }
  return typeof row.emmyBadge === "boolean";
}

function shouldPersist(row: Row, section: SectionId): boolean {
  if (section === "featured") {
    return true;
  }
  return row.inFile || row.dirty || hasOverrides(row);
}

function toEntry(row: Row, order: number, hidden: boolean): HomeFeaturedEntry {
  const entry: HomeFeaturedEntry = { uid: row.uid, order };
  if (hidden) {
    entry.hidden = true;
  }
  if (typeof row.title === "string" && row.title.trim()) {
    entry.title = row.title.trim();
  }
  if (typeof row.caption === "string" && row.caption.trim()) {
    entry.caption = row.caption;
  }
  if (typeof row.emmyBadge === "boolean") {
    entry.emmyBadge = row.emmyBadge;
  }
  return entry;
}

function catalogToRow(item: CatalogItem, entry?: HomeFeaturedEntry): Row {
  return {
    uid: item.uid,
    catalogTitle: item.title,
    catalogCaption: item.caption,
    catalogEmmy: item.emmyBadge,
    thumbnailUrl: item.thumbnailUrl,
    title: entry?.title,
    caption: entry?.caption,
    emmyBadge: entry?.emmyBadge,
    inFile: Boolean(entry),
    dirty: false,
  };
}

function cloneGroups(current: Groups): Groups {
  return {
    featured: [...current.featured],
    hidden: [...current.hidden],
  };
}

export default function HomeFeaturedEditor() {
  const [groups, setGroups] = useState<Groups>({ featured: [], hidden: [] });
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/admin/home-featured", {
          cache: "no-store",
        });
        const data: unknown = await response.json();
        if (!response.ok) {
          const errorMessage =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : `Failed to load (${response.status})`;
          if (!cancelled) {
            setStatus("error");
            setMessage(errorMessage);
          }
          return;
        }

        const payload = data as {
          entries?: HomeFeaturedEntry[];
          catalog?: CatalogItem[];
        };
        const catalog = Array.isArray(payload.catalog) ? payload.catalog : [];
        const entries = Array.isArray(payload.entries) ? payload.entries : [];
        const entryByUid = new Map(entries.map((entry) => [entry.uid, entry]));
        const featuredUids = new Set(
          entries.filter((entry) => !entry.hidden).map((entry) => entry.uid),
        );

        const featured = [...entries]
          .filter((entry) => !entry.hidden)
          .sort((a, b) => a.order - b.order)
          .flatMap((entry) => {
            const item = catalog.find((video) => video.uid === entry.uid);
            if (!item) {
              return [];
            }
            return [catalogToRow(item, entry)];
          });

        const hidden = catalog
          .filter((item) => !featuredUids.has(item.uid))
          .map((item) => catalogToRow(item, entryByUid.get(item.uid)))
          .sort((a, b) => a.catalogTitle.localeCompare(b.catalogTitle));

        if (!cancelled) {
          setGroups({ featured, hidden });
          setStatus("ready");
          setMessage(null);
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Failed to load home featured list.");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateRow(section: SectionId, uid: string, patch: Partial<Row>) {
    setGroups((current) => ({
      ...current,
      [section]: current[section].map((row) =>
        row.uid === uid ? { ...row, ...patch, dirty: true } : row,
      ),
    }));
  }

  function moveToSection(from: SectionId, index: number, to: SectionId) {
    if (from === to) {
      return;
    }
    setGroups((current) => {
      const next = cloneGroups(current);
      const [moved] = next[from].splice(index, 1);
      if (!moved) {
        return current;
      }
      next[to].push({ ...moved, dirty: true });
      return next;
    });
  }

  function handleDragStart(
    section: SectionId,
    index: number,
    event: DragEvent<HTMLTableRowElement>,
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
    setDrag({ section, index });
  }

  function handleDragOver(
    section: SectionId,
    index: number,
    event: DragEvent<HTMLTableRowElement>,
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (!drag || (drag.section === section && drag.index === index)) {
      return;
    }

    setGroups((current) => {
      const moving = current[drag.section][drag.index];
      if (!moving) {
        return current;
      }

      const next = cloneGroups(current);
      if (drag.section === section) {
        next[section] = moveItemInList(next[section], drag.index, index).map(
          (row) => ({ ...row, dirty: true }),
        );
        return next;
      }

      const [moved] = next[drag.section].splice(drag.index, 1);
      if (!moved) {
        return current;
      }
      next[section].splice(index, 0, { ...moved, dirty: true });
      return next;
    });
    setDrag({ section, index });
  }

  function handleDragEnd() {
    setDrag(null);
  }

  async function saveChanges() {
    setSaving(true);
    setMessage(null);
    try {
      const entries: HomeFeaturedEntry[] = [];
      groups.featured.forEach((row, index) => {
        entries.push(toEntry(row, index * 10, false));
      });
      const hiddenStart = groups.featured.length * 10 + 1000;
      groups.hidden.forEach((row, index) => {
        if (shouldPersist(row, "hidden")) {
          entries.push(toEntry(row, hiddenStart + index * 10, true));
        }
      });

      const response = await fetch("/api/admin/home-featured", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        const errorMessage =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : `Save failed (${response.status})`;
        setMessage(errorMessage);
        return;
      }

      setGroups((current) => ({
        featured: current.featured.map((row) => ({
          ...row,
          inFile: true,
          dirty: false,
        })),
        hidden: current.hidden.map((row) => ({
          ...row,
          inFile: shouldPersist(row, "hidden"),
          dirty: false,
        })),
      }));
      setMessage("Saved");
      window.setTimeout(() => {
        setMessage((current) => (current === "Saved" ? null : current));
      }, 2000);
    } catch {
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function renderRow(section: SectionId, row: Row, index: number) {
    return (
      <tr
        key={row.uid}
        draggable={true}
        onDragStart={(event) => handleDragStart(section, index, event)}
        onDragOver={(event) => handleDragOver(section, index, event)}
        onDragEnd={handleDragEnd}
        className={`border-b border-white/10 last:border-b-0 ${
          drag?.section === section && drag.index === index ? "opacity-40" : ""
        }`}
      >
        <td className="w-8 px-0 py-3 align-middle">
          <div
            className="cursor-grab select-none px-2 text-neutral-500"
            aria-label={`Reorder ${row.catalogTitle}`}
          >
            ⠿
          </div>
        </td>
        <td className="px-4 py-3 align-middle">
          <div className="flex items-center gap-3">
            {row.thumbnailUrl ? (
              <img
                src={row.thumbnailUrl}
                alt=""
                className="h-12 w-20 rounded object-cover"
                draggable={false}
              />
            ) : (
              <div className="h-12 w-20 rounded bg-neutral-800" />
            )}
            <div>
              <p className="font-medium text-neutral-100">{row.catalogTitle}</p>
              <code className="font-mono text-[10px] text-neutral-500">
                {row.uid}
              </code>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 align-middle">
          <input
            type="text"
            value={row.title ?? ""}
            placeholder={row.catalogTitle}
            draggable={false}
            onPointerDown={(event) => event.stopPropagation()}
            onChange={(event) =>
              updateRow(section, row.uid, { title: event.target.value })
            }
            className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-neutral-100 outline-none focus:border-violet-400/60"
            aria-label={`Title override for ${row.catalogTitle}`}
          />
        </td>
        <td className="px-4 py-3 align-middle">
          <textarea
            value={row.caption ?? ""}
            placeholder={
              row.catalogCaption || "Falls back to portfolio caption"
            }
            rows={3}
            draggable={false}
            onPointerDown={(event) => event.stopPropagation()}
            onChange={(event) =>
              updateRow(section, row.uid, { caption: event.target.value })
            }
            className="w-full resize-y rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm leading-6 text-neutral-100 outline-none focus:border-violet-400/60"
            aria-label={`Caption for ${row.catalogTitle}`}
          />
        </td>
        <td className="w-20 px-4 py-3 text-center align-middle">
          <input
            type="checkbox"
            checked={
              typeof row.emmyBadge === "boolean"
                ? row.emmyBadge
                : row.catalogEmmy
            }
            onChange={(event) =>
              updateRow(section, row.uid, {
                emmyBadge: event.target.checked,
              })
            }
            aria-label={`Emmy badge ${row.catalogTitle}`}
          />
        </td>
        <td className="w-32 px-4 py-3 text-right align-middle">
          {section === "featured" ? (
            <button
              type="button"
              onClick={() => moveToSection("featured", index, "hidden")}
              className="text-xs font-medium text-neutral-300 underline decoration-white/20 underline-offset-2 hover:text-white"
            >
              Hide
            </button>
          ) : (
            <button
              type="button"
              onClick={() => moveToSection("hidden", index, "featured")}
              className="text-xs font-medium text-violet-300 underline decoration-violet-300/40 underline-offset-2 hover:text-violet-200"
            >
              Add to Home
            </button>
          )}
        </td>
      </tr>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <div className="sticky top-[5.5rem] z-40 -mx-6 mb-8 border-b border-white/10 bg-neutral-950/95 px-6 py-4 backdrop-blur-md sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
                Local Admin
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Home Featured Work
              </h1>
              <p className="mt-1 text-xs text-neutral-500">
                Independent of /portfolio order. Blank title/caption fall back
                to portfolio overrides.{" "}
                <Link
                  href="/"
                  className="text-violet-300 underline decoration-violet-300/40 underline-offset-2 hover:text-violet-200"
                >
                  View home
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {message && (
                <p
                  className={`text-sm ${
                    message === "Saved" ? "text-emerald-300" : "text-red-300"
                  }`}
                >
                  {message}
                </p>
              )}
              <button
                type="button"
                disabled={saving || status !== "ready"}
                onClick={() => void saveChanges()}
                className="rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {status === "loading" && (
          <p className="text-sm text-neutral-400">Loading…</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-300">{message ?? "Failed to load."}</p>
        )}

        {status === "ready" &&
          SECTIONS.map((section) => (
            <section key={section.id} className="mb-10">
              <div className="mb-3">
                <h2 className="text-sm uppercase tracking-[0.3em] text-violet-300/80">
                  {section.title}
                  <span className="ml-2 text-neutral-500">
                    ({groups[section.id].length})
                  </span>
                </h2>
                <p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-500">
                  {section.hint}
                </p>
              </div>
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                  <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="w-8 px-2 py-3 font-medium">
                        <span className="sr-only">Reorder</span>
                      </th>
                      <th className="px-4 py-3 font-medium">Video</th>
                      <th className="px-4 py-3 font-medium">Title override</th>
                      <th className="px-4 py-3 font-medium">Caption</th>
                      <th className="w-20 px-4 py-3 font-medium">Emmy</th>
                      <th className="w-32 px-4 py-3 font-medium">
                        <span className="sr-only">Move</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    onDragOver={(event) => {
                      if (groups[section.id].length === 0) {
                        event.preventDefault();
                      }
                    }}
                    onDrop={(event) => {
                      event.preventDefault();
                      if (!drag || drag.section === section.id) {
                        return;
                      }
                      moveToSection(drag.section, drag.index, section.id);
                      setDrag(null);
                    }}
                  >
                    {groups[section.id].length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-sm text-neutral-500"
                        >
                          {section.id === "featured"
                            ? "Nothing featured yet. Drag a video up from Hidden, or use Add to Home."
                            : "No other videos."}
                        </td>
                      </tr>
                    )}
                    {groups[section.id].map((row, index) =>
                      renderRow(section.id, row, index),
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

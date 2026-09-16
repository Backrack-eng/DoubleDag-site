"use client";

import { useEffect, useState, type DragEvent } from "react";

export const dynamic = "force-dynamic";

type OverrideRow = {
  uid: string;
  title: string;
  order: number;
  hidden?: boolean;
  featured?: boolean;
  emmyBadge?: boolean;
  [key: string]: unknown;
};

type SectionId = "demo" | "highlight" | "selected" | "hidden";

type Groups = Record<SectionId, OverrideRow[]>;

type DragState = { section: SectionId; index: number };

const SECTIONS: {
  id: SectionId;
  title: string;
  hint: string;
}[] = [
  {
    id: "demo",
    title: "Demo Reels",
    hint: "The clip whose title includes “2023” is the large purple reel. Any other featured clip is the smaller archive reel.",
  },
  {
    id: "highlight",
    title: "Featured Work",
    hint: "Up to three clips. These are the first landscape videos after the demo reels.",
  },
  {
    id: "selected",
    title: "Selected Work",
    hint: "Remaining landscape clips on the portfolio page.",
  },
  {
    id: "hidden",
    title: "Hidden",
    hint: "Not shown on the portfolio page.",
  },
];

const SECTION_OPTIONS: { id: SectionId; label: string }[] = [
  { id: "demo", label: "Demo Reel" },
  { id: "highlight", label: "Featured Work" },
  { id: "selected", label: "Selected Work" },
  { id: "hidden", label: "Hidden" },
];

function toRows(data: Record<string, object>): OverrideRow[] {
  return Object.entries(data).map(([uid, entry]) => ({
    uid,
    ...entry,
  })) as OverrideRow[];
}

function partitionRows(rows: OverrideRow[]): Groups {
  const sorted = [...rows].sort((a, b) => a.order - b.order);
  const hidden = sorted.filter((row) => row.hidden);
  const demo = sorted.filter((row) => !row.hidden && row.featured);
  const rest = sorted.filter((row) => !row.hidden && !row.featured);

  return {
    demo,
    highlight: rest.slice(0, 3),
    selected: rest.slice(3),
    hidden,
  };
}

function capHighlight(groups: Groups): Groups {
  if (groups.highlight.length <= 3) {
    return groups;
  }

  return {
    ...groups,
    highlight: groups.highlight.slice(0, 3),
    selected: [...groups.highlight.slice(3), ...groups.selected],
  };
}

function toOverridesObject(groups: Groups) {
  const ordered: OverrideRow[] = [
    ...groups.demo.map((row) => ({ ...row, featured: true, hidden: false })),
    ...groups.highlight.map((row) => ({
      ...row,
      featured: false,
      hidden: false,
    })),
    ...groups.selected.map((row) => ({
      ...row,
      featured: false,
      hidden: false,
    })),
    ...groups.hidden.map((row) => ({ ...row, featured: false, hidden: true })),
  ].map((row, index) => ({ ...row, order: index * 10 }));

  return Object.fromEntries(
    ordered.map(({ uid, ...rest }) => {
      const entry: Record<string, unknown> = { ...rest };
      if (!entry.featured) {
        delete entry.featured;
      }
      if (!entry.hidden) {
        delete entry.hidden;
      }
      if (!entry.emmyBadge) {
        delete entry.emmyBadge;
      }
      return [uid, entry];
    }),
  );
}

function reelRole(row: OverrideRow, demo: OverrideRow[]) {
  const main =
    demo.find((item) => item.title.toLowerCase().includes("2023")) ?? demo[0];
  if (!main) {
    return "";
  }
  return row.uid === main.uid ? "Main reel" : "Archive reel";
}

export default function PortfolioAdminPage() {
  const [groups, setGroups] = useState<Groups>({
    demo: [],
    highlight: [],
    selected: [],
    hidden: [],
  });
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
        const response = await fetch("/api/admin/overrides", {
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
              : `Failed to load overrides (${response.status})`;
          if (!cancelled) {
            setStatus("error");
            setMessage(errorMessage);
          }
          return;
        }

        if (data === null || typeof data !== "object" || Array.isArray(data)) {
          if (!cancelled) {
            setStatus("error");
            setMessage("Unexpected overrides payload.");
          }
          return;
        }

        if (!cancelled) {
          setGroups(partitionRows(toRows(data as Record<string, object>)));
          setStatus("ready");
          setMessage(null);
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Failed to load overrides.");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateRow(section: SectionId, uid: string, patch: Partial<OverrideRow>) {
    setGroups((current) => ({
      ...current,
      [section]: current[section].map((row) =>
        row.uid === uid ? { ...row, ...patch } : row,
      ),
    }));
  }

  function moveToSection(from: SectionId, index: number, to: SectionId) {
    if (from === to) {
      return;
    }

    setGroups((current) => {
      const next: Groups = {
        demo: [...current.demo],
        highlight: [...current.highlight],
        selected: [...current.selected],
        hidden: [...current.hidden],
      };
      const [moved] = next[from].splice(index, 1);
      if (!moved) {
        return current;
      }
      next[to].push(moved);
      return capHighlight(next);
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
      const next: Groups = {
        demo: [...current.demo],
        highlight: [...current.highlight],
        selected: [...current.selected],
        hidden: [...current.hidden],
      };

      const [moved] = next[drag.section].splice(drag.index, 1);
      if (!moved) {
        return current;
      }

      next[section].splice(index, 0, moved);
      return next;
    });
    setDrag({ section, index });
  }

  function handleDragEnd() {
    setDrag(null);
    setGroups((current) => capHighlight(current));
  }

  async function saveChanges() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toOverridesObject(groups)),
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

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <div className="sticky top-[5.5rem] z-40 -mx-6 mb-8 border-b border-white/10 bg-neutral-950/95 px-6 py-4 backdrop-blur-md sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Portfolio Video Editor (local only)
              </h1>
              <p className="mt-1 text-xs text-neutral-500">
                Vertical clips still appear under Social / Vertical on the
                public page.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {message && (
                <p
                  className={
                    message === "Saved"
                      ? "text-sm text-violet-300"
                      : "text-sm text-red-400"
                  }
                >
                  {message}
                </p>
              )}
              <button
                type="button"
                onClick={() => void saveChanges()}
                disabled={saving || status !== "ready"}
                className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        {status === "loading" && (
          <p className="text-sm text-neutral-400">Loading overrides…</p>
        )}

        {status === "error" && message && (
          <p className="text-sm text-red-400">{message}</p>
        )}

        {status === "ready" && (
          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <section key={section.id}>
                <div className="mb-3">
                  <h2 className="text-sm uppercase tracking-[0.3em] text-violet-300/80">
                    {section.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-500">
                    {section.hint}
                  </p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-neutral-400">
                      <tr>
                        <th className="w-8 px-2 py-3 font-medium">
                          <span className="sr-only">Reorder</span>
                        </th>
                        <th className="px-4 py-3 font-medium">UID</th>
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium">Section</th>
                        <th className="px-4 py-3 font-medium">Emmy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups[section.id].length === 0 && (
                        <tr
                          onDragOver={(event) =>
                            handleDragOver(section.id, 0, event)
                          }
                        >
                          <td
                            colSpan={5}
                            className="px-4 py-6 text-sm text-neutral-500"
                          >
                            No videos in this section.
                          </td>
                        </tr>
                      )}
                      {groups[section.id].map((row, i) => (
                        <tr
                          key={row.uid}
                          draggable={true}
                          onDragStart={(event) =>
                            handleDragStart(section.id, i, event)
                          }
                          onDragOver={(event) =>
                            handleDragOver(section.id, i, event)
                          }
                          onDragEnd={handleDragEnd}
                          className={`border-b border-white/10 last:border-b-0 ${
                            drag?.section === section.id && drag.index === i
                              ? "opacity-40"
                              : ""
                          }`}
                        >
                          <td className="w-8 px-0 py-3 align-middle">
                            <div
                              className="cursor-grab select-none px-2 text-neutral-500"
                              aria-label={`Reorder ${row.title}`}
                            >
                              ⠿
                            </div>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <code className="font-mono text-xs text-neutral-500">
                              {row.uid}
                            </code>
                          </td>
                          <td className="px-4 py-3 align-middle">
                            <input
                              type="text"
                              value={row.title}
                              onChange={(event) =>
                                updateRow(section.id, row.uid, {
                                  title: event.target.value,
                                })
                              }
                              className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-neutral-100 outline-none focus:border-violet-400/60"
                            />
                            {section.id === "demo" && (
                              <p className="mt-1 text-xs text-violet-300/80">
                                {reelRole(row, groups.demo)}
                              </p>
                            )}
                          </td>
                          <td className="w-48 px-4 py-3 align-middle">
                            <select
                              value={section.id}
                              onChange={(event) =>
                                moveToSection(
                                  section.id,
                                  i,
                                  event.target.value as SectionId,
                                )
                              }
                              aria-label={`Section for ${row.title}`}
                              className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-neutral-100 outline-none focus:border-violet-400/60"
                            >
                              {SECTION_OPTIONS.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="w-20 px-4 py-3 text-center align-middle">
                            <input
                              type="checkbox"
                              checked={Boolean(row.emmyBadge)}
                              onChange={(event) =>
                                updateRow(section.id, row.uid, {
                                  emmyBadge: event.target.checked,
                                })
                              }
                              aria-label={`Emmy badge ${row.title}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

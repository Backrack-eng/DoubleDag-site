"use client";

import { useEffect, useState, type DragEvent } from "react";

export const dynamic = "force-dynamic";

type OverrideRow = {
  uid: string;
  title: string;
  order: number;
  hidden?: boolean;
  featured?: boolean;
  [key: string]: unknown;
};

function toRows(data: Record<string, object>): OverrideRow[] {
  return Object.entries(data).map(([uid, entry]) => ({
    uid,
    ...entry,
  })) as OverrideRow[];
}

function toOverridesObject(rows: OverrideRow[]) {
  return Object.fromEntries(
    rows.map(({ uid, ...rest }) => [uid, rest]),
  );
}

export default function PortfolioAdminPage() {
  const [rows, setRows] = useState<OverrideRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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

        if (
          data === null ||
          typeof data !== "object" ||
          Array.isArray(data)
        ) {
          if (!cancelled) {
            setStatus("error");
            setMessage("Unexpected overrides payload.");
          }
          return;
        }

        if (!cancelled) {
          setRows(
            toRows(data as Record<string, object>).sort(
              (a, b) => a.order - b.order,
            ),
          );
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

  function updateRow(uid: string, patch: Partial<OverrideRow>) {
    setRows((current) =>
      current.map((row) => (row.uid === uid ? { ...row, ...patch } : row)),
    );
  }

  function handleDragStart(index: number, event: DragEvent<HTMLTableRowElement>) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
    setDraggedIndex(index);
  }

  function handleDragOver(index: number, event: DragEvent<HTMLTableRowElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    setRows((current) => {
      const next = [...current];
      const [moved] = next.splice(draggedIndex, 1);
      next.splice(index, 0, moved);
      return next;
    });
    setDraggedIndex(index);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
    setRows((current) =>
      current.map((row, index) => ({ ...row, order: index * 10 })),
    );
  }

  async function saveChanges() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toOverridesObject(rows)),
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
            <h1 className="text-2xl font-semibold tracking-tight">
              Portfolio Video Editor (local only)
            </h1>
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
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-neutral-400">
                <tr>
                  <th className="w-8 px-2 py-3 font-medium">
                    <span className="sr-only">Reorder</span>
                  </th>
                  <th className="px-4 py-3 font-medium">UID</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Hidden</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.uid}
                    draggable={true}
                    onDragStart={(event) => handleDragStart(i, event)}
                    onDragOver={(event) => handleDragOver(i, event)}
                    onDragEnd={handleDragEnd}
                    className={`border-b border-white/10 last:border-b-0 ${
                      i === draggedIndex ? "opacity-40" : ""
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
                          updateRow(row.uid, { title: event.target.value })
                        }
                        className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-neutral-100 outline-none focus:border-violet-400/60"
                      />
                    </td>
                    <td className="w-20 px-4 py-3 align-middle tabular-nums text-neutral-400">
                      {row.order}
                    </td>
                    <td className="w-20 px-4 py-3 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={Boolean(row.hidden)}
                        onChange={(event) =>
                          updateRow(row.uid, { hidden: event.target.checked })
                        }
                        aria-label={`Hidden ${row.title}`}
                      />
                    </td>
                    <td className="w-24 px-4 py-3 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={Boolean(row.featured)}
                        onChange={(event) =>
                          updateRow(row.uid, {
                            featured: event.target.checked,
                          })
                        }
                        aria-label={`Featured ${row.title}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

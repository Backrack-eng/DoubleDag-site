"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type DragEvent,
} from "react";
import type {
  PortfolioRecommendation,
  RecommendationColor,
} from "../../../lib/portfolio-recommendations";

export type RecommendationsEditorHandle = {
  save: () => Promise<{ ok: boolean; error?: string }>;
};

type DragState = { index: number };

function blankRecommendation(): PortfolioRecommendation {
  return {
    id: `rec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    quote: "",
    attribution: "",
    color: "white",
    hidden: false,
  };
}

export const RecommendationsEditor = forwardRef<RecommendationsEditorHandle>(
  function RecommendationsEditor(_props, ref) {
    const [items, setItems] = useState<PortfolioRecommendation[]>([]);
    const [status, setStatus] = useState<"loading" | "ready" | "error">(
      "loading",
    );
    const [message, setMessage] = useState<string | null>(null);
    const [drag, setDrag] = useState<DragState | null>(null);

    useEffect(() => {
      let cancelled = false;

      async function load() {
        try {
          const response = await fetch("/api/admin/portfolio-recommendations", {
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

          const list =
            typeof data === "object" &&
            data !== null &&
            "recommendations" in data &&
            Array.isArray(
              (data as { recommendations: unknown }).recommendations,
            )
              ? ((data as { recommendations: PortfolioRecommendation[] })
                  .recommendations)
              : [];

          if (!cancelled) {
            setItems(list);
            setStatus("ready");
            setMessage(null);
          }
        } catch {
          if (!cancelled) {
            setStatus("error");
            setMessage("Failed to load recommendations.");
          }
        }
      }

      void load();
      return () => {
        cancelled = true;
      };
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        async save() {
          try {
            const response = await fetch(
              "/api/admin/portfolio-recommendations",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ recommendations: items }),
              },
            );
            const data: unknown = await response.json();
            if (!response.ok) {
              const errorMessage =
                typeof data === "object" &&
                data !== null &&
                "error" in data &&
                typeof data.error === "string"
                  ? data.error
                  : `Save failed (${response.status})`;
              return { ok: false, error: errorMessage };
            }
            return { ok: true };
          } catch {
            return { ok: false, error: "Failed to save recommendations." };
          }
        },
      }),
      [items],
    );

    function updateItem(
      index: number,
      patch: Partial<PortfolioRecommendation>,
    ) {
      setItems((current) =>
        current.map((item, i) => (i === index ? { ...item, ...patch } : item)),
      );
    }

    function handleDragStart(index: number, event: DragEvent<HTMLDivElement>) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(index));
      setDrag({ index });
    }

    function handleDragOver(index: number, event: DragEvent<HTMLDivElement>) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      if (!drag || drag.index === index) {
        return;
      }
      setItems((current) => {
        const next = [...current];
        const [moved] = next.splice(drag.index, 1);
        if (moved === undefined) {
          return current;
        }
        next.splice(index, 0, moved);
        return next;
      });
      setDrag({ index });
    }

    function handleDragEnd() {
      setDrag(null);
    }

    if (status === "loading") {
      return (
        <p className="text-sm text-neutral-400">Loading recommendations…</p>
      );
    }

    if (status === "error") {
      return (
        <p className="text-sm text-red-400">
          {message ?? "Failed to load recommendations."}
        </p>
      );
    }

    return (
      <section className="rounded-xl border border-violet-400/30 bg-violet-500/5 p-5">
        <div>
          <h2 className="text-sm uppercase tracking-[0.3em] text-violet-300">
            Recommendations
          </h2>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-500">
            Text-only quotes on the portfolio page, directly under Featured
            Work. Use Quote, Attributed to, and Violet/White color. Included
            when you click Save Changes at the top of this page.
          </p>
        </div>

        <div className="mt-5 space-y-4">
          {items.length === 0 && (
            <p className="text-sm text-neutral-500">No recommendations yet.</p>
          )}
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable={true}
              onDragStart={(event) => handleDragStart(index, event)}
              onDragOver={(event) => handleDragOver(index, event)}
              onDragEnd={handleDragEnd}
              className={`rounded-xl border border-white/10 bg-neutral-950/50 p-4 ${
                drag?.index === index ? "opacity-40" : ""
              } ${item.hidden ? "opacity-60" : ""}`}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="cursor-grab select-none text-neutral-500"
                    aria-label={`Reorder recommendation ${index + 1}`}
                  >
                    ⠿
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Recommendation {index + 1}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-xs text-neutral-400">
                    <input
                      type="checkbox"
                      checked={Boolean(item.hidden)}
                      onChange={(event) =>
                        updateItem(index, { hidden: event.target.checked })
                      }
                    />
                    Hidden
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setItems((current) =>
                        current.filter((_, i) => i !== index),
                      )
                    }
                    className="text-xs font-medium text-red-400/90 underline decoration-red-400/30 underline-offset-2 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Quote
                  </span>
                  <textarea
                    value={item.quote}
                    onChange={(event) =>
                      updateItem(index, { quote: event.target.value })
                    }
                    rows={4}
                    className="w-full resize-y rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm leading-6 text-neutral-100 outline-none focus:border-violet-400/60"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Attributed to
                  </span>
                  <input
                    type="text"
                    value={item.attribution}
                    onChange={(event) =>
                      updateItem(index, { attribution: event.target.value })
                    }
                    className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-violet-400/60"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                    Color
                  </span>
                  <select
                    value={item.color}
                    onChange={(event) =>
                      updateItem(index, {
                        color: event.target.value as RecommendationColor,
                      })
                    }
                    className="w-full max-w-xs rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-violet-400/60"
                  >
                    <option value="violet">Violet</option>
                    <option value="white">White</option>
                  </select>
                </label>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setItems((current) => [...current, blankRecommendation()])
            }
            className="rounded-full border border-violet-400/40 px-4 py-1.5 text-xs font-medium text-violet-100 transition hover:bg-violet-500/10"
          >
            Add recommendation
          </button>
        </div>
      </section>
    );
  },
);

"use client";

import {
  useEffect,
  useState,
  type DragEvent,
  type ReactNode,
} from "react";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

type DragState = {
  pathKey: string;
  index: number;
};

const LONG_TEXT_THRESHOLD = 80;

function isPlainObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

function getAtPath(root: JsonValue, path: (string | number)[]): JsonValue {
  let current: JsonValue = root;
  for (const segment of path) {
    if (Array.isArray(current) && typeof segment === "number") {
      current = current[segment] as JsonValue;
      continue;
    }
    if (isPlainObject(current) && typeof segment === "string") {
      current = current[segment];
      continue;
    }
    throw new Error("Invalid content path");
  }
  return current;
}

function setAtPath(
  root: JsonValue,
  path: (string | number)[],
  nextValue: JsonValue,
): JsonValue {
  if (path.length === 0) {
    return nextValue;
  }

  const draft = cloneValue(root);
  let cursor: JsonValue = draft;

  for (let i = 0; i < path.length - 1; i += 1) {
    const segment = path[i];
    if (Array.isArray(cursor) && typeof segment === "number") {
      cursor = cursor[segment] as JsonValue;
      continue;
    }
    if (isPlainObject(cursor) && typeof segment === "string") {
      cursor = cursor[segment];
      continue;
    }
    throw new Error("Invalid content path");
  }

  const last = path[path.length - 1];
  if (Array.isArray(cursor) && typeof last === "number") {
    cursor[last] = nextValue;
    return draft;
  }
  if (isPlainObject(cursor) && typeof last === "string") {
    cursor[last] = nextValue;
    return draft;
  }
  throw new Error("Invalid content path");
}

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function pathKey(path: (string | number)[]): string {
  return path.join(".");
}

function blankItemLike(sample: JsonValue): JsonValue {
  if (typeof sample === "string") {
    return "";
  }
  if (typeof sample === "number") {
    return 0;
  }
  if (typeof sample === "boolean") {
    return false;
  }
  if (sample === null) {
    return null;
  }
  if (Array.isArray(sample)) {
    return [];
  }
  if (isPlainObject(sample)) {
    const blank: JsonObject = {};
    for (const [key, value] of Object.entries(sample)) {
      if (key === "hidden") {
        blank.hidden = false;
        continue;
      }
      blank[key] = blankItemLike(value);
    }
    // Ordered list items support an optional hide flag.
    if (!("hidden" in blank)) {
      blank.hidden = false;
    }
    return blank;
  }
  return "";
}

function defaultArrayItem(items: JsonValue[]): JsonValue {
  if (items.length > 0) {
    return blankItemLike(items[0]);
  }
  return { text: "", hidden: false };
}

type ContentEditorProps = {
  pageKey: string;
  label: string;
  publicHref: string;
};

export function ContentEditor({
  pageKey,
  label,
  publicHref,
}: ContentEditorProps) {
  const [content, setContent] = useState<JsonObject | null>(null);
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
        const response = await fetch(`/api/admin/content/${pageKey}`, {
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

        if (
          data === null ||
          typeof data !== "object" ||
          Array.isArray(data) ||
          !("content" in data) ||
          !isPlainObject((data as { content: unknown }).content)
        ) {
          if (!cancelled) {
            setStatus("error");
            setMessage("Unexpected content payload.");
          }
          return;
        }

        if (!cancelled) {
          setContent((data as { content: JsonObject }).content);
          setStatus("ready");
          setMessage(null);
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setMessage("Failed to load content.");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  function updatePath(path: (string | number)[], nextValue: JsonValue) {
    setContent((current) => {
      if (!current) {
        return current;
      }
      return setAtPath(current, path, nextValue) as JsonObject;
    });
  }

  function handleDragStart(
    listPath: (string | number)[],
    index: number,
    event: DragEvent<HTMLDivElement>,
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
    setDrag({ pathKey: pathKey(listPath), index });
  }

  function handleDragOver(
    listPath: (string | number)[],
    index: number,
    event: DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const key = pathKey(listPath);
    if (!drag || drag.pathKey !== key || drag.index === index) {
      return;
    }

    setContent((current) => {
      if (!current) {
        return current;
      }
      const list = getAtPath(current, listPath);
      if (!Array.isArray(list)) {
        return current;
      }
      const nextList = [...list];
      const [moved] = nextList.splice(drag.index, 1);
      if (moved === undefined) {
        return current;
      }
      nextList.splice(index, 0, moved);
      return setAtPath(current, listPath, nextList) as JsonObject;
    });
    setDrag({ pathKey: key, index });
  }

  function handleDragEnd() {
    setDrag(null);
  }

  function addArrayItem(listPath: (string | number)[]) {
    setContent((current) => {
      if (!current) {
        return current;
      }
      const list = getAtPath(current, listPath);
      if (!Array.isArray(list)) {
        return current;
      }
      return setAtPath(current, listPath, [
        ...list,
        defaultArrayItem(list),
      ]) as JsonObject;
    });
  }

  function removeArrayItem(listPath: (string | number)[], index: number) {
    setContent((current) => {
      if (!current) {
        return current;
      }
      const list = getAtPath(current, listPath);
      if (!Array.isArray(list)) {
        return current;
      }
      const nextList = [...list];
      nextList.splice(index, 1);
      return setAtPath(current, listPath, nextList) as JsonObject;
    });
  }

  async function saveChanges() {
    if (!content) {
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/content/${pageKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
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

  function renderValue(
    value: JsonValue,
    path: (string | number)[],
    keyLabel?: string,
  ): ReactNode {
    if (typeof value === "boolean") {
      return (
        <label className="inline-flex items-center gap-2 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={value}
            onChange={(event) => updatePath(path, event.target.checked)}
          />
          <span>{keyLabel ?? "Enabled"}</span>
        </label>
      );
    }

    if (typeof value === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(event) =>
            updatePath(path, Number.parseFloat(event.target.value) || 0)
          }
          className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-violet-400/60"
        />
      );
    }

    if (typeof value === "string") {
      const useTextarea =
        value.length >= LONG_TEXT_THRESHOLD || value.includes("\n");
      if (useTextarea) {
        return (
          <textarea
            value={value}
            rows={4}
            onChange={(event) => updatePath(path, event.target.value)}
            className="w-full resize-y rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm leading-6 text-neutral-100 outline-none focus:border-violet-400/60"
          />
        );
      }
      return (
        <input
          type="text"
          value={value}
          onChange={(event) => updatePath(path, event.target.value)}
          className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-violet-400/60"
        />
      );
    }

    if (value === null) {
      return <p className="text-sm text-neutral-500">null</p>;
    }

    if (Array.isArray(value)) {
      const key = pathKey(path);
      return (
        <div className="space-y-3">
          {value.length === 0 && (
            <p className="text-sm text-neutral-500">Empty list.</p>
          )}
          {value.map((item, index) => {
            const itemPath = [...path, index];
            const hidden =
              isPlainObject(item) && typeof item.hidden === "boolean"
                ? item.hidden
                : false;
            return (
              <div
                key={`${key}-${index}`}
                draggable={true}
                onDragStart={(event) => handleDragStart(path, index, event)}
                onDragOver={(event) => handleDragOver(path, index, event)}
                onDragEnd={handleDragEnd}
                className={`rounded-xl border border-white/10 bg-white/5 p-4 ${
                  drag?.pathKey === key && drag.index === index
                    ? "opacity-40"
                    : ""
                } ${hidden ? "opacity-60" : ""}`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="cursor-grab select-none text-neutral-500"
                      aria-label={`Reorder item ${index + 1}`}
                    >
                      ⠿
                    </div>
                    <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                      Item {index + 1}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {isPlainObject(item) && "hidden" in item && (
                      <label className="inline-flex items-center gap-2 text-xs text-neutral-400">
                        <input
                          type="checkbox"
                          checked={Boolean(item.hidden)}
                          onChange={(event) =>
                            updatePath([...itemPath, "hidden"], event.target.checked)
                          }
                        />
                        Hidden
                      </label>
                    )}
                    {!isPlainObject(item) && (
                      <label className="inline-flex items-center gap-2 text-xs text-neutral-400">
                        <span className="text-neutral-600">No hide flag</span>
                      </label>
                    )}
                    {isPlainObject(item) && !("hidden" in item) && (
                      <button
                        type="button"
                        onClick={() =>
                          updatePath(itemPath, { ...item, hidden: false })
                        }
                        className="text-xs text-neutral-500 underline decoration-neutral-500/40 underline-offset-2 hover:text-neutral-300"
                      >
                        Enable hide
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeArrayItem(path, index)}
                      className="text-xs font-medium text-red-400/90 underline decoration-red-400/30 underline-offset-2 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {renderValue(item, itemPath)}
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => addArrayItem(path)}
            className="rounded-full border border-violet-400/40 px-4 py-1.5 text-xs font-medium text-violet-100 transition hover:bg-violet-500/10"
          >
            Add item
          </button>
        </div>
      );
    }

    if (isPlainObject(value)) {
      const entries = Object.entries(value);
      return (
        <div className="space-y-4">
          {entries.map(([childKey, childValue]) => {
            if (childKey === "hidden") {
              return null;
            }
            const childPath = [...path, childKey];
            const nested =
              isPlainObject(childValue) || Array.isArray(childValue);
            return (
              <div
                key={pathKey(childPath)}
                className={
                  nested
                    ? "rounded-xl border border-white/10 bg-neutral-950/40 p-4"
                    : "space-y-2"
                }
              >
                <p
                  className={
                    nested
                      ? "mb-3 text-sm uppercase tracking-[0.2em] text-violet-300/80"
                      : "text-xs uppercase tracking-[0.2em] text-neutral-500"
                  }
                >
                  {humanizeKey(childKey)}
                </p>
                {renderValue(childValue, childPath, humanizeKey(childKey))}
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-16">
        <div className="sticky top-[5.5rem] z-40 -mx-6 mb-8 border-b border-white/10 bg-neutral-950/95 px-6 py-4 backdrop-blur-md sm:-mx-10 sm:px-10 lg:-mx-16 lg:px-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">
                Content Editor
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                {label} (local only)
              </h1>
              <p className="mt-1 text-xs text-neutral-500">
                Edits write to{" "}
                <code className="text-neutral-400">
                  lib/content/{pageKey}.json
                </code>
                . Commit and deploy to publish.{" "}
                <a
                  href={publicHref}
                  className="text-violet-300 underline decoration-violet-300/40 underline-offset-2 hover:text-violet-200"
                >
                  View public page
                </a>
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
          <p className="text-sm text-neutral-400">Loading content…</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-300">{message ?? "Failed to load."}</p>
        )}
        {status === "ready" && content && (
          <div className="space-y-6">{renderValue(content, [])}</div>
        )}
      </div>
    </div>
  );
}

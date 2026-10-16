"use client";

import { useEffect, useState, type DragEvent } from "react";
import { FEATURED_WORK_COUNT } from "../../../lib/portfolio-constants";

export const dynamic = "force-dynamic";

type OverrideRow = {
  uid: string;
  title: string;
  order: number;
  hidden?: boolean;
  featured?: boolean;
  emmyBadge?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  caption?: string;
  placeholder?: boolean;
  orientation?: "landscape" | "portrait";
  thumbnailTime?: string | null;
  source?: "youtube" | "stream";
  youtubeId?: string;
  thumbnailOverrideUrl?: string;
  [key: string]: unknown;
};

type SectionId =
  | "demo"
  | "highlight"
  | "selected"
  | "youtube"
  | "social"
  | "hidden";

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
    hint: `Up to ${FEATURED_WORK_COUNT} landscape clips after the demo reels, including any “video coming soon” placeholders. Captions show under these cards on the public page. Moving another clip in keeps it here and sends the last Featured Work clip to Selected Work.`,
  },
  {
    id: "selected",
    title: "Selected Work",
    hint: "Remaining landscape clips on the portfolio page. Captions show beside these cards, so longer write-ups have room to display in full.",
  },
  {
    id: "youtube",
    title: "Featured on YouTube",
    hint: "YouTube-linked videos. They appear only in the Featured on YouTube section on the public page, not in the Stream grids. View and like counts are pulled live and are not editable here.",
  },
  {
    id: "social",
    title: "Social Cuts",
    hint: "Vertical / portrait clips. These appear under Social / Vertical on the public page, separate from Featured and Selected Work.",
  },
  {
    id: "hidden",
    title: "Hidden",
    hint: "Not shown on the portfolio page. Stream clips live here when you Remove them. YouTube links and placeholders are deleted from the site instead.",
  },
];

const SECTION_OPTIONS: { id: SectionId; label: string }[] = [
  { id: "demo", label: "Demo Reel" },
  { id: "highlight", label: "Featured Work" },
  { id: "selected", label: "Selected Work" },
  { id: "youtube", label: "Featured on YouTube" },
  { id: "social", label: "Social Cuts" },
  { id: "hidden", label: "Hidden" },
];

function isPlaceholder(row: OverrideRow) {
  return Boolean(row.placeholder) || row.uid.startsWith("placeholder-");
}

function isYouTube(row: OverrideRow) {
  return row.source === "youtube" || row.uid.startsWith("youtube:");
}

function youtubeWatchUrl(row: OverrideRow): string | null {
  const youtubeId =
    typeof row.youtubeId === "string" && row.youtubeId
      ? row.youtubeId
      : row.uid.startsWith("youtube:")
        ? row.uid.slice("youtube:".length)
        : "";
  if (!/^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) {
    return null;
  }
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

function youtubeDefaultThumbnail(row: OverrideRow): string {
  const youtubeId =
    typeof row.youtubeId === "string" && row.youtubeId
      ? row.youtubeId
      : row.uid.startsWith("youtube:")
        ? row.uid.slice("youtube:".length)
        : "";
  if (!/^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) {
    return "";
  }
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

function youtubePreviewThumbnail(row: OverrideRow): string {
  const override =
    typeof row.thumbnailOverrideUrl === "string"
      ? row.thumbnailOverrideUrl.trim()
      : "";
  if (/^https?:\/\//i.test(override)) {
    return override;
  }
  return youtubeDefaultThumbnail(row);
}

function isPortrait(row: OverrideRow) {
  return row.orientation === "portrait";
}

function cloneGroups(current: Groups): Groups {
  return {
    demo: [...current.demo],
    highlight: [...current.highlight],
    selected: [...current.selected],
    youtube: [...current.youtube],
    social: [...current.social],
    hidden: [...current.hidden],
  };
}

function canPlace(row: OverrideRow, section: SectionId) {
  if (section === "hidden") {
    return true;
  }
  if (isYouTube(row)) {
    return section === "youtube";
  }
  if (section === "youtube") {
    return false;
  }
  if (isPlaceholder(row) && section === "demo") {
    return false;
  }
  if (isPortrait(row)) {
    return section === "social";
  }
  return section !== "social";
}

function resolveTarget(row: OverrideRow, to: SectionId): SectionId {
  if (canPlace(row, to)) {
    return to;
  }
  if (isYouTube(row)) {
    return "youtube";
  }
  if (isPortrait(row)) {
    return "social";
  }
  if (to === "demo" && isPlaceholder(row)) {
    return "highlight";
  }
  return "selected";
}

function extractYouTubeId(raw: string): string | null {
  const input = raw.trim();
  if (!input) {
    return null;
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
    return input;
  }

  const withProtocol = /^https?:\/\//i.test(input)
    ? input
    : `https://${input}`;
  try {
    const url = new URL(withProtocol);
    const host = url.hostname.replace(/^www\./i, "").replace(/^m\./i, "");
    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0] ?? "";
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const fromQuery = url.searchParams.get("v");
      if (fromQuery && /^[a-zA-Z0-9_-]{11}$/.test(fromQuery)) {
        return fromQuery;
      }
      const parts = url.pathname.split("/").filter(Boolean);
      if (
        parts[0] === "embed" &&
        parts[1] &&
        /^[a-zA-Z0-9_-]{11}$/.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

function toRows(data: Record<string, object>): OverrideRow[] {
  return Object.entries(data).map(([uid, entry]) => ({
    uid,
    ...entry,
  })) as OverrideRow[];
}

function placeholderRows(entries: unknown): OverrideRow[] {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries.flatMap((entry) => {
    if (entry === null || typeof entry !== "object") {
      return [];
    }
    const item = entry as {
      id?: unknown;
      title?: unknown;
      order?: unknown;
      caption?: unknown;
      emmyBadge?: unknown;
      loop?: unknown;
      autoplay?: unknown;
      hidden?: unknown;
      orientation?: unknown;
    };
    if (typeof item.id !== "string" || typeof item.title !== "string") {
      return [];
    }
    return [
      {
        uid: item.id,
        title: item.title,
        order: typeof item.order === "number" ? item.order : 0,
        caption: typeof item.caption === "string" ? item.caption : undefined,
        emmyBadge: Boolean(item.emmyBadge),
        loop: Boolean(item.loop),
        autoplay: Boolean(item.autoplay),
        hidden: Boolean(item.hidden),
        orientation: item.orientation === "portrait" ? "portrait" : "landscape",
        placeholder: true,
      },
    ];
  });
}

function partitionRows(rows: OverrideRow[]): Groups {
  const sorted = [...rows].sort((a, b) => a.order - b.order);
  const hidden = sorted.filter((row) => row.hidden);
  const visible = sorted.filter((row) => !row.hidden);
  const youtube = visible.filter(isYouTube);
  const demo = visible.filter((row) => !isYouTube(row) && row.featured);
  const rest = visible.filter((row) => !isYouTube(row) && !row.featured);
  const social = rest.filter(isPortrait);
  const landscape = rest.filter((row) => !isPortrait(row));

  return {
    demo,
    highlight: landscape.slice(0, FEATURED_WORK_COUNT),
    selected: landscape.slice(FEATURED_WORK_COUNT),
    youtube,
    social,
    hidden,
  };
}

function capHighlight(groups: Groups, preferUid?: string): Groups {
  if (groups.highlight.length <= FEATURED_WORK_COUNT) {
    return groups;
  }

  const highlight = [...groups.highlight];
  const overflow: OverrideRow[] = [];

  while (highlight.length > FEATURED_WORK_COUNT) {
    let removeAt = highlight.length - 1;
    if (
      preferUid &&
      highlight[removeAt]?.uid === preferUid &&
      highlight.length > 1
    ) {
      removeAt -= 1;
    }
    const [demoted] = highlight.splice(removeAt, 1);
    if (demoted) {
      overflow.unshift(demoted);
    }
  }

  return {
    ...groups,
    highlight,
    selected: [...overflow, ...groups.selected],
  };
}

function toSavePayload(groups: Groups) {
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
    ...groups.youtube.map((row) => ({
      ...row,
      featured: false,
      hidden: false,
    })),
    ...groups.social.map((row) => ({
      ...row,
      featured: false,
      hidden: false,
    })),
    ...groups.hidden.map((row) => ({ ...row, featured: false, hidden: true })),
  ].map((row, index) => ({ ...row, order: index * 10 }));

  const overrides: Record<string, Record<string, unknown>> = {};
  const placeholders: Record<string, unknown>[] = [];

  for (const row of ordered) {
    if (isPlaceholder(row)) {
      const entry: Record<string, unknown> = {
        id: row.uid,
        title: row.title,
        order: row.order,
        orientation: row.orientation === "portrait" ? "portrait" : "landscape",
      };
      if (typeof row.caption === "string" && row.caption.trim()) {
        entry.caption = row.caption;
      }
      if (row.emmyBadge) {
        entry.emmyBadge = true;
      }
      if (row.loop) {
        entry.loop = true;
      }
      if (row.autoplay) {
        entry.autoplay = true;
      }
      if (row.hidden) {
        entry.hidden = true;
      }
      placeholders.push(entry);
      continue;
    }

    if (isYouTube(row)) {
      const youtubeId =
        typeof row.youtubeId === "string" && row.youtubeId
          ? row.youtubeId
          : row.uid.startsWith("youtube:")
            ? row.uid.slice("youtube:".length)
            : row.uid;
      const entry: Record<string, unknown> = {
        source: "youtube",
        youtubeId,
        title: row.title,
        order: row.order,
      };
      if (row.featured) {
        entry.featured = true;
      }
      if (row.hidden) {
        entry.hidden = true;
      }
      if (row.loop) {
        entry.loop = true;
      }
      if (row.autoplay) {
        entry.autoplay = true;
      }
      if (row.emmyBadge) {
        entry.emmyBadge = true;
      }
      if (row.spotlight) {
        entry.spotlight = row.spotlight;
      }
      if (
        typeof row.thumbnailOverrideUrl === "string" &&
        row.thumbnailOverrideUrl.trim()
      ) {
        entry.thumbnailOverrideUrl = row.thumbnailOverrideUrl.trim();
      }
      overrides[`youtube:${youtubeId}`] = entry;
      continue;
    }

    const {
      uid,
      title,
      order,
      featured,
      hidden,
      emmyBadge,
      loop,
      autoplay,
      caption,
      placeholder: _placeholder,
      orientation: _orientation,
      source: _source,
      youtubeId: _youtubeId,
      ...extra
    } = row;
    const entry: Record<string, unknown> = { ...extra, title, order };
    if (featured) {
      entry.featured = true;
    }
    if (hidden) {
      entry.hidden = true;
    }
    if (emmyBadge) {
      entry.emmyBadge = true;
    }
    if (loop) {
      entry.loop = true;
    }
    if (autoplay) {
      entry.autoplay = true;
    }
    if (typeof caption === "string" && caption.trim()) {
      entry.caption = caption;
    }
    overrides[uid] = entry;
  }

  return { overrides, placeholders };
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
    youtube: [],
    social: [],
    hidden: [],
  });
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [youtubeInput, setYoutubeInput] = useState("");
  const [youtubeMessage, setYoutubeMessage] = useState<string | null>(null);
  const [addingYoutube, setAddingYoutube] = useState(false);

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

        const payload = data as {
          overrides?: Record<string, object>;
          placeholders?: unknown;
          orientations?: Record<string, "landscape" | "portrait">;
        };
        const overrides =
          payload.overrides &&
          typeof payload.overrides === "object" &&
          !Array.isArray(payload.overrides)
            ? payload.overrides
            : (data as Record<string, object>);
        const orientations =
          payload.orientations &&
          typeof payload.orientations === "object" &&
          !Array.isArray(payload.orientations)
            ? payload.orientations
            : {};

        if (!cancelled) {
          setGroups(
            partitionRows(
              [...toRows(overrides), ...placeholderRows(payload.placeholders)].map(
                (row) => ({
                  ...row,
                  orientation:
                    row.orientation ?? orientations[row.uid] ?? "landscape",
                }),
              ),
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

    const highlightWasFull =
      to === "highlight" && groups.highlight.length >= FEATURED_WORK_COUNT;

    setGroups((current) => {
      const next = cloneGroups(current);
      const [moved] = next[from].splice(index, 1);
      if (!moved) {
        return current;
      }
      const target = resolveTarget(moved, to);
      next[target].push(moved);
      return capHighlight(
        next,
        target === "highlight" ? moved.uid : undefined,
      );
    });

    if (highlightWasFull) {
      setMessage(
        `Featured Work holds ${FEATURED_WORK_COUNT} clips. The last one moved to Selected Work.`,
      );
    }
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
      if (!moving || !canPlace(moving, section)) {
        return current;
      }

      const next = cloneGroups(current);
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
    const dragState = drag;
    setDrag(null);
    setGroups((current) => {
      const preferUid =
        dragState?.section === "highlight"
          ? current[dragState.section][dragState.index]?.uid
          : undefined;
      return capHighlight(current, preferUid);
    });
  }

  function removeRow(section: SectionId, uid: string) {
    setGroups((current) => {
      const index = current[section].findIndex((row) => row.uid === uid);
      if (index === -1) {
        return current;
      }
      const row = current[section][index];
      const next = cloneGroups(current);

      if (isYouTube(row) || isPlaceholder(row)) {
        next[section].splice(index, 1);
        return capHighlight(next);
      }

      if (section === "hidden") {
        return current;
      }
      const [moved] = next[section].splice(index, 1);
      if (!moved) {
        return current;
      }
      next.hidden.push(moved);
      return capHighlight(next);
    });
    setMessage("Removed from the list. Save Changes to take it off the site.");
  }

  async function fetchYoutubeTitle(youtubeId: string): Promise<string> {
    try {
      const response = await fetch(
        `/api/admin/youtube-oembed?id=${encodeURIComponent(youtubeId)}`,
        { signal: AbortSignal.timeout(4000) },
      );
      if (!response.ok) {
        return "";
      }
      const data: unknown = await response.json();
      if (
        data !== null &&
        typeof data === "object" &&
        "title" in data &&
        typeof data.title === "string"
      ) {
        return data.title.trim();
      }
    } catch {
      return "";
    }
    return "";
  }

  async function addYoutubeVideo() {
    const youtubeId = extractYouTubeId(youtubeInput);
    if (!youtubeId) {
      setYoutubeMessage(
        "Paste a YouTube URL (watch, youtu.be, or embed) or an 11-character video ID.",
      );
      return;
    }

    const uid = `youtube:${youtubeId}`;
    const alreadyAdded = Object.values(groups).some((rows) =>
      rows.some((row) => row.uid === uid || row.youtubeId === youtubeId),
    );
    if (alreadyAdded) {
      setYoutubeMessage("That YouTube video is already in the list.");
      return;
    }

    setAddingYoutube(true);
    try {
      const title = await fetchYoutubeTitle(youtubeId);
      const nextOrder =
        Math.max(
          0,
          ...Object.values(groups).flatMap((rows) =>
            rows.map((row) => row.order),
          ),
        ) + 10;

      setGroups((current) => ({
        ...current,
        youtube: [
          ...current.youtube,
          {
            uid,
            source: "youtube",
            youtubeId,
            title,
            order: nextOrder,
            orientation: "landscape",
          },
        ],
      }));
      setYoutubeInput("");
      setYoutubeMessage(
        title
          ? "Added with the YouTube title — edit it if you want, then Save Changes."
          : "Added — give it a title, then Save Changes.",
      );
    } finally {
      setAddingYoutube(false);
    }
  }

  async function saveChanges() {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/overrides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toSavePayload(groups)),
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
                Social Cuts is a separate section for vertical clips, matching
                the public portfolio page.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {message && (
                <p
                  className={
                    message === "Saved" ||
                    message.startsWith("Removed") ||
                    message.startsWith("Featured Work holds")
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
            <section className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
              <h2 className="text-sm uppercase tracking-[0.3em] text-red-400">
                Add YouTube Video
              </h2>
              <p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-500">
                Paste a full YouTube URL or just the video ID. The title is
                filled from YouTube when possible and stays editable. Stats are
                pulled live after you save — they are not editable here.
              </p>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  void addYoutubeVideo();
                }}
              >
                <input
                  type="text"
                  value={youtubeInput}
                  onChange={(event) => {
                    setYoutubeInput(event.target.value);
                    if (youtubeMessage) {
                      setYoutubeMessage(null);
                    }
                  }}
                  placeholder="https://www.youtube.com/watch?v=… or video ID"
                  aria-label="YouTube URL or video ID"
                  disabled={addingYoutube}
                  className="min-w-0 flex-1 rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-red-400/60 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={addingYoutube}
                  className="rounded-full border border-red-400/40 px-5 py-2 text-sm font-medium text-red-100 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingYoutube ? "Adding…" : "Add"}
                </button>
              </form>
              {youtubeMessage && (
                <p className="mt-3 text-sm text-neutral-300">{youtubeMessage}</p>
              )}
            </section>

            {SECTIONS.map((section) => (
              <section
                key={section.id}
                className={
                  section.id === "social" || section.id === "youtube"
                    ? "border-t border-white/20 pt-10"
                    : undefined
                }
              >
                <div className="mb-3">
                  <h2
                    className={
                      section.id === "youtube"
                        ? "text-sm uppercase tracking-[0.3em] text-red-400"
                        : "text-sm uppercase tracking-[0.3em] text-violet-300/80"
                    }
                  >
                    {section.title}
                  </h2>
                  <p className="mt-2 max-w-3xl text-xs leading-5 text-neutral-500">
                    {section.hint}
                  </p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-neutral-400">
                      <tr>
                        <th className="w-8 px-2 py-3 font-medium">
                          <span className="sr-only">Reorder</span>
                        </th>
                        <th className="px-4 py-3 font-medium">UID</th>
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium">Section</th>
                        <th className="px-4 py-3 font-medium">Emmy</th>
                        <th className="px-4 py-3 font-medium">Loop</th>
                        <th className="px-4 py-3 font-medium">Autoplay</th>
                        <th className="px-4 py-3 font-medium">
                          <span className="sr-only">Remove</span>
                        </th>
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
                            colSpan={8}
                            className="px-4 py-6 text-sm text-neutral-500"
                          >
                            No videos in this section.
                          </td>
                        </tr>
                      )}
                      {groups[section.id].map((row, i) => {
                        const watchUrl = youtubeWatchUrl(row);
                        const previewThumb = isYouTube(row)
                          ? youtubePreviewThumbnail(row)
                          : "";
                        return (
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
                            {isPlaceholder(row) && (
                              <p className="mt-1 text-xs text-neutral-500">
                                Placeholder — video coming soon
                              </p>
                            )}
                            {isYouTube(row) && (
                              <>
                                <p className="mt-1 text-xs text-red-400/80">
                                  YouTube
                                  {row.title.trim()
                                    ? ""
                                    : " — title is blank until you name it"}
                                  {watchUrl && (
                                    <>
                                      {" · "}
                                      <a
                                        href={watchUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        draggable={false}
                                        onPointerDown={(event) =>
                                          event.stopPropagation()
                                        }
                                        className="text-red-300 underline decoration-red-300/40 underline-offset-2 hover:text-red-200"
                                      >
                                        Open
                                      </a>
                                    </>
                                  )}
                                </p>
                                <div className="mt-2 flex items-start gap-2">
                                  {previewThumb && (
                                    <img
                                      src={previewThumb}
                                      alt=""
                                      draggable={false}
                                      className="h-12 w-20 shrink-0 rounded object-cover bg-black"
                                    />
                                  )}
                                  <input
                                    type="text"
                                    value={
                                      typeof row.thumbnailOverrideUrl ===
                                      "string"
                                        ? row.thumbnailOverrideUrl
                                        : ""
                                    }
                                    placeholder="Thumbnail image URL (optional)"
                                    aria-label={`Thumbnail URL for ${row.title || row.uid}`}
                                    draggable={false}
                                    onPointerDown={(event) =>
                                      event.stopPropagation()
                                    }
                                    onChange={(event) => {
                                      const value = event.target.value;
                                      updateRow(section.id, row.uid, {
                                        thumbnailOverrideUrl: value
                                          ? value
                                          : undefined,
                                      });
                                    }}
                                    onBlur={(event) => {
                                      const value = event.target.value.trim();
                                      updateRow(section.id, row.uid, {
                                        thumbnailOverrideUrl: value
                                          ? value
                                          : undefined,
                                      });
                                    }}
                                    className="w-full rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-violet-400/60"
                                  />
                                </div>
                              </>
                            )}
                            {(section.id === "highlight" ||
                              section.id === "selected") && (
                              <textarea
                                value={row.caption ?? ""}
                                onChange={(event) =>
                                  updateRow(section.id, row.uid, {
                                    caption: event.target.value,
                                  })
                                }
                                rows={section.id === "selected" ? 10 : 4}
                                placeholder="Caption shown with this video on the public page"
                                aria-label={`Caption for ${row.title}`}
                                className={
                                  section.id === "selected"
                                    ? "mt-2 min-h-[12rem] w-full resize-y rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm leading-6 text-neutral-100 outline-none focus:border-violet-400/60"
                                    : "mt-2 w-full resize-y rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm leading-6 text-neutral-100 outline-none focus:border-violet-400/60"
                                }
                              />
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
                              {SECTION_OPTIONS.filter((option) =>
                                canPlace(row, option.id),
                              ).map((option) => (
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
                          <td className="w-20 px-4 py-3 text-center align-middle">
                            <input
                              type="checkbox"
                              checked={Boolean(row.loop)}
                              onChange={(event) =>
                                updateRow(section.id, row.uid, {
                                  loop: event.target.checked,
                                })
                              }
                              aria-label={`Loop ${row.title}`}
                            />
                          </td>
                          <td className="w-24 px-4 py-3 text-center align-middle">
                            <input
                              type="checkbox"
                              checked={Boolean(row.autoplay)}
                              onChange={(event) =>
                                updateRow(section.id, row.uid, {
                                  autoplay: event.target.checked,
                                })
                              }
                              aria-label={`Autoplay ${row.title}`}
                            />
                          </td>
                          <td className="w-24 px-4 py-3 text-right align-middle">
                            {!(section.id === "hidden" && !isYouTube(row) && !isPlaceholder(row)) && (
                              <button
                                type="button"
                                draggable={false}
                                onPointerDown={(event) =>
                                  event.stopPropagation()
                                }
                                onClick={() => removeRow(section.id, row.uid)}
                                aria-label={`Remove ${row.title || row.uid} from the site`}
                                className="text-xs font-medium text-red-400/90 underline decoration-red-400/30 underline-offset-2 hover:text-red-300"
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                        );
                      })}
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

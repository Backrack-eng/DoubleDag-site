import fs from "node:fs";
import path from "node:path";
import {
  homeFeaturedFilePath,
  type HomeFeaturedEntry,
} from "../../../../lib/home-featured";

const LOCAL_ONLY_ERROR = {
  error: "Only available when running locally (npm run dev).",
};

const OVERRIDES_PATH = path.join(
  process.cwd(),
  "lib",
  "portfolio-overrides.json",
);

type OverrideEntry = {
  title?: string;
  caption?: string;
  emmyBadge?: boolean;
  type?: string;
  label?: string;
  source?: string;
  youtubeId?: string;
  thumbnailOverrideUrl?: string;
  thumbnailTime?: string | null;
};

function isSectionBreak(uid: string, entry: OverrideEntry) {
  return entry.type === "section" || uid.startsWith("section:");
}

function isYouTube(uid: string, entry: OverrideEntry) {
  return (
    entry.source === "youtube" ||
    uid.startsWith("youtube:") ||
    Boolean(entry.youtubeId)
  );
}

function youtubeId(uid: string, entry: OverrideEntry) {
  if (typeof entry.youtubeId === "string" && entry.youtubeId) {
    return entry.youtubeId;
  }
  if (uid.startsWith("youtube:")) {
    return uid.slice("youtube:".length);
  }
  return "";
}

function buildCatalog() {
  const raw = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8")) as Record<
    string,
    OverrideEntry
  >;

  return Object.entries(raw)
    .filter(([uid, entry]) => !isSectionBreak(uid, entry ?? {}))
    .map(([uid, entry]) => {
      const youtube = isYouTube(uid, entry);
      const ytId = youtube ? youtubeId(uid, entry) : "";
      const overrideThumb =
        typeof entry.thumbnailOverrideUrl === "string"
          ? entry.thumbnailOverrideUrl.trim()
          : "";
      const thumbnailUrl = youtube
        ? overrideThumb ||
          (ytId
            ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
            : "")
        : entry.thumbnailTime === null
          ? `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg`
          : entry.thumbnailTime
            ? `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=${entry.thumbnailTime}`
            : `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=3s`;

      return {
        uid,
        title:
          typeof entry.title === "string" && entry.title.trim()
            ? entry.title
            : uid,
        thumbnailUrl,
        caption: typeof entry.caption === "string" ? entry.caption : "",
        emmyBadge: Boolean(entry.emmyBadge),
        source: youtube ? ("youtube" as const) : ("stream" as const),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function isEntry(value: unknown): value is HomeFeaturedEntry {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.uid === "string" &&
    entry.uid.length > 0 &&
    typeof entry.order === "number" &&
    Number.isFinite(entry.order)
  );
}

function normalizeEntries(raw: unknown): HomeFeaturedEntry[] | null {
  if (!Array.isArray(raw)) {
    return null;
  }

  const entries: HomeFeaturedEntry[] = [];
  for (const item of raw) {
    if (!isEntry(item)) {
      return null;
    }
    const entry: HomeFeaturedEntry = {
      uid: item.uid,
      order: item.order,
    };
    if (item.hidden) {
      entry.hidden = true;
    }
    if (typeof item.title === "string" && item.title.trim()) {
      entry.title = item.title.trim();
    }
    if (typeof item.caption === "string" && item.caption.trim()) {
      entry.caption = item.caption;
    }
    if (typeof item.emmyBadge === "boolean") {
      entry.emmyBadge = item.emmyBadge;
    }
    entries.push(entry);
  }

  const featured = entries
    .filter((entry) => !entry.hidden)
    .sort((a, b) => a.order - b.order)
    .map((entry, index) => {
      const next: HomeFeaturedEntry = {
        uid: entry.uid,
        order: index * 10,
      };
      if (typeof entry.title === "string" && entry.title.trim()) {
        next.title = entry.title.trim();
      }
      if (typeof entry.caption === "string" && entry.caption.trim()) {
        next.caption = entry.caption;
      }
      if (typeof entry.emmyBadge === "boolean") {
        next.emmyBadge = entry.emmyBadge;
      }
      return next;
    });

  const hidden = entries
    .filter((entry) => entry.hidden)
    .sort((a, b) => a.order - b.order)
    .map((entry, index) => {
      const next: HomeFeaturedEntry = {
        uid: entry.uid,
        order: featured.length * 10 + 1000 + index * 10,
        hidden: true,
      };
      if (typeof entry.title === "string" && entry.title.trim()) {
        next.title = entry.title.trim();
      }
      if (typeof entry.caption === "string" && entry.caption.trim()) {
        next.caption = entry.caption;
      }
      if (typeof entry.emmyBadge === "boolean") {
        next.emmyBadge = entry.emmyBadge;
      }
      return next;
    });

  return [...featured, ...hidden];
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(LOCAL_ONLY_ERROR, { status: 403 });
  }

  const entries = JSON.parse(
    fs.readFileSync(homeFeaturedFilePath(), "utf8"),
  ) as unknown;
  const list = Array.isArray(entries) ? entries : [];
  const catalog = buildCatalog();

  return Response.json({ entries: list, catalog });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(LOCAL_ONLY_ERROR, { status: 403 });
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload =
    data !== null &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    "entries" in data
      ? (data as { entries: unknown }).entries
      : data;

  const entries = normalizeEntries(payload);
  if (entries === null) {
    return Response.json(
      { error: "Body must be an array of { uid, order } entries." },
      { status: 400 },
    );
  }

  fs.writeFileSync(
    homeFeaturedFilePath(),
    `${JSON.stringify(entries, null, 2)}\n`,
  );
  return Response.json({ success: true });
}

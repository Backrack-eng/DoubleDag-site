import fs from "node:fs";
import path from "node:path";

const OVERRIDES_PATH = path.join(
  process.cwd(),
  "lib",
  "portfolio-overrides.json",
);

const PLACEHOLDERS_PATH = path.join(
  process.cwd(),
  "lib",
  "portfolio-placeholders.json",
);

const LOCAL_ONLY_ERROR = {
  error: "Only available when running locally (npm run dev).",
};

async function loadOrientations() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN;
  const orientations: Record<string, "landscape" | "portrait"> = {};

  if (!accountId || !token) {
    return orientations;
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream?per_page=1000`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    return orientations;
  }

  const payload = (await response.json()) as {
    result?: Array<{
      uid?: string;
      input?: { width?: number; height?: number };
    }>;
  };

  for (const video of payload.result ?? []) {
    if (!video.uid) {
      continue;
    }
    const width = video.input?.width;
    const height = video.input?.height;
    orientations[video.uid] =
      width != null && height != null && height > width
        ? "portrait"
        : "landscape";
  }

  return orientations;
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(LOCAL_ONLY_ERROR, { status: 403 });
  }

  const overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, "utf8"));
  const placeholders = JSON.parse(fs.readFileSync(PLACEHOLDERS_PATH, "utf8"));
  const orientations = await loadOrientations();
  return Response.json({ overrides, placeholders, orientations });
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

  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return Response.json(
      { error: "Body must be an overrides object." },
      { status: 400 },
    );
  }

  const payload = data as {
    overrides?: unknown;
    placeholders?: unknown;
  };
  const overrides =
    payload.overrides !== undefined ? payload.overrides : data;
  const placeholders = payload.placeholders;

  if (
    overrides === null ||
    typeof overrides !== "object" ||
    Array.isArray(overrides)
  ) {
    return Response.json(
      { error: "Body must be an overrides object." },
      { status: 400 },
    );
  }

  if (placeholders !== undefined && !Array.isArray(placeholders)) {
    return Response.json(
      { error: "placeholders must be an array." },
      { status: 400 },
    );
  }

  fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(overrides, null, 2));
  if (placeholders !== undefined) {
    fs.writeFileSync(PLACEHOLDERS_PATH, JSON.stringify(placeholders, null, 2));
  }
  return Response.json({ success: true });
}

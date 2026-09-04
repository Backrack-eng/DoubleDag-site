import fs from "node:fs";
import path from "node:path";

const OVERRIDES_PATH = path.join(
  process.cwd(),
  "lib",
  "portfolio-overrides.json",
);

const LOCAL_ONLY_ERROR = {
  error: "Only available when running locally (npm run dev).",
};

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(LOCAL_ONLY_ERROR, { status: 403 });
  }

  const raw = fs.readFileSync(OVERRIDES_PATH, "utf8");
  return Response.json(JSON.parse(raw));
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

  fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(data, null, 2));
  return Response.json({ success: true });
}

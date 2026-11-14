import fs from "node:fs";
import {
  contentFilePath,
  getContentPage,
  isContentPageKey,
} from "../../../../../lib/content/registry";

const LOCAL_ONLY_ERROR = {
  error: "Only available when running locally (npm run dev).",
};

type RouteContext = {
  params: Promise<{ page: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(LOCAL_ONLY_ERROR, { status: 403 });
  }

  const { page } = await context.params;
  if (!isContentPageKey(page)) {
    return Response.json({ error: "Unknown content page." }, { status: 404 });
  }

  const filePath = contentFilePath(page);
  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const meta = getContentPage(page);
  return Response.json({ page, label: meta?.label, content });
}

export async function POST(request: Request, context: RouteContext) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(LOCAL_ONLY_ERROR, { status: 403 });
  }

  const { page } = await context.params;
  if (!isContentPageKey(page)) {
    return Response.json({ error: "Unknown content page." }, { status: 404 });
  }

  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return Response.json(
      { error: "Body must be a JSON object." },
      { status: 400 },
    );
  }

  const filePath = contentFilePath(page);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
  return Response.json({ success: true });
}

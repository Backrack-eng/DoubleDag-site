import fs from "node:fs";
import {
  normalizeRecommendations,
  portfolioRecommendationsFilePath,
} from "../../../../lib/portfolio-recommendations";

const LOCAL_ONLY_ERROR = {
  error: "Only available when running locally (npm run dev).",
};

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(LOCAL_ONLY_ERROR, { status: 403 });
  }

  const filePath = portfolioRecommendationsFilePath();
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return Response.json({ recommendations: normalizeRecommendations(raw) });
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
      { error: "Body must be a JSON object." },
      { status: 400 },
    );
  }

  const payload = data as { recommendations?: unknown };
  const recommendations = normalizeRecommendations(payload.recommendations);
  const filePath = portfolioRecommendationsFilePath();
  fs.writeFileSync(
    filePath,
    `${JSON.stringify(recommendations, null, 2)}\n`,
  );
  return Response.json({ success: true });
}

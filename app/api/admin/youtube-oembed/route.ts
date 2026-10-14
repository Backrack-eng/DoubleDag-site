const LOCAL_ONLY_ERROR = {
  error: "Only available when running locally (npm run dev).",
};

function parseTitle(data: unknown): string {
  if (
    data !== null &&
    typeof data === "object" &&
    "title" in data &&
    typeof data.title === "string"
  ) {
    return data.title.trim();
  }
  return "";
}

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(LOCAL_ONLY_ERROR, { status: 403 });
  }

  const youtubeId = new URL(request.url).searchParams.get("id") ?? "";
  if (!/^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) {
    return Response.json({ title: "" });
  }

  try {
    const watchUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`,
      { cache: "no-store" },
    );
    if (!response.ok) {
      return Response.json({ title: "" });
    }
    return Response.json({ title: parseTitle(await response.json()) });
  } catch {
    return Response.json({ title: "" });
  }
}

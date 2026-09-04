import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENV_PATH = join(ROOT, ".env.local");
const OVERRIDES_PATH = join(ROOT, "lib/portfolio-overrides.json");

function loadEnvLocal(filePath) {
  let contents;
  try {
    contents = readFileSync(filePath, "utf8");
  } catch {
    throw new Error(`Could not read ${filePath}`);
  }

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separator = line.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) {
      process.env[key] = value;
    }
  }
}

function guessTitle(filename) {
  const withoutExtension = String(filename).replace(/\.[^.]+$/, "");
  return withoutExtension
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function highestOrder(overrides) {
  const orders = Object.values(overrides).map((entry) =>
    typeof entry.order === "number" ? entry.order : 0,
  );
  return orders.length > 0 ? Math.max(...orders) : 0;
}

async function main() {
  loadEnvLocal(ENV_PATH);

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_API_TOKEN;

  if (!accountId || !token) {
    throw new Error(
      "Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_STREAM_API_TOKEN in .env.local",
    );
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
    throw new Error(`Cloudflare Stream request failed: ${response.status}`);
  }

  const payload = await response.json();
  const videos = Array.isArray(payload.result) ? payload.result : [];

  const overrides = JSON.parse(readFileSync(OVERRIDES_PATH, "utf8"));
  let nextOrder = highestOrder(overrides) + 10;
  const added = [];

  for (const video of videos) {
    const uid = video?.uid;
    if (!uid || Object.prototype.hasOwnProperty.call(overrides, uid)) {
      continue;
    }

    const filename = video.meta?.name ?? uid;
    const title = guessTitle(filename);
    overrides[uid] = { title, order: nextOrder };
    added.push({ uid, filename, title, order: nextOrder });
    nextOrder += 10;
  }

  writeFileSync(OVERRIDES_PATH, `${JSON.stringify(overrides, null, 2)}\n`);

  if (added.length === 0) {
    console.log("No new Stream videos to add.");
    return;
  }

  console.log(`Added ${added.length} new video(s):\n`);
  console.table(
    added.map(({ uid, filename, title }) => ({
      uid,
      filename,
      title,
    })),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

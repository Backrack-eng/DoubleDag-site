import fs from "node:fs";
import path from "node:path";
import RECOMMENDATIONS from "./portfolio-recommendations.json";

export type RecommendationColor = "violet" | "white";

export type PortfolioRecommendation = {
  id: string;
  quote: string;
  attribution: string;
  color: RecommendationColor;
  hidden?: boolean;
};

const RECOMMENDATIONS_PATH = path.join(
  process.cwd(),
  "lib",
  "portfolio-recommendations.json",
);

export function portfolioRecommendationsFilePath() {
  return RECOMMENDATIONS_PATH;
}

function isColor(value: unknown): value is RecommendationColor {
  return value === "violet" || value === "white";
}

export function normalizeRecommendations(
  value: unknown,
): PortfolioRecommendation[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item, index) => {
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }
    const row = item as Record<string, unknown>;
    const quote = typeof row.quote === "string" ? row.quote : "";
    const attribution =
      typeof row.attribution === "string" ? row.attribution : "";
    const color = isColor(row.color) ? row.color : "white";
    const id =
      typeof row.id === "string" && row.id.trim()
        ? row.id.trim()
        : `rec-${index}`;
    const entry: PortfolioRecommendation = {
      id,
      quote,
      attribution,
      color,
    };
    if (typeof row.hidden === "boolean") {
      entry.hidden = row.hidden;
    }
    return [entry];
  });
}

/**
 * - Development: re-read from disk so admin Save + reload works.
 * - Production / build: static import (no fs).
 */
export function loadPortfolioRecommendations(): PortfolioRecommendation[] {
  if (process.env.NODE_ENV === "development") {
    const raw = JSON.parse(fs.readFileSync(RECOMMENDATIONS_PATH, "utf8"));
    return normalizeRecommendations(raw);
  }
  return normalizeRecommendations(RECOMMENDATIONS);
}

export function visibleRecommendations(
  items: PortfolioRecommendation[],
): PortfolioRecommendation[] {
  return items.filter((item) => !item.hidden && item.quote.trim());
}

import fs from "node:fs";
import contentPricingData from "./content-pricing.json";
import creativeTechnologistData from "./creative-technologist.json";
import creatorsData from "./creators.json";
import homeData from "./home.json";
import pricingData from "./pricing.json";
import researchData from "./research.json";
import { contentFilePath, type ContentPageKey } from "./registry";

const STATIC_CONTENT = {
  home: homeData,
  pricing: pricingData,
  "content-pricing": contentPricingData,
  research: researchData,
  creators: creatorsData,
  "creative-technologist": creativeTechnologistData,
} as const satisfies Record<ContentPageKey, unknown>;

/**
 * Content for public pages.
 * - Production / build: returns the statically imported JSON (keeps routes ○ static).
 * - Development: re-reads from disk so admin Save + reload shows edits immediately.
 */
export function loadContent<T = unknown>(key: ContentPageKey): T {
  if (process.env.NODE_ENV === "development") {
    return JSON.parse(fs.readFileSync(contentFilePath(key), "utf8")) as T;
  }
  return STATIC_CONTENT[key] as T;
}

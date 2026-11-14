import path from "node:path";

export type ContentPageKey =
  | "home"
  | "pricing"
  | "content-pricing"
  | "research"
  | "creators"
  | "creative-technologist";

export type ContentPageMeta = {
  key: ContentPageKey;
  label: string;
  href: string;
  fileName: string;
};

/** Whitelist of editable content pages. Paths resolve only from this map. */
export const CONTENT_PAGES: ContentPageMeta[] = [
  {
    key: "home",
    label: "Home",
    href: "/",
    fileName: "home.json",
  },
  {
    key: "pricing",
    label: "Pricing",
    href: "/pricing",
    fileName: "pricing.json",
  },
  {
    key: "content-pricing",
    label: "Content Pricing",
    href: "/content-pricing",
    fileName: "content-pricing.json",
  },
  {
    key: "research",
    label: "Research",
    href: "/research",
    fileName: "research.json",
  },
  {
    key: "creators",
    label: "Creators",
    href: "/creators",
    fileName: "creators.json",
  },
  {
    key: "creative-technologist",
    label: "Creative Technologist",
    href: "/creative-technologist",
    fileName: "creative-technologist.json",
  },
];

const PAGE_BY_KEY = Object.fromEntries(
  CONTENT_PAGES.map((page) => [page.key, page]),
) as Record<ContentPageKey, ContentPageMeta>;

export function isContentPageKey(value: string): value is ContentPageKey {
  return Object.prototype.hasOwnProperty.call(PAGE_BY_KEY, value);
}

export function contentFilePath(key: ContentPageKey): string {
  const meta = PAGE_BY_KEY[key];
  return path.join(process.cwd(), "lib", "content", meta.fileName);
}

export function getContentPage(key: string): ContentPageMeta | null {
  if (!isContentPageKey(key)) {
    return null;
  }
  return PAGE_BY_KEY[key];
}

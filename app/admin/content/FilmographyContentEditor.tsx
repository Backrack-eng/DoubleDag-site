"use client";

import { ContentEditor } from "../components/ContentEditor";
import { FilmographyReelPanel } from "./FilmographyReelPanel";

const FILMOGRAPHY_REEL_KEYS = [
  "reelUid",
  "reelLabel",
  "reelTitle",
  "reelDescription",
  "reelThumbnailTime",
];

type FilmographyContentEditorProps = {
  pageKey: string;
  label: string;
  publicHref: string;
};

export function FilmographyContentEditor({
  pageKey,
  label,
  publicHref,
}: FilmographyContentEditorProps) {
  return (
    <ContentEditor
      pageKey={pageKey}
      label={label}
      publicHref={publicHref}
      omitTopLevelKeys={FILMOGRAPHY_REEL_KEYS}
      renderBefore={({ content, updatePath }) => (
        <FilmographyReelPanel content={content} updatePath={updatePath} />
      )}
    />
  );
}

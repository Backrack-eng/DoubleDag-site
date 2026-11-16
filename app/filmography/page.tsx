import type { Metadata } from "next";
import { connection } from "next/server";
import { loadContent } from "../../lib/content/load-content";
import FilmographyClient, {
  type FilmographyClientProps,
} from "./FilmographyClient";

type Hideable = { hidden?: boolean };

type FilmographyData = {
  meta: { title: string; description: string };
  hero: FilmographyClientProps["hero"];
  reelUid: string;
  reelLabel?: string;
  reelTitle: string;
  reelDescription?: string;
  reelThumbnailTime?: string | null;
  selectedSeries: {
    heading: string;
    introParts: FilmographyClientProps["selectedSeries"]["introParts"];
    columns: Array<
      Hideable & {
        title: string;
        items: Array<Hideable & { text: string }>;
      }
    >;
  };
  documentary: {
    heading: string;
    introParts: FilmographyClientProps["documentary"]["introParts"];
    cards: Array<
      Hideable & FilmographyClientProps["documentary"]["cards"][number]
    >;
  };
  youtube: {
    heading: string;
    introParts: FilmographyClientProps["youtube"]["introParts"];
    body: string;
    cards: Array<Hideable & FilmographyClientProps["youtube"]["cards"][number]>;
  };
  featureFilm: FilmographyClientProps["featureFilm"];
  emmyVideoSrc: string;
  behindTheScenes: {
    eyebrow: string;
    heading: string;
    items: Array<
      Hideable & FilmographyClientProps["behindTheScenes"]["items"][number]
    >;
  };
  cta: {
    eyebrow: string;
    heading: string;
    body: string;
    buttons: Array<Hideable & FilmographyClientProps["cta"]["buttons"][number]>;
  };
};

function visible<T extends Hideable>(items: T[]): T[] {
  return items.filter((item) => !item.hidden);
}

export async function generateMetadata(): Promise<Metadata> {
  // Dev: bypass Full Route Cache so admin Save + reload sees disk edits.
  if (process.env.NODE_ENV === "development") {
    await connection();
  }
  const content = loadContent<FilmographyData>("filmography");
  return {
    title: content.meta.title,
    description: content.meta.description,
  };
}

export default async function FilmographyPage() {
  // Dev only — keeps production /filmography statically prerendered (○).
  if (process.env.NODE_ENV === "development") {
    await connection();
  }

  const content = loadContent<FilmographyData>("filmography");

  return (
    <FilmographyClient
      hero={content.hero}
      reelUid={content.reelUid}
      reelLabel={content.reelLabel ?? ""}
      reelTitle={content.reelTitle}
      reelDescription={content.reelDescription ?? ""}
      reelThumbnailTime={
        content.reelThumbnailTime === ""
          ? undefined
          : content.reelThumbnailTime
      }
      selectedSeries={{
        heading: content.selectedSeries.heading,
        introParts: content.selectedSeries.introParts,
        columns: visible(content.selectedSeries.columns).map((column) => ({
          title: column.title,
          items: visible(column.items),
        })),
      }}
      documentary={{
        heading: content.documentary.heading,
        introParts: content.documentary.introParts,
        cards: visible(content.documentary.cards),
      }}
      youtube={{
        heading: content.youtube.heading,
        introParts: content.youtube.introParts,
        body: content.youtube.body,
        cards: visible(content.youtube.cards),
      }}
      featureFilm={content.featureFilm}
      emmyVideoSrc={content.emmyVideoSrc}
      behindTheScenes={{
        eyebrow: content.behindTheScenes.eyebrow,
        heading: content.behindTheScenes.heading,
        items: visible(content.behindTheScenes.items).map(
          ({ src, alt }) => ({ src, alt }),
        ),
      }}
      cta={{
        eyebrow: content.cta.eyebrow,
        heading: content.cta.heading,
        body: content.cta.body,
        buttons: visible(content.cta.buttons),
      }}
    />
  );
}

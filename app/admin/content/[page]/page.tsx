import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ContentEditor } from "../../components/ContentEditor";
import { getContentPage } from "../../../../lib/content/registry";
import { FilmographyContentEditor } from "../FilmographyContentEditor";

type PageProps = {
  params: Promise<{ page: string }>;
};

export default async function AdminContentPage({ params }: PageProps) {
  await connection();
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { page } = await params;
  const meta = getContentPage(page);
  if (!meta) {
    notFound();
  }

  if (meta.key === "filmography") {
    return (
      <FilmographyContentEditor
        pageKey={meta.key}
        label={meta.label}
        publicHref={meta.href}
      />
    );
  }

  return (
    <ContentEditor
      pageKey={meta.key}
      label={meta.label}
      publicHref={meta.href}
    />
  );
}

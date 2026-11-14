import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ContentEditor } from "../../components/ContentEditor";
import { getContentPage } from "../../../../lib/content/registry";

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

  return (
    <ContentEditor
      pageKey={meta.key}
      label={meta.label}
      publicHref={meta.href}
    />
  );
}

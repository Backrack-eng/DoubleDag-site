import { notFound } from "next/navigation";
import { connection } from "next/server";
import HomeFeaturedEditor from "./HomeFeaturedEditor";

export default async function HomeFeaturedAdminPage() {
  await connection();
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <HomeFeaturedEditor />;
}

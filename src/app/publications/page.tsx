import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { PublicationList } from "@/components/PublicationList";
import { publications } from "@/data/publications";
import { themes } from "@/data/research";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Publications",
  description: "Peer-reviewed publications from the Computational Materials Design group.",
};

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>;
}) {
  const { theme } = await searchParams;
  return (
    <>
      <PageHeader title="Publications">
        <p className="measure mt-6 text-[var(--text-lead)] leading-relaxed text-muted">
          Papers from the group, newest first. A complete and always up-to-date list is on{" "}
          <a className="link" href={site.scholar}>
            Google Scholar
          </a>
          .
        </p>
      </PageHeader>
      <section className="py-12 md:py-16">
        <div className="wrap">
          <PublicationList publications={publications} themes={themes} initialTheme={theme} />
        </div>
      </section>
    </>
  );
}

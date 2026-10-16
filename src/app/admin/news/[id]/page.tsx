import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsForm } from "@/components/admin/NewsForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { requireMember } from "@/lib/member";
import { NEWS_COLUMNS, type NewsRow } from "@/lib/news";

export const metadata = { title: "Edit news" };

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, isAdmin } = await requireMember();

  const { data: n } = await supabase.from("news").select(NEWS_COLUMNS).eq("id", id).maybeSingle<NewsRow>();
  if (!n) notFound();

  const locked = !isAdmin && n.status === "published";

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <h1 className="text-[2.4rem] md:text-[var(--text-h2)]">Edit news</h1>
        <StatusBadge status={n.status} />
      </div>
      {n.review_note && (
        <p className="mt-4 max-w-3xl rounded-lg border border-line bg-white px-4 py-3 text-[0.95rem]">
          <span className="text-muted">Admin&apos;s note:</span> {n.review_note}
        </p>
      )}
      {locked ? (
        <p className="mt-6 text-muted">
          This news is published, so only an admin can change it.{" "}
          <Link className="link" href="/admin">
            Back to the dashboard
          </Link>
        </p>
      ) : (
        <NewsForm
          userId={user.id}
          isAdmin={isAdmin}
          initial={{
            id: n.id,
            title: n.title,
            body: n.body,
            kind: n.kind,
            newsDate: n.news_date,
            imagePath: n.image_path,
          }}
        />
      )}
    </>
  );
}

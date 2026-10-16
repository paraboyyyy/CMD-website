/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { NewsActions } from "@/components/admin/NewsActions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { newsKindLabel } from "@/data/news";
import { requireMember } from "@/lib/member";
import { NEWS_COLUMNS, type NewsRow } from "@/lib/news";
import { imageUrl } from "@/lib/supabase/config";

export const metadata = { title: "Dashboard" };

type Row = NewsRow & { author: { full_name: string } | null };

const SAVED: Record<string, string> = {
  draft: "Draft saved. Only you and the admins can see it.",
  pending: "Sent for approval. It will appear on the website once an admin approves it.",
  published: "Published. It is now on the news page.",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { supabase, user, isAdmin } = await requireMember();
  const { saved } = await searchParams;

  // Row Level Security decides what comes back: members get their own news, admins get everything.
  const { data, error } = await supabase
    .from("news")
    .select(`${NEWS_COLUMNS}, author:profiles(full_name)`)
    .order("updated_at", { ascending: false })
    .returns<Row[]>();
  const rows = data ?? [];

  const waiting = isAdmin ? rows.filter((r) => r.status === "pending") : [];
  const listed = isAdmin ? rows.filter((r) => r.status !== "pending") : rows;

  return (
    <>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[2.4rem] md:text-[var(--text-h2)]">Dashboard</h1>
          <p className="mt-2 text-muted">
            {isAdmin
              ? "Approve news from group members, or write your own."
              : "Write news for the website. An admin checks each item before it is published."}
          </p>
        </div>
        <Link href="/admin/news/new" className="btn btn-primary">
          Write news
        </Link>
      </div>

      {saved && SAVED[saved] && (
        <p role="status" className="mt-8 rounded-lg border border-valence/30 bg-valence-lt/10 px-4 py-3 text-[0.95rem]">
          {SAVED[saved]}
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-8 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900"
        >
          Could not load news: {error.message}
        </p>
      )}

      {isAdmin && (
        <section className="mt-12">
          <h2 className="text-[1.7rem]">
            Waiting for approval <span className="text-muted">({waiting.length})</span>
          </h2>
          {waiting.length === 0 ? (
            <p className="mt-4 text-muted">Nothing to review right now.</p>
          ) : (
            <ul className="mt-6 grid gap-6">
              {waiting.map((n) => {
                const img = imageUrl(n.image_path);
                return (
                  <li key={n.id} className="rounded-xl border border-line bg-white p-6">
                    <p className="text-[0.88rem] text-muted">
                      {n.author?.full_name || "A member"} · {newsKindLabel[n.kind]} · {fmt(n.news_date)}
                    </p>
                    <h3 className="mt-1 text-[1.5rem] leading-snug">{n.title}</h3>
                    {img && (
                      <img src={img} alt="" className="mt-4 max-h-72 rounded-lg border border-line object-cover" />
                    )}
                    <p className="mt-3 line-clamp-6 whitespace-pre-line text-muted">{n.body || "(No text)"}</p>
                    <div className="mt-5">
                      <NewsActions id={n.id} status={n.status} canEdit canDelete review />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <section className="mt-14">
        <h2 className="text-[1.7rem]">{isAdmin ? "All news" : "My news"}</h2>
        {listed.length === 0 ? (
          <p className="mt-4 text-muted">
            {isAdmin ? "No news yet." : "You have not written any news yet."}{" "}
            <Link className="link" href="/admin/news/new">
              Write the first one
            </Link>
          </p>
        ) : (
          <ul className="mt-6 border-t border-line">
            {listed.map((n) => {
              const own = n.author_id === user.id;
              const editable = isAdmin || (own && n.status !== "published");
              return (
                <li
                  key={n.id}
                  className="grid gap-3 border-b border-line py-5 md:grid-cols-[1fr_auto] md:items-start md:gap-8"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge status={n.status} />
                      <span className="text-[0.88rem] text-muted">
                        {fmt(n.news_date)}
                        {isAdmin && ` · ${own ? "you" : n.author?.full_name || "a member"}`}
                      </span>
                    </div>
                    <p className="mt-2 font-medium leading-snug">{n.title}</p>
                    {n.status === "rejected" && n.review_note && (
                      <p className="mt-2 text-[0.92rem] text-red-900">Admin&apos;s note: {n.review_note}</p>
                    )}
                    {n.status === "draft" && n.review_note && (
                      <p className="mt-2 text-[0.92rem] text-muted">Note: {n.review_note}</p>
                    )}
                  </div>
                  <NewsActions id={n.id} status={n.status} canEdit={editable} canDelete={editable} review={isAdmin} />
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

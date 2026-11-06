import Link from "next/link";
import { deleteTheme } from "@/app/admin/content-actions";
import { ContentNotice } from "@/components/admin/ContentNotice";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { publications } from "@/data/publications";
import { THEME_COLUMNS, type ThemeRow } from "@/lib/content";
import { requireAdmin } from "@/lib/member";

export const metadata = { title: "Research themes" };

export default async function AdminResearchPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { supabase } = await requireAdmin();
  const { saved } = await searchParams;
  const { data, error } = await supabase
    .from("research_themes")
    .select(THEME_COLUMNS)
    .order("sort_order")
    .order("title")
    .returns<ThemeRow[]>();

  const papers = (id: string) => publications.filter((p) => p.theme === id).length;

  return (
    <>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[2.4rem] md:text-[var(--text-h2)]">Research themes</h1>
          <p className="mt-2 text-muted">Shown on the Research page, the home page and as filters on Publications.</p>
        </div>
        <Link href="/admin/research/new" className="btn btn-primary">
          Add theme
        </Link>
      </div>

      {saved && (
        <p role="status" className="mt-8 rounded-lg border border-valence/30 bg-valence-lt/10 px-4 py-3 text-[0.95rem]">
          Saved. The public pages show the change straight away.
        </p>
      )}
      {error ? (
        <ContentNotice message={error.message} />
      ) : data.length === 0 ? (
        <p className="mt-10 text-muted">No research themes yet.</p>
      ) : (
        <ul className="mt-10 border-t border-line">
          {data.map((t) => (
            <li
              key={t.id}
              className="grid gap-3 border-b border-line py-5 md:grid-cols-[3rem_1fr_auto] md:items-start md:gap-6"
            >
              <span className="font-mono text-[0.9rem] text-muted">#{t.sort_order}</span>
              <div>
                <p className="font-display text-[1.35rem] leading-snug">{t.title}</p>
                <p className="mt-1 text-[0.9rem] text-muted">
                  <span className="font-mono">{t.id}</span> · {papers(t.id)} papers · {t.elements.length} elements
                </p>
                <p className="mt-2 text-muted">{t.summary}</p>
              </div>
              <div className="flex gap-4 text-[0.92rem]">
                <Link className="link" href={`/admin/research/${t.id}`}>
                  Edit
                </Link>
                <DeleteButton
                  id={t.id}
                  action={deleteTheme}
                  confirmText={
                    papers(t.id)
                      ? `Delete "${t.title}"? ${papers(t.id)} papers use this theme; they stay on the publications page but lose this filter.`
                      : `Delete "${t.title}"?`
                  }
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

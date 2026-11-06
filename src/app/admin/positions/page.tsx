import Link from "next/link";
import { deletePosition } from "@/app/admin/content-actions";
import { ContentNotice } from "@/components/admin/ContentNotice";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { OpenToggle } from "@/components/admin/OpenToggle";
import { POSITION_COLUMNS, type PositionRow } from "@/lib/content";
import { requireAdmin } from "@/lib/member";

export const metadata = { title: "Open positions" };

export default async function AdminPositionsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { supabase } = await requireAdmin();
  const { saved } = await searchParams;
  const { data, error } = await supabase
    .from("positions")
    .select(POSITION_COLUMNS)
    .order("is_open", { ascending: false })
    .order("sort_order")
    .order("title")
    .returns<PositionRow[]>();

  return (
    <>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[2.4rem] md:text-[var(--text-h2)]">Open positions</h1>
          <p className="mt-2 text-muted">Shown on the Join us page. Close a position to hide it without deleting it.</p>
        </div>
        <Link href="/admin/positions/new" className="btn btn-primary">
          Add position
        </Link>
      </div>

      {saved && (
        <p role="status" className="mt-8 rounded-lg border border-valence/30 bg-valence-lt/10 px-4 py-3 text-[0.95rem]">
          Saved. The Join us page shows the change straight away.
        </p>
      )}

      {error ? (
        <ContentNotice message={error.message} file="supabase/positions.sql" />
      ) : data.length === 0 ? (
        <p className="mt-10 text-muted">
          No positions yet. While the list is empty, the Join us page invites students to get in touch anyway.
        </p>
      ) : (
        <ul className="mt-10 border-t border-line">
          {data.map((p) => (
            <li
              key={p.id}
              className="grid gap-3 border-b border-line py-5 md:grid-cols-[1fr_auto] md:items-start md:gap-6"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.8rem] ${
                      p.is_open ? "border-valence/40 bg-valence-lt/15 text-valence" : "border-line text-muted"
                    }`}
                  >
                    {p.is_open ? "Open" : "Closed"}
                  </span>
                  <span className="font-mono text-[0.85rem] text-muted">#{p.sort_order}</span>
                </div>
                <p className={`mt-2 font-display text-[1.35rem] leading-snug ${p.is_open ? "" : "text-muted"}`}>
                  {p.title}
                </p>
                <p className="mt-1 text-[0.92rem] text-muted">{[p.level, p.deadline].filter(Boolean).join(" · ")}</p>
              </div>
              <div className="flex gap-4 text-[0.92rem]">
                <OpenToggle id={p.id} isOpen={p.is_open} />
                <Link className="link" href={`/admin/positions/${p.id}`}>
                  Edit
                </Link>
                <DeleteButton id={p.id} action={deletePosition} confirmText={`Delete "${p.title}" permanently?`} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

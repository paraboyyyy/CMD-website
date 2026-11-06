import { notFound } from "next/navigation";
import { PositionForm } from "@/components/admin/PositionForm";
import { POSITION_COLUMNS, type PositionRow } from "@/lib/content";
import { requireAdmin } from "@/lib/member";

export const metadata = { title: "Edit position" };

export default async function EditPositionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data: p } = await supabase.from("positions").select(POSITION_COLUMNS).eq("id", id).maybeSingle<PositionRow>();
  if (!p) notFound();

  return (
    <>
      <h1 className="mt-10 text-[2.4rem] md:text-[var(--text-h2)]">Edit position</h1>
      <PositionForm
        initial={{
          id: p.id,
          title: p.title,
          level: p.level,
          deadline: p.deadline,
          body: p.body,
          requirements: p.requirements,
          isOpen: p.is_open,
          sortOrder: p.sort_order,
        }}
      />
    </>
  );
}

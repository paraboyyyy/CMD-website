import { PositionForm } from "@/components/admin/PositionForm";
import { requireAdmin } from "@/lib/member";

export const metadata = { title: "Add position" };

export default async function NewPositionPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("positions")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  return (
    <>
      <h1 className="mt-10 text-[2.4rem] md:text-[var(--text-h2)]">Add position</h1>
      <PositionForm nextOrder={(data?.[0]?.sort_order ?? 0) + 1} />
    </>
  );
}

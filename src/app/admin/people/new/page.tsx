import { PersonForm } from "@/components/admin/PersonForm";
import { requireAdmin } from "@/lib/member";

export const metadata = { title: "Add person" };

export default async function NewPersonPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("people")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  return (
    <>
      <h1 className="mt-10 text-[2.4rem] md:text-[var(--text-h2)]">Add person</h1>
      <PersonForm nextOrder={(data?.[0]?.sort_order ?? 0) + 1} />
    </>
  );
}

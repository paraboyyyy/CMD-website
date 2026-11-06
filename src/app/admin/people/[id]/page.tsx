import { notFound } from "next/navigation";
import { PersonForm } from "@/components/admin/PersonForm";
import { PERSON_COLUMNS, type PersonRow } from "@/lib/content";
import { requireAdmin } from "@/lib/member";

export const metadata = { title: "Edit person" };

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const { data: p } = await supabase.from("people").select(PERSON_COLUMNS).eq("id", id).maybeSingle<PersonRow>();
  if (!p) notFound();

  return (
    <>
      <h1 className="mt-10 text-[2.4rem] md:text-[var(--text-h2)]">Edit person</h1>
      <PersonForm
        initial={{
          id: p.id,
          name: p.name,
          role: p.role,
          group: p.member_group,
          focus: p.focus,
          email: p.email ?? "",
          bio: p.bio ?? "",
          photoPath: p.photo_path,
          links: p.links,
          sortOrder: p.sort_order,
        }}
      />
    </>
  );
}

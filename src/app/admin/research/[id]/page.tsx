import { notFound } from "next/navigation";
import { ThemeForm } from "@/components/admin/ThemeForm";
import { THEME_COLUMNS, type ThemeRow } from "@/lib/content";
import { requireAdmin } from "@/lib/member";

export const metadata = { title: "Edit research theme" };

export default async function EditThemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdmin();
  const { data: t } = await supabase.from("research_themes").select(THEME_COLUMNS).eq("id", id).maybeSingle<ThemeRow>();
  if (!t) notFound();

  return (
    <>
      <h1 className="mt-10 text-[2.4rem] md:text-[var(--text-h2)]">Edit research theme</h1>
      <ThemeForm
        initial={{
          id: t.id,
          title: t.title,
          summary: t.summary,
          body: t.body,
          questions: t.questions,
          methods: t.methods,
          elements: t.elements,
          sortOrder: t.sort_order,
        }}
      />
    </>
  );
}

import { NewsForm } from "@/components/admin/NewsForm";
import { requireMember } from "@/lib/member";

export const metadata = { title: "Write news" };

export default async function NewNewsPage() {
  const { user, isAdmin } = await requireMember();
  return (
    <>
      <h1 className="mt-10 text-[2.4rem] md:text-[var(--text-h2)]">Write news</h1>
      <p className="mt-2 text-muted">
        {isAdmin
          ? "As an admin you can publish straight away, or save a draft."
          : "Save a draft to finish later, or send it for approval. An admin publishes it."}
      </p>
      <NewsForm userId={user.id} isAdmin={isAdmin} />
    </>
  );
}

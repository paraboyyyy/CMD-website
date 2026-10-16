"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireMember } from "@/lib/member";
import { NEWS_BUCKET } from "@/lib/supabase/config";

// Row Level Security in Supabase is what actually enforces who may do what (see supabase/schema.sql).
// The checks here only give clearer messages and keep the public pages fresh.

const KINDS = ["paper", "award", "event", "people", "grant"] as const;

export type SaveNewsInput = {
  id?: string;
  title: string;
  body: string;
  kind: string;
  newsDate: string;
  imagePath: string | null;
  /** draft: keep working on it; pending: send to an admin; published: admins only */
  status: "draft" | "pending" | "published";
};

function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/news");
}

export async function saveNews(input: SaveNewsInput): Promise<{ error: string } | void> {
  const { supabase, isAdmin } = await requireMember();

  const title = input.title.trim();
  if (title.length < 3) return { error: "Give the news a title of at least 3 characters." };
  if (title.length > 200) return { error: "Keep the title under 200 characters." };
  if (input.body.length > 20000) return { error: "The text is too long (20,000 characters at most)." };
  if (!KINDS.includes(input.kind as (typeof KINDS)[number])) return { error: "Choose a category." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.newsDate)) return { error: "Choose a date." };
  if (input.status === "published" && !isAdmin) return { error: "Only an admin can publish news." };

  const row = {
    title,
    body: input.body.trim(),
    kind: input.kind,
    news_date: input.newsDate,
    image_path: input.imagePath,
    status: input.status,
    ...(input.status === "pending" || input.status === "published" ? { review_note: null } : {}),
  };

  const previous = input.id
    ? (await supabase.from("news").select("image_path").eq("id", input.id).single()).data
    : null;

  const { error, count } = input.id
    ? await supabase.from("news").update(row, { count: "exact" }).eq("id", input.id)
    : await supabase.from("news").insert(row, { count: "exact" });
  if (error) return { error: `Could not save: ${error.message}` };
  if (!count) return { error: "This news can no longer be edited. Published news can only be changed by an admin." };

  // The picture was removed or replaced: drop the old file so storage does not fill up.
  if (previous?.image_path && previous.image_path !== input.imagePath) {
    await supabase.storage.from(NEWS_BUCKET).remove([previous.image_path]);
  }

  refreshPublicPages();
  revalidatePath("/admin");
  redirect(`/admin?saved=${input.status}`);
}

export async function reviewNews(id: string, decision: "approve" | "reject" | "unpublish", note?: string) {
  const { supabase, isAdmin } = await requireMember();
  if (!isAdmin) return { error: "Only an admin can review news." };

  const update =
    decision === "approve"
      ? { status: "published", review_note: null }
      : decision === "reject"
        ? { status: "rejected", review_note: note?.trim() || null }
        : { status: "draft", review_note: note?.trim() || "Unpublished by an admin." };

  const { error, count } = await supabase.from("news").update(update, { count: "exact" }).eq("id", id);
  if (error) return { error: `Could not update: ${error.message}` };
  if (!count) return { error: "That news no longer exists." };

  refreshPublicPages();
  revalidatePath("/admin");
}

export async function deleteNews(id: string) {
  const { supabase } = await requireMember();
  const { data } = await supabase.from("news").select("image_path").eq("id", id).single();

  const { error, count } = await supabase.from("news").delete({ count: "exact" }).eq("id", id);
  if (error) return { error: `Could not delete: ${error.message}` };
  if (!count) return { error: "You can only delete your own news that is not published." };
  if (data?.image_path) await supabase.storage.from(NEWS_BUCKET).remove([data.image_path]);

  refreshPublicPages();
  revalidatePath("/admin");
}

export async function signOut() {
  const { supabase } = await requireMember();
  await supabase.auth.signOut();
  redirect("/login");
}

export type PasswordState = { error?: string; done?: boolean };

export async function changePassword(_prev: PasswordState, form: FormData): Promise<PasswordState> {
  const { supabase } = await requireMember();
  const password = String(form.get("password") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (password !== confirm) return { error: "The two passwords do not match." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: `Could not change the password: ${error.message}` };
  return { done: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ELEMENT_SYMBOLS } from "@/data/elements";
import { requireAdmin } from "@/lib/member";
import { PEOPLE_BUCKET } from "@/lib/supabase/config";

// Admin-only edits to research themes, people and alumni. Row Level Security (supabase/content.sql)
// is what enforces that only admins can write; these checks give clearer messages.

type Result = { error: string } | void;

const GROUPS = ["lead", "postdoc", "phd", "master", "undergrad"] as const;

function refreshContentPages() {
  revalidatePath("/");
  revalidatePath("/research");
  revalidatePath("/publications");
  revalidatePath("/people");
  revalidatePath("/join");
  revalidatePath("/admin", "layout");
}

const clean = (items: string[]) => items.map((s) => s.trim()).filter(Boolean);

// ── Research themes ──────────────────────────────────────────────────

export type ThemeInput = {
  /** Set when editing; for a new theme the id is taken from `slug`. */
  id?: string;
  slug: string;
  title: string;
  summary: string;
  body: string[];
  questions: string[];
  methods: string[];
  elements: string[];
  sortOrder: number;
};

export async function saveTheme(input: ThemeInput): Promise<Result> {
  const { supabase } = await requireAdmin();

  const title = input.title.trim();
  if (title.length < 3) return { error: "Give the theme a title of at least 3 characters." };
  const id = input.id ?? input.slug.trim();
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    return { error: "The short name may only use lowercase letters, numbers and single dashes, e.g. spin-orbit." };
  }
  const elements = clean(input.elements);
  const unknown = elements.filter((e) => !ELEMENT_SYMBOLS.includes(e));
  if (unknown.length) {
    return {
      error: `Not on the periodic table shown on the site: ${unknown.join(", ")}. Check capital letters (e.g. Mo, not MO).`,
    };
  }

  const row = {
    title,
    summary: input.summary.trim(),
    body: clean(input.body),
    questions: clean(input.questions),
    methods: clean(input.methods),
    elements: [...new Set(elements)],
    sort_order: Number.isFinite(input.sortOrder) ? Math.round(input.sortOrder) : 0,
  };

  const { error, count } = input.id
    ? await supabase.from("research_themes").update(row, { count: "exact" }).eq("id", input.id)
    : await supabase.from("research_themes").insert({ id, ...row }, { count: "exact" });
  if (error) {
    return {
      error:
        error.code === "23505"
          ? `A theme with the short name "${id}" already exists.`
          : `Could not save: ${error.message}`,
    };
  }
  if (!count) return { error: "That theme no longer exists." };

  refreshContentPages();
  redirect("/admin/research?saved=1");
}

export async function deleteTheme(id: string): Promise<Result> {
  const { supabase } = await requireAdmin();
  const { error, count } = await supabase.from("research_themes").delete({ count: "exact" }).eq("id", id);
  if (error) return { error: `Could not delete: ${error.message}` };
  if (!count) return { error: "That theme no longer exists." };
  refreshContentPages();
}

// ── People ───────────────────────────────────────────────────────────

export type PersonInput = {
  id?: string;
  name: string;
  role: string;
  group: string;
  focus: string;
  email: string;
  bio: string;
  photoPath: string | null;
  links: { label: string; href: string }[];
  sortOrder: number;
};

export async function savePerson(input: PersonInput): Promise<Result> {
  const { supabase } = await requireAdmin();

  const name = input.name.trim();
  if (name.length < 2) return { error: "Enter the person's name." };
  if (!GROUPS.includes(input.group as (typeof GROUPS)[number])) return { error: "Choose a group." };
  const email = input.email.trim();
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return { error: "That email address does not look right." };
  const links = input.links
    .map((l) => ({ label: l.label.trim(), href: l.href.trim() }))
    .filter((l) => l.label || l.href);
  const badLink = links.find((l) => !l.label || !/^https?:\/\/\S+$/.test(l.href));
  if (badLink) return { error: "Each link needs a label and a web address starting with https://" };

  const row = {
    name,
    role: input.role.trim(),
    member_group: input.group,
    focus: input.focus.trim(),
    email: email || null,
    bio: input.bio.trim() || null,
    photo_path: input.photoPath,
    links,
    sort_order: Number.isFinite(input.sortOrder) ? Math.round(input.sortOrder) : 0,
  };

  const previous = input.id
    ? (await supabase.from("people").select("photo_path").eq("id", input.id).single()).data
    : null;

  const { error, count } = input.id
    ? await supabase.from("people").update(row, { count: "exact" }).eq("id", input.id)
    : await supabase.from("people").insert(row, { count: "exact" });
  if (error) return { error: `Could not save: ${error.message}` };
  if (!count) return { error: "That person no longer exists." };

  // The photo was removed or replaced: drop the old file.
  if (previous?.photo_path && previous.photo_path !== input.photoPath) {
    await supabase.storage.from(PEOPLE_BUCKET).remove([previous.photo_path]);
  }

  refreshContentPages();
  redirect("/admin/people?saved=1");
}

export async function deletePerson(id: string): Promise<Result> {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("people").select("photo_path").eq("id", id).single();
  const { error, count } = await supabase.from("people").delete({ count: "exact" }).eq("id", id);
  if (error) return { error: `Could not delete: ${error.message}` };
  if (!count) return { error: "That person no longer exists." };
  if (data?.photo_path) await supabase.storage.from(PEOPLE_BUCKET).remove([data.photo_path]);
  refreshContentPages();
}

// ── Alumni ───────────────────────────────────────────────────────────

export type AlumnusInput = { id?: string; name: string; then: string; now: string; sortOrder: number };

export async function saveAlumnus(input: AlumnusInput): Promise<Result> {
  const { supabase } = await requireAdmin();
  const name = input.name.trim();
  if (name.length < 2) return { error: "Enter the name." };

  const row = {
    name,
    then_text: input.then.trim(),
    now_text: input.now.trim(),
    sort_order: Number.isFinite(input.sortOrder) ? Math.round(input.sortOrder) : 0,
  };
  const { error, count } = input.id
    ? await supabase.from("alumni").update(row, { count: "exact" }).eq("id", input.id)
    : await supabase.from("alumni").insert(row, { count: "exact" });
  if (error) return { error: `Could not save: ${error.message}` };
  if (!count) return { error: "That entry no longer exists." };
  refreshContentPages();
}

export async function deleteAlumnus(id: string): Promise<Result> {
  const { supabase } = await requireAdmin();
  const { error, count } = await supabase.from("alumni").delete({ count: "exact" }).eq("id", id);
  if (error) return { error: `Could not delete: ${error.message}` };
  if (!count) return { error: "That entry no longer exists." };
  refreshContentPages();
}

// ── Open positions ───────────────────────────────────────────────────

export type PositionInput = {
  id?: string;
  title: string;
  level: string;
  deadline: string;
  body: string;
  requirements: string[];
  isOpen: boolean;
  sortOrder: number;
};

export async function savePosition(input: PositionInput): Promise<Result> {
  const { supabase } = await requireAdmin();
  const title = input.title.trim();
  if (title.length < 3) return { error: "Give the position a title of at least 3 characters." };

  const row = {
    title,
    level: input.level.trim(),
    deadline: input.deadline.trim(),
    body: input.body.trim(),
    requirements: clean(input.requirements),
    is_open: input.isOpen,
    sort_order: Number.isFinite(input.sortOrder) ? Math.round(input.sortOrder) : 0,
  };
  const { error, count } = input.id
    ? await supabase.from("positions").update(row, { count: "exact" }).eq("id", input.id)
    : await supabase.from("positions").insert(row, { count: "exact" });
  if (error) return { error: `Could not save: ${error.message}` };
  if (!count) return { error: "That position no longer exists." };

  refreshContentPages();
  redirect("/admin/positions?saved=1");
}

export async function setPositionOpen(id: string, isOpen: boolean): Promise<Result> {
  const { supabase } = await requireAdmin();
  const { error, count } = await supabase
    .from("positions")
    .update({ is_open: isOpen }, { count: "exact" })
    .eq("id", id);
  if (error) return { error: `Could not update: ${error.message}` };
  if (!count) return { error: "That position no longer exists." };
  refreshContentPages();
}

export async function deletePosition(id: string): Promise<Result> {
  const { supabase } = await requireAdmin();
  const { error, count } = await supabase.from("positions").delete({ count: "exact" }).eq("id", id);
  if (error) return { error: `Could not delete: ${error.message}` };
  if (!count) return { error: "That position no longer exists." };
  refreshContentPages();
}

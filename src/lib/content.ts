import "server-only";
import { cache } from "react";
import { alumni as staticAlumni, people as staticPeople, type Person } from "@/data/people";
import { themes as staticThemes, type Theme } from "@/data/research";
import { PEOPLE_BUCKET, publicImageUrl, supabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/server";

// Research themes, people and alumni live in Supabase so admins can edit them at /admin.
// Until Supabase is connected, or if its content tables are missing (supabase/content.sql not
// run yet), the pages fall back to the files in src/data so the site never breaks.

export type PersonEntry = Person & { id: string };
export type AlumnusEntry = { id: string; name: string; then: string; now: string };

export type ThemeRow = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  questions: string[];
  methods: string[];
  elements: string[];
  sort_order: number;
};

export type PersonRow = {
  id: string;
  name: string;
  role: string;
  member_group: Person["group"];
  focus: string;
  email: string | null;
  bio: string | null;
  photo_path: string | null;
  links: { label: string; href: string }[];
  sort_order: number;
};

export type AlumnusRow = { id: string; name: string; then_text: string; now_text: string; sort_order: number };

export const THEME_COLUMNS = "id, title, summary, body, questions, methods, elements, sort_order";
export const PERSON_COLUMNS = "id, name, role, member_group, focus, email, bio, photo_path, links, sort_order";
export const ALUMNUS_COLUMNS = "id, name, then_text, now_text, sort_order";

export const getThemes = cache(async (): Promise<Theme[]> => {
  if (!supabaseConfigured) return staticThemes;
  const { data, error } = await createPublicClient()
    .from("research_themes")
    .select(THEME_COLUMNS)
    .order("sort_order")
    .order("title")
    .returns<ThemeRow[]>();
  if (error) {
    console.error("Could not load research themes, using src/data/research.ts:", error.message);
    return staticThemes;
  }
  return data.map(({ sort_order: _, ...t }) => t);
});

export const getPeople = cache(async (): Promise<PersonEntry[]> => {
  if (!supabaseConfigured) return staticPeople.map((p) => ({ ...p, id: p.name }));
  const { data, error } = await createPublicClient()
    .from("people")
    .select(PERSON_COLUMNS)
    .order("sort_order")
    .order("name")
    .returns<PersonRow[]>();
  if (error) {
    console.error("Could not load people, using src/data/people.ts:", error.message);
    return staticPeople.map((p) => ({ ...p, id: p.name }));
  }
  return data.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    group: p.member_group,
    focus: p.focus,
    email: p.email ?? undefined,
    bio: p.bio ?? undefined,
    photo: publicImageUrl(PEOPLE_BUCKET, p.photo_path),
    links: p.links,
  }));
});

export const getAlumni = cache(async (): Promise<AlumnusEntry[]> => {
  if (!supabaseConfigured) return staticAlumni.map((a) => ({ ...a, id: a.name }));
  const { data, error } = await createPublicClient()
    .from("alumni")
    .select(ALUMNUS_COLUMNS)
    .order("sort_order")
    .order("name")
    .returns<AlumnusRow[]>();
  if (error) {
    console.error("Could not load alumni, using src/data/people.ts:", error.message);
    return staticAlumni.map((a) => ({ ...a, id: a.name }));
  }
  return data.map((a) => ({ id: a.id, name: a.name, then: a.then_text, now: a.now_text }));
});

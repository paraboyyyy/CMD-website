import "server-only";
import { news as sampleNews, type NewsItem } from "@/data/news";
import { imageUrl, supabaseConfigured } from "./supabase/config";
import { createPublicClient } from "./supabase/server";

export type NewsKind = NewsItem["kind"];
export type NewsStatus = "draft" | "pending" | "published" | "rejected";

/** A news item as the public pages show it. */
export type NewsEntry = {
  id: string;
  date: string; // ISO date
  title: string;
  body: string;
  kind: NewsKind;
  imageUrl?: string;
};

/** A row of the `news` table, as the member area works with it. */
export type NewsRow = {
  id: string;
  title: string;
  body: string;
  kind: NewsKind;
  news_date: string;
  image_path: string | null;
  status: NewsStatus;
  review_note: string | null;
  author_id: string;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export const NEWS_COLUMNS =
  "id, title, body, kind, news_date, image_path, status, review_note, author_id, created_at, updated_at, published_at";

const slug = (t: string) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function sampleEntries(): NewsEntry[] {
  return sampleNews.map((n) => ({ id: slug(n.title), date: n.date, title: n.title, body: n.text, kind: n.kind }));
}

type PublicRow = Pick<NewsRow, "id" | "title" | "body" | "kind" | "news_date" | "image_path">;
const PUBLIC_COLUMNS = "id, title, body, kind, news_date, image_path";

function toEntry(n: PublicRow): NewsEntry {
  return {
    id: n.id,
    date: n.news_date,
    title: n.title,
    body: n.body,
    kind: n.kind,
    imageUrl: imageUrl(n.image_path),
  };
}

/** Published news, newest first. Falls back to the sample news until Supabase is set up. */
export async function getPublishedNews(limit?: number): Promise<NewsEntry[]> {
  if (!supabaseConfigured) {
    const items = sampleEntries();
    return limit ? items.slice(0, limit) : items;
  }

  let query = createPublicClient()
    .from("news")
    .select(PUBLIC_COLUMNS)
    .eq("status", "published")
    .order("news_date", { ascending: false })
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query.returns<PublicRow[]>();
  if (error) {
    console.error("Could not load news:", error.message);
    return [];
  }
  return data.map(toEntry);
}

/** One published news item, or null if it does not exist or is not published. */
export async function getPublishedNewsItem(id: string): Promise<NewsEntry | null> {
  if (!supabaseConfigured) return sampleEntries().find((n) => n.id === id) ?? null;
  // Supabase ids are UUIDs; anything else cannot match and would only cause a query error.
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const { data, error } = await createPublicClient()
    .from("news")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle<PublicRow>();
  if (error) console.error("Could not load news item:", error.message);
  return data ? toEntry(data) : null;
}

/** Splits plain text into paragraphs on blank lines. */
export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** A short plain-text preview for lists: the start of the text, cut at a word boundary. */
export function excerpt(text: string, max = 220) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > max * 0.6 ? cut.lastIndexOf(" ") : max).replace(/[\s,.;:–-]+$/, "")}…`;
}

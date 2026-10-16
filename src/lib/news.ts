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

/** Published news, newest first. Falls back to the sample news until Supabase is set up. */
export async function getPublishedNews(limit?: number): Promise<NewsEntry[]> {
  if (!supabaseConfigured) {
    const items = sampleNews.map((n) => ({ id: n.title, date: n.date, title: n.title, body: n.text, kind: n.kind }));
    return limit ? items.slice(0, limit) : items;
  }

  let query = createPublicClient()
    .from("news")
    .select("id, title, body, kind, news_date, image_path")
    .eq("status", "published")
    .order("news_date", { ascending: false })
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) {
    console.error("Could not load news:", error.message);
    return [];
  }
  return data.map((n) => ({
    id: n.id,
    date: n.news_date,
    title: n.title,
    body: n.body,
    kind: n.kind as NewsKind,
    imageUrl: imageUrl(n.image_path),
  }));
}

/** Splits plain text into paragraphs on blank lines. */
export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

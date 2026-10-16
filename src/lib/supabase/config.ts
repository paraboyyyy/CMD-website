// Supabase is optional: until these are set, the site shows the sample news in src/data/news.ts
// and the member area explains how to finish the setup.
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const NEWS_BUCKET = "news-images";

export function imageUrl(path: string | null | undefined) {
  if (!path || !supabaseConfigured) return undefined;
  return `${supabaseUrl}/storage/v1/object/public/${NEWS_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

// Supabase is optional: until these are set, the site shows the sample news in src/data/news.ts
// and the member area explains how to finish the setup.
// Values pasted into a dashboard often pick up a newline, spaces, quotes or invisible characters,
// which the browser then refuses to send ("Failed to execute 'fetch' on 'Window': Invalid value").
// URLs and Supabase keys only ever use these characters, so drop anything else.
// A whole ".env" line (NAME=value) pasted as the value is also common: keep only what follows "=".
const clean = (v: string | undefined) => (v ?? "").split("=").pop()!.replace(/[^A-Za-z0-9._:/-]/g, "");

export const supabaseUrl = clean(process.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/+$/, "");
export const supabaseKey = clean(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey);

export const NEWS_BUCKET = "news-images";

export function imageUrl(path: string | null | undefined) {
  if (!path || !supabaseConfigured) return undefined;
  return `${supabaseUrl}/storage/v1/object/public/${NEWS_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

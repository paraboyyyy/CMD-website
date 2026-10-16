import { createBrowserClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "./config";

export function createBrowserSupabase() {
  return createBrowserClient(supabaseUrl, supabaseKey);
}

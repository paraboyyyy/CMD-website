import "server-only";
import { redirect } from "next/navigation";
import { supabaseConfigured } from "./supabase/config";
import { createSessionClient } from "./supabase/server";

export type Profile = { id: string; full_name: string; role: "member" | "admin" };

/** The logged-in member, or a redirect to /login. Every member-area page and action starts here. */
export async function requireMember() {
  if (!supabaseConfigured) redirect("/login");
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single<Profile>();
  if (!profile) redirect("/login?error=profile");

  return { supabase, user, profile, isAdmin: profile.role === "admin" };
}

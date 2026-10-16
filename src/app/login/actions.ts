"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/server";

export type LoginState = { error?: string; email?: string };

export async function signIn(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", email };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      email,
      error: /invalid login credentials/i.test(error.message)
        ? "Wrong email or password. Ask an admin if you have not been given an account yet."
        : `Could not log in: ${error.message}`,
    };
  }
  redirect("/admin");
}

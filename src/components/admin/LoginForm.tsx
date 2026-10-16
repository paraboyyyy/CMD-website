"use client";

import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";

// Passwordless: members get a one-time login link by email. Only accounts an admin has
// added in Supabase can log in (shouldCreateUser: false), so strangers cannot sign up.
export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter an email address like name@ugm.ac.id.");
      return;
    }
    setError("");
    setState("sending");
    const { error } = await createBrowserSupabase().auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    if (error) {
      setState("idle");
      setError(
        /signups not allowed|not found/i.test(error.message)
          ? "This email is not registered as a group member. Ask an admin to add you."
          : `Could not send the link: ${error.message}`,
      );
      return;
    }
    setState("sent");
  };

  if (state === "sent") {
    return (
      <div className="rounded-xl border border-line bg-white px-6 py-8">
        <h2 className="text-[1.6rem]">Check your email</h2>
        <p className="mt-3 text-muted">
          We sent a login link to <strong className="text-text">{email}</strong>. Open it on this device to continue.
          The link works once and expires after an hour.
        </p>
        <button type="button" className="link mt-5" onClick={() => setState("idle")}>
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <label className="block">
        <span className="text-[0.92rem]">Email</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 outline-none transition-colors focus:border-ink ${
            error ? "border-red-700" : "border-line"
          }`}
        />
        {error && <span className="mt-1 block text-[0.85rem] text-red-800">{error}</span>}
      </label>
      <button
        type="submit"
        disabled={state === "sending"}
        className="btn btn-primary justify-self-start disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Email me a login link"}
      </button>
    </form>
  );
}

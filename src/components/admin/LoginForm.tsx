"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/login/actions";

// Accounts are created by an admin in Supabase (email + password); there is no public sign-up.
export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  const field =
    "mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-ink";

  return (
    <form action={action} className="grid gap-5">
      <label className="block">
        <span className="text-[0.92rem]">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          defaultValue={state.email}
          className={field}
        />
      </label>
      <label className="block">
        <span className="text-[0.92rem]">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={field} />
      </label>
      {state.error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary justify-self-start disabled:opacity-60">
        {pending ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}

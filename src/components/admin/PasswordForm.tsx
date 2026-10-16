"use client";

import { useActionState } from "react";
import { changePassword, type PasswordState } from "@/app/admin/actions";

export function PasswordForm() {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePassword, {});
  const field =
    "mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-ink";

  return (
    <form action={action} className="mt-6 grid max-w-md gap-5">
      <label className="block">
        <span className="text-[0.92rem]">New password</span>
        <input name="password" type="password" autoComplete="new-password" minLength={8} required className={field} />
      </label>
      <label className="block">
        <span className="text-[0.92rem]">Type it again</span>
        <input name="confirm" type="password" autoComplete="new-password" minLength={8} required className={field} />
      </label>
      {state.error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900">
          {state.error}
        </p>
      )}
      {state.done && (
        <p role="status" className="rounded-lg border border-valence/30 bg-valence-lt/10 px-4 py-3 text-[0.95rem]">
          Password changed. Use the new one next time you log in.
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary justify-self-start disabled:opacity-60">
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}

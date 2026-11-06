"use client";

import { useState, useTransition } from "react";

type Props = {
  id: string;
  action: (id: string) => Promise<{ error: string } | void>;
  /** Asked before deleting. */
  confirmText: string;
  label?: string;
};

export function DeleteButton({ id, action, confirmText, label = "Delete" }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        disabled={pending}
        className="text-red-800 hover:underline disabled:opacity-60"
        onClick={() =>
          confirm(confirmText) &&
          start(async () => {
            setError("");
            const res = await action(id);
            if (res?.error) setError(res.error);
          })
        }
      >
        {pending ? "Deleting…" : label}
      </button>
      {error && (
        <span role="alert" className="mt-1 text-[0.88rem] text-red-800">
          {error}
        </span>
      )}
    </span>
  );
}

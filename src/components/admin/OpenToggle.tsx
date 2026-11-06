"use client";

import { useState, useTransition } from "react";
import { setPositionOpen } from "@/app/admin/content-actions";

/** Opens or closes a position without leaving the list. */
export function OpenToggle({ id, isOpen }: { id: string; isOpen: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <span className="inline-flex flex-col">
      <button
        type="button"
        disabled={pending}
        className="link disabled:opacity-60"
        onClick={() =>
          start(async () => {
            setError("");
            const res = await setPositionOpen(id, !isOpen);
            if (res?.error) setError(res.error);
          })
        }
      >
        {pending ? "Saving…" : isOpen ? "Close" : "Reopen"}
      </button>
      {error && (
        <span role="alert" className="mt-1 text-[0.88rem] text-red-800">
          {error}
        </span>
      )}
    </span>
  );
}

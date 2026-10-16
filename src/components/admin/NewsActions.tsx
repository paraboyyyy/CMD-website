"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteNews, reviewNews } from "@/app/admin/actions";
import type { NewsStatus } from "@/lib/news";

type Props = {
  id: string;
  status: NewsStatus;
  canEdit: boolean;
  canDelete: boolean;
  /** Show approve / reject / unpublish (admins only). */
  review?: boolean;
};

export function NewsActions({ id, status, canEdit, canDelete, review }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState("");

  const run = (fn: () => Promise<{ error: string } | void>) =>
    start(async () => {
      setError("");
      const res = await fn();
      if (res?.error) setError(res.error);
      else setRejecting(false);
    });

  return (
    <div className="text-[0.92rem]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {review && status === "pending" && (
          <>
            <button
              type="button"
              disabled={pending}
              className="btn btn-primary !px-4 !py-1.5"
              onClick={() => run(() => reviewNews(id, "approve"))}
            >
              Approve and publish
            </button>
            <button type="button" disabled={pending} className="link" onClick={() => setRejecting((r) => !r)}>
              Send back
            </button>
          </>
        )}
        {review && status === "published" && (
          <button
            type="button"
            disabled={pending}
            className="link"
            onClick={() => run(() => reviewNews(id, "unpublish"))}
          >
            Unpublish
          </button>
        )}
        {canEdit && (
          <Link className="link" href={`/admin/news/${id}`}>
            Edit
          </Link>
        )}
        {canDelete && (
          <button
            type="button"
            disabled={pending}
            className="text-red-800 hover:underline"
            onClick={() => confirm("Delete this news permanently?") && run(() => deleteNews(id))}
          >
            Delete
          </button>
        )}
        {pending && <span className="text-muted">Working…</span>}
      </div>

      {rejecting && (
        <div className="mt-3 grid max-w-lg gap-2">
          <label className="block">
            <span className="text-[0.88rem] text-muted">What should the author change? (optional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-ink"
            />
          </label>
          <button
            type="button"
            disabled={pending}
            className="btn btn-ghost justify-self-start !px-4 !py-1.5"
            onClick={() => run(() => reviewNews(id, "reject", note))}
          >
            Send back to the author
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

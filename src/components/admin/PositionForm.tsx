"use client";

import { useState, useTransition } from "react";
import { savePosition } from "@/app/admin/content-actions";

type Props = {
  initial?: {
    id: string;
    title: string;
    level: string;
    deadline: string;
    body: string;
    requirements: string[];
    isOpen: boolean;
    sortOrder: number;
  };
  nextOrder?: number;
};

export function PositionForm({ initial, nextOrder = 0 }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [level, setLevel] = useState(initial?.level ?? "");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [requirements, setRequirements] = useState(initial?.requirements.join("\n") ?? "");
  const [isOpen, setIsOpen] = useState(initial?.isOpen ?? true);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? nextOrder));
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const submit = () =>
    start(async () => {
      setError("");
      const res = await savePosition({
        id: initial?.id,
        title,
        level,
        deadline,
        body,
        requirements: requirements.split("\n"),
        isOpen,
        sortOrder: Number(sortOrder),
      });
      if (res?.error) setError(res.error);
    });

  const field =
    "mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-ink";
  const hint = "block text-[0.85rem] text-muted";

  return (
    <form onSubmit={(e) => (e.preventDefault(), submit())} noValidate className="mt-8 grid max-w-3xl gap-6">
      <label className="block">
        <span className="text-[0.92rem]">Title</span>
        <span className={hint}>e.g. &ldquo;PhD position: Rashba effect in Janus monolayers&rdquo;</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required className={field} />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-[0.92rem]">Level and funding</span>
          <span className={hint}>e.g. &ldquo;PhD, fully funded&rdquo; or &ldquo;MSc / BSc&rdquo;</span>
          <input value={level} onChange={(e) => setLevel(e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="text-[0.92rem]">Deadline</span>
          <span className={hint}>Free text, e.g. &ldquo;Open until filled&rdquo; or &ldquo;31 January 2027&rdquo;</span>
          <input value={deadline} onChange={(e) => setDeadline(e.target.value)} className={field} />
        </label>
      </div>

      <label className="block">
        <span className="text-[0.92rem]">Description</span>
        <span className={hint}>What the project is about. Leave an empty line between paragraphs.</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className={`${field} leading-relaxed`}
        />
      </label>

      <label className="block">
        <span className="text-[0.92rem]">What we look for</span>
        <span className={hint}>One requirement per line.</span>
        <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)} rows={4} className={field} />
      </label>

      <div className="grid gap-6 sm:grid-cols-[1fr_10rem] sm:items-end">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={isOpen}
            onChange={(e) => setIsOpen(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-valence)]"
          />
          <span>
            Open: show this position on the Join us page
            <span className={hint}>Untick to keep it here but hide it from the website.</span>
          </span>
        </label>
        <label className="block">
          <span className="text-[0.92rem]">Order</span>
          <span className={hint}>Lower numbers first.</span>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={field} />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Saving…" : initial ? "Save changes" : "Add position"}
        </button>
        <a href="/admin/positions" className="link">
          Cancel
        </a>
      </div>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { saveTheme } from "@/app/admin/content-actions";

type Props = {
  initial?: {
    id: string;
    title: string;
    summary: string;
    body: string[];
    questions: string[];
    methods: string[];
    elements: string[];
    sortOrder: number;
  };
  nextOrder?: number;
};

const toSlug = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");

const lines = (s: string) => s.split("\n");
const paragraphs = (s: string) => s.split(/\n\s*\n/);

export function ThemeForm({ initial, nextOrder = 0 }: Props) {
  const editing = Boolean(initial);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.id ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(initial?.body.join("\n\n") ?? "");
  const [questions, setQuestions] = useState(initial?.questions.join("\n") ?? "");
  const [methods, setMethods] = useState(initial?.methods.join("\n") ?? "");
  const [elements, setElements] = useState(initial?.elements.join(", ") ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? nextOrder));
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const onTitle = (v: string) => {
    setTitle(v);
    if (!editing && !slugTouched) setSlug(toSlug(v));
  };

  const submit = () =>
    start(async () => {
      setError("");
      const res = await saveTheme({
        id: initial?.id,
        slug,
        title,
        summary,
        body: paragraphs(body),
        questions: lines(questions),
        methods: lines(methods),
        elements: elements.split(/[\s,;]+/),
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
        <input value={title} onChange={(e) => onTitle(e.target.value)} maxLength={200} required className={field} />
      </label>

      <div className="grid gap-6 sm:grid-cols-[1fr_10rem]">
        <label className="block">
          <span className="text-[0.92rem]">Short name</span>
          <span className={hint}>
            {editing
              ? "Used in links and in the publication list, so it cannot be changed."
              : "Used in links such as /research#spin-orbit. Lowercase letters, numbers and dashes."}
          </span>
          <input
            value={slug}
            onChange={(e) => (setSlug(e.target.value), setSlugTouched(true))}
            disabled={editing}
            className={`${field} font-mono text-[0.95rem] disabled:bg-paper-2 disabled:text-muted`}
          />
        </label>
        <label className="block">
          <span className="text-[0.92rem]">Order</span>
          <span className={hint}>Lower numbers come first.</span>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={field} />
        </label>
      </div>

      <label className="block">
        <span className="text-[0.92rem]">Summary</span>
        <span className={hint}>One or two sentences, shown on the home page and at the top of the theme.</span>
        <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} className={field} />
      </label>

      <label className="block">
        <span className="text-[0.92rem]">Description</span>
        <span className={hint}>Leave an empty line between paragraphs.</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className={`${field} leading-relaxed`}
        />
      </label>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-[0.92rem]">Open questions</span>
          <span className={hint}>One per line.</span>
          <textarea value={questions} onChange={(e) => setQuestions(e.target.value)} rows={5} className={field} />
        </label>
        <label className="block">
          <span className="text-[0.92rem]">Methods</span>
          <span className={hint}>One per line.</span>
          <textarea value={methods} onChange={(e) => setMethods(e.target.value)} rows={5} className={field} />
        </label>
      </div>

      <label className="block">
        <span className="text-[0.92rem]">Elements on the periodic table</span>
        <span className={hint}>
          Chemical symbols separated by commas, e.g. Mo, W, S, Se. Leave empty to light up the whole table.
        </span>
        <input value={elements} onChange={(e) => setElements(e.target.value)} className={field} />
      </label>

      {error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Saving…" : editing ? "Save changes" : "Add theme"}
        </button>
        <a href="/admin/research" className="link">
          Cancel
        </a>
      </div>
    </form>
  );
}

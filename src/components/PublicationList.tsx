"use client";

import { useMemo, useState } from "react";
import type { Publication } from "@/data/publications";
import type { Theme } from "@/data/research";

function toBibtex(p: Publication) {
  const authors = p.authors
    .split(",")
    .map((a) => a.trim())
    .join(" and ");
  return `@article{${p.id},
  title   = {${p.title}},
  author  = {${authors}},
  journal = {${p.venue}},
  year    = {${p.year}}${p.doi ? `,\n  doi     = {${p.doi}}` : ""}
}`;
}

export function PublicationList({
  publications,
  themes,
  initialTheme = "all",
}: {
  publications: Publication[];
  themes: Theme[];
  initialTheme?: string;
}) {
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState(themes.some((t) => t.id === initialTheme) ? initialTheme : "all");
  const [onlyHighlights, setOnlyHighlights] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [openBib, setOpenBib] = useState<string | null>(null);

  const themeName = useMemo(() => Object.fromEntries(themes.map((t) => [t.id, t.title])), [themes]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return publications
      .filter((p) => theme === "all" || p.theme === theme)
      .filter((p) => !onlyHighlights || p.highlight)
      .filter((p) => !needle || `${p.title} ${p.authors} ${p.venue} ${p.year}`.toLowerCase().includes(needle))
      .sort((a, b) => b.year - a.year);
  }, [publications, q, theme, onlyHighlights]);

  const byYear = useMemo(() => {
    const m = new Map<number, Publication[]>();
    for (const p of filtered) m.set(p.year, [...(m.get(p.year) ?? []), p]);
    return [...m.entries()];
  }, [filtered]);

  const copy = async (p: Publication) => {
    try {
      await navigator.clipboard.writeText(toBibtex(p));
      setCopied(p.id);
      setTimeout(() => setCopied((c) => (c === p.id ? null : c)), 1800);
    } catch {
      setOpenBib(p.id);
    }
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="block">
          <span className="text-[0.9rem] text-muted">Search titles, authors or journals</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Janus, perovskite, Hutapea"
            className="mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-3 text-[1rem] outline-none transition-colors placeholder:text-muted/60 focus:border-ink"
          />
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 pb-3 text-[0.95rem]">
          <input
            type="checkbox"
            checked={onlyHighlights}
            onChange={(e) => setOnlyHighlights(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-conduction)]"
          />
          Selected papers only
        </label>
      </div>

      <div role="group" aria-label="Filter by theme" className="mt-5 flex flex-wrap gap-2">
        {[{ id: "all", title: "All themes" }, ...themes].map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={theme === t.id}
            onClick={() => setTheme(t.id)}
            className={`rounded-full border px-3.5 py-1.5 text-[0.88rem] transition-colors ${
              theme === t.id ? "border-ink bg-ink text-frost" : "border-line hover:border-ink"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <p className="mt-8 text-[0.9rem] text-muted" aria-live="polite">
        {filtered.length === publications.length
          ? `${publications.length} publications`
          : `${filtered.length} of ${publications.length} publications`}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-line px-6 py-12 text-center">
          <p className="font-display text-xl">No publications match these filters.</p>
          <button
            type="button"
            className="link mt-3"
            onClick={() => {
              setQ("");
              setTheme("all");
              setOnlyHighlights(false);
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-4">
          {byYear.map(([year, items]) => (
            <section key={year} className="grid gap-4 border-t border-line py-8 md:grid-cols-[120px_1fr]">
              <h2 className="font-display text-[2rem] leading-none text-muted">{year}</h2>
              <ol className="space-y-8">
                {items.map((p) => (
                  <li key={p.id}>
                    <article>
                      <h3 className="font-display text-[1.3rem] leading-snug">
                        {p.highlight && (
                          <span title="Selected paper" className="mr-2 inline-block h-2.5 w-2.5 -translate-y-0.5 rounded-full bg-conduction align-middle" />
                        )}
                        {p.title}
                      </h3>
                      <p className="mt-1.5 text-[0.95rem]">{p.authors}</p>
                      <p className="text-[0.95rem] text-muted">
                        <em>{p.venue}</em>, {p.year}
                      </p>
                      <p className="mt-2 w-fit rounded-full bg-paper-2 px-2.5 py-0.5 text-[0.8rem] text-muted">{themeName[p.theme]}</p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.9rem]">
                        {p.doi && (
                          <a className="link" href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer">
                            View article
                          </a>
                        )}
                        {p.pdf && (
                          <a className="link" href={p.pdf}>
                            Download PDF
                          </a>
                        )}
                        <button type="button" className="link" onClick={() => copy(p)}>
                          {copied === p.id ? "BibTeX copied" : "Copy BibTeX"}
                        </button>
                        <button
                          type="button"
                          className="link"
                          aria-expanded={openBib === p.id}
                          onClick={() => setOpenBib(openBib === p.id ? null : p.id)}
                        >
                          {openBib === p.id ? "Hide BibTeX" : "Show BibTeX"}
                        </button>
                      </div>
                      {openBib === p.id && (
                        <pre className="mt-3 overflow-x-auto rounded-lg bg-ink p-4 font-mono text-[0.8rem] leading-relaxed text-frost">
                          {toBibtex(p)}
                        </pre>
                      )}
                    </article>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

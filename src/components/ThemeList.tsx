"use client";

import Link from "next/link";
import { useState } from "react";
import type { Theme } from "@/data/research";

/** Expandable research themes. Each row opens to show the questions being asked. */
export function ThemeList({ themes, linkToDetail = false }: { themes: Theme[]; linkToDetail?: boolean }) {
  const [open, setOpen] = useState<string | null>(themes[0]?.id ?? null);

  return (
    <ul className="border-t border-line">
      {themes.map((t) => {
        const isOpen = open === t.id;
        return (
          <li key={t.id} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`theme-${t.id}`}
              onClick={() => setOpen(isOpen ? null : t.id)}
              className="group grid w-full grid-cols-[1fr_auto] items-start gap-6 py-7 text-left md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto]"
            >
              <h3 className="font-display text-[1.55rem] leading-snug transition-colors group-hover:text-valence md:text-[1.8rem]">
                {t.title}
              </h3>
              <p className="col-span-2 row-start-2 text-muted md:col-span-1 md:row-start-1 md:col-start-2 md:pt-1.5">{t.summary}</p>
              <span
                aria-hidden
                className={`mt-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 md:col-start-3 ${
                  isOpen ? "rotate-45 border-ink bg-ink text-frost" : "border-line group-hover:border-ink"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="1.6">
                  <path d="M7 1v12M1 7h12" />
                </svg>
              </span>
            </button>

            <div
              id={`theme-${t.id}`}
              className={`grid transition-[grid-template-rows] duration-400 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="grid gap-8 pb-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-6">
                  <div className="text-[1rem] text-text">
                    <p className="text-muted">Questions we are working on</p>
                    <ul className="mt-3 space-y-3">
                      {t.questions.map((q) => (
                        <li key={q} className="flex gap-3">
                          <span aria-hidden className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-conduction" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-muted">Methods</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {t.methods.map((m) => (
                        <li key={m} className="rounded-full bg-paper-2 px-3 py-1 text-[0.88rem]">
                          {m}
                        </li>
                      ))}
                    </ul>
                    {linkToDetail && (
                      <Link href={`/research#${t.id}`} className="link mt-6 inline-block text-[0.95rem]">
                        Read more about this theme
                      </Link>
                    )}
                  </div>
                  <span className="hidden w-9 md:block" />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { useMemo, useState } from "react";
import type { Theme } from "@/data/research";

// [symbol, period, group]  — periods 1–6; lanthanides collapsed into La.
const ROWS: string[] = [
  "H . . . . . . . . . . . . . . . . He",
  "Li Be . . . . . . . . . . B C N O F Ne",
  "Na Mg . . . . . . . . . . Al Si P S Cl Ar",
  "K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr",
  "Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe",
  "Cs Ba La Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn",
];

const CELLS = ROWS.flatMap((row, p) =>
  row.split(" ").map((sym, g) => ({ sym, period: p + 1, group: g + 1 })).filter((c) => c.sym !== "."),
);

export function PeriodicTable({ themes }: { themes: Theme[] }) {
  const [active, setActive] = useState<string>("all");
  const [hover, setHover] = useState<string | null>(null);

  const usage = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const t of themes) for (const e of t.elements) m.set(e, [...(m.get(e) ?? []), t.title]);
    return m;
  }, [themes]);

  const current = themes.find((t) => t.id === active);
  const lit = (sym: string) => {
    if (active === "all") return usage.has(sym);
    if (!current) return false;
    if (current.elements.length === 0) return true; // method-driven theme, applies everywhere
    return current.elements.includes(sym);
  };

  const hoverInfo = hover ? usage.get(hover) : undefined;

  return (
    <div>
      <div role="group" aria-label="Filter elements by research theme" className="flex flex-wrap gap-2">
        {[{ id: "all", title: "All themes" }, ...themes].map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={active === t.id}
            onClick={() => setActive(t.id)}
            className={`rounded-full border px-3.5 py-1.5 text-[0.88rem] transition-colors ${
              active === t.id ? "border-ink bg-ink text-frost" : "border-line hover:border-ink"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <p className="mt-5 text-[0.85rem] text-muted md:hidden">Scroll sideways to see the whole table.</p>
      <div className="mt-3 overflow-x-auto pb-2 md:mt-6">
        <div className="grid min-w-[640px] gap-[3px]" style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}>
          {CELLS.map((c) => {
            const on = lit(c.sym);
            return (
              <button
                key={c.sym}
                type="button"
                onMouseEnter={() => setHover(c.sym)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(c.sym)}
                onBlur={() => setHover(null)}
                style={{ gridColumn: c.group, gridRow: c.period }}
                aria-label={`${c.sym}${usage.has(c.sym) ? `, used in: ${usage.get(c.sym)!.join(", ")}` : ""}`}
                className={`flex aspect-square items-center justify-center rounded-[4px] text-[0.8rem] transition-all duration-200 ${
                  on
                    ? "bg-ink font-medium text-frost shadow-[inset_0_-3px_0_var(--color-conduction-lt)]"
                    : "bg-paper-2 text-muted/70"
                } ${hover === c.sym ? "scale-110 ring-2 ring-conduction" : ""}`}
              >
                {c.sym}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-4 min-h-[3.2em] text-[0.95rem] text-muted" aria-live="polite">
        {hover ? (
          hoverInfo ? (
            <>
              <span className="font-medium text-text">{hover}</span> appears in {hoverInfo.join(" and ")}.
            </>
          ) : (
            <>
              <span className="font-medium text-text">{hover}</span> is not a focus element yet. Have an idea? Get in touch.
            </>
          )
        ) : current && current.elements.length === 0 ? (
          "Our machine-learning and screening tools are element-agnostic, so this theme spans the whole table."
        ) : (
          "Hover or tab through an element to see which themes use it."
        )}
      </p>
    </div>
  );
}

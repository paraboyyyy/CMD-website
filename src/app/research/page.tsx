import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PeriodicTable } from "@/components/PeriodicTable";
import { themes, tools } from "@/data/research";

export const metadata: Metadata = {
  title: "Research",
  description: "Research themes of the Computational Materials Design group: spin–orbit physics, topological and magnetic materials, functional materials and sensors, and machine learning for energy materials.",
};

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        title="Research"
        intro="Four themes, one approach: start from the Schrödinger equation, check that a material can actually exist, then ask what it can do."
      >
        <nav aria-label="Research themes" className="mt-10">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {themes.map((t) => (
              <li key={t.id}>
                <a className="link" href={`#${t.id}`}>
                  {t.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <section className="py-16 md:py-20">
        <div className="wrap">
          <h2 className="text-[1.9rem] md:text-[2.2rem]">Elements on our desks</h2>
          <p className="measure mt-3 text-muted">
            Pick a theme to see which parts of the periodic table it draws on.
          </p>
          <div className="mt-8">
            <PeriodicTable themes={themes} />
          </div>
        </div>
      </section>

      {themes.map((t, i) => (
        <section key={t.id} id={t.id} className={`scroll-mt-20 py-16 md:py-24 ${i % 2 === 0 ? "bg-paper-2" : ""}`}>
          <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-[2rem] md:text-[2.5rem]">{t.title}</h2>
              <p className="mt-4 text-[1.1rem] text-muted">{t.summary}</p>
            </div>
            <div>
              <div className="prose-cmd measure text-[1.06rem] leading-[1.7]">
                {t.body.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
              <h3 className="mt-10 font-sans text-[1rem] font-semibold">Open questions</h3>
              <ul className="mt-3 space-y-3">
                {t.questions.map((q) => (
                  <li key={q} className="flex gap-3">
                    <span aria-hidden className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-conduction" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
              <h3 className="mt-10 font-sans text-[1rem] font-semibold">Methods</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {t.methods.map((m) => (
                  <li key={m} className={`rounded-full px-3 py-1 text-[0.9rem] ${i % 2 === 0 ? "bg-white" : "bg-paper-2"}`}>
                    {m}
                  </li>
                ))}
              </ul>
              <Link href={`/publications?theme=${t.id}`} className="link mt-8 inline-block">
                Papers in this theme
              </Link>
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <h2 className="text-[2rem] md:text-[2.5rem]">Computing</h2>
          <div className="measure text-[1.06rem] leading-[1.7]">
            <p>
              Our calculations run on a departmental GPU cluster and on national high-performance computing allocations.
              Workflows are tracked with full provenance so that every number in a paper can be traced back to its
              inputs.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {tools.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 text-[0.9rem]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

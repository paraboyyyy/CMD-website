import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { news, newsKindLabel } from "@/data/news";

export const metadata: Metadata = {
  title: "News",
  description: "News, papers, awards and events from the Computational Materials Design group.",
};

const fmt = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function NewsPage() {
  return (
    <>
      <PageHeader title="News" intro="Papers, people, awards and events from the group." />
      <section className="py-12 md:py-16">
        <div className="wrap">
          {/* A timeline: chronological, so the rail and dates carry real meaning */}
          <ol className="relative border-l border-line pl-8 md:ml-[180px]">
            {news.map((n) => (
              <li key={n.title} className="relative pb-12 last:pb-0">
                <span
                  aria-hidden
                  className={`absolute top-2 -left-[37px] h-2.5 w-2.5 rounded-full ring-4 ring-paper ${
                    n.kind === "paper" || n.kind === "award" ? "bg-conduction" : "bg-ink"
                  }`}
                />
                <time dateTime={n.date} className="text-[0.92rem] text-muted md:absolute md:-left-[212px] md:top-0 md:w-[160px] md:text-right">
                  {fmt(n.date)}
                </time>
                <article className="measure">
                  <p className="text-[0.85rem] text-valence">{newsKindLabel[n.kind]}</p>
                  <h2 className="mt-1 text-[1.5rem] leading-snug">{n.title}</h2>
                  <p className="mt-2 leading-relaxed text-muted">{n.text}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

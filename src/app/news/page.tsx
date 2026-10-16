/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { newsKindLabel } from "@/data/news";
import { excerpt, getPublishedNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "News",
  description: "News, papers, awards and events from the Computational Materials Design group.",
};

// Re-read published news at most every 5 minutes; approving a post refreshes the page straight away.
export const revalidate = 300;

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function NewsPage() {
  const news = await getPublishedNews();

  return (
    <>
      <PageHeader title="News" intro="Papers, people, awards and events from the group." />
      <section className="py-12 md:py-16">
        <div className="wrap">
          {news.length === 0 ? (
            <p className="text-muted">No news yet. Check back soon.</p>
          ) : (
            /* A timeline: chronological, so the rail and dates carry real meaning */
            <ol className="relative border-l border-line pl-8 md:ml-[180px]">
              {news.map((n) => (
                <li key={n.id} className="relative pb-12 last:pb-0">
                  <span
                    aria-hidden
                    className={`absolute top-2 -left-[37px] h-2.5 w-2.5 rounded-full ring-4 ring-paper ${
                      n.kind === "paper" || n.kind === "award" ? "bg-conduction" : "bg-ink"
                    }`}
                  />
                  <time
                    dateTime={n.date}
                    className="text-[0.92rem] text-muted md:absolute md:-left-[212px] md:top-0 md:w-[160px] md:text-right"
                  >
                    {fmt(n.date)}
                  </time>
                  <article className="grid gap-5 sm:grid-cols-[1fr_auto] sm:gap-8">
                    <div className="measure">
                      <p className="text-[0.85rem] text-valence">{newsKindLabel[n.kind]}</p>
                      <h2 className="mt-1 text-[1.5rem] leading-snug">
                        <Link href={`/news/${n.id}`} className="hover:text-valence hover:underline">
                          {n.title}
                        </Link>
                      </h2>
                      {n.body && <p className="mt-2 leading-relaxed text-muted">{excerpt(n.body)}</p>}
                      <Link
                        href={`/news/${n.id}`}
                        className="link mt-3 inline-block text-[0.95rem]"
                        aria-hidden
                        tabIndex={-1}
                      >
                        Read more
                      </Link>
                    </div>
                    {n.imageUrl && (
                      <Link href={`/news/${n.id}`} aria-hidden tabIndex={-1} className="sm:order-none -order-1">
                        <img
                          src={n.imageUrl}
                          alt=""
                          loading="lazy"
                          className="aspect-[4/3] w-full rounded-lg border border-line object-cover sm:w-48"
                        />
                      </Link>
                    )}
                  </article>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
}

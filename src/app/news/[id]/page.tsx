/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { newsKindLabel } from "@/data/news";
import { excerpt, getPublishedNewsItem, paragraphs } from "@/lib/news";

// Same freshness as the news list; approving or editing a post refreshes it straight away.
export const revalidate = 300;

// No pages are built ahead of time; each one is rendered on its first visit and then cached.
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = await getPublishedNewsItem((await params).id);
  if (!n) return { title: "News" };
  return {
    title: n.title,
    description: excerpt(n.body, 160) || undefined,
    openGraph: { title: n.title, images: n.imageUrl ? [n.imageUrl] : undefined },
  };
}

export default async function NewsItemPage({ params }: Props) {
  const n = await getPublishedNewsItem((await params).id);
  if (!n) notFound();

  return (
    <article className="pt-28 pb-24 md:pt-36">
      <div className="wrap">
        <Link href="/news" className="link text-[0.95rem]">
          ← All news
        </Link>
        <header className="mt-8 max-w-3xl">
          <p className="text-[0.92rem] text-muted">
            <span className="text-valence">{newsKindLabel[n.kind]}</span> · <time dateTime={n.date}>{fmt(n.date)}</time>
          </p>
          <h1 className="mt-2 text-[2.4rem] leading-tight md:text-[var(--text-h1)]">{n.title}</h1>
        </header>
        {n.imageUrl && (
          <img
            src={n.imageUrl}
            alt=""
            className="mt-10 max-h-[32rem] w-full max-w-4xl rounded-xl border border-line object-cover"
          />
        )}
        <div className="measure mt-10 text-[1.06rem] leading-[1.75]">
          {paragraphs(n.body).map((p, i) => (
            <p key={i} className={`whitespace-pre-line ${i ? "mt-5" : ""}`}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

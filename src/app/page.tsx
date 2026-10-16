import Link from "next/link";
import { LatticeCanvas } from "@/components/LatticeCanvas";
import { BandExplorer } from "@/components/BandExplorer";
import { ThemeList } from "@/components/ThemeList";
import { themes, workflow, tools } from "@/data/research";
import { publications } from "@/data/publications";
import { getPublishedNews } from "@/lib/news";
import { labEnabled, site } from "@/data/site";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Published news is re-read at most every 5 minutes; approving a post refreshes the page straight away.
export const revalidate = 300;

export default async function Home() {
  const selected = publications.filter((p) => p.highlight).slice(0, 3);
  const latest = await getPublishedNews(3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="on-dark relative overflow-hidden bg-ink text-frost">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(60% 70% at 78% 45%, rgba(98,195,216,0.14), transparent 70%), radial-gradient(40% 50% at 85% 70%, rgba(240,178,84,0.10), transparent 70%)",
          }}
        />
        <div className="wrap relative grid min-h-[100svh] items-center gap-6 pt-24 pb-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-16">
          <div className="max-w-xl">
            <p className="text-[1rem] text-frost-muted">
              {site.name} {site.tagline}
            </p>
            <h1 className="mt-5 text-[2.75rem] leading-[1.05] sm:text-[3.6rem] lg:text-[var(--text-hero)]">
              We design materials on a computer before they exist in a lab.
            </h1>
            <p className="mt-7 max-w-[34rem] text-[1.15rem] leading-relaxed text-frost-muted">
              CMD uses first-principles quantum mechanics and machine learning to understand and design materials for
              spintronics, quantum devices, sensing and clean energy, and works with experimental partners to test them.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/research" className="btn btn-amber">
                Explore our research
              </Link>
              {labEnabled && (
                <Link href="/lab" className="btn btn-ghost">
                  Try the interactive lab
                </Link>
              )}
            </div>
          </div>
          <LatticeCanvas className="h-[380px] sm:h-[460px] lg:h-[560px]" />
        </div>
      </section>

      {/* ── Statement ────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <p className="font-display text-[1.7rem] leading-[1.35] md:text-[2.2rem]">
            Every material property, from the colour of a semiconductor to the speed of a battery, is decided by how
            electrons arrange themselves among atoms. We calculate that arrangement directly, then use it to decide
            which materials are worth making.
          </p>
          <div className="lg:pt-3">
            <p className="text-muted">Main codes we use</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {tools.map((t) => (
                <li key={t} className="rounded-full border border-line px-3 py-1 text-[0.9rem]">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Themes ───────────────────────────────────────── */}
      <section className="pb-20 md:pb-28">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[2rem] md:text-[var(--text-h2)]">What we work on</h2>
            <Link href="/research" className="link">
              All research themes
            </Link>
          </div>
          <ThemeList themes={themes} linkToDetail />
        </div>
      </section>

      {/* ── Workflow (a real sequence, so it is numbered) ── */}
      <section className="bg-paper-2 py-20 md:py-28">
        <div className="wrap">
          <h2 className="max-w-2xl text-[2rem] md:text-[var(--text-h2)]">How a prediction becomes a material</h2>
          <p className="measure mt-4 text-muted">
            Most candidates are ruled out by the computer long before they cost anyone a synthesis run.
          </p>
          <ol className="relative mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
            <span aria-hidden className="absolute top-[22px] right-[10%] left-[10%] hidden h-px bg-line md:block" />
            {workflow.map((step, i) => (
              <li key={step.title} className="relative">
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full font-display text-lg ${
                    i === workflow.length - 1 ? "bg-conduction text-white" : "bg-ink text-frost"
                  }`}
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 font-sans text-[1.05rem] font-semibold">{step.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Interactive band structure ───────────────────── */}
      {labEnabled && (
        <section className="on-dark bg-ink py-20 text-frost md:py-28">
          <div className="wrap">
            <div className="mb-12 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
              <h2 className="text-[2rem] md:text-[var(--text-h2)]">Open a topological gap yourself</h2>
              <p className="text-frost-muted">
                This is the Haldane model, the simplest recipe for a quantum anomalous Hall insulator and a cousin of
                the Janus materials we study. Move the sliders and watch the bands at K touch and reopen.
              </p>
            </div>
            <BandExplorer showPhase={false} />
            <Link href="/lab" className="btn btn-ghost mt-12">
              Open the full interactive lab
            </Link>
          </div>
        </section>
      )}

      {/* ── Papers and news ──────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div className="wrap grid gap-16 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-[1.9rem]">Selected papers</h2>
              <Link href="/publications" className="link text-[0.95rem]">
                All publications
              </Link>
            </div>
            <ul className="border-t border-line">
              {selected.map((p) => (
                <li key={p.id} className="border-b border-line py-6">
                  <p className="font-display text-[1.25rem] leading-snug">{p.title}</p>
                  <p className="mt-2 text-[0.92rem] text-muted">
                    {p.authors}. <em>{p.venue}</em>, {p.year}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-[1.9rem]">News</h2>
              <Link href="/news" className="link text-[0.95rem]">
                All news
              </Link>
            </div>
            <ul className="border-t border-line">
              {latest.map((n) => (
                <li key={n.id} className="border-b border-line py-6">
                  <time dateTime={n.date} className="text-[0.88rem] text-muted">
                    {fmtDate(n.date)}
                  </time>
                  <p className="mt-1 font-medium leading-snug">
                    <Link href={`/news/${n.id}`} className="hover:text-valence hover:underline">
                      {n.title}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Join ─────────────────────────────────────────── */}
      <section className="pb-24">
        <div className="wrap">
          <div className="grid items-center gap-8 rounded-2xl border border-line bg-white px-8 py-12 md:grid-cols-[1fr_auto] md:px-14">
            <div>
              <h2 className="text-[1.9rem] md:text-[2.2rem]">We are looking for PhD students and collaborators</h2>
              <p className="measure mt-3 text-muted">
                If you enjoy physics, chemistry and code in roughly equal parts, there is probably a project here for
                you.
              </p>
            </div>
            <Link href="/join" className="btn btn-primary justify-self-start">
              See open positions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

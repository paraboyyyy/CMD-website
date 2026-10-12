import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { positions } from "@/data/positions";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Join us",
  description: "Open PhD, master's and undergraduate positions in computational materials design.",
};

// Applying is a sequence, so these steps are numbered.
const steps = [
  "Read a recent paper from the group that interests you.",
  "Send a short email with your CV, transcripts and a paragraph on what you would like to work on.",
  "If there is a fit, we arrange a video call and a small computational exercise.",
  "Successful candidates are supported through the university's admission and scholarship applications.",
];

export default function JoinPage() {
  return (
    <>
      <PageHeader
        title="Join us"
        intro="We welcome students from physics, chemistry, materials science and computer science. No prior simulation experience is required for master's projects; curiosity is."
      />

      <section className="py-16 md:py-20">
        <div className="wrap">
          <h2 className="text-[1.9rem] md:text-[2.2rem]">Open positions</h2>
          <ul className="mt-8 border-t border-line">
            {positions.map((p) => (
              <li key={p.title} className="grid gap-6 border-b border-line py-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
                <div>
                  <h3 className="text-[1.6rem] leading-snug">{p.title}</h3>
                  <p className="mt-2 text-conduction">{p.level}</p>
                  <p className="mt-1 text-[0.93rem] text-muted">{p.deadline}</p>
                </div>
                <div>
                  <p className="leading-relaxed">{p.text}</p>
                  <h4 className="mt-6 text-[0.95rem] font-semibold">What we look for</h4>
                  <ul className="mt-3 space-y-2">
                    {p.requirements.map((r) => (
                      <li key={r} className="flex gap-3">
                        <span aria-hidden className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-valence" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper-2 py-16 md:py-20">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <h2 className="text-[1.9rem] md:text-[2.2rem]">How to apply</h2>
          <ol className="space-y-6">
            {steps.map((s, i) => (
              <li key={s} className="grid grid-cols-[auto_1fr] gap-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-frost">{i + 1}</span>
                <p className="pt-1 leading-relaxed">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="contact" className="scroll-mt-20 py-16 md:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="text-[1.9rem] md:text-[2.2rem]">Get in touch</h2>
            <p className="mt-4 text-muted">
              For applications, collaborations or questions about our work. We usually reply within a week.
            </p>
            <address className="mt-8 not-italic leading-relaxed">
              <span className="block font-medium">
                {site.name} group
              </span>
              <span className="block text-muted">{site.affiliation}</span>
              <span className="block text-muted">{site.institution}</span>
              {site.address.map((l) => (
                <span key={l} className="block text-muted">
                  {l}
                </span>
              ))}
              <a href={`mailto:${site.email}`} className="link mt-3 inline-block">
                {site.email}
              </a>
            </address>
          </div>
          <ContactForm to={site.email} />
        </div>
      </section>
    </>
  );
}

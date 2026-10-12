import type { Metadata } from "next";
import Link from "next/link";
import { BandExplorer } from "@/components/BandExplorer";
import { LatticeCanvas } from "@/components/LatticeCanvas";

export const metadata: Metadata = {
  title: "Interactive lab",
  description: "Explore a topological band structure and a 3D Janus monolayer in your browser.",
};

export default function LabPage() {
  return (
    <div className="on-dark bg-ink text-frost">
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="wrap">
          <h1 className="max-w-3xl text-[2.6rem] md:text-[var(--text-h1)]">Interactive lab</h1>
          <p className="measure mt-6 text-[var(--text-lead)] leading-relaxed text-frost-muted">
            Two small models that run entirely in your browser. They are simplified on purpose, but they show the same
            physics our full calculations are built to capture.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 py-16 md:py-20">
        <div className="wrap">
          <div className="mb-12 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
            <h2 className="text-[2rem] md:text-[2.4rem]">Band structure of a Chern insulator</h2>
            <div className="text-frost-muted">
              <p>
                In 1988 Duncan Haldane showed that electrons on a honeycomb lattice can carry a quantised Hall current
                without any external magnetic field. Two ingredients compete: Δ wants a normal insulator, the complex
                hopping t₂ wants a topological one.
              </p>
              <p className="mt-3">
                Watch the K point. When the gap closes and reopens there, the Chern number changes and an edge state is
                born.
              </p>
            </div>
          </div>
          <BandExplorer />
        </div>
      </section>

      <section className="border-t border-white/10 py-16 md:py-24">
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h2 className="text-[2rem] md:text-[2.4rem]">Which face meets the substrate?</h2>
            <div className="mt-5 space-y-4 text-frost-muted">
              <p>
                A Janus monolayer has a plane of metal atoms sandwiched between two different elements. Put it on a
                substrate and you have to choose which face goes down.
              </p>
              <p>
                That choice changes the interface dipole, the charge transferred from the substrate and, in some cases,
                whether a topological gap survives at all. Flip the layer and imagine a substrate underneath.
              </p>
              <p>Drag to rotate, or focus the model and use the arrow keys.</p>
            </div>
            <Link href="/research#quantum-2d" className="btn btn-ghost mt-8">
              Read about our Janus research
            </Link>
          </div>
          <LatticeCanvas className="h-[420px] md:h-[520px]" radius={4.6} />
        </div>
      </section>
    </div>
  );
}

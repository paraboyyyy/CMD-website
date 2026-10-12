// SAMPLE CONTENT — these entries are illustrative placeholders, not real papers.
// Replace them with the group's publications. `theme` must match an id in research.ts.

export type Publication = {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  theme: "quantum-2d" | "energy" | "catalysis" | "ml";
  doi?: string;
  pdf?: string;
  highlight?: boolean;
};

export const publications: Publication[] = [
  {
    id: "wicaksono2026qah",
    title: "Substrate-facing side controls the quantum anomalous Hall gap in Janus MoTe₂FCl heterostructures",
    authors: "E. Pratiwi, I. Permatasari, A. Wicaksono",
    venue: "Physical Review B (sample entry)",
    year: 2026,
    theme: "quantum-2d",
    highlight: true,
  },
  {
    id: "hutapea2026mlip",
    title: "Equivariant potentials with active learning reproduce sodium diffusion in layered oxides at DFT accuracy",
    authors: "D. Hutapea, J. Santoso, B. Saputra",
    venue: "npj Computational Materials (sample entry)",
    year: 2026,
    theme: "ml",
    highlight: true,
  },
  {
    id: "lumbangaol2026sac",
    title: "Breaking scaling relations for CO₂ reduction on dual single-atom sites in nitrogen-doped graphene",
    authors: "C. Lumban Gaol, H. Siahaan, A. Wicaksono",
    venue: "ACS Catalysis (sample entry)",
    year: 2026,
    theme: "catalysis",
  },
  {
    id: "ramadhan2025perov",
    title: "Defect tolerance in lead-free Cs₂AgBiBr₆ from hybrid-functional defect calculations",
    authors: "F. Ramadhan, B. Saputra",
    venue: "Journal of Materials Chemistry A (sample entry)",
    year: 2025,
    theme: "energy",
    highlight: true,
  },
  {
    id: "pratiwi2025rashba",
    title: "Giant Rashba splitting at Janus transition-metal dichalcogenide / ferroelectric interfaces",
    authors: "E. Pratiwi, A. Wicaksono",
    venue: "2D Materials (sample entry)",
    year: 2025,
    theme: "quantum-2d",
  },
  {
    id: "maharani2025phonon",
    title: "Anharmonic phonons and ultralow thermal conductivity in layered bismuth oxychalcogenides",
    authors: "G. Maharani, D. Hutapea, B. Saputra",
    venue: "Physical Review Materials (sample entry)",
    year: 2025,
    theme: "energy",
  },
  {
    id: "dewi2025band",
    title: "Surface reconstruction shifts band edges of BiVO₄ photoanodes relative to water redox levels",
    authors: "K. Dewi, C. Lumban Gaol, B. Saputra",
    venue: "The Journal of Physical Chemistry C (sample entry)",
    year: 2025,
    theme: "catalysis",
  },
  {
    id: "siahaan2024alloy",
    title: "Uncertainty-guided screening of high-entropy alloy surfaces for hydrogen evolution",
    authors: "H. Siahaan, D. Hutapea, A. Wicaksono",
    venue: "Digital Discovery (sample entry)",
    year: 2024,
    theme: "ml",
  },
  {
    id: "wicaksono2024wannier",
    title: "Automated Wannierisation for high-throughput topological classification of 2D magnets",
    authors: "A. Wicaksono, L. Manuputty",
    venue: "Computer Physics Communications (sample entry)",
    year: 2024,
    theme: "quantum-2d",
  },
  {
    id: "santoso2024cathode",
    title: "Oxygen loss and dopant selection in nickel-rich layered cathodes from first principles",
    authors: "J. Santoso, B. Saputra",
    venue: "Chemistry of Materials (sample entry)",
    year: 2024,
    theme: "energy",
  },
];

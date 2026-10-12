// SAMPLE CONTENT — replace every entry with real group members.
// Add a photo by putting an image in /public/people and setting `photo`.

export type Person = {
  name: string;
  role: string;
  group: "lead" | "postdoc" | "phd" | "master" | "undergrad";
  focus: string;
  email?: string;
  photo?: string;
  links?: { label: string; href: string }[];
  bio?: string;
};

export const people: Person[] = [
  {
    name: "Dr. Arini Wicaksono",
    role: "Principal Investigator",
    group: "lead",
    focus: "Topological and Janus 2D materials, first-principles methods",
    email: "pi@example.ac.id",
    bio: "Arini leads the group's work on low-dimensional quantum materials. She trained in condensed-matter theory and spent several years developing Wannier-based methods for spin–orbit-coupled systems before founding CMD.",
    links: [
      { label: "Google Scholar", href: "https://scholar.google.com/" },
      { label: "ORCID", href: "https://orcid.org/" },
    ],
  },
  {
    name: "Dr. Bima Saputra",
    role: "Co-Investigator",
    group: "lead",
    focus: "Energy materials, defects, machine-learning potentials",
    email: "coi@example.ac.id",
    bio: "Bima runs the group's energy and machine-learning programmes and maintains the shared high-throughput infrastructure.",
    links: [{ label: "Google Scholar", href: "https://scholar.google.com/" }],
  },
  { name: "Dr. Clara Lumban Gaol", role: "Postdoctoral researcher", group: "postdoc", focus: "Single-atom catalysts and constant-potential DFT" },
  { name: "Dr. Daniel Hutapea", role: "Postdoctoral researcher", group: "postdoc", focus: "Equivariant ML potentials for ion transport" },
  { name: "Eka Pratiwi", role: "PhD candidate", group: "phd", focus: "Quantum anomalous Hall effect in Janus heterostructures" },
  { name: "Fajar Ramadhan", role: "PhD candidate", group: "phd", focus: "Defect tolerance in lead-free perovskites" },
  { name: "Gita Maharani", role: "PhD candidate", group: "phd", focus: "Phonon transport in layered thermoelectrics" },
  { name: "Hendra Siahaan", role: "PhD candidate", group: "phd", focus: "Active learning for alloy catalysts" },
  { name: "Intan Permatasari", role: "Master's student", group: "master", focus: "Rashba splitting at van der Waals interfaces" },
  { name: "Joko Santoso", role: "Master's student", group: "master", focus: "Sodium-ion cathode stability" },
  { name: "Kirana Dewi", role: "Master's student", group: "master", focus: "Band alignment of oxide photocatalysts" },
  { name: "Lukas Manuputty", role: "Undergraduate researcher", group: "undergrad", focus: "Automated phonon workflows" },
];

export const groupLabels: Record<Person["group"], string> = {
  lead: "Group leads",
  postdoc: "Postdoctoral researchers",
  phd: "PhD candidates",
  master: "Master's students",
  undergrad: "Undergraduate researchers",
};

export const alumni = [
  { name: "Maya Kusuma", then: "PhD, 2025", now: "Postdoc, materials theory group in Europe" },
  { name: "Nanda Prasetyo", then: "MSc, 2025", now: "Data scientist, battery start-up" },
  { name: "Oki Firmansyah", then: "MSc, 2024", now: "PhD student, Japan" },
  { name: "Putri Anggraeni", then: "BSc, 2024", now: "MSc student in this group's partner lab" },
];

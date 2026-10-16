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
    name: "Moh. Adhib Ulil Absor, S.Si., M.Sc., Ph.D.",
    role: "Supervisor / Lead",
    group: "lead",
    focus: "Spintronics and strongly correlated electron systems; electronic and magnetic properties of condensed matter",
    links: [
      { label: "Google Scholar", href: "https://scholar.google.co.id/citations?user=LA_l66EAAAAJ&hl=id" },
      { label: "UGM profile", href: "https://acadstaff.ugm.ac.id/Adhib" },
    ],
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

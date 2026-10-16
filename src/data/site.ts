// ─────────────────────────────────────────────────────────────
// Edit this file first: group name, affiliation and contact details
// are used in the header, footer, metadata and contact page.
// ─────────────────────────────────────────────────────────────

export const site = {
  shortName: "CMD",
  name: "Computational Materials Design",
  tagline: "for Advanced Functional Materials",
  description:
    "We use first-principles simulation and machine learning to understand and design functional materials for spintronics, quantum technologies, sensing and energy.",
  affiliation: "Department of Physics, Faculty of Mathematics and Natural Sciences",
  institution: "Your University",
  address: ["Building C, Room 3.12", "Jl. Contoh Kampus No. 1", "Yogyakarta 55281, Indonesia"],
  email: "cmd.group@example.ac.id",
  url: "https://cmd.example.ac.id",
  social: {
    github: "https://github.com/",
    scholar: "https://scholar.google.com/",
    linkedin: "https://www.linkedin.com/",
  },
};

// The interactive lab is switched off for now. Set to true to bring back the /lab page,
// its menu item and the band-structure demo on the home page.
export const labEnabled = false;

export const nav = [
  { href: "/research", label: "Research" },
  ...(labEnabled ? [{ href: "/lab", label: "Interactive lab" }] : []),
  { href: "/people", label: "People" },
  { href: "/publications", label: "Publications" },
  { href: "/news", label: "News" },
  { href: "/join", label: "Join us" },
];

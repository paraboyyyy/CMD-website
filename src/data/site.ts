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
  institution: "Universitas Gadjah Mada",
  address: [
    "Departemen Fisika",
    "Fakultas Matematika dan Ilmu Pengetahuan Alam",
    "Universitas Gadjah Mada",
    "Sekip Utara Bulaksumur",
    "Yogyakarta 55281",
  ],
  email: "cmd.group@example.ac.id",
  url: "https://cmd-website-two.vercel.app",
  /** The group lead's Google Scholar profile, linked from the publications page. */
  scholar: "https://scholar.google.co.id/citations?user=LA_l66EAAAAJ&hl=id",
  /** Shown in the footer. */
  links: [
    { label: "Google Scholar", href: "https://scholar.google.co.id/citations?user=LA_l66EAAAAJ&hl=id" },
    { label: "UGM profile", href: "https://acadstaff.ugm.ac.id/Adhib" },
  ],
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

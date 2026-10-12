// SAMPLE CONTENT — replace with the group's own announcements. Newest first.

export type NewsItem = {
  date: string; // ISO date
  title: string;
  text: string;
  kind: "paper" | "award" | "event" | "people" | "grant";
};

export const news: NewsItem[] = [
  {
    date: "2026-10-01",
    title: "Two new PhD positions open for 2027",
    text: "We are recruiting PhD students in Janus quantum materials and machine-learning potentials. See the Join us page for details and deadlines.",
    kind: "people",
  },
  {
    date: "2026-09-15",
    title: "Paper on the quantum anomalous Hall effect in Janus heterostructures accepted",
    text: "Eka's work shows that which side of a Janus layer faces the substrate decides whether the topological gap survives.",
    kind: "paper",
  },
  {
    date: "2026-08-20",
    title: "National research grant awarded for ML-accelerated battery discovery",
    text: "A three-year grant will fund a postdoc and new GPU nodes for our machine-learning potential work on sodium-ion cathodes.",
    kind: "grant",
  },
  {
    date: "2026-07-05",
    title: "Hands-on DFT school for Indonesian students",
    text: "Forty participants from twelve universities spent a week running their first band-structure and phonon calculations with us.",
    kind: "event",
  },
  {
    date: "2026-05-28",
    title: "Best poster award at the regional computational materials meeting",
    text: "Fajar received the best poster award for his work on defect tolerance in lead-free double perovskites.",
    kind: "award",
  },
  {
    date: "2026-03-10",
    title: "Welcome to Clara and Daniel",
    text: "Two postdoctoral researchers joined the group this spring, bringing expertise in electrocatalysis and equivariant neural networks.",
    kind: "people",
  },
];

export const newsKindLabel: Record<NewsItem["kind"], string> = {
  paper: "Paper",
  award: "Award",
  event: "Event",
  people: "People",
  grant: "Grant",
};

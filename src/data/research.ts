export type Theme = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  questions: string[];
  methods: string[];
  /** Element symbols highlighted on the periodic table for this theme */
  elements: string[];
};

export const themes: Theme[] = [
  {
    id: "quantum-2d",
    title: "Two-dimensional and Janus quantum materials",
    summary:
      "Atomically thin layers whose two faces are chemically different, and what that broken symmetry does to spin, valley and topology.",
    body: [
      "Janus monolayers such as MoSSe or MoTe₂FCl carry a built-in electric field because their top and bottom atomic planes are different elements. That field splits spins, tilts Dirac cones and can open topological gaps that are absent in the symmetric parent.",
      "We study these layers alone and on realistic substrates, asking which face should touch the substrate, how charge transfer and strain change the band order, and whether a quantum anomalous Hall phase survives at experimentally reachable temperatures.",
    ],
    questions: [
      "Does the quantum anomalous Hall gap survive when the layer sits on a substrate?",
      "How does the choice of the substrate-facing side (F or Cl, S or Se) change the band inversion?",
      "Which heterostructures give the largest Rashba splitting at the Fermi level?",
    ],
    methods: ["DFT + SOC", "Hybrid functionals", "Wannier tight-binding", "Berry curvature and Chern numbers", "Edge-state spectra"],
    elements: ["Mo", "W", "Te", "Se", "S", "F", "Cl", "Br", "I", "V", "Cr", "Bi", "Sb"],
  },
  {
    id: "energy",
    title: "Materials for energy conversion and storage",
    summary:
      "Electrodes, solid electrolytes and light absorbers, screened for stability before anyone fires up a furnace.",
    body: [
      "Battery performance is set by how ions move and how host lattices hold up as they do. We compute migration barriers, voltage profiles and decomposition pathways for layered oxides, sodium-ion cathodes and sulfide electrolytes.",
      "For solar energy we work on halide perovskites and oxide photocatalysts, combining band alignment with defect calculations to find compositions that absorb visible light and still tolerate the defects real synthesis will introduce.",
    ],
    questions: [
      "Which dopants suppress oxygen loss in nickel-rich layered cathodes?",
      "Can lead-free double perovskites match the defect tolerance of MAPbI₃?",
      "Where do band edges sit relative to the water redox potentials after surface reconstruction?",
    ],
    methods: ["DFT+U", "Nudged elastic band", "Ab initio molecular dynamics", "Defect formation energies", "GW band alignment"],
    elements: ["Li", "Na", "K", "Mg", "Ni", "Co", "Mn", "Fe", "Ti", "O", "S", "P", "Pb", "Sn", "Bi", "Ag", "Cs", "I", "Br"],
  },
  {
    id: "catalysis",
    title: "Catalysis and surface chemistry",
    summary:
      "Reaction pathways on surfaces and single atoms, mapped one adsorbate at a time.",
    body: [
      "Most of the chemistry that matters for clean fuels happens on a few square nanometres of surface. We build free-energy diagrams for hydrogen evolution, CO₂ reduction and nitrogen fixation on metals, oxides and single-atom catalysts anchored in 2D hosts.",
      "Descriptors such as d-band centre and adsorption scaling relations let us move from single calculations to maps of thousands of candidate sites, which we then refine with explicit solvation and constant-potential methods.",
    ],
    questions: [
      "Which single-atom sites on nitrogen-doped graphene break CO₂RR scaling relations?",
      "How does the Janus built-in field change adsorption on each face?",
      "What does explicit water do to predicted overpotentials?",
    ],
    methods: ["Computational hydrogen electrode", "Implicit and explicit solvation", "Constant-potential DFT", "Microkinetic modelling"],
    elements: ["Pt", "Pd", "Ru", "Ir", "Rh", "Au", "Cu", "Ni", "Fe", "Co", "N", "C", "O", "H", "Mo", "S"],
  },
  {
    id: "ml",
    title: "Machine learning and high-throughput discovery",
    summary:
      "Learned interatomic potentials and automated workflows that turn months of DFT into days.",
    body: [
      "We train equivariant neural-network potentials on our own DFT data so that molecular dynamics can reach the length and time scales of real devices, with active learning to flag configurations the model has not seen.",
      "Around these models we run automated workflows that generate candidate structures, filter them by thermodynamic and dynamical stability, and pass the survivors to accurate property calculations. Every result, including the failures, goes into an open database.",
    ],
    questions: [
      "How much DFT data does a potential need to predict thermal conductivity to within 10%?",
      "Can uncertainty estimates decide which candidates deserve a hybrid-functional calculation?",
      "Which 2D compounds missing from current databases are likely to be exfoliable?",
    ],
    methods: ["Equivariant ML potentials", "Active learning", "Workflow automation (AiiDA, atomate2)", "Graph neural networks", "Bayesian optimisation"],
    elements: [],
  },
];

export const workflow = [
  {
    title: "Build structures",
    text: "Start from a hypothesis and generate candidate crystals, layers, interfaces or defects.",
  },
  {
    title: "Check stability",
    text: "Formation energy, convex hull, phonons and finite-temperature molecular dynamics rule out what cannot exist.",
  },
  {
    title: "Compute properties",
    text: "Band structures, topology, optical response, transport and reaction energetics for the survivors.",
  },
  {
    title: "Learn and screen",
    text: "Machine-learning models generalise from computed examples and rank thousands of new candidates.",
  },
  {
    title: "Validate together",
    text: "The most promising predictions go to experimental partners for synthesis and measurement.",
  },
];

export const tools = [
  "VASP",
  "Quantum ESPRESSO",
  "Wannier90",
  "WannierTools",
  "Phonopy",
  "BerkeleyGW",
  "LAMMPS",
  "ASE",
  "pymatgen",
  "AiiDA",
  "MACE",
  "NequIP",
];

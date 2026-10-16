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
    id: "spin-orbit",
    title: "Spin–orbit physics in low-dimensional materials",
    summary:
      "Rashba splitting, persistent spin textures and spin-split states in monolayers, Janus layers and their defects.",
    body: [
      "In two-dimensional materials with broken inversion symmetry, spin–orbit coupling locks an electron's spin to its momentum. We study how this shows up as Rashba and Zeeman-type splitting, and when it produces a persistent spin texture: a uniform spin orientation that protects spin against dephasing and is attractive for spintronic devices.",
      "Our calculations cover transition metal dichalcogenides, group-IV monochalcogenides, ferroelectric GaXY compounds and Janus layers whose two faces are different elements. We also look at what strain, electric fields, doping, surface alloying and vacancy line defects do to the spin-split bands.",
    ],
    questions: [
      "Which 2D compounds host a persistent spin helix with large spin splitting?",
      "How do strain, electric fields and dopants tune the size and direction of spin splitting?",
      "What spin-polarised states do point and line defects create inside the band gap?",
    ],
    methods: ["DFT with spin–orbit coupling", "Spin-texture analysis", "k·p effective models", "Symmetry analysis"],
    elements: ["Mo", "W", "S", "Se", "Te", "Pt", "Sn", "Ge", "Ga", "Cl", "Br", "I", "Si", "Sb", "Bi", "V", "Zn", "O"],
  },
  {
    id: "topo-magnetic",
    title: "Topological and magnetic quantum materials",
    summary:
      "Quantum anomalous Hall phases, valley splitting and magnetism, from first principles and muon spin relaxation.",
    body: [
      "When magnetism meets spin–orbit coupling, bands can carry a non-zero Chern number and the material can conduct along its edges without dissipation. We compute Berry curvature and Chern numbers to find 2D materials with a quantum anomalous Hall effect, and look for ways to tune both the Chern number and the band gap.",
      "We also study valley splitting from magnetic proximity at heterointerfaces, anomalous Hall effects in layered antiferromagnets, and weak magnetism in correlated oxides, where we develop analysis methods for muon spin relaxation data.",
    ],
    questions: [
      "Can the Chern number and band gap of a 2D magnet be tuned independently?",
      "How large a valley splitting does a magnetic substrate induce?",
      "What do muon spin relaxation measurements reveal about weak internal fields in cuprates?",
    ],
    methods: ["Berry curvature and Chern numbers", "Anomalous Hall conductivity", "DFT+U", "Muon spin relaxation analysis"],
    elements: ["La", "N", "Te", "W", "S", "Co", "O", "Sr", "Cu", "Bi", "Se"],
  },
  {
    id: "functional",
    title: "Functional materials, sensors and surfaces",
    summary:
      "DFT that explains experiments: gas and bio-sensors, graphene-based membranes, catalysts and CO₂ capture.",
    body: [
      "Many of our projects pair calculations with laboratory work by partners. We compute how molecules adsorb on nanofibers, oxides and graphene oxide to explain the response of quartz-crystal gas sensors, fluorescent probes and magnetoresistance biosensors.",
      "The same tools let us study pore structure and functional groups in nanoporous graphene for CO₂ capture, graphene-oxide membranes for water treatment, doping in silicon carbide and graphene, and catalysts for fuel desulfurization.",
    ],
    questions: [
      "Which surface groups give the strongest and most selective gas adsorption?",
      "How do pore size and edge chemistry control CO₂ uptake in nanoporous graphene?",
      "What sets the stability of dopants in SiC and graphene?",
    ],
    methods: ["Adsorption energetics", "Charge-transfer analysis", "Defect formation energies", "Molecular dynamics"],
    elements: ["C", "O", "N", "H", "Si", "Sn", "Fe", "Zn", "Ag", "Mo", "Cd", "Te"],
  },
  {
    id: "ml-energy",
    title: "Machine learning and energy materials",
    summary:
      "Data-driven prediction of perovskite properties, and simulations of solar cells, thermoelectrics and fuel-cell electrodes.",
    body: [
      "We train machine-learning models on large materials datasets to predict band gaps and other properties of single and double perovskites, and to choose device configurations that improve the stability and efficiency of perovskite solar cells.",
      "Alongside this we study energy materials directly: lead-free CsSnI₃ photovoltaics, thermoelectric graphene with dopants and metal deposition, and PtAg-based electrodes for proton-exchange membrane fuel cells.",
    ],
    questions: [
      "How well can ensemble learning predict whether a perovskite has a direct band gap?",
      "Which device layers matter most for perovskite solar cell efficiency?",
      "How do dopants change the thermoelectric performance of graphene?",
    ],
    methods: ["Ensemble learning", "Feature selection", "Device simulation", "Transport calculations"],
    elements: ["Cs", "Sn", "Pb", "I", "Br", "Cl", "Pt", "Ag", "Au", "N", "C"],
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

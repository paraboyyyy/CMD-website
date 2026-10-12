// SAMPLE CONTENT — edit open positions here. Remove entries when they close.

export type Position = {
  title: string;
  level: string;
  deadline: string;
  text: string;
  requirements: string[];
};

export const positions: Position[] = [
  {
    title: "PhD position: topology in Janus heterostructures",
    level: "PhD, fully funded",
    deadline: "Open until filled, review from 15 January 2027",
    text: "Work on quantum anomalous Hall and Rashba physics in Janus monolayers on realistic substrates, in collaboration with an experimental growth group.",
    requirements: [
      "Master's degree in physics, materials science or a related field",
      "Solid background in quantum mechanics and solid-state physics",
      "Some experience with Linux and scripting (Python or Bash) is welcome",
    ],
  },
  {
    title: "PhD position: machine-learning potentials for batteries",
    level: "PhD, fully funded",
    deadline: "Review from 15 January 2027",
    text: "Develop and apply equivariant interatomic potentials to ion transport and degradation in sodium-ion cathodes.",
    requirements: [
      "Master's degree in physics, chemistry, materials science or computer science",
      "Programming experience in Python",
      "Interest in both physics and machine learning",
    ],
  },
  {
    title: "Master's and undergraduate thesis projects",
    level: "MSc / BSc",
    deadline: "Rolling",
    text: "Short projects on band structures, phonons, catalysis or automation. A good way to find out whether computational research suits you.",
    requirements: ["Enrolled student at the university or a partner institution", "Curiosity and patience with error messages"],
  },
];

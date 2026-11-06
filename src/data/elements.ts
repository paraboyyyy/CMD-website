// Periodic table layout used on the research page: periods 1–6, lanthanides collapsed into La.
// "." is an empty cell.
export const PERIODIC_ROWS: string[] = [
  "H . . . . . . . . . . . . . . . . He",
  "Li Be . . . . . . . . . . B C N O F Ne",
  "Na Mg . . . . . . . . . . Al Si P S Cl Ar",
  "K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr",
  "Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe",
  "Cs Ba La Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn",
];

/** Every symbol the periodic table can highlight. */
export const ELEMENT_SYMBOLS = PERIODIC_ROWS.flatMap((r) => r.split(" ")).filter((s) => s !== ".");

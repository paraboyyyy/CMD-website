// Haldane model on the honeycomb lattice (nearest-neighbour bond length = 1).
//
// H(k) = ε(k)·1 + d(k)·σ
//   d_x = t Σ cos(k·aᵢ)          d_y = t Σ sin(k·aᵢ)
//   d_z = Δ − 2 t₂ sinφ Σ sin(k·bᵢ)
//   ε   = 2 t₂ cosφ Σ cos(k·bᵢ)
// E±(k) = ε ± |d|
//
// Δ  : sublattice (on-site) asymmetry — a stand-in for the Janus built-in field
// t₂ : complex next-nearest-neighbour hopping (intrinsic SOC-like term)
// φ  : phase of t₂, breaks time-reversal symmetry when φ ≠ 0, π
//
// Chern number of the lower band:  C = [sgn(m_K') − sgn(m_K)] / 2
//   with m_K = Δ − 3√3 t₂ sinφ,  m_K' = Δ + 3√3 t₂ sinφ.

const S3 = Math.sqrt(3);

const a: [number, number][] = [
  [0, 1],
  [-S3 / 2, -0.5],
  [S3 / 2, -0.5],
];
const b: [number, number][] = [
  [-S3, 0],
  [S3 / 2, -1.5],
  [S3 / 2, 1.5],
];

export type HaldaneParams = {
  t: number;
  t2: number;
  phi: number; // radians
  delta: number;
};

export const K_POINTS = {
  G: [0, 0] as [number, number],
  K: [(4 * Math.PI) / (3 * S3), 0] as [number, number],
  M: [Math.PI / S3, Math.PI / 3] as [number, number],
};

export function bandsAt(kx: number, ky: number, p: HaldaneParams): [number, number] {
  let dx = 0,
    dy = 0,
    sb = 0,
    cb = 0;
  for (const [ax, ay] of a) {
    const ka = kx * ax + ky * ay;
    dx += Math.cos(ka);
    dy += Math.sin(ka);
  }
  for (const [bx, by] of b) {
    const kb = kx * bx + ky * by;
    sb += Math.sin(kb);
    cb += Math.cos(kb);
  }
  dx *= p.t;
  dy *= p.t;
  const dz = p.delta - 2 * p.t2 * Math.sin(p.phi) * sb;
  const eps = 2 * p.t2 * Math.cos(p.phi) * cb;
  const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
  return [eps - d, eps + d];
}

export type PathSample = { s: number; lower: number; upper: number };

/** Sample bands along Γ → K → M → Γ. `s` is cumulative |k| distance. */
export function bandPath(p: HaldaneParams, perSegment = 120) {
  const pts = [K_POINTS.G, K_POINTS.K, K_POINTS.M, K_POINTS.G];
  const labels = ["Γ", "K", "M", "Γ"];
  const samples: PathSample[] = [];
  const ticks: { s: number; label: string }[] = [{ s: 0, label: labels[0] }];
  let s = 0;
  for (let seg = 0; seg < 3; seg++) {
    const [x0, y0] = pts[seg];
    const [x1, y1] = pts[seg + 1];
    const len = Math.hypot(x1 - x0, y1 - y0);
    for (let i = seg === 0 ? 0 : 1; i <= perSegment; i++) {
      const f = i / perSegment;
      const kx = x0 + (x1 - x0) * f;
      const ky = y0 + (y1 - y0) * f;
      const [lo, up] = bandsAt(kx, ky, p);
      samples.push({ s: s + len * f, lower: lo, upper: up });
    }
    s += len;
    ticks.push({ s, label: labels[seg + 1] });
  }
  return { samples, ticks, length: s };
}

export function chernNumber(p: HaldaneParams): number {
  const m = 3 * S3 * p.t2 * Math.sin(p.phi);
  const mK = p.delta - m;
  const mKp = p.delta + m;
  const c = (Math.sign(mKp) - Math.sign(mK)) / 2;
  return Object.is(c, -0) ? 0 : c;
}

/** Indirect gap: min(upper) − max(lower) over a full-zone grid. */
export function bandGap(p: HaldaneParams, n = 72): number {
  // Reciprocal vectors for A1 = (√3/2, 3/2), A2 = (−√3/2, 3/2)
  const G1: [number, number] = [(2 * Math.PI) / S3, (2 * Math.PI) / 3];
  const G2: [number, number] = [(-2 * Math.PI) / S3, (2 * Math.PI) / 3];
  let maxLo = -Infinity;
  let minUp = Infinity;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const u = i / n,
        v = j / n;
      const kx = u * G1[0] + v * G2[0];
      const ky = u * G1[1] + v * G2[1];
      const [lo, up] = bandsAt(kx, ky, p);
      if (lo > maxLo) maxLo = lo;
      if (up < minUp) minUp = up;
    }
  }
  // Include K and K' exactly — the gap usually closes there.
  for (const sgn of [1, -1]) {
    const [lo, up] = bandsAt(sgn * K_POINTS.K[0], 0, p);
    maxLo = Math.max(maxLo, lo);
    minUp = Math.min(minUp, up);
  }
  return Math.max(0, minUp - maxLo);
}

/** Phase boundary Δ/t₂ = ±3√3 sinφ, for the phase-diagram plot. */
export function phaseBoundary(phi: number) {
  return 3 * S3 * Math.sin(phi);
}

"use client";

import { useId, useMemo, useState } from "react";
import { bandGap, bandPath, chernNumber, phaseBoundary, type HaldaneParams } from "@/lib/haldane";

const PRESETS: { label: string; p: Omit<HaldaneParams, "t"> }[] = [
  { label: "Graphene-like", p: { delta: 0, t2: 0, phi: Math.PI / 2 } },
  { label: "Normal insulator", p: { delta: 0.9, t2: 0.08, phi: Math.PI / 2 } },
  { label: "Chern insulator", p: { delta: 0.25, t2: 0.15, phi: Math.PI / 2 } },
  { label: "At the transition", p: { delta: 3 * Math.sqrt(3) * 0.12, t2: 0.12, phi: Math.PI / 2 } },
];

const W = 640,
  H = 400,
  PAD = { l: 52, r: 16, t: 18, b: 40 };
const EMIN = -4.2,
  EMAX = 4.2;

export function BandExplorer({ showPhase = true }: { showPhase?: boolean }) {
  const [delta, setDelta] = useState(0.25);
  const [t2, setT2] = useState(0.15);
  const [phi, setPhi] = useState(Math.PI / 2);
  const p: HaldaneParams = { t: 1, t2, phi, delta };

  const { samples, ticks, length } = useMemo(() => bandPath(p), [delta, t2, phi]); // eslint-disable-line react-hooks/exhaustive-deps
  const gap = useMemo(() => bandGap(p), [delta, t2, phi]); // eslint-disable-line react-hooks/exhaustive-deps
  const C = chernNumber(p);

  const phase =
    gap < 0.02 ? "Gapless (semimetal or transition point)" : C !== 0 ? `Chern insulator, C = ${C > 0 ? "+1" : "−1"}` : "Normal insulator, C = 0";
  const phaseColor = gap < 0.02 ? "text-frost" : C !== 0 ? "text-conduction-lt" : "text-valence-lt";

  const sx = (s: number) => PAD.l + (s / length) * (W - PAD.l - PAD.r);
  const sy = (e: number) => PAD.t + ((EMAX - Math.max(EMIN, Math.min(EMAX, e))) / (EMAX - EMIN)) * (H - PAD.t - PAD.b);

  const lower = samples.map((d, i) => `${i ? "L" : "M"}${sx(d.s).toFixed(1)},${sy(d.lower).toFixed(1)}`).join("");
  const upper = samples.map((d, i) => `${i ? "L" : "M"}${sx(d.s).toFixed(1)},${sy(d.upper).toFixed(1)}`).join("");
  const lowerFill = `${lower}L${sx(length)},${sy(EMIN)}L${sx(0)},${sy(EMIN)}Z`;
  const upperFill = `${upper}L${sx(length)},${sy(EMAX)}L${sx(0)},${sy(EMAX)}Z`;
  const vbm = Math.max(...samples.map((d) => d.lower));
  const cbm = Math.min(...samples.map((d) => d.upper));
  const gid = useId().replace(/:/g, "");

  const applyPreset = (q: Omit<HaldaneParams, "t">) => {
    setDelta(q.delta);
    setT2(q.t2);
    setPhi(q.phi);
  };

  return (
    <div className="on-dark grid gap-8 text-frost lg:grid-cols-[1.45fr_1fr]">
      <div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Band structure along Gamma, K, M, Gamma. ${phase}. Gap ${gap.toFixed(2)} t.`}>
          <defs>
            <linearGradient id={`vb${gid}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#62c3d8" stopOpacity="0.32" />
              <stop offset="1" stopColor="#62c3d8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`cb${gid}`} x1="0" x2="0" y1="1" y2="0">
              <stop offset="0" stopColor="#f0b254" stopOpacity="0.22" />
              <stop offset="1" stopColor="#f0b254" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* axes and high-symmetry lines */}
          {ticks.map((t) => (
            <g key={t.s}>
              <line x1={sx(t.s)} x2={sx(t.s)} y1={PAD.t} y2={H - PAD.b} stroke="#3a5470" strokeWidth="1" />
              <text x={sx(t.s)} y={H - PAD.b + 24} textAnchor="middle" fill="#c9d6e0" fontSize="15" fontFamily="var(--font-display)">
                {t.label}
              </text>
            </g>
          ))}
          {[-4, -2, 0, 2, 4].map((e) => (
            <g key={e}>
              <line x1={PAD.l} x2={W - PAD.r} y1={sy(e)} y2={sy(e)} stroke="#2a4157" strokeDasharray={e === 0 ? "0" : "2 5"} />
              <text x={PAD.l - 10} y={sy(e) + 4} textAnchor="end" fill="#9fb2c2" fontSize="12">
                {e}
              </text>
            </g>
          ))}
          <text
            transform={`translate(14 ${(H - PAD.b + PAD.t) / 2}) rotate(-90)`}
            textAnchor="middle"
            fill="#9fb2c2"
            fontSize="12"
          >
            Energy (units of t)
          </text>

          {/* gap band */}
          {gap > 0.02 && (
            <g>
              <rect x={PAD.l} width={W - PAD.l - PAD.r} y={sy(cbm)} height={Math.max(0, sy(vbm) - sy(cbm))} fill="#e4ecf2" opacity="0.06" />
              <text x={W - PAD.r - 8} y={(sy(cbm) + sy(vbm)) / 2 + 4} textAnchor="end" fill="#e4ecf2" fontSize="12" opacity="0.8">
                gap {gap.toFixed(2)} t
              </text>
            </g>
          )}

          <path d={lowerFill} fill={`url(#vb${gid})`} />
          <path d={upperFill} fill={`url(#cb${gid})`} />
          <path d={lower} fill="none" stroke="#62c3d8" strokeWidth="2.4" strokeLinejoin="round" />
          <path d={upper} fill="none" stroke="#f0b254" strokeWidth="2.4" strokeLinejoin="round" />
        </svg>
        <p className="mt-2 text-[0.85rem] text-frost-muted">
          Valence band in cyan, conduction band in amber, plotted along the high-symmetry path of the hexagonal Brillouin zone.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div aria-live="polite">
          <p className="text-[0.85rem] text-frost-muted">Current phase</p>
          <p className={`font-display text-[1.65rem] leading-tight ${phaseColor}`}>{phase}</p>
          <p className="mt-1 text-[0.9rem] text-frost-muted">Band gap {gap.toFixed(3)} t</p>
        </div>

        <fieldset className="flex flex-col gap-5">
          <legend className="sr-only">Model parameters</legend>
          <Slider
            label="Sublattice asymmetry Δ"
            hint="Makes the two sites inequivalent, like the different faces of a Janus layer"
            min={-1.5}
            max={1.5}
            step={0.01}
            value={delta}
            onChange={setDelta}
            format={(v) => v.toFixed(2)}
          />
          <Slider
            label="Complex hopping t₂"
            hint="Second-neighbour hopping that acts like spin–orbit coupling"
            min={0}
            max={0.3}
            step={0.005}
            value={t2}
            onChange={setT2}
            format={(v) => v.toFixed(3)}
          />
          <Slider
            label="Phase φ"
            hint="Breaks time-reversal symmetry; magnetism plays this role in real materials"
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={phi}
            onChange={setPhi}
            format={(v) => `${(v / Math.PI).toFixed(2)}π`}
          />
        </fieldset>

        <div>
          <p className="mb-2 text-[0.85rem] text-frost-muted">Start from a known case</p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((pr) => (
              <button
                key={pr.label}
                type="button"
                onClick={() => applyPreset(pr.p)}
                className="rounded-full border border-white/20 px-3 py-1.5 text-[0.85rem] transition-colors hover:border-conduction-lt hover:text-conduction-lt"
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>

        {showPhase && (
          <PhaseDiagram
            delta={delta}
            t2={t2}
            phi={phi}
            onPick={(ph, ratio) => {
              const tt = t2 > 0.005 ? t2 : 0.15;
              setT2(tt);
              setPhi(ph);
              setDelta(Math.max(-1.5, Math.min(1.5, ratio * tt)));
            }}
          />
        )}
      </div>
    </div>
  );
}

function Slider(props: {
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[0.95rem] text-frost">
          {props.label}
        </label>
        <output htmlFor={id} className="tabular-nums text-[0.95rem] text-conduction-lt">
          {props.format(props.value)}
        </output>
      </div>
      <p className="mb-2.5 text-[0.8rem] leading-snug text-frost-muted">{props.hint}</p>
      <input
        id={id}
        className="range"
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

/* Haldane phase diagram: Δ/t₂ against φ. Click to move there. */
function PhaseDiagram({
  delta,
  t2,
  phi,
  onPick,
}: {
  delta: number;
  t2: number;
  phi: number;
  onPick: (phi: number, ratio: number) => void;
}) {
  const w = 320,
    h = 170,
    pad = 26;
  const RMAX = 7;
  const px = (ph: number) => pad + ((ph + Math.PI) / (2 * Math.PI)) * (w - 2 * pad);
  const py = (r: number) => h / 2 - (r / RMAX) * (h / 2 - 14);

  const lobe = (sign: 1 | -1) => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const ph = sign > 0 ? (i / 60) * Math.PI : -(i / 60) * Math.PI;
      pts.push(`${px(ph).toFixed(1)},${py(Math.abs(phaseBoundary(ph))).toFixed(1)}`);
    }
    for (let i = 60; i >= 0; i--) {
      const ph = sign > 0 ? (i / 60) * Math.PI : -(i / 60) * Math.PI;
      pts.push(`${px(ph).toFixed(1)},${py(-Math.abs(phaseBoundary(ph))).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  const ratio = t2 > 0.001 ? delta / t2 : delta >= 0 ? RMAX : -RMAX;
  const dotY = py(Math.max(-RMAX, Math.min(RMAX, ratio)));

  const handle = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * w;
    const y = ((e.clientY - r.top) / r.height) * h;
    const ph = ((x - pad) / (w - 2 * pad)) * 2 * Math.PI - Math.PI;
    const rr = ((h / 2 - y) / (h / 2 - 14)) * RMAX;
    onPick(Math.max(-Math.PI, Math.min(Math.PI, ph)), rr);
  };

  return (
    <div>
      <p className="mb-2 text-[0.85rem] text-frost-muted">Phase diagram, click anywhere to jump there</p>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full cursor-crosshair rounded-md bg-ink-2"
        onPointerDown={handle}
        role="img"
        aria-label="Haldane phase diagram of sublattice asymmetry over t2 against phase phi. Two lobes mark the Chern insulator phases."
      >
        <polygon points={lobe(1)} fill="#f0b254" opacity="0.22" stroke="#f0b254" strokeWidth="1" />
        <polygon points={lobe(-1)} fill="#f0b254" opacity="0.12" stroke="#f0b254" strokeWidth="1" strokeDasharray="3 3" />
        <line x1={pad} x2={w - pad} y1={h / 2} y2={h / 2} stroke="#3a5470" />
        <text x={px(Math.PI / 2)} y={h / 2 + 4} textAnchor="middle" fill="#ffe0b0" fontSize="11">
          C = +1
        </text>
        <text x={px(-Math.PI / 2)} y={h / 2 + 4} textAnchor="middle" fill="#ffe0b0" fontSize="11">
          C = −1
        </text>
        <text x={px(0)} y={22} textAnchor="middle" fill="#9fb2c2" fontSize="11">
          C = 0
        </text>
        <text x={pad} y={h - 6} fill="#9fb2c2" fontSize="10">
          −π
        </text>
        <text x={w - pad} y={h - 6} fill="#9fb2c2" fontSize="10" textAnchor="end">
          π
        </text>
        <text x={w / 2} y={h - 6} fill="#9fb2c2" fontSize="10" textAnchor="middle">
          φ
        </text>
        <text x={6} y={16} fill="#9fb2c2" fontSize="10">
          Δ/t₂
        </text>
        <circle cx={px(phi)} cy={dotY} r="6" fill="#e4ecf2" stroke="#142230" strokeWidth="2" />
      </svg>
    </div>
  );
}

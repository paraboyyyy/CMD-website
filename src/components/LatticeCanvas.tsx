"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
  A 1T-type Janus monolayer drawn on a 2D canvas with a small hand-rolled
  3D projection. Metal atoms sit in the middle plane; the top and bottom
  planes are two different elements, which is what makes the layer "Janus".
  Drag (or use arrow keys) to rotate; "Flip layer" turns it over, the same
  choice that decides which face touches a substrate.
*/

type Kind = "top" | "metal" | "bottom";
type Atom = { x: number; y: number; z: number; kind: Kind; sx: number; sy: number; sz: number; delay: number };

const COLORS: Record<Kind, [string, string]> = {
  top: ["#ffd79a", "#d08a2c"],
  metal: ["#f4f8fb", "#7f93a5"],
  bottom: ["#a8e6f2", "#2a8ea6"],
};
const RADIUS: Record<Kind, number> = { top: 0.23, metal: 0.31, bottom: 0.23 };

function buildLayer(R: number) {
  const atoms: Atom[] = [];
  const h = 0.55;
  const S3 = Math.sqrt(3);
  const rand = mulberry32(7);
  const push = (x: number, y: number, z: number, kind: Kind) => {
    const r = Math.hypot(x, y);
    if (r > R) return;
    const ang = rand() * Math.PI * 2;
    const el = (rand() - 0.5) * Math.PI;
    const d = 6 + rand() * 6;
    atoms.push({
      x,
      y,
      z,
      kind,
      sx: Math.cos(ang) * Math.cos(el) * d,
      sy: Math.sin(ang) * Math.cos(el) * d,
      sz: Math.sin(el) * d,
      delay: (r / R) * 0.55 + rand() * 0.15,
    });
  };
  const N = Math.ceil(R) + 2;
  for (let i = -N; i <= N; i++) {
    for (let j = -N; j <= N; j++) {
      const bx = i + j * 0.5;
      const by = (j * S3) / 2;
      push(bx, by, 0, "metal");
      push(bx + 0.5, by + S3 / 6, h, "top");
      push(bx + 1, by + S3 / 3, -h, "bottom");
    }
  }
  const bonds: [number, number][] = [];
  for (let a = 0; a < atoms.length; a++) {
    if (atoms[a].kind !== "metal") continue;
    for (let b = 0; b < atoms.length; b++) {
      if (atoms[b].kind === "metal") continue;
      const dx = atoms[a].x - atoms[b].x;
      const dy = atoms[a].y - atoms[b].y;
      if (dx * dx + dy * dy < 0.36) bonds.push([a, b]);
    }
  }
  return { atoms, bonds };
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export function LatticeCanvas({ className = "", radius = 5.2 }: { className?: string; radius?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    yaw: 0.35,
    pitch: 0.98,
    flip: 0,
    flipTarget: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    idle: 0,
    start: 0,
    visible: true,
  });
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = useCallback(() => {
    const s = state.current;
    s.flipTarget = s.flipTarget === 0 ? Math.PI : 0;
    setFlipped(s.flipTarget !== 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { atoms, bonds } = buildLayer(radius);
    const s = state.current;
    s.start = performance.now();
    if (reduce) s.start -= 10000;

    // Pre-render shaded sphere sprites
    const sprites = {} as Record<Kind, HTMLCanvasElement>;
    (Object.keys(COLORS) as Kind[]).forEach((k) => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(46, 44, 6, 64, 64, 62);
      grad.addColorStop(0, COLORS[k][0]);
      grad.addColorStop(0.7, COLORS[k][1]);
      grad.addColorStop(1, "rgba(10,20,30,0.95)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(64, 64, 62, 0, Math.PI * 2);
      g.fill();
      sprites[k] = c;
    });

    let w = 0,
      h = 0,
      dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    // Start the assembly animation the first time the model scrolls into view.
    let started = reduce;
    const io = new IntersectionObserver(([e]) => {
      s.visible = e.isIntersecting;
      if (e.isIntersecting && !started) {
        started = true;
        s.start = performance.now();
      }
    });
    io.observe(canvas);

    const proj = new Float32Array(atoms.length * 4); // x, y, depth, scale
    const order = atoms.map((_, i) => i);
    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!s.visible || document.hidden) return;

      if (!s.dragging && !reduce) {
        s.idle += dt;
        if (s.idle > 1.2) s.yaw += dt * 0.12;
      }
      s.flip += (s.flipTarget - s.flip) * Math.min(1, dt * (reduce ? 60 : 5));

      const t = (now - s.start) / 1000;
      const scale = Math.min(w, h) / (radius * 2.05);
      const cx = w / 2,
        cy = h / 2;
      const cyw = Math.cos(s.yaw),
        syw = Math.sin(s.yaw);
      const cp = Math.cos(s.pitch),
        sp = Math.sin(s.pitch);
      const cf = Math.cos(s.flip),
        sf = Math.sin(s.flip);
      const D = 16;

      for (let i = 0; i < atoms.length; i++) {
        const a = atoms[i];
        const k = easeOut(Math.min(1, Math.max(0, (t - a.delay) / 1.1)));
        let x = a.x + a.sx * (1 - k);
        let y = a.y + a.sy * (1 - k);
        let z = a.z + a.sz * (1 - k);
        // flip about in-plane x axis
        const y0 = y * cf - z * sf;
        z = y * sf + z * cf;
        y = y0;
        // yaw about z
        const x1 = x * cyw - y * syw;
        const y1 = x * syw + y * cyw;
        // pitch about screen x
        const y2 = y1 * cp - z * sp;
        const z2 = y1 * sp + z * cp;
        const f = D / (D - z2);
        x = x1;
        proj[i * 4] = cx + x * scale * f;
        proj[i * 4 + 1] = cy - y2 * scale * f;
        proj[i * 4 + 2] = z2;
        proj[i * 4 + 3] = f * (0.25 + 0.75 * k);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // bonds
      ctx.lineCap = "round";
      for (const [a, b] of bonds) {
        const ra = Math.hypot(atoms[a].x, atoms[a].y) / radius;
        const alpha = Math.max(0, 1 - ra * ra) * 0.5 * Math.min(1, Math.max(0, t - 0.9));
        if (alpha <= 0.01) continue;
        ctx.strokeStyle = `rgba(190,210,225,${alpha})`;
        ctx.lineWidth = 1.2 * proj[a * 4 + 3];
        ctx.beginPath();
        ctx.moveTo(proj[a * 4], proj[a * 4 + 1]);
        ctx.lineTo(proj[b * 4], proj[b * 4 + 1]);
        ctx.stroke();
      }

      // atoms, back to front
      order.sort((i, j) => proj[i * 4 + 2] - proj[j * 4 + 2]);
      for (const i of order) {
        const a = atoms[i];
        const r = Math.hypot(a.x, a.y) / radius;
        const edge = Math.max(0, 1 - Math.pow(r, 4));
        const depthShade = 0.55 + 0.45 * Math.min(1, Math.max(0, (proj[i * 4 + 2] + 4) / 8));
        ctx.globalAlpha = edge * depthShade;
        const size = RADIUS[a.kind] * scale * proj[i * 4 + 3] * 2;
        ctx.drawImage(sprites[a.kind], proj[i * 4] - size / 2, proj[i * 4 + 1] - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };
    raf = requestAnimationFrame(frame);

    const onDown = (e: PointerEvent) => {
      s.dragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.yaw += (e.clientX - s.lastX) * 0.008;
      s.pitch = Math.min(1.5, Math.max(0.15, s.pitch + (e.clientY - s.lastY) * 0.006));
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.idle = 0;
    };
    const onUp = () => {
      s.dragging = false;
      s.idle = 0;
    };
    const onKey = (e: KeyboardEvent) => {
      const step = 0.12;
      if (e.key === "ArrowLeft") s.yaw -= step;
      else if (e.key === "ArrowRight") s.yaw += step;
      else if (e.key === "ArrowUp") s.pitch = Math.max(0.15, s.pitch - step);
      else if (e.key === "ArrowDown") s.pitch = Math.min(1.5, s.pitch + step);
      else return;
      e.preventDefault();
      s.idle = 0;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("keydown", onKey);
    };
  }, [radius]);

  return (
    <figure className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        tabIndex={0}
        role="img"
        aria-label="Rotatable 3D model of a Janus monolayer: a plane of metal atoms between two planes of different elements. Drag or use arrow keys to rotate."
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 text-[0.82rem] text-frost-muted">
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          <Swatch color="#f0b254" label={flipped ? "Bottom face" : "Top face"} />
          <Swatch color="#dfe8ef" label="Metal plane" />
          <Swatch color="#62c3d8" label={flipped ? "Top face" : "Bottom face"} />
        </span>
        <button
          type="button"
          onClick={toggleFlip}
          className="pointer-events-auto rounded-full border border-white/25 px-3.5 py-1.5 text-frost transition-colors hover:bg-white/10"
          aria-pressed={flipped}
        >
          Flip layer
        </button>
      </figcaption>
    </figure>
  );
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

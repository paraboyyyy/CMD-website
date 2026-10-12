/* eslint-disable @next/next/no-img-element */

const TONES = [
  ["#142230", "#e4ecf2"],
  ["#1f7f96", "#f2f4f6"],
  ["#27405a", "#f0b254"],
  ["#e7ebef", "#142230"],
];

function initials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export function Avatar({ name, photo, size = 72 }: { name: string; photo?: string; size?: number }) {
  if (photo) {
    return <img src={photo} alt="" width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const [bg, fg] = TONES[h % TONES.length];
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-display"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}

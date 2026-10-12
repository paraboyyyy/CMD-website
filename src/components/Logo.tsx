// Mark: one hexagonal cell of a Janus layer seen from above —
// metal atoms on the ring, the two different faces as cyan and amber.
export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const ring = dark ? "#e4ecf2" : "#142230";
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <polygon
        points="20,3 34.7,11.5 34.7,28.5 20,37 5.3,28.5 5.3,11.5"
        fill="none"
        stroke={ring}
        strokeWidth="1.6"
      />
      {[
        [20, 3],
        [34.7, 28.5],
        [5.3, 28.5],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3.1" fill={ring} />
      ))}
      {[
        [34.7, 11.5],
        [5.3, 11.5],
        [20, 37],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="2.4" fill={dark ? "#62c3d8" : "#1f7f96"} />
      ))}
      <circle cx="20" cy="20" r="4.2" fill={dark ? "#f0b254" : "#b8711c"} />
    </svg>
  );
}

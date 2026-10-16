import type { NewsStatus } from "@/lib/news";

const STYLE: Record<NewsStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "border-line text-muted" },
  pending: { label: "Waiting for approval", className: "border-conduction/40 bg-conduction-lt/15 text-conduction" },
  published: { label: "Published", className: "border-valence/40 bg-valence-lt/15 text-valence" },
  rejected: { label: "Needs changes", className: "border-red-300 bg-red-50 text-red-800" },
};

export function StatusBadge({ status }: { status: NewsStatus }) {
  const s = STYLE[status];
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[0.8rem] whitespace-nowrap ${s.className}`}>
      {s.label}
    </span>
  );
}

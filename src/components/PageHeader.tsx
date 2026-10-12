export function PageHeader({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="border-b border-line pt-32 pb-14 md:pt-40 md:pb-20">
      <div className="wrap">
        <h1 className="max-w-4xl text-[2.6rem] md:text-[var(--text-h1)]">{title}</h1>
        {intro && <p className="measure mt-6 text-[var(--text-lead)] leading-relaxed text-muted">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

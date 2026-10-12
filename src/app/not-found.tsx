import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-40 pb-32">
      <div className="wrap">
        <h1 className="text-[2.8rem]">This page does not exist</h1>
        <p className="measure mt-4 text-muted">
          The address may have changed, or the page was never computed. Start from the home page or browse our research.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/" className="btn btn-primary">
            Go to home page
          </Link>
          <Link href="/research" className="btn btn-ghost">
            Browse research
          </Link>
        </div>
      </div>
    </section>
  );
}

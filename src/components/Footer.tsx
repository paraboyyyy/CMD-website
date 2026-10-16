import Link from "next/link";
import { nav, site } from "@/data/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="on-dark mt-auto border-t border-white/10 bg-ink text-frost">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9" dark />
            <p className="font-display text-xl leading-tight">
              {site.name}
              <span className="block text-base text-frost-muted">{site.tagline}</span>
            </p>
          </div>
          <p className="mt-6 max-w-sm text-[0.95rem] text-frost-muted">
            {site.affiliation}
            <br />
            {site.institution}
          </p>
        </div>

        <div>
          <h2 className="font-sans text-[0.95rem] font-medium text-frost">Pages</h2>
          <ul className="mt-4 space-y-2 text-[0.95rem] text-frost-muted">
            {nav.map((n) => (
              <li key={n.href}>
                <Link className="hover:text-conduction-lt" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-[0.95rem] font-medium text-frost">Visit or write</h2>
          <address className="mt-4 text-[0.95rem] not-italic text-frost-muted">
            {site.address.map((l) => (
              <span className="block" key={l}>
                {l}
              </span>
            ))}
            <a className="mt-3 block text-conduction-lt hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </address>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1 text-[0.9rem] text-frost-muted">
            {site.links.map((l) => (
              <li key={l.href}>
                <a className="hover:text-conduction-lt" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-6 text-[0.82rem] text-frost-muted">
          © {new Date().getFullYear()} {site.name} group, {site.institution}
          <span aria-hidden> · </span>
          <Link className="hover:text-conduction-lt" href="/login">
            Member login
          </Link>
        </p>
      </div>
    </footer>
  );
}

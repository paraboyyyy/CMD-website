"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const darkTop = pathname === "/" || pathname === "/lab";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDark = darkTop && !scrolled && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        onDark
          ? "on-dark bg-transparent text-frost"
          : "border-b border-line/80 bg-paper/90 text-text backdrop-blur-md"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
          <Logo className="h-8 w-8" dark={onDark} />
          <span className="leading-tight">
            <span className="block font-display text-[1.15rem]">{site.shortName}</span>
            <span className={`hidden text-[0.72rem] sm:block ${onDark ? "text-frost-muted" : "text-muted"}`}>
              {site.name}
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative rounded-full px-3.5 py-2 text-[0.92rem] transition-colors ${
                      active
                        ? onDark
                          ? "bg-white/10"
                          : "bg-ink text-frost"
                        : onDark
                          ? "hover:bg-white/10"
                          : "hover:bg-paper-2"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="rounded-full p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-paper lg:hidden">
          <ul className="wrap flex flex-col py-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block border-b border-line/60 py-3.5 font-display text-xl ${
                    pathname.startsWith(item.href) ? "text-valence" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

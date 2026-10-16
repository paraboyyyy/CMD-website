import type { Metadata } from "next";
import Link from "next/link";
import { requireMember } from "@/lib/member";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: { default: "Member area", template: "%s · Member area" },
  robots: { index: false },
};

// Everything here depends on who is logged in, so never serve a cached copy.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, isAdmin } = await requireMember();

  return (
    <div className="pt-24 pb-24 md:pt-28">
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <nav aria-label="Member area" className="flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem]">
            <Link className="link" href="/admin">
              Dashboard
            </Link>
            <Link className="link" href="/admin/news/new">
              Write news
            </Link>
            <Link className="link" href="/admin/account">
              Account
            </Link>
            <Link className="link" href="/news">
              Public news page
            </Link>
          </nav>
          <div className="flex items-center gap-4 text-[0.92rem] text-muted">
            <span>
              {profile.full_name || "Member"} ·{" "}
              <span className={isAdmin ? "text-conduction" : ""}>{isAdmin ? "Admin" : "Member"}</span>
            </span>
            <form action={signOut}>
              <button type="submit" className="link">
                Log out
              </button>
            </form>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

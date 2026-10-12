import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { alumni, groupLabels, people, type Person } from "@/data/people";

export const metadata: Metadata = {
  title: "People",
  description: "Members and alumni of the Computational Materials Design group.",
};

const ORDER: Person["group"][] = ["postdoc", "phd", "master", "undergrad"];

export default function PeoplePage() {
  const leads = people.filter((p) => p.group === "lead");

  return (
    <>
      <PageHeader
        title="People"
        intro="Physicists, chemists and materials scientists who share a cluster account and a whiteboard."
      />

      {/* Leads get room for a bio */}
      <section className="py-16 md:py-20">
        <div className="wrap">
          <h2 className="sr-only">{groupLabels.lead}</h2>
          <ul className="grid gap-14 lg:grid-cols-2 lg:gap-16">
            {leads.map((p) => (
              <li key={p.name} className="grid gap-6 sm:grid-cols-[auto_1fr]">
                <Avatar name={p.name} photo={p.photo} size={112} />
                <div>
                  <h3 className="text-[1.8rem]">{p.name}</h3>
                  <p className="text-conduction">{p.role}</p>
                  <p className="mt-3 text-muted">{p.focus}</p>
                  {p.bio && <p className="mt-4 leading-relaxed">{p.bio}</p>}
                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem]">
                    {p.email && (
                      <li>
                        <a className="link" href={`mailto:${p.email}`}>
                          {p.email}
                        </a>
                      </li>
                    )}
                    {p.links?.map((l) => (
                      <li key={l.href}>
                        <a className="link" href={l.href}>
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {ORDER.map((g) => {
        const members = people.filter((p) => p.group === g);
        if (!members.length) return null;
        return (
          <section key={g} className="border-t border-line py-12 md:py-14">
            <div className="wrap grid gap-8 lg:grid-cols-[260px_1fr]">
              <h2 className="text-[1.6rem]">{groupLabels[g]}</h2>
              <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                {members.map((p) => (
                  <li key={p.name} className="flex gap-4">
                    <Avatar name={p.name} photo={p.photo} size={56} />
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="mt-0.5 text-[0.93rem] leading-snug text-muted">{p.focus}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <section className="bg-paper-2 py-16 md:py-20">
        <div className="wrap grid gap-8 lg:grid-cols-[260px_1fr]">
          <div>
            <h2 className="text-[1.6rem]">Alumni</h2>
            <p className="mt-2 text-[0.95rem] text-muted">Where former members went next.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[0.97rem]">
              <thead>
                <tr className="border-b border-line text-muted">
                  <th className="py-3 pr-6 font-normal">Name</th>
                  <th className="py-3 pr-6 font-normal">In the group</th>
                  <th className="py-3 font-normal">Now</th>
                </tr>
              </thead>
              <tbody>
                {alumni.map((a) => (
                  <tr key={a.name} className="border-b border-line/70">
                    <td className="py-3.5 pr-6 font-medium">{a.name}</td>
                    <td className="py-3.5 pr-6 text-muted">{a.then}</td>
                    <td className="py-3.5">{a.now}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap">
          <p className="text-[1.15rem]">
            Want to see your name here?{" "}
            <Link className="link" href="/join">
              See open positions
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}

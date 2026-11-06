/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { deletePerson } from "@/app/admin/content-actions";
import { AlumniEditor } from "@/components/admin/AlumniEditor";
import { ContentNotice } from "@/components/admin/ContentNotice";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Avatar } from "@/components/Avatar";
import { groupLabels, type Person } from "@/data/people";
import { ALUMNUS_COLUMNS, PERSON_COLUMNS, type AlumnusRow, type PersonRow } from "@/lib/content";
import { requireAdmin } from "@/lib/member";
import { PEOPLE_BUCKET, publicImageUrl } from "@/lib/supabase/config";

export const metadata = { title: "People" };

const GROUPS = Object.keys(groupLabels) as Person["group"][];

export default async function AdminPeoplePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { supabase } = await requireAdmin();
  const { saved } = await searchParams;
  const [people, alumni] = await Promise.all([
    supabase.from("people").select(PERSON_COLUMNS).order("sort_order").order("name").returns<PersonRow[]>(),
    supabase.from("alumni").select(ALUMNUS_COLUMNS).order("sort_order").order("name").returns<AlumnusRow[]>(),
  ]);
  const error = people.error ?? alumni.error;

  return (
    <>
      <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[2.4rem] md:text-[var(--text-h2)]">People</h1>
          <p className="mt-2 text-muted">Members and alumni shown on the People page.</p>
        </div>
        <Link href="/admin/people/new" className="btn btn-primary">
          Add person
        </Link>
      </div>

      {saved && (
        <p role="status" className="mt-8 rounded-lg border border-valence/30 bg-valence-lt/10 px-4 py-3 text-[0.95rem]">
          Saved. The People page shows the change straight away.
        </p>
      )}

      {error ? (
        <ContentNotice message={error.message} />
      ) : (
        <>
          {GROUPS.map((g) => {
            const members = people.data!.filter((p) => p.member_group === g);
            return (
              <section key={g} className="mt-12">
                <h2 className="text-[1.5rem]">
                  {groupLabels[g]} <span className="text-muted">({members.length})</span>
                </h2>
                {members.length === 0 ? (
                  <p className="mt-3 text-[0.95rem] text-muted">Nobody yet.</p>
                ) : (
                  <ul className="mt-4 border-t border-line">
                    {members.map((p) => (
                      <li key={p.id} className="flex flex-wrap items-center gap-4 border-b border-line py-4">
                        <Avatar name={p.name} photo={publicImageUrl(PEOPLE_BUCKET, p.photo_path)} size={48} />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{p.name}</p>
                          <p className="text-[0.92rem] text-muted">
                            {p.role}
                            {p.focus && ` · ${p.focus}`}
                          </p>
                        </div>
                        <span className="font-mono text-[0.85rem] text-muted">#{p.sort_order}</span>
                        <div className="flex gap-4 text-[0.92rem]">
                          <Link className="link" href={`/admin/people/${p.id}`}>
                            Edit
                          </Link>
                          <DeleteButton
                            id={p.id}
                            action={deletePerson}
                            confirmText={`Remove ${p.name} from the People page?`}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}

          <section className="mt-16">
            <h2 className="text-[1.5rem]">Alumni</h2>
            <p className="mt-1 text-[0.95rem] text-muted">
              Edit a row and press Save. The alumni table is hidden on the People page while it is empty.
            </p>
            <AlumniEditor
              alumni={alumni.data!.map((a) => ({
                id: a.id,
                name: a.name,
                then: a.then_text,
                now: a.now_text,
                sortOrder: a.sort_order,
              }))}
            />
          </section>
        </>
      )}
    </>
  );
}

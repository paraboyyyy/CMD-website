"use client";

import { useState, useTransition } from "react";
import { deleteAlumnus, saveAlumnus } from "@/app/admin/content-actions";

type Alumnus = { id: string; name: string; then: string; now: string; sortOrder: number };

/** The alumni table, editable in place: each row saves on its own. */
export function AlumniEditor({ alumni }: { alumni: Alumnus[] }) {
  const next = alumni.reduce((m, a) => Math.max(m, a.sortOrder), 0) + 1;
  return (
    <div className="mt-6">
      <div className="hidden gap-3 px-1 text-[0.85rem] text-muted md:grid md:grid-cols-[1.2fr_1fr_1.4fr_5rem_auto]">
        <span>Name</span>
        <span>In the group (e.g. PhD, 2025)</span>
        <span>Now</span>
        <span>Order</span>
        <span className="w-28" />
      </div>
      <ul className="grid gap-3">
        {alumni.map((a) => (
          <AlumnusRow key={a.id} alumnus={a} />
        ))}
        <AlumnusRow key={`new-${alumni.length}`} alumnus={{ id: "", name: "", then: "", now: "", sortOrder: next }} />
      </ul>
    </div>
  );
}

function AlumnusRow({ alumnus }: { alumnus: Alumnus }) {
  const isNew = !alumnus.id;
  const [v, setV] = useState({ ...alumnus, sortOrder: String(alumnus.sortOrder) });
  const [msg, setMsg] = useState<{ error?: string; ok?: boolean }>({});
  const [pending, start] = useTransition();
  const dirty =
    v.name !== alumnus.name ||
    v.then !== alumnus.then ||
    v.now !== alumnus.now ||
    v.sortOrder !== String(alumnus.sortOrder);

  const save = () =>
    start(async () => {
      setMsg({});
      const res = await saveAlumnus({
        id: alumnus.id || undefined,
        name: v.name,
        then: v.then,
        now: v.now,
        sortOrder: Number(v.sortOrder),
      });
      setMsg(res?.error ? { error: res.error } : { ok: true });
    });

  const remove = () =>
    confirm(`Remove ${alumnus.name} from the alumni list?`) &&
    start(async () => {
      const res = await deleteAlumnus(alumnus.id);
      if (res?.error) setMsg({ error: res.error });
    });

  const input = "w-full rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-ink";
  return (
    <li className={`rounded-lg ${isNew ? "border border-dashed border-line p-3" : ""}`}>
      {isNew && <p className="mb-2 text-[0.88rem] text-muted">Add a former member</p>}
      <form
        onSubmit={(e) => (e.preventDefault(), save())}
        className="grid gap-3 md:grid-cols-[1.2fr_1fr_1.4fr_5rem_auto] md:items-center"
      >
        <input
          aria-label="Name"
          placeholder="Name"
          value={v.name}
          onChange={(e) => setV({ ...v, name: e.target.value })}
          className={input}
        />
        <input
          aria-label="In the group"
          placeholder="PhD, 2025"
          value={v.then}
          onChange={(e) => setV({ ...v, then: e.target.value })}
          className={input}
        />
        <input
          aria-label="Now"
          placeholder="Postdoc, …"
          value={v.now}
          onChange={(e) => setV({ ...v, now: e.target.value })}
          className={input}
        />
        <input
          aria-label="Order"
          type="number"
          value={v.sortOrder}
          onChange={(e) => setV({ ...v, sortOrder: e.target.value })}
          className={input}
        />
        <div className="flex w-28 items-center gap-3 text-[0.92rem]">
          <button type="submit" disabled={pending || !dirty} className="link disabled:no-underline disabled:opacity-40">
            {isNew ? "Add" : "Save"}
          </button>
          {!isNew && (
            <button type="button" disabled={pending} onClick={remove} className="text-red-800 hover:underline">
              Remove
            </button>
          )}
        </div>
      </form>
      {msg.error && (
        <p role="alert" className="mt-1 text-[0.88rem] text-red-800">
          {msg.error}
        </p>
      )}
      {msg.ok && !dirty && !isNew && <p className="mt-1 text-[0.88rem] text-valence">Saved.</p>}
    </li>
  );
}

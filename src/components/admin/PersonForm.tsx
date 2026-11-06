"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useTransition } from "react";
import { savePerson } from "@/app/admin/content-actions";
import { groupLabels, type Person } from "@/data/people";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { PEOPLE_BUCKET, publicImageUrl } from "@/lib/supabase/config";

const MAX_PHOTO_MB = 5;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Props = {
  initial?: {
    id: string;
    name: string;
    role: string;
    group: Person["group"];
    focus: string;
    email: string;
    bio: string;
    photoPath: string | null;
    links: { label: string; href: string }[];
    sortOrder: number;
  };
  nextOrder?: number;
};

const DEFAULT_ROLE: Record<Person["group"], string> = {
  lead: "Supervisor / Lead",
  postdoc: "Postdoctoral researcher",
  phd: "PhD student",
  master: "Master's student",
  undergrad: "Undergraduate researcher",
};

export function PersonForm({ initial, nextOrder = 0 }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [group, setGroup] = useState<Person["group"]>(initial?.group ?? "phd");
  const [role, setRole] = useState(initial?.role ?? DEFAULT_ROLE.phd);
  const [focus, setFocus] = useState(initial?.focus ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [links, setLinks] = useState(initial?.links.length ? initial.links : [{ label: "", href: "" }]);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? nextOrder));
  const [photoPath, setPhotoPath] = useState<string | null>(initial?.photoPath ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(publicImageUrl(PEOPLE_BUCKET, initial?.photoPath));
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const onGroup = (g: Person["group"]) => {
    // Keep a custom role; only swap the default wording.
    if (Object.values(DEFAULT_ROLE).includes(role) || !role) setRole(DEFAULT_ROLE[g]);
    setGroup(g);
  };

  const pickFile = (f: File | null) => {
    setError("");
    if (!f) return;
    if (!PHOTO_TYPES.includes(f.type)) return setError("Use a JPG, PNG or WebP photo.");
    if (f.size > MAX_PHOTO_MB * 1024 * 1024) return setError(`The photo must be smaller than ${MAX_PHOTO_MB} MB.`);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const setLink = (i: number, key: "label" | "href", v: string) =>
    setLinks((ls) => ls.map((l, j) => (j === i ? { ...l, [key]: v } : l)));

  const submit = () =>
    start(async () => {
      setError("");
      if (name.trim().length < 2) return setError("Enter the person's name.");

      let path = photoPath;
      let uploaded: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        uploaded = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await createBrowserSupabase()
          .storage.from(PEOPLE_BUCKET)
          .upload(uploaded, file, { contentType: file.type, cacheControl: "31536000" });
        if (upErr) return setError(`Could not upload the photo: ${upErr.message}`);
        path = uploaded;
      }

      const res = await savePerson({
        id: initial?.id,
        name,
        role,
        group,
        focus,
        email,
        bio,
        photoPath: path,
        links,
        sortOrder: Number(sortOrder),
      });
      if (res?.error) {
        setError(res.error);
        if (uploaded) await createBrowserSupabase().storage.from(PEOPLE_BUCKET).remove([uploaded]);
      }
    });

  const field =
    "mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-ink";
  const hint = "block text-[0.85rem] text-muted";

  return (
    <form onSubmit={(e) => (e.preventDefault(), submit())} noValidate className="mt-8 grid max-w-3xl gap-6">
      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
        <div>
          <span className="text-[0.92rem]">Photo (optional)</span>
          <div className="mt-1.5 flex items-center gap-4 sm:flex-col sm:items-start">
            {preview ? (
              <img src={preview} alt="" className="h-28 w-28 rounded-full border border-line object-cover" />
            ) : (
              <span className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-line bg-white text-[0.85rem] text-muted">
                No photo
              </span>
            )}
            <div className="flex flex-col gap-1 text-[0.92rem]">
              <label className="link cursor-pointer">
                {preview ? "Replace" : "Choose a photo"}
                <input
                  type="file"
                  accept={PHOTO_TYPES.join(",")}
                  className="sr-only"
                  onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                />
              </label>
              {preview && (
                <button
                  type="button"
                  className="text-left text-red-800 hover:underline"
                  onClick={() => (setFile(null), setPhotoPath(null), setPreview(undefined))}
                >
                  Remove photo
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <label className="block">
            <span className="text-[0.92rem]">Name</span>
            <span className={hint}>As it should appear, with titles if you like.</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={200} required className={field} />
          </label>
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="text-[0.92rem]">Group</span>
              <select value={group} onChange={(e) => onGroup(e.target.value as Person["group"])} className={field}>
                {(Object.keys(groupLabels) as Person["group"][]).map((g) => (
                  <option key={g} value={g}>
                    {groupLabels[g]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[0.92rem]">Role</span>
              <input value={role} onChange={(e) => setRole(e.target.value)} className={field} />
            </label>
          </div>
        </div>
      </div>

      <label className="block">
        <span className="text-[0.92rem]">Research focus</span>
        <span className={hint}>A short line, e.g. &ldquo;Rashba effect in Janus monolayers&rdquo;.</span>
        <input value={focus} onChange={(e) => setFocus(e.target.value)} className={field} />
      </label>

      <div className="grid gap-6 sm:grid-cols-[1fr_10rem]">
        <label className="block">
          <span className="text-[0.92rem]">Email (optional)</span>
          <span className={hint}>Shown publicly for group leads.</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <label className="block">
          <span className="text-[0.92rem]">Order</span>
          <span className={hint}>Lower numbers first.</span>
          <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={field} />
        </label>
      </div>

      <label className="block">
        <span className="text-[0.92rem]">Bio (optional)</span>
        <span className={hint}>Shown for group leads. Leave an empty line between paragraphs.</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className={`${field} leading-relaxed`}
        />
      </label>

      <fieldset>
        <legend className="text-[0.92rem]">Links (optional)</legend>
        <span className={hint}>Google Scholar, ORCID, a personal page… Shown for group leads.</span>
        <div className="mt-1.5 grid gap-3">
          {links.map((l, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[12rem_1fr_auto] sm:items-center">
              <input
                aria-label="Link label"
                placeholder="Label, e.g. ORCID"
                value={l.label}
                onChange={(e) => setLink(i, "label", e.target.value)}
                className={`${field} mt-0`}
              />
              <input
                aria-label="Link address"
                placeholder="https://"
                value={l.href}
                onChange={(e) => setLink(i, "href", e.target.value)}
                className={`${field} mt-0`}
              />
              <button
                type="button"
                className="justify-self-start text-[0.92rem] text-red-800 hover:underline"
                onClick={() => setLinks((ls) => ls.filter((_, j) => j !== i))}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="link mt-3 text-[0.92rem]"
          onClick={() => setLinks((ls) => [...ls, { label: "", href: "" }])}
        >
          Add a link
        </button>
      </fieldset>

      {error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary disabled:opacity-60">
          {pending ? "Saving…" : initial ? "Save changes" : "Add person"}
        </button>
        <a href="/admin/people" className="link">
          Cancel
        </a>
      </div>
    </form>
  );
}

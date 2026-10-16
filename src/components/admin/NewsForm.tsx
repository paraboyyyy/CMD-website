"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, useTransition } from "react";
import { saveNews, type SaveNewsInput } from "@/app/admin/actions";
import { newsKindLabel } from "@/data/news";
import type { NewsKind } from "@/lib/news";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { imageUrl, NEWS_BUCKET } from "@/lib/supabase/config";

const MAX_IMAGE_MB = 5;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type Props = {
  userId: string;
  isAdmin: boolean;
  initial?: {
    id: string;
    title: string;
    body: string;
    kind: NewsKind;
    newsDate: string;
    imagePath: string | null;
  };
};

const today = () => new Date().toISOString().slice(0, 10);

export function NewsForm({ userId, isAdmin, initial }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [kind, setKind] = useState<NewsKind>(initial?.kind ?? "event");
  const [newsDate, setNewsDate] = useState(initial?.newsDate ?? today());
  // The picture is optional: keep the saved one, pick a new file, or remove it.
  const [imagePath, setImagePath] = useState<string | null>(initial?.imagePath ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(imageUrl(initial?.imagePath));
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const pickFile = (f: File | null) => {
    setError("");
    if (!f) return;
    if (!IMAGE_TYPES.includes(f.type)) return setError("Use a JPG, PNG, WebP or GIF image.");
    if (f.size > MAX_IMAGE_MB * 1024 * 1024) return setError(`The image must be smaller than ${MAX_IMAGE_MB} MB.`);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const removeImage = () => {
    setFile(null);
    setImagePath(null);
    setPreview(undefined);
  };

  const submit = (status: SaveNewsInput["status"]) =>
    start(async () => {
      setError("");
      if (title.trim().length < 3) return setError("Give the news a title of at least 3 characters.");

      let path = imagePath;
      let uploaded: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        uploaded = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await createBrowserSupabase()
          .storage.from(NEWS_BUCKET)
          .upload(uploaded, file, { contentType: file.type, cacheControl: "31536000" });
        if (upErr) return setError(`Could not upload the image: ${upErr.message}`);
        path = uploaded;
      }

      const res = await saveNews({ id: initial?.id, title, body, kind, newsDate, imagePath: path, status });
      if (res?.error) {
        setError(res.error);
        // Saving failed, so the new upload is not used anywhere.
        if (uploaded) await createBrowserSupabase().storage.from(NEWS_BUCKET).remove([uploaded]);
      }
    });

  const field =
    "mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-3 outline-none transition-colors focus:border-ink";

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate className="mt-8 grid max-w-3xl gap-6">
      <label className="block">
        <span className="text-[0.92rem]">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required className={field} />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-[0.92rem]">Category</span>
          <select value={kind} onChange={(e) => setKind(e.target.value as NewsKind)} className={field}>
            {Object.entries(newsKindLabel).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-[0.92rem]">Date</span>
          <input
            type="date"
            value={newsDate}
            onChange={(e) => setNewsDate(e.target.value)}
            required
            className={field}
          />
        </label>
      </div>

      <div>
        <span className="text-[0.92rem]">Picture (optional)</span>
        {preview ? (
          <div className="mt-1.5">
            <img src={preview} alt="" className="max-h-72 rounded-lg border border-line object-cover" />
            <div className="mt-2 flex gap-4 text-[0.92rem]">
              <label className="link cursor-pointer">
                Replace
                <input
                  type="file"
                  accept={IMAGE_TYPES.join(",")}
                  className="sr-only"
                  onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <button type="button" className="text-red-800 hover:underline" onClick={removeImage}>
                Remove picture
              </button>
            </div>
          </div>
        ) : (
          <label className="mt-1.5 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-white px-4 py-8 text-center text-muted hover:border-ink">
            <span>Choose an image</span>
            <span className="mt-1 text-[0.85rem]">JPG, PNG, WebP or GIF, up to {MAX_IMAGE_MB} MB</span>
            <input
              type="file"
              accept={IMAGE_TYPES.join(",")}
              className="sr-only"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </div>

      <label className="block">
        <span className="text-[0.92rem]">Text</span>
        <span className="block text-[0.85rem] text-muted">Leave an empty line between paragraphs.</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          maxLength={20000}
          className={`${field} leading-relaxed`}
        />
      </label>

      {error && (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {isAdmin ? (
          <button
            type="button"
            disabled={pending}
            className="btn btn-primary disabled:opacity-60"
            onClick={() => submit("published")}
          >
            Publish now
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            className="btn btn-primary disabled:opacity-60"
            onClick={() => submit("pending")}
          >
            Send for approval
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          className="btn btn-ghost disabled:opacity-60"
          onClick={() => submit("draft")}
        >
          Save as draft
        </button>
        {pending && <span className="text-[0.92rem] text-muted">Saving…</span>}
      </div>
    </form>
  );
}

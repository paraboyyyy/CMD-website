"use client";

import { useState } from "react";

/*
  No server needed: the form opens the visitor's email app with the message
  filled in. To collect messages on a server instead, point `onSubmit` at a
  route handler (app/api/contact/route.ts) or a form service such as Formspree.
*/
export function ContactForm({ to }: { to: string }) {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const email = String(f.get("email") ?? "").trim();
    const topic = String(f.get("topic") ?? "");
    const message = String(f.get("message") ?? "").trim();
    const errs: Record<string, string> = {};
    if (!name) errs.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter an email address like name@example.com.";
    if (message.length < 20) errs.message = "Write at least a couple of sentences so we know how to help.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const subject = `[CMD website] ${topic}: ${name}`;
    const body = `${message}\n\n— ${name} <${email}>`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field = "mt-1.5 w-full rounded-lg border bg-white px-4 py-3 outline-none transition-colors focus:border-ink";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-[0.92rem]">Name</span>
          <input name="name" autoComplete="name" className={`${field} ${errors.name ? "border-red-700" : "border-line"}`} aria-invalid={!!errors.name} />
          {errors.name && <span className="mt-1 block text-[0.85rem] text-red-800">{errors.name}</span>}
        </label>
        <label className="block">
          <span className="text-[0.92rem]">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={`${field} ${errors.email ? "border-red-700" : "border-line"}`}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="mt-1 block text-[0.85rem] text-red-800">{errors.email}</span>}
        </label>
      </div>
      <label className="block">
        <span className="text-[0.92rem]">What is this about?</span>
        <select name="topic" className={`${field} border-line`} defaultValue="PhD application">
          <option>PhD application</option>
          <option>Master&apos;s or undergraduate project</option>
          <option>Research collaboration</option>
          <option>Industry partnership</option>
          <option>Something else</option>
        </select>
      </label>
      <label className="block">
        <span className="text-[0.92rem]">Message</span>
        <textarea
          name="message"
          rows={6}
          className={`${field} resize-y ${errors.message ? "border-red-700" : "border-line"}`}
          aria-invalid={!!errors.message}
          placeholder="Tell us about your background and what you would like to work on."
        />
        {errors.message && <span className="mt-1 block text-[0.85rem] text-red-800">{errors.message}</span>}
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary">
          Open in email app
        </button>
        {sent && (
          <p className="text-[0.92rem] text-muted" role="status">
            Your email app should open with the message ready to send. If it did not, write to{" "}
            <a className="link" href={`mailto:${to}`}>
              {to}
            </a>
            .
          </p>
        )}
      </div>
    </form>
  );
}

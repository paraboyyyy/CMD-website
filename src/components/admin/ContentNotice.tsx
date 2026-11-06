/** Shown in the admin area when supabase/content.sql has not been run yet. */
export function ContentNotice({ message }: { message: string }) {
  return (
    <div role="alert" className="mt-8 rounded-xl border border-red-300 bg-red-50 px-6 py-5 text-red-900">
      <p className="font-medium">The content tables are not set up yet.</p>
      <p className="mt-2 text-[0.95rem]">
        Run <code className="font-mono">supabase/content.sql</code> in the Supabase SQL Editor (see SETUP-NEWS.md), then
        reload this page. Until then the public pages keep showing the content from the code.
      </p>
      <p className="mt-2 font-mono text-[0.8rem] opacity-70">{message}</p>
    </div>
  );
}

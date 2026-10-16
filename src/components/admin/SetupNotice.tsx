export function SetupNotice() {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-8">
      <h2 className="text-[1.6rem]">Member area not connected yet</h2>
      <p className="mt-3 text-muted">
        Logging in needs a Supabase project. Follow <code className="font-mono text-[0.9em]">SETUP-NEWS.md</code> in the
        repository, add the two environment variables in Vercel, and redeploy.
      </p>
    </div>
  );
}

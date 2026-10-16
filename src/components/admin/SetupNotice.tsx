import { supabaseKey, supabaseUrl } from "@/lib/supabase/config";

export function SetupNotice() {
  // Shows which variable the build did not receive, never the values themselves.
  const vars = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", found: Boolean(supabaseUrl) },
    { name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or …_ANON_KEY)", found: Boolean(supabaseKey) },
  ];
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-8">
      <h2 className="text-[1.6rem]">Member area not connected yet</h2>
      <p className="mt-3 text-muted">
        Logging in needs a Supabase project. Follow <code className="font-mono text-[0.9em]">SETUP-NEWS.md</code> in the
        repository, add the two environment variables in Vercel, and redeploy.
      </p>
      <ul className="mt-4 space-y-1 font-mono text-[0.85rem]">
        {vars.map((v) => (
          <li key={v.name} className={v.found ? "text-valence" : "text-red-800"}>
            {v.found ? "found  " : "missing"} {v.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

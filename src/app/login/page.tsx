import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { LoginForm } from "@/components/admin/LoginForm";
import { supabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Member login",
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (supabaseConfigured) {
    const supabase = await createSessionClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/admin");
  }
  const { error } = await searchParams;

  return (
    <>
      <PageHeader title="Member login" intro="Group members log in here to write news for the website." />
      <section className="py-12 md:py-16">
        <div className="wrap">
          <div className="max-w-xl">
            {supabaseConfigured ? (
              <>
                {error === "link" && (
                  <p
                    role="alert"
                    className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900"
                  >
                    That login link has expired or was already used. Ask for a new one below.
                  </p>
                )}
                <LoginForm />
              </>
            ) : (
              <SetupNotice />
            )}
          </div>
        </div>
      </section>
    </>
  );
}

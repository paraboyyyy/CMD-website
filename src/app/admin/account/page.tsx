import { PasswordForm } from "@/components/admin/PasswordForm";
import { requireMember } from "@/lib/member";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const { user } = await requireMember();
  return (
    <>
      <h1 className="mt-10 text-[2.4rem] md:text-[var(--text-h2)]">Account</h1>
      <p className="mt-2 text-muted">
        Logged in as <strong className="text-text">{user.email}</strong>. If an admin gave you a password, replace it
        with your own here.
      </p>
      <PasswordForm />
    </>
  );
}

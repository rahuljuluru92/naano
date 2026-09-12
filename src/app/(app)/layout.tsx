import type { ReactNode } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { getCurrentProfile } from "@/lib/auth/dal";
import { logOutAction } from "@/actions/auth";

// Authenticated shell -- deliberately distinct from (marketing)'s Nav+Footer
// (no marketing footer, a role badge instead of Sign in/Sign up). Calling
// getCurrentProfile() here is the REAL auth gate: src/proxy.ts only does an
// optimistic redirect and does not see Server Action POSTs.
export default async function AppLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentProfile();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border bg-white px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-border-strong px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-soft">
              {profile.role}
            </span>
            <form action={logOutAction}>
              <button
                type="submit"
                className="rounded-full border border-border-strong bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-alt"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-surface-alt px-6 py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

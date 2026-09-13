import Link from "next/link";
import { requireRole } from "@/lib/auth/dal";

export default async function CreatorHomePage() {
  await requireRole("creator");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Creator hub</h1>
      <p className="mt-2 text-muted">You&apos;re signed in as a creator.</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/creator/profile"
          className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-border-strong"
        >
          <p className="font-semibold text-ink">Your profile</p>
          <p className="mt-1 text-sm text-muted-soft">What brands see when they&apos;re matching campaigns →</p>
        </Link>
        <Link
          href="/creator/bookings"
          className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-border-strong"
        >
          <p className="font-semibold text-ink">Bookings</p>
          <p className="mt-1 text-sm text-muted-soft">Invites, active collaborations, and submissions →</p>
        </Link>
      </div>
    </div>
  );
}

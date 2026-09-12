import Link from "next/link";
import { requireRole } from "@/lib/auth/dal";

export default async function CreatorHomePage() {
  await requireRole("creator");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Creator hub</h1>
      <p className="mt-2 text-muted">You&apos;re signed in as a creator.</p>
      <p className="mt-6 rounded-xl border border-border bg-white p-6 text-sm text-muted">
        Start by{" "}
        <Link href="/creator/profile" className="font-medium text-accent">
          completing your creator profile →
        </Link>
        . Incoming campaign invites and post submissions land in the next phases of the build.
      </p>
    </div>
  );
}

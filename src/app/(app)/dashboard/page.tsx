import Link from "next/link";
import { requireRole, verifySession } from "@/lib/auth/dal";

export default async function DashboardPage() {
  const profile = await requireRole("brand");
  const { supabase } = await verifySession();

  const { count: campaignCount } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", profile.id);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Brand dashboard</h1>
      <p className="mt-2 text-muted">You&apos;re signed in as a brand.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard/campaigns"
          className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-border-strong"
        >
          <p className="font-semibold text-ink">Campaigns</p>
          <p className="mt-1 text-sm text-muted-soft">
            {campaignCount ?? 0} campaign{campaignCount === 1 ? "" : "s"} · browse, create, and find
            matching creators →
          </p>
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-border-strong"
        >
          <p className="font-semibold text-ink">Company profile</p>
          <p className="mt-1 text-sm text-muted-soft">What creators see when you brief a campaign →</p>
        </Link>
      </div>

      <p className="mt-6 rounded-xl border border-dashed border-border-strong bg-white p-6 text-sm text-muted-soft">
        Pipeline tracking (invites, submissions, approvals, payouts) lands in the next phase of the
        build.
      </p>
    </div>
  );
}

import Link from "next/link";
import { requireRole, verifySession } from "@/lib/auth/dal";
import StatGrid from "@/components/StatGrid";

export default async function DashboardPage() {
  const profile = await requireRole("brand");
  const { supabase } = await verifySession();

  const { data: campaigns } = await supabase.from("campaigns").select("id").eq("brand_id", profile.id);
  const campaignIds = (campaigns ?? []).map((c) => c.id);
  const campaignCount = campaigns?.length ?? 0;

  const { data: bookings } = campaignIds.length
    ? await supabase.from("bookings").select("id, status").in("campaign_id", campaignIds)
    : { data: [] };

  const bookingIds = (bookings ?? []).map((b) => b.id);

  const { data: pendingPayouts } = bookingIds.length
    ? await supabase.from("payouts").select("amount").in("booking_id", bookingIds).eq("status", "pending")
    : { data: [] };

  const pendingTotal = (pendingPayouts ?? []).reduce((sum, p) => sum + Number(p.amount), 0);

  const stats = [
    { value: String(campaignCount), label: "Campaigns" },
    { value: String((bookings ?? []).length), label: "Creators invited" },
    { value: String((bookings ?? []).filter((b) => b.status === "in_progress").length), label: "In progress" },
    { value: `€${pendingTotal}`, label: "Pending payouts" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Brand dashboard</h1>
      <p className="mt-2 text-muted">You&apos;re signed in as a brand.</p>

      <div className="mt-8 rounded-2xl border border-border bg-white p-6">
        <StatGrid stats={stats} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard/campaigns"
          className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-border-strong"
        >
          <p className="font-semibold text-ink">Campaigns</p>
          <p className="mt-1 text-sm text-muted-soft">
            {campaignCount} campaign{campaignCount === 1 ? "" : "s"} · browse, create, and find matching
            creators →
          </p>
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-border-strong"
        >
          <p className="font-semibold text-ink">Company profile</p>
          <p className="mt-1 text-sm text-muted-soft">What creators see when you brief a campaign →</p>
        </Link>
        <Link
          href="/dashboard/pipeline"
          className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-border-strong"
        >
          <p className="font-semibold text-ink">Pipeline</p>
          <p className="mt-1 text-sm text-muted-soft">Invites, submissions, approvals, and payouts →</p>
        </Link>
      </div>
    </div>
  );
}

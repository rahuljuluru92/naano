import Link from "next/link";
import { requireRole, verifySession } from "@/lib/auth/dal";
import InitialsAvatar from "@/components/InitialsAvatar";
import ApproveButton from "@/components/bookings/ApproveButton";
import BackLink from "@/components/BackLink";
import type { BookingStatus } from "@/lib/bookings/state-machine";

const COLUMNS: { status: BookingStatus; label: string }[] = [
  { status: "invited", label: "Invited" },
  { status: "in_progress", label: "In progress" },
  { status: "submitted", label: "Submitted" },
  { status: "approved", label: "Approved" },
  { status: "paid", label: "Paid" },
  { status: "declined", label: "Declined" },
];

export default async function PipelinePage() {
  const profile = await requireRole("brand");
  const { supabase } = await verifySession();

  const { data: campaigns } = await supabase.from("campaigns").select("id, title").eq("brand_id", profile.id);

  const campaignIds = (campaigns ?? []).map((c) => c.id);
  const campaignTitleById = new Map((campaigns ?? []).map((c) => [c.id, c.title]));

  const { data: bookings } = campaignIds.length
    ? await supabase
        .from("bookings")
        .select("id, status, agreed_price, campaign_id, creator_id, created_at")
        .in("campaign_id", campaignIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const creatorIds = [...new Set((bookings ?? []).map((b) => b.creator_id))];

  const { data: creators } = creatorIds.length
    ? await supabase.from("creator_profiles").select("user_id, display_name, avatar_url").in("user_id", creatorIds)
    : { data: [] };

  const creatorById = new Map((creators ?? []).map((c) => [c.user_id, c]));

  const bookingIds = (bookings ?? []).map((b) => b.id);

  const { data: submissions } = bookingIds.length
    ? await supabase.from("submissions").select("booking_id, post_url, impressions, clicks, leads").in("booking_id", bookingIds)
    : { data: [] };

  const { data: payouts } = bookingIds.length
    ? await supabase.from("payouts").select("booking_id, amount, status").in("booking_id", bookingIds)
    : { data: [] };

  const submissionByBooking = new Map((submissions ?? []).map((s) => [s.booking_id, s]));
  const payoutByBooking = new Map((payouts ?? []).map((p) => [p.booking_id, p]));

  const hasAnyBookings = (bookings ?? []).length > 0;

  return (
    <div>
      <BackLink href="/dashboard" label="Back to dashboard" />
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Pipeline</h1>
      <p className="mt-2 text-muted">Every invite across your campaigns, grouped by status.</p>

      <div className="mt-8 flex flex-col gap-8">
        {!hasAnyBookings && (
          <p className="rounded-xl border border-dashed border-border-strong bg-white p-6 text-sm text-muted-soft">
            No invites yet.{" "}
            <Link href="/dashboard/campaigns" className="font-medium text-accent">
              Find matching creators from a campaign
            </Link>{" "}
            to get started.
          </p>
        )}

        {COLUMNS.map(({ status, label }) => {
          const rows = (bookings ?? []).filter((b) => b.status === status);
          if (rows.length === 0) return null;

          return (
            <div key={status}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-soft">
                {label} ({rows.length})
              </h2>
              <div className="mt-3 flex flex-col gap-3">
                {rows.map((b) => {
                  const creator = creatorById.get(b.creator_id);
                  const submission = submissionByBooking.get(b.id);
                  const payout = payoutByBooking.get(b.id);

                  return (
                    <div
                      key={b.id}
                      className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <InitialsAvatar name={creator?.display_name ?? "?"} imageUrl={creator?.avatar_url} />
                        <div>
                          <p className="font-semibold text-ink">{creator?.display_name ?? "Unknown creator"}</p>
                          <p className="text-sm text-muted-soft">
                            {campaignTitleById.get(b.campaign_id) ?? "Untitled campaign"}
                            {b.agreed_price != null && <> · €{b.agreed_price}/post</>}
                          </p>
                          {submission && (
                            <p className="mt-1 text-xs text-muted-soft">
                              {submission.impressions} impressions · {submission.clicks} clicks · {submission.leads} leads ·{" "}
                              <a href={submission.post_url} target="_blank" rel="noreferrer" className="text-accent">
                                View post ↗
                              </a>
                            </p>
                          )}
                          {payout && (
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-soft">
                              Payout: €{payout.amount} · {payout.status}
                            </p>
                          )}
                        </div>
                      </div>
                      {status === "submitted" && <ApproveButton bookingId={b.id} />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

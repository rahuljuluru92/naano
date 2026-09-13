import { notFound } from "next/navigation";
import { requireRole, verifySession } from "@/lib/auth/dal";
import SubmissionForm from "@/components/bookings/SubmissionForm";
import { VERTICAL_LABELS, type Vertical } from "@/lib/verticals";
import BackLink from "@/components/BackLink";

export default async function CreatorBookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const profile = await requireRole("creator");
  const { bookingId } = await params;
  const { supabase } = await verifySession();

  const { data: booking } = await supabase
    .from("bookings")
    .select("id, status, agreed_price, creator_id, campaign_id")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.creator_id !== profile.id) {
    notFound();
  }

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, title, description, verticals")
    .eq("id", booking.campaign_id)
    .single();

  const { data: submission } = await supabase
    .from("submissions")
    .select("post_url, impressions, clicks, leads")
    .eq("booking_id", bookingId)
    .maybeSingle();

  return (
    <div>
      <BackLink href="/creator/bookings" label="Back to bookings" />
      <h1 className="text-2xl font-semibold tracking-tight text-ink">{campaign?.title}</h1>
      {campaign?.description && <p className="mt-3 max-w-2xl text-muted">{campaign.description}</p>}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-soft">
        <span>{((campaign?.verticals ?? []) as Vertical[]).map((v) => VERTICAL_LABELS[v] ?? v).join(", ")}</span>
        {booking.agreed_price != null && <span>€{booking.agreed_price}/post</span>}
      </div>

      <div className="mt-8 max-w-xl rounded-2xl border border-border bg-white p-6">
        {booking.status === "in_progress" && !submission && (
          <>
            <h2 className="text-lg font-semibold text-ink">Submit your post</h2>
            <p className="mt-1 text-sm text-muted-soft">Paste the live LinkedIn post URL and the stats so far.</p>
            <div className="mt-4">
              <SubmissionForm bookingId={booking.id} />
            </div>
          </>
        )}

        {submission && (
          <>
            <h2 className="text-lg font-semibold text-ink">Submitted post</h2>
            <a
              href={submission.post_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block break-all text-sm font-medium text-accent"
            >
              {submission.post_url} ↗
            </a>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-semibold text-ink">{submission.impressions}</p>
                <p className="text-xs text-muted-soft">Impressions</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-ink">{submission.clicks}</p>
                <p className="text-xs text-muted-soft">Clicks</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-ink">{submission.leads}</p>
                <p className="text-xs text-muted-soft">Leads</p>
              </div>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-soft">
              Status: {booking.status}
            </p>
          </>
        )}

        {booking.status !== "in_progress" && !submission && (
          <p className="text-sm text-muted-soft">This booking is {booking.status} — nothing to submit yet.</p>
        )}
      </div>
    </div>
  );
}

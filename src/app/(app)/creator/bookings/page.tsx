import Link from "next/link";
import { requireRole, verifySession } from "@/lib/auth/dal";
import RespondButtons from "@/components/bookings/RespondButtons";
import BackLink from "@/components/BackLink";
import { VERTICAL_LABELS, type Vertical } from "@/lib/verticals";

const STATUS_LABELS: Record<string, string> = {
  invited: "Invited",
  accepted: "Accepted",
  in_progress: "In progress",
  submitted: "Submitted",
  approved: "Approved",
  paid: "Paid",
  declined: "Declined",
};

export default async function CreatorBookingsPage() {
  const profile = await requireRole("creator");
  const { supabase } = await verifySession();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, status, agreed_price, created_at, campaign_id")
    .eq("creator_id", profile.id)
    .order("created_at", { ascending: false });

  const campaignIds = [...new Set((bookings ?? []).map((b) => b.campaign_id))];

  const { data: campaigns } = campaignIds.length
    ? await supabase.from("campaigns").select("id, title, verticals, brand_id").in("id", campaignIds)
    : { data: [] };

  const brandIds = [...new Set((campaigns ?? []).map((c) => c.brand_id))];

  const { data: brands } = brandIds.length
    ? await supabase.from("brand_profiles").select("user_id, company_name").in("user_id", brandIds)
    : { data: [] };

  const campaignById = new Map((campaigns ?? []).map((c) => [c.id, c]));
  const brandNameById = new Map((brands ?? []).map((b) => [b.user_id, b.company_name]));

  return (
    <div>
      <BackLink href="/creator" label="Back to creator hub" />
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Your bookings</h1>
      <p className="mt-2 text-muted">Invites, active collaborations, and past submissions.</p>

      <div className="mt-8 flex flex-col gap-3">
        {(!bookings || bookings.length === 0) && (
          <p className="rounded-xl border border-dashed border-border-strong bg-white p-6 text-sm text-muted-soft">
            No invites yet.{" "}
            <Link href="/creator/profile" className="font-medium text-accent">
              Complete your profile
            </Link>{" "}
            so brands can find and invite you.
          </p>
        )}
        {bookings?.map((b) => {
          const campaign = campaignById.get(b.campaign_id);
          const brandName = campaign ? brandNameById.get(campaign.brand_id) : undefined;

          return (
            <div
              key={b.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-ink">{campaign?.title ?? "Untitled campaign"}</p>
                <p className="text-sm text-muted-soft">
                  {brandName ?? "Unknown brand"} ·{" "}
                  {((campaign?.verticals ?? []) as Vertical[]).map((v) => VERTICAL_LABELS[v] ?? v).join(", ")}
                  {b.agreed_price != null && <> · €{b.agreed_price}/post</>}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-border-strong px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-soft">
                  {STATUS_LABELS[b.status] ?? b.status}
                </span>
                {b.status === "invited" && <RespondButtons bookingId={b.id} />}
                {b.status === "in_progress" && (
                  <Link
                    href={`/creator/bookings/${b.id}`}
                    className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink/90"
                  >
                    Submit post →
                  </Link>
                )}
                {(b.status === "submitted" || b.status === "approved" || b.status === "paid") && (
                  <Link href={`/creator/bookings/${b.id}`} className="text-sm font-medium text-accent">
                    View →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

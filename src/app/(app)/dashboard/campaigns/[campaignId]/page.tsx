import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole, verifySession } from "@/lib/auth/dal";
import { VERTICAL_LABELS, type Vertical } from "@/lib/verticals";
import BackLink from "@/components/BackLink";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const profile = await requireRole("brand");
  const { campaignId } = await params;
  const { supabase } = await verifySession();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select(
      "id, title, description, status, verticals, target_follower_tier, budget_min, budget_max, brand_id",
    )
    .eq("id", campaignId)
    .single();

  if (!campaign || campaign.brand_id !== profile.id) {
    notFound();
  }

  return (
    <div>
      <BackLink href="/dashboard/campaigns" label="Back to campaigns" />
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{campaign.title}</h1>
        <span className="rounded-full border border-border-strong px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-soft">
          {campaign.status}
        </span>
      </div>

      {campaign.description && <p className="mt-3 max-w-2xl text-muted">{campaign.description}</p>}

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-soft">
        <span>{(campaign.verticals as Vertical[]).map((v) => VERTICAL_LABELS[v] ?? v).join(", ")}</span>
        {campaign.target_follower_tier && <span>Target tier: {campaign.target_follower_tier}</span>}
        {(campaign.budget_min != null || campaign.budget_max != null) && (
          <span>
            Budget: {campaign.budget_min != null ? `€${campaign.budget_min}` : "€0"}
            {campaign.budget_max != null ? ` - €${campaign.budget_max}` : "+"}
          </span>
        )}
      </div>

      <Link
        href={`/dashboard/campaigns/${campaign.id}/matches`}
        className="mt-8 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink/90"
      >
        Find matching creators →
      </Link>
    </div>
  );
}

import { notFound } from "next/navigation";
import { requireRole, verifySession } from "@/lib/auth/dal";
import { rankCreators, type MatchableCampaign, type MatchableCreator } from "@/lib/matching";
import InitialsAvatar from "@/components/InitialsAvatar";
import InviteButton from "@/components/campaigns/InviteButton";
import { VERTICAL_LABELS, type Vertical } from "@/lib/verticals";

export default async function CampaignMatchesPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const profile = await requireRole("brand");
  const { campaignId } = await params;
  const { supabase } = await verifySession();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, title, verticals, target_follower_tier, budget_min, budget_max, brand_id")
    .eq("id", campaignId)
    .single();

  if (!campaign || campaign.brand_id !== profile.id) {
    notFound();
  }

  const { data: creators } = await supabase
    .from("creator_profiles")
    .select("user_id, display_name, avatar_url, country, verticals, follower_tier, price_per_post");

  const { data: existingBookings } = await supabase
    .from("bookings")
    .select("creator_id")
    .eq("campaign_id", campaignId);

  const invitedIds = new Set((existingBookings ?? []).map((b) => b.creator_id));

  // Numeric columns come back through PostgREST as JSON numbers in
  // practice, but coercing defensively here is one line and removes any
  // doubt -- matching.ts does real arithmetic on these values.
  const campaignForMatching: MatchableCampaign = {
    verticals: campaign.verticals ?? [],
    target_follower_tier: campaign.target_follower_tier,
    budget_min: campaign.budget_min == null ? null : Number(campaign.budget_min),
    budget_max: campaign.budget_max == null ? null : Number(campaign.budget_max),
  };

  const creatorsForMatching = (creators ?? []).map((c) => ({
    ...c,
    price_per_post: Number(c.price_per_post),
  })) satisfies MatchableCreator[];

  const ranked = rankCreators(campaignForMatching, creatorsForMatching);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Matches for &ldquo;{campaign.title}&rdquo;
      </h1>
      <p className="mt-2 text-muted">
        Ranked by vertical fit, follower tier, and price against this campaign&apos;s brief.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {ranked.length === 0 && (
          <p className="rounded-xl border border-dashed border-border-strong bg-white p-6 text-sm text-muted-soft">
            No creators have completed their profile yet.
          </p>
        )}
        {ranked.map((creator) => (
          <div
            key={creator.user_id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <InitialsAvatar name={creator.display_name} imageUrl={creator.avatar_url} />
              <div>
                <p className="font-semibold text-ink">{creator.display_name}</p>
                <p className="text-sm text-muted-soft">
                  {creator.country} ·{" "}
                  {(creator.verticals as Vertical[]).map((v) => VERTICAL_LABELS[v] ?? v).join(", ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-semibold text-ink">{creator.matchScore}%</p>
                <p className="text-xs text-muted-soft">Match</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-ink">€{creator.price_per_post}</p>
                <p className="text-xs text-muted-soft">Per post</p>
              </div>
              <InviteButton
                campaignId={campaign.id}
                creatorId={creator.user_id}
                alreadyInvited={invitedIds.has(creator.user_id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

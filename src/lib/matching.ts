import type { FollowerTier } from "@/lib/validation/profile";

// naano's stated real differentiator is matching by vertical fit, not raw
// follower count (llms.txt: "a 3k-follower creator in your exact niche can
// outrank a 100k generalist") -- weights reflect that priority order.
const WEIGHTS = { vertical: 0.5, tier: 0.3, price: 0.2 } as const;

const TIER_ORDER: FollowerTier[] = ["nano", "micro", "mid", "macro"];

// Bucket distance, not raw-number distance -- a linear normalized distance
// behaves badly across naano's 1,000-500,000 follower span (a 480k-vs-500k
// creator and a 10k-vs-500k creator shouldn't score wildly differently just
// because of scale).
const TIER_DISTANCE_FIT = [1, 0.6, 0.3, 0] as const;

export type MatchableCampaign = {
  verticals: string[];
  target_follower_tier: FollowerTier | null;
  budget_min: number | null;
  budget_max: number | null;
};

export type MatchableCreator = {
  verticals: string[];
  follower_tier: FollowerTier;
  price_per_post: number;
};

function normalize(tag: string) {
  return tag.trim().toLowerCase();
}

export function verticalOverlap(campaignVerticals: string[], creatorVerticals: string[]): number {
  const a = new Set(campaignVerticals.map(normalize));
  const b = new Set(creatorVerticals.map(normalize));

  if (a.size === 0 || b.size === 0) return 0; // explicit 0/0 -> 0, never NaN

  let intersection = 0;
  for (const tag of a) {
    if (b.has(tag)) intersection += 1;
  }

  const union = new Set([...a, ...b]).size;
  return intersection / union; // Jaccard similarity
}

export function tierFit(
  targetTier: FollowerTier | null,
  creatorTier: FollowerTier,
): number {
  if (!targetTier) return 1; // campaign didn't specify a preference -> neutral, not penalized

  const distance = Math.abs(TIER_ORDER.indexOf(targetTier) - TIER_ORDER.indexOf(creatorTier));
  return TIER_DISTANCE_FIT[Math.min(distance, TIER_DISTANCE_FIT.length - 1)];
}

export function priceFit(
  pricePerPost: number,
  budgetMin: number | null,
  budgetMax: number | null,
): number {
  // Coming in under budget is never a problem for the brand -- only being
  // over budget_max should decay the score.
  if (budgetMax == null) return 1;
  if (pricePerPost <= budgetMax) return 1;

  const overBy = (pricePerPost - budgetMax) / budgetMax;
  return Math.max(0, 1 - overBy);
}

export function scoreCreatorForCampaign(
  campaign: MatchableCampaign,
  creator: MatchableCreator,
): number {
  const score =
    WEIGHTS.vertical * verticalOverlap(campaign.verticals, creator.verticals) +
    WEIGHTS.tier * tierFit(campaign.target_follower_tier, creator.follower_tier) +
    WEIGHTS.price * priceFit(creator.price_per_post, campaign.budget_min, campaign.budget_max);

  return Math.round(Math.min(1, Math.max(0, score)) * 100);
}

export function rankCreators<T extends MatchableCreator>(
  campaign: MatchableCampaign,
  creators: T[],
): Array<T & { matchScore: number }> {
  return creators
    .map((creator) => ({ ...creator, matchScore: scoreCreatorForCampaign(campaign, creator) }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

import { z } from "zod";
import { VERTICAL_VALUES } from "@/lib/verticals";

export const followerTierSchema = z.enum(["nano", "micro", "mid", "macro"]);
export type FollowerTier = z.infer<typeof followerTierSchema>;

// Mirrors naano's real ~1,000-500,000 follower span (see llms.txt), bucketed
// so matching.ts compares tiers, not raw follower counts.
export const FOLLOWER_TIER_RANGES: Record<FollowerTier, { min: number; max: number | null }> = {
  nano: { min: 1_000, max: 5_000 },
  micro: { min: 5_000, max: 20_000 },
  mid: { min: 20_000, max: 100_000 },
  macro: { min: 100_000, max: null },
};

// A blank optional field becomes `null` (not "" or undefined) so clearing a
// field in the form actually clears the column, and Postgres gets a real
// null rather than an empty string.
const optionalUrl = z
  .string()
  .trim()
  .url()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : null));

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));

export const brandProfileSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required").max(120),
  website: optionalUrl,
  industry: optionalText(80),
  bio: optionalText(2000),
  // Pasted image URL, not a Storage upload -- see PLAN.md Phase 2 scope.
  logo_url: optionalUrl,
});
export type BrandProfileInput = z.infer<typeof brandProfileSchema>;

export const creatorProfileSchema = z.object({
  display_name: z.string().trim().min(1, "Display name is required").max(120),
  linkedin_url: z
    .string()
    .trim()
    .url()
    .refine((url) => url.includes("linkedin.com"), "Must be a linkedin.com URL"),
  country: z.string().trim().min(1, "Country is required").max(80),
  verticals: z.array(z.enum(VERTICAL_VALUES)).min(1, "Pick at least one vertical").max(6),
  follower_tier: followerTierSchema,
  price_per_post: z.coerce.number().min(20, "Naano's real floor is €20/post"),
  bio: optionalText(2000),
  // Pasted image URL, not a Storage upload -- see PLAN.md Phase 2 scope.
  avatar_url: optionalUrl,
});
export type CreatorProfileInput = z.infer<typeof creatorProfileSchema>;

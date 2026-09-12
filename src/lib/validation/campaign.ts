import { z } from "zod";
import { VERTICAL_VALUES } from "@/lib/verticals";
import { followerTierSchema } from "@/lib/validation/profile";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null));

// Deliberately NOT z.coerce.number() -- Number("") is 0, not NaN, so a
// coerce-first schema would silently treat a blank budget field as "€0"
// instead of "no budget set". Checking the string first avoids that trap.
const optionalBudget = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? Number(v) : null))
  .refine((v) => v === null || (!Number.isNaN(v) && v >= 0), "Must be a non-negative number");

const optionalFollowerTier = z
  .union([followerTierSchema, z.literal("")])
  .transform((v) => (v === "" ? null : v));

export const campaignSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(120),
    description: optionalText(2000),
    verticals: z.array(z.enum(VERTICAL_VALUES)).min(1, "Pick at least one vertical").max(6),
    target_follower_tier: optionalFollowerTier,
    budget_min: optionalBudget,
    budget_max: optionalBudget,
  })
  .refine((data) => data.budget_min == null || data.budget_max == null || data.budget_min <= data.budget_max, {
    message: "Minimum budget must be less than or equal to maximum budget",
    path: ["budget_max"],
  });

export type CampaignInput = z.infer<typeof campaignSchema>;

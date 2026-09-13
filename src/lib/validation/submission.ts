import { z } from "zod";

const nonNegativeInt = z.coerce.number().int("Must be a whole number").min(0, "Must be zero or more");

export const submissionSchema = z.object({
  post_url: z
    .string()
    .trim()
    .url("Must be a valid URL")
    .refine((url) => url.includes("linkedin.com"), "Must be a linkedin.com URL"),
  impressions: nonNegativeInt,
  clicks: nonNegativeInt,
  leads: nonNegativeInt,
});
export type SubmissionInput = z.infer<typeof submissionSchema>;

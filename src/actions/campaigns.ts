"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireRole, verifySession } from "@/lib/auth/dal";
import { campaignSchema } from "@/lib/validation/campaign";

export type CampaignFormState = {
  error?: string;
};

export async function createCampaignAction(
  _prevState: CampaignFormState,
  formData: FormData,
): Promise<CampaignFormState> {
  const profile = await requireRole("brand");
  const { supabase } = await verifySession();

  const parsed = campaignSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    verticals: formData.getAll("verticals"),
    target_follower_tier: formData.get("target_follower_tier"),
    budget_min: formData.get("budget_min"),
    budget_max: formData.get("budget_max"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { data: campaign, error } = await supabase
    .from("campaigns")
    .insert({ brand_id: profile.id, ...parsed.data, status: "draft" })
    .select("id")
    .single();

  if (error || !campaign) {
    return { error: error?.message ?? "Failed to create campaign" };
  }

  revalidatePath("/dashboard/campaigns");
  redirect(`/dashboard/campaigns/${campaign.id}`);
}

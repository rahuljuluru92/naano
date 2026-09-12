"use server";

import { revalidatePath } from "next/cache";
import { requireRole, verifySession } from "@/lib/auth/dal";

export type InviteFormState = {
  error?: string;
  success?: boolean;
};

export async function inviteCreatorAction(
  _prevState: InviteFormState,
  formData: FormData,
): Promise<InviteFormState> {
  await requireRole("brand");
  const { user, supabase } = await verifySession();

  const campaignId = formData.get("campaignId");
  const creatorId = formData.get("creatorId");

  if (typeof campaignId !== "string" || typeof creatorId !== "string") {
    return { error: "Missing campaign or creator" };
  }

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, brand_id, status")
    .eq("id", campaignId)
    .single();

  if (campaignError || !campaign || campaign.brand_id !== user.id) {
    return { error: "Campaign not found" };
  }

  const { data: creator, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("user_id, price_per_post")
    .eq("user_id", creatorId)
    .single();

  if (creatorError || !creator) {
    return { error: "Creator not found" };
  }

  // Creators can only ever see 'active' campaigns (RLS) -- a campaign must
  // be published before an invited creator can see what they were invited
  // to, so the first invite is what publishes it, not a separate step.
  if (campaign.status === "draft") {
    await supabase.from("campaigns").update({ status: "active" }).eq("id", campaignId);
  }

  const { error: bookingError } = await supabase.from("bookings").insert({
    campaign_id: campaignId,
    creator_id: creatorId,
    status: "invited",
    agreed_price: creator.price_per_post,
  });

  if (bookingError) {
    if (bookingError.code === "23505") {
      return { error: "Already invited" };
    }
    return { error: bookingError.message };
  }

  revalidatePath(`/dashboard/campaigns/${campaignId}/matches`);
  return { success: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { requireRole, verifySession } from "@/lib/auth/dal";
import { assertTransition, InvalidBookingTransitionError, type BookingStatus } from "@/lib/bookings/state-machine";

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

export type RespondFormState = {
  error?: string;
};

export async function respondToInviteAction(
  _prevState: RespondFormState,
  formData: FormData,
): Promise<RespondFormState> {
  await requireRole("creator");
  const { user, supabase } = await verifySession();

  const bookingId = formData.get("bookingId");
  const decision = formData.get("decision");

  if (typeof bookingId !== "string" || (decision !== "accept" && decision !== "decline")) {
    return { error: "Invalid request" };
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, creator_id, status")
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking || booking.creator_id !== user.id) {
    return { error: "Booking not found" };
  }

  const target: BookingStatus = decision === "accept" ? "accepted" : "declined";

  try {
    assertTransition(booking.status as BookingStatus, target);
  } catch (e) {
    return { error: e instanceof InvalidBookingTransitionError ? e.message : "Invalid transition" };
  }

  const { error: updateError } = await supabase.from("bookings").update({ status: target }).eq("id", bookingId);

  if (updateError) {
    return { error: updateError.message };
  }

  // Accepting immediately starts the collaboration -- there's no separate
  // "start work" action anywhere in the product, so this walks the state
  // machine's accepted -> in_progress step too rather than stranding the
  // booking in a transient state nothing in the UI can ever act on.
  if (target === "accepted") {
    const { error: startError } = await supabase
      .from("bookings")
      .update({ status: "in_progress" })
      .eq("id", bookingId);

    if (startError) {
      return { error: startError.message };
    }
  }

  revalidatePath("/creator/bookings");
  return {};
}

export type ApproveFormState = {
  error?: string;
};

export async function approveBookingAction(
  _prevState: ApproveFormState,
  formData: FormData,
): Promise<ApproveFormState> {
  const profile = await requireRole("brand");
  const { supabase } = await verifySession();

  const bookingId = formData.get("bookingId");
  if (typeof bookingId !== "string") {
    return { error: "Missing booking" };
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, status, campaign_id")
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) {
    return { error: "Booking not found" };
  }

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("id, brand_id")
    .eq("id", booking.campaign_id)
    .single();

  if (campaignError || !campaign || campaign.brand_id !== profile.id) {
    return { error: "Booking not found" };
  }

  try {
    assertTransition(booking.status as BookingStatus, "approved");
  } catch (e) {
    return { error: e instanceof InvalidBookingTransitionError ? e.message : "Invalid transition" };
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "approved" })
    .eq("id", bookingId);

  if (updateError) {
    return { error: updateError.message };
  }

  // amount is never client-supplied -- set_payout_amount_from_booking (0004)
  // derives it from bookings.agreed_price at insert time.
  const { error: payoutError } = await supabase.from("payouts").insert({ booking_id: bookingId });

  if (payoutError) {
    return { error: payoutError.message };
  }

  revalidatePath("/dashboard/pipeline");
  return {};
}

"use server";

import { revalidatePath } from "next/cache";
import { requireRole, verifySession } from "@/lib/auth/dal";
import { submissionSchema } from "@/lib/validation/submission";
import { assertTransition, InvalidBookingTransitionError, type BookingStatus } from "@/lib/bookings/state-machine";

export type SubmissionFormState = {
  error?: string;
};

export async function submitPostAction(
  _prevState: SubmissionFormState,
  formData: FormData,
): Promise<SubmissionFormState> {
  await requireRole("creator");
  const { user, supabase } = await verifySession();

  const bookingId = formData.get("bookingId");
  if (typeof bookingId !== "string") {
    return { error: "Missing booking" };
  }

  const parsed = submissionSchema.safeParse({
    post_url: formData.get("post_url"),
    impressions: formData.get("impressions"),
    clicks: formData.get("clicks"),
    leads: formData.get("leads"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, creator_id, status")
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking || booking.creator_id !== user.id) {
    return { error: "Booking not found" };
  }

  try {
    assertTransition(booking.status as BookingStatus, "submitted");
  } catch (e) {
    return {
      error: e instanceof InvalidBookingTransitionError ? "This booking isn't ready to submit yet" : "Invalid transition",
    };
  }

  // Insert the submission before flipping status -- if the insert fails
  // (e.g. a duplicate submit race), the booking stays in_progress rather
  // than being marked submitted with nothing behind it.
  const { error: submissionError } = await supabase.from("submissions").insert({
    booking_id: bookingId,
    ...parsed.data,
  });

  if (submissionError) {
    return { error: submissionError.code === "23505" ? "Already submitted" : submissionError.message };
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "submitted" })
    .eq("id", bookingId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/creator/bookings");
  revalidatePath(`/creator/bookings/${bookingId}`);
  return {};
}

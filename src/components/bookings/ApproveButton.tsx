"use client";

import { useActionState } from "react";
import { approveBookingAction, type ApproveFormState } from "@/actions/bookings";

const initialState: ApproveFormState = {};

export default function ApproveButton({ bookingId }: { bookingId: string }) {
  const [state, formAction, isPending] = useActionState(approveBookingAction, initialState);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="bookingId" value={bookingId} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Approving…" : "Approve"}
      </button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}

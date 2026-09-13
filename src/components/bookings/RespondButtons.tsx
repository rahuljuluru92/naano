"use client";

import { useActionState } from "react";
import { respondToInviteAction, type RespondFormState } from "@/actions/bookings";

const initialState: RespondFormState = {};

export default function RespondButtons({ bookingId }: { bookingId: string }) {
  const [state, formAction, isPending] = useActionState(respondToInviteAction, initialState);

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={formAction} className="flex gap-2">
        <input type="hidden" name="bookingId" value={bookingId} />
        <button
          type="submit"
          name="decision"
          value="decline"
          disabled={isPending}
          className="rounded-full border border-border-strong bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-50"
        >
          Decline
        </button>
        <button
          type="submit"
          name="decision"
          value="accept"
          disabled={isPending}
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Accept
        </button>
      </form>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </div>
  );
}

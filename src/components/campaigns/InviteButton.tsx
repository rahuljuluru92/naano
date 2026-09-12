"use client";

import { useActionState } from "react";
import { inviteCreatorAction, type InviteFormState } from "@/actions/bookings";

const initialState: InviteFormState = {};

export default function InviteButton({
  campaignId,
  creatorId,
  alreadyInvited = false,
}: {
  campaignId: string;
  creatorId: string;
  alreadyInvited?: boolean;
}) {
  const [state, formAction] = useActionState(inviteCreatorAction, initialState);
  const invited = alreadyInvited || state.success === true;

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="campaignId" value={campaignId} />
      <input type="hidden" name="creatorId" value={creatorId} />
      <button
        type="submit"
        disabled={invited}
        className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {invited ? "Invited" : "Invite"}
      </button>
      {state.error && <p className="text-xs text-red-600">{state.error}</p>}
    </form>
  );
}

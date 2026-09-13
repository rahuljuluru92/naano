"use client";

import { useActionState } from "react";
import { submitPostAction, type SubmissionFormState } from "@/actions/submissions";
import SubmitButton from "@/components/SubmitButton";

const initialState: SubmissionFormState = {};

const inputClass =
  "rounded-xl border border-border-strong px-4 py-3 text-[15px] outline-none focus:border-ink";

export default function SubmissionForm({ bookingId }: { bookingId: string }) {
  const [state, formAction] = useActionState(submitPostAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="bookingId" value={bookingId} />

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        LinkedIn post URL
        <input
          type="url"
          name="post_url"
          required
          placeholder="https://www.linkedin.com/posts/..."
          className={inputClass}
        />
      </label>

      <div className="grid grid-cols-3 gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          Impressions
          <input type="number" name="impressions" min={0} required defaultValue={0} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          Clicks
          <input type="number" name="clicks" min={0} required defaultValue={0} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          Leads
          <input type="number" name="leads" min={0} required defaultValue={0} className={inputClass} />
        </label>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton pendingText="Submitting…" className="mt-2 self-start">
        Submit post
      </SubmitButton>
    </form>
  );
}

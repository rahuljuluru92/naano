"use client";

import { useActionState } from "react";
import { createCampaignAction, type CampaignFormState } from "@/actions/campaigns";
import SubmitButton from "@/components/SubmitButton";
import { VERTICAL_VALUES, VERTICAL_LABELS } from "@/lib/verticals";
import type { FollowerTier } from "@/lib/validation/profile";

const initialState: CampaignFormState = {};

const inputClass =
  "rounded-xl border border-border-strong px-4 py-3 text-[15px] outline-none focus:border-ink";

const FOLLOWER_TIER_LABELS: Record<FollowerTier, string> = {
  nano: "Nano (1K-5K followers)",
  micro: "Micro (5K-20K followers)",
  mid: "Mid (20K-100K followers)",
  macro: "Macro (100K+ followers)",
};

export default function CampaignForm() {
  const [state, formAction] = useActionState(createCampaignAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Campaign title
        <input
          type="text"
          name="title"
          required
          placeholder="Q1 pipeline push"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Brief / goals
        <textarea
          name="description"
          rows={4}
          placeholder="What should creators know before they publish?"
          className={inputClass}
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Target verticals (pick up to 6)</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {VERTICAL_VALUES.map((v) => (
            <label
              key={v}
              className="cursor-pointer rounded-xl border border-border-strong px-3 py-2 text-center text-sm font-medium text-ink transition-colors has-[:checked]:border-ink has-[:checked]:bg-surface-alt"
            >
              <input type="checkbox" name="verticals" value={v} className="sr-only" />
              {VERTICAL_LABELS[v]}
            </label>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Target follower tier (optional)
        <select name="target_follower_tier" defaultValue="" className={inputClass}>
          <option value="">No preference</option>
          {(Object.keys(FOLLOWER_TIER_LABELS) as FollowerTier[]).map((tier) => (
            <option key={tier} value={tier}>
              {FOLLOWER_TIER_LABELS[tier]}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          Budget min (EUR, optional)
          <input type="number" name="budget_min" min={0} placeholder="200" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          Budget max (EUR, optional)
          <input
            type="number"
            name="budget_max"
            min={0}
            placeholder="1000"
            className={inputClass}
          />
        </label>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton pendingText="Creating…" className="mt-2 self-start">
        Create campaign
      </SubmitButton>
    </form>
  );
}

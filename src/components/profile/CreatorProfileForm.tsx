"use client";

import { useActionState, useState } from "react";
import { saveCreatorProfileAction, type ProfileFormState } from "@/actions/profile";
import SubmitButton from "@/components/SubmitButton";
import InitialsAvatar from "@/components/InitialsAvatar";
import { VERTICAL_VALUES, VERTICAL_LABELS } from "@/lib/verticals";
import type { FollowerTier } from "@/lib/validation/profile";

export type CreatorProfileFormValues = {
  display_name: string;
  linkedin_url: string | null;
  country: string | null;
  verticals: string[];
  follower_tier: FollowerTier | null;
  price_per_post: number | null;
  bio: string | null;
  avatar_url: string | null;
};

const initialState: ProfileFormState = {};

const inputClass =
  "rounded-xl border border-border-strong px-4 py-3 text-[15px] outline-none focus:border-ink";

const FOLLOWER_TIER_LABELS: Record<FollowerTier, string> = {
  nano: "Nano (1K-5K followers)",
  micro: "Micro (5K-20K followers)",
  mid: "Mid (20K-100K followers)",
  macro: "Macro (100K+ followers)",
};

export default function CreatorProfileForm({
  initialValues,
}: {
  initialValues?: Partial<CreatorProfileFormValues>;
}) {
  const [state, formAction] = useActionState(saveCreatorProfileAction, initialState);
  const [displayName, setDisplayName] = useState(initialValues?.display_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initialValues?.avatar_url ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <InitialsAvatar name={displayName || "?"} imageUrl={avatarUrl} size={56} />
        <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-ink">
          Avatar URL (optional)
          <input
            type="url"
            name="avatar_url"
            value={avatarUrl ?? ""}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://your-cdn.com/avatar.jpg"
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Display name
        <input
          type="text"
          name="display_name"
          required
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Jane Doe"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        LinkedIn profile URL
        <input
          type="url"
          name="linkedin_url"
          required
          defaultValue={initialValues?.linkedin_url ?? ""}
          placeholder="https://linkedin.com/in/janedoe"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Country
        <input
          type="text"
          name="country"
          required
          defaultValue={initialValues?.country ?? ""}
          placeholder="France"
          className={inputClass}
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink">Verticals (pick up to 6)</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {VERTICAL_VALUES.map((v) => (
            <label
              key={v}
              className="cursor-pointer rounded-xl border border-border-strong px-3 py-2 text-center text-sm font-medium text-ink transition-colors has-[:checked]:border-ink has-[:checked]:bg-surface-alt"
            >
              <input
                type="checkbox"
                name="verticals"
                value={v}
                defaultChecked={initialValues?.verticals?.includes(v)}
                className="sr-only"
              />
              {VERTICAL_LABELS[v]}
            </label>
          ))}
        </div>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Follower tier
        <select
          name="follower_tier"
          required
          defaultValue={initialValues?.follower_tier ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Select a tier
          </option>
          {(Object.keys(FOLLOWER_TIER_LABELS) as FollowerTier[]).map((tier) => (
            <option key={tier} value={tier}>
              {FOLLOWER_TIER_LABELS[tier]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Price per post (EUR)
        <input
          type="number"
          name="price_per_post"
          required
          min={20}
          step={1}
          defaultValue={initialValues?.price_per_post ?? 20}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Bio
        <textarea
          name="bio"
          rows={3}
          defaultValue={initialValues?.bio ?? ""}
          placeholder="What do you create content about?"
          className={inputClass}
        />
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-accent">Saved.</p>}

      <SubmitButton pendingText="Saving…" className="mt-2 self-start">
        Save profile
      </SubmitButton>
    </form>
  );
}

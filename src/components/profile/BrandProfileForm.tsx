"use client";

import { useActionState, useState } from "react";
import { saveBrandProfileAction, type ProfileFormState } from "@/actions/profile";
import SubmitButton from "@/components/SubmitButton";
import InitialsAvatar from "@/components/InitialsAvatar";

export type BrandProfileFormValues = {
  company_name: string;
  website: string | null;
  industry: string | null;
  bio: string | null;
  logo_url: string | null;
};

const initialState: ProfileFormState = {};

const inputClass =
  "rounded-xl border border-border-strong px-4 py-3 text-[15px] outline-none focus:border-ink";

export default function BrandProfileForm({
  initialValues,
}: {
  initialValues?: Partial<BrandProfileFormValues>;
}) {
  const [state, formAction] = useActionState(saveBrandProfileAction, initialState);
  const [companyName, setCompanyName] = useState(initialValues?.company_name ?? "");
  const [logoUrl, setLogoUrl] = useState(initialValues?.logo_url ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <InitialsAvatar name={companyName || "?"} imageUrl={logoUrl} size={56} />
        <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-ink">
          Logo URL (optional)
          <input
            type="url"
            name="logo_url"
            value={logoUrl ?? ""}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://your-cdn.com/logo.png"
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Company name
        <input
          type="text"
          name="company_name"
          required
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Acme Inc."
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Website
        <input
          type="url"
          name="website"
          defaultValue={initialValues?.website ?? ""}
          placeholder="https://acme.com"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Industry
        <input
          type="text"
          name="industry"
          defaultValue={initialValues?.industry ?? ""}
          placeholder="B2B SaaS"
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Bio
        <textarea
          name="bio"
          rows={3}
          defaultValue={initialValues?.bio ?? ""}
          placeholder="What does your company do?"
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

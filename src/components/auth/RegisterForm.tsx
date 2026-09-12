"use client";

import { useActionState } from "react";
import { signUpAction, type AuthFormState } from "@/actions/auth";
import SubmitButton from "@/components/SubmitButton";

const initialState: AuthFormState = {};

export default function RegisterForm() {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="sr-only">Account type</legend>
        <label className="cursor-pointer rounded-xl border border-border-strong px-4 py-3 text-center text-sm font-medium text-ink transition-colors has-[:checked]:border-ink has-[:checked]:bg-surface-alt">
          <input type="radio" name="role" value="brand" defaultChecked className="sr-only" />
          I&apos;m a brand
        </label>
        <label className="cursor-pointer rounded-xl border border-border-strong px-4 py-3 text-center text-sm font-medium text-ink transition-colors has-[:checked]:border-ink has-[:checked]:bg-surface-alt">
          <input type="radio" name="role" value="creator" className="sr-only" />
          I&apos;m a creator
        </label>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Work email
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          className="rounded-xl border border-border-strong px-4 py-3 text-[15px] outline-none focus:border-ink"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Password
        <input
          type="password"
          name="password"
          required
          minLength={8}
          placeholder="••••••••"
          className="rounded-xl border border-border-strong px-4 py-3 text-[15px] outline-none focus:border-ink"
        />
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.info && <p className="text-sm text-accent">{state.info}</p>}

      <SubmitButton pendingText="Creating account…" className="mt-2 w-full">
        Start for free
      </SubmitButton>
    </form>
  );
}

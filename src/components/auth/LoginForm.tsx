"use client";

import { useActionState } from "react";
import { logInAction, type AuthFormState } from "@/actions/auth";
import SubmitButton from "@/components/SubmitButton";

const initialState: AuthFormState = {};

export default function LoginForm() {
  const [state, formAction] = useActionState(logInAction, initialState);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Email
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
          placeholder="••••••••"
          className="rounded-xl border border-border-strong px-4 py-3 text-[15px] outline-none focus:border-ink"
        />
      </label>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <SubmitButton pendingText="Signing in…" className="mt-2 w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}

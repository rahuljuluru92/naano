"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile, roleHomePath } from "@/lib/auth/bootstrap";
import { signUpSchema, loginSchema } from "@/lib/validation/auth";

export type AuthFormState = {
  error?: string;
  info?: string;
};

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password, role } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role } },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session || !data.user) {
    // Email confirmation is required on this project -- no session yet.
    return {
      info: "Check your email to confirm your account, then sign in.",
    };
  }

  const profile = await ensureProfile(supabase, data.user);
  revalidatePath("/", "layout");
  redirect(roleHomePath(profile.role));
}

export async function logInAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: error.message };
  }

  const profile = await ensureProfile(supabase, data.user);
  revalidatePath("/", "layout");
  redirect(roleHomePath(profile.role));
}

export async function logOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

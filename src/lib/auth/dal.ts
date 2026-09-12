import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/validation/auth";
import type { Profile } from "@/lib/auth/bootstrap";

export type { Profile };

// Data Access Layer, per the Next.js App Router auth guidance: every
// Server Component / Server Action that needs the current user calls
// through here rather than trusting src/proxy.ts's redirect alone (proxy
// matchers don't cover Server Action POSTs). cache() de-dupes repeated
// calls within one request/render pass.

export const verifySession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { user, supabase };
});

export const getCurrentProfile = cache(async (): Promise<Profile> => {
  const { user, supabase } = await verifySession();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role, created_at")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    // Shouldn't normally happen -- signUpAction/logInAction/callback all
    // create the profile row immediately. Falls back to /register (not
    // /onboarding, which doesn't exist until Phase 2) rather than 404ing.
    redirect("/register");
  }

  return profile as Profile;
});

export async function requireRole(role: UserRole) {
  const profile = await getCurrentProfile();

  if (profile.role !== role) {
    redirect("/");
  }

  return profile;
}

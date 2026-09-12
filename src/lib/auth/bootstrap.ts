import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/validation/auth";

export { roleHomePath } from "@/lib/auth/roles";

export type Profile = {
  id: string;
  role: UserRole;
  created_at: string;
};

// Creates the profiles row for a brand-new auth user, or returns the
// existing one. Needed at two call sites -- login (for a user who confirmed
// their email out-of-band) and the /auth/callback code-exchange route --
// so it lives here once rather than being duplicated.
export async function ensureProfile(supabase: SupabaseClient, user: User): Promise<Profile> {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing as Profile;

  const role = (user.user_metadata?.role as UserRole | undefined) ?? "brand";

  const { data: created, error } = await supabase
    .from("profiles")
    .insert({ id: user.id, role })
    .select("id, role, created_at")
    .single();

  if (error || !created) {
    throw error ?? new Error("Failed to create profile");
  }

  return created as Profile;
}

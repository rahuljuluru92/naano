"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/auth/dal";
import { brandProfileSchema, creatorProfileSchema } from "@/lib/validation/profile";

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

export async function saveBrandProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const { user, supabase } = await verifySession();

  const parsed = brandProfileSchema.safeParse({
    company_name: formData.get("company_name"),
    website: formData.get("website"),
    industry: formData.get("industry"),
    bio: formData.get("bio"),
    logo_url: formData.get("logo_url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { error } = await supabase
    .from("brand_profiles")
    .upsert({ user_id: user.id, ...parsed.data });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function saveCreatorProfileAction(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const { user, supabase } = await verifySession();

  const parsed = creatorProfileSchema.safeParse({
    display_name: formData.get("display_name"),
    linkedin_url: formData.get("linkedin_url"),
    country: formData.get("country"),
    verticals: formData.getAll("verticals"),
    follower_tier: formData.get("follower_tier"),
    price_per_post: formData.get("price_per_post"),
    bio: formData.get("bio"),
    avatar_url: formData.get("avatar_url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { error } = await supabase
    .from("creator_profiles")
    .upsert({ user_id: user.id, ...parsed.data });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/creator/profile");
  return { success: true };
}

import { verifySession, requireRole } from "@/lib/auth/dal";
import CreatorProfileForm from "@/components/profile/CreatorProfileForm";

export default async function CreatorProfilePage() {
  const profile = await requireRole("creator");
  const { supabase } = await verifySession();

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("display_name, linkedin_url, country, verticals, follower_tier, price_per_post, bio, avatar_url")
    .eq("user_id", profile.id)
    .maybeSingle();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Creator profile</h1>
      <p className="mt-2 text-muted">
        This is what brands see when matching campaigns to creators in the marketplace.
      </p>
      <div className="mt-8 max-w-xl rounded-2xl border border-border bg-white p-6">
        <CreatorProfileForm initialValues={creatorProfile ?? undefined} />
      </div>
    </div>
  );
}

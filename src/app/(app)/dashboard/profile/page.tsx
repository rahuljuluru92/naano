import { verifySession, requireRole } from "@/lib/auth/dal";
import BrandProfileForm from "@/components/profile/BrandProfileForm";
import BackLink from "@/components/BackLink";

export default async function BrandProfilePage() {
  const profile = await requireRole("brand");
  const { supabase } = await verifySession();

  const { data: brandProfile } = await supabase
    .from("brand_profiles")
    .select("company_name, website, industry, bio, logo_url")
    .eq("user_id", profile.id)
    .maybeSingle();

  return (
    <div>
      <BackLink href="/dashboard" label="Back to dashboard" />
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Company profile</h1>
      <p className="mt-2 text-muted">
        This is what creators and the naano team see when you brief a campaign.
      </p>
      <div className="mt-8 max-w-xl rounded-2xl border border-border bg-white p-6">
        <BrandProfileForm initialValues={brandProfile ?? undefined} />
      </div>
    </div>
  );
}

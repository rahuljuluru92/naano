import { requireRole } from "@/lib/auth/dal";
import CampaignForm from "@/components/campaigns/CampaignForm";

export default async function NewCampaignPage() {
  await requireRole("brand");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">New campaign brief</h1>
      <p className="mt-2 text-muted">
        Describe what you&apos;re looking for -- we&apos;ll match you with the right creators.
      </p>
      <div className="mt-8 max-w-xl rounded-2xl border border-border bg-white p-6">
        <CampaignForm />
      </div>
    </div>
  );
}

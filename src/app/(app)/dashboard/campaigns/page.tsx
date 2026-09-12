import Link from "next/link";
import { requireRole, verifySession } from "@/lib/auth/dal";

export default async function CampaignsListPage() {
  const profile = await requireRole("brand");
  const { supabase } = await verifySession();

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("id, title, status, verticals, created_at")
    .eq("brand_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Campaigns</h1>
        <Link
          href="/dashboard/campaigns/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink/90"
        >
          New campaign
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {(!campaigns || campaigns.length === 0) && (
          <p className="rounded-xl border border-dashed border-border-strong bg-white p-6 text-sm text-muted-soft">
            No campaigns yet. Create your first brief to start matching with creators.
          </p>
        )}
        {campaigns?.map((c) => (
          <Link
            key={c.id}
            href={`/dashboard/campaigns/${c.id}`}
            className="flex items-center justify-between rounded-2xl border border-border bg-white p-4 hover:border-border-strong"
          >
            <div>
              <p className="font-semibold text-ink">{c.title}</p>
              <p className="text-sm text-muted-soft">{(c.verticals ?? []).join(", ")}</p>
            </div>
            <span className="rounded-full border border-border-strong px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-soft">
              {c.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

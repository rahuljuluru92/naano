import { requireRole } from "@/lib/auth/dal";

export default async function AdminHomePage() {
  await requireRole("admin");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Admin</h1>
      <p className="mt-2 text-muted">Managed-plan operations console.</p>
      <p className="mt-6 rounded-xl border border-dashed border-border-strong bg-white p-6 text-sm text-muted-soft">
        Cross-account visibility and booking overrides for the Managed plan land in Phase 6 of the
        build. Admin accounts are never self-registered -- promote a user to admin directly in the
        Supabase table editor (profiles.role).
      </p>
    </div>
  );
}

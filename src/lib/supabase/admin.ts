import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS entirely. Reserved narrowly for the
// admin/"Managed Campaigns" ops flows (Phase 6) and the demo seed script --
// never used for a normal brand/creator request. Every other Server Action
// should go through lib/supabase/server.ts so RLS stays the enforcement
// layer, not just a paper policy.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

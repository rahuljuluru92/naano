// Dev utility: creates a couple of pre-confirmed test accounts (one brand,
// one creator) via the Supabase Admin API, bypassing email confirmation
// entirely -- useful for manually exercising the auth flow without needing
// real inboxes. Not the Phase 8 demo-seed script (that also seeds
// creator_profiles/campaigns data); this only creates auth users + role.
//
// Usage: node --env-file=.env.local scripts/dev-create-test-users.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const users = [
  { email: "brand.demo@naano-clone.test", password: "TestPassword123!", role: "brand" },
  { email: "creator.demo@naano-clone.test", password: "TestPassword123!", role: "creator" },
];

for (const u of users) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { role: u.role },
  });

  if (error) {
    console.log(u.email, "ERROR:", error.message);
    continue;
  }

  console.log(u.email, "created, id:", data.user.id);
}

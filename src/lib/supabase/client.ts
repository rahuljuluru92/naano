import { createBrowserClient } from "@supabase/ssr";

// TODO: add `<Database>` generic once `supabase gen types typescript` has
// been run against a live project (see supabase/migrations for the schema).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

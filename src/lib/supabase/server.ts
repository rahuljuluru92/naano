import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Cookie-bound client for Server Components / Server Actions / Route
// Handlers. Every read/write issued through this client is subject to the
// RLS policies in supabase/migrations/0002_rls_policies.sql -- that's what
// makes RLS the real isolation boundary rather than a paper policy.
//
// TODO: add `<Database>` generic once `supabase gen types typescript` has
// been run against a live project.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Thrown when called from a Server Component render (no mutable
            // response there). Safe to ignore -- src/proxy.ts refreshes the
            // session cookie on every request that goes through it.
          }
        },
      },
    },
  );
}

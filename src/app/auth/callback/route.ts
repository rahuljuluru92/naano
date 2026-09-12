import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile, roleHomePath } from "@/lib/auth/bootstrap";

// Supabase's email-confirmation link redirects here with a `code` param
// (PKCE flow), used when "Confirm email" is on for the project. Without
// this route, a confirmed user would land back on the site with the code
// left unexchanged and no session ever established.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const profile = await ensureProfile(supabase, data.user);
  return NextResponse.redirect(new URL(roleHomePath(profile.role), request.url));
}

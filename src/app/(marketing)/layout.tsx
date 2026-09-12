import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/validation/auth";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: UserRole | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    role = (profile?.role as UserRole | undefined) ?? null;
  }

  return (
    <>
      <Nav role={role} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

import Link from "next/link";
import { requireRole, verifySession } from "@/lib/auth/dal";
import StatGrid from "@/components/StatGrid";

export default async function CreatorHomePage() {
  const profile = await requireRole("creator");
  const { supabase } = await verifySession();

  const { data: bookings } = await supabase.from("bookings").select("id, status").eq("creator_id", profile.id);
  const bookingIds = (bookings ?? []).map((b) => b.id);

  const { data: payouts } = bookingIds.length
    ? await supabase.from("payouts").select("amount, status").in("booking_id", bookingIds)
    : { data: [] };

  const totalByStatus = (status: string) =>
    (payouts ?? []).filter((p) => p.status === status).reduce((sum, p) => sum + Number(p.amount), 0);

  const stats = [
    { value: String((bookings ?? []).length), label: "Total bookings" },
    { value: String((bookings ?? []).filter((b) => b.status === "invited").length), label: "Pending invites" },
    { value: `€${totalByStatus("paid")}`, label: "Paid to date" },
    { value: `€${totalByStatus("pending")}`, label: "Pending payouts" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Creator hub</h1>
      <p className="mt-2 text-muted">You&apos;re signed in as a creator.</p>

      <div className="mt-8 rounded-2xl border border-border bg-white p-6">
        <StatGrid stats={stats} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/creator/profile"
          className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-border-strong"
        >
          <p className="font-semibold text-ink">Your profile</p>
          <p className="mt-1 text-sm text-muted-soft">What brands see when they&apos;re matching campaigns →</p>
        </Link>
        <Link
          href="/creator/bookings"
          className="flex-1 rounded-2xl border border-border bg-white p-6 hover:border-border-strong"
        >
          <p className="font-semibold text-ink">Bookings</p>
          <p className="mt-1 text-sm text-muted-soft">Invites, active collaborations, and submissions →</p>
        </Link>
      </div>
    </div>
  );
}

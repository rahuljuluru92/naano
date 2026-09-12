import { EyebrowBadge } from "@/components/Badge";

export default function BookPage() {
  return (
    <section className="hero-gradient flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-10 text-center shadow-[0_20px_60px_-25px_rgba(23,24,28,0.25)]">
        <EyebrowBadge>Campaign strategy call</EyebrowBadge>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink">
          30-minute working session
        </h1>
        <p className="mt-3 text-[15px] text-muted">
          Leave with a concrete creator strategy, campaign format and estimated budget for your
          next launch.
        </p>
        <div className="mt-8 rounded-2xl border border-dashed border-border-strong p-8 text-sm text-muted-soft">
          Calendar picker placeholder — pick a time on the next page.
        </div>
      </div>
    </section>
  );
}

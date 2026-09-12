import type { Metadata } from "next";
import { EyebrowBadge } from "@/components/Badge";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "About naano: the team behind the B2B LinkedIn creator marketplace",
  description: "Built by founders, for founders. Meet the team and the mission behind naano.",
};

const glance = [
  { label: "Founded", value: "2025, Paris, France" },
  { label: "Category", value: "B2B LinkedIn creator marketplace" },
  { label: "Creator network", value: "2,000+ vetted B2B LinkedIn creators (≈1K–500K followers)" },
  { label: "Pricing", value: "From €20 per post · Self-Serve €0/mo · Managed €700/mo" },
  { label: "Avg. cost per qualified click", value: "€18 (Q1 2026, n=312 campaigns)" },
  { label: "Avg. CTR on creator posts", value: "12% vs 0.8% LinkedIn Ads benchmark" },
];

const founders = [
  { name: "Thomas", role: "CEO & Co-founder" },
  { name: "Alexis", role: "CMO & Co-founder" },
  { name: "Justine", role: "CTO & Co-founder" },
];

export default function AboutPage() {
  return (
    <>
      <section className="hero-gradient border-b border-border px-6 py-24 text-center">
        <EyebrowBadge>Our story</EyebrowBadge>
        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Built by founders, for founders.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted">
          The B2B LinkedIn creator marketplace connecting companies with vetted creators.
        </p>

        <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6">
          {founders.map((f) => (
            <div key={f.name} className="rounded-2xl border border-border bg-white p-6">
              <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-accent-soft" />
              <p className="font-semibold text-ink">{f.name}</p>
              <p className="text-xs text-muted-soft">{f.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <EyebrowBadge>How we started</EyebrowBadge>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Built on proven results.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Naano connects companies that want to grow with LinkedIn creators who want to monetize
            their audience. We believe growth works better when it&apos;s driven by people, not
            ads. That&apos;s why we help businesses scale through Creator-Led Growth: real
            professionals talking to real audiences.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-surface-alt px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <EyebrowBadge>Our mission</EyebrowBadge>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Make creator marketing your most effective revenue channel.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            We connect B2B companies with LinkedIn micro-creators who deliver strong credibility in
            their industry and trust that converts into growth. Real professionals talking to real
            audiences, at scale.
          </p>
        </div>
      </section>

      <section className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-ink">
            Naano at a glance
          </h2>
          <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
            {glance.map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-soft">
                  {row.label}
                </span>
                <span className="text-[15px] text-ink sm:text-right">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-alt px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <EyebrowBadge>Why naano</EyebrowBadge>
          <h2 className="mx-auto mt-6 max-w-lg text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Better for brands. Better for creators.
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-6 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-white p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-soft">For brands</p>
              <ul className="mt-4 flex flex-col gap-4">
                <li>
                  <p className="font-semibold text-ink">Unlock new growth</p>
                  <p className="text-sm text-muted">Turn LinkedIn creators into your best sales channel</p>
                </li>
                <li>
                  <p className="font-semibold text-ink">Build brand authority</p>
                  <p className="text-sm text-muted">Get recommended by trusted voices in your industry</p>
                </li>
                <li>
                  <p className="font-semibold text-ink">Performance-pay only</p>
                  <p className="text-sm text-muted">Pay per post, not per impression</p>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-white p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-soft">For creators</p>
              <ul className="mt-4 flex flex-col gap-4">
                <li>
                  <p className="font-semibold text-ink">Your expertise is the asset</p>
                  <p className="text-sm text-muted">Your credibility matters more than your follower count</p>
                </li>
                <li>
                  <p className="font-semibold text-ink">Monetize what you already do</p>
                  <p className="text-sm text-muted">Get paid for recommending tools you actually use</p>
                </li>
                <li>
                  <p className="font-semibold text-ink">Earn from your network</p>
                  <p className="text-sm text-muted">Turn your LinkedIn posts into revenue</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="hero-gradient px-6 py-24 text-center">
        <EyebrowBadge>The future of growth</EyebrowBadge>
        <h2 className="mx-auto mt-6 max-w-lg text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Traditional advertising is losing impact. Collaboration is the future.
        </h2>
        <div className="mt-9 flex justify-center">
          <Button href="/register" arrow>
            Get started
          </Button>
        </div>
      </section>
    </>
  );
}

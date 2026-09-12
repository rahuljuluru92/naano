import type { Metadata } from "next";
import { EyebrowBadge } from "@/components/Badge";
import PricingCard from "@/components/PricingCard";
import FAQAccordion from "@/components/FAQAccordion";
import { PRICING_PLANS } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Pricing — naano",
  description: "Flat fee per post from €20. Self-Serve €0/month or Managed €700/month.",
};

const billingSteps = [
  "You choose a plan: Self-Serve (€0/month) or Managed Campaigns (€700/month).",
  "You (or the Naano team, on Managed) source creators and create briefs. Each creator's post price (from €20) is shown before you book it.",
  "The creator publishes the post. You review and approve the content.",
  "Once approved, the creator is paid automatically via Stripe Connect. Naano handles invoices and approval records.",
  "There is no cost per click, impression, or lead — pricing is flat per published post.",
  "Both plans are month-to-month. Upgrade, downgrade, or cancel anytime.",
];

const faqs = [
  {
    question: "Is there a minimum spend?",
    answer: "No. Self-Serve has no retainer and no minimum spend — campaigns cost from €20 per published post.",
  },
  {
    question: "What does the Managed plan include?",
    answer:
      "The Naano team runs campaign strategy, creator sourcing, brief creation, launch and reporting end to end for a flat €700/month, separate from per-post spend.",
  },
  {
    question: "How are creators paid?",
    answer: "Automatically via Stripe Connect once you approve the published post. Naano handles invoices and records.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="hero-gradient border-b border-border px-6 py-24 text-center">
        <EyebrowBadge>Start free. Pay per post when you&apos;re ready.</EyebrowBadge>
        <h1 className="mx-auto mt-6 max-w-lg text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Simple, flat, per-post pricing.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted">
          No cost per click, no retainer lock-in, no impression-based billing. Campaigns start from
          €20 per published post.
        </p>
      </section>

      <section className="border-b border-border px-6 py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          <PricingCard plan={PRICING_PLANS["self-serve"]} />
          <PricingCard plan={PRICING_PLANS.managed} />
        </div>
        <p className="mt-6 text-center text-sm text-muted-soft">
          Creator cost on both plans: from €20 per published post. Campaign spend is always
          separate from the monthly plan fee.
        </p>
      </section>

      <section className="border-b border-border bg-surface-alt px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            How billing works
          </h2>
          <ol className="mt-10 flex flex-col gap-6">
            {billingSteps.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-[15px] leading-relaxed text-muted">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Pricing FAQ
          </h2>
          <div className="mt-10">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}

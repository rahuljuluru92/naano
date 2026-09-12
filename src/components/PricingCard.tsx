import Button from "./Button";

export type PricingPlan = {
  eyebrow: string;
  title: string;
  description: string;
  price: string;
  period?: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

export default function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`flex flex-col rounded-3xl border p-8 ${
        plan.featured ? "border-ink bg-ink text-white" : "border-border bg-white text-ink"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wide ${
          plan.featured ? "text-white/60" : "text-muted-soft"
        }`}
      >
        {plan.eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-semibold">{plan.title}</h3>
      <p className={`mt-2 text-[15px] ${plan.featured ? "text-white/70" : "text-muted"}`}>
        {plan.description}
      </p>

      <div className="mt-8 flex items-baseline gap-1">
        <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
        {plan.period && (
          <span className={plan.featured ? "text-white/60" : "text-muted-soft"}>{plan.period}</span>
        )}
      </div>

      <ul className="mt-8 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[15px]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className={`mt-0.5 shrink-0 ${plan.featured ? "text-white" : "text-accent"}`}
            >
              <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12" />
              <path d="M5.5 9.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={plan.featured ? "text-white/90" : "text-muted"}>{feature}</span>
          </li>
        ))}
      </ul>

      <Button href={plan.href} variant={plan.featured ? "secondary" : "primary"} className="mt-8 w-full">
        {plan.cta}
      </Button>
    </div>
  );
}

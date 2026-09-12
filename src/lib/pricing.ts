// Single source of truth for plan/pricing data. Previously duplicated
// independently across pricing/page.tsx, llms.txt/route.ts and
// pricing.md/route.ts (and the homepage's pricing teaser had drifted to say
// "Custom" for Managed instead of the real €700/month) -- everything below
// now reads from here instead.

export type PricingPlanId = "self-serve" | "managed";

export type PricingPlan = {
  id: PricingPlanId;
  eyebrow: string;
  title: string;
  description: string;
  monthlyPriceEUR: number;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

export const PRICE_PER_POST_FROM_EUR = 20;

export const PRICING_PLANS: Record<PricingPlanId, PricingPlan> = {
  "self-serve": {
    id: "self-serve",
    eyebrow: "Self-serve",
    title: "Run it yourself.",
    description: "For teams that want the infrastructure to run creator campaigns in-house.",
    monthlyPriceEUR: 0,
    price: "€0",
    period: "/ month",
    features: [
      "Full access to 2,000+ vetted creators",
      "AI-powered brief creation",
      "Click, lead and pipeline tracking",
      "Automatic creator payouts",
      "Help center and email support",
    ],
    cta: "Start for free",
    href: "/register",
  },
  managed: {
    id: "managed",
    eyebrow: "Managed campaigns",
    title: "Get your time back.",
    description: "For teams that want Naano to operate their creator channel end to end.",
    monthlyPriceEUR: 700,
    price: "€700",
    period: "/ month",
    features: [
      "Campaign strategy and positioning",
      "Creator sourcing and coordination",
      "Brief creation and campaign launch",
      "Reporting and optimisation",
      "Dedicated Naano team",
    ],
    cta: "Book a campaign call",
    href: "/book",
    featured: true,
  },
};

export const PRICING_PLAN_LIST = Object.values(PRICING_PLANS);

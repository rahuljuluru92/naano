import { PRICING_PLANS, PRICE_PER_POST_FROM_EUR } from "@/lib/pricing";

function content() {
  const selfServe = PRICING_PLANS["self-serve"];
  const managed = PRICING_PLANS.managed;

  return `# Pricing: naano

Two plans: **${selfServe.eyebrow}** (${selfServe.price} ${selfServe.period}) and **${managed.eyebrow}** (${managed.price} ${managed.period}).
Creator campaigns cost from **€${PRICE_PER_POST_FROM_EUR} per published post** on both plans.

## ${selfServe.title} — ${selfServe.price} ${selfServe.period}
${selfServe.features.map((f) => `- ${f}.`).join("\n")}

## ${managed.title} — ${managed.price} ${managed.period}
${managed.features.map((f) => `- ${f}.`).join("\n")}

Both plans are month-to-month. Cancel anytime.
`;
}

export function GET() {
  return new Response(content(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}

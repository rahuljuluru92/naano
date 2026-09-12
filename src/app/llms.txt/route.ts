import { PRICING_PLANS, PRICE_PER_POST_FROM_EUR } from "@/lib/pricing";

function content() {
  const selfServe = PRICING_PLANS["self-serve"];
  const managed = PRICING_PLANS.managed;

  return `# naano

> naano is the B2B LinkedIn creator marketplace: companies discover and book vetted LinkedIn creators for sponsored creator campaigns. Pricing is a flat fee per post set by each creator (from €${PRICE_PER_POST_FROM_EUR} per post), with two plans: ${selfServe.eyebrow} (${selfServe.price} ${selfServe.period}) and ${managed.eyebrow}, done-for-you (${managed.price} ${managed.period}).

## Key resources

- Homepage: /
- Pricing: /pricing
- About: /about
- For creators: /creators
- For agencies: /agencies
`;
}

export function GET() {
  return new Response(content(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

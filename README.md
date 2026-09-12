# naano.com clone — 8x Software Engineer application

A pixel-close clone of [naano.com](https://naano.com) (the B2B LinkedIn creator
marketplace), built as prep for the 8x "Clone naano.com" take-home brief.

Why this reference: 8x's own "8x Business" product is described on
[8x.careers](https://8x.careers) in near-identical terms to naano's pitch — a
B2B creator marketplace where brands brief vetted LinkedIn creators and track
impressions through to closed deals. This clone doubles as domain prep.

See [`PLAN.md`](./PLAN.md) for the execution plan and
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the extracted design tokens.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4 (CSS-based theme, see `src/app/globals.css`)
- No backend — static/presentational clone, forms are visual-only

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

```
src/
  app/
    page.tsx            Home ("for companies")
    creators/page.tsx   For creators
    agencies/page.tsx   For agencies
    about/page.tsx      About / founders / stats
    pricing/page.tsx    Pricing
    register, login, book, help, privacy, terms, blog  (stub pages)
    llms.txt, pricing.md  route handlers (machine-readable pages, like the original)
  components/
    Nav, Footer, Logo, Button, Badge
    FAQAccordion, StatGrid, TestimonialCard, PricingCard
    LinkedInPostCard, CreatorMarketplaceMock, StepSection, StepMocks
```

All copy was pulled directly from the live site (including `naano.com/llms.txt`
and `naano.com/pricing.md`, which naano publishes as structured reference
pages) so the content is accurate, not paraphrased from memory.

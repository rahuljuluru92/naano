# naano.com clone: 

A pixel-close clone of [naano.com](https://naano.com) (the B2B LinkedIn creator
marketplace), built as prep for the 8x "Clone naano.com" take-home brief.

Why this reference: 8x's own "8x Business" product is described on
[8x.careers](https://8x.careers) in near-identical terms to naano's pitch: a
B2B creator marketplace where brands brief vetted LinkedIn creators and track
impressions through to closed deals. This clone doubles as domain prep.

See [`PLAN.md`](./PLAN.md) for the execution plan and
[`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) for the extracted design tokens.

## Testing instructions

This is a real full-stack app (Next.js + Supabase Postgres/Auth), so sign in
and click around rather than reading the code.

**Works right away, no setup needed:**

| Role | Email | Password |
|---|---|---|
| Brand | `brand.demo@naano-clone.test` | `TestPassword123!` |
| Creator | `creator.demo@naano-clone.test` | `TestPassword123!` |

**Richer demo data with every pipeline stage represented:** run the command
below once, then sign in with any of the five accounts underneath it. All
five share the password `SeedDemo123!`.

```bash
node --env-file=.env.local scripts/seed-demo.mjs
```

| Role | Email | What you'll see |
|---|---|---|
| Brand | `brand.northwind@naano-demo.test` | 2 active campaigns: one invite still pending, one submission awaiting your approval |
| Brand | `brand.ledgerly@naano-demo.test` | A creator mid-collaboration, plus one booking already **paid** |
| Creator | `priya.sharma@naano-demo.test` | A submitted post awaiting the brand's approval |
| Creator | `yuki.tanaka@naano-demo.test` | An approved booking with a payout marked pending |
| Creator | `marcus.chen@naano-demo.test` | A fully closed loop: invited → accepted → submitted → approved → paid |

These five were created pre-confirmed via the Supabase admin API (see
[`scripts/seed-demo.mjs`](./scripts/seed-demo.mjs)), so they skip email
confirmation entirely, which also means they bypass the rate limit
Supabase's own default/shared email sender imposes on new signups. That
limit is a real constraint of the project's free-tier mailer, not a bug in
this app; registering a brand-new account will still work, it may just be
delayed if that limit has been hit recently.

## Trade-offs

Knowing what to leave out mattered as much as what got built.

- **Phase 6 (an admin dashboard) was dropped entirely**, not trimmed. In a
  24-hour budget it competed directly with polish and actually deploying,
  and a cross-account admin console nobody but the candidate would ever
  click into is a worse use of that time than a product that works cleanly
  end-to-end. Cut on purpose, documented as cut, not quietly skipped.
- **Avatar/logo uploads are a pasted image URL**, not a real Supabase
  Storage upload. Creators and brands without one get a deterministic
  initials/color-block avatar (`InitialsAvatar.tsx`) instead. Real Storage
  uploads (signed URLs, bucket policies, CORS config) were in the original
  plan, but for a field that's cosmetic either way, that setup cost wasn't
  worth paying, so it was scoped out upfront rather than something the
  build ran into and worked around mid-flight.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript
- Tailwind CSS v4 (CSS-based theme, see `src/app/globals.css`)
- Supabase (Postgres + Auth): real signup/login, campaigns, bookings, and a
  matching algorithm, see Testing instructions above

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

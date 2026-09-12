# Execution plan — naano.com clone for 8x

## Why naano.com, and why this matters

8x's "8x Business" vertical (per [8x.careers](https://8x.careers)) is
described as: *"A B2B creator marketplace. Brands brief vetted LinkedIn
creators and follow the work from impressions through to closed deals."*
That is naano's own pitch, near word-for-word. This clone isn't just a UI
exercise — it's rebuilding the actual product category 8x hires for. Treat
the build itself as interview prep: by the end you should be able to talk
fluently about creator marketplaces, two-sided matching, attribution, and
per-post payout flows.

## Status: what's already done (pre-work, before the clock starts)

Everything below was built and verified (`npm run build` passes clean, all
routes render correctly in-browser) *before* starting the timed brief, so it
doesn't cost any of your 24 hours:

- [x] Next.js 16 + TypeScript + Tailwind v4 scaffold, clean build, no lint errors
- [x] Design tokens matching naano's real computed styles (`DESIGN_SYSTEM.md`)
- [x] Shared components: Nav (incl. mobile menu), Footer, Button, Badge,
      FAQAccordion, StatGrid, TestimonialCard, PricingCard, LinkedInPostCard,
      CreatorMarketplaceMock, StepSection + 5 step mockups
- [x] Full pages with real copy: Home, Creators, Agencies, About, Pricing
- [x] Stub pages so no link 404s: Register, Login, Book, Help, Privacy, Terms, Blog
- [x] `/llms.txt` and `/pricing.md` route handlers (matches naano's own
      AI-agent-readable pages — a nice detail almost no other candidate will think of)

**This means when you press Start, you are not starting from zero.** Your 24
hours go entirely into polish, fidelity, and anything extra that shows
initiative — not scaffolding.

## Before you press Start

1. Skim `DESIGN_SYSTEM.md` and re-open naano.com once more so the layout is
   fresh in your head.
2. Re-run `npm run dev` and click through every page in this repo end to end,
   side-by-side with naano.com in another tab, so you know exactly what's
   already solid vs. rough.
3. Decide your submission format now (repo link? Vercel deploy? zip?) — don't
   discover the submission mechanism with 20 minutes left on the clock.
4. `git commit` the current state as your baseline (a repo already exists at
   `git log` → "Initial commit from Create Next App"; the naano rebuild is
   currently uncommitted). Commit it as "Pre-brief scaffold" so your timed
   work is a clean diff on top — evidence-first hiring means your commit
   history *is* part of the evidence.

## Hour-by-hour plan for the 1-day window

**Hours 0–1: Re-baseline against the live site**
Open naano.com and this clone side by side. Note every visual gap (spacing,
font weight, exact colors, the floating AI search bar, scroll-triggered
animations on the step sections). Write a punch list. Don't start fixing yet
— see the whole gap first.

**Hours 1–4: Fidelity pass on Home**
Home is the page they'll judge first. Go section by section:
hero → testimonial → marketplace grid → 5 numbered steps → LinkedIn post
cards → stats → pricing teaser → FAQ → final CTA. Match spacing, font sizes,
and motion (scroll-reveal / fade-in on the step sections is naano's most
distinctive interaction — worth adding with a simple `IntersectionObserver`
or a tiny library).

**Hours 4–6: Fidelity pass on secondary pages**
Creators, Agencies, About, Pricing. These reuse Home's components, so this
should be much faster than Home was — that's the payoff of the shared
component library already in place.

**Hours 6–7: Responsive pass**
Test mobile (375px), tablet (768px), desktop (1440px) for every page. The
mobile nav menu and the creator-marketplace grid are the highest-risk
components for breakage — check them first.

**Hours 7–8: One deliberate "own a full product" touch**
The job posting says "own a full product end to end, not a ticket queue."
Pick ONE functional (not just visual) addition that shows product thinking,
e.g.:
- A working FAQ search/filter
- The register form actually validating input client-side
- A functioning "matching score" sort/filter on the marketplace mock
Don't do more than one — depth on one real feature beats five shallow ones.

**Hours 8–9: Copy and micro-detail QA**
Read every line of text against the live site. Check apostrophes/quotes
render correctly, currency symbols, pluralization, alt text on any images
you add. This is where "none of it slop" is won or lost.

**Hours 9–10: Deploy + final check**
Deploy (Vercel is fastest for Next.js). Click every link in production, not
just localhost — broken links in a submitted link are an instant red flag.

**Remaining time: buffer**
Something will take longer than planned. This buffer is intentional — resist
the urge to fill it with new scope.

## Stretch goals (only if core pages are 100% solid)

- Floating "What can I help you find?" search bar (cosmetic is fine, doesn't
  need real search)
- Scroll-triggered fade/slide animations on the numbered step sections
  (naano's actual pattern)
- A couple of the long-tail SEO/blog pages, to show you understood the whole
  site architecture, not just the marketing pages
- Dark-mode toggle — naano itself doesn't have one, so this is a legitimate
  "I improved on the original" talking point in an interview

## Submission checklist

- [ ] Every nav link and footer link resolves (no 404s)
- [ ] `npm run build` passes with zero errors/warnings
- [ ] Tested at mobile + desktop widths
- [ ] Deployed URL works in an incognito window (no localhost-only state)
- [ ] README explains what you built and, ideally, the 8x/naano connection —
      showing you understood *why* this brief exists, not just *what* to copy

# Design system — extracted from naano.com

Values pulled via computed-style inspection of the live site (Sept 2026).
Wired into `src/app/globals.css` as Tailwind v4 `@theme` tokens, usable as
`bg-ink`, `text-muted`, `border-border`, etc.

## Color

| Token | Value | Use |
|---|---|---|
| `background` | `#FCFCFB` | page background |
| `surface` | `#FFFFFF` | cards |
| `surface-alt` | `#F8F8F6` | alternating section background |
| `ink` | `#17181C` | headings, primary button bg, body copy on dark |
| `muted` | `#43454C` | body paragraph text |
| `muted-soft` | `#75777F` | captions, stat labels, timestamps |
| `border` | `#E8E8E4` | hairline dividers |
| `border-strong` | `#DCDCD7` | button/card outlines |
| `sky` | `#D0EDFB` | hero/CTA radial gradient blue |
| `accent` | `#3B63F2` | links, highlighted words, progress bars, badges |
| `accent-soft` | `#EAF0FF` | accent chip backgrounds, avatar placeholders |

Hero/CTA background is a radial gradient (`sky` at ~35% opacity, centered
~50%/30%, fading by 55%) layered over a vertical `background → surface-alt`
gradient. Implemented as `.hero-gradient` in globals.css.

## Typography

- Font: **Inter** (naano uses "Inter LP", a licensed build of Inter — regular
  Inter via `next/font/google` is visually equivalent).
- Body: 400 weight, 17px, `muted` color, line-height relaxed.
- Headings: 600 weight, tight tracking. Hero h1 scales from ~36px (mobile) to
  ~60–64px (desktop).
- All caps eyebrow labels: 12–13px, 600 weight, letter-spacing wide, `muted-soft`.

## Shape & elevation

- Buttons and badges: fully pill-shaped, `border-radius: 999px`.
- Cards: large radius, `rounded-2xl`/`rounded-3xl` (16–24px).
- Shadows are soft and rare — naano leans on 1px `border` hairlines over
  drop shadows. Reserve shadow for floating/mockup cards only
  (`shadow-[0_20px_60px_-25px_rgba(23,24,28,0.25)]`-style, very diffuse).

## Layout rhythm

- Max content width: `max-w-6xl` (nav/footer/wide grids), `max-w-4xl` /
  `max-w-2xl` for text-centered sections.
- Section vertical padding: `py-24` (96px) desktop, sections separated by a
  single `border-b border-border` hairline — no heavy dividers.
- Alternate `background` and `surface-alt` section backgrounds to create
  rhythm without borders/shadows doing all the work.

## Recurring components (see `src/components/`)

- **Eyebrow badge** — pill, white bg, border, small accent dot + uppercase label.
- **Numbered step section** (`StepSection.tsx`) — light-blue gradient band,
  circular number badge, centered white mockup card, bold headline below.
- **Creator marketplace mock** — browser-chrome address bar + grid of creator
  cards (avatar, vertical tag, country flag, matching-score bar, 3-stat row).
- **LinkedIn post card** — avatar, name + LinkedIn badge, role, hook line,
  3-stat row (impressions/clicks/leads), "View post →" link.
- **FAQ accordion** — first item open by default, chevron rotates 180° on open,
  hairline dividers, no card backgrounds.
- **Pricing card pair** — one neutral (white/bordered) card + one inverted
  (`ink` background, white text) "featured" card for the higher tier.

## What's intentionally *not* copied

- naano's exact vector logo mark and any photography/headshots — replaced
  with an original abstract mark (`Logo.tsx`) and initials/color-block
  avatars, since those are the parts worth originating rather than tracing.
- The floating "What can I help you find?" AI search bar — noted as a
  stretch feature, not core to demonstrating product/engineering ability in
  a 1-day window. Worth adding *after* the core pages are solid if time
  allows (see PLAN.md).

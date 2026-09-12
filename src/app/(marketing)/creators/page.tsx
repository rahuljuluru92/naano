import type { Metadata } from "next";
import { EyebrowBadge } from "@/components/Badge";
import Button from "@/components/Button";
import StatGrid from "@/components/StatGrid";
import TestimonialCard from "@/components/TestimonialCard";
import FAQAccordion from "@/components/FAQAccordion";
import LinkedInPostCard from "@/components/LinkedInPostCard";

export const metadata: Metadata = {
  title: "Get paid for your LinkedIn content: naano for creators",
  description: "Choose deals from B2B brands you know, post in your own voice, get paid within 24h.",
};

const perks = [
  { title: "Centralized opportunities", desc: "Discover brand deals that match your audience." },
  { title: "Payments built-in", desc: "Get paid on time with secure, transparent payouts." },
  { title: "Track performance", desc: "See views, clicks and engagement in real time." },
  { title: "Easy delivery", desc: "Manage deals and deliver content with ease." },
];

const posts = [
  {
    name: "Thomas Higadère",
    role: "Creator · B2B & AI · 34K followers",
    hook: "How AI changed our prospecting workflow for wealth managers and private bankers.",
    impressions: "42.8K",
    clicks: "312",
    leads: "18",
    brand: "Naano",
  },
  {
    name: "Robin Tempe",
    role: "Creator · Sales & AI · 12K followers",
    hook: "I run my entire prospecting workflow through an AI. Here is how.",
    impressions: "9K",
    clicks: "100",
    leads: "50",
    brand: "Naano",
  },
];

const reviews = [
  {
    quote:
      "Naano is the marketplace LinkedIn was missing. The founders truly listen and do everything they can to build something that brings real value to its users.",
    name: "Raphael Alfero",
    role: "B2B creator · 18K followers",
  },
  {
    quote:
      "At first I wasn't sure what to expect. But the whole experience was simple and smooth: clear opportunities, an easy platform, everything well guided.",
    name: "Aya Dara",
    role: "Content creator · 9K followers",
  },
  {
    quote:
      "Excellent experience. The platform is simple and efficient, the team ultra-responsive, and results come fast.",
    name: "Robin Tempe",
    role: "Sales creator · 14K followers",
  },
];

const faqs = [
  {
    question: "Is Naano free for creators?",
    answer: "Yes, joining and using Naano is completely free. You keep 100% of what you earn.",
  },
  {
    question: "How much can I earn?",
    answer: "Creators earn €500 on average per deal, up to €1,500 for top-tier posts in scarce verticals.",
  },
  {
    question: "How and when do I get paid?",
    answer: "You're paid within 24 hours of your post going live, directly to your account via Stripe Connect.",
  },
  {
    question: "Do I have to sign an exclusivity contract?",
    answer: "No. There's no exclusivity — you can work with other platforms and brands freely.",
  },
  {
    question: "Do I keep control of my content?",
    answer: "Yes, you write and publish in your own voice. Brands brief the objective, not the wording.",
  },
];

export default function CreatorsPage() {
  return (
    <>
      <section className="hero-gradient border-b border-border px-6 py-24 text-center">
        <EyebrowBadge>2,000+ creators paid · 4.8/5 rating</EyebrowBadge>
        <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Get paid to post on LinkedIn.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted">
          Choose deals from B2B brands you know, post in your own voice, and get paid within 24h.
          No negotiating, no admin. Creators earn €500 on average per deal.
        </p>
        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button href="/register" arrow>
            Start earning
          </Button>
          <Button href="#how-it-works" variant="ghost">
            See how it works →
          </Button>
        </div>
        <p className="mt-5 text-sm text-muted-soft">Free to join · No exclusivity · Paid within 24h</p>
      </section>

      <section id="how-it-works" className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <EyebrowBadge>The platform</EyebrowBadge>
          <h2 className="mx-auto mt-6 max-w-lg text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            For creators who don&apos;t want the administrative burden.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            Find deals, get paid, and track your performance from one dashboard. No invoicing, no
            chasing, no spreadsheets.
          </p>
        </div>
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          {perks.map((perk) => (
            <div key={perk.title} className="rounded-2xl border border-border bg-white p-6">
              <p className="font-semibold text-ink">{perk.title}</p>
              <p className="mt-2 text-sm text-muted">{perk.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border bg-surface-alt px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">The results</h2>
          <div className="mt-14">
            <StatGrid
              stats={[
                { value: "2,000+", label: "Creators earning" },
                { value: "€500", label: "Avg. per deal" },
                { value: "5K+", label: "Posts published" },
                { value: "24h", label: "Avg. payout time" },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Real posts from real creators.
          </h2>
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <LinkedInPostCard key={post.name} post={post} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-alt px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <EyebrowBadge>From the community</EyebrowBadge>
            <h2 className="mx-auto mt-6 max-w-lg text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              What creators say.
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {reviews.map((r) => (
              <TestimonialCard key={r.name} {...r} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Frequently asked questions.
          </h2>
          <div className="mt-12">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="hero-gradient px-6 py-24 text-center">
        <EyebrowBadge>Ready to earn?</EyebrowBadge>
        <h2 className="mx-auto mt-6 max-w-lg text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          You&apos;ve seen how it works. Now get paid for it.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Join 2,000+ creators already getting paid to post on LinkedIn. It&apos;s free, and you
          keep 100% of what you earn.
        </p>
        <div className="mt-9 flex justify-center">
          <Button href="/register" arrow>
            Apply now
          </Button>
        </div>
      </section>
    </>
  );
}

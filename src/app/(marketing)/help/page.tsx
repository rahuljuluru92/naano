import Link from "next/link";

export default function HelpPage() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">Help center</h1>
        <p className="mt-6 text-[15px] leading-relaxed text-muted">
          Have a question about launching a campaign, creator payouts, or your plan? Reach us at{" "}
          <a href="mailto:info@naano.com" className="text-accent">
            info@naano.com
          </a>
          , or check the{" "}
          <Link href="/#faq" className="text-accent">
            FAQ
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

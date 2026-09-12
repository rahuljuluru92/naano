const posts = [
  { title: "What is creator-led growth for B2B?", slug: "creator-led-growth-b2b" },
  { title: "What is a B2B creator marketplace?", slug: "what-is-a-b2b-creator-marketplace" },
  { title: "How much does B2B influencer marketing cost in 2026?", slug: "b2b-influencer-marketing-cost" },
  { title: "How to launch a B2B LinkedIn creator campaign in 30 days", slug: "launch-b2b-linkedin-creator-campaign" },
  { title: "LinkedIn Sponsored Post Price Index 2026", slug: "linkedin-sponsored-post-price-index-2026" },
];

export default function BlogPage() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Naano blog.
        </h1>
        <p className="mt-4 text-muted">Playbooks and benchmarks for B2B creator-led growth.</p>
        <div className="mt-12 flex flex-col divide-y divide-border border-t border-border">
          {posts.map((post) => (
            <article key={post.slug} className="py-6">
              <p className="text-lg font-medium text-ink">{post.title}</p>
              <p className="mt-1 text-sm text-muted-soft">naano.com/blog/{post.slug}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const creators = [
  { name: "Aymane Junior", tag: "AI · SaaS", country: "🇩🇪", followers: "14.1K", views: "18.7K", price: "€360", fit: 97 },
  { name: "Emma Guetta", tag: "AI · Media", country: "🇫🇷", followers: "7.8K", views: "25.6K", price: "€480", fit: 96 },
  { name: "Augustin Rudigoz", tag: "Productivity · Fintech", country: "🇫🇷", followers: "14K", views: "11.2K", price: "€960", fit: 92 },
  { name: "Raghav Jerath", tag: "Growth · GTM", country: "🇫🇷", followers: "2.4K", views: "2.1K", price: "€84", fit: 90 },
  { name: "Daniel Meisen", tag: "Growth · Agencies", country: "🇩🇪", followers: "5.9K", views: "2.8K", price: "€120", fit: 89 },
  { name: "Pierre Davadan", tag: "SaaS · AI", country: "🇫🇷", followers: "4.2K", views: "2.2K", price: "€84", fit: 89 },
];

export default function CreatorMarketplaceMock() {
  return (
    <div className="rounded-[28px] border border-border bg-white p-3 shadow-[0_20px_60px_-25px_rgba(23,24,28,0.25)] sm:p-4">
      <div className="mb-4 flex items-center gap-2 rounded-full border border-border bg-surface-alt px-4 py-2">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-soft">
          <rect x="2.5" y="5" width="7" height="5.5" rx="1" stroke="currentColor" strokeWidth="1" />
          <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="text-xs text-muted-soft">naano.co/marketplace</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {creators.map((c, i) => (
          <div key={c.name} className="rounded-2xl border border-border bg-surface-alt/60 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-muted-soft">#{i + 1}</span>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-ink shadow-sm">
                Book
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {c.name[0]}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{c.name}</p>
                <p className="truncate text-[11px] text-muted-soft">
                  {c.tag} · {c.country}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between text-[10px] text-muted-soft">
                <span>Matching</span>
                <span className="font-semibold text-ink">{c.fit}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-border">
                <div className="h-1.5 rounded-full bg-accent" style={{ width: `${c.fit}%` }} />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1 text-center">
              <div>
                <p className="text-[11px] font-semibold text-ink">{c.followers}</p>
                <p className="text-[9px] text-muted-soft">Followers</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-ink">{c.views}</p>
                <p className="text-[9px] text-muted-soft">Median views</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-ink">{c.price}</p>
                <p className="text-[9px] text-muted-soft">Post cost</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

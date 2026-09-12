export type LinkedInPost = {
  name: string;
  role: string;
  hook: string;
  impressions: string;
  clicks: string;
  leads: string;
  brand: string;
};

export default function LinkedInPostCard({ post }: { post: LinkedInPost }) {
  const initials = post.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="w-full max-w-sm shrink-0 rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
          {initials}
        </div>
        <div>
          <p className="flex items-center gap-1.5 text-[15px] font-semibold text-ink">
            {post.name}
            <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-[#0A66C2] text-[9px] font-bold text-white">
              in
            </span>
          </p>
          <p className="text-xs text-muted-soft">{post.role}</p>
        </div>
      </div>

      <p className="mt-4 text-[15px] leading-snug text-ink">{post.hook}</p>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border bg-surface-alt px-4 py-3 text-center">
        <div>
          <p className="text-sm font-semibold text-ink">{post.impressions}</p>
          <p className="text-[11px] text-muted-soft">Impressions</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{post.clicks}</p>
          <p className="text-[11px] text-muted-soft">Clicks</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{post.leads}</p>
          <p className="text-[11px] text-muted-soft">Leads</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-muted-soft">For {post.brand}</span>
        <span className="font-medium text-accent">View post →</span>
      </div>
    </div>
  );
}

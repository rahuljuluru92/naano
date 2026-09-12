function MockShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-5 shadow-[0_20px_50px_-25px_rgba(23,24,28,0.3)]">
      {children}
    </div>
  );
}

export function FitListMock() {
  const rows = [
    { name: "Eric", fit: 92 },
    { name: "Robin", fit: 88 },
    { name: "Aya", fit: 84 },
  ];
  return (
    <MockShell>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-3 rounded-xl border border-border bg-surface-alt/60 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
              {r.name[0]}
            </div>
            <p className="flex-1 text-sm font-medium text-ink">{r.name}</p>
            <div className="text-right">
              <p className="text-[10px] text-muted-soft">Fit</p>
              <p className="text-sm font-semibold text-ink">{r.fit}%</p>
            </div>
          </div>
        ))}
      </div>
    </MockShell>
  );
}

export function BriefBuilderMock() {
  const items = ["Objectives and key messages", "Creator guidelines", "Tracking links ready"];
  return (
    <MockShell>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Campaign brief</p>
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent">AI</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-2.5 text-sm text-muted">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-accent">
              <circle cx="8" cy="8" r="8" fill="currentColor" opacity="0.12" />
              <path d="M5 8.2l2 2 3.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {item}
          </div>
        ))}
      </div>
    </MockShell>
  );
}

export function CollaborationsMock() {
  const rows = [
    { name: "Raphael", status: "Draft ready", tone: "bg-surface-alt text-muted" },
    { name: "Thomas", status: "Scheduled", tone: "bg-accent-soft text-accent" },
    { name: "Nada", status: "Live", tone: "bg-[#E4F6EA] text-[#1E8A4C]" },
  ];
  return (
    <MockShell>
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between rounded-xl border border-border p-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                {r.name[0]}
              </div>
              <p className="text-sm font-medium text-ink">{r.name}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.tone}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </MockShell>
  );
}

export function PipelineMock() {
  return (
    <MockShell>
      <p className="text-sm text-muted-soft">Attributed pipeline</p>
      <div className="mt-1 flex items-baseline gap-2">
        <p className="text-3xl font-semibold text-ink">€48.2K</p>
        <span className="text-sm font-semibold text-[#1E8A4C]">+24%</span>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-surface-alt/60 p-3">
          <p className="text-lg font-semibold text-ink">124K</p>
          <p className="text-xs text-muted-soft">Views</p>
        </div>
        <div className="rounded-xl border border-border bg-surface-alt/60 p-3">
          <p className="text-lg font-semibold text-ink">418</p>
          <p className="text-xs text-muted-soft">Leads</p>
        </div>
      </div>
    </MockShell>
  );
}

export function PaymentMock() {
  return (
    <MockShell>
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5l3 3 7-7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Payment scheduled</p>
          <p className="text-xs text-muted-soft">Handled by naano</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-surface-alt/60 px-4 py-3">
        <span className="text-sm text-muted-soft">Creator payout</span>
        <span className="text-base font-semibold text-ink">€1,240</span>
      </div>
      <div className="mt-3 flex gap-2">
        {["Contract", "Invoice", "Payout"].map((t) => (
          <span key={t} className="rounded-full bg-surface-alt px-2.5 py-1 text-[11px] font-medium text-muted-soft">
            {t}
          </span>
        ))}
      </div>
    </MockShell>
  );
}

import type { ReactNode } from "react";

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm">
      {children}
    </span>
  );
}

export function EyebrowBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

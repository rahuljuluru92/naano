import Link from "next/link";

export default function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-soft transition-colors hover:text-ink"
    >
      ← {label}
    </Link>
  );
}

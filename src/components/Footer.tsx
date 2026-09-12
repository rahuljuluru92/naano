import Link from "next/link";
import Logo from "./Logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQs", href: "/#faq" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms of Sale & Use", href: "/terms" },
    ],
  },
  {
    title: "For AI agents",
    links: [
      { label: "llms.txt", href: "/llms.txt" },
      { label: "pricing.md", href: "/pricing.md" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="hero-gradient border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-14">
          <Logo className="mb-4" />
          <p className="max-w-sm text-[15px] text-muted">
            Turn LinkedIn creators into your best acquisition channel.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-soft">
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[15px] text-muted hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-sm text-muted-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} naano. All rights reserved.</p>
          <p>Trustpilot reviews</p>
        </div>
      </div>
    </footer>
  );
}

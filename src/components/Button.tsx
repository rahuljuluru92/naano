import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  arrow?: boolean;
  className?: string;
};

const variants = {
  primary: "bg-ink text-white hover:bg-ink/90",
  secondary: "bg-white text-ink border border-border-strong hover:bg-surface-alt",
  ghost: "text-ink hover:opacity-70",
};

export default function Button({
  href,
  children,
  variant = "primary",
  arrow = false,
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
      {arrow && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.5 8h9m0 0L8.5 4m4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Link>
  );
}

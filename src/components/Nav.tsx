"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { logOutAction } from "@/actions/auth";
import { roleHomePath } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/validation/auth";

const links = [
  { href: "/", label: "For companies" },
  { href: "/creators", label: "For creators" },
  { href: "/agencies", label: "For agencies" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

const ROLE_LABEL: Record<UserRole, string> = {
  brand: "Go to dashboard",
  creator: "Go to creator hub",
  admin: "Go to admin",
};

export default function Nav({ role = null }: { role?: UserRole | null }) {
  const [open, setOpen] = useState(false);

  const authControls = role ? (
    <>
      <Link
        href={roleHomePath(role)}
        className="rounded-full border border-border-strong bg-white px-5 py-2.5 text-center text-[15px] font-semibold text-ink hover:bg-surface-alt"
      >
        {ROLE_LABEL[role]}
      </Link>
      <form action={logOutAction}>
        <button
          type="submit"
          className="w-full rounded-full bg-ink px-5 py-2.5 text-center text-[15px] font-semibold text-white hover:bg-ink/90"
        >
          Sign out
        </button>
      </form>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="rounded-full border border-border-strong bg-white px-5 py-2.5 text-center text-[15px] font-semibold text-ink hover:bg-surface-alt"
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-ink px-5 py-2.5 text-center text-[15px] font-semibold text-white hover:bg-ink/90"
      >
        Sign up
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">{authControls}</div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-white lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 5h14M2 9h14M2 13h14" stroke="#17181C" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-[15px] font-medium text-muted hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3">{authControls}</div>
          </nav>
        </div>
      )}
    </header>
  );
}

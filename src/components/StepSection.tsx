import type { ReactNode } from "react";

export default function StepSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="py-6">
      <div className="hero-gradient flex flex-col items-center rounded-[32px] border border-border/60 px-6 py-14 sm:py-16">
        <span className="mb-8 flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-white text-sm font-semibold text-muted-soft">
          {number}
        </span>
        {children}
      </div>
      <p className="mt-8 text-center text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        {title}
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import { EyebrowBadge } from "@/components/Badge";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "naano for agencies — Brand and creator operations",
  description: "Choose the workspace that matches your agency: brand operations or creator management.",
};

const options = [
  {
    number: "01",
    title: "Brand agency",
    subtitle: "I manage campaigns for companies",
    desc: "Operate separate client workspaces, budgets, campaigns and reporting from one portfolio.",
    features: ["Create one workspace per client", "Add and allocate client budgets", "Track campaigns and next actions"],
    cta: "Create a brand agency workspace",
    note: "You will create the agency manager account first.",
  },
  {
    number: "02",
    title: "Creator agency",
    subtitle: "I represent and manage creators",
    desc: "Import your roster, manage every profile and run collaborations without creator logins.",
    features: ["Import any creator roster CSV", "Manage rates and creator profiles", "Track collaborations and earnings"],
    cta: "Create a creator agency workspace",
    note: "Your creators do not need individual Naano accounts.",
  },
];

export default function AgenciesPage() {
  return (
    <>
      <section className="hero-gradient border-b border-border px-6 py-24 text-center">
        <EyebrowBadge>Naano for agencies</EyebrowBadge>
        <h1 className="mx-auto mt-6 max-w-xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Choose the workspace that matches your agency.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted">
          Naano separates brand operations from creator management. Choose your setup and create
          the right workspace for your agency.
        </p>
      </section>

      <section className="border-b border-border px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted-soft">
            Two distinct products
          </p>
          <h2 className="mt-4 text-center text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            What does your agency manage?
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {options.map((opt) => (
              <div key={opt.number} className="flex flex-col rounded-3xl border border-border bg-white p-8">
                <span className="text-xs font-semibold text-muted-soft">{opt.number}</span>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">
                  {opt.title}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-ink">{opt.subtitle}</h3>
                <p className="mt-3 text-[15px] text-muted">{opt.desc}</p>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {opt.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[15px] text-muted">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 shrink-0 text-accent">
                        <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.12" />
                        <path d="M5.5 9.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button href="/register" className="mt-8 w-full">
                  {opt.cta}
                </Button>
                <p className="mt-3 text-center text-xs text-muted-soft">{opt.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hero-gradient px-6 py-24 text-center">
        <EyebrowBadge>Talk to naano</EyebrowBadge>
        <h2 className="mx-auto mt-6 max-w-md text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Not sure which workspace fits your agency?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Book a 30-minute agency call. We&apos;ll look at how you manage clients or creators and
          point you to the right setup.
        </p>
        <div className="mt-9 flex justify-center">
          <Button href="/book" arrow>
            Book a call
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-soft">30 minutes with the naano team. No commitment.</p>
      </section>
    </>
  );
}

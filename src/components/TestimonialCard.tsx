export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

export function BigTestimonial({ quote, name, role, highlight }: Testimonial & { highlight?: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-3xl font-medium leading-tight text-ink sm:text-4xl">
        &ldquo;
        {highlight
          ? quote.split(highlight).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-accent">{highlight}</span>}
              </span>
            ))
          : quote}
        &rdquo;
      </p>
      <div className="mt-8 flex flex-col items-center">
        <p className="font-semibold text-ink">{name}</p>
        <p className="text-sm text-muted-soft">{role}</p>
      </div>
    </div>
  );
}

export default function TestimonialCard({ quote, name, role }: Testimonial) {
  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <p className="text-[15px] leading-relaxed text-ink">&ldquo;{quote}&rdquo;</p>
      <div className="mt-5">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="text-sm text-muted-soft">{role}</p>
      </div>
    </div>
  );
}

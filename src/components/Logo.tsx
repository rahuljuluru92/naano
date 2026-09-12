export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold text-xl tracking-tight text-ink ${className}`}>
      <svg width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
        <path
          d="M2 6c0-2.2 1.8-4 4-4h6c2.2 0 4 1.8 4 4s-1.8 4-4 4H8c-2.2 0-4 1.8-4 4v2c0 2.2 1.8 4 4 4h6c2.2 0 4-1.8 4-4"
          stroke="#17181C"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="24" cy="20" r="2.4" fill="#3B63F2" />
      </svg>
      naano
    </span>
  );
}

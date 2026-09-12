export type Stat = { value: string; label: string };

export default function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center sm:text-left">
          <p className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{stat.value}</p>
          <p className="mt-1 text-sm text-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

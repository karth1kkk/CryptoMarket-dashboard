export function TableSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-800/90 bg-slate-950/20"
      role="status"
      aria-label="Loading market data"
    >
      <div className="h-10 border-b border-slate-800 bg-slate-900/50" />
      <ul className="divide-y divide-slate-800/80" aria-hidden>
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i} className="h-[52px] animate-pulse bg-slate-800/20 px-4">
            <div className="flex h-full items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-slate-800" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 rounded bg-slate-800" />
                <div className="h-2.5 w-12 rounded bg-slate-800/60" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

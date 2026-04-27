export function TableSkeleton() {
  return (
    <div
      className="overflow-hidden"
      role="status"
      aria-label="Loading market data"
    >
      <div className="h-9 border-b border-slate-200/90 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900/50" />
      <ul
        className="divide-y divide-slate-100 dark:divide-slate-800/80"
        aria-hidden
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <li
            key={i}
            className="h-[50px] animate-pulse bg-slate-50/80 px-4 dark:bg-slate-800/20"
          >
            <div className="flex h-full items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-2.5 w-12 rounded bg-slate-100 dark:bg-slate-800" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

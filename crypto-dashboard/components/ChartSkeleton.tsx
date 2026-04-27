export function ChartSkeleton() {
  return (
    <div
      className="h-[300px] w-full animate-pulse rounded-md bg-slate-100/90 dark:bg-slate-800/30"
      role="status"
      aria-label="Loading chart"
    />
  );
}

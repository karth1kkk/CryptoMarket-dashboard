export function ChartSkeleton() {
  return (
    <div
      className="h-[300px] w-full animate-pulse rounded-md bg-slate-800/30"
      role="status"
      aria-label="Loading chart"
    />
  );
}

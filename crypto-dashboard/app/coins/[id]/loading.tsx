import { Card, CardBody, CardHeader } from "@/components/Card";
import { ChartSkeleton } from "@/components/ChartSkeleton";

export default function CoinLoading() {
  return (
    <div className="max-w-4xl">
      <div className="mb-4 h-4 w-28 animate-pulse rounded bg-slate-800" />
      <div className="mb-5 flex items-center gap-2">
        <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-slate-800" />
        <div className="h-7 w-40 animate-pulse rounded bg-slate-800" />
      </div>
      <div className="mb-2 h-8 w-48 animate-pulse rounded bg-slate-800" />
      <div className="mb-4 h-3 w-24 animate-pulse rounded bg-slate-800/60" />
      <Card>
        <CardHeader>Price</CardHeader>
        <CardBody>
          <ChartSkeleton />
        </CardBody>
      </Card>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-md bg-slate-800/30"
          />
        ))}
      </div>
    </div>
  );
}

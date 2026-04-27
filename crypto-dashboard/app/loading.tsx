import { TableSkeleton } from "@/components/TableSkeleton";
import { Card, CardHeader } from "@/components/Card";

export default function Loading() {
  return (
    <div className="max-w-6xl">
      <div className="mb-4 md:mb-5">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-800" />
        <div className="mt-2 h-3 w-56 animate-pulse rounded bg-slate-800/60" />
      </div>
      <Card>
        <CardHeader>Spot markets</CardHeader>
        <div className="p-0 md:p-1">
          <TableSkeleton />
        </div>
      </Card>
    </div>
  );
}

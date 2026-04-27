import { TableSkeleton } from "@/components/TableSkeleton";
import { Card, CardHeader } from "@/components/Card";

export default function Loading() {
  return (
    <div className="max-w-[1600px]">
      <div className="mb-2 h-8 w-full animate-pulse rounded bg-slate-200/80 dark:bg-slate-800/60" />
      <div className="mb-4 grid gap-3 md:grid-cols-12">
        <div className="h-36 animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800/50 md:col-span-4" />
        <div className="grid gap-3 md:col-span-8 md:grid-cols-2">
          <div className="h-44 animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-800/40" />
          <div className="h-44 animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-800/40" />
        </div>
      </div>
      <div className="mb-3">
        <div className="h-5 w-48 animate-pulse rounded bg-slate-200/90 dark:bg-slate-800" />
        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-slate-100 dark:bg-slate-800/50" />
      </div>
      <Card>
        <CardHeader>All cryptocurrencies by market cap</CardHeader>
        <div className="p-0 sm:p-0.5">
          <TableSkeleton />
        </div>
        <div className="h-12 border-t border-slate-200/80 dark:border-slate-800" />
      </Card>
    </div>
  );
}

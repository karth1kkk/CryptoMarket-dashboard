import { Suspense } from "react";
import { fetchMarkets } from "@/lib/api";
import { MarketTable } from "@/components/MarketTable";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Card, CardHeader } from "@/components/Card";

export const dynamic = "force-dynamic";

function MarketError({ message }: { message: string }) {
  return (
    <div className="max-w-2xl rounded-lg border border-red-900/50 bg-slate-950/40 p-4 text-red-300">
      <p className="font-medium">Could not load markets</p>
      <p className="mt-1 text-sm text-red-200/80">{message}</p>
      <p className="mt-2 text-sm text-slate-500">
        Is the API running? Check <code className="font-mono">NEXT_PUBLIC_API_BASE_URL</code>.
      </p>
    </div>
  );
}

export default async function Home() {
  let coins: Awaited<ReturnType<typeof fetchMarkets>> = [];
  let error: string | null = null;
  try {
    coins = await fetchMarkets({ perPage: 100 });
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  if (error) {
    return <MarketError message={error} />;
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-4 md:mb-5">
        <h1 className="text-lg font-semibold tracking-tight text-slate-100">
          Market overview
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Top {coins.length} by market cap · USD
        </p>
      </div>

      <Card aria-label="Market list">
        <CardHeader>Spot markets</CardHeader>
        <div className="p-0 md:p-1">
          <Suspense fallback={<TableSkeleton />}>
            <MarketTable coins={coins} />
          </Suspense>
        </div>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { fetchMarkets } from "@/lib/api";

function formatUsd(n: number | null){
  if (n == null) return "N/A";
  return n < 0.01 ? n.toFixed(6) : n.toLocaleString(undefined, { maximumFractionDigits: 2});
}

function Pct24h({ v }: { v: number | null}) {
  if ( v == null) return <span className="text-zinc-400">N/A</span>;
  const good = v >= 0;
  return (
    <span className={good ? "text-emerald-600" : "text-red-600"}>
      {good ? "+" : ""}
      {v.toFixed(2)}%
    </span>
  );
}

export default async function Home() {
  let coins: Awaited<ReturnType<typeof fetchMarkets>> = [];
  let error: string | null = null;
  try{
    coins = await fetchMarkets({ perPage: 20 });
  } catch (e) {
    error = e instanceof Error ? e.message : "unknown error!!"
  }

  if (error) {
    return (
      <main className="p-8">
        <p className="text-red-600">Could not load coins: {error}</p>
        <p className="text-sm text-zinc-500 mt-2">
          Is Rails on http://localhost:3001? Is NEXT_PUBLIC_API_BASE_URL set?
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
        Market (top {coins.length})
      </h1>

      <ul className="divide-y divide-zinc-200 dark-divide-800 border border-zinc-200 dark-border-zinc-800 rounded-xl overflow-hidden bg-white dark-bg-zinc-950">
        {coins.map((c) => (
          <li key={c.id}>
            <Link href={`/coins/${encodeURIComponent(c.id)}`}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-colors">
              <div className="font-medium text-zinc-900 dark:text-zinc-100">
                <span className= "font-medium text-zinc-900 dark:text-zinc-400">
                  {c.name}
                </span>
                <span className="ml-2 text-sm uppercase text-zinc-500">
                  {c.symbol}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                <span className="text-zinc-900 dark:text-zinc-400 font-medium">
                  ${formatUsd(c.current_price)}
                </span>
                <span className="min-w-[5rem text-right sm:text-left">
                  <Pct24h v={c.price_change_percentage_24h}/>
                </span>
              </div>
            </Link>
          </li>
        )
      )}
      </ul>
    </main>
  )
}
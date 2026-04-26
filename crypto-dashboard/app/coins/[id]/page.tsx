import Link from "next/link";
import { fetchCoin, fetchMarketChart }from "@/lib/api";
import { PriceChart } from "@/components/PriceChart";

type PageProps = { 
    params: Promise<{ id: string }>;
    searchParams: Promise<{ days?: string }>; 
};

const RANGE = [7, 30, 365] as const;

function parseDays(raw: string | undefined): number {
    const n = parseInt(raw || "7", 10);
    if (Number.isNaN(n)) return 7;
    return Math.min(365, Math.max(1, n));
}

export default async function CoinPage({ params, searchParams}: PageProps) {
    const { id } = await params;
    const sp = await searchParams;
    const days = parseDays(sp.days);

    let error: string | null = null;
    let title = id;
    let chart = null;
    try{
        const d = (await fetchCoin(id)) as { name?: string; symbol?: string};
        if (d.name) title = `${d.name} (${(d.symbol || "").toUpperCase()})`;
    }catch (e) {
        error = e instanceof Error ? e.message : "Failed to load coin";
    }

    try{
        const data = await fetchMarketChart(id, { days, vsCurrency: "usd"});
        chart = data;
    }catch {
        error = "Failed to load chart data";
    }

    return (
        <main className="min-h-screen p-4 sm:p-6 max-w-4xl mx-auto">
            <Link 
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
                Back to market
            </Link>
            <h1 className="text-2xl- font-semibold mt-4 text-zinc-900 dark:text-zinc-100">
                {error ? "Coin" : title}
            </h1>
            {error && <p className="text-red-600 mt-2">{error}</p>}
            <p className="text-zinc-500 mt-2 text-sm"> ID: {id}</p>
            <div className="mt-6 flex flex-wrap gap-2">
                {RANGE.map((d) => (
                    <Link
                        key={d}
                        href={`/coins/${encodeURIComponent(id)}?days=${d}`}
                        className={
                            d === days
                            ? "rounded-lg bg-zinc-900 text-white dark-bg-zinc-100 dark:text-zinc-900 px-3 py-1.5 text-sm"
                            : "rounded-lg border border-zinc-300 dark:border-zinc-600 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
                        }
                        >
                            {d === 365 ? "1y" : `${d}d`}
                        </Link>
                ))}
                </div>

                <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
                    {chart?.prices?.length ? <PriceChart prices={chart.prices} /> : <p className="text-zinc-500">No chart data.</p>}
                </div>
        </main>
    )
}

import Image from "next/image";
import Link from "next/link";
import { fetchCoin, fetchMarketChart } from "@/lib/api";
import { pickCoinStats } from "@/lib/coinData";
import {
  formatCompactUsd,
  formatPercent,
  formatSupply,
  formatUsd,
} from "@/lib/format";
import { PriceChart } from "@/components/PriceChart";
import { Card, CardBody } from "@/components/Card";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ days?: string }>;
};

const RANGES: { days: number; label: string }[] = [
  { days: 7, label: "7d" },
  { days: 30, label: "30d" },
  { days: 365, label: "1y" },
];

const ALLOWED = new Set([7, 30, 365]);

function parseDays(raw: string | undefined): number {
  const n = parseInt(raw || "7", 10);
  if (Number.isNaN(n) || !ALLOWED.has(n)) return 7;
  return n;
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200/90 bg-slate-50/80 px-3 py-2.5 dark:border-slate-700/50 dark:bg-slate-900/30">
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm text-slate-800 tabular-nums dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}

function PctDisplay({ v }: { v: number | null }) {
  if (v == null) return <span className="text-slate-400">—</span>;
  const up = v >= 0;
  return (
    <span
      className={`font-mono text-sm font-medium tabular-nums ${
        up
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-500 dark:text-red-400"
      }`}
    >
      {formatPercent(v)}
    </span>
  );
}

export default async function CoinPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const days = parseDays(sp.days);

  let detailError: string | null = null;
  let coin: Awaited<ReturnType<typeof fetchCoin>> | null = null;
  try {
    coin = await fetchCoin(id);
  } catch (e) {
    detailError = e instanceof Error ? e.message : "Failed to load coin";
  }

  let chartError: string | null = null;
  let chart = null;
  try {
    chart = await fetchMarketChart(id, { days, vsCurrency: "usd" });
  } catch {
    chartError = "Chart could not be loaded";
  }

  const stats = coin ? pickCoinStats(coin) : null;
  const name = coin?.name ?? (detailError ? "Error" : id);
  const symbol = (coin?.symbol ?? "").toUpperCase();

  return (
    <div className="max-w-4xl">
      <div className="mb-4">
        <Link
          href="/"
          className="text-sm text-emerald-600 transition duration-150 hover:underline dark:text-emerald-400/90"
        >
          ← Back to market
        </Link>
      </div>

      {detailError && !coin && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {detailError}
        </p>
      )}

      {coin && (
        <div className="mb-5">
          <div className="flex items-center gap-2">
            {coin.image?.small ? (
              <Image
                src={coin.image.small}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : null}
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
              {name}
              {symbol ? (
                <span className="ml-2 text-base font-medium text-slate-500 dark:text-slate-400">
                  {symbol}
                </span>
              ) : null}
            </h1>
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-3">
            <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              ${formatUsd(stats?.price ?? null)}
            </span>
            <span className="text-sm text-slate-500">24h</span>
            <PctDisplay v={stats?.change24h ?? null} />
          </div>
        </div>
      )}

      {coin && (
        <Card aria-label="Price chart" className="mb-4">
          <div className="flex flex-col gap-2 border-b border-slate-200/90 px-4 py-3 dark:border-slate-700/60 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {name} price
            </h2>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Time range"
            >
              {RANGES.map(({ days: d, label }) => {
                const active = d === days;
                return (
                  <Link
                    key={d}
                    href={`/coins/${encodeURIComponent(id)}?days=${d}`}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-medium tabular-nums transition duration-150 ${
                      active
                        ? "bg-emerald-600 text-white shadow-sm dark:bg-emerald-500"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-500/30 dark:border-slate-600 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:border-slate-500"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
          <CardBody>
            {chartError && (
              <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                {chartError}
              </p>
            )}
            {!chartError && chart?.prices?.length ? (
              <PriceChart prices={chart.prices} />
            ) : null}
            {!chartError && !chart?.prices?.length && (
              <p className="text-sm text-slate-500" role="status">
                No chart data.
              </p>
            )}
          </CardBody>
        </Card>
      )}

      {coin && stats && (
        <section
          className="grid grid-cols-1 gap-2 sm:grid-cols-3"
          aria-label="Key statistics"
        >
          <StatItem
            label="Market cap (USD)"
            value={`$${formatCompactUsd(stats.marketCap)}`}
          />
          <StatItem
            label="Volume (24h, USD)"
            value={`$${formatCompactUsd(stats.volume)}`}
          />
          <StatItem
            label="Circulating supply"
            value={formatSupply(stats.circulating)}
          />
        </section>
      )}
    </div>
  );
}

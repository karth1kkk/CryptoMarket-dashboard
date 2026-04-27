import type { GlobalMarketData, TrendingListItem } from "@/types/coin";
import { formatFullIntegerUsd, formatPercent, formatTrillionLabel } from "@/lib/format";
import { Card, CardHeader } from "@/components/Card";
import { TrendingPanels } from "./TrendingPanels";

type Props = {
  global: GlobalMarketData;
  trending: TrendingListItem[];
  topGainers: TrendingListItem[];
};

export function MarketHeroAndHighlights({
  global,
  trending,
  topGainers,
}: Props) {
  const mcap = global.total_market_cap?.usd;
  const vol = global.total_volume?.usd;
  const chg = global.market_cap_change_percentage_24h_usd;
  const tr = mcap != null ? formatTrillionLabel(mcap) : null;

  return (
    <div className="mb-4 space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
          Cryptocurrency Prices by Market Cap
        </h1>
        {mcap != null && tr != null && chg != null && (
          <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            The global cryptocurrency market cap today is{" "}
            <span className="font-medium text-slate-800 dark:text-slate-200">
              ${tr} Trillion
            </span>
            {", "}
            <span
              className={
                chg >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }
            >
              a {chg.toFixed(1)}% change
            </span>{" "}
            in the last 24 hours.{" "}
            <a
              href="#highlights"
              className="font-medium text-emerald-600 underline-offset-2 hover:underline dark:text-emerald-400/90"
            >
              Read more
            </a>
          </p>
        )}
      </div>

      <div id="highlights" className="scroll-mt-20">
        <h2 className="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
          Highlights
        </h2>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <Card
            className="border-emerald-100/50 bg-gradient-to-b from-white to-slate-50/80 dark:border-slate-700/50 dark:from-slate-900/40 dark:to-[#131c2a] lg:col-span-4"
            aria-label="Key metrics"
          >
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Market cap
                </p>
                <p className="mt-0.5 break-words font-mono text-base font-bold tabular-nums text-slate-900 sm:text-lg dark:text-slate-50">
                  {mcap != null ? `$${formatFullIntegerUsd(mcap)}` : "—"}
                </p>
                {chg != null && (
                  <p
                    className={`text-sm font-semibold ${
                      chg >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {formatPercent(chg)}
                  </p>
                )}
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  24h trading volume
                </p>
                <p className="mt-0.5 break-words font-mono text-base font-bold tabular-nums text-slate-900 sm:text-lg dark:text-slate-50">
                  {vol != null ? `$${formatFullIntegerUsd(vol)}` : "—"}
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-3 lg:col-span-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardHeader className="!flex !items-center !justify-between !py-2">
                  <span className="text-sm text-slate-800 dark:text-slate-200">
                    <span aria-hidden>🔥</span> Trending
                  </span>
                  <a
                    href="#market-table"
                    className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    View more
                  </a>
                </CardHeader>
                <TrendingPanels items={trending} />
              </Card>
              <Card>
                <CardHeader className="!flex !items-center !justify-between !py-2">
                  <span className="text-sm text-slate-800 dark:text-slate-200">
                    <span aria-hidden>🚀</span> Top Gainers
                  </span>
                  <a
                    href="#market-table"
                    className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    View more
                  </a>
                </CardHeader>
                <TrendingPanels items={topGainers} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

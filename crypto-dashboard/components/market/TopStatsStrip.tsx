import type { GlobalMarketData } from "@/types/coin";
import { formatBillionLabel, formatTrillionLabel } from "@/lib/format";

type Props = {
  global: GlobalMarketData;
  /** Optional: ETH gas in Gwei when available */
  gasGwei?: string | null;
};

export function TopStatsStrip({ global, gasGwei }: Props) {
  const coins = global.active_cryptocurrencies;
  const exchanges = global.markets;
  const mcap = global.total_market_cap?.usd;
  const vol = global.total_volume?.usd;
  const mcapChg = global.market_cap_change_percentage_24h_usd;
  const dom = global.market_cap_percentage;
  const btc = dom?.btc;
  const eth = dom?.eth;

  return (
    <div className="border-b border-slate-200/80 bg-slate-50/50 px-2 py-2 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-slate-950/50 dark:text-slate-300 sm:px-3">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:justify-start">
        {coins != null && (
          <span>
            <span className="text-slate-400 dark:text-slate-500">Coins:</span>{" "}
            <span className="font-semibold text-slate-800 tabular-nums dark:text-slate-100">
              {coins.toLocaleString()}
            </span>
          </span>
        )}
        {exchanges != null && (
          <span>
            <span className="text-slate-400 dark:text-slate-500">Exchanges:</span>{" "}
            <span className="font-semibold text-slate-800 tabular-nums dark:text-slate-100">
              {exchanges.toLocaleString()}
            </span>
          </span>
        )}
        {mcap != null && mcapChg != null && (
          <span>
            <span className="text-slate-400 dark:text-slate-500">Market Cap:</span>{" "}
            <span className="font-semibold text-slate-800 tabular-nums dark:text-slate-100">
              ${formatTrillionLabel(mcap)}T
            </span>{" "}
            <span
              className={
                mcapChg >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }
            >
              {mcapChg >= 0 ? "" : ""}
              {mcapChg.toFixed(1)}%
            </span>
          </span>
        )}
        {vol != null && (
          <span>
            <span className="text-slate-400 dark:text-slate-500">24h Vol:</span>{" "}
            <span className="font-semibold text-slate-800 tabular-nums dark:text-slate-100">
              ${formatBillionLabel(vol)}B
            </span>
          </span>
        )}
        {btc != null && eth != null && (
          <span>
            <span className="text-slate-400 dark:text-slate-500">Dominance:</span>{" "}
            <span className="font-medium">
              BTC {btc.toFixed(1)}% · ETH {eth.toFixed(1)}%
            </span>
          </span>
        )}
        <span>
          <span className="text-slate-400 dark:text-slate-500">Gas:</span>{" "}
          <span className="font-mono font-medium text-slate-800 tabular-nums dark:text-slate-100">
            {gasGwei != null && gasGwei !== "" ? `${gasGwei} GWEI` : "—"}
          </span>
        </span>
      </div>
    </div>
  );
}

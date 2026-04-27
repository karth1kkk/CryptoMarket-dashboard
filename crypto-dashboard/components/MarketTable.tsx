"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, type KeyboardEvent } from "react";
import type { CoinMarket } from "@/types/coin";
import { formatCompactUsd, formatPercent, formatUsd } from "@/lib/format";
import { Sparkline } from "@/components/Sparkline";

function PctCell({ v, compact }: { v: number | null | undefined; compact?: boolean }) {
  if (v == null || Number.isNaN(v)) {
    return (
      <span className="text-slate-400 tabular-nums dark:text-slate-500">—</span>
    );
  }
  const up = v >= 0;
  return (
    <span
      className={`tabular-nums ${
        compact ? "text-[12px]" : "text-[13px]"
      } ${
        up
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-500 dark:text-red-400"
      }`}
    >
      {formatPercent(v)}
    </span>
  );
}

type RowProps = { coin: CoinMarket; rank: number };

function MarketRow({ coin: c, rank }: RowProps) {
  const router = useRouter();
  const href = `/coins/${encodeURIComponent(c.id)}`;
  const prices = c.sparkline_in_7d?.price;
  const p24 = c.price_change_percentage_24h;
  const up7d = prices && prices.length >= 2
    ? (prices[prices.length - 1]! >= prices[0]!)
    : p24 != null
      ? p24 >= 0
      : null;

  const go = useCallback(() => {
    router.push(href);
  }, [router, href]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableRowElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    },
    [go]
  );

  return (
    <tr
      className="group cursor-pointer border-b border-slate-100/90 transition-colors duration-100 last:border-b-0 hover:bg-[var(--row-hover)] dark:border-slate-800/60 dark:hover:bg-slate-800/35"
      onClick={go}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label={`View ${c.name} details`}
    >
      <td className="w-10 whitespace-nowrap px-2 py-2 text-left font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400 sm:pl-3">
        {c.market_cap_rank ?? rank}
      </td>
      <td className="px-1 py-2 min-w-0 sm:px-2">
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          {c.image ? (
            <Image
              src={c.image}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 rounded-full object-cover sm:h-7 sm:w-7"
            />
          ) : null}
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="truncate text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                {c.symbol}
              </span>
              <span className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                {c.name}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="hidden py-2 pr-1 text-center sm:table-cell">
        <Link
          href={href}
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          View
        </Link>
      </td>
      <td className="whitespace-nowrap py-2 pr-2 text-right font-mono text-[12px] text-slate-800 tabular-nums sm:text-[13px] dark:text-slate-200">
        ${formatUsd(c.current_price)}
      </td>
      <td className="whitespace-nowrap py-2 pr-2 text-right">
        <PctCell v={c.price_change_percentage_1h_in_currency} compact />
      </td>
      <td className="whitespace-nowrap py-2 pr-2 text-right">
        <PctCell v={c.price_change_percentage_24h} compact />
      </td>
      <td className="whitespace-nowrap py-2 pr-2 text-right">
        <PctCell v={c.price_change_percentage_7d_in_currency} compact />
      </td>
      <td className="whitespace-nowrap py-2 pr-2 text-right font-mono text-[12px] text-slate-700 tabular-nums sm:text-[13px] dark:text-slate-300">
        ${formatCompactUsd(c.total_volume)}
      </td>
      <td className="hidden whitespace-nowrap py-2 pr-2 text-right font-mono text-[12px] text-slate-700 tabular-nums md:table-cell md:text-[13px] dark:text-slate-300">
        ${formatCompactUsd(c.market_cap)}
      </td>
      <td className="hidden py-2 pr-1 lg:table-cell">
        {prices && prices.length > 1 ? (
          <Sparkline prices={prices} positive={up7d} />
        ) : (
          <span className="text-slate-400" aria-hidden>
            —
          </span>
        )}
      </td>
    </tr>
  );
}

type MarketTableProps = {
  coins: CoinMarket[];
  startRank: number;
};

export function MarketTable({ coins, startRank }: MarketTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const rows = useMemo(() => {
    if (!q) return coins;
    return coins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [coins, q]);

  if (rows.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center border border-dashed border-slate-200/80 px-4 py-16 text-center dark:border-slate-600/50"
        role="status"
        aria-live="polite"
      >
        <p className="text-slate-500 dark:text-slate-400">
          No markets match your search.
        </p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Try a different name or symbol.
        </p>
        {q && (
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString());
              next.delete("q");
              const s = next.toString();
              router.replace(s ? `/?${s}` : "/", { scroll: false });
            }}
            className="mt-4 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-emerald-500/50 hover:text-slate-900 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-500"
          >
            Clear search
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className="max-h-[min(80vh,960px)] overflow-x-auto overflow-y-auto"
      id="market-table"
    >
      <table
        className="w-full min-w-[920px] table-fixed border-collapse text-left text-sm"
        aria-label="Cryptocurrency markets"
      >
        <thead className="sticky top-0 z-10 border-b border-slate-200/90 bg-slate-100/90 backdrop-blur dark:border-slate-800/90 dark:bg-slate-900/80">
          <tr>
            <th
              className="w-10 py-2.5 pl-2 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:pl-3 dark:text-slate-400"
              scope="col"
            >
              #
            </th>
            <th
              className="min-w-[200px] py-2.5 text-left text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              scope="col"
            >
              Coin
            </th>
            <th
              className="hidden w-14 py-2.5 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:table-cell dark:text-slate-400"
              scope="col"
            >
              {""}
            </th>
            <th
              className="w-[88px] py-2.5 pr-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              scope="col"
            >
              Price
            </th>
            <th
              className="w-16 py-2.5 pr-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              scope="col"
            >
              1h
            </th>
            <th
              className="w-16 py-2.5 pr-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              scope="col"
            >
              24h
            </th>
            <th
              className="w-16 py-2.5 pr-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              scope="col"
            >
              7d
            </th>
            <th
              className="w-[100px] py-2.5 pr-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
              scope="col"
            >
              24h Vol
            </th>
            <th
              className="hidden w-[100px] py-2.5 pr-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500 md:table-cell dark:text-slate-400"
              scope="col"
            >
              Mkt cap
            </th>
            <th
              className="hidden w-[96px] py-2.5 pr-2 text-right text-[10px] font-semibold uppercase tracking-wide text-slate-500 lg:table-cell dark:text-slate-400"
              scope="col"
            >
              Last 7d
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c, i) => (
            <MarketRow
              key={c.id}
              coin={c}
              rank={startRank + i}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

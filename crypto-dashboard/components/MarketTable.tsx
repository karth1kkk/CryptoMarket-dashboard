"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, type KeyboardEvent } from "react";
import type { CoinMarket } from "@/types/coin";
import { formatCompactUsd, formatPercent, formatUsd } from "@/lib/format";

function Pct24h({ v }: { v: number | null }) {
  if (v == null)
    return <span className="text-slate-500 tabular-nums">—</span>;
  const up = v >= 0;
  return (
    <span
      className={`tabular-nums ${
        up ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {formatPercent(v)}
    </span>
  );
}

type RowProps = { coin: CoinMarket };

function MarketRow({ coin: c }: RowProps) {
  const router = useRouter();
  const href = `/coins/${encodeURIComponent(c.id)}`;

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
      className="cursor-pointer border-b border-slate-800/80 transition-colors duration-150 last:border-b-0 hover:bg-slate-800/40"
      onClick={go}
      onKeyDown={onKeyDown}
      tabIndex={0}
      aria-label={`View ${c.name} details`}
    >
      <td className="px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3">
          {c.image ? (
            <Image
              src={c.image}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
          ) : null}
          <div className="min-w-0">
            <span className="block truncate font-medium text-slate-100">
              {c.name}
            </span>
            <span className="text-xs font-medium uppercase text-slate-500">
              {c.symbol}
            </span>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap py-2.5 pr-4 text-right font-mono text-[13px] text-slate-200 tabular-nums">
        ${formatUsd(c.current_price)}
      </td>
      <td className="whitespace-nowrap py-2.5 pr-4 text-right text-[13px]">
        <Pct24h v={c.price_change_percentage_24h} />
      </td>
      <td className="whitespace-nowrap py-2.5 pr-4 text-right font-mono text-[13px] text-slate-300 tabular-nums">
        ${formatCompactUsd(c.market_cap)}
      </td>
      <td className="whitespace-nowrap py-2.5 pr-4 text-right font-mono text-[13px] text-slate-300 tabular-nums">
        ${formatCompactUsd(c.total_volume)}
      </td>
    </tr>
  );
}

export function MarketTable({ coins }: { coins: CoinMarket[] }) {
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
        className="flex flex-col items-center justify-center border border-dashed border-slate-700/80 px-4 py-16 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-slate-400">No markets match your search.</p>
        <p className="mt-1 text-sm text-slate-500">
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
            className="mt-4 rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Clear search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-h-[min(70vh,900px)] overflow-auto">
      <table
        className="w-full min-w-[640px] table-fixed border-collapse text-left text-sm"
        aria-label="Top cryptocurrency markets"
      >
        <thead className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
          <tr>
            <th
              className="w-[36%] px-4 py-3 font-medium text-slate-400"
              scope="col"
            >
              Name
            </th>
            <th
              className="w-[14%] py-3 pr-4 text-right font-medium text-slate-400"
              scope="col"
            >
              Price
            </th>
            <th
              className="w-[12%] py-3 pr-4 text-right font-medium text-slate-400"
              scope="col"
            >
              24h
            </th>
            <th
              className="w-[19%] py-3 pr-4 text-right font-medium text-slate-400"
              scope="col"
            >
              Mkt cap
            </th>
            <th
              className="w-[19%] py-3 pr-4 text-right font-medium text-slate-400"
              scope="col"
            >
              Volume
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <MarketRow key={c.id} coin={c} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

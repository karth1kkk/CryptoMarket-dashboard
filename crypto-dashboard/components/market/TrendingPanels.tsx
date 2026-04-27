import Image from "next/image";
import Link from "next/link";
import type { TrendingListItem } from "@/types/coin";
import { formatPercent, formatUsd } from "@/lib/format";

function Row({ c }: { c: TrendingListItem }) {
  const up = (c.price_change_percentage_24h ?? 0) >= 0;
  const icon = c.thumb || c.image;
  return (
    <li>
      <Link
        href={`/coins/${encodeURIComponent(c.id)}`}
        className="flex min-w-0 items-center justify-between gap-2 rounded-md px-1 py-1.5 text-sm transition hover:bg-slate-50/90 dark:hover:bg-slate-800/40"
      >
        <div className="flex min-w-0 items-center gap-2">
          {icon ? (
            <Image
              src={icon}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 rounded-full"
            />
          ) : null}
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-800 dark:text-slate-100">
              {c.name}
            </p>
            <p className="text-[11px] uppercase text-slate-500">{c.symbol}</p>
          </div>
        </div>
        <div className="shrink-0 text-right text-xs">
          {c.current_price != null && (
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
              ${formatUsd(c.current_price)}
            </span>
          )}
          {c.price_change_percentage_24h != null && (
            <span
              className={`ml-1 font-mono text-[11px] ${
                up
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            >
              {formatPercent(c.price_change_percentage_24h)}
            </span>
          )}
        </div>
      </Link>
    </li>
  );
}

export function TrendingPanels({ items }: { items: TrendingListItem[] }) {
  if (!items.length) {
    return (
      <ul className="p-2 text-sm text-slate-500" aria-live="polite">
        <li className="px-1 py-2">No data</li>
      </ul>
    );
  }
  return (
    <ul className="max-h-44 divide-y divide-slate-100 overflow-y-auto p-1 dark:divide-slate-800/80 sm:max-h-52">
      {items.map((c) => (
        <Row key={c.id} c={c} />
      ))}
    </ul>
  );
}

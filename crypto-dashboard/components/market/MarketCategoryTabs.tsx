"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { MarketView } from "@/lib/api";

const TABS: { id: MarketView; label: string; short: string }[] = [
  { id: "all", label: "All", short: "All" },
  { id: "highlights", label: "Highlights", short: "HL" },
  { id: "base", label: "Base Ecosystem", short: "Base" },
  { id: "categories", label: "Categories", short: "L1" },
];

type Props = {
  active: MarketView;
  className?: string;
};

function buildHref(
  next: MarketView,
  sp: ReturnType<typeof useSearchParams>
) {
  const p = new URLSearchParams();
  if (next !== "all") p.set("view", next);
  const q = sp.get("q")?.trim();
  if (q) p.set("q", q);
  // Switching list resets to page 1
  const s = p.toString();
  return s ? `/?${s}` : "/";
}

export function MarketCategoryTabs({ active, className }: Props) {
  const sp = useSearchParams();
  return (
    <div
      className={`flex w-full min-w-0 flex-wrap items-center gap-0.5 rounded-lg border border-slate-200/90 bg-slate-100/90 p-0.5 shadow-sm shadow-slate-200/30 dark:border-[#243044] dark:bg-[#0d1119]/90 dark:shadow-sm dark:shadow-black/20${className ? ` ${className}` : ""}`}
      role="tablist"
      aria-label="Market views"
    >
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <Link
            key={tab.id}
            href={buildHref(tab.id, sp)}
            role="tab"
            aria-selected={isActive}
            className={`min-h-9 flex-1 rounded-md px-2 py-1.5 text-center text-sm font-medium transition-colors sm:min-w-0 sm:flex-none sm:px-3 ${
              isActive
                ? "bg-white text-emerald-800 shadow-sm dark:bg-emerald-500/15 dark:text-emerald-200 dark:shadow-none"
                : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
            }`}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.short}</span>
          </Link>
        );
      })}
    </div>
  );
}

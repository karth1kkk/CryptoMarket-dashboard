import Link from "next/link";
import type { MarketView } from "@/lib/api";

type Props = {
  page: number;
  totalPages: number;
  totalCoinsApprox: number;
  perPage: number;
  q?: string;
  /** When not "all", list totals are approximate; navigation is prev/next + page. */
  view?: MarketView;
  /** If set, "showing a–b" uses this instead of capping to totalCoinsApprox */
  toOverride?: number;
  /** Simplified pager: current page, prev, next (no 1…last) */
  simplified?: boolean;
};

export function MarketPagination({
  page,
  totalPages,
  totalCoinsApprox,
  perPage,
  q,
  view = "all",
  toOverride,
  simplified = false,
}: Props) {
  const from = (page - 1) * perPage + 1;
  const to = toOverride ?? Math.min(page * perPage, totalCoinsApprox);
  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    if (q?.trim()) params.set("q", q.trim());
    if (view && view !== "all") params.set("view", view);
    const s = params.toString();
    return s ? `/?${s}` : "/";
  };

  const isFiltered = view !== "all";
  const useSimplified = simplified || isFiltered;

  const pageRange: number[] = [];
  const fromP = Math.max(1, page - 2);
  const toP = Math.min(totalPages, page + 2);
  for (let i = fromP; i <= toP; i += 1) pageRange.push(i);

  return (
    <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/80 px-3 py-3 text-sm text-slate-600 sm:flex-row dark:border-slate-800/60 dark:text-slate-400">
      <p className="order-2 text-center sm:order-1 sm:text-left">
        {isFiltered ? (
          <>
            Showing {from.toLocaleString()} to {to.toLocaleString()} (filtered
            list)
          </>
        ) : (
          <>
            Showing {from.toLocaleString()} to {to.toLocaleString()} of{" "}
            {totalCoinsApprox.toLocaleString()} results
          </>
        )}
      </p>
      <nav
        className="order-1 flex flex-wrap items-center justify-center gap-1 sm:order-2"
        aria-label="Pagination"
      >
        {page > 1 && (
          <Link
            href={buildHref(page - 1)}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm hover:border-emerald-500/30 dark:border-slate-600 dark:bg-slate-800/50"
          >
            Previous
          </Link>
        )}
        {useSimplified ? (
          <span className="min-w-9 rounded-md bg-emerald-600 px-2 py-1 text-center text-sm font-medium text-white dark:bg-emerald-500">
            {page}
          </span>
        ) : (
          <>
            {fromP > 1 && (
              <>
                <Link
                  href={buildHref(1)}
                  className="min-w-9 rounded-md border border-transparent px-2 py-1 text-center text-sm hover:border-slate-200 dark:hover:border-slate-600"
                >
                  1
                </Link>
                {fromP > 2 && <span className="px-1">…</span>}
              </>
            )}
            {pageRange.map((p) => (
              <Link
                key={p}
                href={buildHref(p)}
                className={`min-w-9 rounded-md px-2 py-1 text-center text-sm ${
                  p === page
                    ? "bg-emerald-600 font-medium text-white dark:bg-emerald-500"
                    : "border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                }`}
              >
                {p}
              </Link>
            ))}
            {toP < totalPages && (
              <>
                {toP < totalPages - 1 && <span className="px-1">…</span>}
                <Link
                  href={buildHref(totalPages)}
                  className="min-w-9 rounded-md border border-transparent px-2 py-1 text-center text-sm hover:border-slate-200 dark:hover:border-slate-600"
                >
                  {totalPages}
                </Link>
              </>
            )}
          </>
        )}
        {page < totalPages && (
          <Link
            href={buildHref(page + 1)}
            className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-sm hover:border-emerald-500/30 dark:border-slate-600 dark:bg-slate-800/50"
          >
            Next
          </Link>
        )}
      </nav>
    </div>
  );
}

import { Suspense } from "react";
import {
  getApiErrorMessage,
  isApiRateLimitError,
} from "@/lib/apiErrors";
import {
  type MarketView,
  fetchMarkets,
  fetchMarketOverview,
} from "@/lib/api";
import { MarketTable } from "@/components/MarketTable";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Card, CardHeader } from "@/components/Card";
import { TopStatsStrip } from "@/components/market/TopStatsStrip";
import { MarketHeroAndHighlights } from "@/components/market/MarketHeroAndHighlights";
import { MarketCategoryTabs } from "@/components/market/MarketCategoryTabs";
import { MarketPagination } from "@/components/MarketPagination";

export const dynamic = "force-dynamic";

const MARKET_VIEWS: MarketView[] = [
  "all",
  "highlights",
  "base",
  "categories",
];

function parseView(raw: string | undefined): MarketView {
  if (!raw) return "all";
  return MARKET_VIEWS.includes(raw as MarketView) ? (raw as MarketView) : "all";
}

const VIEW_COPY: Record<
  MarketView,
  { heading: string; sub: string; cardTitle: string }
> = {
  all: {
    heading: "All — ranked by market cap",
    sub: "Global ranking by market capitalization.",
    cardTitle: "All cryptocurrencies by market cap",
  },
  highlights: {
    heading: "Highlights — by 24h volume",
    sub: "Most actively traded; sorted by 24h volume (desc).",
    cardTitle: "Top volume (24h)",
  },
  base: {
    heading: "Base Ecosystem",
    sub: "CoinGecko’s Base & Base ecosystem category.",
    cardTitle: "Base ecosystem",
  },
  categories: {
    heading: "Layer 1 (categories)",
    sub: "Layer 1 smart-contract networks (CoinGecko layer-1).",
    cardTitle: "Layer 1 category",
  },
};

type PageProps = {
  searchParams: Promise<{ page?: string; q?: string; view?: string }>;
};

function MarketError({
  message,
  reason,
}: {
  message: string;
  reason: "default" | "rate_limit";
}) {
  const isRate = reason === "rate_limit";
  return (
    <div
      className={`max-w-2xl rounded-xl border p-4 ${
        isRate
          ? "border-amber-300/80 bg-amber-50/90 text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/25 dark:text-amber-100"
          : "border-red-200 bg-red-50/90 text-red-800 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-200"
      }`}
    >
      <p className="font-medium">
        {isRate ? "Data API rate limit" : "Could not load markets"}
      </p>
      <p className="mt-1 text-sm opacity-90">{message}</p>
      {!isRate && (
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Is the API running? Check{" "}
          <code className="font-mono text-sm text-slate-800 dark:text-slate-300">
            NEXT_PUBLIC_API_BASE_URL
          </code>
          .
        </p>
      )}
    </div>
  );
}

export default async function Home({ searchParams }: PageProps) {
  const sp = await searchParams;
  const view = parseView(sp.view);
  const page = Math.max(1, Math.min(100, parseInt(sp.page || "1", 10) || 1));
  const perPage = 100;

  let overview = null;
  let overviewErr: string | null = null;
  try {
    overview = await fetchMarketOverview();
  } catch (e) {
    overviewErr = getApiErrorMessage(e);
  }

  let coins: Awaited<ReturnType<typeof fetchMarkets>> = [];
  let error: string | null = null;
  let marketsErrorCause: unknown = null;
  try {
    coins = await fetchMarkets({
      perPage,
      page,
      sparkline: true,
      order: "market_cap_desc",
      view,
    });
  } catch (e) {
    marketsErrorCause = e;
    error = getApiErrorMessage(e);
  }

  if (error) {
    return (
      <MarketError
        message={error}
        reason={isApiRateLimitError(marketsErrorCause) ? "rate_limit" : "default"}
      />
    );
  }

  const totalCoins = overview?.global.active_cryptocurrencies ?? 16_000;
  const hasNextPage = coins.length === perPage;
  const totalPages =
    view === "all"
      ? Math.max(1, Math.min(100, Math.ceil(totalCoins / perPage)))
      : hasNextPage
        ? Math.min(100, page + 1)
        : page;
  const toRow = (page - 1) * perPage + Math.max(0, coins.length);
  const copy = VIEW_COPY[view];

  return (
    <div className="max-w-[1600px]">
      {overview && (
        <TopStatsStrip
          global={overview.global}
          gasGwei={null}
        />
      )}

      {overviewErr && (
        <p className="mb-2 text-sm text-amber-700 dark:text-amber-300" role="status">
          Market overview: {overviewErr}
        </p>
      )}

      {overview && (
        <MarketHeroAndHighlights
          global={overview.global}
          trending={overview.trending}
          topGainers={overview.top_gainers}
        />
      )}

      <div className="mb-3 space-y-2 md:mb-4">
        <Suspense
          fallback={
            <div
              className="h-11 w-full rounded-lg border border-slate-200/80 bg-slate-50/50 dark:border-slate-700/80 dark:bg-slate-900/30"
              aria-hidden
            />
          }
        >
          <MarketCategoryTabs active={view} />
        </Suspense>
        <div>
          <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
            {copy.heading}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            USD · {copy.sub} · Page {page} of {totalPages}
          </p>
        </div>
      </div>

      <Card aria-label="Market list" className="overflow-hidden !border-slate-200/90 !shadow-md dark:!border-slate-800/80">
        <CardHeader>{copy.cardTitle}</CardHeader>
        <div className="p-0">
          <Suspense fallback={<TableSkeleton />}>
            <MarketTable
              coins={coins}
              startRank={(page - 1) * perPage + 1}
            />
          </Suspense>
        </div>
        <MarketPagination
          page={page}
          totalPages={totalPages}
          totalCoinsApprox={totalCoins}
          perPage={perPage}
          q={sp.q}
          view={view}
          toOverride={toRow}
        />
      </Card>
    </div>
  );
}

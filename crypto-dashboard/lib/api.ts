import type {
  CoinGeckoDetail,
  CoinMarket,
  SearchCoin,
  MarketChartData,
  MarketOverview,
} from "@/types/coin";
import { apiClient } from "./apiClient";

export type MarketView = "all" | "highlights" | "base" | "categories";

export async function fetchMarkets(init?: {
  vsCurrency?: string;
  perPage?: number;
  page?: number;
  order?: string;
  sparkline?: boolean;
  /** Maps to CoinGecko order + category on the API */
  view?: MarketView;
}): Promise<CoinMarket[]> {
  const { data } = await apiClient.get<CoinMarket[]>("/api/v1/coins", {
    params: {
      vs_currency: init?.vsCurrency ?? "usd",
      per_page: init?.perPage ?? 20,
      page: init?.page ?? 1,
      order: init?.order ?? "market_cap_desc",
      sparkline: init?.sparkline ?? false,
      ...(init?.view && init.view !== "all" ? { view: init.view } : {}),
    },
  });
  return data;
}

export async function fetchMarketOverview(): Promise<MarketOverview> {
  const { data } = await apiClient.get<MarketOverview>("/api/v1/market_overview");
  return data;
}

export async function fetchMarketChart(
    id: string,
    init?: { vsCurrency?: string; days?: number}
): Promise<MarketChartData> {
    const p = new URLSearchParams();
    p.set("vs_currency", init?.vsCurrency ?? "usd");
    p.set("days", String(init?.days ?? 7));
    const { data} = await apiClient.get<MarketChartData>(
        `/api/v1/coins/${encodeURIComponent(id)}/market_chart?${p.toString()}`
    );
    return data;
}

export async function fetchCoin(id: string) {
  const { data } = await apiClient.get<CoinGeckoDetail>(
    `/api/v1/coins/${encodeURIComponent(id)}`
  );
  return data;
}

export async function searchCoins(q: string) {
    const p = new URLSearchParams();
    p.set("q", q.trim());
    const { data } = await apiClient.get<{ coins: SearchCoin[]}>(
        `/api/v1/coins/search?${p.toString()}`
    );
    return data.coins;
}

import type { CoinMarket, SearchCoin, MarketChartData } from "@/types/coin";
import { apiClient } from "./apiClient";

export async function fetchMarkets(
    init?: {vsCurrency?: string; perPage?: number; page?: number}
): Promise<CoinMarket[]> {
    const { data } = await apiClient.get<CoinMarket[]>("/api/v1/coins", {
        params: {
            vs_currency: init?.vsCurrency ?? "usd",
            per_page: init?.perPage ?? 20,
            page: init?.page ?? 1,
        },
    });
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
    const { data } = await apiClient.get<Record<string, unknown>>(
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

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
 export type AuthResponse = {
  user: { id: number; email: string};
  token: string;
 };

 export async function register(email:string, password: string, passwordConfirmation: string) {
  const {data} = await apiClient.post<AuthResponse>("/api/v1/auth/register", {
    user: { email, password, password_confirmation: passwordConfirmation},
  })
  return data;
 }

 export async function login(email:string, password: string){
  const {data} = await apiClient.post<AuthResponse>("/api/v1/auth/login", {
    user: {email, password},
  })
  return data;
 }

 export async function fetchWatchList() {
  const {data} = await apiClient.get<{coin_ids: string[]}>("/api/v1/watchlist");
  return data.coin_ids;
 }

 export async function addWatchList(coinId: string){
  await apiClient.post("/api/v1/watchlist", {coin_id: coinId});
 }

 export async function removeWatchlist(coinId: string){
  await apiClient.delete(`/api/v1/watchlist/${encodeURIComponent(coinId)}`);
 }

 export type Holding = { coin_id: string; amount: number; avg_cost_usd: number | null };

 export async function fetchHoldings() {
  const {data} = await apiClient.get<{holdings: Holding[]}>("/api/v1/holdings");
  return data.holdings;
 }

 export async function createHolding(payload: Holding){
  const {data} = await apiClient.post<Holding>("/api/v1/holdings/", { holding: payload });
  return data;
 }

 export async function updateHolding(coinId: string, payload: Omit<Holding, "coin_id"> & {coin_id: string}){
  const {data} = await apiClient.patch<Holding>(`/api/v1/holdings/${encodeURIComponent(coinId)}`, {
    holding: payload,
  });
  return data;
 }

 export async function deleteHolding(coinId: string){
  await apiClient.delete(`/api/v1/holdings/${encodeURIComponent(coinId)}`);
 }
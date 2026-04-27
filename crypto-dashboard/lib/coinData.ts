import type { CoinGeckoDetail } from "@/types/coin";

const USD = "usd";

export function usd(
  o: Record<string, number | undefined> | undefined
): number | null {
  if (!o) return null;
  const n = o[USD];
  return n != null && !Number.isNaN(n) ? n : null;
}

export function pickCoinStats(d: CoinGeckoDetail) {
  const md = d.market_data;
  return {
    price: usd(md?.current_price),
    change24h: md?.price_change_percentage_24h ?? null,
    marketCap: usd(md?.market_cap),
    volume: usd(md?.total_volume),
    circulating: md?.circulating_supply ?? null,
  };
}

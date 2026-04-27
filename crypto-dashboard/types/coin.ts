export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
};

export type SearchCoin = {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank?: number;
  thumb?: string;
};

export type MarketChartData = {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
};

/** Subset of CoinGecko /coins/{id} JSON we use on the detail page */
export type CoinGeckoDetail = {
  name?: string;
  symbol?: string;
  image?: { small?: string; large?: string };
  market_data?: {
    current_price?: Record<string, number | undefined>;
    price_change_percentage_24h?: number | null;
    market_cap?: Record<string, number | undefined>;
    total_volume?: Record<string, number | undefined>;
    circulating_supply?: number | null;
  };
};

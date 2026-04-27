export type CoinMarket = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
  market_cap_rank?: number | null;
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  sparkline_in_7d?: { price?: number[] } | null;
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

/** Coingecko GET /global `data` object (partial) */
export type GlobalMarketData = {
  active_cryptocurrencies?: number;
  markets?: number;
  total_market_cap?: { usd?: number };
  total_volume?: { usd?: number };
  market_cap_change_percentage_24h_usd?: number;
  market_cap_percentage?: { btc?: number; eth?: number };
};

export type TrendingListItem = {
  id: string;
  name: string;
  symbol: string;
  /** Icon URL (trending uses thumb; top gainers may set image) */
  thumb?: string | null;
  image?: string | null;
  current_price: number | null;
  price_change_percentage_24h: number | null;
};

export type MarketOverview = {
  global: GlobalMarketData;
  trending: TrendingListItem[];
  top_gainers: TrendingListItem[];
};

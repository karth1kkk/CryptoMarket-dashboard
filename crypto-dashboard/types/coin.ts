export type CoinMarket = {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number | null;
    market_cap: number | null;
    total_volume: number | null;
    price_change_percentage_24h: number | null;
}

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
}
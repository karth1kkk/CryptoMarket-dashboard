# crypto-dashboard (Next.js)

Next.js App Router app for the Crypto Market Dashboard. It calls the Rails API over HTTP. For **architecture, caching, CORS, rate limits, error shapes, and production notes**, see the **root [README.md](../README.md)**.

## Quick start

1. Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` (e.g. `http://localhost:3001` if the API runs on port 3001).
2. `npm install` then `npm run dev` — app at [http://localhost:3000](http://localhost:3000).

## Main pieces

- `app/` — routes (`/`, `/coins/[id]`, loading UI)
- `lib/apiClient.ts` — Axios base URL from `NEXT_PUBLIC_API_BASE_URL`
- `lib/api.ts` — `fetchMarkets`, `fetchCoin`, `fetchMarketChart`, `searchCoins`
- `components/PriceChart.tsx` — Recharts line chart for market history

## Stack

Next.js 16, React 19, TypeScript, Tailwind 4, axios, Recharts.

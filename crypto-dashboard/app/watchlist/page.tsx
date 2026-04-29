"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { fetchWatchList, fetchMarkets, removeWatchlist } from "@/lib/api";
import type { CoinMarket } from "@/types/coin";
import { formatUsd, formatPercent } from "@/lib/format";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function WatchlistPage() {
  const [ids, setIds] = useState<string[]>([]);
  const [coins, setCoins] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const tokenKey = "krypt:token";

  const router = useRouter();
useEffect(() => {
  const token = localStorage.getItem(tokenKey);
  if (!token) {
    router.replace("/login?next=/watchlist"); // change per page
  }
}, [router]);

  async function load(){
    setLoading(true);
    setErr(null);
    try{
      const coinIds = await fetchWatchList();
      setIds(coinIds);

      if (coinIds.length === 0) {
        setCoins([]);
        return;
      }
      //just fetch the first 250 markets and filter by id
      const markets = await fetchMarkets({ perPage: 250, page: 1, sparkline: false})
      const byId = new Set(coinIds);
      const selected = markets.filter((c) => byId.has(c.id));

      const map = new Map(selected.map((c) => [c.id, c]));
      setCoins(coinIds.map((id) => map.get(id)).filter(Boolean) as CoinMarket[]);
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        localStorage.removeItem("krypt:token");
        router.replace("/login?next=/watchlist");
        return;
      }
      setErr(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function onRemove(id: string){
    try{
      await removeWatchlist(id);
      await load();
    } catch (e){
      setErr(e instanceof Error ? e.message : "Failed to remove");
    }
  }

  const empty = !loading && ids.length === 0;

  return (
    <div className="max-w-4xl">
      <h1 className="text-lg font-semibold text-slate-500 dark:text-slate-400">
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Assets you marked for tracking.
        </p>

        {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
        {loading && <p className="mt-6 text-sm text-slate-500">Loading watchlist.</p>}
        {empty && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200/90 py-16 text-center dark:border-slate-600/50">
            <p className="text-slate-500 dark:text-slate-400">No saved assets</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              Add coins from the market table.
            </p>
            <Link href="/" className="mt-4 inline-block text-emerald-600 hover:underline">
              Go to market
            </Link>
          </div>
        )}

        {!loading && !empty && (
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-700/70">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/40">
                <tr>
                  <th className="px-3 py-2 text-left">Coin</th>
                  <th className="px-3 py-2 text-right">Price</th>
                  <th className="px-3 py-2 text-right">24h</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((c) => (
                  <tr key={c.id} className="border-t border-slate-200/80 dark:border-slate-700/70">
                    <td className="px-3 py-2">
                      <Link href={`/coins/${encodeURIComponent(c.id)}`} className="hover:underline">
                      {c.name} <span className="text-slate-500 uppercase">({c.symbol})</span>
                      </Link>
                    </td>
                    <td className="px-3 py-2 text-right">${formatUsd(c.current_price)}</td>
                    <td className="px-3 py-2 text-right">{formatPercent(c.price_change_percentage_24h)}</td>
                    <td className="px-3 py-2 text-right">
                      <button onClick={() => onRemove(c.id)}
                      className="rounded border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </h1>
    </div>
  );
}

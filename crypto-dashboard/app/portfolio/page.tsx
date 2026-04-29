"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchHoldings, createHolding, updateHolding, deleteHolding, fetchMarkets, type Holding } from "@/lib/api"
import type { CoinMarket } from "@/types/coin";
import {formatUsd} from "@/lib/format";
import { useRouter } from "next/navigation";
import axios from "axios";

type Row = Holding & { market?: CoinMarket };

export default function PortfolioPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [avgCost, setAvgCost] = useState("");

  const tokenKey = "krypt:token";

  const router = useRouter();

useEffect(() => {
  const token = localStorage.getItem(tokenKey);
  if (!token) {
    router.replace("/login?next=/portfolio"); // change per page
  }
}, [router]);



  async function load() {
    setLoading(true);
    setErr(null);

    try {
      const holdings = await fetchHoldings();
      const markets = await fetchMarkets({ perPage: 250, page: 1, sparkline: false });
      const byId = new Map(markets.map((m) => [m.id, m]));
      setRows(holdings.map((h) => ({ ...h, market: byId.get(h.coin_id) })));
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        localStorage.removeItem("krypt:token");
        router.replace(`/login?next=${encodeURIComponent(window.location.pathname)}`);
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

  async function onCreateOrUpdate(e: React.FormEvent){
    e.preventDefault();
    setErr(null);
    try{
      const payload: Holding = {
        coin_id: coinId.trim(),
        amount: Number(amount),
        avg_cost_usd: avgCost.trim() ? Number(avgCost) : null,
      };

      const exists = rows.some((r) => r.coin_id === payload.coin_id);
      if (exists) {
        await updateHolding(payload.coin_id, payload);
      } else {
        await createHolding(payload);
      }

      setCoinId("");
      setAmount("");
      setAvgCost("");
      await load();
    } catch (e){
      setErr(e instanceof Error ? e.message : "Save Failed");
    }
  }

  async function onDelete(id: string){
      try{
        await deleteHolding(id);
        await load();
      } catch (e) {
        setErr(e instanceof Error ? e.message: "Delete Failed");
      }
  }

  const totals = useMemo(() => {
    let value = 0;
    let cost = 0;
    let hasCost = false;

    for (const r of rows){
      const price = r.market?.current_price ?? 0;
      value += r.amount * price;
      if (r.avg_cost_usd != null){
        hasCost = true;
        cost += r.amount * r.avg_cost_usd;
      }
    }
    return { value, cost: hasCost ? cost: null, pnl: hasCost ? value - cost : null};
  }, [rows]);

  return (
    <div className="max-w-5xl">
      <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Portfolio</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track holdings and estimated PnL</p>
      
      <form onSubmit={onCreateOrUpdate} className="mt-4 grid grid-cols-1 rounded-xl border border-slate-200/90 p-3 sm:grid-cols-4 dark:border-slate-700/70">
      <input value={coinId} onChange={(e) => setCoinId(e.target.value)} placeholder="Coin id (e.g. bitcoin)" className="rounded border p-2" required />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" type="number" min="0" step="any" className="rounded border p-2" required />
      <input value={avgCost} onChange={(e) => setAvgCost(e.target.value)} placeholder="Avg cost USD (optional)" type="number" min="0" step="any" className="rounded border p-2" />
      <button className="rounded bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">
        Save
      </button>
      </form>

      {err && <p className="mt-3 text-sm text-red-500">{err}</p>}
      {loading && <p className="mt-4 text-sm text-slate-500">Loading portfolio...</p>}

      {!loading && (
        <>
        <div className="mt-4 rounded-xl border border-slate-200/90 p-3 dark:border-slate-700/70">
        <p>Total value: <strong>${formatUsd(totals.value)}</strong></p>
        <p>Total cost: <strong>{totals.cost == null ? "-" : `$${formatUsd(totals.cost)}`}</strong></p>
        <p>PnL: <strong>{totals.pnl == null ? "-" : `$${formatUsd(totals.pnl)}`}</strong></p>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-700/70">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/40">
          <tr>
            <th className="px-3 py-2 text-left">Coin</th>
            <th className="px-3 py-2 text-right">Amount</th>
            <th className="px-3 py-2 text-right">Price</th>
            <th className="px-3 py-2 text-right">Value</th>
            <th className="px-3 py-2 text-right">Avg Cost</th>
            <th className="px-3 py-2 text-right">PnL</th>
            <th className="px-3 py-2 text-right">Action</th>
          </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const price = r.market?.current_price ?? 0;
              const value = r.amount * price;
              const cost = r.avg_cost_usd == null ? null : r.amount * r.avg_cost_usd;
              const pnl = cost == null ? null : value - cost;

              return(
                <tr key={r.coin_id} className="border-t border-slate-200/80 dark:border-slate-700/70">
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-right">{r.coin_id}</td>
                  <td className="px-3 py-2 text-right">{r.amount}</td>
                  <td className="px-3 py-2 text-right">${formatUsd(price)}</td>
                  <td className="px-3 py-2 text-right">${formatUsd(value)}</td>
                  <td className="px-3 py-2 text-right">{r.avg_cost_usd == null ? "-" : `$${formatUsd(r.avg_cost_usd)}`}</td>
                  <td className="px-3 py-2 text-right">{pnl == null ? "-" : `$${formatUsd(pnl)}`}</td>
                  <td className="px-3 py-2 text-right">
                    <button onClick={() => onDelete(r.coin_id)} className="rounded border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                  No positions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
        </>
      )}
    </div>
  );
}

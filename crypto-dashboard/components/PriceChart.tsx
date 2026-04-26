"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";

export function PriceChart({ prices}: {prices: [number, number][] }) {
    const data = prices.map(([t, p]) => ({
        label: new Date(t).toLocaleDateString(),
        t,
        price: p,
    }));

    if (data.length === 0) {
        return <p className="text-zinc-500 text-sm">
            No price data.
        </p>;
    }

    return (
        <div className="h-[320px] w-full min-w-0 min-h-[320px]">
            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
                        <XAxis dataKey="t"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={(ms) => new Date(ms).toLocaleDateString(undefined, {month: "short", day: "numeric"})}
                        className="text-xs"
                        minTickGap={24}
                        />
                        <YAxis dataKey="price"
                        domain={["auto", "auto"]}
                        tickFormatter={(v) => 
                            v < 1 ? v.toFixed(4) : v.toLocaleString(undefined, { maximumFractionDigits: 2})
                        }
                        width={64}
                        className="text-xs"
                        />
                        <Tooltip
                             formatter={(value) => {
                                const n = typeof value === "number" ? value : Number(value);
                                if (value == null || Number.isNaN(n)) {
                                  return ["—", "Price"];
                                }
                                return [`$${n.toLocaleString()}`, "Price"];
                              }}
                           labelFormatter={(_, p) => {
                           const row = p?.[0]?.payload as { t?: number } | undefined;
                           if (!row?.t) return "";
                           return new Date(row.t).toLocaleDateString();
                        }}
                        />
                        <Line
                        type="monotone"
                        dataKey="price"
                        stroke="rgb(37 99 235)"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={true}
                        />
                        </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
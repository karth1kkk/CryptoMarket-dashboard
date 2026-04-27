"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GRID = "#334155";
const AXIS = "#94a3b8";
const LINE = "#38bdf8";

type Props = { prices: [number, number][] };

export function PriceChart({ prices }: Props) {
  const data = prices.map(([t, p]) => ({
    t,
    price: p,
  }));

  if (data.length === 0) {
    return (
      <p className="text-sm text-slate-500" role="status">
        No price data.
      </p>
    );
  }

  return (
    <div className="h-[300px] w-full min-w-0 min-h-[300px]">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
          <XAxis
            dataKey="t"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fill: AXIS, fontSize: 11 }}
            tickFormatter={(ms) =>
              new Date(ms).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            minTickGap={28}
            stroke={GRID}
          />
          <YAxis
            dataKey="price"
            domain={["auto", "auto"]}
            tick={{ fill: AXIS, fontSize: 11 }}
            tickFormatter={(v) =>
              v < 1
                ? v.toFixed(4)
                : v.toLocaleString(undefined, { maximumFractionDigits: 2 })
            }
            width={68}
            stroke={GRID}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgb(15 23 42 / 0.95)",
              border: "1px solid rgb(51 65 85)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#e2e8f0" }}
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
              return new Date(row.t).toLocaleString();
            }}
          />
          <Line
            type="natural"
            dataKey="price"
            stroke={LINE}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive
            activeDot={{ r: 3, stroke: LINE, fill: "rgb(15 23 42)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

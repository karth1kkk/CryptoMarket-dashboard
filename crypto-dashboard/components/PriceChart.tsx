"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LIGHT = {
  grid: "#e2e8f0",
  axis: "#64748b",
  line: "#059669",
  fill: "#ffffff",
  tooltipBg: "rgba(255,255,255,0.97)",
  tooltipBorder: "#e2e8f0",
  label: "#0f172a",
};

const DARK = {
  grid: "#334155",
  axis: "#94a3b8",
  line: "#34d399",
  fill: "rgb(15 23 42)",
  tooltipBg: "rgb(15 23 42 / 0.97)",
  tooltipBorder: "rgb(51 65 85)",
  label: "#e2e8f0",
};

type Props = { prices: [number, number][] };

export function PriceChart({ prices }: Props) {
  const { resolvedTheme } = useTheme();

  const c = useMemo(
    () => (resolvedTheme === "light" ? LIGHT : DARK),
    [resolvedTheme]
  );

  const data = prices.map(([t, p]) => ({
    t,
    price: p,
  }));

  if (data.length === 0) {
    return (
      <p className="text-sm text-slate-500 dark:text-slate-500" role="status">
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
          <CartesianGrid stroke={c.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="t"
            type="number"
            domain={["dataMin", "dataMax"]}
            tick={{ fill: c.axis, fontSize: 11 }}
            tickFormatter={(ms) =>
              new Date(ms).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })
            }
            minTickGap={28}
            stroke={c.grid}
          />
          <YAxis
            dataKey="price"
            domain={["auto", "auto"]}
            tick={{ fill: c.axis, fontSize: 11 }}
            tickFormatter={(v) =>
              v < 1
                ? v.toFixed(4)
                : v.toLocaleString(undefined, { maximumFractionDigits: 2 })
            }
            width={68}
            stroke={c.grid}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: c.tooltipBg,
              border: `1px solid ${c.tooltipBorder}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: c.label }}
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
            stroke={c.line}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive
            activeDot={{ r: 3, stroke: c.line, fill: c.fill }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

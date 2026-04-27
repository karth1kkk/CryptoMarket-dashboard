"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";

type Props = {
  prices: number[];
  className?: string;
  /** up = green stroke, down = red */
  positive?: boolean | null;
};

export function Sparkline({ prices, className = "", positive }: Props) {
  const list = prices?.filter((p) => Number.isFinite(p)) ?? [];
  if (list.length < 2) {
    return (
      <div
        className={`h-9 w-[88px] rounded bg-slate-100/80 dark:bg-slate-800/50 ${className}`}
        aria-hidden
      />
    );
  }
  const first = list[0]!;
  const last = list[list.length - 1]!;
  const up = positive != null ? positive : last >= first;
  const stroke = up ? "rgb(16 185 129)" : "rgb(239 68 68)";
  const data = list.map((p, i) => ({ i, p }));

  return (
    <div className={`h-9 w-[88px] ${className}`} aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="p"
            stroke={stroke}
            strokeWidth={1.25}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

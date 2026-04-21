"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { revenueData } from "@/lib/data";

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Revenue Overview</h2>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={revenueData}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
  formatter={(value: any) => [
    `$${Number(value ?? 0).toLocaleString()}`,
    "Revenue"
  ]}
/>
          <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGrad)" dot={{ fill: "#6366f1", r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
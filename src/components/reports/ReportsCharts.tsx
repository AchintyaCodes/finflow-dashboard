"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#6366f1","#8b5cf6","#a78bfa","#c4b5fd","#ddd6fe","#ede9fe"];

type Props = {
  monthlyData: { month: string; revenue: number; expenses: number }[];
  clientRevenue: { name: string; value: number }[];
};

export default function ReportsCharts({ monthlyData, clientRevenue }: Props) {
  const profitData = monthlyData.map(d => ({ month: d.month, profit: d.revenue - d.expenses }));

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Revenue by Month</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip formatter={(v: unknown) => [`$${Number(v ?? 0).toLocaleString()}`, "Revenue"]} />
            <Bar dataKey="revenue" fill="#6366f1" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Net Profit Trend</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={profitData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip formatter={(v: unknown) => [`$${Number(v ?? 0).toLocaleString()}`, "Profit"]} />
            <Line type="monotone" dataKey="profit" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm col-span-2">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Revenue by Client</h2>
        {clientRevenue.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No paid invoices yet.</p>
        ) : (
          <div className="flex items-center gap-8">
            <PieChart width={200} height={200}>
              <Pie data={clientRevenue} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {clientRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: unknown) => [`$${Number(v ?? 0).toLocaleString()}`, "Revenue"]} />
            </PieChart>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {clientRevenue.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                  <span className="text-xs text-gray-600">{c.name}</span>
                  <span className="text-xs font-semibold text-gray-800 ml-auto">${(c.value/1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const monthlyData = [
  { month: "Nov", revenue: 9200,  expenses: 3100 },
  { month: "Dec", revenue: 11400, expenses: 4200 },
  { month: "Jan", revenue: 8700,  expenses: 2900 },
  { month: "Feb", revenue: 13500, expenses: 5100 },
  { month: "Mar", revenue: 15800, expenses: 4800 },
  { month: "Apr", revenue: 18240, expenses: 5600 },
];

const clientRevenue = [
  { name: "Bluewave",  value: 15200 },
  { name: "Nexora",    value: 12400 },
  { name: "Meridian",  value: 9800 },
  { name: "Vertex",    value: 7600 },
  { name: "Oakfield",  value: 4200 },
  { name: "Driftline", value: 3100 },
];

const COLORS = ["#6366f1","#8b5cf6","#a78bfa","#c4b5fd","#ddd6fe","#ede9fe"];

const profitData = monthlyData.map(d => ({
  month: d.month,
  profit: d.revenue - d.expenses,
}));

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main className="ml-60 pt-16 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Revenue",  value: "$76,840" },
            { label: "Total Expenses", value: "$25,700" },
            { label: "Net Profit",     value: "$51,140" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Revenue vs Expenses */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Revenue vs Expenses</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="revenue"  fill="#6366f1" radius={[4,4,0,0]} />
                <Bar dataKey="expenses" fill="#e0e7ff" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Net Profit Trend */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Net Profit Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Line type="monotone" dataKey="profit" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Client */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm col-span-2">
            <h2 className="text-sm font-semibold text-gray-800 mb-4">Revenue by Client</h2>
            <div className="flex items-center gap-8">
              <PieChart width={200} height={200}>
                <Pie data={clientRevenue} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {clientRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              </PieChart>
              <div className="grid grid-cols-2 gap-2 flex-1">
                {clientRevenue.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                    <span className="text-xs text-gray-600">{c.name}</span>
                    <span className="text-xs font-semibold text-gray-800 ml-auto">${(c.value/1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useState } from "react";
import { Users, TrendingUp, Star, Clock } from "lucide-react";

const clients = [
  { name: "Nexora Studio",  email: "hello@nexora.io",     revenue: "$12,400", projects: 3, status: "Active",   rating: 5, since: "Jan 2024" },
  { name: "Meridian Labs",  email: "work@meridian.co",    revenue: "$9,800",  projects: 2, status: "Active",   rating: 4, since: "Mar 2024" },
  { name: "Oakfield Co.",   email: "oak@oakfield.com",    revenue: "$4,200",  projects: 1, status: "Inactive", rating: 3, since: "Aug 2023" },
  { name: "Vertex Media",   email: "hi@vertexmedia.io",   revenue: "$7,600",  projects: 4, status: "Active",   rating: 5, since: "Nov 2023" },
  { name: "Bluewave Inc.",  email: "team@bluewave.com",   revenue: "$15,200", projects: 5, status: "Active",   rating: 5, since: "Jun 2023" },
  { name: "Driftline Co.",  email: "contact@driftline.co",revenue: "$3,100",  projects: 1, status: "Pending",  rating: 4, since: "Feb 2024" },
];

const statusStyle: Record<string, string> = {
  Active:   "bg-emerald-50 text-emerald-600",
  Inactive: "bg-gray-100 text-gray-500",
  Pending:  "bg-amber-50 text-amber-600",
};

export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main className="ml-60 pt-16 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users,      label: "Total Clients",   value: "6",      sub: "+2 this quarter" },
            { icon: TrendingUp, label: "Total Revenue",   value: "$52,300", sub: "across all clients" },
            { icon: Star,       label: "Avg Rating",      value: "4.3 / 5", sub: "based on 6 clients" },
          ].map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <Icon size={18} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">All Clients</h2>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-300 w-48"
            />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                {["Client","Email","Revenue","Projects","Since","Rating","Status"].map(h => (
                  <th key={h} className="text-left pb-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-semibold text-gray-800">{c.name}</td>
                  <td className="py-3 text-gray-400">{c.email}</td>
                  <td className="py-3 font-medium text-indigo-600">{c.revenue}</td>
                  <td className="py-3 text-gray-600">{c.projects}</td>
                  <td className="py-3 text-gray-400">{c.since}</td>
                  <td className="py-3 text-amber-400">{"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
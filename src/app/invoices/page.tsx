"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useState } from "react";

const allInvoices = [
  { id: "INV-041", client: "Nexora Studio",  project: "Brand Redesign",  issued: "Apr 20", due: "Apr 30", amount: "$3,200", status: "Pending" },
  { id: "INV-040", client: "Meridian Labs",   project: "Web App Dev",     issued: "Apr 10", due: "Apr 22", amount: "$5,500", status: "Paid" },
  { id: "INV-039", client: "Oakfield Co.",    project: "SEO Audit",       issued: "Apr 5",  due: "Apr 18", amount: "$900",   status: "Overdue" },
  { id: "INV-038", client: "Vertex Media",    project: "Social Campaign", issued: "Apr 1",  due: "Apr 15", amount: "$2,100", status: "Paid" },
  { id: "INV-037", client: "Bluewave Inc.",   project: "Dashboard UI",    issued: "Mar 25", due: "Apr 10", amount: "$4,800", status: "Paid" },
  { id: "INV-036", client: "Driftline Co.",   project: "Mobile App",      issued: "Mar 20", due: "Apr 5",  amount: "$2,000", status: "Pending" },
  { id: "INV-035", client: "Nexora Studio",  project: "Logo Design",     issued: "Mar 10", due: "Mar 25", amount: "$800",   status: "Paid" },
];

const statusStyle: Record<string, string> = {
  Paid:    "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-red-50 text-red-500",
};

export default function InvoicesPage() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Paid", "Pending", "Overdue"];
  const shown = filter === "All" ? allInvoices : allInvoices.filter(i => i.status === filter);

  const total    = allInvoices.reduce((s, i) => s + parseInt(i.amount.replace(/\D/g, "")), 0);
  const paid     = allInvoices.filter(i => i.status === "Paid").reduce((s, i) => s + parseInt(i.amount.replace(/\D/g, "")), 0);
  const pending  = allInvoices.filter(i => i.status !== "Paid").reduce((s, i) => s + parseInt(i.amount.replace(/\D/g, "")), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main className="ml-60 pt-16 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Invoiced", value: `$${total.toLocaleString()}`, color: "text-gray-800" },
            { label: "Collected",      value: `$${paid.toLocaleString()}`,  color: "text-emerald-600" },
            { label: "Outstanding",    value: `$${pending.toLocaleString()}`, color: "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">All Invoices</h2>
            <div className="flex gap-1">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1 rounded-full transition-all ${
                    filter === f
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                {["Invoice","Client","Project","Issued","Due","Amount","Status"].map(h => (
                  <th key={h} className="text-left pb-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 text-indigo-500 font-medium">{inv.id}</td>
                  <td className="py-2.5 text-gray-700">{inv.client}</td>
                  <td className="py-2.5 text-gray-400">{inv.project}</td>
                  <td className="py-2.5 text-gray-400">{inv.issued}</td>
                  <td className="py-2.5 text-gray-500">{inv.due}</td>
                  <td className="py-2.5 font-semibold text-gray-800">{inv.amount}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[inv.status]}`}>
                      {inv.status}
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
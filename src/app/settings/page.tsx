"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useState } from "react";

export default function SettingsPage() {
  const [name, setName]         = useState("Achintya");
  const [email, setEmail]       = useState("achintya@finflow.dev");
  const [currency, setCurrency] = useState("USD");
  const [saved, setSaved]       = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main className="ml-60 pt-16 p-6 space-y-6 max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-gray-800">Profile Settings</h2>

          {[
            { label: "Full Name",     value: name,     setter: setName },
            { label: "Email Address", value: email,    setter: setEmail },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="text-xs text-gray-400 font-medium block mb-1">{label}</label>
              <input
                value={value}
                onChange={e => setter(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1">Currency</label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {["USD","EUR","GBP","INR"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <button
            onClick={handleSave}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
          {[
            "Email me when an invoice is overdue",
            "Email me when a client pays",
            "Weekly revenue summary",
          ].map((label) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{label}</span>
              <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
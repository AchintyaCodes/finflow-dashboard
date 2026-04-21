"use client";

import { useState, useRef } from "react";
import { updateSettings } from "@/app/actions/data";
import type { User } from "@/lib/auth";

export default function SettingsForm({ user }: { user: User }) {
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    const fd = new FormData(formRef.current!);
    await updateSettings(fd);
    setPending(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
          <h2 className="text-sm font-semibold text-gray-800">Profile Settings</h2>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1">Full Name</label>
            <input
              name="name"
              defaultValue={user.name}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1">Email Address</label>
            <input
              value={user.email}
              disabled
              className="w-full border border-gray-100 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium block mb-1">Currency</label>
            <select
              name="currency"
              defaultValue={user.currency}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {["USD","EUR","GBP","INR"].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <button
            type="submit"
            disabled={pending}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            } disabled:opacity-60`}
          >
            {saved ? "✓ Saved!" : pending ? "Saving…" : "Save Changes"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 mt-6">
          <h2 className="text-sm font-semibold text-gray-800">Notifications</h2>
          {[
            { name: "notify_overdue", label: "Email me when an invoice is overdue", defaultChecked: !!user.notify_overdue },
            { name: "notify_paid",    label: "Email me when a client pays",          defaultChecked: !!user.notify_paid },
            { name: "notify_weekly",  label: "Weekly revenue summary",               defaultChecked: !!user.notify_weekly },
          ].map(({ name, label, defaultChecked }) => (
            <div key={name} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{label}</span>
              <input type="checkbox" name={name} defaultChecked={defaultChecked} className="accent-indigo-600 w-4 h-4" />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
}

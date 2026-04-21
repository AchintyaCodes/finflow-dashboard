"use client";

import { useState, useRef } from "react";
import { addClient } from "@/app/actions/data";
import { Plus, X } from "lucide-react";

export default function AddClientModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(formRef.current!);
    const result = await addClient(fd);
    setPending(false);
    if (result?.error) { setError(result.error); return; }
    setOpen(false);
    formRef.current?.reset();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
      >
        <Plus size={13} /> Add Client
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-800">New Client</h2>
              <button onClick={() => setOpen(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              {[
                { name: "name", label: "Name", type: "text", placeholder: "Acme Corp" },
                { name: "email", label: "Email", type: "email", placeholder: "hello@acme.com" },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-xs text-gray-500 font-medium block mb-1">{f.label}</label>
                  <input name={f.name} type={f.type} placeholder={f.placeholder} required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Status</label>
                  <select name="status" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300">
                    {["Active","Inactive","Pending"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Rating (1–5)</label>
                  <input name="rating" type="number" min="1" max="5" defaultValue="5" required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
              {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-xl hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={pending}
                  className="flex-1 bg-indigo-600 text-white text-sm py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-60">
                  {pending ? "Saving…" : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useRef } from "react";
import { addProject } from "@/app/actions/data";
import { Plus, X } from "lucide-react";

type Client = { id: number; name: string };

export default function AddProjectModal({ clients }: { clients: Client[] }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(formRef.current!);
    const result = await addProject(fd);
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
        <Plus size={13} /> Add Project
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-gray-800">New Project</h2>
              <button onClick={() => setOpen(false)}><X size={16} className="text-gray-400" /></button>
            </div>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1">Project Name</label>
                <input name="name" type="text" placeholder="Brand Redesign" required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1">Client</label>
                <select name="client_id" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300">
                  <option value="">— No client —</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Stage</label>
                  <select name="stage" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300">
                    {["Proposal","In Progress","Review","Paid"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Value ($)</label>
                  <input name="value" type="number" min="0" placeholder="5000" required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Deadline</label>
                  <input name="deadline" type="date"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Progress (%)</label>
                  <input name="progress" type="number" min="0" max="100" defaultValue="0"
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
                  {pending ? "Saving…" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

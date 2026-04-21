"use client";

import { updateInvoiceStatus, deleteInvoice } from "@/app/actions/data";
import { Trash2, CheckCircle } from "lucide-react";

export default function InvoiceActions({ id, currentStatus }: { id: number; currentStatus: string }) {
  return (
    <div className="flex items-center gap-2">
      {currentStatus !== "Paid" && (
        <form action={async () => { await updateInvoiceStatus(id, "Paid"); }}>
          <button type="submit" className="text-gray-300 hover:text-emerald-500 transition-colors" title="Mark as paid">
            <CheckCircle size={14} />
          </button>
        </form>
      )}
      <form action={async () => { await deleteInvoice(id); }}>
        <button type="submit" className="text-gray-300 hover:text-red-400 transition-colors" title="Delete invoice">
          <Trash2 size={14} />
        </button>
      </form>
    </div>
  );
}

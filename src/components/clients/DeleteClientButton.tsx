"use client";

import { deleteClient } from "@/app/actions/data";
import { Trash2 } from "lucide-react";

export default function DeleteClientButton({ id }: { id: number }) {
  return (
    <form action={async () => { await deleteClient(id); }}>
      <button type="submit" className="text-gray-300 hover:text-red-400 transition-colors" title="Delete client">
        <Trash2 size={14} />
      </button>
    </form>
  );
}

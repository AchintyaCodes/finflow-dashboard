"use client";

import { deleteProject } from "@/app/actions/data";
import { Trash2 } from "lucide-react";

export default function DeleteProjectButton({ id }: { id: number }) {
  return (
    <form action={async () => { await deleteProject(id); }}>
      <button type="submit" className="text-gray-300 hover:text-red-400 transition-colors" title="Delete project">
        <Trash2 size={13} />
      </button>
    </form>
  );
}

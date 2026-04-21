"use client";

import { logoutAction } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
        title="Sign out"
      >
        <LogOut size={15} />
        <span className="hidden sm:inline">Sign out</span>
      </button>
    </form>
  );
}

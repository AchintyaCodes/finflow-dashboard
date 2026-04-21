"use client";

import { Bell, Calendar } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-60 right-0 z-10">
      <div>
        <h1 className="text-sm font-semibold text-gray-800">Good morning, Achintya 👋</h1>
        <p className="text-xs text-gray-400">Tuesday, Apr 22nd 2025</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
          <Calendar size={14} />
          Last 6 Months
        </button>
        <button className="relative text-gray-400 hover:text-gray-600">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
          A
        </div>
      </div>
    </header>
  );
}
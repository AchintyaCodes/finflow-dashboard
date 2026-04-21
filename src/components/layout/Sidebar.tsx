"use client";

import Link from "next/link";
import { LayoutDashboard, Users, FolderKanban, FileText, BarChart3, Settings } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-60 bg-slate-900 flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <span className="text-white font-semibold text-lg tracking-tight">
          Fin<span className="text-indigo-400">Flow</span>
        </span>
        <p className="text-slate-400 text-xs mt-0.5">Freelancer Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs">Enterprise · Pay as you go</p>
      </div>
    </aside>
  );
}
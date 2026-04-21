"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FolderKanban,
  FileText, BarChart3, Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/",         icon: LayoutDashboard },
  { label: "Clients",   href: "/clients",  icon: Users },
  { label: "Projects",  href: "/projects", icon: FolderKanban },
  { label: "Invoices",  href: "/invoices", icon: FileText },
  { label: "Reports",   href: "/reports",  icon: BarChart3 },
  { label: "Settings",  href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-60 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20">
      <div className="px-6 py-5 border-b border-slate-800">
        <span className="text-gray-900 font-bold text-xl tracking-tight">
          Fin<span className="text-indigo-400">Flow</span>
        </span>
        <p className="text-gray-400 text-xs mt-0.5">Freelancer Dashboard</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
  ? "bg-gray-100 text-gray-900 font-medium"
  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center text-gray-900 text-xs font-bold">A</div>
          <div>
            <p className="text-gray-900 text-xs font-medium">Achintya</p>
            <p className="text-gray-400 text-xs">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function TopBar() {
  const user = await requireUser();
  const initial = user.name.charAt(0).toUpperCase();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-60 right-0 z-10">
      <div>
        <h1 className="text-sm font-semibold text-gray-800">
          {greeting}, {user.name} 👋
        </h1>
        <p className="text-xs text-gray-400">{dateStr}</p>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-gray-600">
          <Bell size={18} />
        </button>
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
          {initial}
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

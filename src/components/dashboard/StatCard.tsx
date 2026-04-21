import { StatItem } from "@/types";

const trendConfig = {
  up:   { arrow: "↑", bg: "bg-emerald-50", text: "text-emerald-600" },
  down: { arrow: "↓", bg: "bg-red-50",     text: "text-red-500"     },
};

export default function StatCard({ label, value, trend, up }: StatItem) {
  const cfg = up ? trendConfig.up : trendConfig.down;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
          {cfg.arrow} {trend}
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      <p className="text-xs text-gray-400 mt-1">vs last period</p>
    </div>
  );
}
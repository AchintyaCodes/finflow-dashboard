"use client";

import {
  Radar, RadarChart, PolarGrid, Legend,
  PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";

const data = [
  { feature: "Invoicing", mobile: 95,  desktop: 120, max: 150 },
  { feature: "Clients",   mobile: 130, desktop: 85,  max: 150 },
  { feature: "Reports",   mobile: 80,  desktop: 140, max: 150 },
  { feature: "Projects",  mobile: 120, desktop: 60,  max: 150 },
  { feature: "Earnings",  mobile: 148, desktop: 95,  max: 150 },
];

export default function UsageRadar() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full flex flex-col">
      <h2 className="text-sm font-semibold text-gray-800 mb-4">Usage Overview</h2>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="feature" tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fontSize: 9, fill: "#d1d5db" }} />
            <Radar name="Mobile"  dataKey="mobile"  stroke="#1e1b4b" fill="#1e1b4b" fillOpacity={0.15} />
            <Radar name="Desktop" dataKey="desktop" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
            <Tooltip wrapperClassName="text-xs rounded-xl" />
            <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
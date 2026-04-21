"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

const projects = [
  { name: "Brand Redesign",  client: "Nexora Studio", stage: "Review",      value: "$3,200", deadline: "Apr 30", progress: 80 },
  { name: "Web App Dev",     client: "Meridian Labs",  stage: "In Progress", value: "$5,500", deadline: "May 15", progress: 55 },
  { name: "SEO Audit",       client: "Oakfield Co.",   stage: "Paid",        value: "$900",   deadline: "Apr 18", progress: 100 },
  { name: "Mobile App",      client: "Driftline Co.",  stage: "Proposal",    value: "$7,000", deadline: "Jun 1",  progress: 10 },
  { name: "Social Campaign", client: "Vertex Media",   stage: "Paid",        value: "$2,100", deadline: "Apr 15", progress: 100 },
  { name: "Dashboard UI",    client: "Bluewave Inc.",  stage: "In Progress", value: "$4,800", deadline: "May 20", progress: 40 },
];

const stageStyle: Record<string, string> = {
  Proposal:      "bg-slate-100 text-slate-600",
  "In Progress": "bg-indigo-50 text-indigo-600",
  Review:        "bg-amber-50 text-amber-600",
  Paid:          "bg-emerald-50 text-emerald-600",
};

const progressColor: Record<string, string> = {
  Proposal:      "bg-slate-300",
  "In Progress": "bg-indigo-400",
  Review:        "bg-amber-400",
  Paid:          "bg-emerald-400",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <TopBar />
      <main className="ml-60 pt-16 p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Projects", value: "6" },
            { label: "In Progress",    value: "2" },
            { label: "Total Value",    value: "$23,500" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.name} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.client}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stageStyle[p.stage]}`}>
                  {p.stage}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Due {p.deadline}</span>
                <span className="font-semibold text-indigo-600">{p.value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${progressColor[p.stage]}`}
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">{p.progress}% complete</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
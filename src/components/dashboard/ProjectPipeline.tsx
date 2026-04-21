import { projects } from "@/lib/data";

const stages = ["Proposal", "In Progress", "Review", "Paid"] as const;

const stageStyles: Record<string, string> = {
  Proposal: "bg-slate-100 text-slate-600",
  "In Progress": "bg-indigo-50 text-indigo-600",
  Review: "bg-amber-50 text-amber-600",
  Paid: "bg-emerald-50 text-emerald-600",
};

export default function ProjectPipeline() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">Project Pipeline</h2>
      <div className="grid grid-cols-4 gap-3">
        {stages.map((stage) => (
          <div key={stage} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-400 mb-2">{stage}</p>
            <div className="space-y-2">
              {projects
                .filter((p) => p.stage === stage)
                .map((p) => (
                  <div key={p.name} className="bg-white rounded-lg p-2.5 border border-gray-100 shadow-sm">
                    <p className="text-xs font-medium text-gray-700">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.client}</p>
                    <p className="text-xs font-semibold text-indigo-500 mt-1">{p.value}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
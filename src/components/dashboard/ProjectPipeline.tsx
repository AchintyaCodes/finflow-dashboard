import { projects } from "@/lib/data";

const stages = ["Proposal", "In Progress", "Review", "Paid"] as const;

const stageConfig: Record<string, { color: string; dot: string; bg: string }> = {
  Proposal:      { color: "text-slate-500",   dot: "bg-slate-300",   bg: "bg-slate-50" },
  "In Progress": { color: "text-indigo-600",  dot: "bg-indigo-400",  bg: "bg-indigo-50" },
  Review:        { color: "text-amber-600",   dot: "bg-amber-400",   bg: "bg-amber-50" },
  Paid:          { color: "text-emerald-600", dot: "bg-emerald-400", bg: "bg-emerald-50" },
};

export default function ProjectPipeline() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-gray-800">Project Pipeline</h2>
        <span className="text-xs text-gray-400">{projects.length} active</span>
      </div>
      <div className="flex flex-col gap-2 flex-1">
        {stages.map((stage) => {
          const items = projects.filter((p) => p.stage === stage);
          const cfg = stageConfig[stage];
          return (
            <div key={stage}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                <span className={`text-xs font-medium ${cfg.color}`}>{stage}</span>
                <span className="text-xs text-gray-300 ml-auto">{items.length}</span>
              </div>
              {items.map((p) => (
                <div key={p.name} className={`rounded-xl px-3 py-2.5 mb-1.5 ${cfg.bg} flex items-center justify-between`}>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{p.client}</p>
                  </div>
                  <span className={`text-xs font-bold ${cfg.color}`}>{p.value}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
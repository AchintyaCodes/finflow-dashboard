import AppShell from "@/components/layout/AppShell";
import { requireUser } from "@/lib/auth";
import sql from "@/lib/db";
import AddProjectModal from "@/components/projects/AddProjectModal";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";

export const dynamic = "force-dynamic";

const stageStyle: Record<string, string> = {
  Proposal:      "bg-slate-100 text-slate-600",
  "In Progress": "bg-indigo-50 text-indigo-600",
  Review:        "bg-amber-50 text-amber-600",
  Paid:          "bg-emerald-50 text-emerald-600",
};
const progressColor: Record<string, string> = {
  Proposal: "bg-slate-300", "In Progress": "bg-indigo-400", Review: "bg-amber-400", Paid: "bg-emerald-400",
};

export default async function ProjectsPage() {
  const user = await requireUser();
  const db = sql();

  const [projectRows, clientRows] = await Promise.all([
    db`SELECT p.id, p.name, c.name as client, p.stage, p.value, p.deadline, p.progress
        FROM projects p LEFT JOIN clients c ON p.client_id = c.id
        WHERE p.user_id = ${user.id} ORDER BY p.created_at DESC`,
    db`SELECT id, name FROM clients WHERE user_id = ${user.id}`,
  ]);

  const projects = projectRows as any[];
  const clients = clientRows as any[];
  const totalValue = projects.reduce((s, p) => s + Number(p.value), 0);
  const inProgress = projects.filter(p => p.stage === "In Progress").length;

  return (
    <AppShell>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Projects", value: String(projects.length) },
          { label: "In Progress",    value: String(inProgress) },
          { label: "Total Value",    value: `$${totalValue.toLocaleString()}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-800">All Projects</h2>
        <AddProjectModal clients={clients} />
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400">No projects yet.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {projects.map((p: any) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.client ?? "No client"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stageStyle[p.stage]}`}>{p.stage}</span>
                  <DeleteProjectButton id={p.id} />
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>{p.deadline ? `Due ${new Date(p.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "No deadline"}</span>
                <span className="font-semibold text-indigo-600">${Number(p.value).toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-700 ${progressColor[p.stage]}`} style={{ width: `${p.progress}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">{p.progress}% complete</p>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

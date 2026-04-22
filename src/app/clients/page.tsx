import AppShell from "@/components/layout/AppShell";
import { requireUser } from "@/lib/auth";
import sql from "@/lib/db";
import { Users, TrendingUp, Star } from "lucide-react";
import AddClientModal from "@/components/clients/AddClientModal";
import DeleteClientButton from "@/components/clients/DeleteClientButton";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  Active:   "bg-emerald-50 text-emerald-600",
  Inactive: "bg-gray-100 text-gray-500",
  Pending:  "bg-amber-50 text-amber-600",
};

export default async function ClientsPage() {
  const user = await requireUser();
  const db = sql();

  const clients = await db`
    SELECT c.id, c.name, c.email, c.status, c.rating, c.since,
           COUNT(DISTINCT p.id) as projects,
           COALESCE(SUM(i.amount), 0) as revenue
    FROM clients c
    LEFT JOIN projects p ON p.client_id = c.id
    LEFT JOIN invoices i ON i.client_id = c.id AND i.status = 'Paid'
    WHERE c.user_id = ${user.id}
    GROUP BY c.id ORDER BY revenue DESC
  ` as any[];

  const totalRevenue = clients.reduce((s: number, c: any) => s + Number(c.revenue), 0);
  const avgRating = clients.length
    ? (clients.reduce((s: number, c: any) => s + c.rating, 0) / clients.length).toFixed(1)
    : "0.0";

  return (
    <AppShell>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users,      label: "Total Clients", value: String(clients.length),              sub: "in your account" },
          { icon: TrendingUp, label: "Total Revenue",  value: `$${totalRevenue.toLocaleString()}`, sub: "from paid invoices" },
          { icon: Star,       label: "Avg Rating",     value: `${avgRating} / 5`,                 sub: "across all clients" },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Icon size={18} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">All Clients</h2>
          <AddClientModal />
        </div>
        {clients.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No clients yet. Add your first one!</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                {["Client","Email","Revenue","Projects","Since","Rating","Status",""].map(h => (
                  <th key={h} className="text-left pb-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c: any) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-semibold text-gray-800">{c.name}</td>
                  <td className="py-3 text-gray-400">{c.email}</td>
                  <td className="py-3 font-medium text-indigo-600">${Number(c.revenue).toLocaleString()}</td>
                  <td className="py-3 text-gray-600">{c.projects}</td>
                  <td className="py-3 text-gray-400">{c.since}</td>
                  <td className="py-3 text-amber-400">{"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[c.status]}`}>{c.status}</span>
                  </td>
                  <td className="py-3"><DeleteClientButton id={c.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}

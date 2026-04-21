import AppShell from "@/components/layout/AppShell";
import { requireUser } from "@/lib/auth";
import db from "@/lib/db";
import ReportsCharts from "@/components/reports/ReportsCharts";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await requireUser();

  const totalRevenue = (db.prepare(
    "SELECT COALESCE(SUM(amount),0) as v FROM invoices WHERE user_id = ? AND status = 'Paid'"
  ).get(user.id) as { v: number }).v;

  const totalOutstanding = (db.prepare(
    "SELECT COALESCE(SUM(amount),0) as v FROM invoices WHERE user_id = ? AND status != 'Paid'"
  ).get(user.id) as { v: number }).v;

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Monthly revenue (last 18 months) — derive month label in JS, not SQLite %b
  const monthlyRaw = db.prepare(`
    SELECT strftime('%Y-%m', issued_at) as ym,
           SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) as revenue
    FROM invoices
    WHERE user_id = ? AND issued_at >= date('now', '-18 months')
    GROUP BY strftime('%Y-%m', issued_at)
    ORDER BY ym ASC
  `).all(user.id) as { ym: string; revenue: number }[];

  const monthlyData = monthlyRaw.map(r => ({
    month: MONTHS[parseInt(r.ym.split("-")[1]) - 1],
    revenue: r.revenue,
    expenses: 0,
  }));

  // Revenue by client
  const clientRevenue = db.prepare(`
    SELECT c.name, COALESCE(SUM(i.amount), 0) as value
    FROM clients c
    LEFT JOIN invoices i ON i.client_id = c.id AND i.status = 'Paid'
    WHERE c.user_id = ?
    GROUP BY c.id
    ORDER BY value DESC
    LIMIT 6
  `).all(user.id) as { name: string; value: number }[];

  return (
    <AppShell>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Revenue",    value: `$${totalRevenue.toLocaleString()}` },
          { label: "Outstanding",      value: `$${totalOutstanding.toLocaleString()}` },
          { label: "Net Collected",    value: `$${totalRevenue.toLocaleString()}` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      <ReportsCharts monthlyData={monthlyData} clientRevenue={clientRevenue} />
    </AppShell>
  );
}

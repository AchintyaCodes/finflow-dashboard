import AppShell from "@/components/layout/AppShell";
import { requireUser } from "@/lib/auth";
import sql from "@/lib/db";
import ReportsCharts from "@/components/reports/ReportsCharts";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const user = await requireUser();
  const db = sql();

  const [revenueRows, outstandingRows, monthlyRaw, clientRevenueRows] = await Promise.all([
    db`SELECT COALESCE(SUM(amount),0) as v FROM invoices WHERE user_id = ${user.id} AND status = 'Paid'` as any[],
    db`SELECT COALESCE(SUM(amount),0) as v FROM invoices WHERE user_id = ${user.id} AND status != 'Paid'` as any[],
    db`SELECT TO_CHAR(issued_at, 'YYYY-MM') as ym,
               SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) as revenue
        FROM invoices WHERE user_id = ${user.id} AND issued_at >= NOW() - INTERVAL '18 months'
        GROUP BY ym ORDER BY ym ASC` as any[],
    db`SELECT c.name, COALESCE(SUM(i.amount), 0) as value
        FROM clients c
        LEFT JOIN invoices i ON i.client_id = c.id AND i.status = 'Paid'
        WHERE c.user_id = ${user.id}
        GROUP BY c.id, c.name ORDER BY value DESC LIMIT 6` as any[],
  ]);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyData = (monthlyRaw as any[]).map(r => ({
    month: MONTHS[parseInt(r.ym.split("-")[1]) - 1],
    revenue: Number(r.revenue),
    expenses: 0,
  }));

  const clientRevenue = (clientRevenueRows as any[]).map(r => ({
    name: r.name,
    value: Number(r.value),
  }));

  return (
    <AppShell>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Revenue",  value: `$${Number(revenueRows[0].v).toLocaleString()}` },
          { label: "Outstanding",    value: `$${Number(outstandingRows[0].v).toLocaleString()}` },
          { label: "Net Collected",  value: `$${Number(revenueRows[0].v).toLocaleString()}` },
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

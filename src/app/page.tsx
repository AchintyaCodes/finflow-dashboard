import AppShell from "@/components/layout/AppShell";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ClientTable from "@/components/dashboard/ClientTable";
import ProjectPipeline from "@/components/dashboard/ProjectPipeline";
import UsageRadar from "@/components/dashboard/UsageRadar";
import { requireUser } from "@/lib/auth";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

function toDateStr(val: unknown): string {
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return String(val ?? "");
}

export default async function Home() {
  const user = await requireUser();
  const db = sql();

  const [billedRows, clientRows, avgRows, unpaidRows, revenueRaw, invoiceRows, projectRows] = (await Promise.all([
    db`SELECT COALESCE(SUM(amount),0) as v FROM invoices WHERE user_id = ${user.id}`,
    db`SELECT COUNT(*) as v FROM clients WHERE user_id = ${user.id} AND status = 'Active'`,
    db`SELECT COALESCE(AVG(value),0) as v FROM projects WHERE user_id = ${user.id}`,
    db`SELECT COALESCE(SUM(amount),0) as v FROM invoices WHERE user_id = ${user.id} AND status != 'Paid'`,
    db`SELECT TO_CHAR(issued_at, 'YYYY-MM') as ym, SUM(amount) as revenue
        FROM invoices WHERE user_id = ${user.id} AND issued_at >= NOW() - INTERVAL '18 months'
        GROUP BY ym ORDER BY ym ASC`,
    db`SELECT i.id, c.name as client, p.name as project, i.invoice_number as id_num,
               i.due_at as due, i.amount, i.status
        FROM invoices i
        LEFT JOIN clients c ON i.client_id = c.id
        LEFT JOIN projects p ON i.project_id = p.id
        WHERE i.user_id = ${user.id} ORDER BY i.created_at DESC LIMIT 5`,
    db`SELECT p.id, p.name, c.name as client, p.stage, p.value
        FROM projects p LEFT JOIN clients c ON p.client_id = c.id
        WHERE p.user_id = ${user.id} ORDER BY p.created_at DESC LIMIT 8`,
  ])) as any[];

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const revenueData = (revenueRaw as any[]).map(r => ({
    month: MONTHS[parseInt(r.ym.split("-")[1]) - 1],
    revenue: Number(r.revenue),
  }));

  const stats = [
    { label: "Total Billed",      value: `$${Number(billedRows[0].v).toLocaleString()}`, trend: "all time",    up: true  },
    { label: "Active Clients",    value: String(clientRows[0].v),                         trend: "right now",   up: true  },
    { label: "Avg Project Value", value: `$${Math.round(Number(avgRows[0].v)).toLocaleString()}`, trend: "per project", up: true },
    { label: "Unpaid Invoices",   value: `$${Number(unpaidRows[0].v).toLocaleString()}`, trend: "outstanding", up: false },
  ];

  const invoices = (invoiceRows as any[]).map(i => ({
    id: i.id_num,
    client: i.client,
    project: i.project,
    due: toDateStr(i.due),
    amount: `$${Number(i.amount).toLocaleString()}`,
    status: i.status as "Paid" | "Pending" | "Overdue",
  }));

  const projects = (projectRows as any[]).map(p => ({
    name: p.name,
    client: p.client,
    stage: p.stage as "Proposal" | "In Progress" | "Review" | "Paid",
    value: `$${Number(p.value).toLocaleString()}`,
  }));

  return (
    <AppShell>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><RevenueChart data={revenueData} /></div>
        <UsageRadar />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2"><ClientTable invoices={invoices} /></div>
        <ProjectPipeline projects={projects} />
      </div>
    </AppShell>
  );
}

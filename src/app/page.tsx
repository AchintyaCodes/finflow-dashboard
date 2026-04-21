import AppShell from "@/components/layout/AppShell";
import StatCard from "@/components/dashboard/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import ClientTable from "@/components/dashboard/ClientTable";
import ProjectPipeline from "@/components/dashboard/ProjectPipeline";
import UsageRadar from "@/components/dashboard/UsageRadar";
import { requireUser } from "@/lib/auth";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await requireUser();

  // Real stats from DB
  const totalBilled = (db.prepare(
    "SELECT COALESCE(SUM(amount),0) as v FROM invoices WHERE user_id = ?"
  ).get(user.id) as { v: number }).v;

  const activeClients = (db.prepare(
    "SELECT COUNT(*) as v FROM clients WHERE user_id = ? AND status = 'Active'"
  ).get(user.id) as { v: number }).v;

  const avgProjectValue = (db.prepare(
    "SELECT COALESCE(AVG(value),0) as v FROM projects WHERE user_id = ?"
  ).get(user.id) as { v: number }).v;

  const unpaidTotal = (db.prepare(
    "SELECT COALESCE(SUM(amount),0) as v FROM invoices WHERE user_id = ? AND status != 'Paid'"
  ).get(user.id) as { v: number }).v;

  const stats = [
    { label: "Total Billed",       value: `$${totalBilled.toLocaleString()}`,   trend: "all time",   up: true },
    { label: "Active Clients",     value: String(activeClients),                trend: "right now",  up: true },
    { label: "Avg Project Value",  value: `$${Math.round(avgProjectValue).toLocaleString()}`, trend: "per project", up: true },
    { label: "Unpaid Invoices",    value: `$${unpaidTotal.toLocaleString()}`,   trend: "outstanding", up: false },
  ];

  // Revenue by month (last 6 months)
  const revenueData = db.prepare(`
    SELECT strftime('%b', issued_at) as month, SUM(amount) as revenue
    FROM invoices
    WHERE user_id = ? AND issued_at >= date('now', '-6 months')
    GROUP BY strftime('%Y-%m', issued_at)
    ORDER BY issued_at ASC
  `).all(user.id) as { month: string; revenue: number }[];

  // Recent invoices
  const invoices = db.prepare(`
    SELECT i.id, c.name as client, p.name as project, i.invoice_number as id_num,
           i.due_at as due, i.amount, i.status
    FROM invoices i
    LEFT JOIN clients c ON i.client_id = c.id
    LEFT JOIN projects p ON i.project_id = p.id
    WHERE i.user_id = ?
    ORDER BY i.created_at DESC LIMIT 5
  `).all(user.id) as { id: number; client: string; project: string; id_num: string; due: string; amount: number; status: string }[];

  // Projects pipeline
  const projects = db.prepare(`
    SELECT p.id, p.name, c.name as client, p.stage, p.value
    FROM projects p
    LEFT JOIN clients c ON p.client_id = c.id
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC LIMIT 8
  `).all(user.id) as { id: number; name: string; client: string; stage: string; value: number }[];

  return (
    <AppShell>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <UsageRadar />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ClientTable invoices={invoices.map(i => ({
            id: i.id_num,
            client: i.client,
            project: i.project,
            due: i.due,
            amount: `$${i.amount.toLocaleString()}`,
            status: i.status as "Paid" | "Pending" | "Overdue",
          }))} />
        </div>
        <ProjectPipeline projects={projects.map(p => ({
          name: p.name,
          client: p.client,
          stage: p.stage as "Proposal" | "In Progress" | "Review" | "Paid",
          value: `$${p.value.toLocaleString()}`,
        }))} />
      </div>
    </AppShell>
  );
}

import AppShell from "@/components/layout/AppShell";
import { requireUser } from "@/lib/auth";
import sql from "@/lib/db";
import AddInvoiceModal from "@/components/invoices/AddInvoiceModal";
import InvoiceActions from "@/components/invoices/InvoiceActions";

export const dynamic = "force-dynamic";

const statusStyle: Record<string, string> = {
  Paid:    "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-red-50 text-red-500",
};

export default async function InvoicesPage() {
  const user = await requireUser();
  const db = sql();

  const [invoiceRows, clientRows, projectRows] = await Promise.all([
  db`SELECT i.id, i.invoice_number, c.name as client, p.name as project,
     i.issued_at, i.due_at, i.amount, i.status
     FROM invoices i
     LEFT JOIN clients c ON i.client_id = c.id
     LEFT JOIN projects p ON i.project_id = p.id
     WHERE i.user_id = ${user.id} ORDER BY i.created_at DESC` as unknown as any[],

  db`SELECT id, name FROM clients WHERE user_id = ${user.id}` as unknown as any[],

  db`SELECT id, name FROM projects WHERE user_id = ${user.id}` as unknown as any[],
]);

const invoices = invoiceRows;
const clients  = clientRows;
const projects = projectRows;

  const total   = invoices.reduce((s, i) => s + Number(i.amount), 0);
  const paid    = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + Number(i.amount), 0);
  const pending = invoices.filter(i => i.status !== "Paid").reduce((s, i) => s + Number(i.amount), 0);

  return (
    <AppShell>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Invoiced", value: `$${total.toLocaleString()}`,   color: "text-gray-800" },
          { label: "Collected",      value: `$${paid.toLocaleString()}`,    color: "text-emerald-600" },
          { label: "Outstanding",    value: `$${pending.toLocaleString()}`, color: "text-amber-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-800">All Invoices</h2>
          <AddInvoiceModal clients={clients} projects={projects} />
        </div>
        {invoices.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No invoices yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100">
                {["Invoice","Client","Project","Issued","Due","Amount","Status",""].map(h => (
                  <th key={h} className="text-left pb-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv: any) => (
                <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 text-indigo-500 font-medium">{inv.invoice_number}</td>
                  <td className="py-2.5 text-gray-700">{inv.client ?? "—"}</td>
                  <td className="py-2.5 text-gray-400">{inv.project ?? "—"}</td>
                  <td className="py-2.5 text-gray-400">{new Date(inv.issued_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                  <td className="py-2.5 text-gray-500">{new Date(inv.due_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                  <td className="py-2.5 font-semibold text-gray-800">${Number(inv.amount).toLocaleString()}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle[inv.status]}`}>{inv.status}</span>
                  </td>
                  <td className="py-2.5"><InvoiceActions id={inv.id} currentStatus={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}

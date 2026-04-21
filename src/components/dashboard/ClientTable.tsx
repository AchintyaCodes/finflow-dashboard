import { invoices } from "@/lib/data";

const statusStyles: Record<string, string> = {
  Paid: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-red-50 text-red-500",
};

export default function ClientTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Recent Invoices</h2>
        <button className="text-xs text-indigo-500 hover:underline">See all</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-400 border-b border-gray-100">
            <th className="text-left pb-2 font-medium">Invoice</th>
            <th className="text-left pb-2 font-medium">Client</th>
            <th className="text-left pb-2 font-medium">Project</th>
            <th className="text-left pb-2 font-medium">Due</th>
            <th className="text-left pb-2 font-medium">Amount</th>
            <th className="text-left pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-2.5 text-indigo-500 font-medium">{inv.id}</td>
              <td className="py-2.5 text-gray-700">{inv.client}</td>
              <td className="py-2.5 text-gray-500">{inv.project}</td>
              <td className="py-2.5 text-gray-500">{inv.due}</td>
              <td className="py-2.5 text-gray-700 font-medium">{inv.amount}</td>
              <td className="py-2.5">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[inv.status]}`}>
                  {inv.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
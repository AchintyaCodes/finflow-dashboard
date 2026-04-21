import { StatItem, Invoice, RevenueData, Project } from "@/types";

export const stats: StatItem[] = [
  { label: "Monthly Billings", value: "$18,240", trend: "+12.4%", up: true },
  { label: "Active Clients", value: "9", trend: "+2", up: true },
  { label: "Avg Project Value", value: "$3,420", trend: "-4.1%", up: false },
  { label: "Unpaid Invoices", value: "$6,100", trend: "+1", up: false },
];

export const revenueData: RevenueData[] = [
  { month: "Nov", revenue: 9200 },
  { month: "Dec", revenue: 11400 },
  { month: "Jan", revenue: 8700 },
  { month: "Feb", revenue: 13500 },
  { month: "Mar", revenue: 15800 },
  { month: "Apr", revenue: 18240 },
];

export const invoices: Invoice[] = [
  { id: "INV-041", client: "Nexora Studio", project: "Brand Redesign", due: "Apr 30", amount: "$3,200", status: "Pending" },
  { id: "INV-040", client: "Meridian Labs", project: "Web App Dev", due: "Apr 22", amount: "$5,500", status: "Paid" },
  { id: "INV-039", client: "Oakfield Co.", project: "SEO Audit", due: "Apr 18", amount: "$900", status: "Overdue" },
  { id: "INV-038", client: "Vertex Media", project: "Social Campaign", due: "Apr 15", amount: "$2,100", status: "Paid" },
  { id: "INV-037", client: "Bluewave Inc.", project: "Dashboard UI", due: "Apr 10", amount: "$4,800", status: "Paid" },
];

export const projects: Project[] = [
  { name: "Brand Redesign", client: "Nexora Studio", stage: "Review", value: "$3,200" },
  { name: "Web App Dev", client: "Meridian Labs", stage: "In Progress", value: "$5,500" },
  { name: "SEO Audit", client: "Oakfield Co.", stage: "Paid", value: "$900" },
  { name: "Mobile App", client: "Driftline Co.", stage: "Proposal", value: "$7,000" },
];
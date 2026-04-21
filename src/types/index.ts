export type StatItem = {
  label: string;
  value: string;
  trend: string;
  up: boolean;
};

export type Invoice = {
  id: string;
  client: string;
  project: string;
  due: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
};

export type RevenueData = {
  month: string;
  revenue: number;
};

export type Project = {
  name: string;
  client: string;
  stage: "Proposal" | "In Progress" | "Review" | "Paid";
  value: string;
};
import "server-only";
import bcrypt from "bcryptjs";
import db from "./db";
import { createSession, deleteSession, getSession } from "./session";
import { redirect } from "next/navigation";

export type User = {
  id: number;
  name: string;
  email: string;
  currency: string;
  notify_overdue: number;
  notify_paid: number;
  notify_weekly: number;
};

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  const user = db
    .prepare("SELECT id, name, email, currency, notify_overdue, notify_paid, notify_weekly FROM users WHERE id = ?")
    .get(session.userId) as User | undefined;
  return user ?? null;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function signUp(name: string, email: string, password: string) {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return { error: "Email already in use." };

  const hashed = await bcrypt.hash(password, 10);
  const result = db
    .prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)")
    .run(name, email, hashed);

  // Seed demo data for new user
  await seedDemoData(result.lastInsertRowid as number);
  await createSession(result.lastInsertRowid as number);
  return { success: true };
}

export async function signIn(email: string, password: string) {
  const user = db
    .prepare("SELECT id, password FROM users WHERE email = ?")
    .get(email) as { id: number; password: string } | undefined;

  if (!user) return { error: "Invalid email or password." };

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return { error: "Invalid email or password." };

  await createSession(user.id);
  return { success: true };
}

export async function signOut() {
  await deleteSession();
  redirect("/login");
}

async function seedDemoData(userId: number) {
  // Insert demo clients
  const clients = [
    { name: "Nexora Studio", email: "hello@nexora.io", status: "Active", rating: 5, since: "Jan 2024" },
    { name: "Meridian Labs", email: "work@meridian.co", status: "Active", rating: 4, since: "Mar 2024" },
    { name: "Oakfield Co.", email: "oak@oakfield.com", status: "Inactive", rating: 3, since: "Aug 2023" },
    { name: "Vertex Media", email: "hi@vertexmedia.io", status: "Active", rating: 5, since: "Nov 2023" },
    { name: "Bluewave Inc.", email: "team@bluewave.com", status: "Active", rating: 5, since: "Jun 2023" },
    { name: "Driftline Co.", email: "contact@driftline.co", status: "Pending", rating: 4, since: "Feb 2024" },
  ];

  const insertClient = db.prepare(
    "INSERT INTO clients (user_id, name, email, status, rating, since) VALUES (?, ?, ?, ?, ?, ?)"
  );

  const clientIds: number[] = [];
  for (const c of clients) {
    const r = insertClient.run(userId, c.name, c.email, c.status, c.rating, c.since);
    clientIds.push(r.lastInsertRowid as number);
  }

  // Insert demo projects
  const projects = [
    { clientIdx: 0, name: "Brand Redesign", stage: "Review", value: 3200, deadline: "2025-04-30", progress: 80 },
    { clientIdx: 1, name: "Web App Dev", stage: "In Progress", value: 5500, deadline: "2025-05-15", progress: 55 },
    { clientIdx: 2, name: "SEO Audit", stage: "Paid", value: 900, deadline: "2025-04-18", progress: 100 },
    { clientIdx: 5, name: "Mobile App", stage: "Proposal", value: 7000, deadline: "2025-06-01", progress: 10 },
    { clientIdx: 3, name: "Social Campaign", stage: "Paid", value: 2100, deadline: "2025-04-15", progress: 100 },
    { clientIdx: 4, name: "Dashboard UI", stage: "In Progress", value: 4800, deadline: "2025-05-20", progress: 40 },
  ];

  const insertProject = db.prepare(
    "INSERT INTO projects (user_id, client_id, name, stage, value, deadline, progress) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  const projectIds: number[] = [];
  for (const p of projects) {
    const r = insertProject.run(userId, clientIds[p.clientIdx], p.name, p.stage, p.value, p.deadline, p.progress);
    projectIds.push(r.lastInsertRowid as number);
  }

  // Insert demo invoices
  const invoices = [
    { clientIdx: 0, projectIdx: 0, num: "INV-041", amount: 3200, status: "Pending", issued: "2025-04-20", due: "2025-04-30" },
    { clientIdx: 1, projectIdx: 1, num: "INV-040", amount: 5500, status: "Paid", issued: "2025-04-10", due: "2025-04-22" },
    { clientIdx: 2, projectIdx: 2, num: "INV-039", amount: 900, status: "Overdue", issued: "2025-04-05", due: "2025-04-18" },
    { clientIdx: 3, projectIdx: 4, num: "INV-038", amount: 2100, status: "Paid", issued: "2025-04-01", due: "2025-04-15" },
    { clientIdx: 4, projectIdx: 5, num: "INV-037", amount: 4800, status: "Paid", issued: "2025-03-25", due: "2025-04-10" },
    { clientIdx: 5, projectIdx: 3, num: "INV-036", amount: 2000, status: "Pending", issued: "2025-03-20", due: "2025-04-05" },
    { clientIdx: 0, projectIdx: 0, num: "INV-035", amount: 800, status: "Paid", issued: "2025-03-10", due: "2025-03-25" },
  ];

  const insertInvoice = db.prepare(
    "INSERT INTO invoices (user_id, client_id, project_id, invoice_number, amount, status, issued_at, due_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );

  for (const inv of invoices) {
    insertInvoice.run(
      userId,
      clientIds[inv.clientIdx],
      projectIds[inv.projectIdx],
      inv.num,
      inv.amount,
      inv.status,
      inv.issued,
      inv.due
    );
  }
}

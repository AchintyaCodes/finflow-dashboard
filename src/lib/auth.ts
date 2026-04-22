import "server-only";
import bcrypt from "bcryptjs";
import sql, { initDb } from "./db";
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
  const db = sql();
  const rows = await db`
    SELECT id, name, email, currency, notify_overdue, notify_paid, notify_weekly
    FROM users WHERE id = ${session.userId}
  `;
  return (rows[0] as User) ?? null;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function signUp(name: string, email: string, password: string) {
  await initDb();
  const db = sql();
  const existing = await db`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) return { error: "Email already in use." };

  const hashed = await bcrypt.hash(password, 10);
  const result = await db`
    INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashed})
    RETURNING id
  `;
  const userId = result[0].id;
  await seedDemoData(userId);
  await createSession(userId);
  return { success: true };
}

export async function signIn(email: string, password: string) {
  const db = sql();
  const rows = await db`SELECT id, password FROM users WHERE email = ${email}`;
  if (rows.length === 0) return { error: "Invalid email or password." };
  const user = rows[0] as { id: number; password: string };
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
  const db = sql();
  function relDate(offsetDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  }

  const clients = [
    { name: "Nexora Studio",  email: "hello@nexora.io",      status: "Active",   rating: 5, since: "Jan 2024" },
    { name: "Meridian Labs",  email: "work@meridian.co",     status: "Active",   rating: 4, since: "Mar 2024" },
    { name: "Oakfield Co.",   email: "oak@oakfield.com",     status: "Inactive", rating: 3, since: "Aug 2023" },
    { name: "Vertex Media",   email: "hi@vertexmedia.io",    status: "Active",   rating: 5, since: "Nov 2023" },
    { name: "Bluewave Inc.",  email: "team@bluewave.com",    status: "Active",   rating: 5, since: "Jun 2023" },
    { name: "Driftline Co.",  email: "contact@driftline.co", status: "Pending",  rating: 4, since: "Feb 2024" },
  ];

  const clientIds: number[] = [];
  for (const c of clients) {
    const r = await db`
      INSERT INTO clients (user_id, name, email, status, rating, since)
      VALUES (${userId}, ${c.name}, ${c.email}, ${c.status}, ${c.rating}, ${c.since})
      RETURNING id
    `;
    clientIds.push(r[0].id);
  }

  const projects = [
    { clientIdx: 0, name: "Brand Redesign",  stage: "Review",      value: 3200, deadline: relDate(8),   progress: 80  },
    { clientIdx: 1, name: "Web App Dev",     stage: "In Progress", value: 5500, deadline: relDate(23),  progress: 55  },
    { clientIdx: 2, name: "SEO Audit",       stage: "Paid",        value: 900,  deadline: relDate(-4),  progress: 100 },
    { clientIdx: 5, name: "Mobile App",      stage: "Proposal",    value: 7000, deadline: relDate(40),  progress: 10  },
    { clientIdx: 3, name: "Social Campaign", stage: "Paid",        value: 2100, deadline: relDate(-7),  progress: 100 },
    { clientIdx: 4, name: "Dashboard UI",    stage: "In Progress", value: 4800, deadline: relDate(28),  progress: 40  },
  ];

  const projectIds: number[] = [];
  for (const p of projects) {
    const r = await db`
      INSERT INTO projects (user_id, client_id, name, stage, value, deadline, progress)
      VALUES (${userId}, ${clientIds[p.clientIdx]}, ${p.name}, ${p.stage}, ${p.value}, ${p.deadline}, ${p.progress})
      RETURNING id
    `;
    projectIds.push(r[0].id);
  }

  // 6-month invoice spread: up-down-up pattern
  const invoices = [
    { ci: 0, pi: 0, num: "INV-041", amount: 9200,  status: "Paid",    issued: relDate(-150) },
    { ci: 1, pi: 1, num: "INV-040", amount: 11400, status: "Paid",    issued: relDate(-120) },
    { ci: 2, pi: 2, num: "INV-039", amount: 8700,  status: "Paid",    issued: relDate(-90)  },
    { ci: 3, pi: 4, num: "INV-038", amount: 13500, status: "Paid",    issued: relDate(-60)  },
    { ci: 4, pi: 5, num: "INV-037", amount: 15800, status: "Paid",    issued: relDate(-30)  },
    { ci: 0, pi: 0, num: "INV-036", amount: 14040, status: "Paid",    issued: relDate(-12)  },
    { ci: 1, pi: 1, num: "INV-035", amount: 3200,  status: "Pending", issued: relDate(-5)   },
    { ci: 2, pi: 2, num: "INV-034", amount: 900,   status: "Overdue", issued: relDate(-3)   },
  ];

  for (const inv of invoices) {
    const due = new Date(inv.issued);
    due.setDate(due.getDate() + 14);
    await db`
      INSERT INTO invoices (user_id, client_id, project_id, invoice_number, amount, status, issued_at, due_at)
      VALUES (${userId}, ${clientIds[inv.ci]}, ${projectIds[inv.pi]}, ${inv.num}, ${inv.amount}, ${inv.status}, ${inv.issued}, ${due.toISOString().slice(0,10)})
    `;
  }
}

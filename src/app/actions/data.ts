"use server";

import { requireUser } from "@/lib/auth";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// ── Clients ──────────────────────────────────────────────────────────────────

const ClientSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  status: z.enum(["Active", "Inactive", "Pending"]),
  rating: z.coerce.number().min(1).max(5),
});

export async function addClient(formData: FormData) {
  const user = await requireUser();
  const parsed = ClientSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const since = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" });
  db.prepare(
    "INSERT INTO clients (user_id, name, email, status, rating, since) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(user.id, parsed.data.name, parsed.data.email, parsed.data.status, parsed.data.rating, since);

  revalidatePath("/clients");
  return { success: true };
}

export async function deleteClient(id: number) {
  const user = await requireUser();
  db.prepare("DELETE FROM clients WHERE id = ? AND user_id = ?").run(id, user.id);
  revalidatePath("/clients");
}

// ── Projects ─────────────────────────────────────────────────────────────────

const ProjectSchema = z.object({
  name: z.string().min(1),
  client_id: z.coerce.number(),
  stage: z.enum(["Proposal", "In Progress", "Review", "Paid"]),
  value: z.coerce.number().min(0),
  deadline: z.string().optional(),
  progress: z.coerce.number().min(0).max(100),
});

export async function addProject(formData: FormData) {
  const user = await requireUser();
  const parsed = ProjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  db.prepare(
    "INSERT INTO projects (user_id, client_id, name, stage, value, deadline, progress) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    user.id,
    parsed.data.client_id || null,
    parsed.data.name,
    parsed.data.stage,
    parsed.data.value,
    parsed.data.deadline || null,
    parsed.data.progress
  );

  revalidatePath("/projects");
  return { success: true };
}

export async function updateProjectStage(id: number, stage: string) {
  const user = await requireUser();
  db.prepare("UPDATE projects SET stage = ? WHERE id = ? AND user_id = ?").run(stage, id, user.id);
  revalidatePath("/projects");
}

export async function deleteProject(id: number) {
  const user = await requireUser();
  db.prepare("DELETE FROM projects WHERE id = ? AND user_id = ?").run(id, user.id);
  revalidatePath("/projects");
}

// ── Invoices ─────────────────────────────────────────────────────────────────

const InvoiceSchema = z.object({
  client_id: z.coerce.number(),
  project_id: z.coerce.number().optional(),
  amount: z.coerce.number().min(1),
  due_at: z.string().min(1),
  status: z.enum(["Pending", "Paid", "Overdue"]),
});

export async function addInvoice(formData: FormData) {
  const user = await requireUser();
  const parsed = InvoiceSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // Generate invoice number
  const count = (db.prepare("SELECT COUNT(*) as c FROM invoices WHERE user_id = ?").get(user.id) as { c: number }).c;
  const invoiceNumber = `INV-${String(count + 1).padStart(3, "0")}`;

  db.prepare(
    "INSERT INTO invoices (user_id, client_id, project_id, invoice_number, amount, status, due_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(
    user.id,
    parsed.data.client_id,
    parsed.data.project_id || null,
    invoiceNumber,
    parsed.data.amount,
    parsed.data.status,
    parsed.data.due_at
  );

  revalidatePath("/invoices");
  return { success: true };
}

export async function updateInvoiceStatus(id: number, status: string) {
  const user = await requireUser();
  db.prepare("UPDATE invoices SET status = ? WHERE id = ? AND user_id = ?").run(status, id, user.id);
  revalidatePath("/invoices");
}

export async function deleteInvoice(id: number) {
  const user = await requireUser();
  db.prepare("DELETE FROM invoices WHERE id = ? AND user_id = ?").run(id, user.id);
  revalidatePath("/invoices");
}

// ── Settings ─────────────────────────────────────────────────────────────────

export async function updateSettings(formData: FormData) {
  const user = await requireUser();
  const name = formData.get("name") as string;
  const currency = formData.get("currency") as string;
  const notify_overdue = formData.get("notify_overdue") === "on" ? 1 : 0;
  const notify_paid = formData.get("notify_paid") === "on" ? 1 : 0;
  const notify_weekly = formData.get("notify_weekly") === "on" ? 1 : 0;

  db.prepare(
    "UPDATE users SET name = ?, currency = ?, notify_overdue = ?, notify_paid = ?, notify_weekly = ? WHERE id = ?"
  ).run(name, currency, notify_overdue, notify_paid, notify_weekly, user.id);

  revalidatePath("/settings");
  return { success: true };
}

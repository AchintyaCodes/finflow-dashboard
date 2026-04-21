import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "finflow.db");

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Singleton to avoid multiple connections during build/dev
const globalForDb = globalThis as unknown as { _db?: Database.Database };

if (!globalForDb._db) {
  const instance = new Database(DB_PATH);
  instance.pragma("journal_mode = WAL");
  instance.pragma("foreign_keys = ON");
  instance.pragma("busy_timeout = 5000");
  globalForDb._db = instance;
}

const db = globalForDb._db!;

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    notify_overdue INTEGER NOT NULL DEFAULT 1,
    notify_paid INTEGER NOT NULL DEFAULT 1,
    notify_weekly INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    rating INTEGER NOT NULL DEFAULT 5,
    since TEXT NOT NULL DEFAULT (strftime('%b %Y', 'now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    stage TEXT NOT NULL DEFAULT 'Proposal',
    value INTEGER NOT NULL DEFAULT 0,
    deadline TEXT,
    progress INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL,
    project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
    invoice_number TEXT NOT NULL,
    amount INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Pending',
    issued_at TEXT NOT NULL DEFAULT (date('now')),
    due_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// One-time migration: fix any invoices with hardcoded 2025 dates
// by spreading them across the last 6 months relative to today
const staleCount = (db.prepare(
  "SELECT COUNT(*) as c FROM invoices WHERE issued_at LIKE '2025-%' AND issued_at < date('now', '-30 days')"
).get() as { c: number }).c;

if (staleCount > 0) {
  const offsets = [-2, -12, -17, -21, -28, -33, -43, -75, -105, -135, -165, -195];
  const staleInvoices = db.prepare(
    "SELECT id FROM invoices WHERE issued_at LIKE '2025-%' AND issued_at < date('now', '-30 days') ORDER BY issued_at ASC"
  ).all() as { id: number }[];

  const update = db.prepare("UPDATE invoices SET issued_at = date('now', ? || ' days'), due_at = date('now', ? || ' days') WHERE id = ?");
  const migrate = db.transaction(() => {
    staleInvoices.forEach((inv, i) => {
      const offset = offsets[i % offsets.length];
      const dueOffset = offset + 10;
      update.run(String(offset), String(dueOffset), inv.id);
    });
  });
  migrate();
}

export default db;

/**
 * SQLite helpers using Node's built-in node:sqlite (no extra database package).
 * The file is created automatically at server/data/accountability.sqlite
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "accountability.sqlite");

let db;

export function initDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  db = new DatabaseSync(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submitted_at TEXT NOT NULL,
      employee_name TEXT NOT NULL,
      role TEXT NOT NULL,
      ai_tool TEXT NOT NULL,
      purpose TEXT NOT NULL,
      reason TEXT NOT NULL,
      prompts TEXT NOT NULL,
      output_checked TEXT NOT NULL
    );
  `);
  return db;
}

export function insertSubmission(row) {
  const stmt = db.prepare(`
    INSERT INTO submissions (
      submitted_at, employee_name, role, ai_tool,
      purpose, reason, prompts, output_checked
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    row.submittedAt,
    row.employeeName,
    row.role,
    row.aiTool,
    row.purpose,
    row.reason,
    row.prompts,
    row.outputChecked,
  );
  return result.lastInsertRowid;
}

/**
 * Newest first. All filters are optional.
 * fromDate / toDate are YYYY-MM-DD strings from the log page.
 */
export function listSubmissions(filters = {}) {
  const clauses = [];
  const params = [];

  if (filters.name) {
    clauses.push("employee_name LIKE ?");
    params.push(`%${filters.name}%`);
  }
  if (filters.tool) {
    clauses.push("ai_tool LIKE ?");
    params.push(`%${filters.tool}%`);
  }
  if (filters.checked) {
    clauses.push("output_checked = ?");
    params.push(filters.checked);
  }
  if (filters.fromDate) {
    clauses.push("submitted_at >= ?");
    params.push(`${filters.fromDate}T00:00:00.000Z`);
  }
  if (filters.toDate) {
    clauses.push("submitted_at <= ?");
    params.push(`${filters.toDate}T23:59:59.999Z`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const stmt = db.prepare(
    `SELECT * FROM submissions ${where} ORDER BY submitted_at DESC, id DESC`,
  );
  return stmt.all(...params).map(mapRow);
}

function mapRow(row) {
  return {
    id: row.id,
    submittedAt: row.submitted_at,
    employeeName: row.employee_name,
    role: row.role,
    aiTool: row.ai_tool,
    purpose: row.purpose,
    reason: row.reason,
    prompts: row.prompts,
    outputChecked: row.output_checked,
  };
}

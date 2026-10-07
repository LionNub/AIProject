/**
 * Express API for the accountability log.
 * - Employees POST a form (no password).
 * - The CEO must send the password to read or export the log.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import dotenv from "dotenv";
import { initDb, insertSubmission, listSubmissions } from "./db.js";
import { outputCheckedOptions } from "../config.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const CEO_PASSWORD = process.env.CEO_PASSWORD || "changeme";
const allowedChecked = new Set(outputCheckedOptions.map((o) => o.value));

initDb();

const app = express();
app.use(express.json({ limit: "1mb" }));

function ceoAuthorized(req) {
  const fromHeader = req.get("x-ceo-password");
  const fromQuery = typeof req.query.password === "string" ? req.query.password : "";
  return (fromHeader || fromQuery) === CEO_PASSWORD;
}

function requireCeo(req, res, next) {
  if (!ceoAuthorized(req)) {
    return res.status(401).json({ error: "Incorrect password." });
  }
  next();
}

function readFilters(req) {
  return {
    name: String(req.query.name || "").trim(),
    tool: String(req.query.tool || "").trim(),
    checked: String(req.query.checked || "").trim(),
    fromDate: String(req.query.from || "").trim(),
    toDate: String(req.query.to || "").trim(),
  };
}

app.post("/api/login", (req, res) => {
  const password = String(req.body?.password || "");
  if (password !== CEO_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password." });
  }
  res.json({ ok: true });
});

app.post("/api/submissions", (req, res) => {
  const body = req.body || {};
  const employeeName = String(body.employeeName || "").trim();
  const role = String(body.role || "").trim();
  const toolChoice = String(body.aiTool || "").trim();
  const otherTool = String(body.otherTool || "").trim();
  const purpose = String(body.purpose || "").trim();
  const reason = String(body.reason || "").trim();
  const prompts = String(body.prompts || "").trim();
  const outputChecked = String(body.outputChecked || "").trim();
  const acknowledged = Boolean(body.acknowledged);

  const errors = {};
  if (employeeName.length < 2) errors.employeeName = "Please enter your full name.";
  if (role.length < 2) errors.role = "Please enter your role or job title.";
  if (!toolChoice) errors.aiTool = "Please choose the AI tool.";
  if (toolChoice === "Other" && otherTool.length < 2) {
    errors.otherTool = "Please name the AI tool.";
  }
  if (purpose.length < 8) errors.purpose = "Please describe what you are using AI for.";
  if (reason.length < 8) errors.reason = "Please explain why you are using AI for this task.";
  if (prompts.length < 8) errors.prompts = "Please include the prompt(s) for this session.";
  if (!allowedChecked.has(outputChecked)) {
    errors.outputChecked = "Please choose whether the output will be / was checked.";
  }
  if (!acknowledged) {
    errors.acknowledged = "You must confirm the acknowledgment before submitting.";
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ errors });
  }

  const aiTool = toolChoice === "Other" ? otherTool : toolChoice;
  const submittedAt = new Date().toISOString();

  const id = insertSubmission({
    submittedAt,
    employeeName,
    role,
    aiTool,
    purpose,
    reason,
    prompts,
    outputChecked,
  });

  res.status(201).json({ id, submittedAt });
});

app.get("/api/submissions", requireCeo, (req, res) => {
  res.json({ submissions: listSubmissions(readFilters(req)) });
});

app.get("/api/submissions.csv", requireCeo, (req, res) => {
  const rows = listSubmissions(readFilters(req));
  const headers = [
    "Date/Time",
    "Employee Name",
    "Role",
    "AI Tool",
    "Purpose",
    "Reason",
    "Prompts",
    "Output Checked",
  ];
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.submittedAt,
        row.employeeName,
        row.role,
        row.aiTool,
        row.purpose,
        row.reason,
        row.prompts,
        row.outputChecked,
      ]
        .map(csvCell)
        .join(","),
    );
  }
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=\"ai-use-accountability-log.csv\"",
  );
  res.send(lines.join("\n"));
});

function csvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const distDir = path.join(__dirname, "..", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(distDir, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Accountability API running on http://127.0.0.1:${PORT}`);
});

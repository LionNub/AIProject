# AI Use Accountability Log — Insurance Incorporated

Employees fill out this form **before every AI session at work**. It is **not** an AI chatbot. There are no AI APIs. It records who used which tool, why, which prompts, and whether output was checked, so the CEO can review a log.

## How to run (this is the app)

In a terminal, from this folder:

```powershell
cd "C:\Users\liond\Programming Projects\AIProject"
npm install
npm run dev
```

Then open **http://127.0.0.1:5173** (the employee form).

- CEO log: **http://127.0.0.1:5173/log**
- Default CEO password: `changeme` (from `.env`)

Do **not** run `app.py`. That file is an old leftover Python experiment. Running it is what produces `No module named 'dotenv'`.

## Change the CEO password

1. Copy `.env.example` to `.env` if you do not already have `.env`.
2. Set `CEO_PASSWORD=your-password`.
3. Restart `npm run dev`.

This is prototype security: one shared password, not real user accounts.

## Change warnings, company name, or the AI Use Statement link

Edit **`config.js`** only. That file holds company name, warning/reminder/accountability text, statement URL (`aiUseStatementUrl`), tool list, and output-checked labels.

Swap the header mark by replacing `assets/logo.svg` (see `assets/README.md`).

## Project structure

```
config.js              Public copy (safe to send to the browser)
.env                   CEO password (not committed)
server/index.js        Express API + SQLite
server/db.js           Database helpers
client/src/pages       Form page and CEO log page
client/src/components  Callouts, form, table, password gate
assets/                Logo / Firefly images
```

SQLite is used so submissions survive a restart and two people can submit at once without corrupting a JSON file. The database file is created at `server/data/accountability.sqlite`.

import { useState } from "react";
import { loginCeo } from "../api.js";

/** Prototype-only gate. The password is checked on the server, not in this file. */
export default function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await loginCeo(password);
      onUnlock(password);
    } catch (err) {
      setError(err.message || "Incorrect password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-16 max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h1 className="font-serif text-2xl font-semibold text-navy-950">CEO log</h1>
      <p className="mt-2 text-sm text-slate-600">
        Enter the log password. This is prototype-level security (one shared password).
      </p>
      <label className="label mt-4" htmlFor="ceoPassword">
        Password
      </label>
      <input
        id="ceoPassword"
        type="password"
        className="input"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error-text">{error}</p>}
      <button type="submit" className="btn-primary mt-4 w-full" disabled={busy}>
        {busy ? "Checking…" : "Open log"}
      </button>
    </form>
  );
}

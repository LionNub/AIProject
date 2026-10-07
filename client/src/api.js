/** Thin wrappers around fetch so pages stay easy to read. */

export async function submitForm(payload) {
  const res = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.error || "Please fix the highlighted fields.");
    error.errors = data.errors || {};
    throw error;
  }
  return data;
}

export async function loginCeo(password) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Incorrect password.");
  return data;
}

export async function fetchSubmissions(password, filters) {
  const params = new URLSearchParams();
  if (filters.name) params.set("name", filters.name);
  if (filters.tool) params.set("tool", filters.tool);
  if (filters.checked) params.set("checked", filters.checked);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);

  const res = await fetch(`/api/submissions?${params.toString()}`, {
    headers: { "x-ceo-password": password },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Could not load the log.");
  return data.submissions;
}

export function csvUrl(password, filters) {
  const params = new URLSearchParams();
  params.set("password", password);
  if (filters.name) params.set("name", filters.name);
  if (filters.tool) params.set("tool", filters.tool);
  if (filters.checked) params.set("checked", filters.checked);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  return `/api/submissions.csv?${params.toString()}`;
}

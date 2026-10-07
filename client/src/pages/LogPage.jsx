import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import PasswordGate from "../components/PasswordGate.jsx";
import LogFilters from "../components/LogFilters.jsx";
import LogTable from "../components/LogTable.jsx";
import { csvUrl, fetchSubmissions } from "../api.js";

const emptyFilters = {
  name: "",
  tool: "",
  checked: "",
  from: "",
  to: "",
};

export default function LogPage() {
  const [password, setPassword] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!password) return;
    let cancelled = false;
    setLoading(true);
    fetchSubmissions(password, filters)
      .then((list) => {
        if (!cancelled) {
          setRows(list);
          setError("");
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load the log.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [password, filters]);

  return (
    <div className="min-h-screen">
      <SiteHeader
        rightSlot={
          <Link to="/" className="text-sm font-semibold text-navy-800 underline-offset-2 hover:underline">
            Employee form
          </Link>
        }
      />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {!password ? (
          <PasswordGate onUnlock={setPassword} />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="font-serif text-3xl font-semibold text-navy-950">
                  CEO accountability log
                </h1>
                <p className="mt-1 text-slate-600">Newest submissions first. Red rows are not yet checked.</p>
              </div>
              <a className="btn-secondary" href={csvUrl(password, filters)}>
                Export to CSV
              </a>
            </div>
            <LogFilters filters={filters} onChange={setFilters} />
            {error && (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                {error}
              </p>
            )}
            <div className="mt-4">
              {loading ? <p className="text-slate-600">Loading…</p> : <LogTable rows={rows} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

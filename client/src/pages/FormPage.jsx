import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import WarningCallouts from "../components/WarningCallouts.jsx";
import SubmissionForm from "../components/SubmissionForm.jsx";

export default function FormPage() {
  const [submittedAt, setSubmittedAt] = useState(null);

  return (
    <div className="min-h-screen">
      <SiteHeader
        rightSlot={
          <Link to="/log" className="text-sm font-semibold text-navy-800 underline-offset-2 hover:underline">
            CEO log
          </Link>
        }
      />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {submittedAt ? (
          <SuccessCard submittedAt={submittedAt} onAgain={() => setSubmittedAt(null)} />
        ) : (
          <>
            <h1 className="font-serif text-3xl font-semibold text-navy-950">
              Before you use AI at work
            </h1>
            <p className="mt-2 text-slate-600">
              Complete this form for every AI session. It is a record for you and for leadership — not an AI tool.
            </p>
            <div className="mt-6">
              <WarningCallouts />
            </div>
            <SubmissionForm onSuccess={setSubmittedAt} />
          </>
        )}
      </main>
    </div>
  );
}

function SuccessCard({ submittedAt, onAgain }) {
  const when = new Date(submittedAt).toLocaleString();
  return (
    <div className="rounded-lg border border-emerald-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-emerald-800">Submitted</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-navy-950">
        Thank you. Your session is logged.
      </h1>
      <p className="mt-3 text-slate-600">
        Timestamp: <time dateTime={submittedAt}>{when}</time>
      </p>
      <button type="button" className="btn-primary mt-6" onClick={onAgain}>
        Submit another
      </button>
    </div>
  );
}

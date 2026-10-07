import {
  accountabilityText,
  aiUseStatementLabel,
  aiUseStatementUrl,
  reminderText,
  warningText,
} from "@config";

/** Required callouts at the top of the employee form. Order is fixed. */
export default function WarningCallouts() {
  return (
    <div className="space-y-3">
      <div
        className="rounded-md border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-950"
        role="alert"
      >
        <p className="text-xs font-bold uppercase tracking-wide text-red-800">Warning</p>
        <p className="mt-1 font-medium">{warningText}</p>
      </div>

      <div className="rounded-md border border-navy-800 bg-white px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-navy-800">
          Company policy
        </p>
        <a
          className="mt-1 inline-block font-semibold text-navy-800 underline underline-offset-2"
          href={aiUseStatementUrl}
        >
          {aiUseStatementLabel}
        </a>
      </div>

      <div className="rounded-md border border-slate-300 bg-slate-50 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-navy-800">Reminder</p>
        <p className="mt-1">{reminderText}</p>
      </div>

      <div className="rounded-md border border-navy-900 bg-navy-950 px-4 py-3 text-white">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-300">
          Accountability
        </p>
        <p className="mt-1">{accountabilityText}</p>
      </div>
    </div>
  );
}

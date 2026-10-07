import { Fragment, useState } from "react";
import { outputCheckedOptions } from "@config";

function checkedLabel(value) {
  return outputCheckedOptions.find((o) => o.value === value)?.label || value;
}

export default function LogTable({ rows }) {
  const [openId, setOpenId] = useState(null);

  if (!rows.length) {
    return (
      <p className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-slate-600">
        No submissions match these filters yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-navy-950 text-white">
          <tr>
            <th className="px-3 py-2 font-semibold">Date/Time</th>
            <th className="px-3 py-2 font-semibold">Employee</th>
            <th className="px-3 py-2 font-semibold">Role</th>
            <th className="px-3 py-2 font-semibold">AI tool</th>
            <th className="px-3 py-2 font-semibold">Purpose</th>
            <th className="px-3 py-2 font-semibold">Output checked</th>
            <th className="px-3 py-2 font-semibold">Details</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const flagged = row.outputChecked === "not_checked";
            const open = openId === row.id;
            return (
              <Fragment key={row.id}>
                <tr
                  className={flagged ? "bg-red-50" : "odd:bg-white even:bg-slate-50"}
                >
                  <td className="whitespace-nowrap px-3 py-2">
                    {new Date(row.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 font-medium">{row.employeeName}</td>
                  <td className="px-3 py-2">{row.role}</td>
                  <td className="px-3 py-2">{row.aiTool}</td>
                  <td className="max-w-xs truncate px-3 py-2" title={row.purpose}>
                    {row.purpose}
                  </td>
                  <td className="px-3 py-2">
                    {flagged && (
                      <span className="mr-1 rounded bg-red-700 px-1.5 py-0.5 text-xs font-bold text-white">
                        Flag
                      </span>
                    )}
                    {checkedLabel(row.outputChecked)}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="btn-secondary px-3 py-1 text-xs"
                      onClick={() => setOpenId(open ? null : row.id)}
                      aria-expanded={open}
                    >
                      {open ? "Hide" : "Expand"}
                    </button>
                  </td>
                </tr>
                {open && (
                  <tr className={flagged ? "bg-red-50" : "bg-slate-50"}>
                    <td colSpan={7} className="px-4 py-4">
                      <p className="text-xs font-bold uppercase text-navy-800">Reason</p>
                      <p className="mt-1 whitespace-pre-wrap">{row.reason}</p>
                      <p className="mt-3 text-xs font-bold uppercase text-navy-800">Prompts</p>
                      <pre className="mt-1 whitespace-pre-wrap rounded-md border border-slate-200 bg-white p-3 font-sans text-sm">
                        {row.prompts}
                      </pre>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

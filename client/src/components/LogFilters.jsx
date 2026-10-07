import { aiTools, outputCheckedOptions } from "@config";

export default function LogFilters({ filters, onChange }) {
  function set(name, value) {
    onChange({ ...filters, [name]: value });
  }

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2 lg:grid-cols-5">
      <label className="text-sm">
        <span className="label">Employee name</span>
        <input
          className="input"
          value={filters.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Search name"
        />
      </label>
      <label className="text-sm">
        <span className="label">AI tool</span>
        <select className="input" value={filters.tool} onChange={(e) => set("tool", e.target.value)}>
          <option value="">All tools</option>
          {aiTools
            .filter((t) => t !== "Other")
            .map((tool) => (
              <option key={tool} value={tool}>
                {tool}
              </option>
            ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="label">From date</span>
        <input
          type="date"
          className="input"
          value={filters.from}
          onChange={(e) => set("from", e.target.value)}
        />
      </label>
      <label className="text-sm">
        <span className="label">To date</span>
        <input
          type="date"
          className="input"
          value={filters.to}
          onChange={(e) => set("to", e.target.value)}
        />
      </label>
      <label className="text-sm">
        <span className="label">Output checked</span>
        <select
          className="input"
          value={filters.checked}
          onChange={(e) => set("checked", e.target.value)}
        >
          <option value="">Any status</option>
          {outputCheckedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

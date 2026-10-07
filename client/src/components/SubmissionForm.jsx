import { useState } from "react";
import {
  acknowledgmentLabel,
  aiTools,
  outputCheckedOptions,
} from "@config";
import { submitForm } from "../api.js";

const empty = {
  employeeName: "",
  role: "",
  aiTool: "",
  otherTool: "",
  purpose: "",
  reason: "",
  prompts: "",
  outputChecked: "",
  acknowledged: false,
};

export default function SubmissionForm({ onSuccess }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [busy, setBusy] = useState(false);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const next = {};
    if (form.employeeName.trim().length < 2) {
      next.employeeName = "Please enter your full name.";
    }
    if (form.role.trim().length < 2) {
      next.role = "Please enter your role or job title.";
    }
    if (!form.aiTool) next.aiTool = "Please choose the AI tool.";
    if (form.aiTool === "Other" && form.otherTool.trim().length < 2) {
      next.otherTool = "Please name the AI tool.";
    }
    if (form.purpose.trim().length < 8) {
      next.purpose = "Please describe what you are using AI for (a short sentence is fine).";
    }
    if (form.reason.trim().length < 8) {
      next.reason = "Please explain why you are using AI for this task.";
    }
    if (form.prompts.trim().length < 8) {
      next.prompts = "Please paste the prompt(s) you plan to use or already used.";
    }
    if (!form.outputChecked) {
      next.outputChecked = "Please choose whether the output will be / was checked.";
    }
    if (!form.acknowledged) {
      next.acknowledged = "You must check the acknowledgment before submitting.";
    }
    return next;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    setServerError("");
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const result = await submitForm(form);
      setForm(empty);
      onSuccess(result.submittedAt);
    } catch (err) {
      setErrors(err.errors || {});
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <Field
        id="employeeName"
        label="Employee full name"
        error={errors.employeeName}
      >
        <input
          id="employeeName"
          className={`input ${errors.employeeName ? "input-error" : ""}`}
          autoComplete="name"
          value={form.employeeName}
          onChange={(e) => setField("employeeName", e.target.value)}
          required
        />
      </Field>

      <Field id="role" label="Role / job title" error={errors.role}>
        <input
          id="role"
          className={`input ${errors.role ? "input-error" : ""}`}
          autoComplete="organization-title"
          value={form.role}
          onChange={(e) => setField("role", e.target.value)}
          required
        />
      </Field>

      <Field id="aiTool" label="AI tool being used" error={errors.aiTool}>
        <select
          id="aiTool"
          className={`input ${errors.aiTool ? "input-error" : ""}`}
          value={form.aiTool}
          onChange={(e) => setField("aiTool", e.target.value)}
          required
        >
          <option value="">Select a tool</option>
          {aiTools.map((tool) => (
            <option key={tool} value={tool}>
              {tool}
            </option>
          ))}
        </select>
      </Field>

      {form.aiTool === "Other" && (
        <Field id="otherTool" label="Name of the other AI tool" error={errors.otherTool}>
          <input
            id="otherTool"
            className={`input ${errors.otherTool ? "input-error" : ""}`}
            value={form.otherTool}
            onChange={(e) => setField("otherTool", e.target.value)}
            required
          />
        </Field>
      )}

      <Field id="purpose" label="What are you using AI for?" error={errors.purpose}>
        <textarea
          id="purpose"
          className={`input min-h-[88px] ${errors.purpose ? "input-error" : ""}`}
          value={form.purpose}
          onChange={(e) => setField("purpose", e.target.value)}
          required
        />
      </Field>

      <Field id="reason" label="Why are you using AI for this task?" error={errors.reason}>
        <textarea
          id="reason"
          className={`input min-h-[88px] ${errors.reason ? "input-error" : ""}`}
          value={form.reason}
          onChange={(e) => setField("reason", e.target.value)}
          required
        />
      </Field>

      <Field
        id="prompts"
        label="Prompts you plan to use / used in this session"
        hint="You can paste more than one prompt."
        error={errors.prompts}
      >
        <textarea
          id="prompts"
          className={`input min-h-[160px] ${errors.prompts ? "input-error" : ""}`}
          value={form.prompts}
          onChange={(e) => setField("prompts", e.target.value)}
          required
        />
      </Field>

      <fieldset>
        <legend className="label">Whether the AI's output will be / was checked</legend>
        <div className="space-y-2">
          {outputCheckedOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-start gap-2">
              <input
                type="radio"
                name="outputChecked"
                className="mt-1"
                value={option.value}
                checked={form.outputChecked === option.value}
                onChange={(e) => setField("outputChecked", e.target.value)}
                required
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.outputChecked && <p className="error-text">{errors.outputChecked}</p>}
      </fieldset>

      <div>
        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.acknowledged}
            onChange={(e) => setField("acknowledged", e.target.checked)}
            required
          />
          <span>{acknowledgmentLabel}</span>
        </label>
        {errors.acknowledged && <p className="error-text">{errors.acknowledged}</p>}
      </div>

      {serverError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {serverError}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={!form.acknowledged || busy}>
        {busy ? "Submitting…" : "Submit accountability log"}
      </button>
    </form>
  );
}

function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      {hint && <p className="mb-1.5 text-sm text-slate-600">{hint}</p>}
      {children}
      {error && (
        <p className="error-text" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

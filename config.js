/**
 * All public, editable copy for Insurance Incorporated lives here.
 * Change text, the AI Use Statement link, or the tool list in this one file.
 *
 * The CEO password is NOT here — it stays in .env so it is not sent to browsers.
 */

export const companyName = "Insurance Incorporated";

export const appName = "AI Use Accountability Log";

/** Swap this file in /assets (see assets/README.md). */
export const logoSrc = "/logo.svg";

/**
 * Company AI Use Statement.
 * Replace "#" with the real intranet URL when you have it.
 */
export const aiUseStatementUrl = "#";
export const aiUseStatementLabel = "Read the company AI Use Statement";

export const warningText =
  "Do not enter private or confidential company information (client data, policyholder details, financial records, internal documents, credentials) into any AI tool.";

export const reminderText =
  "Always review and verify AI output before using it. AI makes mistakes.";

export const accountabilityText =
  "You are personally responsible for how you use AI and for any work produced with it.";

export const acknowledgmentLabel =
  "I confirm I have not entered confidential company information and I understand I am responsible for my use of AI.";

/** Dropdown values. "Other" reveals a text box on the form. */
export const aiTools = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Microsoft Copilot",
  "Other",
];

/**
 * Stored in the database as the `value`. Shown in the form and log as `label`.
 * "not_checked" rows are flagged in the CEO log.
 */
export const outputCheckedOptions = [
  {
    value: "will_review",
    label: "I will review and verify all AI output before using it",
  },
  {
    value: "checked",
    label: "Yes, output was checked",
  },
  {
    value: "not_checked",
    label: "Not yet checked",
  },
];

import { Link } from "react-router-dom";
import { appName, companyName, logoSrc } from "@config";

/** Shared header. Swap assets/logo.svg (or change logoSrc in config.js). */
export default function SiteHeader({ rightSlot }) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src={logoSrc} alt="" className="h-11 w-11" width="44" height="44" />
          <div>
            <p className="font-serif text-lg font-semibold leading-tight text-navy-900">
              {companyName}
            </p>
            <p className="text-sm text-slate-600">{appName}</p>
          </div>
        </Link>
        {rightSlot}
      </div>
    </header>
  );
}

import type { ReactNode } from "react";

import type { ApiError } from "../api";

/** Neutral message block for loading, empty and informative states. */
export function Notice({
  title,
  children,
  tone = "neutral",
}: {
  title: string;
  children?: ReactNode;
  tone?: "neutral" | "warning" | "error";
}) {
  const tones = {
    neutral: "border-slate-700 bg-slate-900/60 text-slate-300",
    warning: "border-amber-500/40 bg-amber-500/10 text-amber-100",
    error: "border-rose-500/40 bg-rose-500/10 text-rose-100",
  } as const;
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}>
      <p className="font-medium">{title}</p>
      {children ? <div className="mt-1 opacity-90">{children}</div> : null}
    </div>
  );
}

/** Show a contract error with its code and details. */
export function ErrorNotice({
  error,
  onRetry,
}: {
  error: ApiError;
  onRetry?: () => void;
}) {
  return (
    <Notice title={error.message} tone="error">
      {error.details.length > 0 ? (
        <ul className="list-disc pl-5">
          {error.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}
      <p className="mt-1 text-xs opacity-70">Código: {error.code}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 rounded-md border border-rose-300/40 px-3 py-1 text-xs hover:bg-rose-500/20"
        >
          Reintentar
        </button>
      ) : null}
    </Notice>
  );
}

/** Small pill used for statuses and provenance tags. */
export function Tag({
  children,
  tone = "slate",
}: {
  children: ReactNode;
  tone?: "slate" | "sky" | "amber" | "violet" | "emerald" | "rose";
}) {
  const tones = {
    slate: "border-slate-600 text-slate-300",
    sky: "border-sky-500/50 text-sky-200",
    amber: "border-amber-500/50 text-amber-200",
    violet: "border-violet-500/50 text-violet-200",
    emerald: "border-emerald-500/50 text-emerald-200",
    rose: "border-rose-500/50 text-rose-200",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Collapsible section with a native details element (keyboard accessible). */
export function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-lg border border-slate-800 bg-slate-900/40"
    >
      <summary className="cursor-pointer list-none px-4 py-2 text-sm font-medium text-slate-200 marker:hidden">
        <span className="mr-2 inline-block transition group-open:rotate-90">
          ›
        </span>
        {title}
      </summary>
      <div className="px-4 pb-3 text-sm text-slate-300">{children}</div>
    </details>
  );
}

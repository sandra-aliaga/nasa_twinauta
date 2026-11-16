import { useState } from "react";

import {
  dataSource,
  toApiError,
  type Action,
  type ApiError,
  type Assessment,
} from "../api";
import {
  ELIGIBILITY_LABELS,
  EXECUTION_LABELS,
  REVIEW_LABELS,
} from "../lib/labels";
import { ErrorNotice, ReviewedTag, Tag } from "./common";
import { tr } from "../i18n";

const EXECUTION_OPTIONS: Action["execution_status"][] = [
  "pending",
  "completed",
  "skipped",
];

type ActionsTabProps = {
  assessment: Assessment;
  onActionUpdated: (action: Action) => void;
  onConflict: () => Promise<void>;
};

function ActionCard({
  action,
  assessmentId,
  contentMode,
  onActionUpdated,
  onConflict,
}: {
  action: Action;
  assessmentId: string;
  contentMode: Assessment["content_mode"];
  onActionUpdated: (action: Action) => void;
  onConflict: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const eligible = action.eligibility === "eligible";
  // Pending actions can only be rehearsed in illustrative mode (contract 0.2).
  const trackingAllowed =
    eligible &&
    (action.review_status === "reviewed" || contentMode === "illustrative");

  async function changeStatus(status: Action["execution_status"]) {
    if (status === action.execution_status) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await dataSource.updateAction(assessmentId, action.id, {
        execution_status: status,
        expected_revision: action.revision,
      });
      onActionUpdated(updated);
    } catch (caught) {
      const apiError = toApiError(caught);
      setError(apiError);
      if (apiError.code === "revision_conflict") {
        // Someone else changed it: reload the snapshot to show current state.
        await onConflict().catch((reloadError: unknown) =>
          setError(toApiError(reloadError)),
        );
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <li
      className="hud-panel space-y-2 px-4 py-3"
      style={{ "--rail": "var(--color-step-do)" } as React.CSSProperties}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-slate-100">
          {tr(action.title)}
        </span>
        <div className="flex flex-wrap gap-1">
          <ReviewedTag status={action.review_status} />
          <Tag tone={eligible ? "sky" : "slate"}>
            {ELIGIBILITY_LABELS[action.eligibility]}
          </Tag>
        </div>
      </div>

      <p className="text-sm text-slate-300">{tr(action.rationale)}</p>

      <details className="text-xs text-slate-400">
        <summary className="cursor-pointer text-slate-300">
          {tr("Condiciones")}
        </summary>
        <p className="mt-1">{tr(action.eligibility_reason)}</p>
        {action.requirements.length > 0 ? (
          <ul className="mt-1 list-disc pl-4">
            {action.requirements.map((requirement) => (
              <li key={requirement}>{tr(requirement)}</li>
            ))}
          </ul>
        ) : null}
      </details>

      <fieldset disabled={!trackingAllowed || saving} className="pt-1">
        <legend className="mb-1 text-xs text-slate-400">
          {tr("Marca cómo va (solo es un registro)")}
        </legend>
        <div className="flex gap-1">
          {EXECUTION_OPTIONS.map((status) => {
            const active = status === action.execution_status;
            return (
              <button
                key={status}
                type="button"
                aria-pressed={active}
                onClick={() => void changeStatus(status)}
                className={`rounded-md border px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50 ${
                  active
                    ? "border-sky-400 bg-sky-500/20 text-sky-100"
                    : "border-slate-700 text-slate-300 hover:border-slate-500"
                }`}
              >
                {EXECUTION_LABELS[status]}
              </button>
            );
          })}
        </div>
      </fieldset>

      {error ? <ErrorNotice error={error} /> : null}
    </li>
  );
}

/** "Siguientes pasos": reviewed or pending actions with their tracking. */
export function ActionsTab({
  assessment,
  onActionUpdated,
  onConflict,
}: ActionsTabProps) {
  return (
    <div className="space-y-5">
      <p className="text-[15px] leading-relaxed text-slate-100">
        {tr(assessment.action_summary)}
      </p>

      {assessment.actions.some(
        (action) => action.review_status === "pending",
      ) ? (
        <p className="text-xs text-slate-400">
          {tr("Son comprobaciones de datos, no indicaciones médicas.")}
        </p>
      ) : null}

      {assessment.actions.length === 0 ? (
        <p className="text-sm italic text-slate-400">
          {tr("No hay acciones para esta evaluación.")}
        </p>
      ) : (
        <ul className="space-y-3">
          {assessment.actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              assessmentId={assessment.assessment_id}
              contentMode={assessment.content_mode}
              onActionUpdated={onActionUpdated}
              onConflict={onConflict}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

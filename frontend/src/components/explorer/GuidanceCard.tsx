import { useState } from "react";

import { dataSource, type Action, type Assessment } from "../../api";
import { explorerSource } from "../../api/explorer";
import type { Guidance, GuidanceStep } from "../../api/explorer/types";
import { useLoad } from "../../hooks/useLoad";
import {
  APPLICABILITY_LABELS,
  GUIDANCE_ATTENTION_LABELS,
  GUIDANCE_STATUS_LABELS,
  STEP_KIND_LABELS,
} from "../../lib/explorerLabels";
import {
  ELIGIBILITY_LABELS,
  EXECUTION_LABELS,
  REVIEW_LABELS,
} from "../../lib/labels";
import { ErrorNotice, Notice, ReviewedTag, Skeleton, Tag } from "../common";
import { tr } from "../../i18n";

/** Proposed link to a 0.2 action; absent in the implemented contract. */
type StepWithLink = GuidanceStep & { action_id?: string | null };

/**
 * Frozen operational guidance of an assessment. With the backend it shows the
 * open assessment's guidance; in examples mode it shows the documented
 * variants, which do not belong to the open assessment. Statuses describe
 * coverage, never clinical severity.
 */
export function GuidanceCard({ assessment }: { assessment: Assessment }) {
  const listExamples = explorerSource.listGuidanceExamples;
  const isDemo = listExamples !== undefined;
  const examples = useLoad(
    isDemo ? "guidance-examples" : `guidance|${assessment.assessment_id}`,
    (signal): Promise<Guidance[]> =>
      listExamples
        ? listExamples(signal)
        : dataSource
            .getGuidance(assessment.assessment_id, signal)
            .then((item) => [item]),
  );
  const modules = useLoad("modules", (signal) =>
    explorerSource.listModules(signal),
  );
  const [index, setIndex] = useState(0);

  if (examples === null || examples.status === "loading") {
    return <Skeleton lines={3} label={tr("Cargando orientación")} />;
  }
  if (examples.status === "error")
    return <ErrorNotice error={examples.error} />;

  const guidance = examples.data[index] ?? examples.data[0];
  if (!guidance) return null;

  return (
    <section className="space-y-3 rounded-lg border border-dashed border-amber-300/40 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-100">
          {tr("Orientación contextual")}
        </h4>
        {isDemo ? (
          <Tag tone="amber">{tr("Demostración · ejemplo del contrato")}</Tag>
        ) : (
          <Tag>{tr("Orientación congelada de esta evaluación")}</Tag>
        )}
      </div>
      {isDemo ? (
        <>
          <label className="flex flex-col gap-1 text-xs text-slate-400">
            {tr("Variante documentada")}
            <select
              value={index}
              onChange={(event) => setIndex(Number(event.target.value))}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100"
            >
              {examples.data.map((item, i) => (
                <option key={`${item.status}-${i}`} value={i}>
                  {GUIDANCE_STATUS_LABELS[item.status]}:{" "}
                  {tr(item.reason ?? item.summary)}
                </option>
              ))}
            </select>
          </label>
          <p className="text-xs text-slate-400">
            {tr(
              "Este ejemplo no corresponde a la evaluación abierta; sirve para ver cómo se presentará cada estado. Los enlaces a acciones se resuelven por identificador contra la evaluación abierta solo para la demostración.",
            )}
          </p>
        </>
      ) : null}

      <div className="flex flex-wrap gap-1">
        <Tag tone={guidance.status === "complete" ? "sky" : "slate"}>
          {GUIDANCE_STATUS_LABELS[guidance.status]}
        </Tag>
        <Tag>
          {tr("Atención:")} {GUIDANCE_ATTENTION_LABELS[guidance.attention]}
        </Tag>
        {guidance.module_id ? (
          <Tag>
            {tr("Módulo")}{" "}
            {tr(
              (modules?.status === "ready"
                ? modules.data.modules.find((m) => m.id === guidance.module_id)
                    ?.label
                : undefined) ?? guidance.module_id,
            )}{" "}
            · v{guidance.module_version}
          </Tag>
        ) : (
          <Tag>{tr("Sin módulo")}</Tag>
        )}
      </div>
      <p className="text-slate-200">{tr(guidance.summary)}</p>
      {guidance.reason ? (
        <p className="text-xs text-slate-400">
          <span className="text-slate-400">{tr("Motivo:")} </span>
          {tr(guidance.reason)}
        </p>
      ) : null}
      {guidance.status === "not_supported" ? (
        <Notice title={tr("Región sin cobertura")}>
          {tr(
            "No hay un módulo implementado para esta región. No se interpreta y no significa que esté sana.",
          )}
        </Notice>
      ) : null}

      {guidance.applicability.length > 0 ? (
        <ul className="space-y-1 text-xs">
          {guidance.applicability.map((item, i) => (
            <li key={`${item.status}-${i}`}>
              <span className="text-slate-300">
                {APPLICABILITY_LABELS[item.status]}:{" "}
              </span>
              <span className="text-slate-400">{tr(item.explanation)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {guidance.steps.length > 0 ? (
        <ul className="space-y-2">
          {guidance.steps.map((step) => (
            <li
              key={step.id}
              className="rounded-md border border-slate-800 p-2 text-xs"
            >
              <div className="flex flex-wrap items-center gap-1">
                <span className="font-medium text-slate-100">
                  {tr(step.title)}
                </span>
                <Tag>{STEP_KIND_LABELS[step.kind]}</Tag>
                <Tag tone={step.eligibility === "eligible" ? "sky" : "slate"}>
                  {ELIGIBILITY_LABELS[step.eligibility]}
                </Tag>
                <ReviewedTag status={step.review_status} />
              </div>
              <p className="mt-1 text-slate-300">{tr(step.description)}</p>
              <p className="mt-0.5 text-slate-400">
                {tr(step.eligibility_reason)}
              </p>
              {(step as StepWithLink).action_id !== undefined ? (
                <LinkedAction
                  step={step as StepWithLink}
                  guidanceAssessmentId={guidance.assessment_id}
                  assessment={assessment}
                />
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs italic text-slate-400">
          {tr("Sin pasos para este estado.")}
        </p>
      )}

      {guidance.limitations.length > 0 ? (
        <ul className="list-disc space-y-0.5 pl-4 text-xs text-orange-200/80">
          {guidance.limitations.map((item) => (
            <li key={item}>{tr(item)}</li>
          ))}
        </ul>
      ) : null}
      <p className="text-[11px] text-slate-400">
        {tr("Corpus")} {guidance.corpus_version} {tr("· reglas")}{" "}
        {guidance.rules_version ?? tr("sin versión")}
      </p>
    </section>
  );
}

/**
 * Resolves step.action_id against the open assessment. The contract requires
 * both to belong to the same assessment; the fixtures do not, so the demo
 * resolves by id and says so.
 */
function LinkedAction({
  step,
  guidanceAssessmentId,
  assessment,
}: {
  step: StepWithLink;
  guidanceAssessmentId: string;
  assessment: Assessment;
}) {
  if (!step.action_id) {
    return (
      <p className="mt-1 text-slate-400">
        {step.kind === "studied_intervention"
          ? tr(
              "Sin acción enlazada: describe lo que se estudió, no algo que hacer.",
            )
          : tr(
              "Sin acción enlazada: orientación de lectura, sin seguimiento de ejecución.",
            )}
      </p>
    );
  }
  const action = assessment.actions.find((item) => item.id === step.action_id);
  if (!action) {
    return (
      <p className="mt-1 text-amber-200">
        {tr("La acción enlazada (")}
        {step.action_id}
        {tr(") no está en la evaluación abierta. El ejemplo pertenece a")}{" "}
        {guidanceAssessmentId}
        {tr(
          "; con datos reales sería un error de contrato y no se inventa la acción.",
        )}
      </p>
    );
  }
  const mismatches = mismatchedFields(step, action);
  return (
    <div className="mt-2 rounded-md border border-sky-500/30 p-2">
      <p className="text-slate-400">
        {tr("Acción enlazada (estado vigente en la evaluación abierta)")}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-1">
        <span className="text-slate-100">{tr(action.title)}</span>
        <Tag>
          {tr("Ejecución:")} {EXECUTION_LABELS[action.execution_status]}
        </Tag>
        <Tag>
          {tr("Versión del registro")} {action.revision}
        </Tag>
      </div>
      <p className="mt-1 text-slate-400">
        {tr(
          "La ejecución se registra en la pestaña de acciones; este paso no la modifica.",
        )}
      </p>
      {mismatches.length > 0 ? (
        <p className="mt-1 text-amber-200">
          {tr("El paso no coincide con la acción en")}{" "}
          {mismatches.map((value) => tr(value)).join(tr(" y "))}
          {tr("; prevalece la acción.")}
        </p>
      ) : null}
    </div>
  );
}

function mismatchedFields(step: StepWithLink, action: Action): string[] {
  const fields: string[] = [];
  if (step.eligibility !== action.eligibility) fields.push("elegibilidad");
  if (step.review_status !== action.review_status) fields.push(tr("revisión"));
  return fields;
}

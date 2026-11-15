import { useState } from "react";

import { explorerSource } from "../../api/explorer/mockSource";
import { useLoad } from "../../hooks/useLoad";
import {
  APPLICABILITY_LABELS,
  GUIDANCE_ATTENTION_LABELS,
  GUIDANCE_STATUS_LABELS,
  STEP_KIND_LABELS,
} from "../../lib/explorerLabels";
import { ELIGIBILITY_LABELS, REVIEW_LABELS } from "../../lib/labels";
import { ErrorNotice, Notice, Tag } from "../common";

/**
 * Contextual guidance (contract draft 0.3), shown with the documented
 * fixture variants. The fixture does not belong to the current assessment,
 * and statuses describe coverage, never clinical severity.
 */
export function GuidanceCard() {
  const examples = useLoad("guidance", (signal) =>
    explorerSource.listGuidanceExamples(signal),
  );
  const [index, setIndex] = useState(0);

  if (examples === null || examples.status === "loading") {
    return <p className="text-xs text-slate-500">Cargando orientación…</p>;
  }
  if (examples.status === "error")
    return <ErrorNotice error={examples.error} />;

  const guidance = examples.data[index] ?? examples.data[0];
  if (!guidance) return null;

  return (
    <section className="space-y-3 rounded-lg border border-dashed border-amber-300/40 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-100">
          Orientación contextual
        </h4>
        <Tag tone="amber">Demostración 0.3 · ejemplo del contrato</Tag>
      </div>
      <label className="flex flex-col gap-1 text-xs text-slate-400">
        Variante documentada
        <select
          value={index}
          onChange={(event) => setIndex(Number(event.target.value))}
          className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100"
        >
          {examples.data.map((item, i) => (
            <option key={`${item.status}-${i}`} value={i}>
              {GUIDANCE_STATUS_LABELS[item.status]}:{" "}
              {item.reason ?? item.summary}
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-slate-500">
        Este ejemplo no corresponde a la evaluación abierta; sirve para ver cómo
        se presentará cada estado.
      </p>

      <div className="flex flex-wrap gap-1">
        <Tag tone={guidance.status === "complete" ? "sky" : "slate"}>
          {GUIDANCE_STATUS_LABELS[guidance.status]}
        </Tag>
        <Tag>Atención: {GUIDANCE_ATTENTION_LABELS[guidance.attention]}</Tag>
        {guidance.module_id ? (
          <Tag>
            Módulo {guidance.module_id} · v{guidance.module_version}
          </Tag>
        ) : (
          <Tag>Sin módulo</Tag>
        )}
      </div>
      <p className="text-slate-200">{guidance.summary}</p>
      {guidance.reason ? (
        <p className="text-xs text-slate-400">
          <span className="text-slate-500">Motivo: </span>
          {guidance.reason}
        </p>
      ) : null}
      {guidance.status === "not_supported" ? (
        <Notice title="Región sin cobertura">
          No hay un módulo implementado para esta región. No se interpreta y no
          significa que esté sana.
        </Notice>
      ) : null}

      {guidance.applicability.length > 0 ? (
        <ul className="space-y-1 text-xs">
          {guidance.applicability.map((item, i) => (
            <li key={`${item.status}-${i}`}>
              <span className="text-slate-300">
                {APPLICABILITY_LABELS[item.status]}:{" "}
              </span>
              <span className="text-slate-400">{item.explanation}</span>
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
                <span className="font-medium text-slate-100">{step.title}</span>
                <Tag>{STEP_KIND_LABELS[step.kind]}</Tag>
                <Tag tone={step.eligibility === "eligible" ? "sky" : "slate"}>
                  {ELIGIBILITY_LABELS[step.eligibility]}
                </Tag>
                <Tag
                  tone={step.review_status === "reviewed" ? "emerald" : "amber"}
                >
                  {REVIEW_LABELS[step.review_status]}
                </Tag>
              </div>
              <p className="mt-1 text-slate-300">{step.description}</p>
              <p className="mt-0.5 text-slate-500">{step.eligibility_reason}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs italic text-slate-500">
          Sin pasos para este estado.
        </p>
      )}

      {guidance.limitations.length > 0 ? (
        <ul className="list-disc space-y-0.5 pl-4 text-xs text-orange-200/80">
          {guidance.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <p className="text-[11px] text-slate-600">
        Corpus {guidance.corpus_version} · reglas{" "}
        {guidance.rules_version ?? "sin versión"}
      </p>
    </section>
  );
}

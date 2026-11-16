import type { Assessment, IndicatorDefinition } from "../api";
import type {
  AssessmentContext,
  ContextDraft,
  GraphPage,
} from "../api/explorer/types";
import type { LoadState } from "../hooks/useCatalog";
import { BASIS_LABELS, RELATION_LABELS } from "../lib/explorerLabels";
import { REVIEW_LABELS, UNIT_LABELS } from "../lib/labels";
import { ErrorNotice, ReviewedTag, Skeleton, Tag } from "./common";
import { tr, translated, formatNumber } from "../i18n";

export type ContextSectionKey = keyof ContextDraft;

const SECTION_TITLES: Record<ContextSectionKey, string> = translated({
  alert_assessment: "Fundamento de la alerta",
  inaction_scenario: "Posibles consecuencias sin seguimiento",
  next_steps: "Por qué estos pasos",
});

// Each narrative section has its own graph in the context payload.
const SECTION_GRAPHS: Record<ContextSectionKey, GraphPage["view"]> = {
  alert_assessment: "evidence",
  inaction_scenario: "scenario",
  next_steps: "actions",
};

// Where the excerpt was taken from; the contract only allows the abstract.
const LOCATOR_LABELS: Record<string, string> = translated({
  abstract: "Resumen del artículo",
});

/**
 * One section of the prepared synthesis of an assessment. The text was
 * drafted by a language model from the frozen snapshot and the literature
 * abstracts; it is pending review and never authorizes a clinical action.
 */
export function ContextSection({
  context,
  section,
  assessment,
  indicators,
  onOpenPaper,
}: {
  context: LoadState<AssessmentContext> | null;
  section: ContextSectionKey;
  assessment: Assessment;
  indicators: IndicatorDefinition[];
  onOpenPaper: (paperId: string) => void;
}) {
  const title = SECTION_TITLES[section];
  if (context === null || context.status === "loading") {
    return (
      <div className="rounded-lg border border-slate-800 p-3">
        <Skeleton lines={4} label={tr("Cargando síntesis")} />
      </div>
    );
  }
  if (context.status === "error") return <ErrorNotice error={context.error} />;

  const data = context.data;
  if (data.status === "unavailable" || data.sections === null) {
    return (
      <section className="rounded-lg border border-slate-800 p-3 text-xs text-slate-400">
        <p className="font-medium text-slate-300">{title}</p>
        <p className="mt-1">
          {data.reason ??
            tr("No hay una síntesis preparada para esta evaluación.")}{" "}
          {tr("Se muestran solo los datos y reglas del backend.")}
        </p>
      </section>
    );
  }

  const narrative = data.sections[section];
  const observations = narrative.observation_ids.map((id) => ({
    id,
    observation: assessment.observations.find((item) => item.id === id),
  }));
  const steps = narrative.step_ids.map((id) => ({
    id,
    step: data.guidance?.steps.find((item) => item.id === id),
  }));
  const graph = data.graphs[SECTION_GRAPHS[section]];
  const labelOf = (nodeId: string) =>
    graph?.nodes.find((node) => node.id === nodeId)?.label ?? nodeId;

  return (
    <section className="space-y-3 rounded-lg border border-violet-500/30 p-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-100">{title}</h4>
        <div className="flex flex-wrap gap-1">
          <Tag tone="violet">{tr("Síntesis generada por modelo")}</Tag>
          <ReviewedTag status={data.review_status} />
        </div>
      </div>
      <p className="text-slate-200">{tr(narrative.summary)}</p>
      <p className="text-xs text-slate-400">
        <span className="text-slate-300">{tr("Incertidumbre:")} </span>
        {tr(narrative.uncertainty)}
      </p>

      {observations.length > 0 ? (
        <div className="text-xs">
          <p className="text-slate-400">
            {tr("Mediciones en las que se apoya")}
          </p>
          <ul className="mt-1 space-y-0.5">
            {observations.map(({ id, observation }) => (
              <li key={id} className="text-slate-300">
                {observation ? (
                  <>
                    {tr(
                      indicators.find(
                        (item) => item.id === observation.indicator_id,
                      )?.label ?? observation.indicator_id,
                    )}
                    {tr(" · día ")}
                    {observation.mission_day}
                    {" · "}
                    {observation.value === null
                      ? tr("sin valor")
                      : `${formatNumber(observation.value)} ${UNIT_LABELS[observation.unit]}`}
                  </>
                ) : (
                  <span className="text-amber-200">
                    {tr("La medición citada no está en esta evaluación.")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {steps.length > 0 ? (
        <div className="text-xs">
          <p className="text-slate-400">
            {tr("Pasos de la orientación a los que se refiere")}
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-300">
            {steps.map(({ id, step }) => (
              <li key={id}>
                {step ? (
                  tr(step.title)
                ) : (
                  <span className="text-amber-200">
                    {tr("Paso no encontrado en la orientación.")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {narrative.citations.length > 0 ? (
        <div className="space-y-2 text-xs">
          <p className="text-slate-400">{tr("Fragmentos citados")}</p>
          {narrative.citations.map((citation) => {
            const snippet = data.evidence_snippets[citation.snippet_id];
            return (
              <figure
                key={citation.snippet_id}
                className="rounded-md border border-slate-800 p-2"
              >
                <blockquote className="text-slate-300">
                  {snippet ? (
                    `«${snippet.excerpt}»`
                  ) : (
                    <span className="text-amber-200">
                      {tr("El fragmento citado no está disponible.")}
                    </span>
                  )}
                </blockquote>
                <figcaption className="mt-1 flex flex-wrap items-center gap-2">
                  {snippet ? (
                    <Tag tone="subtle">
                      {LOCATOR_LABELS[snippet.locator] ?? snippet.locator}
                    </Tag>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => onOpenPaper(citation.paper_id)}
                    className="text-sky-300 underline-offset-2 hover:underline"
                  >
                    {tr("Abrir el artículo en la biblioteca")}
                  </button>
                </figcaption>
              </figure>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          {tr(
            "Esta sección no cita literatura; se apoya en los datos y reglas del backend.",
          )}
        </p>
      )}

      {graph && graph.edges.length > 0 ? (
        <div className="text-xs">
          <p className="text-slate-400">{tr("Relaciones registradas")}</p>
          <ul className="mt-1 space-y-1">
            {graph.edges.map((edge) => (
              <li key={edge.id} className="text-slate-300">
                «{truncate(tr(labelOf(edge.source)))}»{" "}
                <span className="text-slate-400">
                  {RELATION_LABELS[edge.relation]}
                </span>{" "}
                «{truncate(tr(labelOf(edge.target)))}»{" "}
                <Tag
                  tone={edge.basis === "llm_suggestion" ? "amber" : "subtle"}
                >
                  {BASIS_LABELS[edge.basis]}
                </Tag>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-[11px] text-slate-400">
        {tr("No habilita acciones clínicas.")}
        {data.provenance
          ? tr(
              " Modelo {{value0}} · instrucciones {{value1}} · corpus {{value2}}.",
              {
                value0: String(data.provenance.model_id),
                value1: String(data.provenance.prompt_version),
                value2: String(data.provenance.corpus_version),
              },
            )
          : ""}
      </p>
    </section>
  );
}

function truncate(text: string, max = 90): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

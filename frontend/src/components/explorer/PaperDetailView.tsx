import {
  readDispersion,
  readInterval,
  type PaperDetail,
  type Statistic,
} from "../../api/explorer/types";
import {
  ANALYSIS_KIND_LABELS,
  ANALYSIS_STATUS_LABELS,
  APPLICABILITY_LABELS,
  AVAILABILITY_LABELS,
  COHORT_OVERLAP_LABELS,
  DISPERSION_LABELS,
  INTERVAL_LABELS,
  STATISTIC_TYPE_LABELS,
  SUMMARY_BASIS_LABELS,
  SUMMARY_METHOD_LABELS,
  SUMMARY_STATUS_LABELS,
} from "../../lib/explorerLabels";
import { ENVIRONMENT_LABELS, REVIEW_LABELS } from "../../lib/labels";
import { Collapsible, Notice, Tag } from "../common";

/**
 * Paper record. The provider abstract, the prepared summary and the AI
 * analysis are different texts and are never merged.
 */
export function PaperDetailView({ detail }: { detail: PaperDetail }) {
  const { paper, summary, analysis, applicability } = detail;
  const doi = paper.identifiers.doi;

  return (
    <article className="space-y-4 text-sm">
      <header className="space-y-2">
        <h3 className="text-base font-semibold leading-snug text-slate-50">
          {paper.title}
        </h3>
        <p className="text-xs text-slate-400">
          {paper.authors.join(", ")} · {paper.year}
          {paper.study_design ? ` · ${paper.study_design}` : ""}
        </p>
        <div className="flex flex-wrap gap-1">
          <Tag tone={paper.environment === "spaceflight" ? "sky" : "amber"}>
            {ENVIRONMENT_LABELS[paper.environment]}
          </Tag>
          <Tag tone={paper.review_status === "reviewed" ? "emerald" : "slate"}>
            Ficha: {REVIEW_LABELS[paper.review_status]}
          </Tag>
          <Tag>{AVAILABILITY_LABELS[paper.access.availability]}</Tag>
        </div>
      </header>

      <AccessLinks detail={detail} doi={doi} />

      {detail.cohort_overlap_status !== "unknown" ? (
        <Notice
          title={COHORT_OVERLAP_LABELS[detail.cohort_overlap_status]}
          tone="warning"
        >
          Resultados de estudios que comparten participantes no cuentan como
          confirmación independiente.
        </Notice>
      ) : null}

      <section>
        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Abstract del proveedor
        </h4>
        <p className="mt-1 text-slate-300">
          {detail.abstract ?? (
            <span className="italic text-slate-400">
              No se dispone del abstract en esta ficha.
            </span>
          )}
        </p>
      </section>

      <section>
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Resumen preparado
          </h4>
          <Tag tone={summary.status === "available" ? "sky" : "slate"}>
            {SUMMARY_STATUS_LABELS[summary.status]}
          </Tag>
          <Tag
            tone={summary.review_status === "reviewed" ? "emerald" : "slate"}
          >
            {REVIEW_LABELS[summary.review_status]}
          </Tag>
        </div>
        {summary.text ? (
          <p className="mt-1 text-slate-200">{summary.text}</p>
        ) : null}
        <p className="mt-1 text-xs text-slate-400">
          Basado en {SUMMARY_BASIS_LABELS[summary.basis]} ·{" "}
          {SUMMARY_METHOD_LABELS[summary.method]}
          {summary.source_locators.length > 0
            ? ` · Ubicación: ${summary.source_locators.join("; ")}`
            : ""}
        </p>
        <LimitList items={summary.limitations} />
      </section>

      {detail.population_description ? (
        <p className="text-xs text-slate-400">
          <span className="text-slate-400">Población: </span>
          {detail.population_description}
        </p>
      ) : null}

      <section>
        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Resultados cuantitativos publicados
        </h4>
        {detail.statistics.length === 0 ? (
          <p className="mt-1 text-xs italic text-slate-400">
            No hay resultados extraídos para esta publicación.
          </p>
        ) : (
          <>
            <p className="mt-1 text-xs text-slate-400">
              Resultados agregados del estudio; no son mediciones del astronauta
              virtual.
            </p>
            <ul className="mt-2 space-y-2">
              {detail.statistics.map((statistic) => (
                <StatisticRow key={statistic.id} statistic={statistic} />
              ))}
            </ul>
          </>
        )}
      </section>

      <section>
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Análisis asistido por IA
          </h4>
          <Tag tone={analysis.status === "failed" ? "amber" : "slate"}>
            {ANALYSIS_STATUS_LABELS[analysis.status]}
          </Tag>
        </div>
        {analysis.status === "failed" ? (
          <p className="mt-1 text-xs text-amber-200">
            {analysis.failure_reason ?? "El backend no indicó el motivo."} No se
            muestra contenido de sustitución.
          </p>
        ) : null}
        {analysis.status === "not_requested" ||
        analysis.status === "queued" ||
        analysis.status === "running" ? (
          <p className="mt-1 text-xs text-slate-400">
            Todavía no hay contenido generado para esta publicación.
          </p>
        ) : null}
        {analysis.items.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {analysis.items.map((item) => (
              <li
                key={item.id}
                className="rounded-md border border-dashed border-amber-300/40 p-2"
              >
                <div className="flex flex-wrap gap-1">
                  <Tag tone="amber">Sugerencia de IA</Tag>
                  <Tag>{ANALYSIS_KIND_LABELS[item.kind]}</Tag>
                  <Tag
                    tone={
                      item.review_status === "reviewed" ? "emerald" : "slate"
                    }
                  >
                    {REVIEW_LABELS[item.review_status]}
                  </Tag>
                </div>
                <p className="mt-1 text-slate-200">{item.text}</p>
                <blockquote className="mt-1 border-l-2 border-slate-700 pl-2 text-xs italic text-slate-400">
                  «{item.source_excerpt}» — {item.source_locator}
                </blockquote>
                <LimitList items={item.limitations} />
              </li>
            ))}
          </ul>
        ) : null}
        {analysis.model_id ? (
          <p className="mt-1 text-[11px] text-slate-400">
            Modelo {analysis.model_id} · prompt {analysis.prompt_version ?? "?"}{" "}
            · {analysis.generated_at ?? "fecha desconocida"}
          </p>
        ) : null}
        {analysis.items.some((item) => item.kind === "studied_intervention") ? (
          <p className="mt-1 text-xs text-slate-400">
            Una intervención estudiada describe lo que investigó el paper; no es
            una acción habilitada para el astronauta.
          </p>
        ) : null}
      </section>

      <section className="rounded-md border border-slate-800 p-3">
        <h4 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {APPLICABILITY_LABELS[applicability.status]}
        </h4>
        <p className="mt-1 text-xs text-slate-300">
          {applicability.explanation}
        </p>
      </section>

      <LimitList items={detail.limitations} title="Limitaciones de la ficha" />
      <p className="text-[11px] text-slate-400">
        Corpus {detail.corpus_version}
      </p>
    </article>
  );
}

function AccessLinks({
  detail,
  doi,
}: {
  detail: PaperDetail;
  doi: string | null;
}) {
  const { access } = detail.paper;
  const link = "text-sky-300 underline-offset-2 hover:underline";
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
      <a
        href={access.landing_url}
        target="_blank"
        rel="noreferrer noopener"
        className={link}
      >
        Abrir original
      </a>
      {access.full_text_url && access.full_text_url !== access.landing_url ? (
        <a
          href={access.full_text_url}
          target="_blank"
          rel="noreferrer noopener"
          className={link}
        >
          Texto completo
        </a>
      ) : null}
      {access.pdf_url ? (
        <a
          href={access.pdf_url}
          target="_blank"
          rel="noreferrer noopener"
          className={link}
        >
          PDF
        </a>
      ) : (
        <span className="text-slate-400">Sin PDF enlazado</span>
      )}
      {doi ? <span className="text-slate-400">DOI {doi}</span> : null}
      <span className="text-slate-400">
        {access.full_text_cached || access.pdf_cached
          ? "Documento instalado localmente"
          : "Requiere conexión para abrir el documento"}
      </span>
      {access.license ? (
        <span className="text-slate-400">Licencia {access.license}</span>
      ) : null}
    </div>
  );
}

function StatisticRow({ statistic }: { statistic: Statistic }) {
  const dispersion = readDispersion(statistic.dispersion);
  const interval = readInterval(statistic.interval);
  return (
    <li className="rounded-md border border-slate-800 p-2 text-xs">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-slate-300">
          {statistic.outcome} · {statistic.group_label} ·{" "}
          {statistic.timepoint_label}
        </span>
        <span className="tabular-nums text-slate-100">
          {num(statistic.value)} {unit(statistic.unit)}
          {dispersion
            ? ` ± ${num(dispersion.value)}${dispersion.unit ? ` ${unit(dispersion.unit)}` : ""} (${DISPERSION_LABELS[dispersion.kind]})`
            : ""}
        </span>
      </div>
      {interval ? (
        <p className="mt-0.5 tabular-nums text-slate-400">
          {(interval.kind && INTERVAL_LABELS[interval.kind]) ?? "Intervalo"}
          {interval.level != null
            ? ` ${Math.round(interval.level * 100)} %`
            : ""}
          : {num(interval.lower)} a {num(interval.upper)}{" "}
          {interval.unit ? unit(interval.unit) : ""}
        </p>
      ) : null}
      <p className="mt-0.5 text-slate-400">
        {STATISTIC_TYPE_LABELS[statistic.statistic_type]}
        {statistic.sample_size !== null
          ? ` · n = ${statistic.sample_size}`
          : " · n desconocido"}{" "}
        · Extracción{" "}
        {REVIEW_LABELS[statistic.extraction_review_status].toLowerCase()}
      </p>
      <p className="mt-0.5 text-slate-400">
        Variable y grupo tal como los publica la fuente (en inglés). Ubicación:{" "}
        {statistic.source_locator}
      </p>
      <LimitList items={statistic.limitations} />
    </li>
  );
}

function LimitList({ items, title }: { items: string[]; title?: string }) {
  if (items.length === 0) return null;
  const list = (
    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-orange-200/80">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
  return title ? (
    <Collapsible title={`${title} (${items.length})`}>{list}</Collapsible>
  ) : (
    list
  );
}

const UNIT_DISPLAY: Record<string, string> = {
  "N.m": "N·m",
  cm2: "cm²",
  percent_baseline_per_day: "% del basal por día",
};

/** Display form of contract unit ids (the id itself stays unchanged). */
function unit(id: string): string {
  return UNIT_DISPLAY[id] ?? id;
}

/** Published values keep their precision; only the decimal mark changes. */
function num(value: number): string {
  return value.toLocaleString("es", { maximumFractionDigits: 6 });
}

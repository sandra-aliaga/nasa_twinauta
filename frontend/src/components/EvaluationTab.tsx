import type {
  Assessment,
  ExerciseRecord,
  IndicatorDefinition,
  Observation,
  Region,
} from "../api";
import {
  ATTENTION_LABELS,
  DERIVATION_LABELS,
  ORIGIN_LABELS,
  QUALITY_LABELS,
  REVIEW_LABELS,
  STATISTIC_LABELS,
  UNIT_LABELS,
} from "../lib/labels";
import { Collapsible, Tag } from "./common";
import { GuidanceCard } from "./explorer/GuidanceCard";

// Presentation only: attention is not clinical severity.
const ATTENTION_TONES = {
  informational: "sky",
  review_needed: "amber",
  unknown: "slate",
} as const;

function formatValue(observation: Observation): string {
  if (observation.value === null) return "Dato ausente";
  return `${observation.value} ${UNIT_LABELS[observation.unit]}`;
}

function ObservationRow({ observation }: { observation: Observation }) {
  const missing = observation.value === null;
  return (
    <li className="rounded-md border border-slate-800 px-3 py-2">
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`text-base tabular-nums ${missing ? "italic text-slate-400" : "text-slate-50"}`}
        >
          {formatValue(observation)}
        </span>
        <span className="text-xs text-slate-400">
          día {observation.mission_day}
        </span>
      </div>
      {missing && observation.missing_reason ? (
        <p className="mt-1 text-xs text-slate-400">
          Motivo: {observation.missing_reason}
        </p>
      ) : null}
      <div className="mt-2 flex flex-wrap gap-1">
        {/* Status first; provenance as quieter metadata. */}
        <Tag tone={observation.quality === "available" ? "slate" : "amber"}>
          {QUALITY_LABELS[observation.quality]}
        </Tag>
        <Tag tone="subtle">{ORIGIN_LABELS[observation.origin]}</Tag>
        <Tag tone="subtle">{DERIVATION_LABELS[observation.derivation]}</Tag>
        <Tag tone="subtle">{STATISTIC_LABELS[observation.statistic]}</Tag>
        {observation.sample_size !== null ? (
          <Tag tone="subtle">n = {observation.sample_size}</Tag>
        ) : null}
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Método: {observation.method}
      </p>
    </li>
  );
}

function IndicatorBlock({
  indicator,
  observations,
}: {
  indicator: IndicatorDefinition;
  observations: Observation[];
}) {
  return (
    <div>
      <h4 className="text-sm font-medium text-slate-200">{indicator.label}</h4>
      <p className="text-xs text-slate-400">
        {indicator.baseline_interpretation}
      </p>
      {observations.length === 0 ? (
        <p className="mt-2 text-xs italic text-slate-400">
          Sin observaciones disponibles hasta este día.
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {observations.map((observation) => (
            <ObservationRow key={observation.id} observation={observation} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ExerciseBlock({ records }: { records: ExerciseRecord[] }) {
  const recorded = records.filter(
    (record) => record.record_status === "recorded",
  ).length;
  return (
    <div>
      <h4 className="text-sm font-medium text-slate-200">
        Ejercicio registrado frente al plan
      </h4>
      <p className="text-xs text-slate-400">
        Una sesión sin registro no demuestra que no se haya realizado.
      </p>
      {records.length === 0 ? (
        <p className="mt-2 text-xs italic text-slate-400">
          Sin sesiones planificadas hasta este día.
        </p>
      ) : (
        <>
          <p className="mt-2 text-base tabular-nums text-slate-50">
            {recorded} de {records.length} sesiones con registro
          </p>
          <ExerciseBars records={records} />
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm bg-teal-400" /> Registrado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm border border-slate-500" />{" "}
              Planificado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm border border-dashed border-amber-300" />{" "}
              Sin registro
            </span>
          </p>
        </>
      )}
    </div>
  );
}

const MODALITY_LABELS: Record<string, string> = {
  resistance: "Resistencia",
  aerobic: "Aeróbico",
};

/**
 * Planned vs recorded duration per session. The track length is the plan;
 * the fill is what was recorded. A missing record is drawn as an empty
 * dashed track, never as zero minutes.
 */
function ExerciseBars({ records }: { records: ExerciseRecord[] }) {
  const maxMinutes = Math.max(
    1,
    ...records.flatMap((r) => [
      r.planned_duration_min ?? 0,
      r.recorded_duration_min ?? 0,
    ]),
  );
  const pct = (minutes: number) => `${(minutes / maxMinutes) * 100}%`;

  return (
    <ul className="mt-3 space-y-3">
      {records.map((record) => {
        const isRecorded = record.record_status === "recorded";
        const planned = record.planned_duration_min;
        const done = record.recorded_duration_min;
        const details = [
          record.sets !== null ? `${record.sets} series` : null,
          record.repetitions !== null ? `${record.repetitions} rep.` : null,
          record.resistance_value !== null
            ? `${record.resistance_value} ${record.resistance_unit ?? ""}`.trim()
            : null,
          record.equipment_available === false ? "equipo no disponible" : null,
        ].filter(Boolean);
        return (
          <li key={record.id} className="text-xs">
            <div className="flex justify-between gap-2 text-slate-300">
              <span>
                Día {record.mission_day} ·{" "}
                {MODALITY_LABELS[record.modality] ?? record.modality}
              </span>
              <span
                className={
                  isRecorded
                    ? "tabular-nums text-slate-200"
                    : "italic text-amber-300"
                }
              >
                {isRecorded
                  ? `${done ?? "?"} de ${planned ?? "?"} min`
                  : `sin registro · plan ${planned ?? "?"} min`}
              </span>
            </div>
            <div
              className="relative mt-1 h-2.5"
              role="img"
              aria-label={
                isRecorded
                  ? `Día ${record.mission_day}: ${done ?? "duración desconocida"} minutos registrados de ${planned ?? "una duración no planificada"}`
                  : `Día ${record.mission_day}: sesión planificada sin registro`
              }
            >
              {planned !== null ? (
                <div
                  className={`absolute inset-y-0 left-0 rounded-sm border ${
                    isRecorded
                      ? "border-slate-600"
                      : "border-dashed border-amber-300/70"
                  }`}
                  style={{ width: pct(planned) }}
                />
              ) : null}
              {isRecorded && done !== null ? (
                <div
                  className="absolute inset-y-0.5 left-0.5 rounded-sm bg-teal-400"
                  style={{ width: `calc(${pct(done)} - 4px)` }}
                />
              ) : null}
            </div>
            {details.length > 0 ? (
              <p className="mt-0.5 text-[11px] text-slate-400">
                {details.join(" · ")}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

type EvaluationTabProps = {
  assessment: Assessment;
  region: Region;
  indicators: IndicatorDefinition[];
  onOpenGraph: () => void;
};

/** "Evaluacion de la zona": findings, related data, limits and sources. */
export function EvaluationTab({
  assessment,
  region,
  indicators,
  onOpenGraph,
}: EvaluationTabProps) {
  const regionIndicators = region.indicator_ids
    .map((id) => indicators.find((indicator) => indicator.id === id))
    .filter((item): item is IndicatorDefinition => item !== undefined);

  const { data_quality, evidence_applicability, model_limitations } =
    assessment.evidence_context;
  const limitationGroups = [
    { label: "Calidad de datos", items: data_quality },
    { label: "Aplicabilidad de la evidencia", items: evidence_applicability },
    { label: "Límites del modelo", items: model_limitations },
  ];
  const limitationCount = limitationGroups.reduce(
    (total, group) => total + group.items.length,
    0,
  );

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-slate-200">
        {assessment.summary}
      </p>

      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Hallazgos
        </h3>
        {assessment.findings.length === 0 ? (
          <p className="text-sm italic text-slate-400">
            No hay hallazgos interpretativos para esta evaluación.
          </p>
        ) : (
          <ul className="space-y-2">
            {assessment.findings.map((finding) => (
              <li
                key={finding.id}
                className="rounded-md border border-slate-800 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-slate-100">
                    {finding.title}
                  </span>
                  <Tag tone={ATTENTION_TONES[finding.attention]}>
                    {ATTENTION_LABELS[finding.attention]}
                  </Tag>
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  {finding.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Datos relacionados
        </h3>
        {regionIndicators.map((indicator) => (
          <IndicatorBlock
            key={indicator.id}
            indicator={indicator}
            observations={assessment.observations.filter(
              (observation) => observation.indicator_id === indicator.id,
            )}
          />
        ))}
        <ExerciseBlock records={assessment.exercise_records} />
      </section>

      <Collapsible title={`Límites de interpretación (${limitationCount})`}>
        <dl className="space-y-2">
          {limitationGroups.map(({ label, items }) => (
            <div key={label}>
              <dt className="text-xs font-medium text-slate-400">{label}</dt>
              {items.length === 0 ? (
                <dd className="text-xs italic text-slate-400">
                  Sin elementos declarados.
                </dd>
              ) : (
                items.map((item) => <dd key={item}>• {item}</dd>)
              )}
            </div>
          ))}
        </dl>
      </Collapsible>

      <Collapsible title={`Fuentes (${assessment.sources.length})`}>
        <ul className="space-y-2">
          {assessment.sources.map((source) => (
            <li key={source.id}>
              <p className="text-slate-200">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-slate-500 hover:text-sky-300"
                  >
                    {source.title}
                  </a>
                ) : (
                  source.title
                )}
              </p>
              <p className="text-xs text-slate-400">
                {source.locator} · {REVIEW_LABELS[source.review_status]}
              </p>
            </li>
          ))}
        </ul>
      </Collapsible>

      <button
        type="button"
        onClick={onOpenGraph}
        className="w-full rounded-md border border-sky-500/60 px-3 py-2 text-sm font-medium text-sky-200 hover:bg-sky-500/10"
      >
        ¿Por qué? Ver fundamento
      </button>

      <Collapsible title="Orientación operativa de esta evaluación">
        <GuidanceCard assessment={assessment} />
      </Collapsible>
    </div>
  );
}

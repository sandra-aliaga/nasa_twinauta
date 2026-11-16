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
import { tr, translated } from "../i18n";

// Presentation only: attention is not clinical severity.
const ATTENTION_TONES = {
  informational: "sky",
  review_needed: "amber",
  unknown: "slate",
} as const;

function formatValue(observation: Observation): string {
  if (observation.value === null) return tr("Dato ausente");
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
          {tr("día")} {observation.mission_day}
        </span>
      </div>
      {missing && observation.missing_reason ? (
        <p className="mt-1 text-xs text-slate-400">
          {tr("Motivo:")} {tr(observation.missing_reason)}
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
        {tr("Método:")} {tr(observation.method)}
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
      <h4 className="text-sm font-medium text-slate-200">
        {tr(indicator.label)}
      </h4>
      <p className="text-xs text-slate-400">
        {tr(indicator.baseline_interpretation)}
      </p>
      {observations.length === 0 ? (
        <p className="mt-2 text-xs italic text-slate-400">
          {tr("Sin observaciones disponibles hasta este día.")}
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
        {tr("Ejercicio registrado frente al plan")}
      </h4>
      <p className="text-xs text-slate-400">
        {tr("Una sesión sin registro no demuestra que no se haya realizado.")}
      </p>
      {records.length === 0 ? (
        <p className="mt-2 text-xs italic text-slate-400">
          {tr("Sin sesiones planificadas hasta este día.")}
        </p>
      ) : (
        <>
          <p className="mt-2 text-base tabular-nums text-slate-50">
            {recorded} {tr("de")} {records.length} {tr("sesiones con registro")}
          </p>
          <ExerciseBars records={records} />
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm bg-teal-400" />{" "}
              {tr("Registrado")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm border border-slate-500" />{" "}
              {tr("Planificado")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-4 rounded-sm border border-dashed border-amber-300" />{" "}
              {tr("Sin registro")}
            </span>
          </p>
        </>
      )}
    </div>
  );
}

const MODALITY_LABELS: Record<string, string> = translated({
  resistance: "Resistencia",
  aerobic: "Aeróbico",
});

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
                {tr("Día")} {record.mission_day} ·{" "}
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
                  ? tr("{{done}} de {{planned}} min", {
                      done: done ?? "?",
                      planned: planned ?? "?",
                    })
                  : tr("sin registro · plan {{value0}} min", {
                      value0: String(planned ?? "?"),
                    })}
              </span>
            </div>
            <div
              className="relative mt-1 h-2.5"
              role="img"
              aria-label={
                isRecorded
                  ? tr(
                      "Día {{value0}}: {{value1}} minutos registrados de {{value2}}",
                      {
                        value0: String(record.mission_day),
                        value1: String(done ?? tr("duración desconocida")),
                        value2: String(
                          planned ?? tr("una duración no planificada"),
                        ),
                      },
                    )
                  : tr("Día {{value0}}: sesión planificada sin registro", {
                      value0: String(record.mission_day),
                    })
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

/** Latest value of one indicator as a big, glanceable tile. */
function StatTile({
  indicator,
  observations,
}: {
  indicator: IndicatorDefinition;
  observations: Observation[];
}) {
  const latest = [...observations].sort(
    (a, b) => b.mission_day - a.mission_day,
  )[0];
  const missing = !latest || latest.value === null;
  return (
    <div className={`hud-panel p-3 pl-4 ${missing ? "hud-panel-empty" : ""}`}>
      <h4 className="text-xs leading-snug text-slate-300">
        {tr(indicator.label)}
      </h4>
      {missing ? (
        <>
          <p className="mt-2 font-display text-xl text-slate-500">
            {tr("Sin dato")}
          </p>
          <p className="mt-1 line-clamp-2 text-[11px] text-slate-400">
            {latest?.missing_reason ?? tr("No hay mediciones hasta este día.")}
          </p>
        </>
      ) : (
        <>
          <p className="mt-2 font-display text-xl text-slate-50">
            {latest.value}
            <span className="ml-1 font-sans text-xs text-slate-400">
              {UNIT_LABELS[latest.unit]}
            </span>
          </p>
          {latest.unit === "percent_baseline" && latest.value !== null ? (
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-step-now"
                style={{
                  width: `${Math.max(0, Math.min(100, latest.value))}%`,
                }}
              />
            </div>
          ) : null}
          <p className="mt-1 text-[11px] text-slate-400">
            {tr("Medido el día")} {latest.mission_day}
          </p>
        </>
      )}
    </div>
  );
}

/** Sessions with a record out of the planned ones, as pips. */
function ExerciseTile({ records }: { records: ExerciseRecord[] }) {
  const recorded = records.filter(
    (record) => record.record_status === "recorded",
  ).length;
  return (
    <div className="hud-panel col-span-2 p-3 pl-4">
      <h4 className="text-xs text-slate-300">{tr("Ejercicio")}</h4>
      {records.length === 0 ? (
        <p className="mt-2 text-xs text-slate-400">
          {tr("Sin sesiones planificadas hasta este día.")}
        </p>
      ) : (
        <div className="mt-2 flex items-center gap-3">
          <p className="font-display text-xl text-slate-50">
            {recorded}/{records.length}
          </p>
          <div className="min-w-0 flex-1">
            <div className="flex gap-1" aria-hidden="true">
              {records.map((record) => (
                <span
                  key={record.id}
                  className={`h-2 flex-1 rounded-full ${
                    record.record_status === "recorded"
                      ? "bg-step-now"
                      : "border border-dashed border-step-do/70"
                  }`}
                />
              ))}
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {tr(
                "sesiones con registro. Sin registro no significa que no se hizo.",
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

type EvaluationTabProps = {
  assessment: Assessment;
  region: Region;
  indicators: IndicatorDefinition[];
};

/** "Evaluacion de la zona": findings, related data, limits and sources. */
export function EvaluationTab({
  assessment,
  region,
  indicators,
}: EvaluationTabProps) {
  const regionIndicators = region.indicator_ids
    .map((id) => indicators.find((indicator) => indicator.id === id))
    .filter((item): item is IndicatorDefinition => item !== undefined);

  const { data_quality, evidence_applicability, model_limitations } =
    assessment.evidence_context;
  const limitationGroups = [
    { label: tr("Calidad de datos"), items: data_quality },
    {
      label: tr("Aplicabilidad de la evidencia"),
      items: evidence_applicability,
    },
    { label: tr("Límites del modelo"), items: model_limitations },
  ];
  const limitationCount = limitationGroups.reduce(
    (total, group) => total + group.items.length,
    0,
  );

  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-slate-100">
        {tr(assessment.summary)}
      </p>

      {assessment.findings.length > 0 ? (
        <ul className="space-y-2">
          {assessment.findings.map((finding) => (
            <li
              key={finding.id}
              className="hud-panel px-4 py-2.5"
              style={
                {
                  "--rail":
                    finding.attention === "review_needed"
                      ? "var(--color-step-do)"
                      : "var(--color-step-now)",
                } as React.CSSProperties
              }
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-50">
                  {tr(finding.title)}
                </span>
                <Tag tone={ATTENTION_TONES[finding.attention]}>
                  {ATTENTION_LABELS[finding.attention]}
                </Tag>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                {tr(finding.description)}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        {regionIndicators.map((indicator) => (
          <StatTile
            key={indicator.id}
            indicator={indicator}
            observations={assessment.observations.filter(
              (observation) => observation.indicator_id === indicator.id,
            )}
          />
        ))}
        <ExerciseTile records={assessment.exercise_records} />
      </div>

      <Collapsible title={tr("Ver el detalle de los datos")}>
        <div className="space-y-4 pt-1">
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
        </div>
      </Collapsible>

      <Collapsible title={tr("Límites y fuentes")}>
        <div className="space-y-2 pt-1">
          <Collapsible
            title={tr("Límites de interpretación ({{value0}})", {
              value0: String(limitationCount),
            })}
          >
            <dl className="space-y-2">
              {limitationGroups.map(({ label, items }) => (
                <div key={label}>
                  <dt className="text-xs font-medium text-slate-400">
                    {label}
                  </dt>
                  {items.length === 0 ? (
                    <dd className="text-xs italic text-slate-400">
                      {tr("Sin elementos declarados.")}
                    </dd>
                  ) : (
                    items.map((item) => <dd key={item}>• {tr(item)}</dd>)
                  )}
                </div>
              ))}
            </dl>
          </Collapsible>

          <Collapsible
            title={tr("Fuentes ({{value0}})", {
              value0: String(assessment.sources.length),
            })}
          >
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
                        {tr(source.title)}
                      </a>
                    ) : (
                      source.title
                    )}
                  </p>
                  <p className="text-xs text-slate-400">
                    {source.locator}
                    {source.review_status === "reviewed"
                      ? tr(" · revisado")
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          </Collapsible>

          <Collapsible title={tr("Orientación operativa de esta evaluación")}>
            <GuidanceCard assessment={assessment} />
          </Collapsible>
        </div>
      </Collapsible>
    </div>
  );
}

import {
  dataSource,
  type Case,
  type IndicatorDefinition,
  type Region,
} from "../api";
import { explorerSource } from "../api/explorer";
import { useLoad } from "../hooks/useLoad";
import {
  IMPLEMENTATION_LABELS,
  INTERPRETATION_LABELS,
} from "../lib/explorerLabels";
import { UNIT_LABELS } from "../lib/labels";
import { Skeleton, Tag } from "./common";

/**
 * Case summary shown while no region is selected. Every value comes from the
 * backend catalogs; the case has no personal profile (age, sex, blood type),
 * so none is shown or invented.
 */
export function CaseSheet({
  caseItem,
  day,
  regions,
  indicators,
  onSelectRegion,
}: {
  caseItem: Case | null;
  day: number;
  regions: Region[];
  indicators: IndicatorDefinition[];
  onSelectRegion: (regionId: string) => void;
}) {
  const modules = useLoad("modules", (signal) =>
    explorerSource.listModules(signal),
  );
  const index = useLoad(caseItem ? `index|${caseItem.id}` : null, (signal) =>
    dataSource.listCaseAssessments(caseItem?.id ?? "", signal),
  );

  if (!caseItem) return <Skeleton lines={5} label="Cargando caso" />;

  const moduleFor = (regionId: string) =>
    modules?.status === "ready"
      ? modules.data.modules.find((item) => item.region_ids.includes(regionId))
      : undefined;
  const stored = index?.status === "ready" ? index.data : null;
  const contextDays = stored
    ? [
        ...new Set(
          stored.filter((item) => item.has_context).map((i) => i.mission_day),
        ),
      ].sort((a, b) => a - b)
    : [];

  return (
    <section
      aria-labelledby="case-sheet-title"
      className="animate-fade-in space-y-5"
    >
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sky-500/40 bg-sky-500/10"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-sky-300">
            <circle cx="12" cy="8" r="3.5" fill="currentColor" />
            <path
              d="M5 20c.8-3.6 3.6-6 7-6s6.2 2.4 7 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-400">Ficha del caso</p>
          <h2
            id="case-sheet-title"
            className="truncate text-base font-semibold text-slate-50"
          >
            {caseItem.is_virtual ? "Astronauta virtual" : caseItem.label}
          </h2>
          <div className="mt-1 flex flex-wrap gap-1">
            {caseItem.is_virtual ? (
              <Tag tone="violet">Caso sintético</Tag>
            ) : null}
            <Tag tone="subtle">{caseItem.label}</Tag>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm">
        <Stat
          label="Duración de la misión"
          value={`${caseItem.duration_days} días`}
        />
        <Stat label="Día seleccionado" value={`Día ${day}`} />
        <Stat
          label="Evaluaciones guardadas"
          value={stored ? String(stored.length) : "—"}
        />
        <Stat
          label="Con síntesis preparada"
          value={
            stored
              ? contextDays.length > 0
                ? contextDays.map((d) => `día ${d}`).join(", ")
                : "ninguna"
              : "—"
          }
        />
      </dl>

      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Regiones con seguimiento
        </h3>
        {regions.length === 0 ? (
          <p className="text-xs text-slate-400">
            El backend no publica regiones para este caso.
          </p>
        ) : (
          <ul className="space-y-2">
            {regions.map((region) => {
              const module = moduleFor(region.id);
              return (
                <li key={region.id}>
                  <button
                    type="button"
                    onClick={() => onSelectRegion(region.id)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-left transition-colors hover:border-sky-500/60"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-slate-100">
                        {region.label}
                      </span>
                      <span className="text-xs text-sky-300">Evaluar →</span>
                    </div>
                    {module ? (
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Tag tone="subtle">
                          {IMPLEMENTATION_LABELS[module.implementation_status]}
                        </Tag>
                        <Tag tone="subtle">
                          {INTERPRETATION_LABELS[module.interpretation_status]}
                        </Tag>
                      </div>
                    ) : null}
                    <ul className="mt-2 space-y-0.5 text-xs text-slate-400">
                      {region.indicator_ids.map((id) => {
                        const indicator = indicators.find((i) => i.id === id);
                        return (
                          <li key={id}>
                            {indicator?.label ?? id}
                            {indicator
                              ? ` (${UNIT_LABELS[indicator.unit]})`
                              : ""}
                          </li>
                        );
                      })}
                    </ul>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-xs leading-relaxed text-slate-400">
        Este caso no representa a una persona: no incluye nombre, edad, sexo ni
        otros datos personales. Solo se muestran los datos que define el backend
        para el caso.
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2">
      <dt className="text-[11px] text-slate-400">{label}</dt>
      <dd className="mt-0.5 font-medium tabular-nums text-slate-100">
        {value}
      </dd>
    </div>
  );
}

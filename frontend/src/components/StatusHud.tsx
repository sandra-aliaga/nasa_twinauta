import { useEffect, useState, type CSSProperties } from "react";

import {
  dataSource,
  type Assessment,
  type Case,
  type IndicatorDefinition,
  type Region,
} from "../api";
import { useLoad } from "../hooks/useLoad";
import { REFERENCE_RECORDINGS } from "../lib/config";
import { UNIT_LABELS } from "../lib/labels";

const rail = (color: string) => ({ "--rail": color }) as CSSProperties;

/**
 * "Estado general": the at-a-glance console next to the body. Every number
 * comes from the case or from the open assessment. Signals the backend does
 * not provide for the virtual astronaut (pulse, temperature) are shown as
 * idle sensor slots; no value is invented for them.
 */
export function StatusHud({
  caseItem,
  day,
  regions,
  indicators,
  assessment,
  assessmentRegionId,
  onSelectRegion,
  onOpenHeartRate,
}: {
  caseItem: Case | null;
  day: number;
  regions: Region[];
  indicators: IndicatorDefinition[];
  /** Open assessment, if any; its region is `assessmentRegionId`. */
  assessment: Assessment | null;
  assessmentRegionId: string | null;
  onSelectRegion: (regionId: string) => void;
  /** Opens the terrestrial example recording; absent when it is disabled. */
  onOpenHeartRate?: () => void;
}) {
  if (!caseItem) return null;

  const toReview =
    assessment?.findings.filter((item) => item.attention === "review_needed") ??
    [];
  const records = assessment?.exercise_records ?? [];
  const recorded = records.filter(
    (record) => record.record_status === "recorded",
  ).length;
  const region = regions.find((item) => item.id === assessmentRegionId);
  const zoneIndicators = (region?.indicator_ids ?? [])
    .map((id) => indicators.find((item) => item.id === id))
    .filter((item): item is IndicatorDefinition => item !== undefined);
  const progress = Math.min(1, day / Math.max(1, caseItem.duration_days));

  return (
    <section aria-labelledby="hud-title" className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2
            id="hud-title"
            className="font-display text-sm font-medium text-slate-50"
          >
            Estado general
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {caseItem.is_virtual ? "Astronauta virtual" : caseItem.label}
          </p>
        </div>
        <div className="flex items-center gap-2 text-right">
          <p className="text-xs leading-tight text-slate-300">
            <span className="block font-display text-sm text-slate-50">
              Día {day}
            </span>
            de {caseItem.duration_days}
          </p>
          <MissionRing progress={progress} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <PulseExample onOpen={onOpenHeartRate} />

        {zoneIndicators.map((indicator) => {
          const latest = [...(assessment?.observations ?? [])]
            .filter((item) => item.indicator_id === indicator.id)
            .sort((a, b) => b.mission_day - a.mission_day)[0];
          const missing = !latest || latest.value === null;
          return (
            <div
              key={indicator.id}
              className={`hud-panel p-2.5 pl-3.5 ${missing ? "hud-panel-empty" : ""}`}
            >
              <h3 className="line-clamp-2 text-[11px] leading-tight text-slate-300">
                {indicator.label}
              </h3>
              {missing ? (
                <p className="mt-1 font-display text-lg text-slate-500">
                  Sin dato
                </p>
              ) : (
                <p className="mt-1 font-display text-lg text-slate-50">
                  {latest.value}
                  <span className="ml-1 font-sans text-[11px] text-slate-400">
                    {UNIT_LABELS[latest.unit]}
                  </span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="hud-panel p-2.5 pl-3.5">
        <h3 className="text-[11px] text-slate-300">Ejercicio con registro</h3>
        {records.length === 0 ? (
          <p className="mt-1 text-xs text-slate-400">Sin sesiones todavía.</p>
        ) : (
          <div className="mt-1 flex items-center gap-3">
            <p className="font-display text-lg text-slate-50">
              {recorded}/{records.length}
            </p>
            <div
              className="flex flex-1 gap-1"
              role="img"
              aria-label={`${recorded} de ${records.length} sesiones con registro`}
            >
              {records.map((record) => (
                <span
                  key={record.id}
                  className={`h-2 flex-1 rounded-full ${
                    record.record_status === "recorded"
                      ? "bg-step-now"
                      : "border border-dashed border-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {toReview.length > 0 && region ? (
        <button
          type="button"
          onClick={() => onSelectRegion(region.id)}
          style={rail("var(--color-step-do)")}
          className="hud-panel flex w-full items-center gap-2.5 p-2.5 pl-3.5 text-left"
        >
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="absolute inset-0 animate-beacon rounded-full bg-step-do" />
            <span className="relative h-3 w-3 rounded-full bg-step-do" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-slate-50">
              {region.label}: algo por revisar
            </span>
            <span className="block truncate text-xs text-slate-300">
              {toReview[0].title}
              {toReview.length > 1 ? ` y ${toReview.length - 1} más` : ""}
            </span>
          </span>
        </button>
      ) : (
        <p className="text-xs text-slate-400">
          {assessment
            ? "Nada por revisar en la zona evaluada."
            : "Sin evaluación de este día todavía."}
        </p>
      )}
    </section>
  );
}

/**
 * Live readout of the terrestrial example recording (another person on a
 * treadmill). It is labelled as an example in the tile itself: the virtual
 * astronaut has no heart-rate source, so nothing here is attributed to them.
 */
function PulseExample({ onOpen }: { onOpen?: () => void }) {
  const recordingId = REFERENCE_RECORDINGS[0].id;
  const enabled = onOpen !== undefined && dataSource.kind === "api";
  const sample = useLoad(enabled ? `pulse|${recordingId}` : null, (signal) =>
    dataSource.getTelemetryWindow(recordingId, 0, 120, signal),
  );
  const points =
    sample?.status === "ready"
      ? sample.data.points.filter(
          (point): point is { time_s: number; value: number } & typeof point =>
            point.value !== null,
        )
      : [];

  // One sample per second, looping over the loaded window.
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (points.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % points.length),
      1000,
    );
    return () => window.clearInterval(id);
  }, [points.length]);

  const railStyle = rail("var(--color-step-next)");
  if (!enabled || points.length < 2) {
    return (
      <div className="hud-panel hud-panel-empty col-span-2 p-2.5 pl-3.5">
        <h3 className="flex items-center gap-1.5 text-[11px] text-slate-300">
          <HeartIcon />
          Pulso
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          {sample?.status === "loading"
            ? "Cargando ejemplo…"
            : "Sin señal de pulso disponible en este modo."}
        </p>
      </div>
    );
  }

  const current = points[Math.min(index, points.length - 1)];
  const values = points.map((point) => point.value);
  const [low, high] = [Math.min(...values), Math.max(...values)];
  const x = (i: number) => (i / (points.length - 1)) * 200;
  const y = (value: number) =>
    34 - ((value - low) / Math.max(1, high - low)) * 28;
  const path = points.map((point, i) => `${x(i)},${y(point.value)}`).join(" ");
  const at = Math.min(index, points.length - 1);

  return (
    <button
      type="button"
      onClick={onOpen}
      style={railStyle}
      className="hud-panel col-span-2 p-2.5 pl-3.5 text-left"
      aria-label={`Pulso de ejemplo en Tierra: ${Math.round(current.value)} latidos por minuto. Abrir la zona del corazón.`}
    >
      <span className="flex items-center justify-between gap-2 text-[11px] text-slate-300">
        <span className="flex items-center gap-1.5">
          <HeartIcon />
          Pulso
        </span>
        <span className="rounded-full bg-step-next/20 px-2 py-0.5 text-[10px] font-medium text-step-next">
          Ejemplo en Tierra
        </span>
      </span>
      <span className="mt-1 flex items-end gap-3">
        <span className="font-display text-2xl leading-none text-slate-50">
          {Math.round(current.value)}
          <span className="ml-1 font-sans text-[11px] text-slate-400">lpm</span>
        </span>
        <svg
          viewBox="0 0 200 38"
          preserveAspectRatio="none"
          className="h-9 min-w-0 flex-1"
          aria-hidden="true"
        >
          <polyline
            points={path}
            fill="none"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className="stroke-step-next"
          />
          <circle
            cx={x(at)}
            cy={y(current.value)}
            r="3"
            className="fill-slate-50"
          />
        </svg>
      </span>
      <span className="mt-1 block text-[11px] text-slate-400">
        De otra persona en cinta, no del astronauta.
      </span>
    </button>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 text-step-next"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M8 14s-5.5-3.4-5.5-7.3A3 3 0 0 1 8 5a3 3 0 0 1 5.5 1.7C13.5 10.6 8 14 8 14z"
      />
    </svg>
  );
}

function MissionRing({ progress }: { progress: number }) {
  const r = 16;
  const length = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 -rotate-90" aria-hidden="true">
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        strokeWidth="4"
        className="stroke-slate-800"
      />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={`${length * progress} ${length}`}
        className="stroke-step-now"
      />
    </svg>
  );
}

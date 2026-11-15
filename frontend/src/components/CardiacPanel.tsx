import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { dataSource } from "../api";
import { useTelemetry } from "../hooks/useTelemetry";
import { REFERENCE_RECORDINGS } from "../lib/config";
import { ORIGIN_LABELS } from "../lib/labels";
import { Collapsible, ErrorNotice, Notice, Skeleton, Tag } from "./common";

// Visible span of the chart; it matches the API window size.
const VIEW_SPAN_S = 120;
const SPEEDS = [1, 5, 20] as const;
const TICK_MS = 100;
const LINE_COLOR = "#38bdf8";

type CardiacPanelProps = {
  /** Recording linked to the case; it may be absent. */
  caseRecordingId: string | null;
  onClose: () => void;
  /** Inside the heart zone panel instead of the bottom drawer. */
  embedded?: boolean;
};

/**
 * Didactic heart-rate player. Recordings come from terrestrial exercise, so
 * their clock (seconds since the test start) never mixes with mission days.
 */
export function CardiacPanel({
  caseRecordingId,
  onClose,
  embedded = false,
}: CardiacPanelProps) {
  const options = useMemo(() => {
    const list: { id: string; label: string }[] = [];
    // The reference recording only exists in the real API. It goes first:
    // the case recording is a short synthetic placeholder (a few samples).
    if (dataSource.kind === "api") {
      for (const item of REFERENCE_RECORDINGS) {
        if (item.id !== caseRecordingId) list.push({ ...item });
      }
    }
    if (caseRecordingId) {
      list.push({ id: caseRecordingId, label: "Grabación asociada al caso" });
    }
    return list;
  }, [caseRecordingId]);
  const [recordingId, setRecordingId] = useState(options[0]?.id ?? null);
  const sectionRef = useRef<HTMLElement>(null);

  // On narrow screens the panel opens below the page; bring it into view.
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      sectionRef.current?.scrollIntoView({ block: "start" });
    }
  }, []);

  return (
    <section
      aria-label="Frecuencia cardíaca didáctica"
      ref={sectionRef}
      className={
        embedded
          ? ""
          : "shrink-0 border-t border-slate-800 bg-slate-900/70 px-4 py-3 lg:max-h-[40vh] lg:overflow-y-auto"
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2
          className={
            embedded ? "sr-only" : "text-sm font-semibold text-slate-100"
          }
        >
          Frecuencia cardíaca (didáctica)
        </h2>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {options.length > 1 ? (
            <label className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
              Grabación
              <select
                value={recordingId ?? ""}
                onChange={(event) => setRecordingId(event.target.value)}
                className="min-w-0 max-w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100"
              >
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {embedded ? null : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>

      {recordingId ? (
        // Keyed so that switching recordings resets playback state.
        <RecordingPlayer
          key={recordingId}
          recordingId={recordingId}
          embedded={embedded}
        />
      ) : (
        <p className="mt-2 text-xs text-slate-400">
          No hay grabaciones disponibles para este caso.
        </p>
      )}
    </section>
  );
}

function RecordingPlayer({
  recordingId,
  embedded,
}: {
  recordingId: string;
  embedded: boolean;
}) {
  const state = useTelemetry(recordingId);
  const [time, setTime] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(5);

  const ready = state.status === "ready" ? state : null;
  const startS = ready?.recording.start_s ?? 0;
  const endS = ready?.recording.end_s ?? 0;
  const loadedUntil = ready?.loadedUntil ?? 0;
  const cursor = time ?? startS;

  // Keep the latest bounds for the interval without restarting it.
  const bounds = useRef({ endS, loadedUntil });
  bounds.current = { endS, loadedUntil };

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setTime((current) => {
        const { endS: end, loadedUntil: loaded } = bounds.current;
        const next = (current ?? startS) + (TICK_MS / 1000) * speed;
        if (next >= end) {
          setPlaying(false);
          return end;
        }
        // Wait for the next window instead of drawing beyond loaded data.
        return Math.min(next, loaded);
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playing, speed, startS]);

  const points = useMemo(() => ready?.points ?? [], [ready?.points]);
  const yDomain = useMemo(() => {
    const values = points.flatMap((p) => (p.value === null ? [] : [p.value]));
    if (values.length === 0) return [40, 200];
    const low = Math.floor((Math.min(...values) - 5) / 10) * 10;
    const high = Math.ceil((Math.max(...values) + 5) / 10) * 10;
    return [low, high];
  }, [points]);

  if (state.status === "loading") {
    return <Skeleton lines={4} label="Cargando metadatos" className="mt-3" />;
  }
  if (state.status === "error") {
    return (
      <div className="mt-2">
        <ErrorNotice error={state.error} />
      </div>
    );
  }

  const { recording, source, complete, windowError } = state;
  const span = Math.min(VIEW_SPAN_S, endS - startS);
  const viewStart = Math.min(
    Math.max(startS, cursor - span * 0.85),
    endS - span,
  );
  const viewEnd = viewStart + span;
  const played = points.filter(
    (p) => p.time_s >= viewStart && p.time_s <= cursor,
  );
  const missing = points.filter(
    (p) => p.value === null && p.time_s >= viewStart && p.time_s <= viewEnd,
  );
  const current = [...points].reverse().find((p) => p.time_s <= cursor) ?? null;
  const missingTotal = points.filter((p) => p.value === null).length;
  const finished = cursor >= endS;
  // Typical sample spacing, used to group consecutive missing values.
  const gapStep =
    points.length > 1
      ? (points[points.length - 1].time_s - points[0].time_s) /
        (points.length - 1)
      : 1;

  return (
    <div className="mt-2 space-y-3">
      <div className="flex flex-wrap gap-1">
        <Tag tone="violet">Ejercicio en Tierra</Tag>
        <Tag>
          {recording.origin === "synthetic"
            ? "Participante sintético"
            : `Participante ${recording.participant_id}`}
        </Tag>
        <Tag tone={recording.origin === "human_dataset" ? "sky" : "amber"}>
          {ORIGIN_LABELS[recording.origin]}
        </Tag>
        <Tag>
          {recording.content_mode === "illustrative"
            ? "Contenido ilustrativo"
            : "Basado en evidencia"}
        </Tag>
      </div>

      <div
        className={`grid gap-3 ${embedded ? "" : "lg:grid-cols-[minmax(0,1fr)_200px]"}`}
      >
        <div
          className="h-44"
          role="img"
          aria-label={chartLabel(viewStart, viewEnd, current)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={played}
              margin={{ top: 18, right: 12, bottom: 4, left: 0 }}
            >
              <CartesianGrid stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="time_s"
                type="number"
                domain={[viewStart, viewEnd]}
                allowDataOverflow
                tickFormatter={(value: number) =>
                  `${span < 10 ? value.toFixed(1) : Math.round(value)} s`
                }
                stroke="#64748b"
                fontSize={11}
              />
              <YAxis
                domain={yDomain}
                width={40}
                stroke="#64748b"
                fontSize={11}
                label={{
                  value: "lpm",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                  fontSize: 11,
                }}
              />
              <Tooltip
                isAnimationActive={false}
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #334155",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#cbd5e1" }}
                labelFormatter={(label) => `t = ${String(label)} s`}
                formatter={(value) =>
                  value === null || value === undefined
                    ? ["sin medición", "FC"]
                    : [`${String(value)} lpm`, "FC"]
                }
              />
              {missing.map((p, index) => (
                <ReferenceLine
                  key={p.time_s}
                  x={p.time_s}
                  stroke="#94a3b8"
                  strokeDasharray="3 3"
                  label={
                    // Label only the first gap of a run so texts do not overlap.
                    index === 0 ||
                    missing[index - 1].time_s < p.time_s - 2 * gapStep
                      ? {
                          value: "sin dato",
                          fill: "#94a3b8",
                          fontSize: 10,
                          position: "top",
                        }
                      : undefined
                  }
                />
              ))}
              <ReferenceLine x={cursor} stroke="#475569" />
              <Line
                type="linear"
                dataKey="value"
                stroke={LINE_COLOR}
                strokeWidth={2}
                dot={(props: { cx?: number; cy?: number; index?: number }) =>
                  isolatedDot(props, played)
                }
                connectNulls={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-xs text-slate-400">
            Lectura en t = {Math.round(cursor)} s
          </p>
          <p
            className="text-2xl font-semibold text-slate-100"
            aria-live="polite"
          >
            {current === null
              ? "—"
              : current.value === null
                ? "Sin medición"
                : `${current.value} lpm`}
          </p>
          {current?.value === null && current.missing_reason ? (
            <p className="text-xs text-slate-400">
              Motivo: {current.missing_reason}
            </p>
          ) : null}
          {finished ? (
            <p className="text-xs text-slate-300" role="status">
              Grabación terminada.
            </p>
          ) : null}
          <p className="text-xs text-slate-400">
            {complete
              ? `${points.length} muestras · ${missingTotal} sin medición`
              : `Cargando ventanas… ${Math.round(loadedUntil)} de ${Math.round(endS)} s`}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (finished) setTime(startS);
            setPlaying((value) => !value);
          }}
          className="rounded-md bg-sky-500/20 px-3 py-1 text-sm text-sky-100 hover:bg-sky-500/30"
        >
          {playing ? "Pausa" : finished ? "Repetir" : "Reproducir"}
        </button>
        <label className="flex min-w-48 flex-1 items-center gap-2 text-xs text-slate-400">
          <span className="sr-only">Posición en la grabación</span>
          <input
            type="range"
            min={startS}
            max={endS}
            step={1}
            value={cursor}
            onChange={(event) =>
              setTime(Math.min(Number(event.target.value), loadedUntil))
            }
            className="w-full accent-sky-400"
            aria-valuetext={`${Math.round(cursor)} segundos`}
          />
          <span className="w-20 text-right tabular-nums">
            {Math.round(cursor)} / {Math.round(endS)} s
          </span>
        </label>
        <div role="group" aria-label="Velocidad" className="flex gap-1">
          {SPEEDS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={speed === value}
              onClick={() => setSpeed(value)}
              className={`rounded px-3 py-1.5 text-xs ${
                speed === value
                  ? "bg-slate-700 text-slate-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ×{value}
            </button>
          ))}
        </div>
      </div>

      {windowError ? <ErrorNotice error={windowError} /> : null}

      <Notice title="No es una medición del astronauta virtual">
        {recording.origin === "synthetic"
          ? `Señal sintética de maquetación (${recording.dataset_id}); no es una medición de ninguna persona. `
          : `Procede de otro participante y otro dataset (${recording.dataset_id}). `}
        El tiempo está en segundos desde el inicio de la prueba y no corresponde
        a días de misión. Los huecos de la línea son valores ausentes en la
        fuente; no se interpolan.
      </Notice>

      {source ? (
        <p className="text-xs text-slate-400">
          Fuente:{" "}
          {source.url ? (
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sky-300 underline-offset-2 hover:underline"
            >
              {source.title}
            </a>
          ) : (
            source.title
          )}
          {source.license ? ` · Licencia ${source.license}` : ""}
        </p>
      ) : null}

      <Collapsible title="Ver datos de la ventana visible">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-400">
            <tr>
              <th className="py-1 font-normal">Tiempo (s)</th>
              <th className="py-1 font-normal">FC (lpm)</th>
            </tr>
          </thead>
          <tbody>
            {points
              .filter((p) => p.time_s >= viewStart && p.time_s <= viewEnd)
              .map((p) => (
                <tr key={p.time_s} className="border-t border-slate-800">
                  <td className="py-0.5 tabular-nums">{p.time_s}</td>
                  <td className="py-0.5 tabular-nums">
                    {p.value ??
                      `sin medición (${p.missing_reason ?? "sin motivo"})`}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Collapsible>
    </div>
  );
}

function chartLabel(
  start: number,
  end: number,
  current: { value: number | null } | null,
): string {
  const reading =
    current === null
      ? "sin lectura"
      : current.value === null
        ? "sin medición"
        : `${current.value} latidos por minuto`;
  return `Frecuencia cardíaca entre ${Math.round(start)} y ${Math.round(end)} segundos; lectura actual: ${reading}.`;
}

/**
 * A sample with missing neighbours has no segment to draw, so it would be
 * invisible; show it as a dot. Connected samples keep the plain line.
 */
function isolatedDot(
  props: { cx?: number; cy?: number; index?: number },
  data: { value: number | null }[],
) {
  const { cx, cy, index } = props;
  const key = `dot-${index ?? "x"}`;
  if (index === undefined || cx === undefined || cy === undefined) {
    return <g key={key} />;
  }
  const value = data[index]?.value ?? null;
  const prev = index > 0 ? data[index - 1].value : null;
  const next = index < data.length - 1 ? data[index + 1].value : null;
  if (value === null || prev !== null || next !== null) return <g key={key} />;
  return <circle key={key} cx={cx} cy={cy} r={3} fill={LINE_COLOR} />;
}

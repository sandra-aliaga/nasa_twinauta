import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { apiBaseUrl } from "../api/config";
import { requestJson } from "../api/httpSource";
import type { components } from "../api/schema";
import { useLoad } from "../hooks/useLoad";
import { ErrorNotice, Skeleton } from "./common";
import { tr, msg, formatNumber } from "../i18n";

type Laboratories = components["schemas"]["FlightLaboratories"];
type Exercise = components["schemas"]["ExerciseSession"];
const fmt = (value: number | null | undefined) =>
  value == null ? tr("Sin medición") : formatNumber(value);

/** Blood samples use their own mission-relative labels and never the virtual day. */
export function FlightLaboratoryPanel() {
  const state = useLoad("nasa-flight-cmp-v1", (signal) =>
    requestJson<Laboratories>(apiBaseUrl, "/reference-laboratories", {
      signal,
    }),
  );
  const [participant, setParticipant] = useState("C001");
  const [timepoint, setTimepoint] = useState("R+1");
  const [metric, setMetric] = useState("glucose");
  if (!state || state.status === "loading")
    return <Skeleton lines={4} label={tr("Cargando muestras NASA de vuelo")} />;
  if (state.status === "error") return <ErrorNotice error={state.error} />;
  const data = state.data;
  const participants = [
    ...new Set(data.samples.map((sample) => sample.participant_id)),
  ];
  const samples = data.samples.filter(
    (sample) => sample.participant_id === participant,
  );
  const selected =
    samples.find((sample) => sample.timepoint === timepoint) ?? samples[0];
  const variable =
    selected.values.find((value) => value.id === metric) ?? selected.values[0];
  const points = samples.map((sample) => ({
    timepoint: sample.timepoint,
    value: sample.values.find((value) => value.id === metric)?.value ?? null,
  }));
  return (
    <section className="hud-panel space-y-3 p-4 text-sm">
      <h3 className="font-display text-base text-slate-50">
        {tr("Inspiration4 · muestras reales de vuelo")}
      </h3>
      <p className="text-xs text-slate-400">
        {tr(
          "NASA OSD-575 · cuatro tripulantes · 28 muestras · siete puntos por persona",
        )}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-xs text-slate-300">
          {tr("Tripulante")}
          <select
            aria-label={tr("Tripulante Inspiration4")}
            className="mt-1 w-full rounded border border-slate-600 bg-slate-950 p-2"
            value={participant}
            onChange={(event) => setParticipant(event.target.value)}
          >
            {participants.map((id) => (
              <option key={id}>{id}</option>
            ))}
          </select>
        </label>
        <label className="text-xs text-slate-300">
          {tr("Muestra")}
          <select
            aria-label={tr("Punto temporal NASA")}
            className="mt-1 w-full rounded border border-slate-600 bg-slate-950 p-2"
            value={selected.timepoint}
            onChange={(event) => setTimepoint(event.target.value)}
          >
            {samples.map((sample) => (
              <option key={sample.sample_id}>{sample.timepoint}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-xs text-slate-400">
        {tr("L: respecto al lanzamiento · R: respecto al regreso.")}{" "}
        {selected.phase === "preflight"
          ? tr("Antes del vuelo")
          : tr("Después del vuelo")}
        .
      </p>
      <div className="grid grid-cols-2 gap-2">
        {selected.values.map((value) => (
          <div key={value.id} className="rounded border border-slate-700 p-2">
            <p className="text-xs text-slate-300">{tr(value.label)}</p>
            <p className="mt-1 font-display text-lg text-slate-50">
              {fmt(value.value)} <span className="text-xs">{value.unit}</span>
            </p>
            <p className="text-[11px] text-slate-400">
              {tr("Laboratorio:")} {fmt(value.laboratory_min)}–
              {fmt(value.laboratory_max)}
            </p>
          </div>
        ))}
      </div>
      <label className="block text-xs text-slate-300">
        {tr("Comparar puntos de una variable")}
        <select
          aria-label={tr("Variable de laboratorio")}
          className="mt-1 w-full rounded border border-slate-600 bg-slate-950 p-2"
          value={metric}
          onChange={(event) => setMetric(event.target.value)}
        >
          {selected.values.map((value) => (
            <option key={value.id} value={value.id}>
              {tr(value.label)} ({value.unit})
            </option>
          ))}
        </select>
      </label>
      <div
        className="h-44"
        role="img"
        aria-label={tr(
          "{{value0}} del tripulante {{value1}} en siete muestras",
          { value0: tr(variable.label), value1: String(participant) },
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={points}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis
              dataKey="timepoint"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "#0f172a", borderColor: "#475569" }}
            />
            <Bar
              dataKey="value"
              name={`${tr(variable.label)} (${variable.unit})`}
              fill="#60a5fa"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details className="text-xs text-slate-300">
        <summary className="cursor-pointer">
          {tr("Ver las siete mediciones")}
        </summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr>
              <th>{tr("Punto")}</th>
              <th>
                {tr(variable.label)} ({variable.unit})
              </th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.timepoint}>
                <td className="py-1">{point.timepoint}</td>
                <td>{fmt(point.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <p className="text-xs text-slate-400">
        {tr("Muestra original:")} {selected.sample_id}
        {tr(". Sin muestras de este panel durante el vuelo.")}
      </p>
      <details className="text-xs text-slate-400">
        <summary className="cursor-pointer">
          {tr("Alcance y rangos del laboratorio")}
        </summary>
        {data.limitations.map((text) => (
          <p className="mt-1" key={text}>
            {tr(text)}
          </p>
        ))}
      </details>
      <div className="flex flex-wrap gap-3 text-xs text-sky-300">
        <a href={data.source_url} target="_blank" rel="noreferrer">
          {tr("CSV original NASA")}
        </a>
        <a href={data.publication_url} target="_blank" rel="noreferrer">
          {tr("Publicación y acceso a los datos")}
        </a>
      </div>
    </section>
  );
}

const SIGNALS = [
  { key: "speed_kmh", label: "Velocidad", unit: "km/h" },
  { key: "oxygen_ml_min", label: msg("Consumo de oxígeno"), unit: "mL/min" },
  { key: "heart_rate", label: msg("Frecuencia cardíaca"), unit: "lat/min" },
  {
    key: "respiratory_rate",
    label: msg("Frecuencia respiratoria"),
    unit: "resp/min",
  },
  { key: "ventilation_l_min", label: msg("Ventilación"), unit: "L/min" },
  {
    key: "carbon_dioxide_ml_min",
    label: msg("Producción de CO₂"),
    unit: "mL/min",
  },
] as const;
type SignalKey = (typeof SIGNALS)[number]["key"];

export function ObservedExercisePanel() {
  const state = useLoad("observed-exercise-v1", (signal) =>
    requestJson<Exercise>(apiBaseUrl, "/reference-exercise", { signal }),
  );
  const [key, setKey] = useState<SignalKey>("speed_kmh");
  if (!state || state.status === "loading")
    return (
      <Skeleton lines={4} label={tr("Cargando prueba real de ejercicio")} />
    );
  if (state.status === "error") return <ErrorNotice error={state.error} />;
  const data = state.data;
  const signal = SIGNALS.find((item) => item.key === key) ?? SIGNALS[0];
  const values = data.samples
    .map((sample) => sample[key])
    .filter((value): value is number => value !== null);
  const elapsed =
    data.samples[data.samples.length - 1].time_s - data.samples[0].time_s;
  return (
    <section className="hud-panel space-y-3 p-4 text-sm">
      <h3 className="font-display text-base text-slate-50">
        {tr("Sesión observada de ejercicio")}
      </h3>
      <p className="text-xs text-slate-400">
        {tr("PhysioNet · prueba")} {data.test_id} {tr("· participante")}{" "}
        {data.participant_id} {tr("· cinta terrestre")}
      </p>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded border border-slate-700 p-2">
          <p className="text-xs text-slate-400">{tr("Periodo registrado")}</p>
          <p className="font-display text-lg text-slate-50">
            {fmt(elapsed / 60)} {tr("min")}
          </p>
        </div>
        <div className="rounded border border-slate-700 p-2">
          <p className="text-xs text-slate-400">{tr("Muestras originales")}</p>
          <p className="font-display text-lg text-slate-50">
            {data.samples.length}
          </p>
        </div>
      </div>
      <label className="block text-xs text-slate-300">
        {tr("Variable")}
        <select
          aria-label={tr("Variable de ejercicio")}
          className="mt-1 w-full rounded border border-slate-600 bg-slate-950 p-2"
          value={key}
          onChange={(event) => setKey(event.target.value as SignalKey)}
        >
          {SIGNALS.map((item) => (
            <option key={item.key} value={item.key}>
              {tr(item.label)} ({tr(item.unit)})
            </option>
          ))}
        </select>
      </label>
      <p className="text-xs text-slate-300">
        {tr("Rango observado:")} {fmt(Math.min(...values))}–
        {fmt(Math.max(...values))} {tr(signal.unit)} · {values.length}{" "}
        {tr("valores disponibles")}
      </p>
      <div
        className="h-44"
        role="img"
        aria-label={tr("{{label}} durante la prueba de esfuerzo", {
          label: tr(signal.label),
        })}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.samples}>
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
            <XAxis
              dataKey="time_s"
              type="number"
              domain={["dataMin", "dataMax"]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
            />
            <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "#0f172a", borderColor: "#475569" }}
            />
            <Line
              type="linear"
              dataKey={key}
              name={`${tr(signal.label)} (${tr(signal.unit)})`}
              stroke="#a78bfa"
              dot={false}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-slate-400">
        {tr(
          "Tiempo original en segundos; cada punto conserva su fila del CSV. Curva descriptiva entre muestras, sin imputar valores ausentes.",
        )}
      </p>
      <details className="text-xs text-slate-400">
        <summary className="cursor-pointer">{tr("Método y límites")}</summary>
        {data.limitations.map((text) => (
          <p className="mt-1" key={text}>
            {tr(text)}
          </p>
        ))}
      </details>
      <a
        className="text-xs text-sky-300"
        href={data.source_url}
        target="_blank"
        rel="noreferrer"
      >
        {tr("Fuente, unidades y protocolo de la prueba")}
      </a>
      <p className="text-xs text-slate-400">
        {tr(data.nasa_monitoring_context)}
      </p>
      <a
        className="block text-xs text-sky-300"
        href={data.nasa_monitoring_url}
        target="_blank"
        rel="noreferrer"
      >
        {tr("NASA: seguimiento y prescripción de ejercicio")}
      </a>
    </section>
  );
}

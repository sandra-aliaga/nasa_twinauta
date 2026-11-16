import { createContext, useContext, useState, type ReactNode } from "react";
import { apiBaseUrl } from "../api/config";
import { requestJson } from "../api/httpSource";
import type { components } from "../api/schema";
import { useLoad } from "../hooks/useLoad";
import { ErrorNotice, Skeleton } from "./common";
import { ObservedExercisePanel } from "./ObservedDataPanels";
import { tr, formatNumber } from "../i18n";

type Reference = components["schemas"]["ReferenceDashboard"];

const ParticipantContext = createContext({
  subject: "5875",
  setSubject: (_subject: string) => {},
});

export function ReferenceParticipantProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [subject, setSubject] = useState("5875");
  return (
    <ParticipantContext.Provider value={{ subject, setSubject }}>
      {children}
    </ParticipantContext.Provider>
  );
}

export function useReferenceDashboard() {
  return useLoad("observed-references-v1", (signal) =>
    requestJson<Reference>(apiBaseUrl, "/reference-dashboard", { signal }),
  );
}

const number = (value: number) => formatNumber(value);

/** Source clocks are preserved; measurements never inherit the virtual mission day. */
export function ReferenceDashboard({
  view = "evaluation",
  compact = false,
}: {
  view?: "evaluation" | "scenario" | "actions";
  compact?: boolean;
}) {
  const state = useReferenceDashboard();
  const { subject, setSubject } = useContext(ParticipantContext);
  if (!state || state.status === "loading")
    return <Skeleton lines={4} label={tr("Cargando mediciones originales")} />;
  if (state.status === "error") return <ErrorNotice error={state.error} />;
  const data = state.data;
  const participant =
    data.participants.find((item) => item.id === subject) ??
    data.participants[0];
  if (!participant)
    return <p>{tr("No hay mediciones pareadas en el depósito.")}</p>;
  const first = participant.measurements[0];
  const last = participant.measurements[1];
  const delta = ((last.value - first.value) / first.value) * 100;
  const quadriceps = data.muscle_statistics.find(
    (item) => item.anatomy === "quadriceps",
  );

  if (compact)
    return (
      <section className="space-y-2 text-xs">
        <p className="text-slate-400">
          {tr("Resultados reales de referencia")}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="hud-panel p-3">
            <p>
              {tr("Torque · participante")} {participant.id}
            </p>
            <p className="mt-2 font-display text-xl text-slate-50">
              {number(last.value)} <span className="text-xs">N·m</span>
            </p>
            <p className="mt-1 text-slate-400">
              {tr("NASA MR079G ·")} {last.date}
            </p>
          </div>
          <div className="hud-panel p-3">
            <p>{tr("Área del cuádriceps")}</p>
            <p className="mt-2 font-display text-xl text-slate-50">
              {quadriceps ? number(quadriceps.value) : "—"}{" "}
              <span className="text-xs">{tr("% basal/día")}</span>
            </p>
            <p className="mt-1 text-slate-400">
              {tr("Scott 2020 · tasa grupal, n=9")}
            </p>
          </div>
        </div>
        <p className="text-slate-400">
          {tr("Torque individual y área grupal de estudios distintos.")}
        </p>
      </section>
    );

  return (
    <div className="space-y-5 text-sm">
      <p className="text-xs text-step-now">
        {tr("DATOS OBSERVADOS Y RESULTADOS PUBLICADOS")}
      </p>
      {view !== "actions" ? (
        <>
          <section className="hud-panel space-y-3 p-4">
            <h3 className="font-display text-base text-slate-50">
              {tr("Torque de extensión de rodilla")}
            </h3>
            <label className="block text-xs text-slate-300">
              {tr("Participante NASA")}
              <select
                value={participant.id}
                onChange={(event) => setSubject(event.target.value)}
                className="mt-1 w-full rounded border border-slate-600 bg-slate-950 p-2 text-slate-100"
              >
                {data.participants.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {participant.measurements.map((measurement, index) => (
                <div
                  key={measurement.source_url}
                  className="rounded border border-slate-700 p-3"
                >
                  <p className="text-xs text-slate-400">
                    {tr("Evaluación")} {index + 1} · {measurement.date}
                  </p>
                  <p className="mt-1 font-display text-2xl text-slate-50">
                    {number(measurement.value)}{" "}
                    <span className="text-sm">N·m</span>
                  </p>
                  <div className="mt-2 h-2 rounded bg-slate-800">
                    <div
                      className="h-2 rounded bg-step-now"
                      style={{
                        width: `${(measurement.value / Math.max(first.value, last.value)) * 100}%`,
                      }}
                    />
                  </div>
                  <a
                    className="mt-2 block text-xs text-sky-300"
                    href={measurement.source_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tr("CSV NASA · fila")} {measurement.source_row}
                  </a>
                </div>
              ))}
            </div>
            <p className="text-slate-200">
              {tr("Cambio entre evaluaciones:")}{" "}
              <strong>
                {delta > 0 ? "+" : ""}
                {number(delta)} %
              </strong>
            </p>
            <p className="text-xs text-slate-400">
              {tr(
                "Calculado como (segunda − primera) / primera. No hay mediciones intermedias.",
              )}
            </p>
            <p className="text-xs text-slate-300">
              {tr(
                "Biodex · extensión de rodilla a 60°/s · cinco repeticiones.",
              )}
            </p>
            <details className="text-xs text-slate-400">
              <summary className="cursor-pointer">
                {tr("Método y fechas del depósito")}
              </summary>
              {data.torque_limitations.map((text) => (
                <p className="mt-1" key={text}>
                  {tr(text)}
                </p>
              ))}
            </details>
          </section>
          <section className="hud-panel space-y-3 p-4">
            <h3 className="font-display text-base text-slate-50">
              {tr("Cambio de área muscular durante reposo en cama")}
            </h3>
            <p className="text-xs text-slate-300">
              {tr("70 días · MRI · nueve participantes · Scott 2020")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {data.muscle_statistics.map((statistic) => (
                <div
                  key={statistic.id}
                  className="rounded border border-slate-700 p-3"
                >
                  <p className="text-slate-300">
                    {statistic.anatomy === "quadriceps"
                      ? tr("Cuádriceps")
                      : tr("Sóleo")}
                  </p>
                  <p className="mt-1 font-display text-2xl text-slate-50">
                    {number(statistic.value)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {tr("% del basal por día")}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400">
              {tr(
                "Tasas publicadas del grupo; describen el área transversal respecto al basal. No son mediciones actuales del participante de torque.",
              )}
            </p>
            <a
              className="text-xs text-sky-300"
              href={quadriceps?.source_url}
              target="_blank"
              rel="noreferrer"
            >
              {tr("Estudio y suplemento · eTable 3")}
            </a>
          </section>
        </>
      ) : null}
      {view !== "evaluation" ? (
        <section className="hud-panel space-y-3 p-4">
          <h3 className="font-display text-base text-slate-50">
            {tr("Ejercicio y función muscular: comparación publicada")}
          </h3>
          <p className="text-xs text-slate-300">
            {tr(
              "SPRINT 2024 · 70 días de reposo en cama · extensión de rodilla a 60°/s",
            )}
          </p>
          <table className="w-full text-left text-xs text-slate-200">
            <thead>
              <tr>
                <th className="py-2">{tr("Grupo")}</th>
                <th>{tr("Antes")}</th>
                <th>{tr("Después")}</th>
              </tr>
            </thead>
            <tbody>
              {["BR", "BRE"].map((group) => {
                const points = data.published_torque.filter(
                  (item) => item.group_label === group,
                );
                return (
                  <tr key={group}>
                    <td className="py-3">
                      {group === "BR"
                        ? tr("Sin ejercicio")
                        : tr("Con ejercicio")}
                    </td>
                    {points.map((point) => (
                      <td key={point.id}>
                        {number(point.value)} ±{" "}
                        {String(point.dispersion?.value)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-xs text-slate-400">
            {tr(
              "N·m · media ± desviación estándar · nueve participantes por grupo. Son grupos distintos del depósito Campaign 17.",
            )}
          </p>
          <a
            className="text-xs text-sky-300"
            href={data.published_torque[0]?.source_url}
            target="_blank"
            rel="noreferrer"
          >
            {tr("Consultar protocolo y resultados · Tabla 1")}
          </a>
          {view === "actions" ? (
            <div className="space-y-2 border-t border-slate-700 pt-3">
              <h4 className="font-medium text-slate-50">
                {tr("Siguientes pasos")}
              </h4>
              <ol className="list-decimal space-y-2 pl-4 text-slate-300">
                <li>
                  {tr(
                    "Revisar las evaluaciones de torque con el mismo método y sus fechas.",
                  )}
                </li>
                <li>
                  {tr(
                    "Contrastar la función con el tamaño muscular: no cambian necesariamente en la misma proporción.",
                  )}
                </li>
                <li>
                  {tr(
                    "Consultar el protocolo de ejercicio y revisar su aplicabilidad con el responsable de salud de la misión.",
                  )}
                </li>
              </ol>
              <p className="text-xs text-slate-400">
                {tr(
                  "El depósito no contiene sesiones realizadas; esta comparación no calcula cumplimiento ni prescribe una dosis individual.",
                )}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
      {view !== "scenario" ? <ObservedExercisePanel /> : null}
    </div>
  );
}

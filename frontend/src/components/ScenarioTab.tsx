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

import type { Assessment } from "../api";
import {
  ENVIRONMENT_LABELS,
  SCENARIO_STATUS_LABELS,
  UNIT_LABELS,
} from "../lib/labels";
import { Collapsible, Notice, Tag } from "./common";

type Scenario = Assessment["scenario"];

type ScenarioTabProps = {
  assessment: Assessment;
  onOpenGraph: () => void;
};

/**
 * "Evolucion del escenario". Points are drawn only when the backend reports
 * the scenario as available; otherwise the reason is shown and no curve is
 * invented. The x axis is the reference protocol day, never a mission day.
 */
export function ScenarioTab({ assessment, onOpenGraph }: ScenarioTabProps) {
  const scenario = assessment.scenario;
  const available = scenario.status === "available";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium text-slate-100">{scenario.label}</h3>
        <Tag tone={available ? "sky" : "amber"}>
          {SCENARIO_STATUS_LABELS[scenario.status]}
        </Tag>
      </div>

      <p className="text-sm leading-relaxed text-slate-200">
        {scenario.summary}
      </p>

      <Notice title="Trayectoria de referencia, no pronóstico individual">
        Describe un protocolo de referencia con sus supuestos. No representa el
        futuro clínico del astronauta ni se asigna a días de misión.
      </Notice>

      {!available ? (
        <EmptyChart scenario={scenario} />
      ) : (
        <section className="space-y-3">
          <dl className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <dt className="text-slate-400">Modelo</dt>
            <dd>
              {scenario.model_id} · v{scenario.model_version}
            </dd>
            <dt className="text-slate-400">Inicio de referencia</dt>
            <dd>Día {scenario.reference_start_day} del protocolo</dd>
            <dt className="text-slate-400">Horizonte</dt>
            <dd>{scenario.horizon_days} días</dd>
            {scenario.domain ? (
              <>
                <dt className="text-slate-400">Dominio</dt>
                <dd>
                  {ENVIRONMENT_LABELS[scenario.domain.environment]}, días{" "}
                  {scenario.domain.min_reference_day} a{" "}
                  {scenario.domain.max_reference_day}
                </dd>
                <dt className="text-slate-400">Basal</dt>
                <dd>{scenario.domain.baseline_definition}</dd>
              </>
            ) : null}
          </dl>

          {scenario.domain?.environment === "bed_rest_analog" ? (
            <Tag tone="amber">Análogo terrestre (reposo en cama)</Tag>
          ) : null}
          <ScenarioChart scenario={scenario} />

          <Collapsible title="Ver datos de la trayectoria">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-slate-400">
                <tr>
                  <th className="py-1 font-medium">Día del protocolo</th>
                  <th className="py-1 font-medium">
                    Valor ({UNIT_LABELS[scenario.unit]})
                  </th>
                </tr>
              </thead>
              <tbody>
                {scenario.points.map((point) => (
                  <tr
                    key={point.elapsed_day}
                    className="border-t border-slate-800"
                  >
                    <td className="py-1 tabular-nums">
                      {scenario.reference_start_day + point.elapsed_day}
                    </td>
                    <td className="py-1 tabular-nums">{point.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Collapsible>

          {scenario.parameters.length > 0 ? (
            <Collapsible title={`Parámetros (${scenario.parameters.length})`}>
              <ul className="space-y-1">
                {scenario.parameters.map((parameter) => (
                  <li key={parameter.id}>
                    {parameter.id}: {parameter.value} {parameter.unit}
                    <span className="block text-slate-400">
                      Fuente {parameter.source_id} · {parameter.locator}
                    </span>
                  </li>
                ))}
              </ul>
            </Collapsible>
          ) : null}
        </section>
      )}

      {scenario.assumptions.length > 0 ? (
        <Collapsible title={`Supuestos (${scenario.assumptions.length})`}>
          <ul className="space-y-1">
            {scenario.assumptions.map((assumption) => (
              <li key={assumption}>• {assumption}</li>
            ))}
          </ul>
        </Collapsible>
      ) : null}

      <button
        type="button"
        onClick={onOpenGraph}
        className="w-full rounded-md border border-sky-500/60 px-3 py-2 text-sm font-medium text-sky-200 hover:bg-sky-500/10"
      >
        Ver grafo del escenario
      </button>
    </div>
  );
}

const LINE_COLOR = "#818cf8";

/**
 * Reference trajectory over protocol days. Values keep the protocol baseline
 * (100 % is that baseline); the y range always includes it so small changes
 * are not visually exaggerated.
 */
function ScenarioChart({ scenario }: { scenario: Scenario }) {
  const data = scenario.points.map((point) => ({
    day: scenario.reference_start_day + point.elapsed_day,
    value: point.value,
  }));
  if (data.length === 0) return null;

  const values = data.map((point) => point.value);
  const low = Math.floor(Math.min(100, ...values) / 5) * 5 - 5;
  const high = Math.ceil(Math.max(100, ...values) / 5) * 5 + 5;
  const xMin = scenario.domain?.min_reference_day ?? data[0].day;
  const xMax = scenario.domain?.max_reference_day ?? data[data.length - 1].day;
  const first = data[0];
  const last = data[data.length - 1];

  return (
    <figure className="space-y-1">
      <div
        className="h-48"
        role="img"
        aria-label={`Trayectoria de referencia del día ${first.day} al ${last.day} del protocolo: de ${first.value} a ${last.value} % del basal del protocolo.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 16, right: 16, bottom: 16, left: 0 }}
          >
            <CartesianGrid stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="day"
              type="number"
              domain={[xMin, xMax]}
              allowDecimals={false}
              stroke="#64748b"
              fontSize={11}
              label={{
                value: "Día del protocolo de referencia",
                position: "insideBottom",
                offset: -10,
                fill: "#94a3b8",
                fontSize: 11,
              }}
            />
            <YAxis
              domain={[low, high]}
              ticks={Array.from(
                { length: (high - low) / 5 + 1 },
                (_, index) => low + index * 5,
              )}
              width={48}
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(value: number) => `${value} %`}
            />
            <ReferenceLine y={100} stroke="#64748b" strokeDasharray="4 4" />
            <Tooltip
              isAnimationActive={false}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                fontSize: 12,
              }}
              labelStyle={{ color: "#cbd5e1" }}
              labelFormatter={(label) => `Día ${String(label)} del protocolo`}
              formatter={(value) => [
                `${String(value)} % del basal`,
                "Referencia",
              ]}
            />
            <Line
              type="linear"
              dataKey="value"
              stroke={LINE_COLOR}
              strokeWidth={2}
              dot={{ r: 4, fill: LINE_COLOR, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="text-[11px] text-slate-400">
        Línea discontinua: basal del protocolo (100 %). Eje horizontal: días del
        protocolo, no días de misión. Los puntos son salidas del modelo, no
        mediciones; la línea solo los une y no se extiende fuera de su dominio.
      </figcaption>
    </figure>
  );
}

const EMPTY_HINTS: Record<Scenario["status"], string> = {
  available: "",
  insufficient_data:
    "Para dibujarla hace falta un modelo habilitado con parámetros revisados y datos suficientes del caso.",
  out_of_domain:
    "La solicitud queda fuera del dominio del modelo; extrapolar daría una curva sin respaldo.",
};

/**
 * Placeholder with the chart's footprint, so the layout does not jump and the
 * absence reads as a deliberate state, not as a loading error.
 */
function EmptyChart({ scenario }: { scenario: Scenario }) {
  return (
    <figure
      role="img"
      aria-label="Sin trayectoria de referencia"
      className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-700 px-6 text-center"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 120 40"
        className="h-8 w-24 text-slate-700"
      >
        <path
          d="M2 38 H118 M2 38 V2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M2 12 H118"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
        />
      </svg>
      <p className="text-sm font-medium text-slate-300">
        No se dibuja una trayectoria
      </p>
      <p className="text-xs text-slate-400">
        {scenario.reason ?? "El backend no indicó el motivo."}
      </p>
      <p className="text-[11px] text-slate-500">
        {EMPTY_HINTS[scenario.status]}
      </p>
    </figure>
  );
}

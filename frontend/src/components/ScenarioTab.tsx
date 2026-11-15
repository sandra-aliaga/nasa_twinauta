import type { Assessment } from "../api";
import { SCENARIO_STATUS_LABELS, UNIT_LABELS } from "../lib/labels";
import { Collapsible, Notice, Tag } from "./common";

type ScenarioTabProps = {
  assessment: Assessment;
  onOpenGraph: () => void;
};

/**
 * "Evolucion del escenario". Points are drawn only when the backend reports
 * the scenario as available; otherwise the reason is shown and no curve is
 * invented. The chart itself will replace the table in a later step.
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
        <Notice title="No se muestra una trayectoria" tone="warning">
          {scenario.reason ?? "El backend no indicó el motivo."}
        </Notice>
      ) : (
        <section className="space-y-3">
          <dl className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <dt className="text-slate-500">Modelo</dt>
            <dd>
              {scenario.model_id} · v{scenario.model_version}
            </dd>
            <dt className="text-slate-500">Inicio de referencia</dt>
            <dd>Día {scenario.reference_start_day} del protocolo</dd>
            <dt className="text-slate-500">Horizonte</dt>
            <dd>{scenario.horizon_days} días</dd>
            {scenario.domain ? (
              <>
                <dt className="text-slate-500">Dominio</dt>
                <dd>
                  {scenario.domain.environment}, días{" "}
                  {scenario.domain.min_reference_day} a{" "}
                  {scenario.domain.max_reference_day}
                </dd>
                <dt className="text-slate-500">Basal</dt>
                <dd>{scenario.domain.baseline_definition}</dd>
              </>
            ) : null}
          </dl>

          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-slate-500">
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

          {scenario.parameters.length > 0 ? (
            <Collapsible title={`Parámetros (${scenario.parameters.length})`}>
              <ul className="space-y-1">
                {scenario.parameters.map((parameter) => (
                  <li key={parameter.id}>
                    {parameter.id}: {parameter.value} {parameter.unit}
                    <span className="block text-slate-500">
                      {parameter.locator}
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

import type { Action, IndicatorDefinition, Region } from "../api";
import type { AssessmentState } from "../hooks/useAssessment";
import {
  ASSESSMENT_STATUS_HINTS,
  ASSESSMENT_STATUS_LABELS,
} from "../lib/labels";
import { ActionsTab } from "./ActionsTab";
import { ErrorNotice, Notice, Tag } from "./common";
import { EvaluationTab } from "./EvaluationTab";
import { ScenarioTab } from "./ScenarioTab";

export type PanelTab = "evaluation" | "scenario" | "actions";

const TABS: { id: PanelTab; label: string }[] = [
  { id: "evaluation", label: "Evaluación de la zona" },
  { id: "scenario", label: "Evolución del escenario" },
  { id: "actions", label: "Siguientes pasos" },
];

// Data availability, not severity: no red, no traffic-light semantics.
const STATUS_TONES = {
  complete: "sky",
  partial: "amber",
  insufficient_data: "slate",
} as const;

type RegionPanelProps = {
  region: Region | null;
  indicators: IndicatorDefinition[];
  state: AssessmentState;
  tab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  onClose: () => void;
  onRetry: () => void;
  onOpenGraph: (tab: PanelTab) => void;
  onActionUpdated: (action: Action) => void;
  onConflict: () => Promise<void>;
};

/** Contextual panel for the selected region with its three sections. */
export function RegionPanel({
  region,
  indicators,
  state,
  tab,
  onTabChange,
  onClose,
  onRetry,
  onOpenGraph,
  onActionUpdated,
  onConflict,
}: RegionPanelProps) {
  if (!region) {
    return (
      <div className="p-5">
        <Notice title="Ninguna región seleccionada">
          Seleccione una región en el cuerpo para solicitar su evaluación.
        </Notice>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <h2 className="text-base font-semibold text-slate-50">
          {region.label}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar región"
          className="rounded-md px-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        >
          ×
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Secciones de la región"
        className="flex border-b border-slate-800 px-2"
        onKeyDown={(event) => {
          // WAI-ARIA tabs: arrows move between tabs, Home/End jump to ends.
          const index = TABS.findIndex((item) => item.id === tab);
          const next =
            event.key === "ArrowRight"
              ? (index + 1) % TABS.length
              : event.key === "ArrowLeft"
                ? (index - 1 + TABS.length) % TABS.length
                : event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? TABS.length - 1
                    : null;
          if (next === null) return;
          event.preventDefault();
          onTabChange(TABS[next].id);
          document.getElementById(`region-tab-${TABS[next].id}`)?.focus();
        }}
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            id={`region-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="region-tabpanel"
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => onTabChange(item.id)}
            className={`flex-1 border-b-2 px-2 py-2 text-xs font-medium sm:text-sm ${
              tab === item.id
                ? "border-sky-400 text-sky-100"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        id="region-tabpanel"
        role="tabpanel"
        aria-labelledby={`region-tab-${tab}`}
        className="flex-1 space-y-4 overflow-y-auto p-5"
      >
        {state.status === "idle" ? (
          <Notice title="Sin evaluación">
            Use «Evaluar» para solicitar una evaluación de esta región.
          </Notice>
        ) : null}

        {state.status === "loading" ? (
          <Notice title="Cargando evaluación…">
            Día {state.request.mission_day}.
          </Notice>
        ) : null}

        {state.status === "error" ? (
          <ErrorNotice error={state.error} onRetry={onRetry} />
        ) : null}

        {state.status === "ready" ? (
          <>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone={STATUS_TONES[state.assessment.status]}>
                  Evaluación {ASSESSMENT_STATUS_LABELS[state.assessment.status]}
                </Tag>
                <Tag>Día {state.assessment.mission_day}</Tag>
                {state.assessment.content_mode === "illustrative" ? (
                  <Tag tone="violet">Contenido ilustrativo</Tag>
                ) : (
                  <Tag tone="emerald">Basado en evidencia revisada</Tag>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {ASSESSMENT_STATUS_HINTS[state.assessment.status]}
              </p>
              {state.assessment.mission_day !== state.request.mission_day ? (
                <Notice
                  title="La evaluación no corresponde al día pedido"
                  tone="warning"
                >
                  Se pidió el día {state.request.mission_day} y se recibió el
                  día {state.assessment.mission_day}. Los ejemplos documentales
                  contienen una sola evaluación fija.
                </Notice>
              ) : null}
            </div>

            {tab === "evaluation" ? (
              <EvaluationTab
                assessment={state.assessment}
                region={region}
                indicators={indicators}
                onOpenGraph={() => onOpenGraph("evaluation")}
              />
            ) : null}
            {tab === "scenario" ? (
              <ScenarioTab
                assessment={state.assessment}
                onOpenGraph={() => onOpenGraph("scenario")}
              />
            ) : null}
            {tab === "actions" ? (
              <ActionsTab
                assessment={state.assessment}
                onActionUpdated={onActionUpdated}
                onConflict={onConflict}
                onOpenGraph={() => onOpenGraph("actions")}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

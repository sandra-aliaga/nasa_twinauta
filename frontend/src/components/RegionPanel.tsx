import { lazy, Suspense } from "react";

import {
  dataSource,
  type Action,
  type IndicatorDefinition,
  type Region,
} from "../api";
import type { AssessmentState } from "../hooks/useAssessment";
import { useLoad } from "../hooks/useLoad";
import {
  ASSESSMENT_STATUS_HINTS,
  ASSESSMENT_STATUS_LABELS,
} from "../lib/labels";
import { ActionsTab } from "./ActionsTab";
import { Collapsible, ErrorNotice, Notice, Skeleton, Tag } from "./common";
import { ContextSection, type ContextSectionKey } from "./ContextSection";
import { EvaluationTab } from "./EvaluationTab";
import { ScenarioTab } from "./ScenarioTab";

export type PanelTab = "evaluation" | "scenario" | "actions";

const MiniGraph = lazy(() =>
  import("./graph/MiniGraph").then((m) => ({ default: m.MiniGraph })),
);

// The panel is a real sequence: what is happening, what could happen, what
// to do. Each step keeps one hue so it is recognisable; hues are not severity.
const TABS: {
  id: PanelTab;
  label: string;
  graphView: "evidence" | "scenario" | "actions";
  active: string;
  bar: string;
}[] = [
  {
    id: "evaluation",
    label: "Qué pasa",
    graphView: "evidence",
    active: "bg-step-now text-slate-950",
    bar: "bg-step-now",
  },
  {
    id: "scenario",
    label: "Qué puede pasar",
    graphView: "scenario",
    active: "bg-step-next text-slate-950",
    bar: "bg-step-next",
  },
  {
    id: "actions",
    label: "Qué hacer",
    graphView: "actions",
    active: "bg-step-do text-slate-950",
    bar: "bg-step-do",
  },
];

const TAB_SECTIONS: Record<PanelTab, ContextSectionKey> = {
  evaluation: "alert_assessment",
  scenario: "inaction_scenario",
  actions: "next_steps",
};

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
  onOpenPaper: (paperId: string) => void;
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
  onOpenPaper,
}: RegionPanelProps) {
  // One prepared synthesis per assessment, shared by the three tabs.
  const assessmentId =
    state.status === "ready" ? state.assessment.assessment_id : null;
  const context = useLoad(
    assessmentId === null ? null : `context|${assessmentId}`,
    (signal) => dataSource.getContext(assessmentId ?? "", signal),
  );

  const activeTab = TABS.find((item) => item.id === tab) ?? TABS[0];
  const graphLabels = Object.fromEntries(
    indicators.map((item) => [item.id, item.label]),
  );

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
    <div key={region.id} className="flex h-full animate-fade-in flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <h2 className="font-display text-base font-medium text-slate-50">
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
        aria-label="Pasos de la zona"
        className="relative flex gap-1 border-b border-slate-800 px-3 pb-3 pt-3"
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
        {TABS.map((item, index) => (
          <button
            key={item.id}
            id={`region-tab-${item.id}`}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            aria-controls="region-tabpanel"
            tabIndex={tab === item.id ? 0 : -1}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-1 items-center gap-2 rounded-xl px-2 py-2 text-left text-xs font-medium leading-tight transition-colors sm:text-sm ${
              tab === item.id
                ? "bg-slate-900 text-slate-50"
                : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
            }`}
          >
            <span
              aria-hidden="true"
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-xs ${
                tab === item.id ? item.active : "bg-slate-800 text-slate-400"
              }`}
            >
              {index + 1}
            </span>
            {item.label}
          </button>
        ))}
        {/* One indicator that slides to the active step (equal widths). */}
        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-3 h-0.5 rounded-full transition-transform duration-300 ease-out ${activeTab.bar}`}
          style={{
            width: `calc((100% - 1.5rem) / ${TABS.length})`,
            transform: `translateX(${TABS.indexOf(activeTab) * 100}%)`,
          }}
        />
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
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Preparando la evaluación del día {state.request.mission_day}…
            </p>
            <Skeleton lines={3} label="Cargando evaluación" />
            <Skeleton lines={5} label="Cargando indicadores" />
          </div>
        ) : null}

        {state.status === "error" ? (
          <ErrorNotice error={state.error} onRetry={onRetry} />
        ) : null}

        {state.status === "ready" ? (
          <>
            <div
              className="flex flex-wrap items-center gap-1.5"
              title={ASSESSMENT_STATUS_HINTS[state.assessment.status]}
            >
              <Tag tone={STATUS_TONES[state.assessment.status]}>
                Evaluación {ASSESSMENT_STATUS_LABELS[state.assessment.status]}
              </Tag>
              <Tag tone="subtle">Día {state.assessment.mission_day}</Tag>
              {state.assessment.content_mode === "illustrative" ? (
                <Tag tone="subtle">Caso de práctica</Tag>
              ) : (
                <Tag tone="emerald">Basado en evidencia revisada</Tag>
              )}
            </div>
            {state.assessment.mission_day !== state.request.mission_day ? (
              <Notice
                title="La evaluación no corresponde al día pedido"
                tone="warning"
              >
                Se pidió el día {state.request.mission_day} y se recibió el día{" "}
                {state.assessment.mission_day}. Los ejemplos contienen una sola
                evaluación fija.
              </Notice>
            ) : null}

            <div key={tab} className="animate-rise-in space-y-4">
              {tab === "evaluation" ? (
                <EvaluationTab
                  assessment={state.assessment}
                  region={region}
                  indicators={indicators}
                />
              ) : null}
              {tab === "scenario" ? (
                <ScenarioTab assessment={state.assessment} />
              ) : null}
              {tab === "actions" ? (
                <ActionsTab
                  assessment={state.assessment}
                  onActionUpdated={onActionUpdated}
                  onConflict={onConflict}
                />
              ) : null}
              <section
                className="hud-panel"
                style={
                  { "--rail": "var(--color-slate-500)" } as React.CSSProperties
                }
              >
                <div className="flex items-center justify-between px-3 pt-3">
                  <h3 className="text-sm font-medium text-slate-100">
                    De dónde sale esto
                  </h3>
                  <button
                    type="button"
                    onClick={() => onOpenGraph(tab)}
                    className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-sky-400"
                  >
                    Abrir mapa 3D
                  </button>
                </div>
                <Suspense
                  fallback={
                    <Skeleton lines={3} label="Cargando mapa" className="p-3" />
                  }
                >
                  <MiniGraph
                    inline
                    assessmentId={state.assessment.assessment_id}
                    view={activeTab.graphView}
                    onExpand={() => onOpenGraph(tab)}
                    labels={graphLabels}
                  />
                </Suspense>
              </section>
              <Collapsible title="Explicación ampliada">
                <div className="pt-1">
                  <ContextSection
                    context={context}
                    section={TAB_SECTIONS[tab]}
                    assessment={state.assessment}
                    indicators={indicators}
                    onOpenPaper={onOpenPaper}
                  />
                </div>
              </Collapsible>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

import { ReferenceParticipantProvider } from "./components/ReferenceDashboard";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";

import { dataSource, type GraphView, type Region } from "./api";
import { AnatomyStage } from "./components/AnatomyStage";
import { ErrorNotice, Skeleton } from "./components/common";
import { Header } from "./components/Header";
import { IntroGuide, shouldShowIntro } from "./components/IntroGuide";
import { RegionPanel, type PanelTab } from "./components/RegionPanel";
import { StatusHud } from "./components/StatusHud";
import { useAssessment } from "./hooks/useAssessment";
import { useGraph } from "./hooks/useGraph";
import { explorerSource } from "./api/explorer";
import { hasWebGL, HEART_ZONE_ID } from "./lib/anatomy";
import { caseMap, studyMap } from "./lib/graph";
import { useLoad } from "./hooks/useLoad";
import { useCatalog, useRegions } from "./hooks/useCatalog";
import {
  HEART_RATE_ENABLED,
  HORIZON_DAYS,
  INITIAL_MISSION_DAY,
  REFERENCE_START_DAY,
} from "./lib/config";
import { tr, useLanguage } from "./i18n";

// Heavy views (graph library, charts) load only when first opened.
const HeartPanel = lazy(() =>
  import("./components/HeartPanel").then((m) => ({ default: m.HeartPanel })),
);
const GraphExplorer = lazy(() =>
  import("./components/graph/GraphExplorer").then((m) => ({
    default: m.GraphExplorer,
  })),
);
const ExplorerView = lazy(() =>
  import("./components/explorer/ExplorerView").then((m) => ({
    default: m.ExplorerView,
  })),
);

// Each panel section opens its matching graph view.
const TAB_TO_VIEW: Record<PanelTab, GraphView> = {
  evaluation: "evidence",
  scenario: "scenario",
  actions: "actions",
};

/** Main screen: body in the center, contextual panel, optional cardiac panel. */
export default function App() {
  const language = useLanguage();
  const catalog = useCatalog();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [day, setDay] = useState(INITIAL_MISSION_DAY);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [tab, setTab] = useState<PanelTab>("evaluation");
  const [graphView, setGraphView] = useState<GraphView | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(shouldShowIntro);
  // Assessment map: 3D around the body by default, flat as an alternative.
  const [can3d] = useState(hasWebGL);
  const [graphMode, setGraphMode] = useState<"3d" | "flat">("3d");
  const [graphNodeId, setGraphNodeId] = useState<string | null>(null);
  // The map opens on the studies of the corpus; the case graph is one tap away.
  const [graphSource, setGraphSource] = useState<"studies" | "case">("studies");
  // Paper to open when the library is reached from a citation.
  const [libraryPaperId, setLibraryPaperId] = useState<string | null>(null);
  const regions = useRegions(caseId);
  const { state, evaluate, reset, replaceAction, refresh } = useAssessment();
  const catalogLabels =
    catalog.status === "ready"
      ? Object.fromEntries(
          catalog.data.indicators.map((item) => [item.id, item.label]),
        )
      : {};
  const graphState = useGraph(
    state.status === "ready" && graphView !== null
      ? state.assessment.assessment_id
      : null,
    graphView ?? "evidence",
    catalogLabels,
  );
  const studiesKey =
    state.status === "ready" && graphView !== null && graphSource === "studies"
      ? `${graphView}|${state.request.region_id}|${state.assessment.assessment_id}`
      : null;
  const studies = useLoad(studiesKey, (signal) => {
    const [view, region_id, assessment_id] = (studiesKey ?? "").split("|");
    return explorerSource.getKnowledgeGraph(
      { view: view as GraphView, region_id, assessment_id },
      signal,
    );
  });
  const mapData = useMemo(() => {
    if (graphView === null) return null;
    if (graphSource === "studies") {
      return studies?.status === "ready" ? studyMap(studies.data) : null;
    }
    return graphState?.status === "ready" ? caseMap(graphState.data) : null;
  }, [graphView, graphSource, studies, graphState, language]);

  const cases = catalog.status === "ready" ? catalog.data.cases : [];
  const selectedCase = cases.find((item) => item.id === caseId) ?? null;
  const regionList = regions?.status === "ready" ? regions.data : [];
  const selectedRegion =
    regionList.find((region) => region.id === regionId) ?? null;

  // Pick the first case once the catalog arrives.
  useEffect(() => {
    if (catalog.status === "ready" && caseId === null) {
      const first = catalog.data.cases[0];
      if (first) {
        setCaseId(first.id);
        setDay(Math.min(INITIAL_MISSION_DAY, first.duration_days));
      }
    }
  }, [catalog, caseId]);

  function requestAssessment(targetRegionId: string, targetDay: number) {
    if (!caseId) return;
    setGraphView(null);
    evaluate({
      case_id: caseId,
      region_id: targetRegionId,
      mission_day: targetDay,
      reference_start_day: REFERENCE_START_DAY,
      horizon_days: HORIZON_DAYS,
    });
  }

  // Open the first tracked zone on arrival, so the beacon and the general
  // status are filled without asking the user to evaluate first.
  const firstRegionId = regionList[0]?.id ?? null;
  useEffect(() => {
    if (caseId && firstRegionId && state.status === "idle") {
      requestAssessment(firstRegionId, day);
    }
    // Runs when the regions of a case arrive; later days are evaluated
    // explicitly with the header button.
  }, [caseId, firstRegionId]);

  function handleSelectRegion(nextRegionId: string) {
    setRegionId(nextRegionId);
    // The heart zone is a frontend view; it has no assessment to request.
    if (nextRegionId === HEART_ZONE_ID) {
      setGraphView(null);
      return;
    }
    const alreadyOpen =
      (state.status === "ready" || state.status === "loading") &&
      state.request.region_id === nextRegionId &&
      state.request.mission_day === day;
    if (!alreadyOpen) requestAssessment(nextRegionId, day);
  }

  function handleCaseChange(nextCaseId: string) {
    const nextCase = cases.find((item) => item.id === nextCaseId);
    setCaseId(nextCaseId);
    setRegionId(null);
    setGraphView(null);
    if (nextCase) setDay(Math.min(day, nextCase.duration_days));
    reset();
  }

  function handleClosePanel() {
    // The assessment stays open: it feeds the beacon and the general status.
    setRegionId(null);
    setGraphView(null);
  }

  if (catalog.status === "loading") {
    return (
      <Shell>
        <div className="m-auto">
          <Skeleton
            lines={4}
            label={tr("Cargando catálogos")}
            className="w-72"
          />
        </div>
      </Shell>
    );
  }

  if (catalog.status === "error") {
    return (
      <Shell>
        <div className="m-auto max-w-md">
          <ErrorNotice
            error={catalog.error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </Shell>
    );
  }

  const openAssessment = state.status === "ready" ? state.assessment : null;
  const assessmentRegionId =
    state.status === "ready" ? state.request.region_id : null;
  const toReview =
    openAssessment?.findings.filter(
      (item) => item.attention === "review_needed",
    ) ?? [];
  const flaggedRegionIds =
    dataSource.kind === "examples" && assessmentRegionId && toReview.length > 0
      ? [assessmentRegionId]
      : [];
  const evaluateRegionId =
    (regionId === HEART_ZONE_ID ? null : regionId) ??
    assessmentRegionId ??
    firstRegionId;
  const caseSheet = (
    <StatusHud
      caseItem={selectedCase}
      day={day}
      regions={regionList}
      indicators={catalog.data.indicators}
      assessment={openAssessment}
      assessmentRegionId={assessmentRegionId}
      onSelectRegion={handleSelectRegion}
      onOpenHeartRate={
        HEART_RATE_ENABLED ? () => handleSelectRegion(HEART_ZONE_ID) : undefined
      }
    />
  );
  const evaluatedDay =
    state.status === "ready" ? state.assessment.mission_day : null;
  const showGraph =
    !libraryOpen && graphView !== null && state.status === "ready";
  // The library covers the body; the assessment graph floats over a blurred
  // body so the anatomical context stays visible behind it.
  const hideBody = libraryOpen;

  function openPaper(paperId: string) {
    setGraphView(null);
    setLibraryPaperId(paperId);
    setLibraryOpen(true);
  }

  function openGraph(view: GraphView | null) {
    setLibraryOpen(false);
    setGraphNodeId(null);
    setGraphView(view);
  }
  const graph3d =
    showGraph && can3d && (graphSource === "studies" || graphMode === "3d");

  return (
    <ReferenceParticipantProvider>
      <Shell>
        <Header
          cases={cases}
          caseId={caseId}
          onCaseChange={handleCaseChange}
          day={day}
          onDayChange={setDay}
          evaluatedDay={evaluatedDay}
          canEvaluate={evaluateRegionId !== null && state.status !== "loading"}
          onEvaluate={() =>
            evaluateRegionId && requestAssessment(evaluateRegionId, day)
          }
          isDemo={dataSource.kind === "examples"}
          referenceMode={dataSource.kind === "api"}
          cardiacAvailable={false}
          cardiacOpen={false}
          onToggleCardiac={() => {}}
          libraryOpen={libraryOpen}
          onToggleLibrary={() => {
            setGraphView(null);
            setLibraryPaperId(null);
            setLibraryOpen((open) => !open);
          }}
          onOpenGuide={() => setGuideOpen(true)}
        />
        <IntroGuide open={guideOpen} onClose={() => setGuideOpen(false)} />

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] lg:overflow-hidden">
          <main className="relative min-h-[420px] border-slate-800 lg:border-r">
            <Suspense fallback={<ViewSkeleton />}>
              {libraryOpen ? (
                <ExplorerView
                  // The heart zone is frontend-only: never sent as a region.
                  regionId={regionId === HEART_ZONE_ID ? null : regionId}
                  assessmentId={
                    state.status === "ready"
                      ? state.assessment.assessment_id
                      : null
                  }
                  initialPaperId={libraryPaperId}
                  onBack={() => setLibraryOpen(false)}
                />
              ) : null}
              {showGraph && graphView !== null ? (
                <div
                  className={`absolute inset-0 z-20 overflow-y-auto ${
                    graph3d
                      ? "pointer-events-none"
                      : "bg-slate-950/60 backdrop-blur-md"
                  }`}
                >
                  <GraphExplorer
                    state={graphState}
                    view={graphView}
                    onViewChange={openGraph}
                    onBack={() => openGraph(null)}
                    selectedId={graphNodeId}
                    onSelect={setGraphNodeId}
                    mode={graphMode}
                    onModeChange={setGraphMode}
                    can3d={can3d}
                    source={graphSource}
                    onSourceChange={(next) => {
                      setGraphNodeId(null);
                      setGraphSource(next);
                    }}
                    studies={studies}
                    onOpenPaper={openPaper}
                  />
                </div>
              ) : null}
            </Suspense>
            {regions?.status === "error" ? (
              <div className="p-6">
                <ErrorNotice error={regions.error} />
              </div>
            ) : (
              // Kept mounted while the graph is shown: unmounting the WebGL
              // canvas is costly and reloading the model is avoidable.
              <div className={hideBody ? "hidden" : "h-full"}>
                <AnatomyStage
                  regions={regionList}
                  selectedRegionId={regionId}
                  onSelect={handleSelectRegion}
                  sidePanel={caseSheet}
                  flaggedRegionIds={flaggedRegionIds}
                  graph={graph3d ? mapData : null}
                  heartEnabled={HEART_RATE_ENABLED}
                  selectedNodeId={graphNodeId}
                  onSelectNode={setGraphNodeId}
                />
              </div>
            )}
          </main>

          <aside className="min-h-0 bg-slate-950">
            {regionId === HEART_ZONE_ID ? (
              <Suspense fallback={<ViewSkeleton />}>
                <HeartPanel
                  caseRecordingId={selectedCase?.telemetry_recording_id ?? null}
                  onClose={handleClosePanel}
                  onOpenPaper={openPaper}
                />
              </Suspense>
            ) : selectedRegion === null ? (
              <div className="h-full overflow-y-auto p-5">
                {/* Wide screens show the sheet over the 3D view instead. */}
                <div className="lg:hidden">{caseSheet}</div>
                <div className="mt-5 lg:mt-0">
                  <ZonePrompt
                    regions={regionList}
                    flaggedRegionId={flaggedRegionIds[0] ?? null}
                    findingTitle={toReview[0]?.title ?? null}
                    onSelectRegion={handleSelectRegion}
                    heartEnabled={HEART_RATE_ENABLED}
                  />
                </div>
              </div>
            ) : (
              <RegionPanel
                region={selectedRegion}
                indicators={catalog.data.indicators}
                state={state}
                tab={tab}
                onTabChange={setTab}
                onClose={handleClosePanel}
                onRetry={() => regionId && requestAssessment(regionId, day)}
                onOpenGraph={(fromTab) => openGraph(TAB_TO_VIEW[fromTab])}
                onActionUpdated={replaceAction}
                onConflict={refresh}
                onOpenPaper={openPaper}
              />
            )}
          </aside>
        </div>
      </Shell>
    </ReferenceParticipantProvider>
  );
}

/** Right panel before a zone is chosen: one clear invitation to act. */
function ZonePrompt({
  regions,
  flaggedRegionId,
  findingTitle,
  onSelectRegion,
  heartEnabled,
}: {
  regions: Region[];
  flaggedRegionId: string | null;
  findingTitle: string | null;
  onSelectRegion: (regionId: string) => void;
  heartEnabled: boolean;
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg leading-snug text-slate-50">
        {tr("Toca una zona del cuerpo para ver qué pasa ahí")}
      </h2>
      <p className="text-sm text-slate-300">
        {tr(
          "Cada zona te cuenta tres cosas, en orden: qué pasa, qué puede pasar y qué hacer.",
        )}
      </p>
      <ul className="space-y-2">
        {regions.map((region) => {
          const flagged = region.id === flaggedRegionId;
          return (
            <li key={region.id}>
              <button
                type="button"
                onClick={() => onSelectRegion(region.id)}
                className="hud-panel flex w-full items-center justify-between gap-3 px-5 py-3 text-left"
                style={
                  {
                    "--rail": flagged
                      ? "var(--color-step-do)"
                      : "var(--color-sky-400)",
                  } as React.CSSProperties
                }
              >
                <span>
                  <span className="block font-medium text-slate-50">
                    {tr(region.label)}
                  </span>
                  <span className="block text-xs text-slate-300">
                    {flagged && findingTitle
                      ? tr(findingTitle)
                      : tr("Datos de investigación disponibles")}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-slate-950">
                  {tr("Ver zona")}
                </span>
              </button>
            </li>
          );
        })}
        {heartEnabled ? (
          <li>
            <button
              type="button"
              onClick={() => onSelectRegion(HEART_ZONE_ID)}
              className="hud-panel flex w-full items-center justify-between gap-3 px-5 py-3 text-left"
              style={
                { "--rail": "var(--color-step-next)" } as React.CSSProperties
              }
            >
              <span>
                <span className="block font-medium text-slate-50">
                  {tr("Corazón")}
                </span>
                <span className="block text-xs text-slate-300">
                  {tr("Pulso de ejemplo y estudios")}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-step-next px-3 py-1 text-xs font-semibold text-slate-950">
                {tr("Ver zona")}
              </span>
            </button>
          </li>
        ) : null}
      </ul>
    </div>
  );
}

function ViewSkeleton() {
  return (
    <div className="p-6">
      <Skeleton lines={5} label={tr("Cargando vista")} />
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 lg:h-screen">
      {children}
    </div>
  );
}

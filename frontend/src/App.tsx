import { lazy, Suspense, useEffect, useState } from "react";

import { dataSource, type GraphView } from "./api";
import { AnatomyStage } from "./components/AnatomyStage";
import { CaseSheet } from "./components/CaseSheet";
import { ErrorNotice, Notice, Skeleton } from "./components/common";
import { Header } from "./components/Header";
import { IntroGuide, shouldShowIntro } from "./components/IntroGuide";
import { RegionPanel, type PanelTab } from "./components/RegionPanel";
import { useAssessment } from "./hooks/useAssessment";
import { usePresence } from "./hooks/usePresence";
import { useCatalog, useRegions } from "./hooks/useCatalog";
import {
  HEART_RATE_ENABLED,
  HORIZON_DAYS,
  INITIAL_MISSION_DAY,
  REFERENCE_START_DAY,
} from "./lib/config";

// Heavy views (graph library, charts) load only when first opened.
const CardiacPanel = lazy(() =>
  import("./components/CardiacPanel").then((m) => ({
    default: m.CardiacPanel,
  })),
);
const GraphExplorer = lazy(() =>
  import("./components/graph/GraphExplorer").then((m) => ({
    default: m.GraphExplorer,
  })),
);
const MiniGraph = lazy(() =>
  import("./components/graph/MiniGraph").then((m) => ({
    default: m.MiniGraph,
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
  const catalog = useCatalog();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [day, setDay] = useState(INITIAL_MISSION_DAY);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [tab, setTab] = useState<PanelTab>("evaluation");
  const [graphView, setGraphView] = useState<GraphView | null>(null);
  const [cardiacOpen, setCardiacOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(shouldShowIntro);
  // Paper to open when the library is reached from a citation.
  const [libraryPaperId, setLibraryPaperId] = useState<string | null>(null);
  const regions = useRegions(caseId);
  const cardiac = usePresence(HEART_RATE_ENABLED && cardiacOpen, 200);
  const { state, evaluate, reset, replaceAction, refresh } = useAssessment();

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

  function handleSelectRegion(nextRegionId: string) {
    setRegionId(nextRegionId);
    requestAssessment(nextRegionId, day);
  }

  function handleCaseChange(nextCaseId: string) {
    const nextCase = cases.find((item) => item.id === nextCaseId);
    setCaseId(nextCaseId);
    setRegionId(null);
    setGraphView(null);
    setCardiacOpen(false);
    if (nextCase) setDay(Math.min(day, nextCase.duration_days));
    reset();
  }

  function handleClosePanel() {
    setRegionId(null);
    setGraphView(null);
    reset();
  }

  if (catalog.status === "loading") {
    return (
      <Shell>
        <div className="m-auto">
          <Skeleton lines={4} label="Cargando catálogos" className="w-72" />
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

  const indicatorLabels = Object.fromEntries(
    catalog.data.indicators.map((item) => [item.id, item.label]),
  );
  const caseSheet = (
    <CaseSheet
      caseItem={selectedCase}
      day={day}
      regions={regionList}
      indicators={catalog.data.indicators}
      onSelectRegion={handleSelectRegion}
    />
  );
  const evaluatedDay =
    state.status === "ready" ? state.assessment.mission_day : null;
  const showGraph =
    !libraryOpen && graphView !== null && state.status === "ready";
  // The library covers the body; the assessment graph floats over a blurred
  // body so the anatomical context stays visible behind it.
  const hideBody = libraryOpen;

  function openGraph(view: GraphView) {
    setLibraryOpen(false);
    setGraphView(view);
  }

  return (
    <Shell>
      <Header
        cases={cases}
        caseId={caseId}
        onCaseChange={handleCaseChange}
        day={day}
        onDayChange={setDay}
        evaluatedDay={evaluatedDay}
        canEvaluate={selectedRegion !== null && state.status !== "loading"}
        onEvaluate={() => regionId && requestAssessment(regionId, day)}
        isDemo={dataSource.kind === "examples"}
        cardiacAvailable={
          HEART_RATE_ENABLED &&
          (Boolean(selectedCase?.telemetry_recording_id) ||
            dataSource.kind === "api")
        }
        cardiacOpen={cardiacOpen}
        onToggleCardiac={() => setCardiacOpen((open) => !open)}
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
                regionId={regionId}
                assessmentId={
                  state.status === "ready"
                    ? state.assessment.assessment_id
                    : null
                }
                initialPaperId={libraryPaperId}
                onBack={() => setLibraryOpen(false)}
              />
            ) : null}
            {showGraph && graphView !== null && state.status === "ready" ? (
              <div className="absolute inset-0 z-20 overflow-y-auto bg-slate-950/60 backdrop-blur-md">
                <GraphExplorer
                  view={graphView}
                  assessmentId={state.assessment.assessment_id}
                  onViewChange={setGraphView}
                  onBack={() => setGraphView(null)}
                  labels={indicatorLabels}
                />
              </div>
            ) : null}
          </Suspense>
          <Suspense fallback={null}>
            {!hideBody && !showGraph && state.status === "ready" ? (
              <MiniGraph
                assessmentId={state.assessment.assessment_id}
                view={TAB_TO_VIEW[tab]}
                onExpand={() => openGraph(TAB_TO_VIEW[tab])}
                labels={indicatorLabels}
              />
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
              />
            </div>
          )}
        </main>

        <aside className="min-h-0 bg-slate-950">
          {selectedRegion === null ? (
            <div className="h-full overflow-y-auto p-5">
              {/* Wide screens show the sheet over the 3D view instead. */}
              <div className="lg:hidden">{caseSheet}</div>
              <div className="hidden lg:block">
                <Notice title="Ninguna región seleccionada">
                  Seleccione una región en el cuerpo o en la ficha del caso para
                  solicitar su evaluación.
                </Notice>
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
              onOpenPaper={(paperId) => {
                setGraphView(null);
                setLibraryPaperId(paperId);
                setLibraryOpen(true);
              }}
            />
          )}
        </aside>
      </div>

      {cardiac.mounted ? (
        <div
          className={
            cardiac.leaving ? "animate-slide-down" : "animate-slide-up"
          }
        >
          <Suspense fallback={<ViewSkeleton />}>
            <CardiacPanel
              caseRecordingId={selectedCase?.telemetry_recording_id ?? null}
              onClose={() => setCardiacOpen(false)}
            />
          </Suspense>
        </div>
      ) : null}
    </Shell>
  );
}

function ViewSkeleton() {
  return (
    <div className="p-6">
      <Skeleton lines={5} label="Cargando vista" />
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

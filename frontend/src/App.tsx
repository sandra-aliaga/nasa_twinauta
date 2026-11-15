import { useEffect, useState } from "react";

import { dataSource, type GraphView } from "./api";
import { AnatomyStage } from "./components/AnatomyStage";
import { CardiacPanel } from "./components/CardiacPanel";
import { ErrorNotice, Notice } from "./components/common";
import { GraphExplorer } from "./components/graph/GraphExplorer";
import { MiniGraph } from "./components/graph/MiniGraph";
import { ExplorerView } from "./components/explorer/ExplorerView";
import { Header } from "./components/Header";
import { IntroGuide, shouldShowIntro } from "./components/IntroGuide";
import { RegionPanel, type PanelTab } from "./components/RegionPanel";
import { useAssessment } from "./hooks/useAssessment";
import { useCatalog, useRegions } from "./hooks/useCatalog";
import {
  HEART_RATE_ENABLED,
  HORIZON_DAYS,
  INITIAL_MISSION_DAY,
  REFERENCE_START_DAY,
} from "./lib/config";

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
          <Notice title="Cargando catálogos…" />
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

  const evaluatedDay =
    state.status === "ready" ? state.assessment.mission_day : null;
  const showGraph =
    !libraryOpen && graphView !== null && state.status === "ready";
  // The library and the assessment graph share the main area.
  const hideBody = showGraph || libraryOpen;

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
          {libraryOpen ? (
            <ExplorerView
              regionId={regionId}
              assessmentId={
                state.status === "ready" ? state.assessment.assessment_id : null
              }
              initialPaperId={libraryPaperId}
              onBack={() => setLibraryOpen(false)}
            />
          ) : null}
          {showGraph && graphView !== null && state.status === "ready" ? (
            <GraphExplorer
              view={graphView}
              assessmentId={state.assessment.assessment_id}
              onViewChange={setGraphView}
              onBack={() => setGraphView(null)}
            />
          ) : null}
          {!hideBody && state.status === "ready" ? (
            <MiniGraph
              assessmentId={state.assessment.assessment_id}
              view={TAB_TO_VIEW[tab]}
              onExpand={() => openGraph(TAB_TO_VIEW[tab])}
            />
          ) : null}
          {regions?.status === "error" ? (
            <div className="p-6">
              <ErrorNotice error={regions.error} />
            </div>
          ) : (
            // Kept mounted while the graph is shown: unmounting the WebGL
            // canvas is costly and reloading the 16 MB model is avoidable.
            <div className={hideBody ? "hidden" : "h-full"}>
              <AnatomyStage
                regions={regionList}
                selectedRegionId={regionId}
                onSelect={handleSelectRegion}
              />
            </div>
          )}
        </main>

        <aside className="min-h-0 bg-slate-950">
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
        </aside>
      </div>

      {HEART_RATE_ENABLED && cardiacOpen ? (
        <CardiacPanel
          caseRecordingId={selectedCase?.telemetry_recording_id ?? null}
          onClose={() => setCardiacOpen(false)}
        />
      ) : null}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 lg:h-screen">
      {children}
    </div>
  );
}

import type {
  AssessmentContext,
  AssessmentIndex,
  Guidance,
} from "./explorer/types";
import type {
  Action,
  ActionUpdate,
  Assessment,
  AssessmentRequest,
  Case,
  Graph,
  GraphView,
  IndicatorDefinition,
  Region,
  TelemetryRecording,
  TelemetryWindow,
} from "./types";

/**
 * Single interface for the case, assessment and telemetry operations.
 * The examples source and the HTTP source must return the same shapes.
 */
export interface DataSource {
  /** "examples" means synthetic documentation data, never backend results. */
  readonly kind: "examples" | "api";
  listCases(signal?: AbortSignal): Promise<Case[]>;
  listIndicators(signal?: AbortSignal): Promise<IndicatorDefinition[]>;
  listRegions(caseId: string, signal?: AbortSignal): Promise<Region[]>;
  createAssessment(
    request: AssessmentRequest,
    signal?: AbortSignal,
  ): Promise<Assessment>;
  getAssessment(
    assessmentId: string,
    signal?: AbortSignal,
  ): Promise<Assessment>;
  /** Existing snapshots of a case, to reuse one before creating another. */
  listCaseAssessments(
    caseId: string,
    signal?: AbortSignal,
  ): Promise<AssessmentIndex[]>;
  /** Frozen contextual synthesis; "unavailable" is a 200 domain state. */
  getContext(
    assessmentId: string,
    signal?: AbortSignal,
  ): Promise<AssessmentContext>;
  getGuidance(assessmentId: string, signal?: AbortSignal): Promise<Guidance>;
  getGraph(
    assessmentId: string,
    view: GraphView,
    signal?: AbortSignal,
  ): Promise<Graph>;
  updateAction(
    assessmentId: string,
    actionId: string,
    update: ActionUpdate,
  ): Promise<Action>;
  getTelemetryWindow(
    recordingId: string,
    startS: number,
    endS: number,
    signal?: AbortSignal,
  ): Promise<TelemetryWindow>;
  getRecordingMetadata(
    recordingId: string,
    signal?: AbortSignal,
  ): Promise<TelemetryRecording>;
}

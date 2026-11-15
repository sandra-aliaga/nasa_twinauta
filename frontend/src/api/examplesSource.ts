/**
 * Data source backed by the synthetic documentation in contracts/examples.
 * It returns the same shapes as the API so screens can be built before the
 * backend is running. None of this content is evidence or a real result.
 */
import assessmentExample from "../../../contracts/examples/assessment.json";
import assessmentStatesExample from "../../../contracts/examples/assessment-states.json";
import casesExample from "../../../contracts/examples/cases.json";
import contextExample from "../../../contracts/examples/context.json";
import graphsExample from "../../../contracts/examples/graphs.json";
import indicatorsExample from "../../../contracts/examples/indicators.json";
import recordingExample from "../../../contracts/examples/recording-metadata.json";
import regionsExample from "../../../contracts/examples/regions.json";
import telemetryExample from "../../../contracts/examples/telemetry.json";
import type { DataSource } from "./dataSource";
import { ApiError } from "./errors";
import type { AssessmentContext } from "./explorer/types";
import type {
  Action,
  Assessment,
  Case,
  Graph,
  IndicatorDefinition,
  Region,
  TelemetryRecording,
  TelemetryWindow,
} from "./types";

const cases = casesExample as Case[];
const indicators = indicatorsExample as IndicatorDefinition[];
const regions = regionsExample as Region[];
const graphs = graphsExample as Record<Graph["view"], Graph>;
const recording = recordingExample as TelemetryRecording;
const telemetry = telemetryExample as TelemetryWindow;

const contexts = contextExample as unknown as {
  context_available: AssessmentContext;
  context_unavailable: AssessmentContext;
};

const assessmentStates = assessmentStatesExample as unknown as Record<
  string,
  Assessment
>;

/**
 * Optional "?example_state=" URL parameter (complete, insufficient_data,
 * out_of_domain) to lay out the documented variants. Without it, the base
 * example is used. Unknown values fall back to the base example.
 */
function exampleAssessment(): Assessment {
  const key =
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("example_state");
  const variant = key ? assessmentStates[key] : undefined;
  return structuredClone(variant ?? (assessmentExample as Assessment));
}

// Small delay so loading states are visible while designing.
const LATENCY_MS = 250;

function respond<T>(value: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(structuredClone(value)), LATENCY_MS);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

function notFound(message: string): ApiError {
  return new ApiError(404, { code: "not_found", message, details: [] });
}

/** Create the examples data source. Action tracking lives in memory only. */
export function createExamplesSource(): DataSource {
  // Each "created" assessment gets its own copy so tracking stays isolated.
  const assessments = new Map<string, Assessment>();
  let counter = 0;

  function findAssessment(assessmentId: string): Assessment {
    const found = assessments.get(assessmentId);
    if (!found) throw notFound("La evaluación no existe.");
    return found;
  }

  return {
    kind: "examples",
    listCases: (signal) => respond(cases, signal),
    listIndicators: (signal) => respond(indicators, signal),
    listRegions: (caseId, signal) => {
      if (!cases.some((item) => item.id === caseId)) {
        return Promise.reject(notFound("El caso no existe."));
      }
      return respond(regions, signal);
    },
    createAssessment: (request, signal) => {
      const caseItem = cases.find((item) => item.id === request.case_id);
      if (!caseItem) return Promise.reject(notFound("El caso no existe."));
      if (!regions.some((item) => item.id === request.region_id)) {
        return Promise.reject(notFound("La región no existe."));
      }
      if (
        request.mission_day < 0 ||
        request.mission_day > caseItem.duration_days
      ) {
        return Promise.reject(
          new ApiError(422, {
            code: "invalid_mission_day",
            message: "El día de misión está fuera del caso.",
            details: [`Rango admitido: 0 a ${caseItem.duration_days}.`],
          }),
        );
      }
      // The documentation contains a single fixed assessment (mission day 10).
      // It is returned unchanged; the UI shows its own mission_day.
      counter += 1;
      const assessment = exampleAssessment();
      assessment.assessment_id = `${assessment.assessment_id}_${counter}`;
      assessments.set(assessment.assessment_id, assessment);
      return respond(assessment, signal);
    },
    getAssessment: (assessmentId, signal) => {
      try {
        return respond(findAssessment(assessmentId), signal);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // The examples have no stored index: every evaluation creates a copy.
    listCaseAssessments: (caseId, signal) => {
      if (!cases.some((item) => item.id === caseId)) {
        return Promise.reject(notFound("El caso no existe."));
      }
      return respond([], signal);
    },
    getContext: (assessmentId, signal) => {
      let assessment: Assessment;
      try {
        assessment = findAssessment(assessmentId);
      } catch (error) {
        return Promise.reject(error);
      }
      // Only the documented demo snapshot has a prepared synthesis.
      const prepared = contexts.context_available;
      const source = assessmentId.startsWith(prepared.assessment_id)
        ? prepared
        : contexts.context_unavailable;
      return respond(
        { ...source, assessment_id: assessment.assessment_id },
        signal,
      );
    },
    getGuidance: (assessmentId, signal) => {
      try {
        findAssessment(assessmentId);
      } catch (error) {
        return Promise.reject(error);
      }
      const guidance = contexts.context_available.guidance;
      if (!guidance) {
        return Promise.reject(
          notFound("Los ejemplos no incluyen orientación."),
        );
      }
      return respond({ ...guidance, assessment_id: assessmentId }, signal);
    },
    getGraph: (assessmentId, view, signal) => {
      let assessment: Assessment;
      try {
        assessment = findAssessment(assessmentId);
      } catch (error) {
        return Promise.reject(error);
      }
      // contracts/README.md: an insufficient assessment lays out an empty
      // graph (same schema, no nodes or edges).
      const graph =
        assessment.status === "insufficient_data"
          ? { ...graphs[view], nodes: [], edges: [], sources: [], claims: [] }
          : graphs[view];
      return respond({ ...graph, assessment_id: assessmentId }, signal);
    },
    updateAction: (assessmentId, actionId, update) => {
      let assessment: Assessment;
      try {
        assessment = findAssessment(assessmentId);
      } catch (error) {
        return Promise.reject(error);
      }
      const action = assessment.actions.find((item) => item.id === actionId);
      if (!action) return Promise.reject(notFound("La acción no existe."));
      if (action.revision !== update.expected_revision) {
        return Promise.reject(
          new ApiError(409, {
            code: "revision_conflict",
            message: "La acción cambió desde la última consulta.",
            details: [`Revisión vigente: ${action.revision}.`],
          }),
        );
      }
      if (action.eligibility !== "eligible") {
        return Promise.reject(
          new ApiError(409, {
            code: "action_not_eligible",
            message: "La acción no está habilitada.",
            details: [action.eligibility_reason],
          }),
        );
      }
      if (action.execution_status !== update.execution_status) {
        action.execution_status = update.execution_status;
        action.revision += 1;
        action.updated_at = new Date().toISOString();
      }
      return respond<Action>(action);
    },
    getTelemetryWindow: (recordingId, startS, endS, signal) => {
      if (recordingId !== telemetry.recording_id) {
        return Promise.reject(notFound("La grabación no existe."));
      }
      if (startS >= endS) {
        return Promise.reject(
          new ApiError(422, {
            code: "invalid_window",
            message: "La ventana de tiempo no es válida.",
            details: ["end_s debe ser mayor que start_s"],
          }),
        );
      }
      const effectiveEnd = Math.min(endS, telemetry.recording_end_s);
      const points = telemetry.points.filter(
        (point) => point.time_s >= startS && point.time_s < effectiveEnd,
      );
      const window: TelemetryWindow = {
        ...telemetry,
        start_s: startS,
        end_s: endS,
        points,
        next_start_s:
          effectiveEnd < telemetry.recording_end_s ? effectiveEnd : null,
      };
      return respond(window, signal);
    },
    getRecordingMetadata: (recordingId, signal) => {
      if (recordingId !== recording.recording_id) {
        return Promise.reject(notFound("La grabación no existe."));
      }
      return respond(recording, signal);
    },
  };
}

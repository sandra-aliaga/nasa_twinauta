import { useCallback, useEffect, useRef, useState } from "react";

import {
  dataSource,
  toApiError,
  type Action,
  type ApiError,
  type Assessment,
  type AssessmentRequest,
} from "../api";
import { isAbort } from "./useCatalog";

export type AssessmentState =
  | { status: "idle" }
  | { status: "loading"; request: AssessmentRequest }
  | { status: "error"; request: AssessmentRequest; error: ApiError }
  | { status: "ready"; request: AssessmentRequest; assessment: Assessment };

/**
 * Open the stored snapshot for the requested region and day, or create one.
 * Reusing a stored snapshot keeps its prepared synthesis (a new snapshot has
 * none) and avoids piling up copies; a snapshot with prepared context wins,
 * then the most recent. A new request aborts the previous one, so a late
 * response for an older day or region never replaces the current one.
 */
async function openOrCreate(
  request: AssessmentRequest,
  signal: AbortSignal,
): Promise<Assessment> {
  const index = await dataSource.listCaseAssessments(request.case_id, signal);
  const existing = index
    .filter(
      (item) =>
        item.region_id === request.region_id &&
        item.mission_day === request.mission_day,
    )
    .sort(
      (a, b) =>
        Number(b.has_context) - Number(a.has_context) ||
        b.created_at.localeCompare(a.created_at),
    )[0];
  return existing
    ? dataSource.getAssessment(existing.assessment_id, signal)
    : dataSource.createAssessment(request, signal);
}
export function useAssessment() {
  const [state, setState] = useState<AssessmentState>({ status: "idle" });
  const controllerRef = useRef<AbortController | null>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const evaluate = useCallback((request: AssessmentRequest) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setState({ status: "loading", request });

    openOrCreate(request, controller.signal)
      .then((assessment) => {
        if (controller.signal.aborted) return;
        setState({ status: "ready", request, assessment });
      })
      .catch((error: unknown) => {
        if (isAbort(error) || controller.signal.aborted) return;
        setState({ status: "error", request, error: toApiError(error) });
      });
  }, []);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState({ status: "idle" });
  }, []);

  /** Replace one action after a successful tracking update. */
  const replaceAction = useCallback((action: Action) => {
    setState((current) =>
      current.status === "ready"
        ? {
            ...current,
            assessment: {
              ...current.assessment,
              actions: current.assessment.actions.map((item) =>
                item.id === action.id ? action : item,
              ),
            },
          }
        : current,
    );
  }, []);

  /** Reload the same snapshot (used after a 409 revision conflict). */
  const refresh = useCallback(async () => {
    const current = stateRef.current;
    if (current.status !== "ready") return;
    const assessmentId = current.assessment.assessment_id;
    const assessment = await dataSource.getAssessment(assessmentId);
    setState((latest) =>
      latest.status === "ready" &&
      latest.assessment.assessment_id === assessmentId
        ? { ...latest, assessment }
        : latest,
    );
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { state, evaluate, reset, replaceAction, refresh };
}

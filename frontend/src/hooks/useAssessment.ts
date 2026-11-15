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
 * Create assessments on demand. A new request aborts the previous one, so a
 * late response for an older day or region never replaces the current one.
 */
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

    dataSource
      .createAssessment(request, controller.signal)
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

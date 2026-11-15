import { useEffect, useState } from "react";

import {
  dataSource,
  toApiError,
  type ApiError,
  type Case,
  type IndicatorDefinition,
  type Region,
} from "../api";

export type LoadState<T> =
  | { status: "loading" }
  | { status: "error"; error: ApiError }
  | { status: "ready"; data: T };

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

/** Load cases and indicators once; the panel needs both before rendering. */
export function useCatalog(): LoadState<{
  cases: Case[];
  indicators: IndicatorDefinition[];
}> {
  const [state, setState] = useState<
    LoadState<{ cases: Case[]; indicators: IndicatorDefinition[] }>
  >({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      dataSource.listCases(controller.signal),
      dataSource.listIndicators(controller.signal),
    ])
      .then(([cases, indicators]) =>
        setState({ status: "ready", data: { cases, indicators } }),
      )
      .catch((error: unknown) => {
        if (!isAbort(error)) {
          setState({ status: "error", error: toApiError(error) });
        }
      });
    return () => controller.abort();
  }, []);

  return state;
}

/** Load the regions of the selected case; reloads when the case changes. */
export function useRegions(caseId: string | null): LoadState<Region[]> | null {
  const [state, setState] = useState<LoadState<Region[]> | null>(null);

  useEffect(() => {
    if (!caseId) {
      setState(null);
      return;
    }
    const controller = new AbortController();
    setState({ status: "loading" });
    dataSource
      .listRegions(caseId, controller.signal)
      .then((regions) => setState({ status: "ready", data: regions }))
      .catch((error: unknown) => {
        if (!isAbort(error)) {
          setState({ status: "error", error: toApiError(error) });
        }
      });
    return () => controller.abort();
  }, [caseId]);

  return state;
}

export { isAbort };

import { useEffect, useState } from "react";

import { dataSource, toApiError, type Graph, type GraphView } from "../api";
import { isAbort, type LoadState } from "./useCatalog";

// Assessments are frozen snapshots, so their graphs can be cached safely.
const cache = new Map<string, Graph>();

/** Load one graph view of an assessment; null ids mean "nothing to load". */
export function useGraph(
  assessmentId: string | null,
  view: GraphView,
): LoadState<Graph> | null {
  const key = assessmentId ? `${assessmentId}:${view}` : null;
  const [state, setState] = useState<LoadState<Graph> | null>(null);

  useEffect(() => {
    if (!assessmentId || !key) {
      setState(null);
      return;
    }
    const cached = cache.get(key);
    if (cached) {
      setState({ status: "ready", data: cached });
      return;
    }
    const controller = new AbortController();
    setState({ status: "loading" });
    dataSource
      .getGraph(assessmentId, view, controller.signal)
      .then((graph) => {
        cache.set(key, graph);
        setState({ status: "ready", data: graph });
      })
      .catch((error: unknown) => {
        if (!isAbort(error))
          setState({ status: "error", error: toApiError(error) });
      });
    return () => controller.abort();
  }, [assessmentId, view, key]);

  return state;
}

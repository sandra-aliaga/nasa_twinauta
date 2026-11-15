import { useEffect, useMemo, useState } from "react";

import { dataSource, toApiError, type Graph, type GraphView } from "../api";
import { isAbort, type LoadState } from "./useCatalog";

// Assessments are frozen snapshots, so their graphs can be cached safely.
const cache = new Map<string, Graph>();

/**
 * Node labels that are bare identifiers (for example an indicator id) are
 * replaced with their catalog label for display; the graph is not changed.
 */
function withReadableLabels(
  graph: Graph,
  labels: Record<string, string>,
): Graph {
  if (!graph.nodes.some((node) => labels[node.label])) return graph;
  return {
    ...graph,
    nodes: graph.nodes.map((node) =>
      labels[node.label] ? { ...node, label: labels[node.label] } : node,
    ),
  };
}

/** Load one graph view of an assessment; null ids mean "nothing to load". */
export function useGraph(
  assessmentId: string | null,
  view: GraphView,
  labels: Record<string, string> = {},
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

  const labelKey = JSON.stringify(labels);
  return useMemo(
    () =>
      state?.status === "ready"
        ? { status: "ready", data: withReadableLabels(state.data, labels) }
        : state,
    // labelKey captures the label map contents.
    [state, labelKey],
  );
}

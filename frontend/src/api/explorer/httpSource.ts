import { requestJson } from "../httpSource";
import type { ExplorerSource } from "./source";

/** Serialize only the filters that are set; null/undefined are omitted. */
function toSearch(query: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const text = params.toString();
  return text ? `?${text}` : "";
}

/** Scientific library backed by the backend routes of contract 0.3.0. */
export function createExplorerHttp(baseUrl: string): ExplorerSource {
  const base = baseUrl.replace(/\/+$/, "");
  const enc = encodeURIComponent;
  return {
    kind: "api",
    searchPapers: (query, signal) =>
      requestJson(base, `/papers${toSearch(query)}`, { signal }),
    getPaper: (paperId, assessmentId, signal) =>
      requestJson(
        base,
        `/papers/${enc(paperId)}${toSearch({ assessment_id: assessmentId })}`,
        { signal },
      ),
    getKnowledgeGraph: (query, signal) =>
      requestJson(base, `/knowledge-graph${toSearch(query)}`, { signal }),
    getKnowledgeBase: (signal) =>
      requestJson(base, "/knowledge-base/metadata", { signal }),
    listModules: (signal) => requestJson(base, "/health-modules", { signal }),
  };
}

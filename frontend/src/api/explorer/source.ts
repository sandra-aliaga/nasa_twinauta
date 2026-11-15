import type {
  GraphPage,
  GraphQuery,
  Guidance,
  KnowledgeBaseMetadata,
  ModuleCatalog,
  PaperDetail,
  PaperPage,
  PaperQuery,
} from "./types";

/**
 * Scientific library operations (contract 0.3.0). "mock" serves the draft
 * fixture in examples mode; "api" calls the backend.
 */
export type ExplorerSource = {
  kind: "mock" | "api";
  searchPapers(query: PaperQuery, signal?: AbortSignal): Promise<PaperPage>;
  /** assessmentId only adds context applicability; it never filters. */
  getPaper(
    paperId: string,
    assessmentId: string | null,
    signal?: AbortSignal,
  ): Promise<PaperDetail>;
  getKnowledgeGraph(
    query: GraphQuery,
    signal?: AbortSignal,
  ): Promise<GraphPage>;
  getKnowledgeBase(signal?: AbortSignal): Promise<KnowledgeBaseMetadata>;
  listModules(signal?: AbortSignal): Promise<ModuleCatalog>;
  /** Documented guidance variants; only the mock has them. */
  listGuidanceExamples?(signal?: AbortSignal): Promise<Guidance[]>;
};

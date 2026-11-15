/**
 * Mock adapter for the PROPOSED scientific explorer (contract draft 0.3).
 * It serves contracts/drafts/scientific-explorer-0.3/examples.json and never
 * fabricates content that is not in that fixture: a paper without a detail
 * example is a 404, and a view or neighbourhood without an example comes
 * back as an empty page.
 */
import examples from "../../../../contracts/drafts/scientific-explorer-0.3/examples.json";
import { ApiError } from "../errors";
import type {
  GraphPage,
  GraphQuery,
  Guidance,
  KnowledgeBaseMetadata,
  LibraryView,
  ModuleCatalog,
  PaperCard,
  PaperDetail,
  PaperPage,
  PaperQuery,
} from "./types";

export type ExplorerSource = {
  kind: "mock";
  searchPapers(query: PaperQuery, signal?: AbortSignal): Promise<PaperPage>;
  getPaper(paperId: string, signal?: AbortSignal): Promise<PaperDetail>;
  getKnowledgeGraph(
    query: GraphQuery,
    signal?: AbortSignal,
  ): Promise<GraphPage>;
  getKnowledgeBase(signal?: AbortSignal): Promise<KnowledgeBaseMetadata>;
  listModules(signal?: AbortSignal): Promise<ModuleCatalog>;
  /** Fixture variants: "guidance" or an index of guidance_states. */
  listGuidanceExamples(signal?: AbortSignal): Promise<Guidance[]>;
};

const fixture = examples as unknown as {
  papers: PaperPage;
  paper_details: PaperDetail[];
  graph_views: Partial<Record<LibraryView, GraphPage>>;
  graph_neighbors: Record<string, GraphPage>;
  knowledge_base: KnowledgeBaseMetadata;
  modules: ModuleCatalog;
  guidance: Guidance;
  guidance_states: Guidance[];
};

const LATENCY_MS = 300;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

function respond<T>(value: T, signal?: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(structuredClone(value)), LATENCY_MS);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

function invalid(message: string, details: string[] = []): ApiError {
  return new ApiError(422, { code: "invalid_request", message, details });
}

/** Matches the filters shared by /papers and /knowledge-graph. */
function matches(paper: PaperCard, query: PaperQuery): boolean {
  const text = query.q?.trim().toLowerCase();
  if (text) {
    const haystack = [
      paper.title,
      ...paper.authors,
      paper.identifiers.doi ?? "",
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(text)) return false;
  }
  if (query.region_id && !paper.region_ids.includes(query.region_id))
    return false;
  if (query.view && !paper.sections.includes(query.view)) return false;
  if (query.review_status && paper.review_status !== query.review_status)
    return false;
  if (query.year_from !== undefined && paper.year < query.year_from)
    return false;
  if (query.year_to !== undefined && paper.year > query.year_to) return false;
  if (query.indicator_id && !paper.indicator_ids.includes(query.indicator_id)) {
    return false;
  }
  return true;
}

function validate(query: PaperQuery): ApiError | null {
  if (
    query.year_from !== undefined &&
    query.year_to !== undefined &&
    query.year_from > query.year_to
  ) {
    return invalid("El año inicial es posterior al final.");
  }
  const limit = query.limit ?? DEFAULT_LIMIT;
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return invalid(`El límite debe estar entre 1 y ${MAX_LIMIT}.`);
  }
  const indicators = new Set(
    fixture.modules.modules.flatMap((m) => m.indicator_ids),
  );
  if (query.indicator_id && !indicators.has(query.indicator_id)) {
    return invalid("Indicador desconocido.");
  }
  const modules = new Set(fixture.modules.modules.map((m) => m.id));
  if (query.module_id && !modules.has(query.module_id)) {
    return invalid("Módulo desconocido.");
  }
  return null;
}

/** Opaque cursor bound to the query and corpus version, as the draft requires. */
function queryKey(query: PaperQuery): string {
  const { cursor: _cursor, limit: _limit, ...rest } = query;
  return JSON.stringify([fixture.papers.corpus_version, rest]);
}

function readCursor(query: PaperQuery): number | ApiError {
  if (!query.cursor) return 0;
  try {
    const decoded = JSON.parse(atob(query.cursor)) as {
      key: string;
      offset: number;
    };
    if (decoded.key !== queryKey(query)) {
      return new ApiError(409, {
        code: "cursor_conflict",
        message: "El cursor pertenece a otra consulta o versión del corpus.",
        details: [],
      });
    }
    return decoded.offset;
  } catch {
    return invalid("Cursor mal formado.");
  }
}

function makeCursor(query: PaperQuery, offset: number): string {
  return btoa(JSON.stringify({ key: queryKey(query), offset }));
}

export function createExplorerMock(): ExplorerSource {
  return {
    kind: "mock",
    searchPapers(query, signal) {
      const error = validate(query);
      if (error) return Promise.reject(error);
      const offset = readCursor(query);
      if (offset instanceof ApiError) return Promise.reject(offset);
      const limit = query.limit ?? DEFAULT_LIMIT;
      // Draft order: year descending, then id. No relevance score.
      const all = fixture.papers.items
        .filter((paper) => matches(paper, query))
        .sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));
      const items = all.slice(offset, offset + limit);
      const hasMore = offset + limit < all.length;
      return respond<PaperPage>(
        {
          corpus_version: fixture.papers.corpus_version,
          items,
          total_matching: all.length,
          page: {
            has_more: hasMore,
            next_cursor: hasMore ? makeCursor(query, offset + limit) : null,
          },
        },
        signal,
      );
    },
    getPaper(paperId, signal) {
      const detail = fixture.paper_details.find(
        (item) => item.paper.id === paperId,
      );
      if (detail) return respond(detail, signal);
      const known = fixture.papers.items.some((paper) => paper.id === paperId);
      return Promise.reject(
        new ApiError(404, {
          code: "not_found",
          message: known
            ? "Los ejemplos 0.3 no incluyen la ficha de esta publicación."
            : "La publicación no existe en el corpus de ejemplo.",
          details: [],
        }),
      );
    },
    getKnowledgeGraph(query, signal) {
      const error = validate(query);
      if (error) return Promise.reject(error);
      const view = query.view ?? "evidence";
      const known = fixture.papers.items.some((p) => p.id === query.paper_id);
      if (query.paper_id && !known) {
        return Promise.reject(
          new ApiError(404, {
            code: "not_found",
            message: "La publicación no existe en el corpus de ejemplo.",
            details: [],
          }),
        );
      }
      const base = query.paper_id
        ? fixture.graph_neighbors[query.paper_id]
        : fixture.graph_views[view];
      if (!base) {
        return respond<GraphPage>(
          {
            corpus_version: fixture.papers.corpus_version,
            view,
            assessment_id: query.assessment_id ?? null,
            nodes: [],
            edges: [],
            page: { has_more: false, next_cursor: null },
            scope_description: query.paper_id
              ? "Los ejemplos 0.3 no incluyen vecinos para esta publicación."
              : "Los ejemplos 0.3 no incluyen esta vista.",
            counts: {
              papers_matching: 0,
              papers_returned: 0,
              papers_reviewed_returned: 0,
            },
          },
          signal,
        );
      }
      const allowed = new Set(
        fixture.papers.items
          .filter((paper) => matches(paper, query))
          .map((p) => p.id),
      );
      // With paper_id, the anchor paper is always kept; filters apply to
      // candidate neighbours only.
      const nodes = base.nodes.filter(
        (node) =>
          node.kind !== "paper" ||
          node.paper_id === query.paper_id ||
          (node.paper_id !== null && allowed.has(node.paper_id)),
      );
      const ids = new Set(nodes.map((node) => node.id));
      // Each page must resolve both ends of its edges.
      const edges = base.edges.filter(
        (edge) => ids.has(edge.source) && ids.has(edge.target),
      );
      const papers = nodes.filter((node) => node.kind === "paper");
      return respond<GraphPage>(
        {
          ...base,
          view,
          assessment_id: query.assessment_id ?? null,
          nodes,
          edges,
          counts: {
            papers_matching: query.paper_id
              ? papers.length
              : base.nodes.filter(
                  (n) => n.kind === "paper" && allowed.has(n.paper_id ?? ""),
                ).length,
            papers_returned: papers.length,
            papers_reviewed_returned: papers.filter(
              (n) => n.review_status === "reviewed",
            ).length,
          },
        },
        signal,
      );
    },
    getKnowledgeBase: (signal) => respond(fixture.knowledge_base, signal),
    listModules: (signal) => respond(fixture.modules, signal),
    listGuidanceExamples: (signal) =>
      respond([fixture.guidance, ...fixture.guidance_states], signal),
  };
}

export const explorerSource: ExplorerSource = createExplorerMock();

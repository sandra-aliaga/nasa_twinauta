/**
 * Types of the scientific library and contextual synthesis, taken from the
 * current contract (contracts/openapi.yaml, 0.3.0). The historical draft in
 * contracts/drafts/scientific-explorer-0.3 is only used by the examples mock.
 */
import type { components, operations } from "../schema";

type Schemas = components["schemas"];

export type PaperCard = Schemas["PaperCard"];
export type Environment = PaperCard["environment"];
export type PaperPage = Schemas["PaperPage"];
export type PaperDetail = Schemas["PaperDetail"];
export type Statistic = Schemas["PaperStatistic"];
export type Analysis = Schemas["PaperAnalysis"];
export type Applicability = Schemas["PaperApplicability"];
export type KnowledgeNode = Schemas["KnowledgeNode"];
export type KnowledgeEdge = Schemas["KnowledgeEdge"];
export type GraphPage = Schemas["GraphPage"];
export type KnowledgeBaseMetadata = Schemas["KnowledgeBaseMetadata"];
export type HealthModule = Schemas["HealthModule"];
export type ModuleCatalog = Schemas["ModuleCatalog"];
export type Guidance = Schemas["Guidance"];
export type GuidanceStep = Schemas["GuidanceStep"];
export type AssessmentContext = Schemas["AssessmentContext"];
export type AssessmentIndex = Schemas["AssessmentIndex"];
export type NarrativeSection = Schemas["NarrativeSection"];
export type EvidenceSnippet = Schemas["EvidenceSnippet"];
export type ContextDraft = Schemas["ContextDraft"];

/** Contract types allow null filters; the UI only sends what it sets. */
type NonNullFields<T> = { [K in keyof T]?: Exclude<T[K], null> };

export type PaperQuery = NonNullFields<
  NonNullable<operations["search_papers"]["parameters"]["query"]>
>;
export type GraphQuery = NonNullFields<
  NonNullable<operations["get_knowledge_graph"]["parameters"]["query"]>
>;
export type LibraryView = NonNullable<PaperQuery["view"]>;

/**
 * The contract leaves `interval` as an open object. This is the shape the
 * draft documented; the UI reads it defensively and ignores anything else.
 */
export type StatisticInterval = {
  kind?: string;
  level?: number | null;
  lower: number;
  upper: number;
  unit?: string;
};

export function readInterval(value: unknown): StatisticInterval | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v.lower !== "number" || typeof v.upper !== "number") return null;
  return {
    kind: typeof v.kind === "string" ? v.kind : undefined,
    level: typeof v.level === "number" ? v.level : null,
    lower: v.lower,
    upper: v.upper,
    unit: typeof v.unit === "string" ? v.unit : undefined,
  };
}

/** Dispersion is also an open object in the contract; read it defensively. */
export type StatisticDispersion = {
  kind: "standard_deviation" | "standard_error";
  value: number;
  unit?: string;
};

export function readDispersion(value: unknown): StatisticDispersion | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const kind =
    v.kind === "standard_deviation" || v.kind === "sd"
      ? "standard_deviation"
      : v.kind === "standard_error" || v.kind === "se"
        ? "standard_error"
        : null;
  if (!kind || typeof v.value !== "number") return null;
  return {
    kind,
    value: v.value,
    unit: typeof v.unit === "string" ? v.unit : undefined,
  };
}

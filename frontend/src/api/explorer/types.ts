/**
 * Types of the scientific explorer, generated from the PROPOSED contract
 * contracts/drafts/scientific-explorer-0.3. They are kept apart from the
 * 0.2 types on purpose: the backend does not implement these routes yet.
 */
import type { components, operations } from "./schema";

type Schemas = components["schemas"];

export type Environment = Schemas["Environment"];
export type PaperCard = Schemas["PaperCard"];
export type PaperPage = Schemas["PaperPage"];
export type PaperDetail = Schemas["PaperDetail"];
export type Statistic = Schemas["Statistic"];
export type Analysis = Schemas["Analysis"];
export type Applicability = Schemas["Applicability"];
export type KnowledgeNode = Schemas["KnowledgeNode"];
export type KnowledgeEdge = Schemas["KnowledgeEdge"];
export type GraphPage = Schemas["GraphPage"];
export type KnowledgeBaseMetadata = Schemas["KnowledgeBaseMetadata"];
export type HealthModule = Schemas["HealthModule"];
export type ModuleCatalog = Schemas["ModuleCatalog"];
export type Guidance = Schemas["Guidance"];
export type GuidanceStep = Schemas["GuidanceStep"];

export type PaperQuery = NonNullable<
  operations["search_papers"]["parameters"]["query"]
>;
export type GraphQuery = NonNullable<
  operations["get_knowledge_graph"]["parameters"]["query"]
>;
export type LibraryView = NonNullable<PaperQuery["view"]>;

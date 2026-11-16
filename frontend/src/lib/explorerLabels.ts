/** Spanish labels for the explorer draft 0.3 enums. */
import type {
  Analysis,
  Applicability,
  Guidance,
  GuidanceStep,
  HealthModule,
  KnowledgeEdge,
  KnowledgeNode,
  LibraryView,
  PaperCard,
  PaperDetail,
  Statistic,
} from "../api/explorer/types";
import { translated } from "../i18n";

export const LIBRARY_VIEW_LABELS: Record<LibraryView, string> = translated({
  evidence: "Estado y explicación",
  scenario: "Implicaciones y evolución",
  actions: "Contramedidas estudiadas",
});

export const AVAILABILITY_LABELS: Record<
  PaperCard["access"]["availability"],
  string
> = translated({
  open_access: "Acceso abierto",
  landing_only: "Solo página del editor",
  unknown: "Acceso sin determinar",
});

export const SUMMARY_STATUS_LABELS: Record<
  PaperDetail["summary"]["status"],
  string
> = translated({
  available: "Disponible",
  pending: "Pendiente",
  unavailable: "No disponible",
});

export const SUMMARY_BASIS_LABELS: Record<
  PaperDetail["summary"]["basis"],
  string
> = translated({
  full_text: "texto completo",
  abstract: "solo el abstract",
  metadata_only: "solo metadatos",
  not_prepared: "sin preparar",
});

export const SUMMARY_METHOD_LABELS: Record<
  PaperDetail["summary"]["method"],
  string
> = translated({
  editorial: "redacción editorial",
  llm_assisted: "asistido por IA",
  not_prepared: "sin preparar",
});

export const ANALYSIS_STATUS_LABELS: Record<Analysis["status"], string> =
  translated({
    not_requested: "No solicitado",
    queued: "En cola",
    running: "Procesando",
    ready: "Procesado (sin revisión implícita)",
    failed: "Falló",
  });

export const ANALYSIS_KIND_LABELS: Record<
  Analysis["items"][number]["kind"],
  string
> = translated({
  finding: "Hallazgo",
  implication: "Implicación",
  studied_intervention: "Intervención estudiada",
});

export const STATISTIC_TYPE_LABELS: Record<
  Statistic["statistic_type"],
  string
> = translated({
  group_mean: "Media de grupo",
  individual_value: "Valor individual",
  change_rate: "Tasa de cambio",
  effect_estimate: "Estimación de efecto",
});

export const DISPERSION_LABELS = {
  standard_deviation: "DE",
  standard_error: "EE",
} as const;

/** Known interval kinds; an unknown kind is shown as "Intervalo". */
export const INTERVAL_LABELS: Record<string, string> = translated({
  confidence_interval: "IC",
  credible_interval: "Intervalo creíble",
  reported_range: "Rango informado",
});

export const COHORT_OVERLAP_LABELS: Record<
  PaperDetail["cohort_overlap_status"],
  string
> = translated({
  unknown: "Solapamiento de cohorte sin determinar",
  possible_overlap: "Posible solapamiento de participantes con otros estudios",
  documented: "Solapamiento de cohorte documentado",
});

export const APPLICABILITY_LABELS: Record<Applicability["status"], string> =
  translated({
    not_evaluated: "Aplicabilidad no evaluada",
    context_match: "Contexto compatible",
    analog_only: "Solo análogo",
    not_comparable: "No comparable",
    insufficient_data: "Información insuficiente",
  });

export const NODE_KIND_LABELS: Record<KnowledgeNode["kind"], string> =
  translated({
    paper: "Publicación",
    indicator: "Indicador",
    claim: "Afirmación",
    action: "Acción",
    topic: "Tema",
    intervention: "Intervención estudiada",
  });

export const RELATION_LABELS: Record<KnowledgeEdge["relation"], string> =
  translated({
    cites: "cita",
    addresses: "trata el tema",
    reports: "informa",
    supports: "respalda",
    contradicts: "contradice",
    qualifies: "matiza",
    same_cohort: "misma cohorte",
    possible_cohort_overlap: "posible cohorte compartida",
  });

export const BASIS_LABELS: Record<KnowledgeEdge["basis"], string> = translated({
  provider_metadata: "Metadatos del proveedor",
  editorial_classification: "Clasificación editorial",
  reviewed_extraction: "Extracción revisada",
  llm_suggestion: "Sugerencia de IA",
});

export const IMPLEMENTATION_LABELS: Record<
  HealthModule["implementation_status"],
  string
> = translated({
  planned: "Planificado",
  prototype: "Prototipo",
  available: "Implementado",
});

export const INTERPRETATION_LABELS: Record<
  HealthModule["interpretation_status"],
  string
> = translated({
  unavailable: "Interpretación no disponible",
  review_pending: "Interpretación en prototipo",
  reviewed: "Interpretación revisada",
});

export const GUIDANCE_STATUS_LABELS: Record<Guidance["status"], string> =
  translated({
    complete: "Completa",
    partial: "Parcial",
    insufficient_data: "Información insuficiente",
    not_supported: "Sin módulo para esta región",
    review_pending: "Pendiente de revisión",
  });

export const GUIDANCE_ATTENTION_LABELS: Record<Guidance["attention"], string> =
  translated({
    informational: "Informativa",
    review_needed: "Requiere revisión",
    unknown: "Sin determinar",
  });

export const STEP_KIND_LABELS: Record<GuidanceStep["kind"], string> =
  translated({
    operational_review: "Revisión operativa",
    studied_intervention: "Intervención estudiada (no prescrita)",
  });

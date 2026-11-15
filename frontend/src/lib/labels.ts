/**
 * Spanish display text for contract enums. Keeping it in one place avoids
 * each component inventing its own wording for the same state.
 */
import type { Environment } from "../api/explorer/types";
import type {
  Action,
  Assessment,
  EvidenceClaim,
  Finding,
  IndicatorDefinition,
  Observation,
  Scenario,
  Source,
} from "../api";

export const UNIT_LABELS: Record<IndicatorDefinition["unit"], string> = {
  percent_baseline: "% del basal",
  "N.m": "N·m",
  "beats/min": "lpm",
};

export const ASSESSMENT_STATUS_LABELS: Record<Assessment["status"], string> = {
  complete: "Completa",
  partial: "Parcial",
  insufficient_data: "Información insuficiente",
};

export const ASSESSMENT_STATUS_HINTS: Record<Assessment["status"], string> = {
  complete:
    "Se atendieron las partes solicitadas. No significa astronauta sano ni modelo clínicamente validado.",
  partial: "Hay información útil y partes que no pudieron calcularse.",
  insufficient_data:
    "No se pudo producir la evaluación con los datos disponibles.",
};

export const SCENARIO_STATUS_LABELS: Record<Scenario["status"], string> = {
  available: "Disponible",
  insufficient_data: "Información insuficiente",
  out_of_domain: "Fuera del dominio del modelo",
};

export const ATTENTION_LABELS: Record<Finding["attention"], string> = {
  informational: "Informativo",
  review_needed: "Requiere revisión",
  unknown: "Sin determinar",
};

export const ORIGIN_LABELS: Record<Observation["origin"], string> = {
  synthetic: "Sintético",
  human_dataset: "Dataset humano",
  published_aggregate: "Resultado agregado publicado",
};

export const DERIVATION_LABELS: Record<Observation["derivation"], string> = {
  measured: "Medido",
  seeded: "Precargado",
  computed: "Calculado",
};

export const QUALITY_LABELS: Record<Observation["quality"], string> = {
  available: "Disponible",
  missing: "Ausente",
  suspect: "Sospechoso",
};

export const STATISTIC_LABELS: Record<Observation["statistic"], string> = {
  individual_value: "Valor individual",
  group_mean: "Media de grupo",
  normalized_reference: "Referencia normalizada",
};

export const REVIEW_LABELS: Record<Source["review_status"], string> = {
  pending: "Pendiente de revisión",
  reviewed: "Revisado",
};

export const EXECUTION_LABELS: Record<Action["execution_status"], string> = {
  pending: "Pendiente",
  completed: "Realizada",
  skipped: "Omitida",
};

export const ELIGIBILITY_LABELS: Record<Action["eligibility"], string> = {
  eligible: "Habilitada",
  ineligible: "No habilitada",
  unknown: "Habilitación desconocida",
};

export const CLAIM_KIND_LABELS: Record<EvidenceClaim["kind"], string> = {
  observed_result: "Resultado observado",
  association: "Asociación",
  model_assumption: "Supuesto del modelo",
  intervention_result: "Resultado de intervención",
  operational_rule: "Regla operativa",
};

/**
 * Single environment vocabulary (draft 0.3 Environment). The 0.2 enums for
 * claims and scenarios are subsets of it, so one map serves both.
 */
export const ENVIRONMENT_LABELS: Record<Environment, string> = {
  spaceflight: "Vuelo espacial",
  bed_rest_analog: "Análogo terrestre (reposo en cama)",
  terrestrial_exercise: "Ejercicio en Tierra",
  synthetic: "Sintético",
  other: "Otro entorno",
  mixed: "Entornos mixtos",
  unknown: "Entorno sin determinar",
};

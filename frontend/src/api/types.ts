/**
 * Short aliases for the types generated from contracts/openapi.yaml.
 * Regenerate schema.d.ts with `npm run types` whenever the contract changes.
 */
import type { components } from "./schema";

type Schemas = components["schemas"];

export type ApiErrorBody = Schemas["Error"];
export type Case = Schemas["Case"];
export type Region = Schemas["Region"];
export type IndicatorDefinition = Schemas["IndicatorDefinition"];
export type AssessmentRequest = Schemas["AssessmentRequest"];
export type Assessment = Schemas["Assessment"];
export type Observation = Schemas["Observation"];
export type ExerciseRecord = Schemas["ExerciseRecord"];
export type Finding = Schemas["Finding"];
export type Scenario = Schemas["Scenario"];
export type Action = Schemas["Action"];
export type ActionUpdate = Schemas["ActionUpdate"];
export type Source = Schemas["Source"];
export type EvidenceClaim = Schemas["EvidenceClaim"];
export type Graph = Schemas["Graph"];
export type GraphView = Graph["view"];
export type TelemetryWindow = Schemas["TelemetryWindow"];
export type TelemetryRecording = Schemas["TelemetryRecording"];

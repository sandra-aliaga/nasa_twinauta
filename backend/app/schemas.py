"""Public payloads matching the shared API contract."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ContractModel(BaseModel):
    """Reject unexpected fields and non-finite numeric values."""

    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)


class ScenarioParameter(ContractModel):
    """Represent the ScenarioParameter contract payload."""

    id: str
    value: Annotated[float, Field(strict=True)]
    unit: str
    source_id: str
    locator: str


class Error(ContractModel):
    """Represent the Error contract payload."""

    code: str
    message: str
    details: list[str]


class Case(ContractModel):
    """Represent the Case contract payload."""

    id: Annotated[str, Field(min_length=1)]
    label: str
    is_virtual: bool
    duration_days: Annotated[int, Field(ge=0, strict=True)]
    telemetry_recording_id: str | None
    anatomy_asset: AnatomyAsset


class Region(ContractModel):
    """Represent the Region contract payload."""

    id: Annotated[str, Field(min_length=1)]
    label: str
    indicator_ids: list[str]


class AssessmentRequest(ContractModel):
    """Represent the AssessmentRequest contract payload."""

    case_id: Annotated[str, Field(min_length=1)]
    region_id: Annotated[str, Field(min_length=1)]
    mission_day: Annotated[int, Field(ge=0, strict=True)]
    horizon_days: Annotated[int, Field(ge=0, strict=True)]
    reference_start_day: Annotated[int, Field(ge=0, strict=True)]


class Source(ContractModel):
    """Represent the Source contract payload."""

    id: Annotated[str, Field(min_length=1)]
    title: str
    url: str | None
    locator: str
    review_status: Literal["pending", "reviewed"]
    version: str | None
    license: str | None


class Observation(ContractModel):
    """Represent the Observation contract payload."""

    id: Annotated[str, Field(min_length=1)]
    indicator_id: Annotated[
        Literal["quadriceps_csa_relative", "knee_extension_torque"], Field(min_length=1)
    ]
    value: Annotated[float, Field(strict=True)] | None
    unit: Literal["percent_baseline", "N.m"]
    mission_day: Annotated[int, Field(ge=0, strict=True)]
    origin: Literal["synthetic", "human_dataset", "published_aggregate"]
    derivation: Literal["measured", "seeded", "computed"]
    method: str
    source_id: Annotated[str, Field(min_length=1)]
    missing_reason: str | None
    quality: Literal["available", "missing", "suspect"]
    statistic: Literal["individual_value", "group_mean", "normalized_reference"]
    sample_size: Annotated[int, Field(ge=1, strict=True)] | None
    dispersion: Dispersion | None
    baseline_observation_id: str | None

    @model_validator(mode="after")
    def validate_measurement(self) -> Self:
        """Keep units, missing values and aggregate statistics consistent."""
        expected_unit = {
            "quadriceps_csa_relative": "percent_baseline",
            "knee_extension_torque": "N.m",
        }[self.indicator_id]
        if self.unit != expected_unit:
            raise ValueError("The unit does not match the indicator.")
        if self.quality == "missing":
            if self.value is not None or not self.missing_reason:
                raise ValueError("Missing observations require a null value and a reason.")
        elif self.value is None:
            raise ValueError("Available and suspect observations require a numeric value.")
        if self.statistic == "group_mean" and self.sample_size is None:
            raise ValueError("A group mean requires its sample size.")
        return self


class ExerciseRecord(ContractModel):
    """Represent the ExerciseRecord contract payload."""

    id: str
    mission_day: Annotated[int, Field(ge=0, strict=True)]
    modality: str
    record_status: Literal["recorded", "not_recorded"]
    planned_duration_min: Annotated[float, Field(ge=0, strict=True)] | None
    recorded_duration_min: Annotated[float, Field(ge=0, strict=True)] | None
    sets: Annotated[int, Field(ge=0, strict=True)] | None
    repetitions: Annotated[int, Field(ge=0, strict=True)] | None
    resistance_value: Annotated[float, Field(ge=0, strict=True)] | None
    resistance_unit: str | None
    equipment_available: bool | None
    origin: Literal["synthetic", "human_dataset"]
    source_id: str


class Finding(ContractModel):
    """Represent the Finding contract payload."""

    id: Annotated[str, Field(min_length=1)]
    title: str
    description: str
    related_ids: list[str]
    source_ids: list[str]
    attention: Literal["informational", "review_needed", "unknown"]
    claim_ids: list[str]


class EvidenceContext(ContractModel):
    """Represent the EvidenceContext contract payload."""

    data_quality: list[str]
    evidence_applicability: list[str]
    model_limitations: list[str]


class ScenarioPoint(ContractModel):
    """Represent the ScenarioPoint contract payload."""

    elapsed_day: Annotated[int, Field(ge=0, strict=True)]
    value: Annotated[float, Field(strict=True)]


class Scenario(ContractModel):
    """Represent the Scenario contract payload."""

    id: Annotated[str, Field(min_length=1)]
    status: Literal["available", "insufficient_data", "out_of_domain"]
    label: str
    model_id: str | None
    model_version: str | None
    horizon_days: Annotated[int, Field(ge=0, strict=True)]
    unit: Literal["percent_baseline"]
    reason: str | None
    assumptions: list[str]
    points: list[ScenarioPoint]
    source_ids: list[str]
    summary: str
    reference_start_day: Annotated[int, Field(ge=0, strict=True)]
    parameters: list[ScenarioParameter]
    domain: ScenarioDomain | None

    @model_validator(mode="after")
    def validate_scenario(self) -> Self:
        """Require model metadata and enforce the declared temporal domain."""
        if self.status != "available":
            if self.points or not self.reason:
                raise ValueError("Unavailable scenarios require a reason and no points.")
            return self
        if not self.model_id or not self.model_version or not self.parameters or not self.domain:
            raise ValueError("Available scenarios require a model, parameters and domain.")
        if self.reason is not None or not self.points:
            raise ValueError("Available scenarios require points and no failure reason.")
        if not (
            self.domain.min_reference_day <= self.reference_start_day
            and self.reference_start_day + self.horizon_days <= self.domain.max_reference_day
        ):
            raise ValueError("The requested interval is outside the model domain.")
        days = [point.elapsed_day for point in self.points]
        if days != sorted(set(days)) or any(day > self.horizon_days for day in days):
            raise ValueError("Scenario points must be ordered, unique and within the horizon.")
        return self


class Action(ContractModel):
    """Represent the Action contract payload."""

    id: Annotated[str, Field(min_length=1)]
    title: str
    rationale: str
    requirements: list[str]
    related_finding_ids: list[str]
    source_ids: list[str]
    review_status: Literal["pending", "reviewed"]
    execution_status: Literal["pending", "completed", "skipped"]
    eligibility: Literal["eligible", "ineligible", "unknown"]
    eligibility_reason: str
    claim_ids: list[str]
    revision: Annotated[int, Field(ge=0, strict=True)]
    updated_at: datetime


class ActionUpdate(ContractModel):
    """Represent the ActionUpdate contract payload."""

    execution_status: Literal["pending", "completed", "skipped"]
    expected_revision: Annotated[int, Field(ge=0, strict=True)]


class Versions(ContractModel):
    """Represent the Versions contract payload."""

    rules: str
    evidence: str
    summary_template: str


class Assessment(ContractModel):
    """Represent the Assessment contract payload."""

    assessment_id: Annotated[str, Field(min_length=1)]
    case_id: Annotated[str, Field(min_length=1)]
    region_id: Annotated[str, Field(min_length=1)]
    mission_day: Annotated[int, Field(ge=0, strict=True)]
    content_mode: Literal["illustrative", "evidence_based"]
    status: Literal["complete", "partial", "insufficient_data"]
    summary: str
    versions: Versions
    observations: list[Observation]
    exercise_records: list[ExerciseRecord]
    findings: list[Finding]
    evidence_context: EvidenceContext
    scenario: Scenario
    actions: list[Action]
    sources: list[Source]
    action_summary: str
    created_at: datetime
    claims: list[EvidenceClaim]

    @model_validator(mode="after")
    def validate_snapshot(self) -> Self:
        """Reject future records, invalid baselines and broken evidence references."""
        observations = {item.id: item for item in self.observations}
        source_ids = {item.id for item in self.sources}
        claim_ids = {item.id for item in self.claims}
        if len(observations) != len(self.observations):
            raise ValueError("Observation identifiers must be unique.")
        for item in [*self.observations, *self.exercise_records]:
            if item.mission_day > self.mission_day or item.source_id not in source_ids:
                raise ValueError("Snapshot records cannot be future-dated or lack a source.")
        for item in self.observations:
            if item.baseline_observation_id:
                baseline = observations.get(item.baseline_observation_id)
                if (
                    baseline is None
                    or baseline.mission_day > item.mission_day
                    or baseline.indicator_id != item.indicator_id
                    or baseline.method != item.method
                ):
                    raise ValueError("The baseline must be available and use the same method.")
        for item in [*self.findings, *self.actions, *self.claims]:
            if not set(item.source_ids).issubset(source_ids):
                raise ValueError("An evidence source is missing from the snapshot.")
        for item in [*self.findings, *self.actions]:
            if not set(item.claim_ids).issubset(claim_ids):
                raise ValueError("An evidence claim is missing from the snapshot.")
        if not set(self.scenario.source_ids).issubset(source_ids):
            raise ValueError("A scenario source is missing from the snapshot.")
        return self


class GraphNode(ContractModel):
    """Represent the GraphNode contract payload."""

    id: Annotated[str, Field(min_length=1)]
    kind: Literal[
        "finding",
        "observation",
        "exercise",
        "claim",
        "source",
        "limitation",
        "scenario",
        "model",
        "parameter",
        "action",
        "requirement",
    ]
    label: str
    description: str
    source_ids: list[str]
    entity_id: str | None


class GraphEdge(ContractModel):
    """Represent the GraphEdge contract payload."""

    id: Annotated[str, Field(min_length=1)]
    source: str
    target: str
    relation: Literal[
        "uses", "describes", "supported_by", "limited_by", "computed_with", "requires", "addresses"
    ]
    label: str
    claim_ids: list[str]


class Graph(ContractModel):
    """Represent the Graph contract payload."""

    assessment_id: Annotated[str, Field(min_length=1)]
    view: Literal["evidence", "scenario", "actions"]
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    sources: list[Source]
    content_mode: Literal["illustrative", "evidence_based"]
    versions: Versions
    claims: list[EvidenceClaim]

    @model_validator(mode="after")
    def validate_connections(self) -> Self:
        """Ensure all displayed graph endpoints and evidence references exist."""
        node_ids = {node.id for node in self.nodes}
        source_ids = {source.id for source in self.sources}
        claim_ids = {claim.id for claim in self.claims}
        if len(node_ids) != len(self.nodes):
            raise ValueError("Graph node identifiers must be unique.")
        for node in self.nodes:
            if not set(node.source_ids).issubset(source_ids):
                raise ValueError("A graph source is missing.")
        for edge in self.edges:
            if edge.source not in node_ids or edge.target not in node_ids:
                raise ValueError("A graph edge references a missing node.")
            if not set(edge.claim_ids).issubset(claim_ids):
                raise ValueError("A graph edge references a missing claim.")
            if edge.relation == "supported_by" and not edge.claim_ids:
                raise ValueError("Scientific support requires an explicit claim.")
        return self


class TelemetryPoint(ContractModel):
    """Represent the TelemetryPoint contract payload."""

    time_s: Annotated[float, Field(ge=0, strict=True)]
    value: Annotated[float, Field(strict=True)] | None
    missing_reason: str | None

    @model_validator(mode="after")
    def validate_missing_value(self) -> Self:
        """Keep missing samples explicit instead of converting them to zero."""
        if self.value is None and not self.missing_reason:
            raise ValueError("A missing sample requires a reason.")
        return self


class TelemetryWindow(ContractModel):
    """Represent the TelemetryWindow contract payload."""

    recording_id: str
    dataset_id: str
    participant_id: str
    content_mode: Literal["illustrative", "evidence_based"]
    origin: Literal["synthetic", "human_dataset"]
    context: Literal["terrestrial_exercise"]
    indicator_id: Literal["heart_rate"]
    unit: Literal["beats/min"]
    start_s: Annotated[float, Field(ge=0, strict=True)]
    end_s: Annotated[float, Field(gt=0, strict=True)]
    points: Annotated[list[TelemetryPoint], Field(max_length=2000)]
    source: Source
    recording_end_s: Annotated[float, Field(ge=0, strict=True)]
    next_start_s: Annotated[float, Field(ge=0, strict=True)] | None


class AnatomyAsset(ContractModel):
    """Represent the AnatomyAsset contract payload."""

    id: str
    status: Literal["pending", "available"]
    url: str | None
    license_url: str | None


class IndicatorDefinition(ContractModel):
    """Represent the IndicatorDefinition contract payload."""

    id: Annotated[
        Literal["quadriceps_csa_relative", "knee_extension_torque", "heart_rate"],
        Field(min_length=1),
    ]
    label: str
    unit: Literal["percent_baseline", "N.m", "beats/min"]
    region_id: str | None
    description: str
    baseline_interpretation: str


class EvidenceClaim(ContractModel):
    """Represent the EvidenceClaim contract payload."""

    id: Annotated[str, Field(min_length=1)]
    statement: str
    kind: Literal[
        "observed_result",
        "association",
        "model_assumption",
        "intervention_result",
        "operational_rule",
    ]
    source_ids: list[str]
    population: str
    sample_size: Annotated[int, Field(ge=1, strict=True)] | None
    environment: Literal["spaceflight", "bed_rest_analog", "terrestrial_exercise", "synthetic"]
    limitations: list[str]
    review_status: Literal["pending", "reviewed"]


class Dispersion(ContractModel):
    """Represent the Dispersion contract payload."""

    kind: Literal["standard_deviation", "standard_error"]
    value: Annotated[float, Field(ge=0, strict=True)]


class ScenarioDomain(ContractModel):
    """Represent the ScenarioDomain contract payload."""

    environment: Literal["bed_rest_analog", "spaceflight", "synthetic"]
    min_reference_day: Annotated[int, Field(ge=0, strict=True)]
    max_reference_day: Annotated[int, Field(ge=0, strict=True)]
    baseline_definition: str
    individual_prediction: Literal[False]


class TelemetryRecording(ContractModel):
    """Represent the TelemetryRecording contract payload."""

    recording_id: Annotated[str, Field(min_length=1)]
    dataset_id: Annotated[str, Field(min_length=1)]
    participant_id: Annotated[str, Field(min_length=1)]
    content_mode: Literal["illustrative", "evidence_based"]
    origin: Literal["synthetic", "human_dataset"]
    context: Literal["terrestrial_exercise"]
    indicator_id: Annotated[Literal["heart_rate"], Field(min_length=1)]
    unit: Literal["beats/min"]
    start_s: Annotated[float, Field(ge=0, strict=True)]
    end_s: Annotated[float, Field(gt=0, strict=True)]
    max_window_seconds: Literal[120]
    max_points: Literal[2000]
    source: Source


for model in tuple(globals().values()):
    if isinstance(model, type) and issubclass(model, ContractModel):
        model.model_rebuild()

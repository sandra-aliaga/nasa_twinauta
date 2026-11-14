"""Public payloads matching the shared API contract."""

from __future__ import annotations

from datetime import datetime
from typing import Annotated, Literal, Self

from pydantic import BaseModel, ConfigDict, Field, model_validator


def unique_ids(identifiers: list[str], label: str) -> set[str]:
    """Reject ambiguous references within one payload."""
    result = set(identifiers)
    if len(result) != len(identifiers):
        raise ValueError(f"{label} identifiers must be unique.")
    return result


def validate_claim_sources(
    claims: list[EvidenceClaim], sources: list[Source], reviewed_claim_ids: set[str]
) -> None:
    """Check provenance and require reviewed support only where it is used."""
    source_map = {source.id: source for source in sources}
    for claim in claims:
        if not set(claim.source_ids).issubset(source_map):
            raise ValueError("An evidence claim references a missing source.")
        if claim.id not in reviewed_claim_ids:
            continue
        if claim.review_status != "reviewed" or not claim.source_ids:
            raise ValueError("Scientific support requires a reviewed claim and sources.")
        for source_id in claim.source_ids:
            source = source_map[source_id]
            if source.review_status != "reviewed" or not source.url or not source.locator.strip():
                raise ValueError("Scientific support requires reviewed, traceable sources.")


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

    @model_validator(mode="after")
    def validate_record_status(self) -> Self:
        """Do not report an actual duration for a session without a record."""
        if self.record_status == "not_recorded" and self.recorded_duration_min is not None:
            raise ValueError("Unrecorded sessions cannot have a recorded duration.")
        if (self.resistance_value is None) != (self.resistance_unit is None):
            raise ValueError("Resistance requires both a value and a unit.")
        return self


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
        unique_ids([parameter.id for parameter in self.parameters], "Parameter")
        if any(parameter.source_id not in self.source_ids for parameter in self.parameters):
            raise ValueError("Parameter sources must be included in the scenario.")
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
        observation_ids = unique_ids([item.id for item in self.observations], "Observation")
        exercise_ids = unique_ids([item.id for item in self.exercise_records], "Exercise")
        source_ids = unique_ids([item.id for item in self.sources], "Source")
        claim_ids = unique_ids([item.id for item in self.claims], "Claim")
        finding_ids = unique_ids([item.id for item in self.findings], "Finding")
        unique_ids([item.id for item in self.actions], "Action")
        observations = {item.id: item for item in self.observations}
        for item in [*self.observations, *self.exercise_records]:
            if item.mission_day > self.mission_day or item.source_id not in source_ids:
                raise ValueError("Snapshot records cannot be future-dated or lack a source.")
        for item in self.observations:
            if item.baseline_observation_id:
                baseline = observations.get(item.baseline_observation_id)
                if (
                    baseline is None
                    or baseline.id == item.id
                    or baseline.value is None
                    or baseline.mission_day > item.mission_day
                    or baseline.indicator_id != item.indicator_id
                    or baseline.method != item.method
                    or baseline.statistic != item.statistic
                    or baseline.origin != item.origin
                ):
                    raise ValueError("The baseline must be available and comparable in context.")
        for finding in self.findings:
            if not set(finding.related_ids).issubset(observation_ids | exercise_ids):
                raise ValueError("A finding references a missing record.")
        for action in self.actions:
            if not set(action.related_finding_ids).issubset(finding_ids):
                raise ValueError("An action references a missing finding.")
        for item in [*self.findings, *self.actions, *self.claims]:
            if not set(item.source_ids).issubset(source_ids):
                raise ValueError("An evidence source is missing from the snapshot.")
        for item in [*self.findings, *self.actions]:
            if not set(item.claim_ids).issubset(claim_ids):
                raise ValueError("An evidence claim is missing from the snapshot.")
        if not set(self.scenario.source_ids).issubset(source_ids):
            raise ValueError("A scenario source is missing from the snapshot.")
        reviewed_claim_ids = set()
        if self.content_mode == "evidence_based":
            reviewed_claim_ids = {
                claim_id for item in [*self.findings, *self.actions] for claim_id in item.claim_ids
            }
            if any(action.review_status != "reviewed" for action in self.actions):
                raise ValueError("Evidence-based actions must be reviewed.")
        validate_claim_sources(self.claims, self.sources, reviewed_claim_ids)
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
        node_ids = unique_ids([node.id for node in self.nodes], "Graph node")
        unique_ids([edge.id for edge in self.edges], "Graph edge")
        source_ids = unique_ids([source.id for source in self.sources], "Graph source")
        claim_ids = unique_ids([claim.id for claim in self.claims], "Graph claim")
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
        reviewed_claim_ids = (
            {
                claim_id
                for edge in self.edges
                if edge.relation == "supported_by"
                for claim_id in edge.claim_ids
            }
            if self.content_mode == "evidence_based"
            else set()
        )
        validate_claim_sources(self.claims, self.sources, reviewed_claim_ids)
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

    @model_validator(mode="after")
    def validate_window(self) -> Self:
        """Validate clipping, sample order and the independent playback cursor."""
        if self.end_s <= self.start_s or self.end_s - self.start_s > 120:
            raise ValueError("Telemetry windows must span more than zero and at most 120 seconds.")
        effective_end = min(self.end_s, self.recording_end_s)
        times = [point.time_s for point in self.points]
        if times != sorted(set(times)):
            raise ValueError("Telemetry sample times must be ordered and unique.")
        if any(not self.start_s <= time < effective_end for time in times):
            raise ValueError("A telemetry sample lies outside the clipped window.")
        expected_next = effective_end if effective_end < self.recording_end_s else None
        if self.next_start_s != expected_next:
            raise ValueError("The playback cursor does not match the recording bounds.")
        return self


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


class HealthModule(ContractModel):
    """Describe the implemented and scientifically reviewed coverage of a module."""

    id: Annotated[str, Field(min_length=1)]
    version: Annotated[str, Field(min_length=1)]
    label: str
    region_ids: list[str]
    indicator_ids: list[str]
    implementation_status: Literal["planned", "prototype", "available"]
    interpretation_status: Literal["unavailable", "review_pending", "reviewed"]
    coverage_description: str
    limitations: list[str]


class ModuleCatalog(ContractModel):
    """Represent the versioned catalog of scientific modules."""

    catalog_version: Annotated[str, Field(min_length=1)]
    modules: list[HealthModule]


class KnowledgeBaseMetadata(ContractModel):
    """Describe the installed scientific corpus and its consultation limits."""

    corpus_version: Annotated[str, Field(min_length=1)]
    published_at: datetime
    last_sync_at: datetime | None
    runtime_mode: Literal["local_bundle", "hosted_catalog"]
    external_services_required_for_consultation: bool
    paper_count: Annotated[int, Field(ge=0, strict=True)]
    reviewed_paper_count: Annotated[int, Field(ge=0, strict=True)]
    analysis_policy: Literal["precomputed", "local_model", "not_configured"]
    rules_version: str | None


class PaperIdentifiers(ContractModel):
    """Represent stable identifiers available for a literature record."""

    doi: str | None
    pmid: str | None
    pmcid: str | None


class PaperAccess(ContractModel):
    """Describe remote and local access without implying full-text availability."""

    landing_url: str
    full_text_url: str | None
    pdf_url: str | None
    availability: Literal["open_access", "landing_only", "unknown"]
    license: str | None
    full_text_cached: bool
    pdf_cached: bool
    local_document_url: str | None


class PaperCard(ContractModel):
    """Represent a discovery card, not an audited evidence statement."""

    id: Annotated[str, Field(min_length=1)]
    title: str
    authors: list[str]
    year: Annotated[int, Field(ge=1800, strict=True)]
    identifiers: PaperIdentifiers
    sections: list[Literal["evidence", "scenario", "actions"]]
    region_ids: list[str]
    study_design: str | None
    environment: Literal[
        "spaceflight", "bed_rest", "terrestrial_exercise", "other", "mixed", "unknown"
    ]
    review_status: Literal["pending", "reviewed"]
    access: PaperAccess
    indicator_ids: list[str]


class Page(ContractModel):
    """Represent opaque cursor state for a page of results."""

    next_cursor: str | None
    has_more: bool


class PaperPage(ContractModel):
    """Represent one page of bibliographic discovery results."""

    corpus_version: Annotated[str, Field(min_length=1)]
    items: list[PaperCard]
    total_matching: Annotated[int, Field(ge=0, strict=True)]
    page: Page


class PaperSummary(ContractModel):
    """Describe whether a reviewed summary is available for a paper."""

    status: Literal["available", "pending", "unavailable"]
    text: str | None
    basis: Literal["full_text", "abstract", "metadata_only", "not_prepared"]
    method: Literal["editorial", "llm_assisted", "not_prepared"]
    review_status: Literal["pending", "reviewed"]
    source_locators: list[str]
    limitations: list[str]


class PaperStatistic(ContractModel):
    """Represent a reviewed quantitative extraction when one exists."""

    id: str
    outcome: str
    anatomy: str
    group_label: str
    timepoint_label: str
    sample_size: Annotated[int, Field(ge=1, strict=True)] | None
    value: float
    unit: str
    statistic_type: Literal["group_mean", "individual_value", "change_rate", "effect_estimate"]
    dispersion: dict[str, object] | None
    interval: dict[str, object] | None
    source_locator: str
    source_url: str
    extraction_review_status: Literal["pending", "reviewed"]
    limitations: list[str]


class PaperAnalysisItem(ContractModel):
    """Represent a traceable analysis item, including pending suggestions."""

    id: str
    kind: Literal["finding", "implication", "studied_intervention"]
    text: str
    source_locator: str
    source_excerpt: Annotated[str, Field(max_length=500)]
    review_status: Literal["pending", "reviewed"]
    limitations: list[str]


class PaperAnalysis(ContractModel):
    """Describe the state of optional abstract or full-text analysis."""

    status: Literal["not_requested", "queued", "running", "ready", "failed"]
    input_basis: Literal["abstract", "full_text", "not_prepared"]
    input_sha256: str | None
    prompt_version: str | None
    model_id: str | None
    generated_at: datetime | None
    items: list[PaperAnalysisItem]
    failure_reason: str | None


class PaperContextCheck(ContractModel):
    """Represent one contextual applicability dimension."""

    dimension: Literal[
        "measurement_method",
        "population",
        "environment",
        "exposure_duration",
        "measurement_timepoint",
        "available_resources",
    ]
    match: Literal["match", "mismatch", "unknown"]
    reason: str
    source_locators: list[str]


class PaperApplicability(ContractModel):
    """Keep individual applicability separate from bibliographic discovery."""

    assessment_id: str | None
    status: Literal[
        "not_evaluated",
        "context_match",
        "analog_only",
        "not_comparable",
        "insufficient_data",
    ]
    explanation: str
    considered_observation_ids: list[str]
    checks: list[PaperContextCheck]
    rule_id: str | None
    rule_version: str | None
    review_status: Literal["pending", "reviewed"]


class PaperDetail(ContractModel):
    """Represent a paper detail page without promoting candidate evidence."""

    paper: PaperCard
    abstract: str | None
    summary: PaperSummary
    population_description: str | None
    cohort_ids: list[str]
    cohort_overlap_status: Literal["unknown", "possible_overlap", "documented"]
    statistics: list[PaperStatistic]
    limitations: list[str]
    corpus_version: Annotated[str, Field(min_length=1)]
    analysis: PaperAnalysis
    applicability: PaperApplicability


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

    @model_validator(mode="after")
    def validate_bounds(self) -> Self:
        """Reject reversed model-domain bounds."""
        if self.min_reference_day > self.max_reference_day:
            raise ValueError("The model domain cannot end before it starts.")
        return self


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

    @model_validator(mode="after")
    def validate_duration(self) -> Self:
        """Require a positive recording interval."""
        if self.end_s <= self.start_s:
            raise ValueError("A recording must end after it starts.")
        return self


for model in tuple(globals().values()):
    if isinstance(model, type) and issubclass(model, ContractModel):
        model.model_rebuild()

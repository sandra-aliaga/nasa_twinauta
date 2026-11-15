"""Evaluate available records and persist independent illustrative snapshots."""

from copy import deepcopy
from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.catalog import health_modules, indicators, knowledge_base_metadata
from app.database import ActionState, AssessmentRecord, CaseRecord
from app.errors import DomainError, not_found
from app.graphs import build_graphs
from app.guidance import build_guidance, unavailable_guidance
from app.schemas import (
    Action,
    ActionUpdate,
    Assessment,
    AssessmentRequest,
    EvidenceContext,
    ExerciseRecord,
    Finding,
    Graph,
    Guidance,
    Observation,
    Source,
    Versions,
)
from app.simulation import reference_scenario


def create_assessment(session: Session, request: AssessmentRequest) -> Assessment:
    """Filter the case at the requested day and persist a frozen evaluation."""
    case = session.get(CaseRecord, request.case_id)
    if case is None:
        raise not_found("el caso")
    payload = case.payload
    if request.region_id not in {region["id"] for region in payload["regions"]}:
        raise not_found("la región")
    if request.mission_day > payload["case"]["duration_days"]:
        raise DomainError(422, "invalid_request", "El día solicitado queda fuera del caso.")

    observations = [
        Observation.model_validate(item)
        for item in payload["observations"]
        if item["mission_day"] <= request.mission_day
    ]
    exercises = [
        ExerciseRecord.model_validate(item)
        for item in payload["exercise_records"]
        if item["mission_day"] <= request.mission_day
    ]
    observations.sort(key=lambda item: (item.mission_day, item.id))
    exercises.sort(key=lambda item: (item.mission_day, item.id))
    now = datetime.now(UTC)
    findings, actions = record_findings(observations, exercises, now)
    available_count = sum(item.value is not None for item in observations)
    summary = (
        f"Caso ilustrativo: {available_count} valores disponibles y "
        f"{len(findings)} registros por revisar. No se infiere pérdida muscular ni riesgo clínico."
    )
    assessment = Assessment(
        assessment_id=str(uuid4()),
        case_id=request.case_id,
        region_id=request.region_id,
        mission_day=request.mission_day,
        content_mode="illustrative",
        status="partial" if observations or exercises else "insufficient_data",
        summary=summary,
        versions=Versions(
            rules="initial-0.1", evidence="pending-0.1", summary_template="initial-0.1"
        ),
        observations=observations,
        exercise_records=exercises,
        findings=findings,
        evidence_context=EvidenceContext(
            data_quality=["El caso y los registros de ejercicio son sintéticos."],
            evidence_applicability=["Las referencias candidatas no validan un caso individual."],
            model_limitations=["No hay un modelo científico habilitado ni una confianza numérica."],
        ),
        scenario=reference_scenario(request),
        actions=actions,
        sources=[Source.model_validate(item) for item in payload["sources"]],
        action_summary=(
            "Revisar información ausente; estas acciones son seguimiento editorial ilustrativo."
            if actions
            else "No se identificaron registros ausentes con una acción editorial disponible."
        ),
        created_at=now,
        claims=[],
    )
    graphs = build_graphs(assessment)
    guidance = build_guidance(
        assessment,
        health_modules(),
        knowledge_base_metadata().corpus_version,
        {item.id: item.label for item in indicators()},
    )
    session.add(
        AssessmentRecord(
            id=assessment.assessment_id,
            case_id=assessment.case_id,
            payload={
                **assessment.model_dump(mode="json"),
                "guidance": guidance.model_dump(mode="json"),
            },
            graphs={view: graph.model_dump(mode="json") for view, graph in graphs.items()},
            created_at=now,
        )
    )
    session.flush()
    for action in actions:
        session.add(
            ActionState(
                assessment_id=assessment.assessment_id,
                action_id=action.id,
                execution_status=action.execution_status,
                revision=0,
                updated_at=now,
            )
        )
    session.commit()
    return assessment


def record_findings(
    observations: list[Observation], exercises: list[ExerciseRecord], now: datetime
) -> tuple[list[Finding], list[Action]]:
    """Describe missing records without interpreting them as physiological decline."""
    findings = []
    actions = []
    missing_records = [
        (item.id, f"Falta una evaluación de {item.indicator_id}.")
        for item in observations
        if item.value is None
    ]
    missing_records.extend(
        (
            item.id,
            f"La sesión del día {item.mission_day} no tiene registro; puede haberse realizado.",
        )
        for item in exercises
        if item.record_status == "not_recorded"
    )
    for record_id, description in missing_records:
        finding_id = f"finding_{record_id}"
        findings.append(
            Finding(
                id=finding_id,
                title="Información por revisar",
                description=description,
                related_ids=[record_id],
                source_ids=["demo_seed"],
                attention="review_needed",
                claim_ids=[],
            )
        )
        actions.append(
            Action(
                id=f"review_{record_id}",
                title="Revisar el registro",
                rationale=description,
                requirements=["Mantener visible que este es un caso ilustrativo."],
                related_finding_ids=[finding_id],
                source_ids=["demo_seed"],
                review_status="pending",
                execution_status="pending",
                eligibility="eligible",
                eligibility_reason="Seguimiento editorial ilustrativo; no es una prescripción.",
                claim_ids=[],
                revision=0,
                updated_at=now,
            )
        )
    return findings, actions


def get_assessment(session: Session, assessment_id: str) -> Assessment:
    """Combine the immutable payload with current action tracking."""
    record = session.get(AssessmentRecord, assessment_id)
    if record is None:
        raise not_found("la evaluación")
    payload = deepcopy(record.payload)
    payload.pop("guidance", None)
    states = {
        state.action_id: state
        for state in session.scalars(
            select(ActionState).where(ActionState.assessment_id == assessment_id)
        )
    }
    for action in payload["actions"]:
        state = states[action["id"]]
        action.update(
            execution_status=state.execution_status,
            revision=state.revision,
            updated_at=state.updated_at,
        )
    return Assessment.model_validate(payload)


def get_guidance(session: Session, assessment_id: str) -> Guidance:
    """Read stored guidance; legacy records never trigger a fresh interpretation."""
    record = session.get(AssessmentRecord, assessment_id)
    if record is None:
        raise not_found("la evaluación")
    payload = record.payload.get("guidance")
    if payload is None:
        return unavailable_guidance(
            assessment_id, "Esta evaluación anterior no contiene orientación contextual guardada."
        )
    guidance = Guidance.model_validate(payload)
    if guidance.assessment_id != assessment_id:
        raise ValueError("Stored guidance belongs to a different assessment.")
    return guidance


def get_graph(session: Session, assessment_id: str, view: str) -> Graph:
    """Return graph content frozen with the original assessment."""
    record = session.get(AssessmentRecord, assessment_id)
    if record is None:
        raise not_found("la evaluación")
    return Graph.model_validate(record.graphs[view])


def update_action(
    session: Session, assessment_id: str, action_id: str, request: ActionUpdate
) -> Action:
    """Serialize tracking updates and reject stale revisions."""
    assessment = get_assessment(session, assessment_id)
    action = next((item for item in assessment.actions if item.id == action_id), None)
    if action is None:
        raise not_found("la acción")
    if action.eligibility != "eligible" or (
        assessment.content_mode == "evidence_based" and action.review_status != "reviewed"
    ):
        raise DomainError(409, "action_not_eligible", "La acción no está habilitada.")
    state = session.scalar(
        select(ActionState)
        .where(ActionState.assessment_id == assessment_id, ActionState.action_id == action_id)
        .with_for_update()
        .execution_options(populate_existing=True)
    )
    if state is None:
        raise not_found("el seguimiento de la acción")
    if state.revision != request.expected_revision:
        raise DomainError(409, "revision_conflict", "El seguimiento cambió; vuelve a consultarlo.")
    if state.execution_status != request.execution_status:
        state.execution_status = request.execution_status
        state.revision += 1
        state.updated_at = datetime.now(UTC)
    result = action.model_copy(
        update={
            "execution_status": state.execution_status,
            "revision": state.revision,
            "updated_at": state.updated_at,
        }
    )
    session.commit()
    return result

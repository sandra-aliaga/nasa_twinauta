"""HTTP adapters for the shared version 0.2 contract."""

from collections.abc import Iterator
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import assessments, catalog, papers, telemetry
from app.database import CaseRecord
from app.errors import not_found
from app.schemas import (
    Action,
    ActionUpdate,
    Assessment,
    AssessmentRequest,
    Case,
    Error,
    Graph,
    IndicatorDefinition,
    KnowledgeBaseMetadata,
    ModuleCatalog,
    PaperPage,
    Region,
    TelemetryRecording,
    TelemetryWindow,
)

router = APIRouter(
    prefix="/api/v1",
    responses={code: {"model": Error} for code in (404, 409, 422, 500)},
)


def get_session(request: Request) -> Iterator[Session]:
    """Open one transaction scope and roll back automatically on failure."""
    with Session(request.app.state.engine) as session:
        yield session


DatabaseSession = Annotated[Session, Depends(get_session)]


@router.get("/cases", response_model=list[Case], operation_id="list_cases")
def list_cases(session: DatabaseSession) -> list[Case]:
    """List cases installed by the explicit seed command."""
    return [
        Case.model_validate(record.payload["case"])
        for record in session.scalars(select(CaseRecord).order_by(CaseRecord.id))
    ]


@router.get("/indicators", response_model=list[IndicatorDefinition], operation_id="list_indicators")
def list_indicators() -> list[IndicatorDefinition]:
    """Describe the initial indicator catalog."""
    return list(catalog.indicators())


@router.get("/health-modules", response_model=ModuleCatalog, operation_id="list_health_modules")
def list_health_modules() -> ModuleCatalog:
    """Describe module coverage and keep scientific review status explicit."""
    return catalog.health_modules()


@router.get(
    "/knowledge-base/metadata",
    response_model=KnowledgeBaseMetadata,
    operation_id="get_knowledge_base_metadata",
)
def get_knowledge_base_metadata() -> KnowledgeBaseMetadata:
    """Describe the local literature bundle and its review status."""
    return catalog.knowledge_base_metadata()


@router.get("/papers", response_model=PaperPage, operation_id="search_papers")
def search_papers(
    session: DatabaseSession,
    q: Annotated[str | None, Query(max_length=200)] = None,
    region_id: str | None = None,
    view: Literal["evidence", "scenario", "actions"] | None = None,
    review_status: Literal["pending", "reviewed"] | None = None,
    year_from: Annotated[int | None, Query(ge=1800)] = None,
    year_to: Annotated[int | None, Query(ge=1800)] = None,
    cursor: str | None = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 25,
    indicator_id: str | None = None,
    module_id: str | None = None,
) -> PaperPage:
    """Search the local bibliographic candidate corpus."""
    return papers.search_papers(
        session,
        q=q,
        region_id=region_id,
        view=view,
        review_status=review_status,
        year_from=year_from,
        year_to=year_to,
        indicator_id=indicator_id,
        module_id=module_id,
        cursor=cursor,
        limit=limit,
    )


@router.get("/cases/{case_id}/regions", response_model=list[Region], operation_id="list_regions")
def list_regions(case_id: str, session: DatabaseSession) -> list[Region]:
    """Return semantic regions without assuming GLB mesh names."""
    record = session.get(CaseRecord, case_id)
    if record is None:
        raise not_found("el caso")
    return [Region.model_validate(item) for item in record.payload["regions"]]


@router.post(
    "/assessments", response_model=Assessment, status_code=201, operation_id="create_assessment"
)
def create_assessment(request: AssessmentRequest, session: DatabaseSession) -> Assessment:
    """Create a separate illustrative evaluation for this request."""
    return assessments.create_assessment(session, request)


@router.get(
    "/assessments/{assessment_id}", response_model=Assessment, operation_id="get_assessment"
)
def get_assessment(assessment_id: str, session: DatabaseSession) -> Assessment:
    """Retrieve the frozen evaluation and current action states."""
    return assessments.get_assessment(session, assessment_id)


@router.get(
    "/assessments/{assessment_id}/graphs/{view}", response_model=Graph, operation_id="get_graph"
)
def get_graph(
    assessment_id: str,
    view: Literal["evidence", "scenario", "actions"],
    session: DatabaseSession,
) -> Graph:
    """Retrieve one of the three saved graph projections."""
    return assessments.get_graph(session, assessment_id, view)


@router.patch(
    "/assessments/{assessment_id}/actions/{action_id}",
    response_model=Action,
    operation_id="update_action_status",
)
def update_action_status(
    assessment_id: str, action_id: str, request: ActionUpdate, session: DatabaseSession
) -> Action:
    """Update tracking with optimistic revision checking and a database row lock."""
    return assessments.update_action(session, assessment_id, action_id, request)


@router.get(
    "/telemetry/{recording_id}/metadata",
    response_model=TelemetryRecording,
    operation_id="get_recording_metadata",
)
def get_recording_metadata(recording_id: str) -> TelemetryRecording:
    """Describe a registered recording and its independent clock."""
    return telemetry.recording_metadata(recording_id)


@router.get(
    "/telemetry/{recording_id}",
    response_model=TelemetryWindow,
    operation_id="get_telemetry_window",
)
def get_telemetry_window(
    recording_id: str,
    start_s: Annotated[float, Query(ge=0)],
    end_s: Annotated[float, Query(gt=0)],
) -> TelemetryWindow:
    """Read a bounded segment without filling missing values."""
    return telemetry.recording_window(recording_id, start_s, end_s)

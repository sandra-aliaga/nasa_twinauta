"""Publish and read already-generated context without invoking an AI provider."""

import argparse
import json
from datetime import datetime
from hashlib import sha256
from pathlib import Path
from typing import Literal
from uuid import NAMESPACE_URL, uuid5

from pydantic import BaseModel, ConfigDict, model_validator
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import BACKEND_DIR, get_settings
from app.context_synthesis import ContextDraft, validate_context
from app.database import (
    ActionState,
    AssessmentRecord,
    CaseRecord,
    LiteraturePaperRecord,
    PreparedContextRecord,
    create_database_engine,
)
from app.errors import not_found
from app.graphs import build_graphs
from app.schemas import Assessment, GraphPage, Guidance


class ContextProvenance(BaseModel):
    model_config = ConfigDict(extra="forbid")
    input_sha256: str
    prompt_version: str
    model_id: str
    corpus_version: str


class EvidenceSnippet(BaseModel):
    model_config = ConfigDict(extra="forbid")
    paper_id: str
    excerpt: str
    locator: Literal["abstract"]


class AssessmentContext(BaseModel):
    """Describe content availability independently of scientific review metadata."""

    model_config = ConfigDict(extra="forbid")
    assessment_id: str
    status: Literal["available", "unavailable"]
    reason: str | None
    sections: ContextDraft | None
    graphs: dict[Literal["evidence", "scenario", "actions"], GraphPage]
    evidence_snippets: dict[str, EvidenceSnippet]
    guidance: Guidance | None
    provenance: ContextProvenance | None
    review_status: Literal["pending", "reviewed"]
    clinical_action_eligible: Literal[False] = False

    @model_validator(mode="after")
    def check_availability(self) -> "AssessmentContext":
        if self.status == "available":
            if (
                self.sections is None
                or self.guidance is None
                or self.provenance is None
                or set(self.graphs) != {"evidence", "scenario", "actions"}
            ):
                raise ValueError(
                    "Available context requires three sections, graphs and provenance."
                )
            if self.guidance.assessment_id != self.assessment_id:
                raise ValueError("Context guidance belongs to another assessment.")
            for view, graph in self.graphs.items():
                if (
                    graph.assessment_id != self.assessment_id
                    or graph.view != view
                    or graph.corpus_version != self.provenance.corpus_version
                ):
                    raise ValueError("Context graph version or assessment differs.")
        elif (
            self.sections is not None
            or self.guidance is not None
            or self.provenance is not None
            or self.graphs
            or self.evidence_snippets
            or not self.reason
        ):
            raise ValueError("Unavailable context must explain absence without partial content.")
        return self


class AssessmentIndex(BaseModel):
    model_config = ConfigDict(extra="forbid")
    assessment_id: str
    case_id: str
    region_id: str
    mission_day: int
    created_at: datetime
    has_context: bool


def project_context(document: dict) -> AssessmentContext:
    """Expose prepared content without leaking preparation files or token accounting."""
    guidance = Guidance.model_validate(document["authoritative_guidance"])
    return AssessmentContext(
        assessment_id=document["assessment_id"],
        status="available",
        reason=None,
        sections=document["sections"],
        graphs=document["graphs"],
        evidence_snippets=document["evidence_snippets"],
        guidance=guidance,
        provenance=ContextProvenance(
            input_sha256=document["input_sha256"],
            prompt_version=document["prompt_version"],
            model_id=document["model_id"],
            corpus_version=guidance.corpus_version,
        ),
        review_status=document["review_status"],
    )


def get_context(session: Session, assessment_id: str) -> AssessmentContext:
    """Read the latest installed version; missing content never triggers generation."""
    if session.get(AssessmentRecord, assessment_id) is None:
        raise not_found("la evaluación")
    record = session.scalar(
        select(PreparedContextRecord)
        .where(PreparedContextRecord.assessment_id == assessment_id)
        .order_by(PreparedContextRecord.created_at.desc(), PreparedContextRecord.id.desc())
        .limit(1)
    )
    if record is not None:
        return project_context(record.payload)
    return AssessmentContext(
        assessment_id=assessment_id,
        status="unavailable",
        reason="No hay una síntesis preparada para esta evaluación.",
        sections=None,
        graphs={},
        evidence_snippets={},
        guidance=None,
        provenance=None,
        review_status="pending",
    )


def list_assessments(session: Session, case_id: str) -> list[AssessmentIndex]:
    """Discover installed evaluations without requiring hardcoded demo identifiers."""
    if session.get(CaseRecord, case_id) is None:
        raise not_found("el caso")
    rows = session.scalars(
        select(AssessmentRecord)
        .where(AssessmentRecord.case_id == case_id)
        .order_by(AssessmentRecord.created_at.desc(), AssessmentRecord.id)
    )
    return [
        AssessmentIndex(
            assessment_id=row.id,
            case_id=row.case_id,
            region_id=row.payload["region_id"],
            mission_day=row.payload["mission_day"],
            created_at=row.created_at,
            has_context=session.scalar(
                select(PreparedContextRecord.id)
                .where(PreparedContextRecord.assessment_id == row.id)
                .limit(1)
            )
            is not None,
        )
        for row in rows
    ]


def load_context(directory: Path, assessment_path: Path) -> tuple[Assessment, dict]:
    """Bind the prepared narrative to its exact original assessment and inputs."""
    document = json.loads((directory / "context.json").read_bytes())
    manifest = json.loads((directory / "manifest.json").read_bytes())
    assessment = Assessment.model_validate_json(assessment_path.read_bytes())
    if (
        manifest["status"] != "ready_for_review"
        or document["assessment_id"] != assessment.assessment_id
        or document.get("clinical_action_eligible") is not False
    ):
        raise ValueError("Preparation does not match the selected assessment.")
    guidance = Guidance.model_validate(document["authoritative_guidance"])
    papers = [
        json.loads((directory / f"{paper_id}.json").read_bytes())
        for paper_id in manifest["paper_ids"]
    ]
    content = {
        "assessment": assessment.model_dump(mode="json"),
        "operational_guidance": guidance.model_dump(mode="json"),
        "papers": papers,
        "evidence_snippets": document["evidence_snippets"],
    }
    digest = sha256(json.dumps(content, sort_keys=True, ensure_ascii=False).encode()).hexdigest()
    if digest != document["input_sha256"]:
        raise ValueError("Assessment or preparation inputs changed since generation.")
    validate_context(
        ContextDraft.model_validate(document["sections"]),
        assessment,
        guidance,
        {paper["paper_id"]: paper["abstract"] for paper in papers},
        document["evidence_snippets"],
    )
    response = project_context(document)
    for view, graph in response.graphs.items():
        nodes = {node.id for node in graph.nodes}
        if (
            len(nodes) != len(graph.nodes)
            or len({edge.id for edge in graph.edges}) != len(graph.edges)
            or any(edge.source not in nodes or edge.target not in nodes for edge in graph.edges)
        ):
            raise ValueError("Prepared graph contains invalid endpoints or duplicate IDs.")
        section = getattr(
            response.sections,
            {
                "evidence": "alert_assessment",
                "scenario": "inaction_scenario",
                "actions": "next_steps",
            }[view],
        )
        cited = {citation.paper_id for citation in section.citations}
        if {node.paper_id for node in graph.nodes if node.kind == "paper"} != cited:
            raise ValueError("Graph paper nodes differ from the narrative citations.")
    return assessment, document


def install_context(session: Session, assessment: Assessment, document: dict) -> str:
    """Add a context version and its original snapshot without replacing history."""
    if session.get(CaseRecord, assessment.case_id) is None:
        raise ValueError("Install the source case before its assessment context.")
    for paper_id in {item["paper_id"] for item in document["evidence_snippets"].values()}:
        paper = session.get(LiteraturePaperRecord, paper_id)
        if paper is None:
            raise ValueError("Referenced paper is not installed.")
        for snippet in document["evidence_snippets"].values():
            if snippet["paper_id"] == paper_id and " ".join(
                snippet["excerpt"].split()
            ) not in " ".join((paper.abstract_text or "").split()):
                raise ValueError("Installed abstract differs from the prepared context.")
    row = session.get(AssessmentRecord, assessment.assessment_id, with_for_update=True)
    original = assessment.model_dump(mode="json")
    if row is None:
        payload = {**original, "guidance": document["authoritative_guidance"]}
        session.add(
            AssessmentRecord(
                id=assessment.assessment_id,
                case_id=assessment.case_id,
                payload=payload,
                graphs={
                    view: graph.model_dump(mode="json")
                    for view, graph in build_graphs(assessment).items()
                },
                created_at=assessment.created_at,
            )
        )
        session.flush()
        for action in assessment.actions:
            session.add(
                ActionState(
                    assessment_id=assessment.assessment_id,
                    action_id=action.id,
                    execution_status=action.execution_status,
                    revision=action.revision,
                    updated_at=action.updated_at,
                )
            )
    elif {key: value for key, value in row.payload.items() if key != "guidance"} != original:
        raise ValueError("An existing assessment with this ID has different contents.")
    record_id = str(uuid5(NAMESPACE_URL, json.dumps(document, sort_keys=True)))
    result = session.execute(
        insert(PreparedContextRecord)
        .values(id=record_id, assessment_id=assessment.assessment_id, payload=document)
        .on_conflict_do_nothing(index_elements=[PreparedContextRecord.id])
    )
    return "installed" if result.rowcount else "already_installed"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    parser.add_argument(
        "--assessment", type=Path, default=BACKEND_DIR / "data/demo/assessment.json"
    )
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    engine = None
    try:
        assessment, document = load_context(args.directory, args.assessment)
        status = "preview"
        if args.execute:
            engine = create_database_engine(get_settings())
            with Session(engine) as session, session.begin():
                status = install_context(session, assessment, document)
        print(
            json.dumps(
                {"assessment_id": assessment.assessment_id, "status": status, "provider_calls": 0}
            )
        )
    except (OSError, ValueError, KeyError, TypeError, SQLAlchemyError) as error:
        parser.exit(1, f"Context import unavailable: {type(error).__name__}.\n")
    finally:
        if engine is not None:
            engine.dispose()


if __name__ == "__main__":
    main()

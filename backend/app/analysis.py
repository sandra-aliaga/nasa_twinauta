"""Provider-neutral analysis boundaries for bibliographic candidates."""

from hashlib import sha256
from typing import Protocol

from app.database import LiteraturePaperRecord
from app.schemas import PaperAnalysis, PaperAnalysisItem


class AnalysisProvider(Protocol):
    """Define the backend-only contract for a future analysis provider."""

    provider_id: str

    def analyze(self, *, paper_id: str, text: str, input_basis: str) -> list[PaperAnalysisItem]:
        """Return traceable candidate items without changing their review status."""


def analysis_for_paper(record: LiteraturePaperRecord) -> PaperAnalysis:
    """Return a deterministic no-provider state with input provenance."""
    if not record.abstract_text:
        return PaperAnalysis(
            status="not_requested",
            input_basis="not_prepared",
            input_sha256=None,
            prompt_version=None,
            model_id=None,
            generated_at=None,
            items=[],
            failure_reason=None,
        )
    digest = sha256(record.abstract_text.encode("utf-8")).hexdigest()
    return PaperAnalysis(
        status="not_requested",
        input_basis="abstract",
        input_sha256=digest,
        prompt_version=None,
        model_id=None,
        generated_at=None,
        items=[],
        failure_reason=None,
    )

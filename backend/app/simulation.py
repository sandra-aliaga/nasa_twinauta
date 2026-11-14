"""Represent the boundary of the pending scientific model."""

from uuid import uuid4

from app.schemas import AssessmentRequest, Scenario


def reference_scenario(request: AssessmentRequest) -> Scenario:
    """Return an explicit unavailable result until a reviewed model is integrated."""
    return Scenario(
        id=str(uuid4()),
        status="insufficient_data",
        label="Evolución de referencia pendiente",
        model_id=None,
        model_version=None,
        horizon_days=request.horizon_days,
        unit="percent_baseline",
        reason="El modelo y sus parámetros todavía no están habilitados.",
        assumptions=["El día de misión no equivale a un día de reposo en cama."],
        points=[],
        source_ids=["bedrest_2020"],
        summary="No se calcula una trayectoria hasta completar la revisión científica.",
        reference_start_day=request.reference_start_day,
        parameters=[],
        domain=None,
    )

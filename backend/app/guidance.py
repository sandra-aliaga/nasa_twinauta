"""Build descriptive module guidance without clinical thresholds or remote calls."""

from datetime import datetime

from app.schemas import Assessment, Guidance, GuidanceStep, ModuleCatalog

RULES_VERSION = "operational-0.1"


def unavailable_guidance(
    assessment_id: str, reason: str, created_at: datetime | None = None
) -> Guidance:
    """Represent absent historical guidance without recalculating it on GET."""
    return Guidance(
        assessment_id=assessment_id,
        module_id=None,
        module_version=None,
        status="not_supported",
        attention="unknown",
        summary=reason,
        reason=reason,
        observation_ids=[],
        paper_ids=[],
        applicability=[],
        steps=[],
        limitations=["No se generó una interpretación clínica."],
        corpus_version=None,
        rules_version=None,
        created_at=created_at,
    )


def proposed_step(rule_id: str, title: str, description: str) -> GuidanceStep:
    """Keep draft operational proposals separate from approved actions."""
    return GuidanceStep(
        id=rule_id,
        title=title,
        description=description,
        kind="operational_review",
        eligibility="unknown",
        eligibility_reason="Propuesta operativa pendiente de revisión; no prescribe ejercicio.",
        rule_id=rule_id,
        rule_version=RULES_VERSION,
        paper_ids=[],
        review_status="pending",
    )


def build_guidance(
    assessment: Assessment,
    modules: ModuleCatalog,
    corpus_version: str,
    indicator_labels: dict[str, str],
) -> Guidance:
    """Inspect available data and resources for exactly one supported module."""
    matches = [module for module in modules.modules if assessment.region_id in module.region_ids]
    if len(matches) != 1:
        reason = (
            "La región no tiene un módulo implementado."
            if not matches
            else "La región tiene varios módulos; falta una selección explícita."
        )
        return unavailable_guidance(assessment.assessment_id, reason, assessment.created_at)
    module = matches[0]
    if module.implementation_status == "planned":
        return unavailable_guidance(
            assessment.assessment_id,
            "El módulo de la región todavía no está implementado.",
            assessment.created_at,
        )
    observations = [
        item for item in assessment.observations if item.indicator_id in module.indicator_ids
    ]
    latest = {}
    for item in sorted(observations, key=lambda item: (item.mission_day, item.id)):
        latest[item.indicator_id] = item
    missing = [
        indicator
        for indicator in module.indicator_ids
        if indicator not in latest or latest[indicator].value is None
    ]
    reasons = []
    steps = []
    status = "review_pending"
    if missing:
        status = "insufficient_data"
        reasons.append(
            "Faltan valores disponibles para: "
            + ", ".join(indicator_labels.get(item, item) for item in missing)
            + "."
        )
        steps.append(
            proposed_step(
                "confirm_measurements",
                "Revisar las evaluaciones disponibles",
                "Confirmar qué valores faltan y conservar método, unidad y basal al registrarlos.",
            )
        )
    absent_baselines = [
        indicator
        for indicator, item in latest.items()
        if item.value is not None
        and item.statistic == "individual_value"
        and item.baseline_observation_id is None
    ]
    if absent_baselines:
        status = "insufficient_data"
        reasons.append(
            "No hay un basal individual declarado para: "
            + ", ".join(indicator_labels.get(item, item) for item in absent_baselines)
            + "."
        )
        steps.append(
            proposed_step(
                "confirm_baseline",
                "Confirmar el basal",
                "Identificar una evaluación basal compatible antes de interpretar cambios individuales.",
            )
        )
    incompatible = False
    for indicator in module.indicator_ids:
        history = [
            item
            for item in sorted(observations, key=lambda item: (item.mission_day, item.id))
            if item.indicator_id == indicator and item.value is not None
        ]
        if len(history) < 2:
            continue
        first, last = history[-2:]
        if (first.method, first.unit, first.statistic, first.origin) != (
            last.method,
            last.unit,
            last.statistic,
            last.origin,
        ):
            incompatible = True
            label = indicator_labels.get(indicator, indicator)
            reasons.append(f"Las últimas evaluaciones de {label} no son comparables.")
    if incompatible:
        status = "insufficient_data"
        steps.append(
            proposed_step(
                "check_protocol",
                "Confirmar comparabilidad",
                "Revisar métodos, unidades, tipo de estadístico y procedencia antes de comparar.",
            )
        )
    if any(item.quality == "suspect" for item in latest.values()):
        status = "insufficient_data"
        reasons.append("Hay mediciones cuya calidad requiere revisión.")
        steps.append(
            proposed_step("check_quality", "Revisar calidad", "Confirmar las mediciones señaladas.")
        )
    if any(item.record_status == "not_recorded" for item in assessment.exercise_records):
        reasons.append("Hay sesiones sin confirmar; esto no demuestra que no se realizaron.")
        steps.append(
            proposed_step(
                "confirm_exercise", "Confirmar el registro", "Revisar las sesiones sin registro."
            )
        )
        if status == "review_pending":
            status = "partial"
    if any(item.equipment_available is False for item in assessment.exercise_records):
        reasons.append(
            "El registro incluye equipo no disponible; falta confirmar su estado actual."
        )
        steps.append(
            proposed_step(
                "review_equipment",
                "Revisar equipo y plan",
                "Confirmar disponibilidad y solicitar revisión del plan autorizado si corresponde.",
            )
        )
        if status == "review_pending":
            status = "partial"
    reasons.append(
        "La interpretación fisiológica y las acciones siguen pendientes de reglas revisadas."
    )
    return Guidance(
        assessment_id=assessment.assessment_id,
        module_id=module.id,
        module_version=module.version,
        status=status,
        attention="review_needed" if steps else "unknown",
        summary=" ".join(reasons),
        reason=" ".join(reasons),
        observation_ids=[item.id for item in observations],
        paper_ids=[],
        applicability=[],
        steps=steps,
        limitations=[
            *module.limitations,
            "Comprobaciones operativas, sin umbrales ni clasificación clínica.",
            "Los registros sintéticos no representan mediciones de astronautas reales.",
            "Un cambio numérico o día de misión no demuestra equivalencia con reposo en cama.",
            "La comparación longitudinal y la aplicabilidad de papers requieren reglas revisadas.",
        ],
        corpus_version=corpus_version,
        rules_version=RULES_VERSION,
        created_at=assessment.created_at,
    )

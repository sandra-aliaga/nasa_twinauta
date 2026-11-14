"""Read bounded windows without interpolating missing samples."""

from math import isfinite

from app import catalog
from app.errors import DomainError, not_found
from app.schemas import TelemetryRecording, TelemetryWindow


def recording_metadata(recording_id: str) -> TelemetryRecording:
    """Resolve the recording before playback."""
    metadata = catalog.recording()
    if recording_id != metadata.recording_id:
        raise not_found("la grabación")
    return metadata


def recording_window(recording_id: str, start_s: float, end_s: float) -> TelemetryWindow:
    """Return requested limits and samples clipped at the recording end."""
    metadata = recording_metadata(recording_id)
    if not isfinite(start_s) or not isfinite(end_s) or start_s < 0 or end_s <= start_s:
        raise DomainError(422, "invalid_window", "La ventana de tiempo no es válida.")
    if end_s - start_s > metadata.max_window_seconds:
        raise DomainError(422, "invalid_window", "La ventana supera los 120 segundos.")
    effective_end = min(end_s, metadata.end_s)
    points = [
        point for point in catalog.telemetry().points if start_s <= point.time_s < effective_end
    ]
    if len(points) > metadata.max_points:
        raise DomainError(422, "invalid_window", "Solicita una ventana más pequeña.")
    return catalog.telemetry().model_copy(
        update={
            "start_s": start_s,
            "end_s": end_s,
            "points": points,
            "recording_end_s": metadata.end_s,
            "next_start_s": effective_end if effective_end < metadata.end_s else None,
        }
    )

"""Domain errors shared by the API and application services."""


class DomainError(Exception):
    """Describe an expected failure using the public error contract."""

    def __init__(
        self, status_code: int, code: str, message: str, details: list[str] | None = None
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details or []


def not_found(entity: str) -> DomainError:
    """Create a consistent missing-resource error."""
    return DomainError(404, "not_found", f"No se encontró {entity}.")

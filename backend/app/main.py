"""Create the FastAPI service and normalize public error responses."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from starlette.exceptions import HTTPException

from app.api import router
from app.config import Settings, get_settings
from app.database import create_database_engine
from app.errors import DomainError
from app.schemas import Error

logger = logging.getLogger(__name__)


def error_response(status_code: int, code: str, message: str, details: list[str]) -> JSONResponse:
    """Serialize the agreed error shape without internal exception messages."""
    return JSONResponse(
        status_code=status_code,
        content=Error(code=code, message=message, details=details).model_dump(),
    )


def create_app(settings: Settings | None = None) -> FastAPI:
    """Configure routes, lazy PostgreSQL connections, CORS and error handling."""
    settings = settings or get_settings()
    engine = create_database_engine(settings)

    @asynccontextmanager
    async def lifespan(application: FastAPI):
        yield
        engine.dispose()

    application = FastAPI(
        title="TwinNauta API",
        version="0.3.0",
        description="Backend inicial con contenido ilustrativo; sin modelo clínico habilitado.",
        lifespan=lifespan,
    )
    application.openapi_version = "3.1.2"
    application.state.engine = engine
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["GET", "POST", "PATCH"],
        allow_headers=["Content-Type"],
    )
    application.include_router(router)

    @application.exception_handler(DomainError)
    async def handle_domain_error(request: Request, error: DomainError) -> JSONResponse:
        logger.info("Domain error: %s", error.code)
        return error_response(error.status_code, error.code, error.message, error.details)

    @application.exception_handler(RequestValidationError)
    async def handle_validation_error(
        request: Request, error: RequestValidationError
    ) -> JSONResponse:
        details = [
            ".".join(str(part) for part in item["loc"]) + ": " + item["msg"]
            for item in error.errors()
        ]
        return error_response(422, "invalid_request", "La solicitud no es válida.", details)

    @application.exception_handler(HTTPException)
    async def handle_http_error(request: Request, error: HTTPException) -> JSONResponse:
        response = error_response(error.status_code, "http_error", "Solicitud no disponible.", [])
        if error.headers:
            response.headers.update(error.headers)
        return response

    @application.exception_handler(SQLAlchemyError)
    async def handle_database_error(request: Request, error: SQLAlchemyError) -> JSONResponse:
        logger.error("Database operation failed: %s", type(error).__name__)
        return error_response(500, "database_error", "No se pudo completar la operación.", [])

    @application.exception_handler(Exception)
    async def handle_unexpected_error(request: Request, error: Exception) -> JSONResponse:
        logger.error("Unexpected application error: %s", type(error).__name__)
        return error_response(500, "internal_error", "Ocurrió un error interno.", [])

    @application.get("/health/live", tags=["health"])
    def liveness() -> dict[str, str]:
        """Confirm that the HTTP process is responding."""
        return {"status": "ok"}

    @application.get("/health/ready", tags=["health"])
    def readiness() -> JSONResponse:
        """Check database connectivity and the presence of migrated, seeded tables."""
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT id FROM demo_cases LIMIT 1"))
                connection.execute(text("SELECT id FROM assessments LIMIT 1"))
                connection.execute(text("SELECT action_id FROM action_states LIMIT 1"))
                connection.execute(text("SELECT id FROM literature_papers LIMIT 1"))
                connection.execute(text("SELECT summary FROM literature_analyses LIMIT 1"))
                connection.execute(text("SELECT id FROM prepared_contexts LIMIT 1"))
        except SQLAlchemyError as error:
            logger.error("Readiness check failed: %s", type(error).__name__)
            return error_response(
                503, "not_ready", "PostgreSQL o el esquema no están disponibles.", []
            )
        return JSONResponse({"status": "ready"})

    return application


app = create_app()

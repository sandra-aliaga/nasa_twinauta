"""Read backend configuration without exposing database credentials."""

from pathlib import Path

from pydantic import SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    """Load PostgreSQL and browser-origin settings from the environment."""

    model_config = SettingsConfigDict(env_file=BACKEND_DIR / ".env", extra="ignore")

    database_url: SecretStr = SecretStr(
        "postgresql+psycopg://twinauta:twinauta@localhost:5432/twinauta"
    )
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    @field_validator("database_url")
    @classmethod
    def normalize_database_url(cls, value: SecretStr) -> SecretStr:
        """Accept provider URLs while selecting the psycopg driver explicitly."""
        url = value.get_secret_value()
        for prefix in ("postgres://", "postgresql://"):
            if url.startswith(prefix):
                url = "postgresql+psycopg://" + url[len(prefix) :]
                break
        if not url.startswith("postgresql+psycopg://"):
            raise ValueError("DATABASE_URL must identify a PostgreSQL database.")
        return SecretStr(url)


def get_settings() -> Settings:
    """Build settings when the application or CLI starts."""
    return Settings()

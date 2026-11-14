.PHONY: install run migrate seed format format-check lint check

install:
	cd backend && uv sync

run:
	cd backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

migrate:
	cd backend && uv run alembic upgrade head

seed:
	cd backend && uv run python -m app.seed

format:
	cd backend && uv run ruff format app migrations

format-check:
	cd backend && uv run ruff format --check app migrations

lint:
	cd backend && uv run ruff check app migrations

check: format-check lint

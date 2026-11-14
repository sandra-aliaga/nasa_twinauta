.PHONY: install run migrate seed format format-check lint check backend-install backend-run backend-format backend-check frontend-install frontend-run frontend-format frontend-check

install: backend-install frontend-install

backend-install:
	cd backend && uv sync

frontend-install:
	cd frontend && npm install

run: backend-run

backend-run:
	cd backend && uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

frontend-run:
	cd frontend && npm run dev

migrate:
	cd backend && uv run alembic upgrade head

seed:
	cd backend && uv run python -m app.seed

backend-format:
	cd backend && uv run ruff format app migrations

frontend-format:
	cd frontend && npm run format

format: backend-format frontend-format

format-check:
	cd backend && uv run ruff format --check app migrations
	cd frontend && npm run format:check

lint:
	cd backend && uv run ruff check app migrations

backend-check:
	cd backend && uv run ruff format --check app migrations
	cd backend && uv run ruff check app migrations

frontend-check:
	cd frontend && npm run format:check
	cd frontend && npm run build

check: backend-check frontend-check

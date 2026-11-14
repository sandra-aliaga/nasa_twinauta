# Backend inicial

Responsable: Sandra. FastAPI, Pydantic, SQLAlchemy, psycopg y PostgreSQL. Implementa las nueve operaciones del [contrato 0.2](../contracts/README.md) con contenido ilustrativo.

## Alcance

Catálogos, evaluaciones independientes filtradas hasta el día solicitado, tres vistas de grafo, seguimiento de acciones con revisión y bloqueo de fila, CORS y errores estructurados. La primera migración conserva casos e instantáneas como JSONB con relaciones y seguimiento de acciones separado.

El modelo científico sigue pendiente: los escenarios devuelven `insufficient_data`. La telemetría es una señal **sintética de tres segundos**, no datos de PhysioNet. No hay prescripción médica ni IA redactora. Los datos iniciales están en `data/demo/`, separados de los ejemplos documentales.

## Instalación y arranque

Requisitos: Python 3.12 o posterior compatible con el manifest, uv y PostgreSQL. Ejecutar Make desde la raíz del repositorio.

1. Crear una base PostgreSQL y un usuario propios, o utilizar los provistos por el servicio de nube. El backend no crea usuarios ni bases automáticamente.
2. Copiar `backend/.env.example` a `backend/.env` y ajustar `DATABASE_URL`. Las credenciales del ejemplo son públicas y ficticias. Se admiten URLs `postgres://`, `postgresql://` y `postgresql+psycopg://`.
3. Ejecutar:

```bash
make backend-install
make migrate
make seed
make backend-run
```

La carga inicial es explícita y no sobrescribe un caso existente. La instalación requiere acceso al registro Python. No se creó un lockfile de Python porque la resolución quedó bloqueada por DNS en esta sesión.

Después de arrancar, la documentación estará en `http://localhost:8000/docs` y la API en `/api/v1`. `/health/live` comprueba el proceso y `/health/ready` la conexión y las tablas PostgreSQL. Indicadores y telemetría no requieren la base; casos y evaluaciones sí.

CORS admite inicialmente `http://localhost:5173` y `http://127.0.0.1:5173`. En nube, configurar `CORS_ORIGINS` como lista JSON de orígenes concretos. Las credenciales de PostgreSQL solo pertenecen al backend.

## Primer intercambio

```bash
curl http://localhost:8000/api/v1/cases
curl -X POST http://localhost:8000/api/v1/assessments \
  -H 'Content-Type: application/json' \
  --data-binary @contracts/examples/assessment-request.json
```

Conservar el `assessment_id` devuelto; los IDs documentales no son evaluaciones almacenadas. Cada solicitud crea una instantánea distinta. La consulta superpone el estado actual de acciones sin recalcular la evaluación histórica.

## Organización

- `app/main.py`, `api.py`, `errors.py`: aplicación, rutas y errores públicos.
- `app/schemas.py`: payloads y validaciones del contrato.
- `app/assessments.py`: evaluación editorial, persistencia y seguimiento.
- `app/graphs.py`, `simulation.py`: grafos y límite del modelo pendiente.
- `app/catalog.py`, `telemetry.py`: datos y reproducción de ventanas.
- `app/database.py`, `migrations/`: tablas PostgreSQL y migración inicial.
- `app/seed.py`: carga idempotente del caso ficticio.

## Formato y verificación

```bash
make backend-format
make backend-check
```

Se incluye Ruff y configuración de hooks locales; `prek install` requiere que el checkout permita escribir en `.git`. No se creó CI ni una suite de pruebas.

En esta sesión se comprobaron sintaxis y Ruff. También se validaron los modelos, los tres grafos y las ventanas mediante Pydantic disponible en caché, con Python 3.13; esto no equivale a ejecutar la API o PostgreSQL. No se comprobó todavía el arranque FastAPI ni las migraciones contra PostgreSQL: la descarga de dependencias Python falló por DNS. No presentar esos pasos como ejecutados.

Para nube, el proveedor sigue pendiente. Migrar y cargar datos antes de exponer la demo. Desde `backend/`, el comando base es `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000`; ajustar el puerto al proveedor y no usar `--reload`. Esta versión de integración usa contenido ficticio y no incluye autenticación.

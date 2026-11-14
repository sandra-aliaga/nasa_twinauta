# Backend inicial

Responsable: Sandra. FastAPI, Pydantic, SQLAlchemy, psycopg y PostgreSQL. Implementa las nueve operaciones del [contrato 0.2](../contracts/README.md) con contenido ilustrativo.

## Alcance

Catálogos, evaluaciones independientes filtradas hasta el día solicitado, tres vistas de grafo, seguimiento de acciones con revisión y bloqueo de fila, CORS y errores estructurados. La primera migración conserva casos e instantáneas como JSONB con relaciones y seguimiento de acciones separado.

Como primer paso de la propuesta 0.3, `GET /api/v1/health-modules` expone el catálogo versionado de cobertura técnica. `GET /api/v1/knowledge-base/metadata` describe el paquete local de 27 candidatos bibliográficos, `GET /api/v1/papers` permite buscarlos desde PostgreSQL, `GET /api/v1/papers/{paper_id}` abre una ficha con sus límites de revisión, análisis y aplicabilidad, y `GET /api/v1/knowledge-graph` muestra relaciones temáticas editoriales. El único módulo publicado es `quadriceps_health`, con `interpretation_status: review_pending`; estas rutas no habilitan cálculos ni recomendaciones científicas.

El modelo científico sigue pendiente: los escenarios devuelven `insufficient_data`. La telemetría admite la señal sintética inicial y una grabación independiente de PhysioNet; consultar la sección de telemetría. No hay prescripción médica ni IA redactora. Los datos iniciales del caso están en `data/demo/`, separados de los ejemplos documentales.

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

La carga inicial es explícita y no sobrescribe un caso existente. Las dependencias declaradas ya se resolvieron y `uv.lock` está disponible. La instalación inicial requiere acceso al registro Python o una caché completa.

Después de arrancar, la documentación estará en `http://localhost:8000/docs` y la API en `/api/v1`. `/health/live` comprueba el proceso y `/health/ready` la conexión y las tablas PostgreSQL. Indicadores y telemetría no requieren la base; casos y evaluaciones sí.

CORS admite inicialmente `http://localhost:5173` y `http://127.0.0.1:5173`. En nube, configurar `CORS_ORIGINS` como lista JSON de orígenes concretos. Las credenciales de PostgreSQL solo pertenecen al backend.

## Primer intercambio

```bash
curl http://localhost:8000/api/v1/cases
curl http://localhost:8000/api/v1/health-modules
curl http://localhost:8000/api/v1/knowledge-base/metadata
curl 'http://localhost:8000/api/v1/papers?q=quadriceps&limit=10'
curl http://localhost:8000/api/v1/papers/literature_pmid_33251515
curl 'http://localhost:8000/api/v1/knowledge-graph?view=evidence&limit=10'
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
- `data/demo/health-modules.json`: catálogo técnico versionado de módulos; no contiene reglas clínicas habilitadas.
- `data/literature/candidates/knowledge_base.json`: metadatos del corpus local; sus 27 registros siguen pendientes de auditoría de texto completo.
- `migrations/versions/0002_literature_candidates.py`: tabla separada para candidatos bibliográficos.
- `app/database.py`, `migrations/`: tablas PostgreSQL y migración inicial.
- `app/seed.py`: carga idempotente del caso ficticio.
- `app/prepare_data.py`: verificación de originales PhysioNet y extracción reproducible de una sesión terrestre, sin modificar la API ni cargar PostgreSQL.

## Preparación de datos reales

Desde `backend/`, con Python 3.12 o posterior, sin instalar dependencias adicionales:

```bash
python -m app.prepare_data --test-id 2_1
```

Comprueba los hashes oficiales de los originales y genera un CSV de 602 muestras con dos valores de HR ausentes, más un JSON de procedencia en `data/processed/physionet_treadmill_1.0.1/`. Conserva tiempos originales y filas de origen, sin interpolar ni convertirlos a días de misión. Consultar [artefactos preparados](data/processed/README.md).

## Telemetría terrestre disponible

La grabación real tiene ID `physionet_treadmill_1_0_1_2_1`, dataset `physionet_treadmill_1.0.1` y participante original `2` (prueba `2_1`). Se carga desde los archivos preparados, sin requerir PostgreSQL ni descargar datos durante una solicitud.

```bash
curl http://localhost:8000/api/v1/telemetry/physionet_treadmill_1_0_1_2_1/metadata
curl 'http://localhost:8000/api/v1/telemetry/physionet_treadmill_1_0_1_2_1?start_s=0&end_s=120'
```

El frontend debe conservar los metadatos y avanzar mediante `next_start_s` hasta recibir `null`. Cada ventana admite como máximo 120 segundos y 2000 puntos; conserva las marcas temporales irregulares y `null` con su motivo cuando falta HR. No se interpola ni se deriva una recomendación clínica. El último dato está en 1046 segundos. El extremo exclusivo de la grabación es el menor número de punto flotante superior, `1046.0000000000002`, para incluir esa muestra sin asumir una nueva medición o cadencia. Las ventanas solicitadas conservan sus límites; solo se recortan los puntos.

La respuesta declara `origin: human_dataset`, `context: terrestrial_exercise` y `content_mode: evidence_based`. La revisión de su `source` se limita a procedencia, versión, unidades y fidelidad del archivo; no acredita validez clínica ni respuesta en microgravedad. Incluye atribución a Mongin, García Romero y Alvero Cruz (2021), DOI y licencia CC BY-NC-SA 4.0 con enlace al original. El JSON de preparación conserva su estado histórico `pending`; no se modificó para simular una revisión clínica.

La señal `recording_illustrative_001` sigue disponible y el caso ficticio conserva ese ID. La grabación humana se consulta de forma independiente por el ID documentado: no se reemplazó la historia del astronauta virtual ni se añadió una operación de listado fuera del contrato. El cargador comprueba el SHA-256 del CSV derivado contra su procedencia y rechaza inconsistencias de tiempos, conteos o identificación.

Se verificaron las funciones y después las rutas HTTP con FastAPI y PostgreSQL aislado: recorrido íntegro de las 602 muestras, dos ausencias, límites, última muestra, 404/422 y compatibilidad sintética. `Source.review_status: reviewed` registra la comprobación técnica de procedencia, unidad y fidelidad de esta grabación; no una revisión clínica de recomendaciones. La ficha de preparación mantiene su estado histórico pendiente y no se sobrescribió. Ver [evidencia de ejecución](../docs/verificacion-backend.md).

## Formato y verificación

```bash
make backend-format
make backend-check
```

Se incluye Ruff y configuración de hooks locales; `prek install` requiere que el checkout permita escribir en `.git`. No se creó CI ni una suite de pruebas.

Se ejecutaron migración, seed doble, 31 llamadas HTTP y persistencia tras reinicio de API con PostgreSQL 18.6 y Python 3.12.12. `make backend-check`, hook backend y `uv lock --check` pasaron. La instancia de prueba ya se detuvo. Los detalles y límites están en [verificación local](../docs/verificacion-backend.md); esto no valida el modelo clínico ni los endpoints propuestos del explorador 0.3.

Para nube, el proveedor sigue pendiente. Migrar y cargar datos antes de exponer la demo. Desde `backend/`, el comando base es `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000`; ajustar el puerto al proveedor y no usar `--reload`. Esta versión de integración usa contenido ficticio y no incluye autenticación.

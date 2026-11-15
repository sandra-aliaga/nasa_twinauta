# Base compartida para frontend

Archivo actual: [twinauta-documentary-reviewed-20261115.dump](twinauta-documentary-reviewed-20261115.dump), formato custom de PostgreSQL 18.6. Usar PostgreSQL 18 y sus herramientas createdb, pg_restore y psql.

Incluye esquema `0005_prepared_contexts`, caso virtual, 27 papers, 26 resúmenes documentales publicados y 26 análisis anteriores conservados (52 filas), seis estadísticas agregadas, evaluación `assessment_demo_001`, seguimiento de su acción y contexto con las tres secciones/grafos. No incluye roles globales, contraseñas, .env, clave DeepSeek ni modelo 3D.

## Restauración en una base nueva

Desde la raíz del repositorio, con un usuario PostgreSQL propio que pueda crear bases (ejemplo: postgres):

```bash
createdb -h localhost -U postgres twinauta_frontend
pg_restore --host localhost --username postgres --dbname twinauta_frontend --no-owner --no-privileges --exit-on-error backups/twinauta-documentary-reviewed-20261115.dump
```

Si solicita contraseña, usar la de su instalación local, no la de Sandra. Si ese nombre ya existe, elegir otro nombre nuevo y usarlo también en la conexión. Estos comandos no borran bases existentes. No necesita crear el rol twinauta_app del origen.

Copiar backend/.env.example a backend/.env solo si aún no existe y configurar credenciales propias:

```dotenv
DATABASE_URL=postgresql+psycopg://postgres:TU_CLAVE_LOCAL@localhost:5432/twinauta_frontend
ANALYSIS_PROVIDER=disabled
```

Codificar caracteres reservados de la contraseña para la URL. No compartir el .env de Sandra. Las consultas usan contenido persistido; no necesitan clave de IA. Instalar las dependencias del backend según el README y ejecutar `make backend-run`.

El respaldo ya contiene migraciones y datos. No ejecutar initdb sobre la base ni repetir cargas para empezar. Futuras migraciones del código pueden aplicarse con `make migrate`.

## Comprobación

```bash
psql -h localhost -U postgres -d twinauta_frontend -c "SELECT version_num FROM alembic_version;"
psql -h localhost -U postgres -d twinauta_frontend -c "SELECT count(*) FROM literature_papers; SELECT count(*) FROM literature_analyses; SELECT count(*) FROM prepared_contexts;"
```

Resultados actuales: `0005_prepared_contexts`, 27, 52 y 1. Después abrir /docs y consultar `/api/v1/cases/virtual_case_001/assessments` y `/api/v1/assessments/assessment_demo_001/context`.

El respaldo anterior `twinauta-20261115.dump` se conserva. [verification.json](verification.json) registra su restauración real previa (26 análisis, antes de esta publicación): conteos y hashes de todas las tablas iguales al origen, y HTTP de contexto/resumen funcionando. Desde la raíz, comprobar integridad con `sha256sum -c backups/SHA256SUMS`.

Compartir también el código actualizado, [contrato vigente](../contracts/openapi.yaml) y [entrega frontend](../docs/ENTREGA_FRONTEND.md). El respaldo reproduce los datos; no instala el backend o la interfaz.

La publicación actual se verificó en PostgreSQL y por HTTP: [resultados](../docs/evidencia/revision-documental-verificacion.json) y [alcance documental](../docs/evidencia/revision-documental-2026-11-15.md). El nuevo dump se inspeccionó con `pg_restore --list`; no se ha realizado todavía una restauración independiente de este archivo nuevo. No requiere nuevas migraciones ni volver a llamar a DeepSeek.

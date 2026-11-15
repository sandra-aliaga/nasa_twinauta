# Verificación local del backend

Fecha: 14 de noviembre de 2026. Ticket BE-01. Entorno: Python 3.12.12 y PostgreSQL 18.6, con instancia aislada bajo `/tmp`. Los servicios de prueba se detuvieron al terminar; no se desplegó infraestructura.

## Resultados observados

- `uv sync`: dependencias declaradas instaladas y `backend/uv.lock` generado. No se cambió el manifest ni se añadieron dependencias de producto.
- Migración `0001_initial` aplicada a PostgreSQL. Seed ejecutado dos veces, con un solo caso final.
- 31 llamadas HTTP verificadas: salud, nueve operaciones, tres grafos, actualización de acción y conflicto de revisión 409, entradas inválidas 422, entidades inexistentes 404 y OpenAPI.
- Grabación `physionet_treadmill_1_0_1_2_1`: nueve ventanas recuperaron 602 muestras únicas, dos ausencias de frecuencia cardíaca y última muestra en 1046 segundos. Se preservó también la grabación sintética.
- Tras detener y reiniciar la API se recuperaron la misma evaluación y la acción `completed` con revisión 1, almacenadas en PostgreSQL.
- `make backend-check`, `prek run backend-check --files backend/app/recordings.py` y `uv lock --check`: aprobados durante esta ejecución.

## Evidencia y alcance

La evidencia original de ejecución se conservó en `/tmp/twinauta-be01.GDNTG0/http_results.json` y `check_http.py`, junto al directorio de PostgreSQL aislado. `/tmp` es temporal; este informe registra el resultado observado y Concord conserva la entrega. No se presentan esos archivos temporales como artefactos permanentes del repositorio.

Durante la prueba, la fuente cardíaca respondió `review_status: reviewed`. La revisión final de BE-03 conservó ese estado por la comprobación técnica de procedencia, unidades y fidelidad de telemetría efectivamente realizada. Se rectificó la indicación previa de cambiarlo a pendiente: no debe confundirse revisión técnica de esta fuente con aprobación clínica de afirmaciones o acciones. La ficha de preparación histórica no se sobrescribió. No se modificó el payload verificado por HTTP.

Estas verificaciones corresponden a las rutas actuales 0.2. Las cuatro rutas del explorador científico 0.3 son una propuesta documental y no se probaron como servicios existentes. Tampoco se comprobaron despliegue público, frontend completo, autonomía sin Internet o validez de un modelo clínico.

## Reproducción

Consultar `backend/README.md` para configurar una base PostgreSQL de desarrollo propia. Desde la raíz:

```bash
make backend-install
make migrate
make seed
make backend-run
```

Después ejecutar las operaciones del contrato contra ese servicio. La base aislada usada en la comprobación anterior no es un servicio permanente ni sustituye la configuración de cada integrante.

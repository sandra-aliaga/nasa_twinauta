# Publicación documental para la entrega

## Qué se revisó

Se contrastaron los 27 registros bibliográficos con una descarga oficial de PubMed E-utilities. Hay 26 abstracts y un registro sin abstract (PMID 41785029). Se prepararon 26 síntesis en español, con población, diseño y límites, mediante revisión documental asistida por IA. No es una revisión médica, una evaluación sistemática de calidad ni una validación clínica. La revisión completa de texto y suplementos del resto del corpus continúa pendiente.

Los originales están en `backend/data/literature/reviews/2026-11-15/pubmed.xml`. `release.json` identifica cada PMID, URL, hash del abstract, fecha, revisor, alcance y texto publicado. La fuente reproducible es `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=PMID&retmode=xml`, reemplazando PMID por el identificador. Los originales y las ejecuciones anteriores se conservan; la publicación no vuelve a consultar proveedores de IA.

## Correcciones y contraste

- Se reparó la limpieza HTML que podía eliminar resultados entre comparadores `<` y `>`. La publicación usa los abstracts XML originales, sin esa transformación destructiva.
- Se incorporaron las distinciones señaladas por las ocho verificaciones recibidas en `verificaciones-literatura/lote-3.json`: área, volumen, masa y fuerza no son intercambiables; muestras y número de estudios tampoco.
- La cifra de pérdida ósea de cadera del 4,59% de Konda 2019 no es un efecto combinado ni pérdida muscular de cadera. La síntesis nueva lo aclara.
- Los estudios de electroestimulación y de adultos mayores muestran conservación de algunas variables sin protección equivalente de fuerza. Los protocolos de prehabilitación de una sesión y cuatro sesiones tienen resultados distintos y no se presentan como equivalentes.
- Padilha 2026 presenta resultados diferentes según contexto y análisis: el beneficio de fuerza en reposo deja de ser significativo al incorporar dependencia entre resultados; en vuelo no hay efecto significativo combinado de fuerza/potencia. No se extrapola un beneficio universal desde el título.
- Se conserva como pendiente el mapa de solapamiento de cohortes. Publicaciones del programa NASA de 70 días y metaanálisis que incluyen esos trabajos no cuentan automáticamente como validaciones independientes.

## Cifras originales visibles

Se publican únicamente las seis extracciones documentales de `backend/data/literature/extractions/core-studies.json`, verificando los hashes de sus PDF originales:

| Estudio | Variable | Resultado publicado | Ubicación |
|---|---|---|---|
| Scott 2020, PMID 33251515 | Tasa de cambio de área de cuádriceps | −0,11 % del basal/día; n=9 | Suplemento, eTable 3, página PDF 8 |
| Scott 2020 | Tasa de cambio de área de sóleo | −0,33 % del basal/día; n=9 | Misma tabla |
| SPRINT 2024, PMID 38328821 | Torque de rodilla, BR | 200 ± 47 antes; 148 ± 42 N·m después; n=9 | Tabla 1, página impresa 1017 |
| SPRINT 2024 | Torque de rodilla, BRE | 211 ± 32 antes; 198 ± 27 N·m después; n=9 | Misma tabla |

Los ± son desviaciones estándar, no intervalos de confianza. Las tasas usan el basal como denominador, sin capitalización diaria. No hay curva diaria de torque ni conversión área→fuerza. Son resultados grupales de reposo en cama, no mediciones individuales de astronautas. Los supuestos y límites del análisis original permanecen en la ficha de extracción.

NASA ya dispone de investigación de contramedidas y modelos humanos; la publicación aporta acceso y explicación de evidencia. No afirma resolver MA-201 ni inventar gemelos digitales. Se conserva el contraste y las fuentes NASA en `core-studies.json` y `docs/revision-evidencia-nucleo.md`.

## Contrato y aplicación

No cambian campos ni rutas OpenAPI. Para fichas y resúmenes de literatura, `review_status: reviewed` significa revisión documental dentro del alcance descrito; las estadísticas usan `extraction_review_status: reviewed` con su localizador. No significa aprobación para diagnóstico, predicción o prescripción. La interfaz lo identifica como «revisión documental».

El contador de biblioteca se calcula desde PostgreSQL. El paquete bibliográfico estático y los ejemplos históricos siguen siendo candidatos, sin que su conteo se confunda con el de la base activa. El caso del astronauta sigue siendo sintético: no se inventan mediciones actuales para llenar el dashboard. La telemetría PhysioNet es terrestre y separada; su redistribución pública sigue pendiente de aclarar por discrepancia de licencia.

Las reglas clínicas, los coeficientes de simulación y las síntesis contextuales conservan sus estados de revisión separados. Esta entrega no elimina avisos pendientes correspondientes a tareas que no se revisaron.

## Reproducir en otra base

Con PostgreSQL migrado y el seed instalado, desde `backend/`:

```bash
.venv/bin/python -m app.publish_documentary_review
.venv/bin/python -m app.publish_documentary_review --apply
```

El primer comando valida y revierte una transacción de ensayo; necesita conexión a la base, pero no deja cambios. El segundo guarda de forma atómica. Repetir la misma versión no duplica análisis; alterar una versión publicada produce error y requiere una nueva versión. Se usan consultas SQLAlchemy parametrizadas; no hay SQL interpolado ni cambios de esquema. Los análisis previos conservan sus textos y hashes originales.

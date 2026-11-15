# Entrega frontend — API 0.3.0

Contrato vigente: [OpenAPI](../contracts/openapi.yaml). [Ejemplos de contexto](../contracts/examples/context.json). La [guía anterior](archive/ENTREGA_FRONTEND-20261114.md) y las propuestas históricas conservan el diseño previo; ante diferencias usar el contrato vigente. La compañera conserva todas las decisiones de interfaz y anatomía.

## Misma base y configuración

Restaurar [el respaldo](../backups/twinauta-20261115.dump) siguiendo [estas instrucciones](../backups/README.md), junto con el código actualizado. Incluye 27 papers, 26 resúmenes, evaluación demo y síntesis de tres secciones/grafos. Se comprobó restauración y HTTP en otra base. Para consultar contenido no necesita clave DeepSeek.

En frontend/.env:

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

En backend/.env configurar únicamente credenciales de su propia base. Swagger está en `/docs`. CORS permite localhost:5173 y 127.0.0.1:5173.

## Flujo de llamadas

1. `GET /cases` y `GET /cases/{case_id}/regions`: seleccionar caso y región semántica. El activo GLB sigue pendiente; sus mallas/puntos pertenecen al frontend.
2. `GET /cases/{case_id}/assessments`: descubrir evaluaciones por región/día y `has_context`. El respaldo incluye `assessment_demo_001`, cuádriceps, día 10. No hace falta fijar ese ID en el código.
3. `GET /assessments/{id}`: indicadores, ejercicio, procedencia y datos de esa instantánea.
4. `GET /assessments/{id}/context`: obtener los tres resúmenes, sus grafos, fragmentos y orientación operativa. No genera IA ni consume créditos.
5. `GET /papers/{paper_id}?assessment_id={id}`: abrir abstract, resumen, análisis y original.
6. `GET /knowledge-graph?view=evidence&paper_id={paper_id}&assessment_id={id}`: ampliar vecinos de un paper. Cambiar vista a scenario/actions. Sin paper_id explora el conjunto filtrado.

| Panel | Resumen | Grafo |
| --- | --- | --- |
| Fundamento de la alerta | sections.alert_assessment | graphs.evidence |
| Posibles consecuencias | sections.inaction_scenario | graphs.scenario |
| Siguientes pasos | sections.next_steps | graphs.actions |

Cada sección incluye `summary`, `uncertainty`, `observation_ids`, `step_ids` y `citations`. Una cita aporta paper_id/snippet_id: resolver el texto en `evidence_snippets[snippet_id]`, con su localizador. Resolver los pasos en `guidance.steps`, que conserva descripción, elegibilidad y regla. Provenance/versiones y review_status son metadatos del backend; frontend no calcula confianza numérica.

## Estados y errores

- `status: available`: mostrar contenido. Un grafo puede tener solo el resumen y cero papers si se fundamenta en datos del caso; no completar conexiones arbitrariamente.
- `status: unavailable`: HTTP 200, reason, sections nulo, graphs/evidence_snippets vacíos. Mostrar la evaluación y consultar `/assessments/{id}/guidance` como alternativa operativa. Nunca iniciar generación desde el navegador.
- `POST /assessments` crea otra instantánea y no hereda la síntesis demo. Hasta preparar contenido para el nuevo ID, su contexto estará no disponible. Cambiar día/datos no reutiliza una conclusión antigua.
- Recurso inexistente: 404; filtros inválidos: 422; cursor de otros filtros/versión: 409. Error común: code/message/details.
- Hay 27 papers y 26 resúmenes; el candidato sin abstract conserva resumen no disponible. No es un fallo del frontend.

## Grafos y expansión

Los grafos de `/context` y `/knowledge-graph` son **GraphPage**, con nodes/edges/page/counts/scope_description/corpus_version. Los primeros son citas congeladas de la síntesis; el explorador es un vecindario temático del corpus actual. Conservar basis, fuentes y revisión: cercanía, cantidad o una arista cites no prueban eficacia.

Al paginar, conservar assessment_id, view y filtros, cargar next_cursor y fusionar por node.id/edge.id hasta has_more false. No mezclar corpus_version diferentes. Limit cuenta papers; los temas pueden repetirse entre páginas. El vecindario no representa toda la literatura existente.

Las rutas anteriores `/assessments/{id}/graphs/{view}` conservan el formato **Graph**, diferente de GraphPage. Para los tres paneles nuevos usar los grafos de `/context`.

## Fronteras

Backend entrega contenido, condiciones, cálculos, unidades, estados y procedencia. Frontend presenta anatomía, incertidumbre, detalles, grafos, selección, carga, vacíos y errores. No incluir claves ni llamar a DeepSeek desde el navegador.

El caso es sintético; el módulo actual es cuádriceps. Torque ausente no es cero y un basal único no demuestra tamaño actual conservado. Los pasos actuales son comprobaciones de datos, sin pronóstico individual ni prescripción de carga.

La frecuencia cardíaca es independiente: grabación `physionet_treadmill_1_0_1_2_1`, tiempo en segundos y procedencia terrestre. No atribuirla al astronauta virtual.

Esta entrega deja API y datos listos. La implementación y comprobación visual del recorrido con la interfaz es el siguiente paso conjunto.

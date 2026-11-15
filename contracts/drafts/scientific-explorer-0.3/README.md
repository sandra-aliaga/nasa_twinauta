# Explorador científico — propuesta de contrato 0.3

Estado: **propuesta documentada, no implementada**. El backend actual sigue el contrato 0.2. Esta ampliación es aditiva: no sustituye los endpoints ni las instantáneas existentes. Frontend puede trabajar con los ejemplos locales mediante un adaptador separado y una etiqueta de demostración.

## Archivos

- [OpenAPI propuesto](openapi.yaml): seis operaciones nuevas bajo `/api/v1`.
- [JSON Schema](schemas.json): estructuras compartidas de papers, estadísticas, análisis de IA y grafo.
- [Ejemplos](examples.json): claves `papers`, `paper_details` (Trappe 2024 y Scott 2020), `graph_views` (una página por vista: `evidence`, `scenario`, `actions`), `graph_neighbors` (vecindario por `paper_id`), `knowledge_base`, `modules`, `guidance` y variantes `guidance_states`. Incluyen dos publicaciones reales, cuatro valores publicados de media/DE de torque (Trappe 2024) y dos resultados de Scott 2020 tomados de la ficha verificada `docs/evidencia/fichas/claim_bedrest_quadriceps_csa_rate.md`; todas las extracciones siguen pendientes de revisión de Medicina. No simulan respuestas de una IA ejecutada.
- [Decisiones de producto e investigación de herramientas](../../../docs/explorador-cientifico.md).

## Operaciones propuestas

| Operación | Uso en frontend |
| --- | --- |
| `GET /papers` | Buscar y filtrar el corpus publicado: palabras clave, región, vista, revisión y años. |
| `GET /papers/{paper_id}` | Abrir ficha, resumen, análisis, resultados cuantitativos y enlaces originales. |
| `GET /knowledge-graph` | Obtener una vista o ampliar el vecindario de un paper, con paginación. |
| `GET /knowledge-base/metadata` | Conocer versión, actualización y disponibilidad local del paquete científico. |
| `GET /health-modules` | Conocer módulos, regiones e indicadores cubiertos, y su estado de interpretación. |
| `GET /assessments/{assessment_id}/guidance` | Leer orientación contextual congelada, motivos, límites y pasos de la evaluación. |

## Módulos y orientación contextual

El motor se amplía por módulos con versión, regiones e indicadores propios. La fixture publica únicamente `quadriceps_health` como prototipo y con interpretación pendiente. `available` indica implementación técnica; `interpretation_status` informa la revisión científica por separado. Frontend descubre cobertura mediante el catálogo, no mediante las partes que dibuje el modelo 3D.

Los estados de orientación son `complete`, `partial`, `insufficient_data`, `not_supported` y `review_pending`. Describen cobertura y disponibilidad de interpretación, no severidad clínica. `attention` es informativa. El resultado conserva observaciones consideradas, papeles utilizados, condiciones de aplicabilidad, versiones y pasos con elegibilidad. No calcular atención o elegibilidad mediante un LLM sin reglas revisadas.

La orientación se materializa al crear una evaluación con la futura implementación 0.3, se guarda y se consulta sin regenerarla en GET. Las evaluaciones antiguas 0.2 que no la tengan devuelven `not_supported` con explicación de versión y sin inventar una instantánea. Un `assessment_id` inexistente devuelve 404. Una región sin módulo o datos insuficientes es un estado de dominio 200, no un diagnóstico ni un error de transporte.

`module_id`/`module_version` pueden ser nulos cuando no existe módulo. `created_at` nulo significa que no hay orientación materializada. Un paso `eligible` requiere regla, versión y revisión comprobadas; una intervención sugerida por IA comienza con elegibilidad `unknown` y revisión pendiente. Este recurso es de lectura: no añade un PATCH de ejecución paralelo al de acciones 0.2. El seguimiento debe reutilizar las acciones persistidas cuando se habilite la composición, manteniendo ambos recursos coherentes.

### Enlace entre pasos de orientación y acciones 0.2

Cada `GuidanceStep` tiene `action_id` (obligatorio, nullable). Reglas:

1. `action_id` no nulo debe ser el `id` de una `Action` presente en `actions` de la **misma** evaluación (`assessment_id`). Un identificador que no exista allí es un error de contrato del backend, no un estado de dominio; frontend lo muestra como enlace roto y no inventa la acción.
2. El paso refleja la `eligibility` y el `review_status` de la acción enlazada al materializarse. Si no coinciden, prevalece la acción 0.2 y la discrepancia es un error a corregir en backend.
3. La ejecución (`execution_status`, `revision`) vive solo en la acción 0.2 y se cambia con su `PATCH` y `expected_revision`. La orientación no copia ni modifica ese estado; frontend lo lee de la evaluación.
4. Un paso `studied_intervention` siempre tiene `action_id: null`: describe lo que investigó un paper y no es una acción habilitada.
5. Un paso `operational_review` sin acción persistida tiene `action_id: null` y se presenta como orientación de lectura, sin control de ejecución.

El ejemplo `guidance_states[4]` enlaza `step_review_session_log` con `action_log` de [`contracts/examples/assessment.json`](../../examples/assessment.json) (`assessment_demo_001`).

Las variantes documentales no establecen umbrales médicos. Permiten maquetar datos ausentes, método no comparable, restricción de equipo y región sin módulo. No declarar como sano un resultado que carece de datos o de módulo.

`view` conserva los nombres `evidence`, `scenario`, `actions`: estado/explicación, implicaciones/evolución y contramedidas/siguientes pasos. Es un mismo corpus con distintas vistas, no tres bibliotecas independientes. Estos endpoints exploran la biblioteca; los grafos ya guardados bajo `/assessments/{id}` siguen representando su instantánea. Un cambio de corpus no debe modificar retrospectivamente esas instantáneas.

## Reglas de consulta y paginación

- `q` busca en el corpus ya incorporado. No dispara scraping ni una búsqueda externa en cada interacción; la incorporación de nuevos papers pertenece al proceso de ingesta.
- `region_id` usa IDs semánticos acordados, inicialmente `quadriceps`. No asumir que el catálogo ampliado tiene resultados para todas las regiones del cuerpo.
- `indicator_id` y `module_id` filtran por identificadores publicados en sus catálogos. Indicador/módulo desconocidos devuelven 422; combinaciones conocidas sin papers producen una página vacía. `PaperCard.indicator_ids` es clasificación temática, no confirmación de aplicabilidad.
- `review_status` omitido incluye tanto candidatos pendientes como revisados, identificados claramente. Un candidato visible no queda autorizado como evidencia para una acción.
- `view` y años son opcionales; sin vista se consultan todas las secciones. `year_from > year_to`, región no reconocida, cursor mal formado o límite inválido: 422. `q` vacío equivale a omitirlo.
- `limit` es cantidad máxima de papers, por defecto 25 y máximo 100. No es un porcentaje de relevancia ni un límite del tamaño total de la biblioteca.
- `total_matching` y `papers_matching` son conteos del corpus para los filtros/vecindario consultados. No son el número total de publicaciones que existen en el mundo sobre ese tema.
- El cursor es opaco y conserva consulta, orden y `corpus_version`. Cursor de otra consulta o versión: 409 `cursor_conflict`; frontend reinicia esa búsqueda. Orden inicial propuesto: año descendente y luego ID, sin puntuación científica inventada.
- Una respuesta sin resultados devuelve listas vacías, conteos cero y `has_more: false`, no 404. Un paper o evaluación inexistente devuelve 404.
- Cada página gráfica incluye los nodos necesarios para resolver los extremos de sus aristas. Los conectores contextuales pueden repetir papers de páginas anteriores, pero cuentan dentro de `limit`. `papers_returned` cuenta papers distintos en esa respuesta; nodos de indicador/tema no cuentan como papers.
- Frontend fusiona páginas por `node.id` y `edge.id`, sin duplicarlos. No unir versiones de corpus diferentes; conservar la selección por ID.
- Sin `paper_id`, se explora el conjunto filtrado. Con `paper_id`, se obtienen ese paper y vecinos directos; los filtros se aplican a los papers candidatos y no se inventan relaciones para completar una página. El conjunto de vecindad puede estar incompleto: indicarlo en `scope_description`.
- `assessment_id`, cuando se proporciona, solo sitúa el contexto de una evaluación. La biblioteca sigue siendo una búsqueda actual y no sustituye su grafo congelado. No presentar todos los resultados de búsqueda como fundamento utilizado por esa evaluación.

## Papers, resúmenes e IA

- `abstract` es el texto obtenido del proveedor, cuando se dispone de él. `summary` es una elaboración identificada por base, método y revisión. No presentarlos como el mismo texto.
- La IA puede analizar abstracts para generar hallazgos, implicaciones y **contramedidas estudiadas candidatas**. `analysis.status` distingue no solicitado, en cola, procesando, listo y fallo; un fallo no produce contenido de sustitución inventado.
- Cada elemento de análisis conserva `source_locator`, fragmento de apoyo, limitaciones y revisión. La trazabilidad de la generación guarda hash de entrada, versión del prompt, modelo y fecha. La elección del proveedor sigue pendiente; no se ejecutó IA para producir los ejemplos.
- `ready` significa que terminó el procesamiento, no que Medicina revisó el contenido. Las sugerencias de IA se almacenan pendientes. El resumen puede estar disponible editorialmente aunque el análisis de IA no se haya solicitado.
- Las intervenciones extraídas son descripciones de lo que estudia el paper. Convertirlas en acciones aplicables al astronauta requiere reglas revisadas, condiciones y restricciones; el frontend no debe hacer esa conversión.
- La ingesta puede preparar/cachar el análisis por paper y versión de entrada. El navegador consulta el resultado; no recibe claves del proveedor ni llama directamente al modelo. Esta propuesta no añade un endpoint público de generación a demanda ni un flujo de gasto por visitante.
- Si solo hay abstract, declarar esa base. No fabricar detalles del protocolo, resultados de tablas, contraindicaciones ni estadísticas no presentes.

## Resultados cuantitativos y relaciones

- Cada estadística indica variable, región, grupo, momento, muestra cuando se conoce, valor, unidad y localizador exacto. Su revisión es independiente de la disponibilidad bibliográfica.
- Distinguir DE (`sd`), error estándar (`se`) e intervalos con su tipo y nivel. Un nivel desconocido es nulo; no convertir DE en un intervalo. Un intervalo debe tener límites ordenados y unidad compatible.
- En el ejemplo Trappe 2024, tabla 1, grupo BR: torque Pre `200 ± 47 N·m` y Post `148 ± 42 N·m`, media ± DE, n=9. Son resultados agregados publicados, no mediciones individuales del astronauta virtual. Ambos renglones conservan localizador y estado pendiente.
- `dispersion` e `interval` pueden ser nulos. No generar un número para rellenar la tarjeta. No superponer resultados de protocolos/unidades incompatibles en una misma escala sin revisión.
- `cites` significa cita bibliográfica; `addresses` significa relación temática. Ninguna de ellas equivale a respaldo científico de una recomendación.
- `supports`, `contradicts`, `qualifies` y `same_cohort` requieren `basis: reviewed_extraction`, revisión y localizadores de texto comprobados. Dos resultados diferentes no prueban contradicción sin comparar condiciones.
- Relaciones de IA: `basis: llm_suggestion`, `review_status: pending`, con fragmento trazable en la ficha del paper. No crear citas bibliográficas desde un abstract ni relaciones `supports` automáticas. `possible_cohort_overlap` es una advertencia pendiente; no una conclusión de identidad de participantes.
- Los nodos de intervención son conocimiento de estudios. Los nodos de acción aplicable deben enlazar reglas revisadas del sistema. No confundir la visibilidad en un grafo con elegibilidad.

## Acceso al original y estados de interfaz

La ficha incorpora `applicability`: sin `assessment_id`, se devuelve `not_evaluated`. Con contexto disponible, su evaluación debe explicar compatibilidad de método, población, entorno, duración, momento y recursos mediante reglas revisadas, con sus versiones. Información insuficiente devuelve ese estado y los motivos, sin inventar una confianza o prioridad clínica. La biblioteca visible no equivale a un diagnóstico del astronauta.

El paquete expone modo local o alojado y si requiere servicios externos para consulta. La preparación de IA puede ocurrir con conexión y su consulta usar resultados precalculados. El ejemplo `knowledge_base` es una fixture de interfaz, no una certificación de funcionamiento offline. Campos `full_text_cached`, `pdf_cached` y `local_document_url` distinguen disponibilidad instalada de enlaces remotos.

`landing_url` siempre permite abrir la fuente. `full_text_url` y `pdf_url` pueden ser nulos: no construir rutas de PDF ni prometer que se puede incrustar cualquier editorial. Ofrecer abrir el original y, cuando exista una URL compatible, vista previa. Mostrar disponibilidad y licencia cuando se conocen; ausencia de PDF no equivale a paper inexistente.

Frontend debe contemplar: lista cargando/vacía/error, ficha disponible sin abstract o PDF, resumen pendiente, análisis en cola/procesando/fallido, extracción sin revisar, grafo sin relaciones, expansión paginada, cursor obsoleto y orientación sin módulo. Los ejemplos son para un adaptador mock, no para fingir que las seis rutas ya existen.

## Entorno del estudio unificado

`$defs/Environment` es el único vocabulario de entorno: `spaceflight`, `bed_rest_analog`, `terrestrial_exercise`, `synthetic`, `other`, `mixed`, `unknown`. Los cuatro primeros coinciden con `EvidenceClaim.environment` de 0.2, de modo que un paper y una afirmación del mismo estudio usan el mismo valor. El borrador anterior usaba `bed_rest`; se sustituye por `bed_rest_analog` para no presentar un análogo terrestre como si fuera vuelo. `other`, `mixed` y `unknown` solo aplican a publicaciones. `synthetic` no debería aparecer en un paper real.

## Aclaración de telemetría (corrige una ambigüedad de 0.2)

El README 0.2 ya establece que `start_s` y `end_s` de `TelemetryWindow` repiten los límites solicitados y que se recortan los puntos, no esos campos; el esquema OpenAPI 0.2 no lo dice y la verificación del contrato lo detectó como ambiguo. Para 0.3 se propone, sin romper 0.2:

- `end_s` sigue siendo el valor solicitado (puede superar `recording_end_s`).
- Campo aditivo `effective_end_s` ([`$defs/TelemetryWindowAddendum`](schemas.json)): `min(end_s, recording_end_s)`, o `start_s` cuando la ventana empieza en o después del final.
- Todos los `points` cumplen `start_s <= time_s < effective_end_s`. `next_start_s` es `effective_end_s` mientras quede grabación y `null` al terminar.
- Hasta que el backend lo implemente, el cliente calcula el final efectivo con `recording_end_s`; el adaptador de ejemplos del frontend ya lo hace así.

## Cambios de esta revisión del borrador

- Entorno unificado (`bed_rest` pasa a `bed_rest_analog`).
- `GuidanceStep.action_id` y reglas de enlace con acciones 0.2; nueva variante de ejemplo enlazada.
- `paper_detail` pasa a `paper_details` con la ficha de Scott 2020; `graph` pasa a `graph_views` por vista y se añade `graph_neighbors`.
- Aclaración de telemetría y campo aditivo `effective_end_s`.
- Requieren acuerdo de backend (Sandra) y revisión de Medicina antes de promoverse.

## Pendientes para promover la propuesta

1. Acordar esta forma con frontend y Medicina.
2. Consolidar IDs y versión del primer corpus real; la fixture de dos papers no representa su tamaño final.
3. Resolver el proveedor de IA y su política de generación/caché.
4. Implementar y verificar las nuevas rutas; entonces actualizar la versión vigente y ejemplos de integración.

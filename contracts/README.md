# Contrato compartido 0.2

Acuerdo inicial para desarrollar en paralelo. [openapi.yaml](openapi.yaml) describe la API del backend inicial para contenido ilustrativo. La integración científica sigue pendiente. Los ejemplos en [examples/](examples/) son documentación sintética, no evidencia ni pruebas automatizadas.

La aclaración de producto incorpora un explorador de múltiples papers, resúmenes de IA trazables, estadísticas y aplicabilidad contextual. Está definido por separado en la [propuesta 0.3](drafts/scientific-explorer-0.3/README.md), con OpenAPI, esquemas y ejemplos para frontend. **Es una propuesta aún no implementada; no sustituye este contrato 0.2.** Los grafos iniciales de una evaluación no cubren por sí solos esa biblioteca.

## Convenciones

- Base propuesta: `http://localhost:8000/api/v1`. HTTP con JSON y claves `snake_case`. IDs opacos de tipo string.
- `mission_day` es un entero desde 0; no es tiempo de grabación. Telemetría usa `time_s` desde el inicio de una prueba independiente.
- La solicitud declara `reference_start_day` por separado: comienzo dentro del protocolo del modelo. Su tiempo final es inicio más `horizon_days`; ambos deben estar en el dominio documentado. No se asume equivalencia entre día de misión y día de reposo en cama.
- Valores ausentes: `null` con `missing_reason`. No confundir cero con ausencia.
- Área relativa: 100 significa 100 % del basal; un valor 97 significa 97 % del basal, no una pérdida del 97 %.
- `origin` identifica procedencia; `derivation` indica medición, valor precargado o cálculo. Un resultado calculado no cambia el origen de sus entradas.
- `content_mode: illustrative` identifica contenido ficticio de interfaz; `evidence_based` exige fuentes y reglas revisadas, y no implica validación clínica.
- Cada evaluación congela datos y versiones científicas. Sus tres grafos usan el mismo `assessment_id`. Las únicas mutaciones previstas son el estado de ejecución de sus acciones.
- Los registros de ejercicio y la evaluación muscular comparten el caso virtual. La telemetría pertenece a su dataset y participante original.
- `created_at` y `updated_at` son fechas ISO 8601 en UTC. Los ejemplos usan fechas ficticias.
- Cada visitante crea su propia evaluación. Cambiar el estado de una acción modifica únicamente el seguimiento de esa evaluación, nunca el caso precargado ni las evaluaciones de otros visitantes. Este aislamiento de recursos no constituye autenticación; la demo solo admite datos ficticios o públicos autorizados.

## Descubrimiento y orden de llamadas

1. `GET /cases`: elegir caso, conocer su duración, activo anatómico y grabación asociada.
2. `GET /indicators` y `GET /cases/{case_id}/regions`: obtener nombres, unidades y regiones sin inventarlos en frontend.
3. El mapeo de `region_id` a mallas/puntos del GLB pertenece al frontend. El caso entrega `anatomy_asset` con estado, URL y licencia; si está pendiente, sus URLs pueden ser nulas. La API de regiones no entrega nombres de malla.
4. `POST /assessments`: usar el caso/región seleccionados y conservar el ID devuelto para toda la navegación.
5. Consultar las vistas del grafo bajo ese ID. El resumen ya viene en la evaluación; no se necesita otra solicitud de IA.
6. Consultar los metadatos de la grabación antes de reproducir ventanas de telemetría.

## Operaciones del primer incremento

| Método y ruta | Propósito |
| --- | --- |
| `GET /cases` | Casos precargados; devuelve lista, inicialmente un caso. |
| `GET /indicators` | Catálogo de indicadores con nombre, unidad e interpretación del basal. |
| `GET /cases/{case_id}/regions` | Regiones disponibles e indicadores asociados. |
| `POST /assessments` | Evaluar caso/región/día con horizonte; devolver evaluación con escenario y acciones. |
| `GET /assessments/{assessment_id}` | Recuperar la misma instantánea y estados actuales de las acciones. |
| `GET /assessments/{assessment_id}/graphs/{view}` | `evidence`, `scenario` o `actions`. |
| `PATCH /assessments/{assessment_id}/actions/{action_id}` | Cambiar `execution_status` con `expected_revision`, sin editar el fundamento. |
| `GET /telemetry/{recording_id}` | Ventana `[start_s, end_s)` de una grabación independiente. |
| `GET /telemetry/{recording_id}/metadata` | Inicio, final, participante, origen y límites de reproducción. |

`POST /assessments` crea una nueva instantánea y responde 201; no requiere trabajos asíncronos. Un dato ausente no es por sí solo un error HTTP. La ejecución futura debe limitar tamaño de ventanas: máximo propuesto 120 segundos y 2 000 puntos. `start_s >= end_s` es 422. Una ventana válida sin muestras devuelve una lista vacía.

Un `mission_day` fuera del caso es 422; un caso o región desconocidos es 404. El límite del modelo se trata como estado de escenario. Cambiar el horizonte o el inicio de referencia crea otra evaluación.

## Datos, basales y evidencia

- Observaciones y registros se incluyen solo si estaban disponibles hasta `mission_day`. Ordenar por día y luego por ID para una respuesta estable; no usar evaluaciones futuras del caso para explicar el pasado.
- `baseline_observation_id`, cuando existe, apunta a una observación incluida, anterior o del mismo día y compatible en indicador, método y contexto. Un basal normalizado puede llevar esa referencia nula. No comparar un dato individual con una media poblacional como si fueran el mismo basal.
- `statistic` distingue valor individual, media de grupo y referencia normalizada. Las medias requieren `sample_size`; la dispersión, si existe, indica DE o error estándar y usa la unidad de la observación. No inferir distribución ni intervalos desde un único número.
- `quality: missing` implica `value: null` y un `missing_reason` no vacío; un valor disponible o sospechoso es numérico. `suspect` requiere una razón explícita en el método o contexto de calidad.
- Unidades: área relativa en `percent_baseline`, magnitud de torque de extensión en `N.m` y frecuencia cardíaca en `beats/min`. No se mezclan indicadores/unidades. Las métricas absolutas de área quedan fuera de esta versión.
- `Finding.attention` sirve para presentación: `informational`, `review_needed` o `unknown`. No es severidad clínica. Frontend no calcula por su cuenta colores de riesgo.
- `Source` identifica el material y su ubicación, versión y licencia cuando se conocen. `EvidenceClaim` identifica qué afirmación se obtiene, su tipo, población, entorno, muestra y limitaciones. Un link por sí solo no respalda una interpretación.
- `claim_ids` enlaza hallazgos, acciones y conexiones científicas con afirmaciones concretas. Los IDs de fuentes, afirmaciones y entidades referenciadas deben existir en la evaluación o vista correspondiente.

En modo `evidence_based`, una afirmación usada como fundamento requiere revisión y fuentes revisadas con URL y ubicación. Los objetos pendientes pueden aparecer como candidatos, pero no como respaldo validado. Los ejemplos ilustrativos no cumplen ni pretenden sustituir esa revisión.

## Estados semánticos

| Estado de evaluación | Significado |
| --- | --- |
| `complete` | Se pudieron atender las partes solicitadas con el alcance declarado. No significa astronauta sano ni modelo clínicamente validado. |
| `partial` | Hay información útil y partes no calculables; conservar ambas. |
| `insufficient_data` | No se puede producir la evaluación solicitada; explicar entradas faltantes. |

El escenario tiene estado propio: `available`, `insufficient_data` o `out_of_domain`. Si no está disponible, `points` es vacío y `reason` explica el motivo. Una evaluación puede ser parcial aunque el escenario esté fuera del dominio.

Un escenario `available` incluye modelo/versión, parámetros trazables, `domain` y puntos. Su dominio declara entorno, mínimo/máximo del protocolo y definición del basal. Validar inicio y final antes de calcular. `elapsed_day` va de 0 a `horizon_days`, ordenado y sin duplicados: el día del protocolo es `reference_start_day + elapsed_day`. Los valores conservan el basal original del protocolo; no se reinician a 100 al elegir otro inicio. No asignar automáticamente esos puntos a días de misión ni extrapolar torque desde ellos.

La confianza se explica mediante `evidence_context`: calidad de datos, aplicabilidad de evidencia y límites del modelo. El contrato no define una puntuación numérica de confianza ni un semáforo médico.

Estados de interfaz adicionales: sin selección, cargando, error de red, grafo vacío y grabación terminada. Son estados del frontend, no nuevos diagnósticos del backend.

## Errores

Objeto común: `code`, `message` y `details` (lista de strings). 404 para entidad inexistente; 409 para conflicto de revisión o acción no habilitada; 422 para una entrada inválida; 500 para un fallo interno. Backend debe normalizar también los errores de validación al objeto acordado.

Ejemplo: `{"code":"invalid_window","message":"La ventana de tiempo no es válida.","details":["end_s debe ser mayor que start_s"]}`.

## Ejemplos y uso

- [cases.json](examples/cases.json), [regions.json](examples/regions.json) e [indicators.json](examples/indicators.json): descubrimiento inicial; activo anatómico pendiente.
- [assessment.json](examples/assessment.json): evaluación parcial sintética, sin torque disponible ni parámetros científicos habilitados.
- [assessment-request.json](examples/assessment-request.json): cuerpo de la solicitud que corresponde al ejemplo de evaluación.
- [graphs.json](examples/graphs.json): mapa de las tres respuestas de grafo para esa evaluación; el archivo agrupa ejemplos y no corresponde a una respuesta única de la API.
- [telemetry.json](examples/telemetry.json): tres puntos ficticios, incluido uno ausente. No son filas extraídas de PhysioNet.
- [recording-metadata.json](examples/recording-metadata.json): duración y procedencia de esa grabación ficticia.
- [assessment-states.json](examples/assessment-states.json): variantes completa, insuficiente y fuera de dominio. La curva de la variante completa es arbitraria, solo para diseño, y no usa coeficientes científicos.
- [action-update.json](examples/action-update.json): solicitud de seguimiento con revisión esperada.
- [errors.json](examples/errors.json): ejemplos de error; el archivo agrupa varias respuestas posibles.

Para maquetar los otros estados, conservar el mismo esquema: insuficiente → sin hallazgos interpretativos y con limitaciones; fuera del dominio → escenario sin puntos y con motivo; grafo vacío → `nodes` y `edges` vacíos. `complete` se usará cuando estén disponibles las partes solicitadas y revisadas; no añadir conclusiones para alcanzar ese estado.

Los nodos tienen `id`, `kind`, `label`, `description` y `source_ids`. Las aristas tienen `source`, `target`, `relation` y `label`. Los IDs de extremos deben existir en la vista. Los grafos de consulta no permiten editar conexiones científicas.

Cada vista incluye `content_mode`, `versions` y `claims` coherentes con su evaluación. `entity_id` permite vincular un nodo con una entidad; es nulo para un nodo puramente explicativo sin entidad equivalente. La relación `supported_by` exige `claim_ids` no vacío y un fundamento revisado cuando el contenido sea basado en evidencia. No cambiar una asociación por una flecha causal.

Los resúmenes son `summary` (evaluación), `scenario.summary` y `action_summary`. Un escenario disponible debe incluir modelo/versión, parámetros con fuente/ubicación y puntos; los ejemplos no habilitan ese cálculo. Las acciones `review_status: pending` muestran una etiqueta de pendiente: solo el modo ilustrativo permite ensayar su seguimiento sin presentarlo como recomendación aprobada. En contenido basado en evidencia, entregar acciones revisadas; las candidatas pendientes se explican como limitaciones.

Cada fuente utilizada en una vista se incluye en `sources`, con URL y ubicación. El frontend abre su ficha desde allí; este primer contrato no necesita otra ruta bibliográfica. Una conexión `supported_by` requiere una afirmación sustentada; los ejemplos pendientes usan relaciones descriptivas.

## Seguimiento de acciones

`eligibility` es `eligible`, `ineligible` o `unknown`, acompañado de `eligibility_reason`. Mostrar las no habilitadas con su razón; no permitir marcarlas como realizadas. En modo `evidence_based`, las acciones entregadas requieren revisión.

El cliente envía la `expected_revision` que recibió. Si no coincide, backend devuelve 409 `revision_conflict` y frontend vuelve a consultar la evaluación. Al cambiar de estado, incrementar `revision` y actualizar `updated_at`; repetir el mismo estado con la revisión vigente no produce otro cambio. Los tres estados son reversibles como seguimiento editorial. El estado no certifica ejecución ni beneficio fisiológico.

## Telemetría y final de reproducción

Metadatos y ventanas comparten grabación, origen, participante, unidad y límites. `recording_end_s` es el extremo exclusivo del archivo normalizado. Una solicitud que cruza ese extremo se recorta; si empieza después, devuelve puntos vacíos y `next_start_s: null`. No se rechaza por cruzar el final, siempre que respete el límite de ventana solicitado.

`start_s` y `end_s` conservan los límites solicitados; se recortan los puntos, no esos campos. Los puntos se ordenan por `time_s`, sin duplicados, dentro de `[start_s, min(end_s, recording_end_s))`. `next_start_s` es el final efectivo de la ventana mientras quede grabación; al terminar es nulo. Una ventana interior sin muestras no significa final: puede tener un siguiente inicio. No interpolar ni remuestrear silenciosamente; exceso de duración o puntos es 422. `value: null` requiere una razón; una curva no debe unir un punto ausente con otro posterior como si hubiera medición continua.

## Cambios respecto a 0.1

Se añadieron catálogo de indicadores y metadatos cardíacos, activo anatómico, estructura de afirmaciones, contexto de estadísticas/basales/calidad, dominio de escenario, fechas, atención informativa, elegibilidad y revisión de seguimiento. Se eliminó `Region.mesh_names` porque el mapeo del GLB pertenece al frontend. Se corrigieron descripciones temporales que mezclaban el horizonte del modelo con la duración de misión. Ambos equipos deben usar 0.2 antes de generar sus tipos.

## Cambios y límites

Modificar primero la especificación y los ejemplos, describir el cambio y coordinarlo entre ambas partes. Los esquemas generados por FastAPI deben coincidir con este acuerdo. Los JSON no establecen umbrales, coeficientes ni recomendaciones aprobadas.

El contrato inicial sirve al caso precargado; no contempla todavía login, carga de datos personales, editor de misión/ejercicios, streaming o proveedor de IA. No usar esta API de demostración para datos clínicos reales.

Referencia: [OpenAPI 3.1.2](https://spec.openapis.org/oas/v3.1.2.html).

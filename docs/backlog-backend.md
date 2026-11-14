# Backlog del backend y coordinación

**Histórico:** el nuevo orden de implementación y los tickets de continuación están en [backlog-backend-v2.md](backlog-backend-v2.md). Este archivo conserva el detalle y los IDs BE de la primera planificación. Para frontend, comenzar por [ENTREGA_FRONTEND.md](ENTREGA_FRONTEND.md).

Fecha: 14 de noviembre de 2026. Alcance: backend de TwinNauta. Este documento propone el orden de implementación; no autoriza desplegar servicios ni ejecutar todos los tickets automáticamente. Los tickets pendientes se registraron en Concord como `proposed`, sin reclamar archivos ni iniciar su implementación. Los estados de la tabla son una fotografía de planificación: consultar Concord para la asignación y entrega actuales.

## Cómo trabajar entre agentes

Sandra decide prioridades y resuelve decisiones de producto. Un agente coordinador mantiene dependencias, revisa entregas e integra. Cada agente ejecutor toma un ticket acotado y declara sus archivos antes de editar. Para este MVP, empezar con dos ejecutores simultáneos: uno de investigación y otro de implementación; ampliar solo cuando exista trabajo independiente.

Cada ticket debe tener: propósito, alcance, archivos previstos, dependencias, entregable, criterio de cierre, responsable y evidencia de verificación. Un archivo compartido tiene un responsable de edición a la vez. Cambios en `contracts/`, `schemas.py`, migraciones o reglas científicas se coordinan antes de implementarlos. Investigar una variable no autoriza a habilitar su cálculo.

Estados propuestos para el tablero humano: pendiente, listo, en curso, bloqueado, en revisión y cerrado. Son categorías de coordinación; se mapearán al ciclo real de Concord, sin asumir que todos sean estados nativos. Una entrega del ejecutor pasa a revisión antes del cierre. La ausencia de datos externos se registra como bloqueo con una alternativa explícita, no como una tarea terminada.

### Uso de Concord

La [documentación oficial](https://github.com/Get-Concord-AI/concord-mcp) describe cinco operaciones: `start_work` para declarar tarea y alcance, `inspect_work` para consultar contexto, `update_work` para avances y mensajes, `transfer_work` para responsabilidad y entregas, y `finish_work` para registrar resultados y evidencia. Los avisos de solapamiento requieren resolución por los agentes; no reemplazan la revisión del código.

Acuerdo de coordinación: mantener los requisitos de los tickets en este documento y usar Concord como registro operativo de asignaciones, avances, bloqueos y revisiones. Conservar los IDs BE-xx en ambos lugares. No duplicar estados manualmente durante cada paso. Las decisiones científicas aprobadas deben terminar en documentación versionada del proyecto.

Las dependencias y condiciones de desbloqueo están escritas en las notas de cada ticket; no se ha configurado un planificador que las haga cumplir automáticamente. El coordinador debe comprobarlas antes de asignar. Un ticket `proposed` no está en ejecución ni tiene sus archivos reservados.

Concord reconoce al coordinador como `codex:1b0bf139`. Cada sesión externa debe usar su propia identidad reconocida. Un subagente interno no debe reutilizar ese identificador ni inventar otro para aparentar presencia independiente: si no dispone de identidad, el coordinador registra su entrega como trabajo delegado y distingue autoría de revisión.

Para cambios independientes pequeños puede mantenerse el directorio compartido con archivos delimitados. Si dos tareas necesitan tocar los mismos módulos, ejecutarlas en secuencia o usar ramas y worktrees separados, con integración posterior del coordinador. Concord no sustituye el aislamiento de Git.

## Estado de partida

- Existe el backend inicial con nueve operaciones, contrato 0.2, persistencia inicial y ejemplos sintéticos.
- Se descargaron originales y se preparó una grabación terrestre con procedencia: 602 muestras y dos ausencias de HR.
- La integración de esa grabación está en revisión del agente ejecutor; no se declara comprobada mediante HTTP todavía.
- Faltan dependencias para verificar el backend completo y PostgreSQL en ejecución.
- El modelo muscular sigue devolviendo información insuficiente. Las recomendaciones clínicas no están habilitadas.

## Orden y dependencias

| ID | Ticket | Estado inicial | Depende de |
| --- | --- | --- | --- |
| BE-01 | Verificar arranque local y PostgreSQL | Completado: ejecución real y persistencia verificadas | Ninguna |
| BE-02 | Resolver interpretación y acceso de datos científicos | En curso: investigación | Ninguna |
| BE-03 | Conectar telemetría real | Completado: funciones y HTTP verificados | Extracción ya preparada; BE-01 para HTTP |
| BE-04 | Organizar fuentes, parámetros y versiones | Listo | Inventario disponible |
| BE-05 | Preparar el caso virtual reproducible | Pendiente de acordar el caso | BE-04 para procedencia |
| BE-06 | Implementar tendencia muscular de referencia | Bloqueado por revisión del parámetro | BE-04 y ficha científica revisada |
| BE-07 | Importar y comparar torque | Bloqueado por semántica del archivo | BE-02 y BE-04 |
| BE-08 | Evaluar registros de ejercicio y recursos | Listo para diseño; implementación tras BE-05 | BE-05 |
| BE-09 | Definir reglas de acciones operativas | Pendiente de revisión de Medicina | BE-02 y BE-08 |
| BE-10 | Componer evaluación y resumen | Pendiente | BE-05, BE-06 y BE-08; BE-07/09 cuando estén habilitados |
| BE-11 | Completar los tres grafos | Pendiente | BE-04 y BE-10 |
| BE-12 | Revisar integración y contrato con frontend | Parcial ahora; cierre al completar recorrido | BE-01, BE-03, BE-10 y BE-11 |
| BE-13 | Preparar configuración y despliegue de demo | Pendiente de proveedor | BE-12 y decisión de Sandra |
| BE-14 | Construir corpus bibliográfico contrastable | Entregado: 27 candidatos, pendiente auditoría científica | Ninguna para descubrimiento |
| BE-15 | Preparar análisis de abstracts con IA y extracción revisable | Propuesto; proveedor aún sin elegir | BE-14 y BE-16 |
| BE-16 | Definir contrato del explorador para frontend | Propuesta 0.3 documentada; no implementada | Aclaración de producto de Sandra |
| BE-17 | Publicar y comprobar un paquete científico local | Propuesto | BE-04, BE-14, BE-15 y BE-16 |

Las dependencias científicas son específicas: BE-02 no bloquea la reproducción cardíaca ni la organización de fuentes. BE-10 debe representar resultados parciales si torque o acciones siguen pendientes; no rellenarlos con estimaciones inventadas.

**Prioridad corregida:** Sandra aclaró que el explorador científico contextual es el núcleo visible, no un complemento bibliográfico. BE-14 a BE-17 y la ampliación de BE-11 tienen prioridad tras estabilizar telemetría. La [propuesta 0.3](../contracts/drafts/scientific-explorer-0.3/README.md) permite a frontend avanzar con mocks sin atribuir nuevas rutas al backend existente. Los contratos de papers y sus estados de IA deben revisarse antes de implementar clientes definitivos.

**Generalización confirmada:** el motor debe admitir módulos por región, indicador, método y contexto, con evidencia y reglas propias. El MVP implementa únicamente el módulo elegido, no una cobertura ficticia de todo el cuerpo. Dentro de ese módulo se requieren varios estados de demostración: información comparable disponible, datos ausentes, métodos no comparables y restricciones operativas. Añadir una región exige su módulo científico; el modelo 3D por sí solo no habilita una evaluación.

## Tickets

### BE-01 — Verificar arranque local y PostgreSQL

- **Propósito:** disponer de una ejecución real para comprobar endpoints y persistencia.
- **Alcance:** resolver dependencias del backend, ejecutar la migración y seed existentes en PostgreSQL de desarrollo, comprobar salud y una evaluación persistida. Registrar lockfile si la resolución concluye. No crear servicios de nube.
- **Archivos previstos:** `backend/pyproject.toml`, lockfile, configuración/migraciones solo si aparece un fallo real y documentación de arranque. No versionar credenciales.
- **Entregable y cierre:** comandos reproducibles; arranque FastAPI, `/health/ready`, migración y seed ejecutados; evaluación recuperable después de reiniciar la aplicación. Informar cualquier paso no ejecutado.
- **Responsable propuesto:** agente de infraestructura local, con revisión del coordinador.

### BE-02 — Resolver interpretación y acceso de datos científicos

- **Propósito:** evitar cálculos con unidades, grupos o calendarios inferidos.
- **Alcance:** diccionario CFT70, relación entre `Angle` y velocidad, unidades por prueba, PRE/POST y grupos; búsqueda contrastada de área muscular individual. Documentar acceso restringido y contradicciones. No enviar solicitudes a terceros sin instrucción.
- **Archivos previstos:** `backend/data/raw/research_pending/`; referencias consolidadas por el coordinador.
- **Entregable y cierre:** ficha por pregunta con fuente exacta, hallazgo, contraevidencia y decisión. Si falta documentación, cerrar la iteración de búsqueda dejando el uso correspondiente bloqueado y especificando qué documento se debe solicitar. Un diccionario de otra campaña no confirma por sí solo CFT70.
- **Responsable actual:** agente investigador; revisión científica pendiente de Medicina.

### BE-03 — Conectar telemetría real

- **Propósito:** permitir al frontend reproducir la sesión terrestre por la API existente.
- **Alcance:** cargar CSV/procedencia preparados, resolver ID de grabación, metadata y ventanas. Conservar la señal sintética y evitar vincular la grabación real al historial muscular virtual.
- **Archivos previstos:** `backend/app/recordings.py`, `catalog.py`, `telemetry.py`; documentación de integración. Coordinar cualquier cambio de contrato.
- **Entregable y cierre:** recuperar las 602 muestras exactamente una vez recorriendo ventanas; conservar dos faltantes y última muestra; respetar 120 segundos/2000 puntos, origen y reloj. Comprobar ID desconocido y ventanas inválidas. La verificación HTTP depende de BE-01.
- **Responsable actual:** agente de telemetría; revisión final del coordinador.

### BE-04 — Organizar fuentes, parámetros y versiones

- **Propósito:** poder reconstruir de dónde sale cada resultado.
- **Alcance:** catálogo versionado de fuentes, parámetros, reglas y modelos; estado de revisión, DOI/URL, localizador, unidad, población, dominio y hash del original. Reutilizar `Source` y el contrato existentes.
- **Archivos previstos:** módulo de catálogo científico y archivos estructurados bajo `backend/data/`; adaptar persistencia solo donde sea necesario para guardar versiones usadas.
- **Entregable y cierre:** cada parámetro o afirmación resuelve una fuente concreta; una revisión posterior no altera la procedencia de una evaluación ya guardada. No crear un servidor de grafos ni una arquitectura adicional para este ticket.
- **Responsable propuesto:** agente de datos/backend. Puede avanzar junto a BE-01 y BE-02 en archivos separados.

### BE-05 — Preparar el caso virtual reproducible

- **Propósito:** alimentar un recorrido coherente para la demostración.
- **Alcance:** perfil, misión, región, basales sintéticos identificados, evaluaciones, plan/sesiones y disponibilidad de equipo. Acordar primero el relato mínimo con Sandra; no presentarlo como astronauta real.
- **Archivos previstos:** `backend/data/demo/`, `seed.py` y documentación breve del caso.
- **Entregable y cierre:** seed repetible, sin sobrescribir datos existentes; cronología consistente y procedencia visible. Cambiar el día de consulta no revela registros futuros. El basal virtual no se confunde con medias de un estudio.
- **Variantes requeridas:** conservar el módulo de cuádriceps y probar respuestas diferentes ante datos disponibles/comparables, faltantes, evaluación no comparable y equipo no disponible. No usar umbrales clínicos inventados para fabricar estados de riesgo.
- **Responsable propuesto:** agente de datos de demostración, con decisión de producto de Sandra.

### BE-06 — Implementar tendencia muscular de referencia

- **Propósito:** mostrar una trayectoria ilustrativa científicamente delimitada al seleccionar cuádriceps.
- **Alcance:** ficha revisada del parámetro, fórmula explícita, basal normalizado, dominio temporal y versión; conectarla a `reference_scenario`. Separar reloj de referencia y misión.
- **Archivos previstos:** `backend/app/simulation.py`, catálogo de parámetros y documentación del modelo.
- **Entregable y cierre:** valor basal correcto, cálculo en límites temporales y abstención fuera del dominio o sin revisión. Distinguir porcentaje relativo al basal de pérdida compuesta. No inferir dosis de ejercicio, recuperación en vuelo, cambios de torque ni bandas de confianza inexistentes.
- **Responsable propuesto:** agente de modelado backend; Medicina revisa la ficha antes de habilitar resultados.

### BE-07 — Importar y comparar torque

- **Propósito:** representar función muscular con evaluaciones comparables.
- **Alcance:** importar únicamente pruebas con semántica confirmada; conservar sujeto, grupo, unidad, método, velocidad, momento y ausencia. Separar archivos individuales de resúmenes agregados.
- **Archivos previstos:** importador y derivados bajo `backend/data/processed/nasa_mr079g/`; adaptación de observaciones si cabe en el contrato actual.
- **Entregable y cierre:** conciliación de filas importadas/rechazadas; comparación solo cuando coincidan condiciones; sin interpolación diaria ni conversión desde área muscular. Registrar exclusiones y posibles cohortes compartidas.
- **Responsable propuesto:** agente importador, después de BE-02. Si no se confirma CFT70, puede prepararse una referencia agregada del artículo revisado, etiquetada como tal y sin fingir registros individuales.

### BE-08 — Evaluar registros de ejercicio y recursos

- **Propósito:** identificar qué necesita confirmar el astronauta sobre su actividad y equipo.
- **Alcance:** plan frente a sesiones registradas, sesiones futuras, campos ausentes, duración y equipo disponible. Definir denominadores y ventanas para cualquier medida de cumplimiento.
- **Archivos previstos:** módulo de evaluación de ejercicio y recursos; fixture aprobado de BE-05.
- **Entregable y cierre:** diferenciar sesión realizada, omitida y sin confirmar. Excluir sesiones futuras del cumplimiento; no convertir una ausencia de registro en incumplimiento confirmado. No transformar el cumplimiento en una tasa de atrofia.
- **Responsable propuesto:** agente de lógica operativa. El diseño puede avanzar mientras se revisa la evidencia muscular.

### BE-09 — Definir reglas de acciones operativas

- **Propósito:** convertir hallazgos en siguientes pasos comprensibles y trazables.
- **Alcance:** condiciones, entradas, fuente, requisitos, restricciones, responsable humano y seguimiento. Empezar por revisar registro, comprobar equipo y preparar una revisión del plan.
- **Archivos previstos:** catálogo de reglas y módulo de acciones; revisar el contenido con Medicina.
- **Entregable y cierre:** cada acción explica por qué aparece y cuándo debe abstenerse; marcarla completada registra seguimiento, no recuperación fisiológica. No habilitar cambios automáticos de ejercicio o tratamiento.
- **Responsable propuesto:** Medicina para contenido y agente backend para reglas; coordinación de Sandra.

### BE-10 — Componer evaluación y resumen

- **Propósito:** devolver un resultado coherente para una región y un momento de consulta.
- **Alcance:** integrar indicadores, calidad, aplicabilidad, escenario y acciones disponibles en `assessments.py`. Resumen por plantillas basado en esos mismos campos.
- **Archivos previstos:** `backend/app/assessments.py` y módulo de plantillas si es necesario.
- **Entregable y cierre:** estados completos/parciales/insuficientes con motivos; ninguna frase contradice valores o evidencia; instantánea reproducible con versiones y sin datos futuros. No inventar puntuación global de confianza. LLM y agentes redactores quedan fuera del cierre de este ticket.
- **Motor modular:** resolver el módulo habilitado para región/indicador y comprobar basal, método, contexto, tiempo y recursos. Una región sin módulo devuelve cobertura no disponible; no hereda reglas de otro músculo ni se presenta como sana. El análisis de abstracts de BE-15 complementa la explicación, no decide por sí solo aplicabilidad clínica.
- **Responsable propuesto:** agente integrador, después de estabilizar los módulos que combina.

### BE-11 — Completar los tres grafos

- **Propósito:** permitir explorar fundamento, escenario y acciones desde la evaluación.
- **Alcance:** tres proyecciones de una biblioteca de múltiples papers: evidencia, escenario y acciones. Incorporar búsqueda, expansión por paper y acceso a ficha/resumen/estadísticas/original según BE-16. Conservar identificadores de fuentes y reglas; diferenciar citas, similitud temática, sugerencias de IA y relaciones científicas revisadas. Depende también del corpus BE-14 y las extracciones de BE-15.
- **Archivos previstos:** `backend/app/graphs.py` y catálogo de relaciones.
- **Entregable y cierre:** nodos y aristas resuelven entidades existentes; cada relación sustantiva tiene fundamento; los grafos y resúmenes describen la misma evaluación guardada. Un escenario no disponible no genera una cadena causal ficticia.
- **Responsable propuesto:** agente de grafos; revisión del coordinador y Medicina para relaciones científicas.

### BE-12 — Revisar integración y contrato con frontend

- **Propósito:** entregar al frontend operaciones ejecutables y ejemplos fieles.
- **Alcance:** recorrido HTTP completo, estados parciales, errores, origen de datos, unidades, versiones, seguimiento concurrente y grabación real. Revisar el mapeo de IDs anatómicos con la responsable de frontend; no construir la interfaz.
- **Archivos previstos:** `api.py`, ejemplos/documentación de `contracts/` y ajustes puntuales de integración. Cambios públicos coordinados con ambas partes.
- **Entregable y cierre:** ejemplos ejecutados contra API/PostgreSQL, payloads compatibles con contrato, acción actualizable sin perder control de revisión y telemetría reproducible. Reportar evidencia de ejecución; no añadir CI ni una suite extensa.
- **Responsable propuesto:** coordinador/backend y revisión de integración con frontend. Puede revisar BE-03 antes de que termine el recorrido científico.

### BE-13 — Preparar configuración y despliegue de demo

- **Propósito:** ejecutar el backend fuera del equipo local de forma reproducible.
- **Alcance:** configuración de proveedor elegido, conexión PostgreSQL, migraciones, seed, orígenes CORS, comando de arranque y archivos científicos necesarios. Definir cómo se accede a la demo según el proveedor y su contenido.
- **Archivos previstos:** configuración de despliegue y documentación; infraestructura concreta pendiente de decisión.
- **Entregable y cierre:** configuración revisable primero; despliegue únicamente cuando esté autorizado. Una vez desplegado, comprobar salud, persistencia y recorrido HTTP con la URL real. No contratar servicios por iniciativa del agente.
- **Responsable propuesto:** agente de despliegue tras decisión de Sandra.

### BE-14 — Construir corpus bibliográfico contrastable

- **Propósito:** reunir estudios reales suficientes para explorar y comparar resultados y métodos.
- **Alcance:** búsquedas reproducibles, metadatos/abstracts, deduplicación, selección justificada y preguntas de contraste e independencia de cohortes.
- **Archivos:** `backend/data/literature/candidates/`.
- **Entrega actual:** 27 candidatos, 26 abstracts, 130 registros recuperados y 120 identificadores únicos antes de seleccionar. No son 27 evidencias aprobadas. [Inventario](../backend/data/literature/candidates/README.md).
- **Cierre:** referencias resolubles, consultas originales y procedencia conservadas; distinción entre descubrimiento y auditoría completa.
- **Responsable ejecutor:** subagente interno `arranque_backend`, después de completar BE-01; revisión del coordinador.

### BE-15 — Preparar análisis de abstracts con IA y extracción revisable

- **Propósito:** producir resúmenes, implicaciones e intervenciones estudiadas que alimenten fichas y vistas previas del grafo.
- **Alcance:** salida estructurada, fragmentos de apoyo, base abstract/texto completo, prompt/modelo/versiones, caché por entrada y estados de procesamiento. Proveedor por configurar; no ejecutar gasto ni gestionar claves en frontend.
- **Archivos previstos:** módulo de análisis/ingesta y derivados bibliográficos; no sobrescribir fuentes originales.
- **Cierre:** cada elemento resuelve un paper y fragmento real; se abstiene ante datos ausentes; resiste instrucciones incrustadas en los textos tratándolos como datos; las sugerencias siguen pendientes hasta revisión. Resultados numéricos comprobados contra la fuente antes de usarse en cálculos. Incluir contradicciones y diferencias metodológicas sin forzarlas.
- **Responsable propuesto:** agente backend de análisis; Medicina revisa extracciones y aplicabilidad. No requiere IA remota al consultar un resultado precalculado.

### BE-16 — Definir contrato del explorador para frontend

- **Propósito:** habilitar desarrollo paralelo del núcleo bibliográfico sin inventar tipos o estados en frontend.
- **Alcance:** propuesta aditiva con búsqueda, ficha, estadísticas, IA trazable, aplicabilidad por contexto, grafo paginado y metadatos del paquete local.
- **Archivos:** `contracts/drafts/scientific-explorer-0.3/`, `contracts/README.md`, `frontend/README.md` y `docs/explorador-cientifico.md`.
- **Entrega:** cuatro operaciones propuestas, JSON Schema y ejemplos validados; 0.2 sigue vigente. Sin nuevos endpoints implementados.
- **Cierre:** artefactos consistentes, fuentes reales identificadas y acuerdo entre frontend/backend antes de promoverlo a contrato vigente.
- **Responsable actual:** coordinador; frontend revisa forma de consumo, Medicina revisa estados de interpretación.

### BE-17 — Publicar y comprobar un paquete científico local

- **Propósito:** consultar conocimiento contextual sin depender de Internet continuo ni de una API de IA en cada interacción.
- **Alcance:** paquete versionado con índice, resúmenes, reglas, estadísticas y documentos cuya disponibilidad/permisos permitan incluirlos; manifiesto de integridad y actualización explícita.
- **Archivos previstos:** módulo de carga del paquete, manifiesto y artefactos publicados. Coordinar con frontend los recursos necesarios para ejecutar la aplicación localmente.
- **Cierre:** recorrido de consulta ejecutado sin salida a Internet; versiones/fecha visibles; distinguir documento instalado de enlace remoto. Las actualizaciones no alteran evaluaciones históricas. Despliegue en nube por sí solo no verifica este criterio.
- **Responsable propuesto:** agente de empaquetado después de acordar BE-16 e implementar los servicios de consulta.

## Qué puede avanzar en paralelo ahora

1. Cerrar BE-03 y su revisión mientras BE-02 continúa la investigación.
2. Ejecutar BE-01 en un ámbito separado de la lógica de telemetría.
3. Preparar BE-04 y acordar el contenido de BE-05. Si comparten catálogo o fixtures, editar en secuencia.
4. Tras BE-05, BE-08 puede avanzar aunque BE-07 siga bloqueado.
5. BE-06 y BE-07 pueden implementarse en paralelo cuando sus fuentes estén revisadas y no compartan archivos; BE-10 integra sus entregas después.

## Plantilla breve de asignación

```text
Ticket: BE-xx — título
Propósito:
Responsable:
Dependencias y estado comprobado:
Archivos que puede editar:
Entradas y fuentes:
Entregable:
Criterios de cierre:
Fuera de alcance:
Verificación requerida:
Entrega al coordinador: archivos, comandos/resultados, decisiones y pendientes.
```

Los agentes no deben comenzar varios tickets a la vez ni ampliar su alcance para resolver tareas vecinas sin coordinación. El coordinador revisa el diff y la evidencia; Sandra conserva las decisiones de producto y las autorizaciones de despliegue.

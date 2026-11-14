# Backlog backend v2 — explorador contextual y autonomía

Este documento reemplaza el orden de trabajo de [`backlog-backend.md`](backlog-backend.md), que conserva la historia y los IDs BE anteriores. Fecha: 14 de noviembre de 2026. Los tickets nuevos usan KB para evitar confundirlos con tareas ya cerradas. No todos están cargados como tareas individuales en Concord; la siguiente IA debe registrarlos al asignar, sin duplicar entregas existentes.

## Base disponible

- **BE-01 completado:** dependencias, `uv.lock`, PostgreSQL aislado, migración, seed doble, 31 llamadas HTTP y persistencia tras reinicio.
- **BE-03 completado:** telemetría real independiente, 602 muestras, dos ausencias, ventanas y señal sintética preservadas.
- **BE-14 completado como descubrimiento:** 27 papers candidatos, 26 abstracts, búsquedas originales y procedencia. No son 27 estudios auditados.
- **BE-02 en revisión:** diccionario de otra campaña encontrado; semántica CFT70 y serie individual de área siguen pendientes. No habilitar torque por inferencia.
- **Contrato 0.2 implementado; 0.3 propuesto.** No hay motor contextual completo, API de biblioteca, ejecución de IA ni paquete offline de producto comprobado.

## Orden y trabajo paralelo

| Ticket | Propósito y entrega | Depende de | Puede avanzar con |
| --- | --- | --- | --- |
| KB-01 | Revisar y consolidar contrato 0.3 con frontend. | Documentación ya disponible | Auditoría de fuentes KB-05 |
| KB-02 | Catálogo modular y versiones de evidencia/reglas. | KB-01 | Adaptador de análisis KB-04 |
| KB-03 | Publicar corpus y servicios de búsqueda/ficha. | KB-01, KB-02 | KB-04 y KB-05 |
| KB-04 | Análisis estructurado de abstracts con proveedor configurable. | KB-01 y corpus candidato | KB-03 y KB-05 |
| KB-05 | Auditar resultados, métodos, cohortes y aplicabilidad. | Fuentes existentes | Toda tarea que no habilite sus conclusiones |
| KB-06 | Motor contextual de cuádriceps con varios estados. | KB-02 y reglas revisadas de KB-05 | Grafo bibliográfico KB-08 |
| KB-07 | Congelar interpretación por evaluación y preparar variantes. | KB-06 | Paquete de consulta KB-09 |
| KB-08 | Grafo navegable y relaciones trazables. | KB-03; KB-04/05 para relaciones interpretativas | KB-06/07 con archivos separados |
| KB-09 | Paquete local versionado de conocimiento. | KB-02, KB-03, KB-04 y KB-08 | Revisión de escenarios KB-07 |
| KB-10 | Verificar recorrido con frontend y sin Internet. | KB-07, KB-08, KB-09 | Ninguna modificación concurrente de los módulos verificados |

Prioridad inmediata: KB-01; después KB-02 y KB-04 con archivos separados, mientras Medicina realiza KB-05. Los bloqueos de investigación afectan únicamente los cálculos/reglas que dependen de ellos. Una consulta bibliográfica y una interpretación aprobada tienen criterios de cierre distintos.

## KB-01 — Consolidar contrato y entrega a frontend

- **Propósito:** evitar tipos y estados inventados por cada parte.
- **Alcance/archivos:** `contracts/drafts/scientific-explorer-0.3/`, `contracts/README.md`, `docs/ENTREGA_FRONTEND.md`; coordinar `schemas.py` solo cuando se implemente.
- **Cierre:** acordar seis operaciones nuevas, catálogo de módulos, estados de orientación, IA, aplicabilidad y paginación; ejemplos consistentes. Documentar promoción a vigente cuando haya implementación, sin atribuir rutas futuras a 0.2.
- **Responsable:** backend + responsable frontend. Revisar con Medicina las etiquetas que pueden parecer riesgo o recomendación clínica.

## KB-02 — Catálogo modular y versiones

- **Propósito:** generalizar arquitectura sin fingir soporte de todo el cuerpo.
- **Alcance/archivos:** módulo nuevo de registro científico y catálogo versionado en `backend/data/`; repositorios/persistencia solo donde haga falta.
- **Entrega:** módulo `quadriceps_health`, indicadores seleccionados, métodos aceptados, fuentes, dominio y reglas con versión/revisión. Otros módulos deben aparecer como no implementados o no estar publicados.
- **Cierre:** `GET /health-modules` refleja cobertura real. No copiar tasas/umbrales de cuádriceps a otra región. La versión usada queda disponible para congelar evaluaciones.

## KB-03 — Corpus y servicios bibliográficos

- **Propósito:** convertir los 27 candidatos en una biblioteca consultable, manteniendo su revisión pendiente.
- **Alcance/archivos:** carga/normalización del corpus y rutas `/papers`, `/papers/{id}` y `/knowledge-base/metadata`; coordinar `api.py` y esquemas con KB-01.
- **Entrega:** IDs canónicos, búsqueda local por filtros, páginas/cursor, ficha, acceso y disponibilidad de documentos. Conservar respuestas originales fuera del corpus publicado.
- **Cierre:** deduplicación e IDs resolubles; vacíos y errores acordados; búsqueda sin llamadas externas obligatorias. Una consulta no ejecuta generación de IA ni consumo por visitante.

## KB-04 — Análisis de abstracts con IA configurable

- **Propósito:** resúmenes e implicaciones/intervenciones candidatas para fichas y vistas previas.
- **Alcance/archivos:** adaptador de proveedor, procedimiento de ingesta y artefactos de análisis. No poner claves en frontend ni en Git. Los créditos Google no están confirmados; no contratar servicios.
- **Entrega:** JSON según propuesta, fragmentos de apoyo, base abstract/texto completo, prompt/modelo/hash, estados, caché y fallos explícitos. Proveedor independiente del contrato; modo sin generación cuando no hay credenciales.
- **Cierre:** cada afirmación resuelve una fuente; no obedece instrucciones incrustadas en el texto; no inventa estadísticas o contraindicaciones; sugerencias pendientes hasta revisión. Comparar calidad/coste sobre el mismo conjunto si Sandra habilita proveedores. No ejecutar gasto sin configuración autorizada.

## KB-05 — Auditoría y reglas revisadas

- **Propósito:** determinar qué puede interpretarse y aplicarse, con qué límites.
- **Alcance/archivos:** fichas de evidencia/estadísticas/reglas, suplementos y procedencia. Medicina revisa contenido; backend conserva versiones.
- **Entrega:** muestra, población, entorno, método, variable/unidad, grupo, tiempo, efecto/estadísticos/localizador, límites y solapamiento de cohortes. Separar tamaño de fuerza y reposo de vuelo.
- **Cierre:** habilitar solo extracciones verificadas. Scott 2020 no predice pérdida individual por incumplimiento; CFT70 requiere diccionario confirmado. Si falta evidencia, dejar la combinación bloqueada con motivo. No enviar solicitudes a investigadores por iniciativa propia.

## KB-06 — Motor contextual del módulo inicial

- **Propósito:** cambiar la explicación y los siguientes pasos según los datos y contexto del astronauta.
- **Alcance/archivos:** módulo de interpretación, selección de reglas y funciones de evaluación. Reutilizar modelos científicos únicamente cuando su dominio esté documentado y revisado.
- **Entrega:** considerar región, indicador, basal, método, evolución, momento de misión, duración de exposición y recursos. Distinguir cambio observado, aplicabilidad de evidencia y acción habilitada.
- **Cierre:** respuestas diferentes ante datos comparables, faltantes, métodos incompatibles y restricción de equipo; no usar umbrales clínicos inventados. Una región sin módulo devuelve `not_supported`. IA de abstract no sustituye las reglas de interpretación.

## KB-07 — Instantáneas y variantes de demostración

- **Propósito:** resultados reproducibles y múltiples estados dentro del mismo módulo.
- **Alcance/archivos:** `assessments.py`, persistencia/migración si necesaria, seed y fixtures. No sobrescribir evaluaciones anteriores.
- **Entrega:** guardar interpretación, corpus/reglas/modelo/versiones y razones al crear nuevas evaluaciones. Exponer orientación congelada; evaluaciones antiguas sin ese dato devuelven cobertura no disponible.
- **Cierre:** cambiar catálogo después no altera la orientación guardada. GET no genera nuevas conclusiones ni consume IA. Variantes sintéticas claramente etiquetadas y sin datos futuros; seguimiento de acciones separado del fundamento.

## KB-08 — Grafo navegable del corpus

- **Propósito:** explorar varios estudios, no solo tres tarjetas de la evaluación.
- **Alcance/archivos:** servicio `/knowledge-graph`, proyecciones/relaciones del corpus; `graphs.py` si se comparte lógica, sin modificar retrospectivamente grafos guardados.
- **Entrega:** tres vistas, vecinos, filtros, paginación y enlaces a fichas. Separar citas/temas, sugerencias de IA, resultados y respaldo científico revisado.
- **Cierre:** extremos resolubles, IDs estables, conteos reales y límites; no duplicar nodos al expandir. `supports`/`contradicts` requieren extracción y comparación revisadas; cantidad de papers no equivale a independencia o calidad.

## KB-09 — Paquete local e IA precalculada

- **Propósito:** consulta autónoma sin dependencia continua de Internet.
- **Alcance/archivos:** empaquetado/manifiesto/cargador local de corpus, resúmenes, relaciones y reglas. PDFs/textos solo cuando se obtuvieron y pueden incluirse.
- **Entrega:** versión, fecha, hashes y actualización explícita; distinguir documentos instalados de enlaces remotos. Backend local sirve contenido sin llamar a APIs públicas.
- **Cierre:** búsquedas, fichas y explicaciones disponibles desde el paquete; actualización no modifica instantáneas. Modelo local opcional posterior, sujeto a recursos y evaluación; no requisito inicial. Coordinar disponibilidad local de app/3D con frontend.

## KB-10 — Recorrido completo y verificación sin conexión

- **Propósito:** demostrar el comportamiento acordado y sus límites reales.
- **Alcance/archivos:** comprobaciones enfocadas y documentación de ejecución; sin CI ni suite extensa por iniciativa propia.
- **Entrega:** seleccionar región/estado, orientación, varios papers, resumen, estadísticos y fuente, tres vistas, acción con condiciones, telemetría y reinicio/persistencia.
- **Cierre:** recorrido ejecutado sin salida a Internet usando recursos locales y con estados pendientes/no soportados explícitos. La nube por sí sola no demuestra autonomía. Proveedor de nube y despliegue permanecen pendientes de decisión/autorización.

## Reglas para asignar agentes

Un responsable por ticket y archivos declarados antes de editar. No asignar simultáneamente `api.py`, `schemas.py` o una migración a dos ejecutores. Usar Concord con la identidad real de cada sesión; no copiar el ID del agente anterior. Registrar entrega con cambios, comprobaciones, supuestos y pendientes. Revisar antes de cerrar. Los tickets requieren propósito y criterios anteriores, no únicamente un título.

# Resultados de preparación con DeepSeek

Los archivos contienen salidas reales de `deepseek-v4-pro`. Son borradores pendientes de revisión científica; no actualizan PostgreSQL, no habilitan acciones y no están publicados en frontend. Ninguna clave forma parte de estos artefactos.

## Entrega actual

- [Biblioteca preparada](deepseek-corpus-v2-20261115/manifest.json): 26 abstracts con resumen y elementos candidatos. Ocho resultados reutilizados y 18 generados en el lote final. Se verificaron hashes y fragmentos literales para los 26.
- [Síntesis del caso](deepseek-context-v3-20261114/context.json): alerta, escenario y pasos; prompt `context-synthesis-0.3`. Los tres grafos citan fragmentos seleccionados por ID. No hay pronóstico individual para el caso con datos insuficientes.
- [Inspección de la síntesis](deepseek-context-v3-20261114/quality-review.json): las formulaciones problemáticas iniciales se resolvieron en la lectura de esta salida; la revisión de Medicina continúa pendiente.
- [Reporte de ejecución](execution-report-20261115.json): llamadas, consumo registrado, límites y entregables.

`literature_pmid_41785029` no tiene abstract en el corpus y no se procesó. No se generó contenido a partir de su título.

## Historial y consumo

Se conservaron el piloto inicial, la síntesis v2 y el primer lote interrumpido para que los fallos sean auditables. El lote interrumpido presentó citas no literales y estructuras inválidas. El protocolo actual entrega fragmentos numerados al modelo y materializa las citas desde el original, conservando el formato público `AnalysisDraft`. Los borradores antiguos solo se reutilizan si coinciden fuente/hash, modelo y versiones de prompt admitidas, y vuelven a pasar validación literal. Reutilizarlos no significa aprobarlos científicamente.

Hubo 38 intentos de llamada contando pilotos y correcciones. En 36 se registró consumo: 47 471 tokens de entrada y 22 930 de salida. La estimación para esos tokens, con aciertos de caché y tarifas fuera de hora punta consultadas, es US$0,069382. No incluye una síntesis rechazada inicialmente ni una solicitud interrumpida cuyo uso no se recuperó. No es la factura total ni el saldo. Referencia: [tarifas oficiales](https://api-docs.deepseek.com/quick_start/pricing/).

Falta revisar semántica, aplicabilidad y terminología de los 26 resúmenes, obtener el abstract o texto autorizado del candidato pendiente y definir publicación versionada a los servicios y frontend. La presencia de una cita literal no demuestra que toda la afirmación quede respaldada.

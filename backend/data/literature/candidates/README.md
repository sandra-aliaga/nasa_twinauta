# Corpus bibliográfico candidato para TwinNauta

Fecha de búsqueda: 14 de noviembre de 2026. Entrega BE-14. Contiene **27 publicaciones candidatas**, identificadas entre **130 resultados recuperados y 120 identificadores únicos**, más un registro institucional oficial NASA. No es una revisión sistemática exhaustiva ni una biblioteca de evidencia ya aprobada.

## Qué hay disponible

- [`corpus.json`](corpus.json): DOI, PMID, PMCID, título, autores completos, año, revista, fecha, abstract cuando existe, enlaces de texto completo y procedencia por registro.
- [`bibliography.md`](bibliography.md): lista navegable de las 27 publicaciones y su uso potencial.
- [`selection.json`](selection.json): selección manual, entorno, temas y motivo de candidatura. No se eligieron publicaciones solo para alcanzar una cuota.
- [`comparison_questions.json`](comparison_questions.json): preguntas de contraste y posibles solapamientos de cohortes. Son preguntas pendientes, no aristas causales validadas.
- [`search_manifest.json`](search_manifest.json): seis consultas exactas, URLs, fecha UTC, resultados totales y registros recuperados.
- [`raw/`](raw/): respuestas JSON originales de Europe PMC y una respuesta oficial NTRS.
- [`raw_sha256.json`](raw_sha256.json): hashes locales de las respuestas originales. Aseguran reproducibilidad local del material conservado; no son firmas del proveedor.
- [`institutional_sources.json`](institutional_sources.json): documento NASA separado de los ensayos y las revisiones científicas.

Los 27 registros tienen DOI y PMID; se conserva PMCID cuando el índice lo ofrece. Hay 26 abstracts y un candidato sin abstract, marcado `title_only_no_abstract` y `environment: not_confirmed`. Los enlaces OA reflejan lo informado por Europe PMC: no afirman licencia uniforme, acceso a datos individuales ni que se haya descargado y revisado cada texto completo.

## Fuentes formales

Metadatos: **Europe PMC. RESTful Web Service**, endpoint `https://www.ebi.ac.uk/europepmc/webservices/rest/search`, `resultType=core`, JSON. Cada consulta y localizador de resultado se conserva en el manifiesto y en `corpus.json`. La API aporta bibliografía y abstracts indexados; no aporta por sí misma una evaluación de calidad.

Fuente institucional: **Taoufik, S. D., Coffey, K. M., & Francisco, D. R. (2025).** *Astronaut Physiological Deconditioning and Exercise Prescription Countermeasures in Spaceflight*. NASA/SP−20250000273. [Registro oficial NTRS](https://ntrs.nasa.gov/citations/20250000273), [metadatos originales](raw/nasa_sp_20250000273_metadata.json). Es una publicación institucional de contexto, no un ensayo adicional. Su registro distingue distribución pública de condiciones de copyright, que se conservan sin reinterpretar.

Las referencias formales de los artículos están en la bibliografía y los identificadores de `corpus.json`. Entre las semillas están Scott 2020, Trappe 2024, Cromwell 2018 y Ploutz-Snyder 2018. El estudio SPRINT en vuelo de 2020 y el análisis de 46 astronautas de 2023 se recuperaron mediante una consulta dirigida para no perderlos por el ranking de las búsquedas recientes.

## Qué puede usarse ahora

Puede alimentar un **catálogo de descubrimiento**: búsqueda por título, autor, año, entorno y tema; navegación a DOI/PMC; selección de estudios que Medicina debe revisar. Los temas `status`, `evolution` y `countermeasures` son etiquetas de navegación. `measurement_protocol`, `recovery`, `mechanisms` y `population_transfer` ayudan a identificar el papel potencial de una publicación.

Todos los artículos conservan `review_status: identified_not_fulltext_audited`, `model_parameter_eligible: false`, `clinical_action_eligible: false` y `effect_estimates: []`. El abstract original no es un resumen clínico aprobado por TwinNauta. La clasificación del entorno se apoya en el abstract cuando está indicado; los tipos de publicación se conservan tal como los entrega el índice. Una etiqueta bibliográfica `research-article` no convierte un metaanálisis en un ensayo primario.

No se modificaron la aplicación, contratos, reglas, modelos ni recomendaciones. Este corpus debe pasar por el esquema público de biblioteca que acuerde el equipo antes de exponerse mediante endpoints.

## Conclusiones iniciales para revisar

1. **Separar tamaño y función.** Los abstracts de SPRINT, BRACE y NMES describen efectos diferentes según magnitud e intervención. Una conexión temática puede vincularlos para exploración; no demuestra una conversión validada de área o volumen a torque. Consultar las preguntas `compare_size_and_function` y sus referencias.
2. **La forma temporal requiere dominio.** Scott 2020 describe una cohorte y un periodo específicos. La revisión de Marusic et al. de 2021 (PMID 33703945) modela pérdida no uniforme sobre estudios con duraciones distintas. Es un contraste de generalización, no prueba de que el ajuste original sea incorrecto.
3. **Publicación no equivale a muestra independiente.** El protocolo NASA de 2018 describe estudios integrados que comparten sujetos. Deben mapearse participantes, grupos y medidas antes de sumar evidencia entre artículos. Las familias de posible solapamiento son una cola de revisión.
4. **Entorno, sexo, edad y región importan.** El corpus incluye vuelo, reposo en cama, suspensión unilateral y síntesis mixtas. Incluye trabajos recientes en mujeres y mayores para detectar límites de transferencia, sin usarlos como sustitutos automáticos del cuádriceps del caso virtual.
5. **Metadatos abiertos no son datasets abiertos.** El corpus da enlaces de publicaciones, no garantiza CSV individuales ni autoriza reutilizar coeficientes o prescribir contramedidas.

## Qué falta auditar

Para cada publicación seleccionada: texto completo y suplementos; población y muestra; protocolo, variable y unidad exactas; estadísticos y localizadores; intervalo temporal; riesgo de sesgo y limitaciones; datos y licencia; independencia de cohorte; posibles correcciones o retractaciones. Los efectos cuantitativos siguen vacíos hasta esa extracción. Los resultados contradictorios deben cotejar magnitudes, grupos y métodos antes de presentarse como contradicciones.

Prioridad: auditar las cuatro semillas NASA y su independencia; después los contrastes de vuelo, BRACE/AGBRESA y tamaño-fuerza. Los metaanálisis sirven para encontrar estudios y heterogeneidad, pero necesitan mapear sus ensayos incluidos para evitar doble conteo. No promover automáticamente un registro a `reviewed` por disponer de abstract o DOI.

## Reproducción

Desde la raíz del proyecto, con Python estándar:

```bash
python backend/data/literature/candidates/fetch_candidates.py
python backend/data/literature/candidates/build_index.py
```

El primer comando requiere Internet y vuelve a consultar las seis búsquedas; conserva la primera página de hasta 40 registros por consulta. Los resultados actuales y la fecha de recuperación pueden cambiar. Dos búsquedas tenían más de 40 resultados; no se paginaron exhaustivamente. El segundo reconstruye el corpus a partir de la selección manual y de las respuestas conservadas.

La respuesta NTRS se conserva aparte. Para actualizarla:

```bash
curl -fLsS https://ntrs.nasa.gov/api/citations/20250000273 -o backend/data/literature/candidates/raw/nasa_sp_20250000273_metadata.json
```

Los scripts no instalan dependencias, descargan PDFs por suscripción ni realizan solicitudes a autores. Repetir consultas puede cambiar metadatos; revisar el diff antes de sustituir una versión de corpus utilizada por una evaluación guardada.

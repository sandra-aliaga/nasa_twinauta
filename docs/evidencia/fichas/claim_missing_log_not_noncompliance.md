# claim_missing_log_not_noncompliance: Un registro de ejercicio ausente no demuestra que la sesión no se realizó

- Estado: corrected
- Investigado: 2026-11-15 por Claude (sesión principal, con el método de evidence-researcher, solo con fuentes locales)
- Corregido: 2026-11-15 según verificaciones/claim_missing_log_not_noncompliance.md (veredicto corrected)
- Revisión de Medicina: pendiente

## Pregunta e hipótesis

Pregunta: cuando una sesión de ejercicio prevista no tiene registro, ¿puede TwinNauta interpretarla como sesión no realizada (incumplimiento) o como causa de pérdida muscular?

Hipótesis de partida: no. La ausencia de registro es un problema de calidad del dato. Solo indica que falta información; no es una observación de que la sesión no ocurrió. La acción correcta es confirmar y corregir el registro.

Qué la refutaría o modificaría: (a) un documento operativo de NASA que defina la sesión sin registro como sesión omitida a efectos de seguimiento; (b) evidencia de que en vuelo el registro de ejercicio es automático y completo, de modo que su ausencia implique casi siempre que no hubo ejercicio.

Naturaleza de la afirmación: es una regla operativa y epistemológica (ausencia de registro frente a ausencia del evento), no un resultado fisiológico medido. Ninguna publicación puede "probarla" como una tasa; lo que puede hacerse es comprobar que es coherente con cómo NASA recoge y supervisa los datos de ejercicio, y que Medicina la acepte.

## Datos para el contrato

```json
{
  "sources": [
    {
      "id": "src_ochmo_tb_031_2023",
      "title": "NASA Office of the Chief Health and Medical Officer. Exercise Overview. NASA-STD-3001 Technical Brief OCHMO-TB-031, 10/02/2023.",
      "url": "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-031-exercise-overview.pdf",
      "locator": "p. 13 (ACERS monitor crew fitness in-flight; crew data monitored from the ground, including time and intensity of exercise performed); p. 21, Design Considerations (required data collection capability to track crewmember performance). Copia local: backend/data/raw/research_pending/ochmo-tb-031-exercise-overview.pdf, SHA-256 3bf5e2cd008761da166d00c8fe1b8c2698f82cc8c60112509f7f4eb5e00d898d.",
      "review_status": "pending",
      "version": "10/02/2023",
      "license": null
    },
    {
      "id": "src_nasa_sp_20250000273",
      "title": "Taoufik SD, Coffey KM, Francisco DR. Astronaut physiological deconditioning and exercise prescription countermeasures in spaceflight. NASA SP-20250000273, enero de 2025.",
      "url": "https://www.nasa.gov/wp-content/uploads/2025/02/sp-20250000273.pdf",
      "locator": "p. 12 (exercise practices are monitored and updated as needed by ASCR specialists); p. 19 (communication delays with the ground support team make it difficult to monitor crewmembers' activity). Copia local: backend/data/raw/research_pending/nasa-sp-20250000273.pdf, SHA-256 3593d09a24f17678b7ab2d9538f4fce8f57e7baa000a171fe7a8c1ca3c10d3bd.",
      "review_status": "pending",
      "version": "SP-20250000273 (enero de 2025)",
      "license": null
    },
    {
      "id": "src_ntrs_20130009882",
      "title": "Moore C. ISS Exercise Equipment Highlights. Presentación HRP/NSBRI, 11/02/2013. NTRS 20130009882.",
      "url": "https://ntrs.nasa.gov/citations/20130009882",
      "locator": "Diapositivas 3 (ARED: 'manually captured in Excel since 6/1/11'), 4 (T2), 5 (CEVIS: duración y marcas de tiempo), 7 (estado del hardware). Localizado por evidence-verifier; no releído en la ficha.",
      "review_status": "pending",
      "version": null,
      "license": null
    },
    {
      "id": "src_ntrs_20140012615",
      "title": "Hanson A, Peters B, Caldwell E, Sinka J, Kreutzburg G, Ploutz-Snyder L. Portable Load Measurement Device for Use During ARED Exercise on ISS. Presentación, 12/02/2014. NTRS 20140012615.",
      "url": "https://ntrs.nasa.gov/citations/20140012615",
      "locator": "Resumen en NTRS: 'No ARED data has been recorded since mid-2011 due to failures in the instrumentation power system'. Localizado por evidence-verifier.",
      "review_status": "pending",
      "version": null,
      "license": null
    }
  ],
  "claim": {
    "id": "claim_missing_log_not_noncompliance",
    "statement": "Una sesión de ejercicio prevista sin registro indica que falta información, no que la sesión no se realizó. TwinNauta la muestra como 'sin registro', no la cuenta como cero minutos ni la usa para inferir incumplimiento, lesión o pérdida muscular, y propone confirmar y corregir el registro con la tripulación o con los especialistas de ejercicio en Tierra, según decida Medicina.",
    "kind": "operational_rule",
    "source_ids": [
      "src_ochmo_tb_031_2023",
      "src_nasa_sp_20250000273",
      "src_ntrs_20130009882",
      "src_ntrs_20140012615"
    ],
    "population": "No aplica a una población medida: regla sobre el tratamiento de registros de ejercicio de la tripulación en el software.",
    "sample_size": null,
    "environment": "spaceflight",
    "limitations": [
      "Regla operativa propuesta por el equipo; las fuentes NASA describen la supervisión de datos de ejercicio, pero no enuncian esta regla literalmente.",
      "La documentación pública de NTRS (2013-2014) describe datos de dispositivo con marcas de tiempo en T2 y CEVIS, anotación manual en Excel de los datos de ARED desde el 1/6/2011 y fallos de instrumentación (ARED sin datos registrados desde mediados de 2011). No se encontró documentación pública actual sobre el flujo de registro, la tasa de registros ausentes ni una definición operativa de sesión omitida o de cumplimiento.",
      "Las fuentes sobre el registro en la ISS son de 2013-2014; la configuración actual de ARED, T2 y CEVIS puede haber cambiado y no se verificó.",
      "OCHMO-TB-031 y SP-20250000273 proceden de la misma oficina (OCHMO) y el SP cita al TB: no son corroboración independiente.",
      "No establece qué hacer si la ausencia de registro se repite; esa política corresponde a Medicina y a los especialistas de ejercicio.",
      "'environment' marca el contexto de aplicación (vuelo); no es un resultado medido en vuelo."
    ],
    "review_status": "pending"
  }
}
```

## Extracción

Texto leído en las copias locales, convertido con `pdftotext -layout`; páginas contadas por saltos de página del PDF.

- OCHMO-TB-031, p. 13: los especialistas de fuerza, acondicionamiento y rehabilitación de astronautas (ACERS) supervisan la condición física en vuelo y elaboran prescripciones según la capacidad y el rendimiento. Los datos de la tripulación se supervisan desde Tierra, incluidos marcadores fisiológicos y el rendimiento, como el tiempo y la intensidad del ejercicio realizado. Las prescripciones de fuerza dependen del equipo disponible.
- OCHMO-TB-031, p. 21 (Design Considerations): entre los aspectos que deben considerar los diseñadores de vehículos figura la capacidad de recogida de datos necesaria para seguir el rendimiento de la tripulación (frecuencia cardiaca, VO2max, etc.).
- SP-20250000273, p. 12: las prácticas de ejercicio se supervisan y actualizan según sea necesario y se aplican en tiempo real con los astronautas desplegados, a cargo de especialistas.
- SP-20250000273, p. 19: en misiones más lejanas, los retrasos de comunicación con el equipo de Tierra dificultan supervisar la actividad de la tripulación y dar recomendaciones; el reabastecimiento limitado complica las reparaciones del equipo de ejercicio.

Lectura: la supervisión de NASA depende de que los datos de ejercicio se recojan y lleguen a Tierra, y NASA reconoce que esa supervisión será más difícil con retrasos de comunicación. Que un dato no haya llegado o no se haya registrado es, por tanto, una situación esperable que no equivale a que el ejercicio no ocurriera. Esta inferencia es del equipo, no una cita.

No hay población, muestra ni valores numéricos que extraer.

## Contraevidencia e independencia

- No se hizo una segunda búsqueda web, para limitar el consumo en esta sesión. Queda pendiente (ver abajo). Por tanto no se buscó documentación que defina operativamente la sesión sin registro como omitida.
- Las dos fuentes son institucionales de NASA y comparten organismo y tema; no son independientes en sentido estricto. Son documentos de referencia, no estudios revisados por pares.
- Riesgo contrario a vigilar: si en vuelo el dispositivo registra automáticamente cada sesión, una ausencia sería más informativa. Incluso en ese caso, la ausencia podría deberse a fallo del dispositivo o de la transmisión, lo que mantiene la regla de no inferir sin confirmar.

## Comparación con NASA

- Capacidad existente: los especialistas de NASA supervisan en vuelo los datos de ejercicio y ajustan prescripciones (OCHMO-TB-031 p. 13; SP-20250000273 p. 12). TwinNauta no reemplaza esa función.
- Brecha relacionada: MA-201 (contramedidas musculares y aeróbicas, incluida su supervisión). Su página no se consultó en esta sesión; la descripción procede de `backend/data/raw/research_pending/README.md`.
- La regla no aporta capacidad nueva a NASA: es una salvaguarda de interpretación para el software.

## Conclusión

Tras la verificación: la segunda búsqueda (NTRS 20130009882 y 20140012615) muestra que en la ISS coexisten registro de dispositivo y anotación manual, con fallos de instrumentación documentados. Una sesión realizada puede quedar sin datos, lo que refuerza la regla. No se encontró una definición pública de sesión omitida.

Mantener como regla operativa (`kind: operational_rule`), con la redacción de `statement`. No es evidencia fisiológica y no debe mostrarse como tal en el grafo. Sustenta dos comportamientos ya implementados en la interfaz: la sesión sin registro se dibuja como contorno discontinuo, nunca como 0 minutos, y la acción propuesta es revisar el registro. Requiere que Medicina la acepte o la corrija.

## No verificado y siguiente contraste

1. Cómo se registran las sesiones de ejercicio en la ISS (ARED, T2, CEVIS): registro automático del dispositivo, anotación manual o ambos. Siguiente paso: buscar en NTRS documentación de operaciones de ejercicio o preguntar a Medicina.
2. Si NASA define formalmente "sesión omitida" para el seguimiento de cumplimiento. Siguiente paso: búsqueda dirigida en NTRS y en NASA-STD-3001 Vol. 1.
3. La página de la brecha MA-201 no se releyó en esta sesión.

## Registro de búsqueda

- 2026-11-15: lectura local de `backend/data/raw/research_pending/README.md`.
- 2026-11-15: extracción de texto con `pdftotext -layout` de `ochmo-tb-031-exercise-overview.pdf` y `nasa-sp-20250000273.pdf` (copias locales; URLs originales en `sources`). Términos buscados: log, record, track, compliance, adherence, missed, monitor, telemetry, downlink.
- No se hicieron búsquedas web en esta sesión.

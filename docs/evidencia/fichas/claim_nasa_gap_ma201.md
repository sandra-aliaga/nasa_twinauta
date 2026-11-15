# claim_nasa_gap_ma201: Brecha documentada por NASA (HRR MA-201) sobre contramedidas de ejercicio musculares y aeróbicas, incluidas estrategias con recursos limitados

- Estado: corrected
- Investigado: 2026-11-15 por evidence-researcher
- Corregido: 2026-11-15 según verificaciones/claim_nasa_gap_ma201.md (veredicto corrected)
- Revisión de Medicina: pendiente

## Pregunta e hipótesis

Pregunta: ¿qué documenta exactamente NASA en la brecha MA-201 del Human Research Roadmap (HRR): texto, riesgo asociado, tareas y entregables, estado y fecha? ¿Qué parte es brecha reconocida por NASA y qué parte es limitación inferida por el equipo de TwinNauta?

Hipótesis de partida (de `backend/data/raw/research_pending/README.md`, sección 4): MA-201 reconoce dificultad para aislar el efecto de dispositivos y prescripciones, respuestas individuales distintas y limitaciones de los análogos idealizados frente a restricciones de misión; por ello no puede presentarse una tasa única de reposo en cama como resultado inevitable de no entrenar en vuelo.

Qué la refutaría o modificaría: (a) que la página oficial no contenga esos elementos o que la brecha esté cerrada; (b) que el texto de NASA no mencione recursos limitados o monitorización; (c) que documentos NASA posteriores declaren resuelto el problema de las contramedidas para exploración.

Naturaleza de la afirmación: es una afirmación documental sobre el estado de conocimiento declarado por NASA, no un resultado fisiológico medido. Sirve como contexto del grafo, no como respaldo cuantitativo.

## Datos para el contrato

```json
{
  "sources": [
    {
      "id": "src_hrr_gap_ma201",
      "title": "NASA Human Research Program, Human Research Roadmap. Gap MA-201: Determine the required exercise countermeasure or countermeasures (i.e., modality or modalities, prescription, monitoring) to protect mission-specific task performance and crew health outcomes.",
      "url": "https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833",
      "locator": "Secciones Description (Present state of knowledge; Research approach), Target for Closure, Risk, Tasks (Active, Planned-Funded, Completed, Terminated). Línea 'Last Published: 05/13/25 12:40:15 PM (Central)'. Consultada 2026-11-15.",
      "review_status": "pending",
      "version": "Last Published 05/13/25 12:40:15 PM (Central)",
      "license": null
    },
    {
      "id": "src_hrr_risk_muscle_aerobic",
      "title": "NASA Human Research Program, Human Research Roadmap. Risk of Mission Performance Decrements and Adverse Health Outcomes Resulting from Reduced Cardiorespiratory and Musculoskeletal Fitness (short title: Muscle and Aerobic).",
      "url": "https://humanresearchroadmap.nasa.gov/Risks/?i=180",
      "locator": "Encabezado del riesgo, tabla de LxC y disposición por categoría de misión de referencia (DRM), lista de brechas. Línea 'Last Published: 05/13/25 12:40:12 PM (Central)'. Solo se leyeron los primeros 100000 caracteres de la página. Consultada 2026-11-15.",
      "review_status": "pending",
      "version": "Last Published 05/13/25 12:40:12 PM (Central)",
      "license": null
    },
    {
      "id": "src_hrr_task_mass",
      "title": "NASA Human Research Program, Human Research Roadmap. Task: Development of a Muscle Adaptation in Space-flight Simulator (\"MASS\"), PI Blemker, Silvia. Terminated.",
      "url": "https://humanresearchroadmap.nasa.gov/Tasks/?i=2197",
      "locator": "Status, nota de terminación, descripción, gaps addressed, deliverables. Last Published 05/13/25 12:40:20 PM (Central). Consultada 2026-11-15.",
      "review_status": "pending",
      "version": "Last Published 05/13/25 12:40:20 PM (Central)",
      "license": null
    },
    {
      "id": "src_nasa_sp_20250000273",
      "title": "Taoufik SD, Coffey KM, Francisco DR. Astronaut physiological deconditioning and exercise prescription countermeasures in spaceflight. NASA SP-20250000273, enero de 2025.",
      "url": "https://www.nasa.gov/wp-content/uploads/2025/02/sp-20250000273.pdf",
      "locator": "p. 18 (párrafo tras Figura 7 y Discussion), p. 19 (exploración: duración, vehículos, masa y almacenamiento, retrasos de comunicación, reabastecimiento), p. 20 (nuevos sistemas). Copia local: backend/data/raw/research_pending/nasa-sp-20250000273.pdf, SHA-256 3593d09a24f17678b7ab2d9538f4fce8f57e7baa000a171fe7a8c1ca3c10d3bd.",
      "review_status": "pending",
      "version": "SP-20250000273 (enero de 2025)",
      "license": null
    },
    {
      "id": "src_ochmo_tb_031_2023",
      "title": "NASA Office of the Chief Health and Medical Officer. Exercise Overview. NASA-STD-3001 Technical Brief OCHMO-TB-031, 10/02/2023.",
      "url": "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-031-exercise-overview.pdf",
      "locator": "p. 1 (Executive Summary; Relevant Technical Requirements), p. 21 (Design Considerations). Copia local: backend/data/raw/research_pending/ochmo-tb-031-exercise-overview.pdf, SHA-256 3bf5e2cd008761da166d00c8fe1b8c2698f82cc8c60112509f7f4eb5e00d898d.",
      "review_status": "pending",
      "version": "10/02/2023",
      "license": null
    }
  ],
  "claim": {
    "id": "claim_nasa_gap_ma201",
    "statement": "Según la versión de la página HRR publicada el 05/13/25 y consultada el 2026-11-15, NASA mantiene abierta la brecha MA-201: no está definida la contramedida o combinación de contramedidas de ejercicio (modalidad, prescripción, monitorización) que proteja el rendimiento en tareas de misión y la salud de la tripulación, incluidas estrategias para cuando los recursos de misión sean limitados. NASA declara que la eficacia relativa de cada contramedida no se ha determinado, que el sistema actual no ha prevenido el desacondicionamiento en todos los individuos, que no es factible para misiones de exploración cuando los recursos sean más limitados y que los análogos usaron prescripciones idealizadas. TwinNauta usa esta brecha como contexto: no la resuelve ni genera nuevas mediciones.",
    "kind": "operational_rule",
    "source_ids": [
      "src_hrr_gap_ma201",
      "src_hrr_risk_muscle_aerobic",
      "src_hrr_task_mass",
      "src_nasa_sp_20250000273",
      "src_ochmo_tb_031_2023"
    ],
    "population": "No aplica a una población medida: declaración institucional de NASA sobre el estado del conocimiento de contramedidas de ejercicio para tripulaciones de vuelo espacial.",
    "sample_size": null,
    "environment": "spaceflight",
    "limitations": [
      "Afirmación documental (estado de conocimiento declarado por NASA), no resultado fisiológico medido; no aporta tasas ni umbrales.",
      "El enum 'kind' del contrato no tiene un valor para 'brecha documentada'. 'operational_rule' es provisional y no adecuado: podría hacer que una brecha de conocimiento se trate como fundamento de acciones. Se recomienda añadir un valor como 'documented_gap' (cambio de contrato a acordar con Backend y Medicina).",
      "El texto de la página HRR se leyó mediante una herramienta de extracción automática con citas fragmentadas; falta una lectura humana directa que confirme la literalidad.",
      "La página no muestra fecha de apertura ni fecha objetivo de cierre; solo 'Last Published 05/13/25'. No se verificó si hubo cambios posteriores a la consulta.",
      "'environment' indica el contexto (vuelo espacial y exploración); la brecha también se nutre de análogos terrestres (reposo en cama, HERA, vuelo parabólico).",
      "Que NASA reconozca la brecha no implica que TwinNauta la cubra: una visualización o simulación sin nuevas mediciones no cierra MA-201.",
      "Todas las fuentes son de NASA; no hay corroboración externa independiente.",
      "SP-20250000273 p. 18 presenta el sistema actual de la ISS como suficiente apoyándose en Scott et al. 2023, cuyo resumen indica que el ejercicio no protegió por completo frente al desacondicionamiento multisistémico; solo se leyó ese resumen."
    ],
    "review_status": "pending"
  }
}
```

## Extracción

Tipo de publicación: registro institucional de brecha del Human Research Roadmap (HRP), no artículo revisado por pares. Acceso: la página cargó el 2026-11-15; se leyó mediante WebFetch, que devuelve el texto procesado y limita las citas a fragmentos cortos. Las citas siguientes son los fragmentos devueltos; no se guardó copia local de la página.

### Identificación y estado (página MA-201)

- Título: "MA-201: Determine the required exercise countermeasure or countermeasures" / "(i.e., modality or modalities, prescription, monitoring) to protect mission-specific task performance" / "and crew health outcomes."
- Estado: Open.
- Fecha: "Last Published: 05/13/25 12:40:15 PM (Central)". No se muestra fecha de apertura ni fecha objetivo de cierre.
- Historial: la página indica que la brecha procede de la división y fusión de brechas anteriores (M7, A7, M9, A9).
- Elemento responsable: la página de la brecha no lo indica; la página del riesgo indica "Human Health Countermeasures (HHC)".
- Plan asociado: "Muscle and Aerobic Risk Approach plan" (enlace relativo `../schedules/?i=180`, no consultado). Según la extracción, la página no ofrece documentación adjunta.

### Description: Present state of knowledge (citas por fragmentos)

1. "Studies documenting the efficacy of current exercise countermeasures to spaceflight-induced deconditioning" / "are limited to experiences on Skylab, the Russian space stations, and the International Space Station" / "when multiple countermeasures were employed" / "making inferences about the effectiveness of any one countermeasure device and prescription difficult."
2. "Each countermeasure was implemented to address specific aspects of deconditioning" / "(i.e., decreased muscle strength and endurance, reduced maximal aerobic capacity, reduced ambulatory capability)" / "but no study has determined the relative efficacy of individual countermeasures."
3. "Though the current countermeasure system has been advantageous for extended missions in low Earth orbit" / "it has not proven able to prevent deconditioning in all individuals."
4. "Further, this approach is not feasible for exploration missions when resources will be more limited" / "and exercise countermeasure systems greatly constrained."
5. "Spaceflight analogs, such as bed rest, that have investigated the efficacy of countermeasures" / "largely have utilized idealized countermeasure prescriptions," / "devices that are not in a configuration suitable for spaceflight," / "were not structured to meet mission constraints," / "and typically have not evaluated the effects on performance of mission-specific tasks."

### Description: Research approach

"Prospective human spaceflight and analog studies to characterize the acute responses" / "(i.e., physiological, biomechanical)" / "and chronic adaptations (e.g., training, injury potential)" / "to performance of current and candidate exercise countermeasures" / "as well as retrospective analyses to identify the relative efficacy of different approaches" / "to exercise countermeasures and prescription."

### Target for Closure

"Definition of an exercise countermeasure or countermeasures" / "(i.e., modality or modalities, prescription, monitoring)" / "to protect mission-specific task performance and crew health outcomes," / "including mitigation strategies for use when mission resources are limited."

"Leveraging data from spaceflight (e.g., CIPHER), spaceflight analogs (e.g., HERA, bed rest, parabolic flight)," / "and ground studies (e.g., Orion Flywheel Training Study)" / "with current and future spaceflight-relevant countermeasures" / "will identify operationally relevant approaches to maintain crew health and performance" / "for each design refence mission." (la errata "refence" aparece así en la extracción).

### Riesgo asociado (página del riesgo, `Risks/?i=180`)

- Título: "Risk of Mission Performance Decrements and Adverse Health Outcomes Resulting from Reduced Cardiorespiratory and Musculoskeletal Fitness". Título corto: "Muscle and Aerobic". Última publicación: 05/13/25 12:40:12 PM (Central).
- Enunciado (fragmentos): "Given that exposure to a reduced gravity environment causes cardio-respiratory" ... "there is a risk of impaired mission task performance and adverse health outcomes." La parte intermedia no se obtuvo literalmente.
- Tabla LxC y disposición por categoría de misión de referencia, tal como la devolvió la extracción (Operations / Long-Term Health):

| DRM | Operations | Long-Term Health |
| --- | --- | --- |
| Low Earth Orbit, Short (<30 days) | 5x1, Accepted with Optimization | 3x1, Accepted |
| Low Earth Orbit, Long (30 days-1 year) | 5x1, Requires Characterization | 5x2, Accepted with Optimization |
| Lunar Orbital, Short (<30 days) | 5x1, Accepted with Optimization | 3x1, Accepted |
| Lunar Orbital, Long (30 days-1 year) | 5x1, Requires Characterization | 5x2, Accepted with Optimization |
| Lunar Orbital + Surface, Short (<30 days) | 5x2, Requires Characterization | 3x1, Accepted with Optimization |
| Lunar Orbital + Surface, Long (30 days-1 year) | 5x3, Requires Mitigation | 5x2, Requires Characterization |
| Mars, Preparatory (<1 year) | 5x2, Requires Mitigation | 5x2, Requires Characterization |
| Mars Planetary (730-1224 days) | 5x4, Requires Mitigation | 5x3, Requires Mitigation |

  Esta tabla procede de una extracción automática de una página de unos 188000 caracteres, de la que solo se leyeron los primeros 100000. Debe confirmarse por lectura directa antes de cargarla en el grafo. No se interpretó el significado de L y C más allá de su rótulo.
- Brechas del riesgo listadas: MA-101, MA-102, MA-201, MA-202, MA-301, M1 (títulos de MA-202, MA-301 y M1 no obtenidos).

### Tareas y entregables listados en MA-201

Activas:
- "Dose-Response Study of Musculoskeletal Outcomes Following Centrifugation in Adult Mice on ISS (Bouxsein)" (MHU-8). Estado "Currently funded and in progress". Tres entregables de categoría "Risk Characterization, Quantification": curva dosis-respuesta musculoesquelética 0-1G, umbral G recomendado para centrifugación, comprensión de la gravedad parcial. Modelo animal (ratón), no humano.
- "Exploration Exercise Treadmill Requirements" (Zero T2), PI Marshall-Goebel, Karina. Un entregable, categoría "Countermeasure", subcategoría "Protocol". Texto (fragmentos): "In this study, we will determine the relative importance of treadmill use during spaceflight on performance decrements" / "immediately after landing, as well as the recovery time back to baseline for bone health, muscle performance," / "aerobic fitness, and sensorimotor performance." / "These data are necessary to define exercise system requirements and inform exploration vehicle design in order" / "to avoid cost and schedule impacts associated with vehicle system re-design." / "Additionally, this study aims to identify and validate an exploration countermeasure (E4D) for the maintenance" / "of muscle and aerobic function."

Planificada con financiación:
- "Efficacy of Orion Flywheel Exercise Training in Ambulatory Subjects (Flywheel Ground Efficacy - Exploration Exercise)", PI Prejean, Brian. Estado "Planned-Funded", "Task expected to be within budget". Sin entregables listados.

Completadas (según la página): Adams-Flywheel, AEC Evaluation and Selection, ARED Kinematics-Ground, C-RED, CCFCES, CCFG, CFREU, CSM Harness Study, ESPRIT, Exercise Compliance and Motivation (PI Feltz; entregable "Technology or Tool", software de compañeros de ejercicio generados por software; elemento Human Factors and Behavioral Performance), Exercise Training on Compact Equipment (PI Ploutz-Snyder; prototipo de volante de inercia y protocolo para reposo en cama), Inflight Loading, Metabolomic Profiles, Musculoskeletal Outcomes (PI Ploutz-Snyder), Musculoskeletal Simulation (PI Hanson; modelo biomecánico de sentadilla en LifeModeler), Partial-gravity analog in rats, SPRINT (PI Ploutz-Snyder; entregable "Countermeasure", "Clinical Procedure/Prescription", protocolo para minimizar tiempo de ejercicio), Sweat Rates, Testosterone, Treadmill Kinematics.

Terminadas:
- ARED Kinematics (PI Ferrigno): "THIS TASK WAS DESCOPED AND NO LONGER FUNDED BY HRP."
- MASS, "Development of a Muscle Adaptation in Space-flight Simulator", PI Blemker, Silvia: "DESCOPED and then DEFUNDED due to a shift in strategic planning." Según su página de tarea, buscaba "develop a multiscale computational model that can predict changes in muscle structure and function" (OpenSim de cuerpo completo, elementos finitos de tejido muscular y modelos basados en agentes de células musculares), con entregable "Technology or Tool" (código fuente y documentación) a verificar y validar según NASA-STD-7009. Brechas asociadas: MA-101, MA-201, MA-301. Sin fechas de inicio o fin en la página.

Fechas de entregables: la página no muestra nombres ni fechas de la mayoría de los entregables; no se reconstruyeron.

### Fuentes locales contrastadas

- SP-20250000273, p. 18: "current exercise hardware and practices are sufficient in maintaining crewmember muscular strength, bone mineral density, and cardiorespiratory fitness as required by NASA-STD-3001 for spaceflight missions to the ISS." (a partir de SPRINT y Scott et al.). Misma página: los requisitos técnicos de NASA-STD-3001 son suficientes "for the current environment".
- SP-20250000273, p. 19: los requisitos funcionales de cada fase de misiones Artemis/Marte "have not been sufficiently defined to determine whether current countermeasures will be adequate"; limitaciones de "mass and storage availability" condicionarán las contramedidas; los retrasos de comunicación dificultan "monitor the crewmembers' activity and provide feedback and recommendations"; el reabastecimiento limitado dificulta reparar el equipo de ejercicio. Propone valorar si los estándares deben ser más estrictos para misiones largas.
- SP-20250000273, p. 20: menciona juegos de realidad virtual para motivación, dispositivos avanzados y gravedad artificial como enfoques en investigación.
- OCHMO-TB-031, p. 1: el grado de desacondicionamiento "varies per individual" y depende de condición inicial, edad, duración de misión y nivel de gravedad. Lista requisitos NASA-STD-3001 relevantes ([V1 4023], [V1 4024], [V2 7038], [V2 7040], entre otros).
- OCHMO-TB-031, p. 21 (Design Considerations): limitaciones de vehículo (vibración, fuerza resistiva, masa, potencia, volumen) y "The required data collection capability to track crewmember performance".
- `backend/data/raw/research_pending/README.md`, sección 4: resume MA-201 como contraste crítico. Lo comprobado hoy coincide en lo esencial (dificultad para aislar efectos, desacondicionamiento no prevenido en todos, análogos idealizados). Matiz: la página no usa la expresión "respuestas individuales diferentes"; dice "has not proven able to prevent deconditioning in all individuals". La variabilidad individual explícita figura en OCHMO-TB-031 p. 1.

Transformaciones: ninguna; solo traducción al español en los resúmenes, con citas en inglés.

## Contraevidencia e independencia

Segunda búsqueda (2026-11-15), dirigida a comprobar si la brecha sigue vigente o si documentos posteriores la contradicen:

- NASA, "Muscle Risk" (publicada 11/03/2025, actualizada 20/08/2025): con adherencia y sistemas adecuados, en promedio la tripulación vuelve "with minimal losses of muscle size, strength, and endurance"; "New exploration countermeasures systems will be different from ISS" y podrían no permitir el ejercicio requerido. Coherente con MA-201: el éxito en ISS es promedio y condicionado; la incertidumbre se sitúa en exploración. La página indicaba un aviso de no actualización durante una interrupción de financiación federal.
- NTRS 20240008206 (resumen, MCO Mid-Year Review, mayo 2024; Kalogera y Wood): las restricciones de masa, potencia y volumen han llevado a dispositivos motorizados de volante de inercia sin cinta; los efectos de esas modalidades sobre músculo, hueso, capacidad aeróbica y sensoriomotricidad "not well understood". Describe Zero T2 con tres brazos.
- NTRS 20240016101 (póster, HRP IWS, enero 2025; Varanoske, Prejean, ..., Marshall-Goebel): Zero T2 en curso, "Data collection is ongoing", 15 sujetos reclutados (4 activos, 11 control) a la fecha del póster.
- Tensión aparente, no contradicción: SP-20250000273 p. 18 declara suficientes el hardware y las prácticas actuales para ISS según NASA-STD-3001. MA-201 admite que el sistema ha sido ventajoso en órbita baja, pero que no previene el desacondicionamiento en todos los individuos y que no es factible para exploración. Ambos pueden ser ciertos: suficiencia frente a un estándar en promedio no excluye casos individuales ni resuelve el escenario con recursos limitados.
- No se encontró ningún documento que declare cerrada MA-201.

Independencia: todas las fuentes son de NASA (HRP, OCHMO, ESDMD) y comparten organismo; los dos registros NTRS proceden del equipo de Zero T2, que es a su vez una tarea de MA-201. No hay corroboración externa independiente. Para una afirmación sobre lo que NASA documenta, la fuente primaria adecuada es la propia página HRR; las demás solo muestran coherencia interna. Las conclusiones SPRINT de SP-20250000273 proceden de la misma cohorte usada en otras fichas (ver nota de afirmaciones.md sobre NCT00891449).

Añadido tras la verificación: Scott et al. 2023 (npj Microgravity, N = 46, PMC9898566), en su resumen, indica que el ejercicio "did not fully protect against multisystem deconditioning", con cambios individuales de -30 % a +5 %. Matiza la p. 18 de SP-20250000273 y es coherente con MA-201; no es independiente de NASA. El plan del riesgo (schedules/?i=180, PDF del 5/22/2024) dice "PRR Timeline is in Development" y no da fecha de cierre.

## Comparación con NASA

Brecha reconocida por NASA (literal en MA-201):
- No determinada la eficacia relativa de contramedidas individuales.
- El sistema actual no ha prevenido el desacondicionamiento en todos los individuos.
- El enfoque actual no es factible para exploración con recursos limitados.
- Los análogos usaron prescripciones idealizadas, dispositivos no configurados para vuelo, sin restricciones de misión y sin evaluar tareas de misión.
- El cierre exige definir modalidad, prescripción y monitorización, con estrategias de mitigación para recursos limitados.

Capacidades e iniciativas NASA relacionadas (no inferir ausencia):
- Supervisión de ejercicio en vuelo por especialistas y estándares NASA-STD-3001 (OCHMO-TB-031; SP-20250000273).
- Tareas activas o planificadas: Zero T2 (en vuelo, humano), Orion Flywheel (tierra), MHU-8 (ratón).
- Herramientas ya exploradas: simulación musculoesquelética (Musculoskeletal Simulation, completada), software de compañeros de ejercicio (Exercise Compliance and Motivation, completada) y un simulador multiescala de adaptación muscular (MASS, terminado por cambio de planificación estratégica). NASA ya consideró modelos predictivos musculares; TwinNauta no puede atribuirse esa idea. La terminación de MASS no demuestra que la necesidad haya desaparecido ni que esté cubierta: el motivo publicado es estratégico.

Limitaciones inferidas por el equipo (no son texto de NASA):
- Que una tasa de pérdida de reposo en cama no deba presentarse como resultado inevitable de no entrenar en vuelo: inferencia razonable a partir del punto 5 de la descripción, pero NASA no la formula así.
- Que la monitorización con retrasos de comunicación justifique apoyo local a la tripulación: SP-20250000273 p. 19 describe la dificultad; MA-201 incluye "monitoring" en el objetivo de cierre. El paso a "TwinNauta debe ofrecerlo" es propuesta del equipo.
- Que exista un hueco de experiencia de usuario o de interpretación para la tripulación: no documentado en MA-201; es hipótesis de producto.

## Conclusión

Modificar y mantener como contexto. La página oficial confirma lo esencial de la hipótesis: MA-201 está abierta (Last Published 05/13/25), incluye monitorización y estrategias para recursos limitados, y reconoce dificultad para aislar efectos, desacondicionamiento no prevenido en todos los individuos y análogos idealizados. Se modifica la redacción previa en tres puntos: (1) "respuestas individuales diferentes" no es literal de MA-201 y debe atribuirse a OCHMO-TB-031 p. 1 o citarse como "not proven able to prevent deconditioning in all individuals"; (2) se añade que NASA ya financió y terminó un simulador muscular multiescala (MASS) y completó simulación musculoesquelética, lo que limita cualquier afirmación de originalidad; (3) se separa explícitamente lo que NASA reconoce de lo que el equipo infiere. Uso en el grafo: nodo de contexto en la vista evidence, nunca como respaldo cuantitativo ni como prueba de que TwinNauta cierre la brecha.

## No verificado y siguiente contraste

1. Literalidad completa del texto HRR: se obtuvo por extracción automática con citas fragmentadas. Siguiente paso: lectura humana directa de la página (o guardar copia local con fecha) y cotejo de cada cita.
2. Tabla LxC y enunciado completo del riesgo `Risks/?i=180`: solo se leyó parte de la página y vía extracción automática. Siguiente paso: lectura directa y, si se usa, registrar versión.
3. Fecha de apertura, fecha objetivo de cierre y cronograma de MA-201: no aparecen en la página de la brecha. Siguiente paso: consultar el "Muscle and Aerobic Risk Approach plan" (`https://humanresearchroadmap.nasa.gov/schedules/?i=180`), no consultado.
4. Detalle de entregables y fechas de tareas (Zero T2, Orion Flywheel, MASS): no se consultaron las fichas de Task Book. Siguiente paso: leer los enlaces de Task Book listados en la página.
5. Resultados de Zero T2: en curso según el póster de enero 2025; no se buscaron resultados publicados posteriores.
6. No se consultaron TechPort ni el HRP Evidence Report de músculo/aeróbico; podrían documentar el estado de las contramedidas para exploración con más detalle.
7. Tipo `kind` adecuado en el contrato para una brecha documentada: decisión pendiente de Backend y Medicina.

## Registro de búsqueda

- 2026-11-15: lectura local de `docs/evidencia/README.md`, `docs/evidencia/afirmaciones.md`, esquemas `Source` y `EvidenceClaim` de `contracts/openapi.yaml`, `backend/data/raw/research_pending/README.md`, ficha `claim_missing_log_not_noncompliance.md` (formato).
- 2026-11-15: lectura local de `backend/data/raw/research_pending/nasa-sp-20250000273.pdf` pp. 18-20 y `backend/data/raw/research_pending/ochmo-tb-031-exercise-overview.pdf` pp. 1, 19-21.
- 2026-11-15: https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833 (cuatro consultas con distintas instrucciones de extracción; cargó correctamente).
- 2026-11-15: https://humanresearchroadmap.nasa.gov/Risks/?i=180 (leídos los primeros 100000 de unos 188000 caracteres).
- 2026-11-15: https://humanresearchroadmap.nasa.gov/Tasks/?i=2197 (MASS).
- 2026-11-15: búsqueda web "NASA Human Research Program MA-201 exercise countermeasure gap exploration limited resources flywheel 2025".
- 2026-11-15: https://www.nasa.gov/directorates/esdmd/hhp/muscle-risk
- 2026-11-15: https://ntrs.nasa.gov/citations/20240008206
- 2026-11-15: https://ntrs.nasa.gov/citations/20240016101
- No consultados (listados en la búsqueda o en la página): https://www.nasa.gov/hrp/human-health-countermeasures/exercise-physiology-and-countermeasures/, https://ntrs.nasa.gov/api/citations/20240015403/downloads/ASGSR%20Baumann.pdf, enlaces de Task Book de cada tarea, https://humanresearchroadmap.nasa.gov/schedules/?i=180.

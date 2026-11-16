# TwinNauta: fundamentación, justificación y relación con los ODS

**Contexto:** NASA Space Apps Challenge 2026  
**Reto:** Create Health Monitoring Software for Astronauts on Space Missions  
**Fecha de elaboración y consulta:** 15 de noviembre de 2026  
**Versión documental:** 1.0

> Documento de fundamento y presentación. Distingue antecedentes externos, decisiones del equipo y capacidades pendientes. No acredita validación clínica ni respaldo institucional de NASA al proyecto.

## 1. Resumen ejecutivo

TwinNauta es un prototipo de software que propone relacionar información de salud, anatomía y evidencia científica en un contexto de exploración espacial. Busca facilitar tres preguntas: qué información existe sobre una región, qué puede interpretarse con ella y qué siguiente paso de revisión corresponde.

El alcance inicial se concentra en cuádriceps, área transversal muscular respecto a un basal, torque de extensión de rodilla y registros de ejercicio. La frecuencia cardíaca terrestre se trata como un componente didáctico independiente. Esta selección permite trabajar un caso delimitado sin atribuir al sistema capacidad para evaluar todo el organismo.

La propuesta responde al reto mediante integración de indicadores, explicación contextual y seguimiento. Su aporte esperado es que una persona pueda consultar tanto la información como sus fuentes y límites. La utilidad de ese recorrido necesita evaluación: no se presenta como un beneficio clínico demostrado.

La relación principal con los Objetivos de Desarrollo Sostenible corresponde a los ODS 3 y 9. Los ODS 4 y 17 constituyen vínculos complementarios por aprendizaje e intercambio de conocimiento. Esta correspondencia es una interpretación del proyecto, no una certificación de Naciones Unidas.

## 2. Contexto de NASA Space Apps Challenge

NASA presenta Space Apps 2026 como un evento global de dos días, el 14 y 15 de noviembre, orientado a desarrollar soluciones utilizando datos abiertos de la agencia. [1] Este contexto permite conectar investigación, desarrollo de software y diseño con problemas de exploración.

TwinNauta aprovecha ese marco para construir una demostración fundamentada: un recorrido visible cuyas decisiones y fuentes puedan examinarse. La participación no implica adopción, certificación ni uso operacional por NASA.

### 2.1. Reto seleccionado

El título oficial es **Create Health Monitoring Software for Astronauts on Space Missions**. Su enunciado relaciona las misiones prolongadas con radiación, aislamiento, confinamiento, gravedad alterada y un entorno cerrado hostil. Menciona posibles efectos inmunológicos, óseos, cardiovasculares y conductuales. [2]

El encargo central es desarrollar software que reúna indicadores y permita a astronautas evaluar su salud y actuar. [2] TwinNauta lo interpreta como una conexión entre información, explicación y seguimiento. Anatomía 3D, grafos y enfoque muscular son elecciones del equipo, no requisitos que se atribuyan al enunciado.

**Límite de la consulta:** se verificó la descripción pública. La pestaña de recursos específicos no fue accesible mediante la herramienta de consulta. Por ello, las fuentes elegidas por el equipo no se presentan como una lista oficial y completa de recursos del reto.

## 3. Problema y necesidad

### 3.1. Contexto muscular y operacional

NASA reconoce el riesgo de reducción del rendimiento asociado a cambios en tamaño, fuerza y resistencia muscular. También señala que, con adherencia y sistemas adecuados de ejercicio, las tripulaciones de ISS regresan en promedio con pérdidas mínimas. Los sistemas para exploración pueden tener capacidades diferentes y más limitadas. [3]

Esto justifica conservar el contexto al interpretar un indicador: no toda tripulación presenta el mismo deterioro ni corresponde afirmar que el ejercicio espacial es ineficaz.

La brecha MA-201 incluye modalidad, prescripción y monitorización de contramedidas de ejercicio para proteger salud y desempeño. Su descripción reconoce restricciones de recursos y límites de análogos realizados en condiciones idealizadas. [4] Es un fundamento para atender a contexto y aplicabilidad; TwinNauta no afirma cerrar esa brecha experimental.

### 3.2. Hipótesis del problema de información

La hipótesis del equipo es que disponer de cifras y publicaciones separadas puede dificultar su interpretación. Una persona necesita saber a qué región corresponde un dato, cómo se midió, con qué basal se compara y qué fuente respalda una explicación.

Esta hipótesis debe contrastarse con usuarios. No demuestra que las herramientas operativas de NASA carezcan de estas capacidades.

**Pregunta del proyecto:** ¿cómo presentar indicadores y evidencia relacionados con una región para distinguir lo observado, lo incierto y lo que requiere revisión dentro de una demostración de salud espacial?

## 4. Justificación: por qué TwinNauta

### 4.1. Justificación funcional

El proyecto busca reunir información conservando su significado. El área transversal describe una dimensión morfológica; el torque, una dimensión funcional; el registro de ejercicio, un contexto de actividad. Estas magnitudes no se sustituyen automáticamente.

Una interfaz contextual puede facilitar que el usuario comprenda esas diferencias y consulte las fuentes. Ese es un beneficio esperado que debe medirse, sin confundir visualización con diagnóstico.

### 4.2. Justificación científica

Scott y colaboradores estudiaron pérdida muscular y rehabilitación en un protocolo NASA de reposo en cama. [5] Trappe y colaboradores analizaron resultados musculares del programa SPRINT durante 70 días de microgravedad simulada. [6]

Estos trabajos justifican explorar indicadores musculares bajo condiciones definidas. Para reutilizarlos deben conservarse población, protocolo, región, método y calendario. Un estudio análogo no permite trasladar silenciosamente una tasa a una misión ni predecir la evolución individual de un astronauta.

La revisión de un archivo descargado comprueba disponibilidad e integridad cuando se verifican sus hashes; no valida por sí sola su interpretación fisiológica.

### 4.3. Justificación tecnológica

La propuesta informática conecta interfaz anatómica, API, persistencia y evidencia mediante identificadores consistentes. Permite que una explicación remita a registros y fuentes, y que una evaluación conserve el contexto con el que se creó.

Los grafos cumplen una función explicativa y de navegación. Una conexión temática entre un artículo y un indicador no demuestra causalidad ni habilita una intervención clínica.

### 4.4. Justificación interdisciplinaria

Según la planificación interna, Sistemas desarrolla integración e interfaz; Medicina revisa significado, aplicabilidad y acciones; Electrónica contribuye con telemetría, unidades, calidad y faltantes.

El trabajo exige programación, lectura crítica, tratamiento de datos y comunicación entre disciplinas. El aprendizaje debe acreditarse con entregables y evaluación, no asumirse por participar.

## 5. Objetivos

### Objetivo general

Desarrollar y evaluar un prototipo que relacione indicadores musculares, contexto de ejercicio y evidencia trazable mediante una interfaz anatómica, para apoyar comprensión y seguimiento de un caso ilustrativo de salud espacial.

### Objetivos específicos

1. Organizar indicadores con unidades, método, origen y referencia temporal.
2. Facilitar la selección del cuádriceps y consulta de sus datos.
3. Distinguir información disponible, ausente, sintética, derivada y preparada con IA.
4. Vincular explicaciones con fuentes y estados de revisión.
5. Mostrar escenarios únicamente cuando exista un modelo aplicable; explicar la abstención cuando no lo haya.
6. Registrar seguimiento sin alterar la evidencia histórica.
7. Evaluar comprensión y funcionamiento del recorrido integrado.

Estos objetivos no se presentan como resultados ya alcanzados.

## 6. Propuesta de solución y correspondencia con el reto

| Necesidad | Respuesta propuesta | Condición |
| --- | --- | --- |
| Reunir indicadores | Caso con mediciones y ejercicio | Origen, unidades y calendario explícitos |
| Ubicar datos | Anatomía seleccionable y panel regional | Correspondencia entre región e indicadores |
| Interpretar información | Resumen y hallazgos | Reglas comprensibles y revisión del significado |
| Explorar evolución | Escenario de referencia | Modelo y dominio revisados |
| Consultar fundamento | Biblioteca, citas y grafos | Fuentes localizables y revisión visible |
| Dar un siguiente paso | Acciones de revisión y seguimiento | Condiciones y responsable humano |

El recorrido consiste en seleccionar caso y día, abrir una región, revisar datos, consultar fundamento y registrar seguimiento. En el prototipo, actuar puede significar revisar una medición ausente. Prescribir ejercicio personalizado exige evidencia y responsabilidad profesional adicionales.

## 7. Alcance y estado actual

La inspección estática del repositorio permite reconocer implementación y documentos; no acredita funcionamiento en ejecución.

| Componente | Evidencia local | Límite |
| --- | --- | --- |
| Backend | FastAPI, modelos, PostgreSQL y migraciones | No se ejecutó para este documento |
| Contrato | OpenAPI 0.3.0 y tipos TypeScript | Requiere comprobación conjunta con implementación |
| Interfaz | Componentes React, anatomía GLB, paneles y grafos | No se realizó evaluación visual o de usabilidad |
| Evaluaciones | Instantáneas y control de revisiones | Reglas iniciales ilustrativas |
| Biblioteca | Consulta de publicaciones y relaciones | Clasificación temática no equivale a validación |
| Simulación | Estado de información insuficiente | Modelo científico no habilitado |
| Frecuencia cardíaca | Componente y grabación terrestre preparada | Independiente del caso muscular; documentación local registra licencia pendiente de aclaración |

El MVP no comprende diagnóstico autónomo, prescripción personalizada, monitorización clínica real ni cobertura fisiológica de todo el cuerpo. La operación completa sin conexión necesita comprobación específica.

## 8. Antecedentes y aporte diferencial

NASA ya investiga simulación humana. Digital Astronaut Simulation se describe como una herramienta biomecánica para comprender la interacción entre humanos y sistemas o entornos de vuelo espacial. [7] TwinNauta no debe atribuirse la invención de esa capacidad.

Su hipótesis diferencial es una experiencia que articula anatomía, indicadores, fuentes y seguimiento. El nombre no demuestra que exista un gemelo digital individual validado: haría falta demostrar calibración, actualización y capacidad predictiva, entre otros aspectos.

La utilidad se debe contrastar mediante tareas con usuarios y comparación con alternativas. Una interfaz atractiva o una biblioteca extensa no prueban por sí mismas un beneficio operacional.

## 9. Vinculación con los ODS

### 9.1. Criterio

Se distingue afinidad temática, actividad comprobable e impacto futuro. La relación con una meta no significa que el proyecto modifique sus indicadores oficiales.

| ODS | Vinculación propuesta | Evidencia posible |
| --- | --- | --- |
| 3. Salud y bienestar | Comprensión responsable de información sanitaria | Comprensión y errores de interpretación |
| 9. Industria, innovación e infraestructura | Desarrollo tecnológico fundamentado | Prototipo reproducible y evaluación |
| 4. Educación de calidad | Aprendizaje técnico interdisciplinario | Competencias y entregables revisados |
| 17. Alianzas para lograr los objetivos | Intercambio responsable de conocimiento | Colaboraciones y resultados compartidos |

### 9.2. ODS 3: Salud y bienestar

La meta 3.4 incluye prevención de enfermedades no transmisibles y bienestar; la 3.8 trata cobertura y acceso a servicios esenciales. [8]

TwinNauta tiene afinidad con la comprensión de información de salud, pero su relación con estas metas es indirecta: no mide mortalidad, cobertura ni acceso poblacional a servicios. No desarrolla vacunas o medicamentos, de modo que no corresponde invocar la meta 3.b solamente por mencionar investigación.

Una contribución evaluable sería que participantes identifiquen un dato ausente y distingan una referencia de una recomendación aprobada. Son métricas del proyecto, no indicadores oficiales del ODS.

### 9.3. ODS 9: Industria, innovación e infraestructura

La meta 9.5 aborda investigación científica y capacidades tecnológicas. [9] La propuesta se relaciona con esta orientación por integración de software, documentación y evaluación de una herramienta fundamentada.

Versiones, decisiones y resultados reproducibles respaldarían esa contribución. Desarrollar una aplicación no demuestra un cambio en indicadores nacionales de investigación o infraestructura.

### 9.4. ODS 4: Educación de calidad

La meta 4.4 se refiere a competencias pertinentes, incluidas técnicas y profesionales. [10] El proyecto ofrece oportunidades de programación, lectura científica y comunicación de resultados.

Su aporte formativo exige actividades y evaluación documentadas. No demuestra por sí solo una mejora educativa general ni cualificación clínica de sus integrantes.

### 9.5. ODS 17: Alianzas para lograr los objetivos

La meta 17.6 contempla cooperación e intercambio de conocimiento científico y tecnológico. [11] Documentación compartida y revisión interdisciplinaria pueden alinearse con ese espíritu.

La colaboración interna no acredita una alianza internacional formal. Consultar recursos de NASA no convierte a la agencia en socia. Toda afirmación de alianza necesita evidencia explícita.

### 9.6. Texto para presentación

> TwinNauta se alinea temáticamente con los ODS 3 y 9 al explorar una herramienta de interpretación de salud espacial y desarrollar capacidades tecnológicas sustentadas en evidencia. Complementariamente, promueve aprendizaje e intercambio de conocimiento vinculados con los ODS 4 y 17. Sus efectos sobre comprensión, utilidad y salud requieren evaluación; no se atribuyen impactos poblacionales demostrados.

## 10. Datos, evidencia e inteligencia artificial

Los inventarios locales separan originales científicos, derivados y caso sintético. Disponer de artículos o archivos no garantiza datos individuales ni habilita parámetros sin revisión.

Cada explicación debería permitir recuperar entradas, unidades, método, fecha, fuente, transformación, versión y estado de revisión. Para afirmaciones bibliográficas conviene registrar tabla, página o apartado concreto.

La IA puede apoyar resúmenes y relaciones candidatas, conservando entrada, modelo y procedimiento. Una salida generada sigue necesitando revisión. Consultar textos guardados no demuestra ejecución de un modelo local.

La grabación cardíaca terrestre no pertenece al astronauta virtual ni permite vincular automáticamente sus respuestas con el caso muscular.

## 11. Evaluación propuesta

Las siguientes comprobaciones son un plan, no resultados de esta elaboración.

| Dimensión | Pregunta | Evidencia |
| --- | --- | --- |
| Integración | ¿El recorrido respeta el contrato? | Solicitudes, respuestas y versiones |
| Trazabilidad | ¿Se localiza el respaldo de una explicación? | Afirmación y fuente concreta |
| Calidad | ¿Los faltantes siguen siendo faltantes? | Casos y resultados visibles |
| Comprensión | ¿Se distinguen observación, escenario y sugerencia? | Tareas y respuestas de participantes |
| Aplicabilidad | ¿Se explican población y entorno? | Revisión de Medicina |
| Seguimiento | ¿Se conservan revisiones e historial? | Persistencia y conflictos de actualización |
| Formación | ¿Se demuestran competencias? | Entregables y evaluación |

Los criterios de aceptación se deben definir antes de evaluar. No se inventan porcentajes de confianza o éxito sin fundamento.

## 12. Proyección e impacto esperado

En el corto plazo se espera una demostración integrada y explicable. Posteriormente podrían evaluarse nuevas regiones, modelos revisados y conectividad limitada, con datos y criterios propios.

Una adaptación terrestre a educación o seguimiento funcional sería otra línea de investigación. No queda validada por el contexto espacial ni por estudios de reposo en cama.

La relevancia de TwinNauta se apoya en convertir indicadores y literatura en una experiencia comprensible y trazable. Su éxito debe juzgarse por lo que usuarios entienden y hacen correctamente y por la fidelidad con la que el software representa sus límites.

## 13. Documentación interna

Enlaces relativos desde `docs/`. Describen decisiones y estado del equipo; no sustituyen fuentes científicas.

- [README](../README.md).
- [Plan del MVP](plan-mvp.md).
- [Arquitectura](arquitectura.md).
- [OpenAPI](../contracts/openapi.yaml).
- [Datos y evidencia](datos-y-evidencia.md).
- [Fichas de evidencia](evidencia/README.md).
- [Originales](../backend/data/raw/README.md).
- [Corpus bibliográfico](../backend/data/literature/candidates/README.md).
- [Frontend](../frontend/README.md).
- [Verificación histórica](verificacion-backend.md).

Algunos documentos mantienen estados anteriores. Disponibilidad técnica requiere contraste con código y ejecución; validez científica requiere su revisión específica.

## 14. Referencias

Consulta: 15 de noviembre de 2026. Paráfrasis en español; títulos originales conservados.

1. **NASA Science. (2026).** *NASA Welcomes All Ages, Experience Levels for Space Apps Challenge*. https://science.nasa.gov/universe/nasa-welcomes-all-ages-experience-levels-for-space-apps-challenge/ — Contexto y fechas.
2. **NASA Space Apps Challenge. (2026).** *Create Health Monitoring Software for Astronauts on Space Missions*. https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/ — Enunciado oficial; recursos específicos no recuperados.
3. **NASA. (2025).** *Risk of Reduced Physical Performance Capabilities Due to Reduced Muscle Size, Strength, and Endurance (Muscle Risk)*. https://www.nasa.gov/directorates/esdmd/hhp/muscle-risk/ — Riesgo y matices de contramedidas.
4. **NASA, Human Research Roadmap. (s. f.).** *MA-201: Determine the required exercise countermeasure or countermeasures (i.e., modality or modalities, prescription, monitoring) to protect mission-specific task performance and crew health outcomes*. https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833 — Brecha de investigación.
5. **Scott, J. M., et al. (2020).** *Disuse-Induced Muscle Loss and Rehabilitation: The National Aeronautics and Space Administration Bed Rest Study*. Critical Care Explorations, 2(12), e0269. https://doi.org/10.1097/CCE.0000000000000269 — Registro consultado: https://pubmed.ncbi.nlm.nih.gov/33251515/ . El acceso directo a PMC presentó verificación de navegador; los originales están inventariados en el proyecto.
6. **Trappe, T. A., et al. (2024).** *NASA SPRINT exercise program efficacy for vastus lateralis and soleus skeletal muscle health during 70 days of simulated microgravity*. Journal of Applied Physiology, 136, 1015–1039. https://doi.org/10.1152/japplphysiol.00489.2023 — Antecedente muscular; no valida predicciones del prototipo.
7. **NASA. (s. f.).** *Digital Astronaut Simulation Tool*. https://www.nasa.gov/general/digital-astronaut-simulation-tool/ — Antecedente biomecánico.
8. **Naciones Unidas, Departamento de Asuntos Económicos y Sociales. (s. f.).** *Goal 3*. https://sdgs.un.org/goals/goal3 — Metas oficiales.
9. **Naciones Unidas, Departamento de Asuntos Económicos y Sociales. (s. f.).** *Goal 9*. https://sdgs.un.org/goals/goal9 — Metas oficiales.
10. **Naciones Unidas, Departamento de Asuntos Económicos y Sociales. (s. f.).** *Goal 4*. https://sdgs.un.org/goals/goal4 — Metas oficiales.
11. **Naciones Unidas, Departamento de Asuntos Económicos y Sociales. (s. f.).** *Goal 17*. https://sdgs.un.org/goals/goal17 — Metas oficiales.

## 15. Mantenimiento

Actualizar fecha y estado cuando cambien alcance, modelo o evaluación. Mantener separados antecedentes, propuestas y resultados. Añadir citas junto a cada afirmación respaldada y conservar como potencial cualquier impacto todavía no medido.

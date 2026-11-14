# TwinNauta: contexto para empezar la investigación

Fecha de corte: 14 de noviembre de 2026.

Este documento resume hasta dónde llegó la discusión y propone un frente de investigación para continuar en paralelo. Todavía estamos definiendo el producto: las funcionalidades, los indicadores, los modelos, la arquitectura y las responsabilidades no están cerrados. No se ha iniciado la implementación de la aplicación en este directorio.

## 1. Qué queremos resolver

Elegimos el reto **Create Health Monitoring Software for Astronauts on Space Missions** de NASA Space Apps 2026. El enunciado compartido es:

> Long-duration missions expose astronauts to space radiation, isolation and confinement, altered gravity, and a hostile closed environment, which can bring immune changes, bone loss, cardiovascular events, and behavioral health problems. On long missions, astronauts carry much of the responsibility for spotting these changes in themselves. Your challenge is to build a health monitoring software that gathers health indicators and enables astronauts to evaluate and act on the status of their health.

[Página del reto](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/).

La prioridad es que el astronauta pueda **evaluar un cambio y saber cómo proceder**. Una visualización o una predicción necesita conectarse con un siguiente paso fundamentado: revisar un registro, repetir una medición, consultar un protocolo o solicitar evaluación, según el caso. Todavía no hemos elegido cuál será la decisión principal del MVP ni sus reglas.

## 2. Idea original y restricciones confirmadas

TwinNauta se presentó como una plataforma virtual de monitoreo y simulación de salud espacial, con énfasis muscular, óseo y cardiovascular. Debemos conservar coherencia con esa propuesta.

- La experiencia visual debe tener como centro un **modelo anatómico 3D interactivo**. Al seleccionar una región se muestran sus indicadores, evolución y fundamento científico.
- Se quiere explorar un **grafo contextual de evidencia**: región → indicador → observación → modelo → estudios → supuestos y limitaciones → escenarios o acciones relacionados.
- El proyecto es virtual; no exige construir sensores físicos.
- Se contemplaron sensores virtuales, comparación de escenarios y MediaPipe para movimiento. El alcance de cada uno está pendiente.
- Se consiguió un modelo anatómico, pero no está confirmado aquí que el GLB esté listo, tenga licencia adecuada o permita seleccionar todas sus partes.
- Seguimos en investigación y planificación. La implementación empezará cuando se indique expresamente.

Las tecnologías conversadas fueron React, TypeScript, React Three Fiber/Drei y Python/FastAPI con herramientas numéricas. Son antecedentes de la propuesta, no una arquitectura ya implementada.

## 3. Qué cambió durante la discusión

Al principio se pensó en definir indicadores, una región muscular y una simulación. Después se corrigió el orden: **primero elegir una necesidad y una decisión concreta del astronauta; luego seleccionar los indicadores y datos que permitan atenderla**.

Además, NASA ya trabaja en gemelos humanos, simulación, bibliotecas de evidencia y apoyo a decisiones. No podemos presentar “cuerpo 3D + sensores + recomendaciones con fuentes” como una innovación demostrada.

La hipótesis actual de producto es:

> TwinNauta ayuda al astronauta a reconocer cambios y decidir el siguiente paso de seguimiento cuando sus datos o contramedidas son incompletos, mostrando qué evidencia respalda cada opción.

Esta hipótesis todavía debe contrastarse. No hemos demostrado su originalidad ni que exista un modelo y un conjunto de datos suficientes para implementarla.

## 4. Comparación inicial con NASA

Las siguientes fuentes se localizaron y revisaron preliminarmente durante la discusión. Esta tabla orienta la investigación; no sustituye una evaluación completa de cada proyecto ni demuestra qué funciones no tiene NASA.

| Iniciativa o brecha | Qué encontramos inicialmente | Qué necesitamos comprobar |
| --- | --- | --- |
| [Human Digital Twin Platform — HDTP](https://techport.nasa.gov/projects/154412) | Descripción de avatar 3D y monitoreo fisiológico con biosensores comerciales. | Estado, resultados publicados, usuario objetivo, alcance y evaluación. Un proyecto completado no implica despliegue clínico. |
| [Digital Astronaut Simulation — DAS](https://www.nasa.gov/general/digital-astronaut-simulation-tool/) | Simulación biomecánica de interacción humana con equipos y entornos, incluyendo cargas articulares y externas. | Qué calcula, cómo se verifica y valida, y si responde a la decisión que queremos atender. |
| [Integrated Medical Model — IMM](https://www.nasa.gov/nasa-integrated-medical-model-imm-overview/) | Evidencia médica y simulación probabilística para evaluar riesgos y recursos de misión. | Diferencia entre planificación y seguimiento individual; supuestos y límites aplicables. |
| [IMPACT / MEDPRAT](https://ntrs.nasa.gov/citations/20240011063) | Biblioteca de evidencia y motor computacional para análisis de riesgo y diseño del sistema médico. | Datos de entrada, finalidad, resultados y diferencias con nuestro uso propuesto. |
| [CMO-DA, publicación de 2026](https://ntrs.nasa.gov/citations/20260001797) | Pruebas de concepto de apoyo clínico e integración de datos. | Qué se evaluó, bajo qué condiciones y qué sigue siendo experimental. |
| [MA-201](https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833) | Brecha publicada sobre modalidades, prescripción y monitoreo de contramedidas de ejercicio, considerando recursos limitados. | Qué parte podríamos explorar y qué evidencia permitiría sustentar una acción. |
| [Bone-301](https://humanresearchroadmap.nasa.gov/Gaps/gap.aspx?i=815) | Brecha publicada sobre herramientas clínicamente validadas para monitorear cambios óseos durante el vuelo e informar decisiones. | Qué mediciones están disponibles y qué puede aportar software sin inventar una capacidad de medición. |

Una segunda lectura también encontró un matiz importante: NASA indica que, con adherencia y equipos adecuados en ISS, las pérdidas musculares promedio pueden ser pequeñas. No debemos construir una pérdida uniforme e inevitable para todos. [NASA: riesgo muscular](https://www.nasa.gov/directorates/esdmd/hhp/muscle-risk/).

**Regla de interpretación:** si una página no menciona una función, registrar “no pude verificarla”, no “NASA no la tiene”. Separar brecha oficial, limitación inferida y oportunidad de experiencia de usuario.

## 5. Funciones e indicadores que se propusieron

Como posibles funciones del MVP se discutieron: misión virtual, selección anatómica, registro de indicadores, una simulación documentada, dos escenarios comparables, grafo de evidencia, calidad de datos y orientación para proceder. Esta lista debe revisarse después de elegir la decisión principal.

| Candidato | Para qué se propuso | Qué falta justificar |
| --- | --- | --- |
| Volumen de un músculo o grupo muscular | Resultado de seguimiento o simulación. | Región, método, datos y modelo; no equivale a fuerza. |
| Torque muscular bajo un protocolo definido | Representar función muscular. | Protocolo, relación con una decisión y disponibilidad de mediciones. |
| Ejercicio realizado | Describir exposición a contramedidas. | Modalidad, carga, repeticiones, frecuencia y duración pertinentes para el modelo elegido. |
| Una medida ósea en una localización definida | Mantener el componente óseo. | Elegir magnitud y método: densidad areal y volumétrica son diferentes. |
| Frecuencia cardíaca con contexto de actividad | Seguimiento cardiovascular básico. | Protocolo de interpretación y utilidad concreta; no equivale a predecir eventos cardiovasculares. |

Cuádriceps y sóleo/pantorrilla son regiones candidatas. Ninguna está seleccionada definitivamente. Tampoco se ha aprobado una puntuación global de salud, un umbral de alerta o una prescripción automática.

Publicaciones de partida:

- [Trappe y colaboradores, 2024 — NASA SPRINT](https://journals.physiology.org/doi/full/10.1152/japplphysiol.00489.2023): reposo en cama durante 70 días, ejercicio y respuestas musculares. Revisar diferencias por región y la posible influencia de las propias pruebas como ejercicio. Es un análogo terrestre.
- [Scott y colaboradores, 2023 — ejercicio y función multisistémica](https://www.nature.com/articles/s41526-023-00256-5): estudio de 46 astronautas; útil para resultados musculares, óseos y cardiorrespiratorios y variabilidad individual. Revisar límites del diseño observacional.
- [Böcker y colaboradores, 2026 — vuelo frente a reposo en cama](https://www.nature.com/articles/s41526-026-00611-2): útil para investigar transferibilidad, conservando diferencias de duración, población y contramedidas.
- [Walle y colaboradores, 2024 — remodelado óseo](https://pubmed.ncbi.nlm.nih.gov/39705358/): estudio en 17 astronautas; investigar qué magnitudes y métodos permiten observar cambios óseos.

Estas fuentes respaldan preguntas y candidatos. Todavía no se han extraído y auditado todos los parámetros ni seleccionado una ecuación de simulación.

## 6. Datos: qué tenemos y qué falta

La organización compartió una guía general. Para nuestro tema, las entradas prioritarias son [OSDR](https://osdr.nasa.gov), [Human Research Program](https://www.nasa.gov/hrp/) y los recursos del reto. [data.nasa.gov](https://data.nasa.gov) es un catálogo complementario. HRP aporta contexto de investigación; no es un dataset por sí mismo.

No tenemos confirmado todavía un conjunto de archivos descargados y aptos para calibrar o validar nuestro modelo.

- [OSD-946](https://osdr.nasa.gov/bio/repo/data/studies/OSD-946) contiene microARN y [OSD-942](https://osdr.nasa.gov/bio/repo/data/studies/OSD-942) datos de expresión génica. No asumir que ofrecen curvas de volumen o fuerza listas para usar.
- [OS-568](https://osdr.nasa.gov/bio/repo/data/experiments/OS-568) describe un experimento de ejercicio durante reposo en cama. Es candidato para inspección; no se ha confirmado que sus archivos cubran nuestras necesidades. Una ficha de experimento no es un archivo de datos.
- Los artículos pueden ofrecer resultados agregados sin publicar los registros individuales. Algunos datos humanos de OSDR tienen [acceso controlado](https://www.nasa.gov/reference/osdr-tutorials-requesting-controlled-access-datasets/).
- Un registro de ejercicio prescrito es distinto de uno realmente realizado. Las sesiones virtuales de la demo deben identificarse como sintéticas.
- Las ofertas de hosting, nube y colaboración son opcionales y no aportan por sí mismas evidencia ni datos fisiológicos. No se ha elegido proveedor.

Sí se propuso guardar información de la aplicación: perfiles y misiones, basales y observaciones, ejercicios, evidencia, versiones de modelos/reglas y ejecuciones. El motor de base de datos está pendiente.

**Basal individual no es media poblacional.** Si construimos un astronauta virtual con referencias publicadas, sus valores siguen siendo sintéticos. Cada registro debe conservar procedencia, método, unidad, fecha y transformaciones.

## 7. Método obligatorio de investigación

Cada investigación debe contrastar la anterior, incluyendo la posibilidad de corregirla:

1. Escribir una pregunta concreta y la hipótesis inicial. Definir qué hallazgo la haría cambiar.
2. Consultar fuentes originales, priorizando NASA y literatura científica reciente pertinente.
3. Registrar población, muestra, entorno, protocolo, variables, resultados y limitaciones. Distinguir artículo, presentación, descripción de proyecto y dataset.
4. Buscar deliberadamente contraevidencia, estudios posteriores, restricciones y alternativas existentes en NASA.
5. Comprobar si las fuentes son independientes o reutilizan la misma cohorte o resultado.
6. Verificar datos accesibles: archivos, variables, unidades, licencia y restricciones. Si no puede verificarse, dejarlo explícito.
7. Concluir: mantener, modificar, descartar o dejar pendiente la propuesta. Explicar por qué y qué falta.

No basta con reunir enlaces. Necesitamos poder reconstruir:

**Decisión del astronauta → capacidad existente en NASA → brecha → evidencia y contraevidencia → datos disponibles → propuesta y límites.**

## 8. Frente propuesto para empezar en paralelo

Para evitar investigar exactamente lo mismo, se propone que tu primera contribución compare **tres situaciones de decisión**:

1. Una medición dudosa, antigua o ausente impide interpretar una tendencia.
2. El registro de ejercicio realizado difiere del plan o está incompleto.
3. Un equipo de ejercicio deja de estar disponible durante parte de la misión.

Son candidatos de investigación, no reglas médicas ni funciones aprobadas. Para cada uno, investigar:

- Qué necesita decidir el astronauta y con qué recursos cuenta.
- Qué herramienta, procedimiento o proyecto de NASA ya atiende esa necesidad.
- Qué limitación está documentada y cuál solo estamos suponiendo.
- Qué datos observables requiere y dónde se consiguen.
- Qué acción puede fundamentarse y qué conclusiones no permiten las fuentes.
- Cómo comprobaríamos que el usuario entiende el resultado y el siguiente paso.

El entregable propuesto es una **matriz comparativa con fuentes y una recomendación argumentada** sobre cuál situación merece ser el recorrido principal del MVP. Registrar también los candidatos descartados y sus motivos. Revisar con Medicina las interpretaciones y acciones clínicas.

Plantilla para cada ficha:

| Campo | Qué registrar |
| --- | --- |
| Pregunta e hipótesis | Qué queremos saber y qué podría refutar la idea. |
| Fuente | Título, autores/entidad, año, tipo, DOI/URL y fecha de consulta. |
| Evidencia exacta | Resultado y ubicación: sección, tabla, figura o archivo. |
| Condiciones | Población, muestra, entorno, protocolo y duración. |
| Comparación NASA | Capacidad existente, uso, estado y brecha comprobada. |
| Datos | Variables, unidades, archivos, acceso y limitaciones. |
| Contraste | Segunda fuente; contradicciones y posible dependencia entre estudios. |
| Decisión propuesta | Qué haría el astronauta, fundamento, requisitos y límites. |
| Conclusión | Mantener, modificar, descartar o pendiente; siguiente comprobación. |

## 9. Equipo y fronteras técnicas pendientes

Somos cuatro: dos de Sistemas, una persona de Medicina y una de Electrónica. La distribución conversada, todavía ajustable, es:

- **Coordinación técnica y backend:** alcance, contratos, persistencia, ejecución del modelo e integración.
- **Frontend y experiencia exploratoria:** anatomía 3D, indicadores, comparación y navegación por evidencia. La investigación anterior ayuda a definir qué debe mostrar esa experiencia.
- **Medicina:** evidencia estructurada, selección de indicadores, parámetros, interpretación y revisión de acciones.
- **Electrónica:** telemetría virtual, unidades, calidad, ruido, pérdidas y posibles mediciones de movimiento.

El frontend presentaría resultados; el backend conservaría las reglas científicas y los cálculos compartidos. Se propuso OpenAPI con esquemas y ejemplos comunes para trabajar en paralelo, pero todavía no existen contratos aprobados. Deben cubrir también resultados parciales, información insuficiente y acciones con su fundamento.

## 10. Qué debe quedar resuelto antes de implementar

- Una decisión principal del astronauta y un recorrido de demostración.
- El aporte concreto de TwinNauta frente a lo existente, con sus límites.
- Indicadores y región seleccionados con criterios explícitos.
- Fuentes y archivos realmente utilizables; procedencia de datos sintéticos.
- Modelo, parámetros y plan de verificación/contraste empírico.
- Alcance obligatorio y complementario del MVP.
- Responsables, contratos y criterios de aceptación.

Mostrar incertidumbre o citar artículos no constituye validación clínica. MediaPipe no mide directamente masa muscular, fuerza o densidad ósea. Una falta de datos debe afectar únicamente los cálculos que dependan de ellos; no se deben inventar bandas de confianza ni alertas para hacer más llamativa la demostración.

El contexto previo más extenso está en [TwinNauta_contexto_para_Codex.md](TwinNauta_contexto_para_Codex.md), y las reglas de trabajo actuales en [AGENTS.md](AGENTS.md). Este resumen incorpora la corrección más reciente: empezar por la decisión del astronauta antes de cerrar indicadores y simulaciones.

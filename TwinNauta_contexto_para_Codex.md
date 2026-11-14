# TwinNauta — Contexto de conversación para Codex

> **IMPORTANTE PARA CODEX:** Este archivo es **únicamente contexto para continuar una conversación**. **No implementes nada**, no generes código, no crees archivos, no instales dependencias, no modifiques repositorios y no asumas que las propuestas aquí descritas ya fueron aprobadas. Espera instrucciones explícitas del usuario. Tu primera respuesta puede limitarse a confirmar que comprendiste el proyecto y conversar sobre la decisión que el usuario quiera tomar.

## 1. Situación actual

Participamos en **NASA Space Apps Challenge 2026** en un reto centrado en crear software de seguimiento de salud de astronautas durante misiones espaciales. El proyecto se llama **TwinNauta**. Se trata de un **simulador virtual**, no de un prototipo físico ni de hardware. Se está organizando el MVP, el diseño de la interfaz y el trabajo entre integrantes para desarrollar durante el hackathon.

**Situación al escribir este contexto:** el hackathon está ocurriendo alrededor del 14–15 de noviembre de 2026. El equipo todavía estaba alineando funcionalidades, responsabilidades y el diseño. La usuaria quiere trasladar esta discusión a Codex para **seguir pensando, diseñando, debatiendo y tomando decisiones**, no para arrancar la implementación de inmediato.

## 2. Lo presentado originalmente (restricción importante)

Ya se presentó un documento inicial con los objetivos, la idea principal y los recursos. **No se puede reescribir retroactivamente esa propuesta**, y la solución debe seguir siendo coherente con ella. El documento original establece, en esencia:

- Plataforma de monitoreo y simulación de la salud de astronautas en misiones prolongadas, enfocada en riesgos **musculares, óseos y cardiovasculares**.
- **Modelo anatómico 3D interactivo** del astronauta.
- Registro de indicadores basales y datos de **sensores virtuales** relacionados con movimiento/carga, actividad física y señales fisiológicas; posibilidad de mediciones o resultados de evaluaciones periódicas como densitometría, estado nutricional y ecocardiografía, según la disponibilidad de datos.
- **Simulaciones** de evolución ósea y muscular, respaldadas por modelos documentados y diferenciadas de las mediciones reales.
- Comparación de escenarios: ejercicios/contramedidas, restricciones de equipamiento, fallas en sensores/equipos, evolución temporal.
- **Dashboard o interfaz exploratoria** en la que la tripulación pueda comprender indicadores y resultados.
- **MediaPipe** para captura de movimiento desde cámara y cálculo de medidas de movimiento (por ejemplo, ángulos articulares y repeticiones); no está pensado para medir directamente densidad ósea o masa muscular.
- Tecnologías inicialmente planteadas: **React, TypeScript, React Three Fiber, Drei, Python, NumPy, SciPy, FastAPI, WebSocket**, posiblemente Plotly para gráficas, Blender para adaptar modelos, documentación NASA y fuentes científicas.
- Aplicaciones terrestres se mencionaron como posibilidad futura, pero el enfoque actual debe permanecer en **salud espacial**.

Se consiguió un modelo anatómico 3D musculoesquelético; se recomendó descargarlo en formato **GLB**, revisar licencia, peso, cantidad de polígonos y si las regiones están separadas en mallas utilizables. **No hay confirmación de que el archivo GLB ya esté listo ni de que sus partes sean seleccionables individualmente**.

## 3. Problema con la idea inicial y evolución del enfoque

Se investigó que NASA y otros grupos **ya exploran gemelos digitales, biosensores, modelos probabilísticos y apoyo a decisiones médicas**. Ejemplos discutidos: *Human Digital Twin Platform*, *Integrated Medical Model (IMM)*, *MEDPRAT*, simulaciones de ejercicios y herramientas de investigación de salud espacial. También hay equipos inscritos en Space Apps 2026 con propuestas generales de monitoreo, IA o explicaciones basadas en evidencia.

Por eso **«modelo 3D + sensores + predicción» no es un diferenciador suficiente**. El equipo eligió reforzar como rasgo central de TwinNauta la **trazabilidad científica, análisis de incertidumbre y evaluación crítica de las simulaciones**.

**No llamar al módulo «KAWSAY Mirror» ni presentarlo como otra app**. Se discutió ese nombre como idea exploratoria, pero la aplicación sigue llamándose **TwinNauta**; el sistema de evidencia e incertidumbre es un **módulo principal interno**.

### Diferenciador propuesto

TwinNauta no solo muestra la evolución simulada del organismo, sino que permite explorar:

1. **Qué información se observó o se midió realmente**, qué procede de sensores virtuales o datos sintéticos y qué es una estimación del modelo.
2. **Qué estudio científico, población, condiciones y parámetros** sustentan cada modelo o conclusión.
3. **Qué incertidumbre existe**, qué supuestos afectan el resultado y qué tan aplicable es la evidencia (por ejemplo, estudios de reposo prolongado en cama frente a condiciones reales de microgravedad).
4. **Qué ocurre cuando cambian parámetros, intervenciones o la calidad/disponibilidad de los datos**: comparaciones de escenarios y análisis de sensibilidad.
5. **Qué no es posible concluir** a partir de las observaciones o simulaciones disponibles.

**Precisión científica esencial:** comunicar incertidumbre **no equivale** a validar clínicamente un modelo. Se pueden realizar pruebas computacionales, análisis de sensibilidad y contrastes con publicaciones, pero no se debe afirmar capacidad de predicción médica individual sin validación adecuada. No inventar porcentajes de confianza ni inferir masa muscular, fuerza o densidad ósea directamente a partir de MediaPipe.

## 4. Dirección visual acordada (muy importante)

La usuaria **NO quiere un dashboard genérico** de tarjetas, métricas y gráficas. Aspira a una experiencia visual exploratoria cuyo centro sea el **modelo anatómico 3D**:

- El usuario ve el cuerpo del astronauta y puede seleccionar una región o área afectada.
- La selección resalta la anatomía y permite un **desglose contextual** de la región.
- Se muestra su evolución simulada, indicadores relacionados y **rangos de incertidumbre**.
- **Elemento visual central propuesto por la usuaria: un grafo de conocimiento / grafo de evidencia interactivo**, que conecte región anatómica → variable/indicador → medición (o ausencia de ella) → modelo → estudios científicos → supuestos/limitaciones → escenarios afectados.
- Posibles capas o modos de lectura del cuerpo: **anatomía**, **simulación**, **evidencia científica** y **sensores/calidad de datos**.
- La visualización debe hacer evidente **de dónde proviene cada estimación**, no simplemente decorar la pantalla.
- El grafo debe ser legible y contextual; podría aparecer como panel desplegable o como vista «Evidencia» al seleccionar una estructura, en vez de dominar siempre la pantalla.
- Una narrativa de demo potente: seleccionar cuádriceps → explorar proyección → consultar grafo de evidencia → cambiar ejercicio o quitar un dato → ver qué predicciones cambian y qué conclusiones dejan de estar justificadas.

**Aún no existe un diseño definitivo aprobado.** La prioridad inmediata es discutir la experiencia de usuario y realizar una **maquetación/wireframe** antes o al inicio del desarrollo. La usuaria está dispuesta a trabajar en la base visual y la coordinación técnica.

## 5. Funcionalidades del MVP discutidas (propuestas, no decisiones cerradas)

**Núcleo prioritario**:

- Configurar una misión virtual (duración, valores basales simulados y condiciones iniciales).
- Visualizar modelo anatómico 3D e interactuar con **al menos una región anatómica funcional**, posiblemente cuádriceps.
- Generar y explorar una simulación de evolución muscular durante la misión; la dimensión ósea está en la propuesta original pero puede comenzar como segunda región/modelo simplificado y claramente identificado como estimación.
- Presentar señales de **sensores virtuales** e indicar calidad y procedencia de datos.
- Comparar **al menos dos escenarios**, por ejemplo, entrenamiento habitual frente a reducción del ejercicio o falla de un equipo.
- Mostrar curvas o rangos generados por el análisis de sensibilidad / variación de parámetros, sin inventar interpretación clínica.
- Mostrar **grafo de conocimiento/evidencia** y fichas bibliográficas por región, variable y modelo.
- Diferenciar claramente datos observados, datos sintéticos, estimaciones y desconocidos.

**Complementos si son viables**:

- Simulación de **fallas de sensores, mediciones faltantes y ruido** y efecto sobre la interpretación.
- **MediaPipe** para movimiento y repeticiones (puede ejecutarse con webcam o videos grabados, sin hardware externo).
- Más regiones musculares y simulaciones óseas detalladas.
- Animaciones extra y múltiples pantallas.

**Principio de alcance:** es mejor una demostración completa, coherente y rigurosa de una región que muchas funciones sin integración ni respaldo científico.

## 6. Equipo y responsabilidades propuestas

Actualmente hay **cuatro integrantes**:

- **Dos de Ingeniería de Sistemas**, incluida la usuaria y una amiga.
- **Uno de Medicina**.
- **Uno de Electrónica**.

División de trabajo **propuesta, todavía ajustable**:

- **Usuaria (Sistemas):** liderazgo técnico/producto, definir MVP, UX/wireframe, arquitectura y contratos de datos, backend o integración según carga real. No asumir que realizará todo el frontend y backend ella sola.
- **Amiga (Sistemas):** frontend React/TypeScript, visor anatómico GLB, interacciones, grafo de evidencia, gráficas.
- **Electrónica:** módulo **virtual** de telemetría, generación/calidad de señales, ruido y pérdida de información, quizá MediaPipe. **No hay exigencia de construir sensores físicos**.
- **Medicina:** responsable principal de la **búsqueda bibliográfica y estructuración de evidencia científica**, selección de indicadores/modelos y revisión de limitaciones. No limitarse a enviar links: entregar información utilizable por la simulación y el grafo.

Para cada fuente científica sería útil registrar: título/URL/identificador, tipo de estudio, población, condiciones (vuelo espacial o análogo terrestre), variable medida, resultados cuantitativos disponibles, modelo o parámetro respaldado, limitaciones y qué afirmaciones **no** permite hacer.

### Flujo general de una hackathon discutido

Definir un MVP que todos entiendan → acordar recorrido de usuario → maquetación rápida y estructura/contrato de datos → desarrollo en paralelo → integrar pronto → comprobar resultados y fuentes → preparar demo y envío. No pasar muchas horas perfeccionando Figma sin validar que el flujo principal puede implementarse.

## 7. Debate sobre aplicación local

Una compañera propuso agregar **trabajadores mineros de gran altura en Arequipa/Puno** como análogo terrestre: aislamiento, fatiga, sueño, esfuerzo físico e hipoxia. La usuaria considera que esto **forzaría el enfoque y duplicaría el alcance**, porque hipoxia de altura y microgravedad son condiciones fisiológicas distintas y requerirían modelos y validaciones específicas.

Se llegó a un acuerdo para **rescatar el concepto de transferibilidad de evidencia**, pero aplicarlo de forma natural a la investigación espacial: por ejemplo, indicar con cuidado qué resultados de **estudios terrestres de reposo prolongado en cama** pueden o no extrapolarse a astronautas. No convertir minería peruana en un segundo modo principal de la aplicación.

## 8. Hallazgos y fuentes de investigación discutidos

Estos enlaces son puntos de partida para **verificar y trabajar con las fuentes originales**; no deben tratarse como bases de datos ya procesadas, fórmulas calibradas o modelos validados:

- NASA Space Apps 2026, desafíos: https://www.spaceappschallenge.org/2026/challenges/
- NASA Human Research Roadmap, brechas de investigación: https://humanresearchroadmap.nasa.gov/
- NASA Open Science Data Repository (OSDR): https://osdr.nasa.gov/
- NASA Biological Data API: https://www.nasa.gov/osdr-api/
- NASA Technical Reports Server (NTRS): https://ntrs.nasa.gov/
- NASA Human Research Program: https://www.nasa.gov/hrp/
- Estudio OSD-946 (reposo prolongado / ejercicio, verificar exactamente qué datos contiene): https://osdr.nasa.gov/bio/repo/data/studies/OSD-946
- Estudio OSD-942 (datos moleculares musculares; **no** equivale directamente a curvas de masa muscular): https://osdr.nasa.gov/bio/repo/data/studies/OSD-942
- Estudio sobre ejercicio y reposo prolongado, referencia discutida: https://pubmed.ncbi.nlm.nih.gov/38328821/
- NASA NTRS: evaluación de sensores cinemáticos durante ejercicio espacial: https://ntrs.nasa.gov/citations/20240001089
- NASA Integrated Medical Model: https://www.nasa.gov/nasa-integrated-medical-model-imm-overview/
- Human Digital Twin Platform, NASA TechPort: https://techport.nasa.gov/projects/154412

Hallazgos relevantes discutidos:

- NASA ya investiga monitoreo, simulación probabilística y sistemas de apoyo médico; TwinNauta **no debe afirmar que inventó un gemelo digital**.
- Existe una brecha reconocida en el monitoreo directo de algunos cambios óseos en vuelo; no confundir densitometría periódica con datos continuos de sensores de movimiento.
- Estudios de reposo en cama pueden aportar evidencia para ciertos cambios musculares, pero **no son equivalentes a vuelos espaciales**.
- La observación de movimientos mediante cámaras/sensores tiene errores, oclusiones y límites, por lo que es interesante reflejar la calidad de las mediciones.
- La literatura espacial puede tener muestras limitadas; evitar afirmaciones excesivas sobre predicción individual.
- Los proyectos de competidores mencionados en conversaciones anteriores eran **descripciones públicas** de equipos, no resultados comprobados o prototipos finalizados.

## 9. Preguntas abiertas para seguir conversando con Codex

- ¿Cuál debe ser la **experiencia visual** más original y comprensible al seleccionar una zona del modelo 3D?
- ¿Cómo estructurar un **grafo de conocimiento científico auténtico**, sin conexiones inventadas o etiquetas vagas de «confianza»?
- ¿Qué funcionalidad mínima puede evidenciar que las estimaciones están respaldadas y que el sistema reconoce sus límites?
- ¿Cómo reducir el alcance manteniendo coherencia con lo prometido originalmente (músculo, hueso, sensores, escenarios, MediaPipe)?
- ¿Cómo dividir los entregables y asignar tiempo razonable entre cuatro personas?
- ¿Qué información exacta debe entregar la persona de Medicina para fundamentar el simulador y alimentar el grafo?
- ¿Cómo diseñar un prototipo visual diferenciador sin depender primero de un backend completo?

## 10. Forma deseada de colaboración

- Conversar en **español**, de manera clara, concreta y crítica.
- **No comenzar a implementar por leer este archivo**.
- Distinguir entre decisiones confirmadas, ideas discutidas y preguntas abiertas.
- Ser intelectualmente riguroso: no inventar hallazgos de NASA, validaciones científicas, datasets ni puntuaciones de confiabilidad.
- Priorizar primero **definición del producto, UX/maquetación, metodología científica y alcance**, y pasar a código únicamente cuando el usuario lo solicite.

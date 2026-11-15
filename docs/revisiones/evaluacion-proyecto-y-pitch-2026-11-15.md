# TwinNauta: fortalezas, brechas y prioridades para el pitch

Revisión del 15/11/2026. Se inspeccionaron backend, contratos, frontend, datos preparados y documentación de investigación. Se distingue lo que existe de lo propuesto. Esta revisión documental no repite la ejecución completa ni equivale a evaluación clínica o prueba con astronautas.

## Conclusión

La propuesta más defendible hoy es **monitoreo y explicación con evidencia trazable para decidir qué comprobar después**. El cuerpo 3D ayuda a navegar; la IA resume; el valor aparece al conectar un dato, sus límites y un paso verificable. Su originalidad frente a otras herramientas sigue siendo una hipótesis, no un hecho demostrado.

La mayor brecha no es estética: todavía falta demostrar una interpretación útil cuando sí hay mediciones musculares comparables. El caso actual explica bien la información ausente, pero el escenario muscular sigue deshabilitado. El pitch debe distinguir esta limitación de la visión futura.

## Fortalezas verificadas

| Fortaleza | Evidencia en el proyecto | Cómo hacerla visible |
| --- | --- | --- |
| Caso, día y región coherentes | `assessments.py` filtra hasta el día solicitado y guarda instantáneas | Una historia concreta, no un catálogo de pantallas |
| Dato faltante no equivale a deterioro | `guidance.py` distingue basal ausente, protocolo incompatible, calidad dudosa y sesión sin registro | Mostrar por qué dos alertas parecidas requieren comprobaciones diferentes |
| Trazabilidad de la síntesis | `context_synthesis.py` verifica IDs y presencia textual de fragmentos; `prepared_contexts.py` conserva versiones/hash | Abrir una afirmación y llegar a su fragmento y fuente |
| Biblioteca ya conectada | API y frontend consultan papers, fichas, resúmenes y grafo temático | Consultar dos fuentes pertinentes, explicar sus diferencias y ampliar solo si hace falta |
| Preparación separada de lectura | Consultar `/context` lee contenido instalado; no genera IA | Demostrar una consulta con proveedor de IA desactivado |
| Telemetría real independiente | CSV terrestre preparado: 602 muestras, dos sin valor de frecuencia cardíaca; reproductor por ventanas y `connectNulls=false` | Mostrar reproducción y ausencia sin inventar mediciones |
| Estado explícito de revisión | Se conservan estados pendientes, propuestas operativas y motivos de abstención | Diferenciar disponibilidad del contenido y aprobación científica |
| Continuidad del seguimiento | Estado de acciones con revisión; cambiarlo no reescribe la evidencia | Cerrar el recorrido con una comprobación registrada, sin atribuir mejoría fisiológica |

Los controles de referencias evitan determinados errores estructurales. **No verifican que el modelo haya interpretado correctamente un estudio o que una conclusión sea clínicamente aplicable.** Esa revisión humana sigue siendo necesaria.

## Lo importante que faltaba en el relato

1. **La parte de monitoreo es tangible.** La frecuencia cardíaca permite enseñar una señal temporal, datos ausentes y procedencia. Es frecuencia en latidos/minuto: no hay detección de arritmias ni un diagnóstico cardíaco implementado.
2. **La IA no decide sola.** Las reglas operativas se conservan en el backend y las síntesis se preparan por separado. La explicación debe ayudar a revisar la información, sin autorizar ejercicio o tratamiento.
3. **Hay memoria de la decisión.** Evaluación, versión de evidencia, contenido preparado y seguimiento de acciones se conservan por separado. Esto permite reconstruir qué se vio en un momento dado.
4. **Autonomía con límites.** La lectura local y los paquetes científicos son avances reales. Los PDFs originales no están precargados, y falta una prueba integral sin red. La demo local no prueba preparación para vuelo.
5. **La adaptación terrestre necesita su propio caso.** Reposo e inmovilización justifican explorar el problema; no trasladar coeficientes espaciales a pacientes. El contraste astronauta–paciente ilustra una oportunidad de investigación.

## Brechas que conviene resolver antes de ampliar alcance

| Prioridad | Brecha comprobada | Consecuencia para la presentación | Siguiente entrega concreta |
| --- | --- | --- | --- |
| P0 | Revisión científica pendiente; no hay reglas clínicas aprobadas | No decir que las recomendaciones están validadas | Medicina revisa una ficha, una interpretación y una acción operativa acotada, con fuente y límites |
| P0 | `simulation.py` devuelve información insuficiente y ninguna trayectoria | No prometer simulación muscular predictiva ni efectos de no entrenar | Elegir y revisar un modelo de referencia limitado, o presentar honestamente el producto como monitoreo y contexto |
| P0 | El único caso destacado tiene basal y torque ausente | La demostración puede parecer solo una colección de abstenciones | Preparar un segundo caso sintético, etiquetado y revisado, con observaciones longitudinales compatibles; contrastar cómo cambia la explicación |
| P0 | Las fichas devuelven `statistics=[]`; la población estructurada no está rellenada | El grafo todavía no compara cuantitativamente estudios | Incorporar las extracciones auditadas de uno o dos trabajos, con método, grupo, tiempo y dispersión; no habilitar extrapolación clínica |
| P0 | Interpretación semántica y aplicabilidad no evaluadas | Una cita exacta puede acompañar una interpretación incorrecta | Revisar afirmación→fragmento→conclusión y registrar para quién aplica y para quién no |
| P0 para publicación de señal | La página actual de PhysioNet y `LICENSE.txt` local indican condiciones diferentes | No asumir permiso de redistribución por estar descargable | Confirmar condiciones con el repositorio/autores; en el PDF se usa esquema, sin lecturas individuales |
| P1 | El grafo ampliado de evaluación aún usa Graph original; el contexto tiene GraphPage | El botón de ampliar puede no representar el resumen que se acaba de leer | Conectar los tres grafos de `/context` y diferenciar citas de clasificación temática |
| P1 | La lista de biblioteca no consume la segunda página | Sin filtro solo aparecen 25 de 27 resultados | Añadir paginación; no describir la lista como acceso completo sin comprobarlo |
| P1 | Un día nuevo no hereda el contexto preparado | Cambiar el día puede dejar la explicación no disponible | Preparar los estados seleccionados para la demo y mostrar el motivo de ausencia en otros |
| P1 | No hay evaluación con usuarios | El impacto sigue siendo potencial | Medir comprensión del caso, elección del siguiente paso, errores y tiempo para localizar fundamento |

La búsqueda actual consulta el corpus local; no es una búsqueda exhaustiva en tiempo real. El grafo de biblioteca usa relaciones editoriales de temas (`addresses`), no una red revisada de apoyo, contradicción o causalidad entre resultados. Los análisis disponibles se basan en abstracts; enlazar un original no equivale a haber auditado su texto completo.

## Qué puede llamar la atención del jurado

**Una demostración pequeña donde cambie la decisión del usuario.** En menos de un minuto: seleccionar cuádriceps, ver qué información falta, abrir el fundamento y comprobar el siguiente paso. Después, unos segundos de señal cardíaca muestran que el sistema también reúne indicadores. El ejemplo debe probar una utilidad concreta, no solo que se puede navegar por muchas pantallas.

En el pitch bastan tres mensajes:

- **Comprender antes de actuar:** distinguir un cambio observado de un problema de información.
- **Poder comprobar el fundamento:** pasar de resumen a fuente y reconocer sus límites.
- **Preparar para consultar con autonomía:** evidencias y explicaciones instaladas; demostrar el alcance local sin prometer operación espacial certificada.

La cantidad de papers aporta amplitud, pero dos interpretaciones revisadas y útiles pueden ser más convincentes que veintisiete resúmenes pendientes. Un grafo grande debe aparecer como ampliación; la primera vista debería responder una pregunta sin exigir aprender la interfaz.

## Relación con criterios de evaluación

El reto exige reunir indicadores y permitir evaluar y actuar. Las páginas de eventos en el dominio oficial enumeran impacto, creatividad, validez, relevancia y presentación. Se usan aquí como orientación cualitativa; no se asignan pesos ni se predice un premio.

| Criterio | Lo que ya aporta TwinNauta | Lo que aún debe demostrar |
| --- | --- | --- |
| Impacto | Problema operacional claro: interpretar datos y ausencias | Que mejora comprensión o una decisión frente a una presentación más simple |
| Creatividad | Une anatomía, datos, límites y evidencia navegable | Diferencia comprobable frente a bibliotecas, dashboards y sistemas de apoyo existentes |
| Validez | Procedencia, fuentes, controles de referencias y estados explícitos | Revisión del significado, aplicabilidad y modelo; no basta con que compile |
| Relevancia | Sigue el recorrido indicador→evaluación→seguimiento | Que los pasos son pertinentes con recursos y restricciones de misión |
| Presentación | Pitch visual, ejemplo concreto, contraste Tierra–espacio | Ensayo de cinco minutos y una demostración breve que confirme lo dicho |

No prometer reducción de eventos, ahorro de tiempo, mejor recuperación o diagnóstico si no se han medido. Proponer una evaluación exploratoria: mismo tipo de caso, explicaciones comparables y una referencia de respuestas revisada por Medicina. Registrar resultados reales antes de hablar de mejoras.

## Orden recomendado de trabajo del equipo

1. **Sistemas + Medicina:** cerrar una decisión de seguimiento demostrable y su fundamento revisado.
2. **Medicina:** completar dos extracciones y la aplicabilidad; comprobar solapamiento de cohortes.
3. **Backend:** preparar los casos y versiones aprobados; mantener el modelo deshabilitado si sigue sin revisión.
4. **Frontend:** simplificar el primer nivel y alinear el botón de ampliar con la síntesis; resolver la paginación.
5. **Electrónica/datos:** verificar telemetría, ausencias y condiciones de uso; preparar reproducción estable.
6. **Equipo:** ensayo cronometrado, prueba sin proveedor IA y prueba sin red con alcance registrado; preparar un respaldo audiovisual separado del PDF si resulta útil.

Son tareas propuestas para priorizar; esta revisión no las implementa ni modifica la aplicación.

## Qué se cambió en el pitch

Se agregó una diapositiva explícita de frecuencia cardíaca. El esquema no reproduce la grabación: muestra el concepto de señal con una ausencia. Los conteos 602/2 se recalcularon desde el CSV preparado. El guion se reescribió a 593 palabras con una pauta de 300 segundos; la duración real depende del ensayo. La presentación principal tiene doce diapositivas y las tres de fuentes permanecen aparte.

## Referencias externas

- [Reto oficial: Health Monitoring Software](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/). Enunciado indexado comprobado; la apertura directa devolvió 502.
- [Criterios publicados en evento del dominio oficial, Ajmer 2026](https://www.spaceappschallenge.org/2026/local-events/ajmer/). No sustituye la confirmación de la guía y reglas del evento local del equipo.
- [NASA: Digital Astronaut Simulation](https://www.nasa.gov/general/digital-astronaut-simulation-tool/), [HDTP](https://techport.nasa.gov/projects/154412), [CMO-DA](https://ntrs.nasa.gov/citations/20260001797). Antecedentes ya contrastados en las fuentes del pitch; no prueba de una función ausente en NASA.
- [PhysioNet, Mongin et al., v1.0.1](https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/), [licencia publicada actualmente](https://physionet.org/content/treadmill-exercise-cardioresp/view-license/1.0.1/). Contrastar con `backend/data/raw/physionet_treadmill_1.0.1/LICENSE.txt` (CC BY-NC-SA 4.0); no se resolvió la discrepancia.
- [Fuentes y alcance de las diapositivas](../../presentacion/pitch-2026-11-15/FUENTES_Y_ALCANCE.md).

## Ajuste de interfaz que ayudaría a comunicar el valor

Propuesta para la compañera de frontend, sin implementarla en esta revisión: el primer nivel puede limitarse a **qué se observó, qué falta y qué comprobar ahora**. Cada indicador mantiene valor/unidad, fecha, origen y calidad, con el detalle científico accesible al ampliar. La biblioteca y los grafos sirven para profundizar después de entender la pregunta. Conviene evitar que la ficha del caso, el minigrafo, las observaciones completas y la síntesis compitan simultáneamente por la atención. Evaluar esa simplificación con una persona ajena al proyecto antes de cambiar toda la interfaz.

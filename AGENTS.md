# TwinNauta: instrucciones de trabajo

## Estado y autorizacion

- El proyecto paso a implementacion inicial de backend, manteniendo pendiente la integracion cientifica.
- No implementar, generar codigo de la aplicacion, instalar dependencias, crear infraestructura ni modificar repositorios sin una instruccion explicita de la usuaria para empezar.
- La creacion de este archivo fue autorizada. No extiende esa autorizacion a otros entregables o a la implementacion.
- Leer `TwinNauta_contexto_para_Codex.md` para recuperar el contexto. Sus propuestas no son decisiones aprobadas. Las instrucciones actuales de la usuaria prevalecen.
- Conservar la propuesta presentada originalmente y distinguir decisiones confirmadas, propuestas y preguntas pendientes.
- La usuaria autorizo implementar el backend inicial y exclusivamente el setup minimo de frontend con React, TypeScript, Vite y Tailwind. Su companera se encarga de toda la interfaz. No anadir pantallas de producto, CI ni suites de pruebas por iniciativa propia. El despliegue y la contratacion de servicios siguen pendientes.
- Consultar `README.md`, `docs/plan-mvp.md` y `contracts/README.md` para el acuerdo tecnico actual. Sandra asume backend; se eligieron area muscular, torque y ejercicio, con frecuencia cardiaca didactica. Las propuestas historicas no revierten estas decisiones.

## Comunicacion

- Conversar en espanol, sin emojis, con explicaciones concretas y comprensibles.
- Explicar los cambios y sus motivos paso a paso, con una profundidad proporcional a la tarea.
- Discutir criticamente las propuestas; corregir decisiones anteriores cuando la evidencia lo requiera.
- No presentar como hechos la originalidad, disponibilidad de datos, validacion o capacidad clinica que aun no se hayan comprobado.
- No utilizar Context7 salvo solicitud explicita de la usuaria.

## Problema y criterio del MVP

El reto consiste en reunir indicadores de salud para que astronautas en misiones prolongadas puedan evaluar su estado y actuar. El resultado esperado debe incluir un siguiente paso fundamentado y comprensible para la tripulacion.

- Evaluar cada funcionalidad por la decision del astronauta que ayuda a tomar, los datos necesarios, la evidencia, los recursos disponibles y su viabilidad en el MVP.
- Mantener el foco espacial. La propuesta comprende salud muscular, osea y cardiovascular, anatomia 3D, sensores virtuales y simulacion. Delimitar explicitamente la profundidad de cada componente.
- La anatomia 3D y el grafo deben ayudar a interpretar indicadores y decisiones, con relaciones cientificas explicitas.
- No dar por seleccionados una region anatomica, un indicador, un modelo, un dataset, una base de datos o una tecnologia porque aparezcan en conversaciones previas.
- Considerar las restricciones operativas: equipo de ejercicio, tiempo de tripulacion, datos faltantes, disponibilidad de mediciones y comunicacion con Tierra.
- Para cada accion propuesta, definir sus condiciones, fuente, limites, responsable humano y forma de comprobar el resultado. Separar seguimiento operativo de diagnostico o tratamiento.

## Investigacion iterativa y contrastacion

Aplicar este ciclo a cada decision sustantiva sobre producto, indicadores, datos, modelos o acciones:

1. Formular la pregunta, la hipotesis actual y que hallazgo permitiria refutarla o modificarla.
2. Buscar publicaciones primarias y documentacion oficial de NASA. Priorizar literatura reciente pertinente y conservar trabajos anteriores cuando sean necesarios.
3. Comprobar el contenido original: poblacion, muestra, entorno, protocolo, variables, resultados, limitaciones, fecha y tipo de publicacion. Una descripcion de proyecto, un resumen de congreso y un articulo revisado por pares tienen alcances diferentes.
4. Hacer una segunda busqueda dirigida a comprobar o cuestionar lo anterior: resultados contradictorios, replicacion, estudios posteriores, correcciones, restricciones y acceso real a los datos.
5. Comprobar independencia: publicaciones del mismo grupo o cohorte no equivalen automaticamente a validacion externa. Una fuente que cita a otra tampoco constituye corroboracion independiente por si sola.
6. Comparar la decision con capacidades y brechas publicadas por NASA: que existe, para quien, para que uso, con que evidencia y en que estado de desarrollo.
7. Actualizar la conclusion: mantener, modificar, descartar o dejar pendiente. Explicar que cambio y por que. No investigar solo para confirmar una preferencia.
8. Identificar que queda sin comprobar y el siguiente contraste necesario. Detener la iteracion cuando haya evidencia suficiente para una decision acotada, o registrar que no la hay.

Para cada decision, poder reconstruir: necesidad del astronauta -> alternativa existente en NASA -> brecha documentada -> evidencia y contraevidencia -> datos accesibles -> propuesta -> limites -> criterio de aceptacion.

## Comparacion con NASA y originalidad

- NASA ya desarrolla simulacion humana, monitoreo, modelos probabilisticos, bibliotecas de evidencia y apoyo a decisiones. No atribuir a TwinNauta la invencion de esas capacidades.
- Distinguir proyectos de investigacion, pruebas de concepto, herramientas para planificacion y sistemas operativos utilizados en vuelo. Un proyecto completado no implica certificacion o despliegue clinico.
- No inferir que NASA carece de una funcion porque una pagina publica no la mencione. Indicar que no pudo verificarse.
- Distinguir una brecha reconocida por NASA de una limitacion inferida por el equipo o una oportunidad de experiencia de usuario.
- La originalidad es una hipotesis que debe contrastarse. No prometer resolver una brecha cientifica con una visualizacion o simulacion que no genera nuevas mediciones.
- Fuentes iniciales para verificar en cada investigacion relevante:
  - HDTP: https://techport.nasa.gov/projects/154412
  - Digital Astronaut Simulation: https://www.nasa.gov/general/digital-astronaut-simulation-tool/
  - IMM: https://www.nasa.gov/nasa-integrated-medical-model-imm-overview/
  - IMPACT/MEDPRAT: https://ntrs.nasa.gov/citations/20240011063
  - CMO-DA: https://ntrs.nasa.gov/citations/20260001797
  - Contramedidas musculares y aerobicas MA-201: https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833
  - Monitoreo oseo Bone-301: https://humanresearchroadmap.nasa.gov/Gaps/gap.aspx?i=815
  - OSDR: https://science.nasa.gov/biological-physical/data/osdr/
- Estos enlaces son puntos de partida, no resultados ya auditados ni evidencia suficiente para cualquier afirmacion.

## Recursos compartidos por la organizacion

- La usuaria compartio una guia general de datos abiertos y un mensaje de Global Offers. La guia orienta la busqueda; no confirma que cada portal contenga las variables que necesita TwinNauta.
- Priorizar OSDR (`https://osdr.nasa.gov`) para localizar estudios/datos y HRP (`https://www.nasa.gov/hrp/`) para el contexto de investigacion. HRP no es por si solo un dataset.
- Revisar los recursos particulares del reto: https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/ . Si no pueden consultarse, declarar la limitacion y no inventar su contenido.
- Usar `https://data.nasa.gov` como catalogo complementario. Justificar por necesidad concreta el uso de Earthdata, APIs astronomicas, datos planetarios u otros portales de la guia.
- Separar fuentes cientificas, datasets, recursos visuales y herramientas de desarrollo/hosting. Los beneficios de Google Cloud, Azure, GoDaddy, Miro u otros proveedores no son evidencia cientifica ni acceso confirmado a datos de astronautas.
- Las ofertas son opcionales. No crear cuentas, contratar servicios ni elegir arquitectura por la disponibilidad de una promocion sin una necesidad y autorizacion acordes.

## Indicadores, datos y trazabilidad

- Justificar cada indicador por relevancia operacional, evidencia, metodo de medicion, capacidad de interpretacion, acceso a datos y viabilidad.
- Separar indicadores de resultado, entradas de intervencion y metadatos de calidad. No confundir volumen, area, masa, fuerza, torque, densidad areal y densidad volumetrica.
- Separar el basal individual del astronauta de los valores de referencia de una poblacion. Conservar metodo, region, fecha y condiciones de cada basal; no sobrescribir su historia.
- Diferenciar origen y transformacion: datos humanos medidos, resultados agregados publicados, datos sinteticos, valores derivados y estimaciones del modelo.
- Antes de adoptar un dataset, inspeccionar archivos y variables, unidades, poblacion, frecuencia temporal, faltantes, licencia, version y restricciones de acceso. Una API publica o un articulo abierto no garantiza datos individuales abiertos.
- No convertir medias y desviaciones de un articulo en pacientes reales. Datos generados desde esos resumenes siguen siendo sinteticos.
- Para cada dato o parametro conservar fuente exacta, DOI/URL o identificador del repositorio, version, ubicacion en tabla/figura/archivo y transformaciones aplicadas.
- Para ejercicios distinguir protocolo prescrito, registro de sesiones realmente realizadas y ejecucion sintetica. El video terrestre de una persona no valida una respuesta fisiologica en microgravedad.
- Verificar OSD-942 y OSD-946 antes de usarlos: son estudios de expresion genica y microARN; no asumir que contienen curvas musculares longitudinales utilizables.
- No inferir densidad osea, masa muscular o fuerza directamente desde MediaPipe. Documentar que magnitudes puede observar el metodo elegido y con que limites.

## Modelos, incertidumbre y validacion

- No equiparar respaldo bibliografico con validacion del modelo o validacion clinica individual.
- Separar fundamentacion, verificacion computacional, ajuste de parametros, contraste empirico y evaluacion de comprension/utilidad para el usuario.
- Documentar entradas, ecuaciones/procedimiento, parametros, supuestos, dominio, version, limitaciones y resultados de evaluacion.
- Si se utiliza la misma evidencia para ajustar y evaluar, declarar la dependencia; buscar datos independientes cuando esten disponibles.
- No extrapolar silenciosamente de reposo en cama a vuelo, de una region a otra o de periodos cortos a misiones largas. Identificar extrapolaciones y sus restricciones.
- No presentar interpolaciones como mediciones longitudinales ni asociaciones como efectos causales.
- No inventar porcentajes de confianza, puntuaciones de evidencia, umbrales clinicos o distribuciones de parametros.
- Distinguir dispersion observada, incertidumbre de medicion, sensibilidad a parametros e intervalos estadisticos. Explicar que representa cada banda.
- Una entrada faltante solo puede alterar calculos que dependan de ella. Cuando corresponda, devolver resultado parcial, informacion insuficiente o fuera del dominio, con motivo explicito.
- Las acciones deben ser trazables a reglas o protocolos revisados. Una proyeccion por si sola no autoriza cambiar un tratamiento o prescribir ejercicio.

## Equipo, fronteras y contratos

- Equipo actual: dos integrantes de Sistemas, una persona de Medicina y una de Electronica. Acordar responsables y entregables sin cargar toda la integracion y el desarrollo a la usuaria.
- Medicina debe entregar evidencia estructurada y parametros interpretables, ademas de revisar indicadores, limites y acciones.
- Electronica puede trabajar con telemetria virtual, calidad y fallas; no asumir hardware fisico obligatorio.
- Frontend presenta anatomia, indicadores, comparaciones, evidencia y acciones. Backend conserva las reglas cientificas, procedencia, modelos, estados de aplicabilidad y calculos compartidos.
- Antes de desarrollar en paralelo, usar el acuerdo inicial OpenAPI y sus ejemplos en `contracts/`. La revision documental actual es 0.2; consultar `docs/revision-contratos.md` para cobertura, invariantes y pendientes. Coordinar cambios antes de implementar tipos distintos en cada parte.
- Definir identificadores de anatomia/indicadores, unidades, tiempo de mision, origen, calidad, ausencia, errores y versiones de modelos/fuentes/reglas.
- El contrato debe cubrir tambien acciones: fundamento, entradas utilizadas, requisitos, restricciones, motivo de abstencion y seguimiento cuando corresponda.
- La persistencia debe conservar por separado perfiles/misiones, basales/observaciones, ejercicios, evidencia, versiones de modelos/reglas y ejecuciones/resultados. La usuaria confirmo despliegue en nube; PostgreSQL es la base principal, tambien en desarrollo. Proveedor y servicios concretos siguen pendientes. Esta decision no autoriza crear infraestructura ni contratar servicios.

## Herramientas e implementacion futura

- Trabajar dentro del proyecto; localizar archivos con `rg` y leer solo contexto pertinente. Evitar volcados completos y directorios generados.
- Para onboarding o mejoras del flujo, usar la skill `efficient-repo-workflow`.
- Usar RTK selectivamente para salida verbosa de pruebas; preservar runner y codigo de salida. Leer codigo y diff completos con herramientas nativas.
- No agregar frameworks de trabajo, indices, herramientas o agentes adicionales sin necesidad concreta. Priorizar el consumo moderado de cuota.
- Cuando se autorice implementar, inspeccionar primero convenciones, formatter, linter, estandar y hooks existentes.
- Identificadores y comentarios del codigo en ingles. Convenciones estandar por lenguaje; comentarios breves, utiles y ASCII salvo requisito del proyecto.
- Errores estructurados y manejados explicitamente; evitar bloques catch vacios. Documentar APIs segun el lenguaje.
- Usar Make si el proyecto lo admite; en otro caso, el runner del proyecto. Ramas con prefijos `feat/`, `fix/`, `test/`, `refactor/` o `chore/` segun corresponda.
- Formatear los archivos modificados con herramientas locales y ejecutar format-check, comprobaciones pertinentes y hooks existentes. Revisar el resultado y el diff despues del formato.
- Reutilizar el flujo de hooks existente. No instalar ni reemplazar herramientas durante la etapa actual de planificacion.

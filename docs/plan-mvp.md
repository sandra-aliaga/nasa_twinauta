# Plan inicial del MVP

Plan inicial con contrato actualizado a 0.2. Documento de coordinación; no describe funciones ya implementadas.

## Decisiones confirmadas

- Sandra asume backend. La otra integrante de Sistemas trabaja en frontend.
- La aplicación se publicará en nube. PostgreSQL será la base principal; el proveedor sigue pendiente.
- Indicadores: área transversal muscular, torque de extensión de rodilla y ejercicio registrado frente al plan. Frecuencia cardíaca como complemento didáctico.
- El recorrido comienza en anatomía 3D y selección de una región.
- Evaluación, evolución de escenario y siguientes pasos tienen resumen y ampliación mediante grafo.
- Se requiere evidencia trazable. No se ha establecido validación clínica individual.
- Se autorizó el backend inicial y el setup mínimo de frontend con Tailwind. El código de integración utiliza contenido ilustrativo; la configuración científica sigue pendiente.

## Alcance inicial de trabajo

Un caso virtual precargado, cuádriceps como región obligatoria, un escenario muscular de referencia y una grabación cardíaca separada. Sóleo queda como ampliación si los datos y el modelo anatómico lo permiten.

| Obligatorio | Criterio observable en la futura demo |
| --- | --- |
| Selección anatómica | Seleccionar cuádriceps y reconocer la región elegida. Si el GLB no tiene mallas separadas, acordar un punto seleccionable identificado como región, sin simular una segmentación inexistente. |
| Evaluación de la zona | Explicar hallazgos, datos utilizados, procedencia y limitaciones. Título visible: «Evaluación de la zona». |
| Datos relacionados | Mostrar área relativa al basal, torque disponible y sesiones planificadas/registradas. No inventar una curva diaria de torque. |
| Evidencia ampliable | Abrir la vista de fundamento y consultar afirmaciones y fuentes concretas. |
| Evolución de referencia | Mostrar una trayectoria solo dentro del dominio del modelo; identificar supuestos y distinguirla del futuro clínico del astronauta. |
| Siguientes pasos | Mostrar acciones revisadas y sus requisitos. Registrar pendiente, realizado u omitido sin alterar la evidencia histórica. |
| Tres vistas de grafo | Fundamento, escenario y acciones comparten identificadores y una misma evaluación. |
| Telemetría cardíaca | Reproducir tiempo y frecuencia cardíaca; representar valores ausentes y mostrar que procede de otro participante terrestre. |
| Información insuficiente | Conservar la navegación y explicar qué no puede calcularse. |

El registro de ejercicio del primer caso será precargado y sintético. Un formulario para editar sesiones queda para una ampliación del contrato; no bloquea el primer recorrido integrado.

## Recorrido

1. Abrir caso virtual y día de misión.
2. Ver el cuerpo y seleccionar cuádriceps.
3. Solicitar una evaluación para ese día y un horizonte de referencia.
4. Leer resumen, hallazgos, indicadores y límites de interpretación.
5. Abrir «¿Por qué?» para consultar el grafo de fundamento.
6. Explorar «Evolución del escenario» y su grafo.
7. Revisar «Siguientes pasos», su grafo y el estado de cada acción.
8. Abrir o reproducir el panel cardíaco sin mezclar su reloj ni su participante con los datos musculares.

«No hacer nada» no equivale automáticamente al protocolo de reposo en cama. La aplicación describirá las condiciones del escenario en términos explícitos. Las opciones sin modelo respaldado mostrarán su limitación, no una trayectoria inventada.

## Responsables y entregables

| Responsable | Entregable |
| --- | --- |
| Sandra, backend | API, persistencia, evaluación, modelo de referencia, grafos y resúmenes coherentes. |
| Sistemas, frontend | Recorrido 3D, paneles, gráficas, tres vistas del grafo y conexión con el contrato. |
| Medicina | Fichas de evidencia, revisión de parámetros, interpretaciones, acciones y criterios de aplicabilidad. |
| Electrónica | Selección y preparación de la grabación cardíaca, unidades, faltantes y reproducción; registro virtual de ejercicio en coordinación con backend. |

La formulación científica del cálculo requiere trabajo compartido entre Medicina y backend. Las responsabilidades se revisarán si la carga resulta desigual.

## Orden de trabajo al autorizar programación

1. **Cerrar insumos:** inspeccionar GLB y licencia; confirmar archivos y parámetros musculares; seleccionar grabación cardíaca y acción operativa revisada.
2. **Usar el contrato 0.2:** revisar campos y ejemplos conjuntamente. Resolver cambios aquí antes de implementarlos por separado. Consultar la [revisión de cobertura](revision-contratos.md).
3. **Trabajar en paralelo:** frontend usa los ejemplos documentales; backend implementa primero casos, regiones y evaluación parcial con resumen de plantilla.
4. **Integrar temprano:** seleccionar una región y mostrar una respuesta real del backend con sus datos y su grafo de fundamento.
5. **Completar el recorrido:** incorporar escenario, acciones y telemetría. El contenido no revisado continúa identificado como pendiente.
6. **Revisar la demo:** comprobar manualmente el recorrido, procedencia, faltantes, dominio y navegación entre vistas. Preparar una explicación breve del caso.

## Qué se deja para después

- IA redactora, selección de proveedor y acceso externo; el resumen inicial será reproducible mediante plantillas.
- Hardware físico, MediaPipe, más regiones y modelos óseos.
- Cuentas de pacientes, autenticación para datos reales, múltiples misiones editables y prescripción médica automática.
- WebSocket, servicios separados, base de grafos y despliegue distribuido.
- Suites de pruebas y CI. La documentación no instala ni crea esas herramientas.

## Pendientes que sí condicionan la implementación

| Pendiente | Responsable de resolverlo |
| --- | --- |
| GLB, peso, licencia, nombres de mallas y región seleccionable | Frontend, con coordinación técnica. |
| Archivo exacto, método y dominio del modelo muscular | Medicina + backend. |
| Revisión independiente de las auditorías de datos compartidas | Medicina + Electrónica, según la fuente. |
| Catálogo pequeño de acciones y condiciones de aplicación | Medicina + backend. |
| Grabación cardíaca y condiciones de reutilización | Electrónica. |
| Proveedor de nube, presupuesto, región y almacenamiento de archivos; PostgreSQL ya elegido | Sandra + frontend. |

La maqueta y el contrato pueden avanzar con ejemplos sintéticos. Los cálculos y las acciones científicas no deben presentarse como revisados hasta resolver sus insumos.

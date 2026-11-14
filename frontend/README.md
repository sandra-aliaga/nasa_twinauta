# Frontend

Responsable: integrante de Sistemas a cargo de interfaz. Stack recomendado: React + TypeScript + Vite. Anatomía con React Three Fiber/Drei; grafos con React Flow. No hay aplicación ni dependencias instaladas en esta carpeta.

## Leer primero

1. [Plan y recorrido](../docs/plan-mvp.md).
2. [Contrato compartido](../contracts/README.md).
3. [Ejemplo de evaluación](../contracts/examples/assessment.json).
4. [Ejemplos de las tres vistas](../contracts/examples/graphs.json).
5. [Arquitectura](../docs/arquitectura.md).

Los JSON son documentación sintética para maquetar; no son resultados observados ni respuestas de un servicio existente.

## Pantalla principal

- Cuerpo 3D como centro y selección de región.
- Selector visible de caso/día, inicialmente un caso precargado.
- Panel contextual con «Evaluación de la zona», «Evolución del escenario» y «Siguientes pasos».
- Cada sección muestra primero un resumen; un botón permite abrir su vista de grafo.
- Indicadores con unidad, procedencia, fecha/día y método. El área normalizada se muestra como «% del basal», no como cm².
- Panel didáctico cardíaco con tiempo propio en segundos y etiqueta de procedencia terrestre.

Las tres secciones pueden ser pestañas del mismo panel. Utilizar un componente de grafo común; mantener selección y contexto al cambiar de vista. Las curvas temporales y los grafos de evidencia son visualizaciones diferentes.

## Acuerdo anatómico

El identificador semántico inicial es `quadriceps`, sin lateralidad individual inferida. Backend no conoce los nombres internos del GLB. Frontend mantendrá el mapeo desde ese identificador a mallas o puntos seleccionables después de inspeccionar el archivo y su licencia.

El caso entrega `anatomy_asset`, actualmente pendiente en el ejemplo; la API de regiones no entrega `mesh_names`. Frontend controla el mapeo del identificador semántico al activo concreto. Si no es viable separar mallas, acordar una selección por región e indicarlo sin atribuir precisión anatómica inexistente.

## Comportamiento frente a los datos

- El resumen y las tres vistas pertenecen a un mismo `assessment_id`; descartar respuestas atrasadas si cambia el día o región.
- El color de atención procede de `Finding.attention`; sus estados son informativos, no severidad clínica. Ausencia de datos no equivale a zona sana ni a riesgo alto.
- Mostrar datos disponibles aunque el estado global sea parcial o insuficiente.
- En un escenario fuera del dominio, mostrar el motivo y no dibujar una trayectoria inventada.
- Mostrar `null` como dato ausente. No reemplazarlo por cero ni unir automáticamente segmentos cardíacos separados por faltantes.
- La telemetría terrestre no representa una medición del astronauta virtual. No desplazar su reloj a días de misión sin una transformación declarada.
- Los grafos son de consulta; no permitir editar sus conexiones científicas desde la demo.
- Una acción marcada como realizada no implica mejora fisiológica automática.
- Antes del panel, consultar los catálogos; antes de reproducir la grabación, consultar sus metadatos. No adivinar el final a partir de una ventana vacía.
- Respetar `eligibility` de acciones. Al actualizar, enviar `expected_revision` y recuperar la evaluación si se recibe 409.

## Trabajo independiente del backend

Al comenzar la aplicación, implementar un adaptador que pueda leer los ejemplos o la API conservando la misma forma de datos. Mostrar una etiqueta permanente de modo de demostración cuando use ejemplos. El ejemplo gráfico contiene nodos preparados para probar navegación, no evidencia aprobada.

Cubrir carga, error de conexión, región sin seleccionar, evaluación parcial/insuficiente, escenario fuera de dominio y grafo vacío. Sus reglas están en [el contrato](../contracts/README.md).

El contrato actual es 0.2. La [revisión de cobertura](../docs/revision-contratos.md) distingue acuerdos técnicos de insumos todavía pendientes. Los [otros estados de ejemplo](../contracts/examples/assessment-states.json) permiten maquetar el recorrido completo sin asumir una validación científica.

Se propone `VITE_API_BASE_URL=http://localhost:8000/api/v1` para desarrollo. No colocar secretos en variables públicas del frontend. No se han creado archivos de entorno.

En nube, esa variable apuntará a la API pública HTTPS. El frontend no se conecta directamente a PostgreSQL ni recibe sus credenciales. El proveedor de alojamiento sigue pendiente.

Esta entrega no incluye código, pruebas o CI. Las versiones y el estilo visual definitivo se acordarán al crear la aplicación.

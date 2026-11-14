# Frontend

Responsable: integrante de Sistemas a cargo de interfaz. Se preparó exclusivamente el setup mínimo de React + TypeScript + Vite + Tailwind CSS. La compañera se encarga de toda la interfaz: diseño, anatomía, grafos, estado y conexión a la API. Las librerías de 3D y grafos todavía no forman parte de esta base.

## Arranque del setup

Desde la raíz del repositorio:

```bash
make frontend-install
cp frontend/.env.example frontend/.env
make frontend-run
```

Usar Node 22.12 o posterior compatible con Vite 8. La página de desarrollo usa `http://localhost:5173`. La API se configurará con `VITE_API_BASE_URL`; no hay un cliente HTTP implementado.

Tailwind está integrado mediante `@tailwindcss/vite` y `@import "tailwindcss"` en `src/styles.css`. No requiere configuración de Tailwind v3 ni PostCSS adicional.

```bash
make frontend-format
make frontend-check
```

Hay configuración local de Prettier y una pantalla inicial mínima. Los apartados siguientes describen el producto que implementará frontend, no funcionalidades terminadas.

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

El setup no incluye pantallas de producto, pruebas o CI. El estilo visual definitivo queda a cargo de frontend. Revisar la instalación y el build antes de dar por validado el entorno.

## Verificación de esta entrega

El formato se comprobó con Prettier 3.9.9 recuperado de la caché. La instalación completa y el build no se completaron por las restricciones del entorno y paquetes ausentes en caché. No hay un lockfile de npm generado; completar `make frontend-install` con acceso al registro antes de dar el build por validado.

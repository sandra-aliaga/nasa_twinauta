# Backend

Responsable: Sandra. Stack recomendado: Python + FastAPI + Pydantic. Esta carpeta contiene únicamente instrucciones; no hay servidor, entorno ni dependencias instaladas.

La base principal acordada es PostgreSQL, tanto para desarrollo como para el despliegue en nube. Se propone un servicio administrado; proveedor pendiente. La futura conexión se configurará con `DATABASE_URL` exclusivamente en backend.

## Leer primero

1. [Plan](../docs/plan-mvp.md).
2. [Arquitectura](../docs/arquitectura.md).
3. [Contrato](../contracts/README.md) y [OpenAPI](../contracts/openapi.yaml).
4. [Datos y evidencia](../docs/datos-y-evidencia.md).

## Organización al programar

Crear `app/` con la entrada del servidor, rutas HTTP, esquemas de contrato y módulos del dominio descritos en arquitectura. Crear carpetas de código cuando se incorporen implementaciones reales; no es necesario llenar el repositorio de módulos vacíos ahora.

Las rutas son adaptadores. Mantener la evaluación, el modelo y las reglas en funciones o servicios pequeños, independientes de FastAPI. Separar esquemas públicos de tablas de persistencia cuando sus responsabilidades sean distintas.

## Primer recorrido a implementar

- Caso virtual y catálogo de regiones/indicadores.
- Creación y consulta de una evaluación, empezando por la respuesta parcial documentada.
- Resumen mediante plantilla y grafo de fundamento con el mismo `assessment_id`.
- Escenario respaldado, acciones revisadas y sus otras dos vistas de grafo.
- Ventanas de telemetría y actualización de estado de una acción.

El contrato de partida no incluye un editor de misión o de observaciones. El caso y el ejercicio se precargan para el primer incremento.

## Reglas de integración

- Todas las rutas funcionales se plantean bajo `/api/v1`.
- En desarrollo se proponen backend `http://localhost:8000` y frontend `http://localhost:5173`. No están ejecutándose por crear estos documentos.
- Permitir el origen local acordado mediante CORS cuando se configure el servidor. La variable futura del frontend será `VITE_API_BASE_URL`, apuntando a la raíz que incluye `/api/v1`.
- El OpenAPI generado por FastAPI deberá coincidir con la especificación compartida. Cambiar primero el acuerdo documental y avisar a frontend.
- Distinguir errores HTTP de falta de evidencia o datos: una evaluación insuficiente puede ser una respuesta válida.
- No completar faltantes, bandas, umbrales o recomendaciones con valores inventados.
- Producir resultados deterministas para las mismas entradas y versiones. Conservar la procedencia y el dominio del modelo.
- Usar contrato 0.2: catálogos, metadatos cardíacos, afirmaciones de evidencia y dominio temporal explícito. No usar datos futuros al evaluar un día anterior.
- Comprobar consistencia entre indicador/unidad, estadísticas/basal, IDs científicos y estados de escenario. Estas reglas cruzadas se detallan en el contrato y no se resuelven solo comprobando tipos.
- Separar la instantánea científica inmutable del seguimiento mutable de acciones, con actualización por revisión para evitar sobrescrituras.

## Límites de la etapa actual

No crear implementación, manifests, comandos de arranque ficticios, tests, CI, Docker, hooks o servicios en esta entrega. Al autorizar código, fijar versiones compatibles, añadir formato mínimo y documentar comandos que realmente funcionen. La comprobación del primer recorrido será manual y focalizada.

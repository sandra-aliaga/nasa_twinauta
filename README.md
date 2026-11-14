# TwinNauta

Software exploratorio de salud espacial para comprender indicadores, consultar su evidencia y revisar siguientes pasos. El recorrido principal comienza en el modelo anatómico 3D.

## Estado

Contrato compartido 0.2 y código inicial de integración. Incluye backend FastAPI/PostgreSQL con datos sintéticos y setup mínimo de React/TypeScript/Vite/Tailwind. El modelo científico, la anatomía y las pantallas de producto siguen pendientes.

La implementación del backend inicial y el setup mínimo del frontend están autorizados. No se ha desplegado infraestructura ni creado CI o una suite de pruebas. Consultar [backend](backend/README.md) y [frontend](frontend/README.md) para instalación y límites de verificación.

## Tecnologías recomendadas

- Backend: Python + FastAPI, con modelos de entrada/salida de Pydantic.
- Frontend: React + TypeScript + Vite + Tailwind. Se mantienen React Three Fiber/Drei y React Flow como propuesta para la implementación posterior de interfaz.
- Persistencia: PostgreSQL como base principal para el despliegue en nube; archivos científicos separados y versionados.
- Comunicación: HTTP/JSON, contrato OpenAPI 3.1. Resúmenes mediante plantillas inicialmente.

Los manifests definen las dependencias iniciales; el setup mínimo de frontend conserva el diseño y los componentes del producto a cargo de su responsable.

El despliegue en nube está confirmado. El proveedor y los servicios concretos siguen pendientes; se propone frontend estático, backend FastAPI y PostgreSQL administrado.

## Por dónde empezar

| Documento | Para qué sirve |
| --- | --- |
| [Plan del MVP](docs/plan-mvp.md) | Alcance, recorrido, responsables, orden de trabajo y pendientes. |
| [Arquitectura](docs/arquitectura.md) | Módulos, tecnologías, persistencia y fronteras. |
| [Contrato compartido](contracts/README.md) | Semántica, operaciones y acuerdo entre frontend y backend. |
| [OpenAPI](contracts/openapi.yaml) | Definición estructurada de la API propuesta. |
| [Revisión de contratos](docs/revision-contratos.md) | Cobertura del recorrido, omisiones corregidas y decisiones pendientes. |
| [Datos y evidencia](docs/datos-y-evidencia.md) | Indicadores, procedencia, límites y requisitos de importación. |
| [Backend](backend/README.md) | Trabajo de Sandra y organización futura del servicio. |
| [Frontend](frontend/README.md) | Trabajo de interfaz y estados que debe representar. |

El contexto anterior se conserva en [el resumen del equipo](TwinNauta_contexto_investigacion_equipo.md) y [el contexto original](TwinNauta_contexto_para_Codex.md). Para decisiones actuales, usar este plan; los documentos anteriores conservan propuestas históricas.

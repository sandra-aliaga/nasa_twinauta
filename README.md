# TwinNauta

Software exploratorio de salud espacial para comprender indicadores, consultar su evidencia y revisar siguientes pasos. El recorrido principal comienza en el modelo anatómico 3D.

## Estado

Planificación técnica inicial, contrato documental 0.2, 14 de noviembre de 2026. Este repositorio contiene documentación y ejemplos sintéticos de contratos; todavía no contiene una aplicación ejecutable.

La autorización actual comprende el plan, los directorios y la documentación de coordinación. No se han instalado dependencias ni configurado pruebas, CI, infraestructura o servicios.

## Tecnologías recomendadas

- Backend: Python + FastAPI, con modelos de entrada/salida de Pydantic.
- Frontend: React + TypeScript + Vite; React Three Fiber/Drei para anatomía y React Flow para las tres vistas de grafo.
- Persistencia: PostgreSQL como base principal para el despliegue en nube; archivos científicos separados y versionados.
- Comunicación: HTTP/JSON, contrato OpenAPI 3.1. Resúmenes mediante plantillas inicialmente.

Estas son decisiones técnicas de partida; no son dependencias instaladas. Las versiones compatibles se fijarán al iniciar cada aplicación.

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

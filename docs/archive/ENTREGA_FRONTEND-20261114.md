# Entrega prioritaria para frontend

Este es el punto de entrada para continuar la interfaz de TwinNauta. Fecha: 14 de noviembre de 2026. La responsable de frontend conserva todas las decisiones de diseño e implementación de la interfaz.

**Estado actual:** las seis rutas de la propuesta ya cuentan con servicios de consulta. Búsqueda/ficha y grafo entregan candidatos; orientación entrega estados operativos congelados, sin interpretación clínica habilitada. La IA es preparación opcional por CLI y puede no tener resultados. Comprobar el servicio en `/docs` y no interpretar ausencia de análisis como fallo del frontend.

## Qué debe construir la experiencia

Seleccionar una región del cuerpo y un indicador, comprender su estado disponible y explorar estudios pertinentes a su interpretación, posibles implicaciones y contramedidas. El núcleo visible incluye un grafo de múltiples papers, ficha con resumen, métodos/resultados y acceso al original. Las tres vistas son filtros de una biblioteca común: `evidence`, `scenario`, `actions`.

El motor debe admitir módulos científicos para distintas regiones. El MVP implementa solo cuádriceps, área transversal relativa y torque; el registro de ejercicio aporta contexto y la frecuencia cardíaca es una reproducción didáctica terrestre. Una región sin módulo no se presenta como sana ni recibe reglas del cuádriceps.

## Archivos para compartir

Enviar o subir juntos los siguientes archivos, conservando sus rutas para que funcionen las referencias:

1. Esta guía.
2. [`contracts/drafts/scientific-explorer-0.3/README.md`](../contracts/drafts/scientific-explorer-0.3/README.md).
3. [`openapi.yaml` de la propuesta 0.3](../contracts/drafts/scientific-explorer-0.3/openapi.yaml), [`schemas.json`](../contracts/drafts/scientific-explorer-0.3/schemas.json) y [`examples.json`](../contracts/drafts/scientific-explorer-0.3/examples.json).
4. [`contracts/README.md`](../contracts/README.md), [`contracts/openapi.yaml`](../contracts/openapi.yaml) y los ejemplos actuales de `contracts/examples/`: API 0.2 implementada.
5. [`frontend/README.md`](../frontend/README.md) y [`docs/explorador-cientifico.md`](explorador-cientifico.md).

Para comprender el corpus real, compartir además la [bibliografía de 27 candidatos](../backend/data/literature/candidates/bibliography.md). No es necesario entregar a frontend el CSV de 23 MB ni los PDF completos para comenzar a maquetar. Las dos referencias de la fixture no representan el tamaño final de la biblioteca.

## Qué funciona y qué sigue propuesto

| Disponible en backend actual | Pendiente de completar o revisar |
| --- | --- |
| Casos, regiones, indicadores, evaluación sintética, acciones y orientación operativa congelada. | Interpretación fisiológica y acciones científicamente revisadas. |
| Biblioteca, búsqueda/ficha y grafo editorial expandible; catálogos y metadata del corpus. | Estadísticas revisadas, citas/aristas científicas y consolidación del contrato. |
| Grabación real PhysioNet y pipeline opcional de análisis de abstracts. | Proveedor/modelo real, evaluación de calidad y paquete offline completo. |

La forma propuesta ya dispone de servicios, pero no de todo el contenido científico. Mantener un modo fixture visible para trabajo independiente y estados de datos pendientes en el cliente real. No se cambió `contracts/openapi.yaml` 0.2; coordinar diferencias antes de generar tipos definitivos.

## Operaciones disponibles y ejemplos

| Ruta propuesta | Clave del archivo `examples.json` | Uso |
| --- | --- | --- |
| `GET /health-modules` | `modules` | Saber qué regiones/indicadores tienen módulo y qué interpretación está habilitada. |
| `GET /papers` | `papers` | Buscar por palabras clave, región, indicador, módulo, vista, años y revisión. |
| `GET /papers/{paper_id}` | `paper_detail` | Abrir resumen, abstract disponible, métodos, resultados, análisis y acceso. |
| `GET /knowledge-graph` | `graph` | Ampliar vecinos y alternar vistas; fusionar páginas por IDs. |
| `GET /knowledge-base/metadata` | `knowledge_base` | Mostrar versión y disponibilidad local del conocimiento. |
| `GET /assessments/{assessment_id}/guidance` | `guidance` y variantes `guidance_states` | Interpretación explicada, límites y pasos según el estado disponible. |

`guidance_states` incluye falta de datos, métodos incompatibles, equipo no disponible y región sin módulo. Son fixtures explícitamente ilustrativas; no prueban reglas clínicas. Las observaciones de fixture citadas son identificadores documentales, no filas existentes en la base.

## Comportamientos que no deben inferirse en frontend

- El tiempo de misión, la duración de exposición del estudio y los segundos de telemetría son relojes distintos.
- La IA puede resumir un abstract y proponer relaciones o intervenciones estudiadas. `ready` significa procesamiento terminado; `reviewed` es otra condición. No convertir una sugerencia en una acción habilitada.
- Atención informativa y aplicabilidad no son severidad clínica ni porcentajes de riesgo. Backend devuelve explicación y motivos; frontend no inventa umbrales o confianza.
- No promediar estadísticos entre papers ni convertir volumen, área y torque entre sí. Mostrar grupo, momento, n, unidad, DE/EE/intervalo y localizador cuando estén disponibles.
- Una relación de cita o similitud temática no significa apoyo científico. Las sugerencias de IA deben distinguirse visualmente de relaciones revisadas.
- Las URLs de texto/PDF pueden ser nulas. Permitir abrir la página original y mostrar si el documento está instalado o requiere conexión. No prometer un visor embebido para cualquier editorial.
- Un grafo extenso se explora por filtros y expansiones; no hace falta renderizar todo el corpus en una respuesta. Respetar versión y cursor.
- La interpretación contextual de una evaluación debe quedar congelada. Consultar la biblioteca actual no modifica el fundamento de una evaluación anterior.

## Frecuencia cardíaca ya integrada

ID real: `physionet_treadmill_1_0_1_2_1`. No está asociado al historial muscular del caso virtual. La señal sintética sigue disponible como `recording_illustrative_001`.

```text
GET /api/v1/telemetry/physionet_treadmill_1_0_1_2_1/metadata
GET /api/v1/telemetry/physionet_treadmill_1_0_1_2_1?start_s=0&end_s=120
```

Seguir `next_start_s` hasta nulo; conservar las 602 muestras y dos faltantes. No unir gráficamente los faltantes como si existiera medición continua. La última muestra está en 1046 s; el extremo exclusivo publicado permite incluirla. La API y PostgreSQL se verificaron localmente y se detuvieron al terminar: no existe una URL pública desplegada.

## Sin conexión y proveedor de IA

La propuesta prepara el conocimiento con conexión y permite consultarlo mediante un paquete local versionado. No requiere una API de IA por cada clic. Un modelo local es opcional futuro. El soporte offline de aplicación, recursos 3D y documentos debe implementarse y comprobarse; todavía no está terminado.

Sandra decidió mantener el proveedor configurable. Posibles créditos Google sin confirmar; no fijar Gemini/OpenAI/otro proveedor en tipos o pantallas. Las claves pertenecen al backend.

## Orden sugerido de trabajo de interfaz

1. Leer la propuesta 0.3 y revisar con backend dudas sobre los campos antes de generar tipos definitivos.
2. Adaptador mock y selección por catálogo de módulos; cobertura no disponible explícita.
3. Búsqueda y ficha del paper, estados de resumen/análisis, estadísticas y enlaces.
4. Grafo compartido con tres vistas, filtros y expansión por IDs.
5. Resumen contextual y variantes de `guidance_states`; estados vacíos, pendientes y fallos.
6. Conectar las rutas disponibles comprobándolas contra `/docs`; conservar fixtures como alternativa de maquetación y representar revisión científica pendiente.

No hay cambios de interfaz implementados en esta entrega. Los documentos y fixtures habilitan el trabajo de la responsable de frontend.

# Explorador científico contextual de TwinNauta

## Corrección de alcance

La biblioteca de estudios y su interpretación contextual son parte central del MVP. El grafo inicial del backend es una estructura introductoria; no implementa todavía este explorador. La anatomía 3D y los indicadores son entradas para consultar qué estudios ayudan a interpretar un cambio, cómo difieren sus métodos, qué consecuencias describen y qué contramedidas investigan.

Se conserva un corpus común con tres vistas: `evidence`, `scenario` y `actions`. La experiencia debe permitir abrir un paper, entender su resumen, revisar sus resultados y condiciones, ver investigaciones relacionadas y consultar el original. Un grafo bibliográfico de citas y un grafo de respaldo de afirmaciones representan relaciones diferentes.

## Flujo esperado

1. Seleccionar región e indicador; consultar la evaluación disponible.
2. Leer una explicación contextual: qué cambió, qué puede compararse y qué información falta.
3. Explorar papers pertinentes al estado, implicaciones o contramedidas; filtrar y ampliar vecindarios sin cargar toda la biblioteca de una vez.
4. Abrir la ficha con resumen, base de lectura, método, población, duración, resultados, limitaciones y acceso al original.
5. Contrastar estudios. Señalar diferencias de entorno, medición, intervención y posibles cohortes compartidas antes de presentar resultados como independientes o contradictorios.
6. Consultar siguientes pasos aplicables cuando existan reglas revisadas; conservar como candidatas las intervenciones extraídas de literatura sin esa revisión.

## Herramientas investigadas

| Recurso | Qué aporta | Límite para TwinNauta |
| --- | --- | --- |
| [Open Knowledge Maps](https://openknowledgemaps.org/faq), motor [Headstart](https://github.com/OpenKnowledgeMaps/Headstart) | Mapa por palabras clave; agrupación temática basada en metadatos. Headstart declara licencia MIT. | La similitud temática no determina aplicabilidad al astronauta ni respalda automáticamente una acción. No se comprobó una API pública estable para integrar su servicio. |
| [Local Citation Network](https://github.com/LocalCitationNetwork/LocalCitationNetwork.github.io) | Exploración de redes de referencias y citas; software GPL-3.0. | Útil para ampliar literatura desde semillas. No produce por sí solo evaluación metodológica o reglas de actuación. No se decidió incorporar su código. |
| [Europe PMC API](https://dev.europepmc.org/RestfulWebService) | Búsqueda biomédica, metadatos y abstracts; texto completo cuando está disponible mediante los servicios correspondientes. | Un registro localizado no equivale a una lectura completa ni a datos individuales disponibles. |
| [GROBID](https://github.com/grobidOrg/grobid) | Extracción de estructura bibliográfica y texto desde documentos científicos. | Es un procesador de documentos; no valida resultados, aplicabilidad o recomendaciones. Integración pendiente de necesidad concreta. |
| [Scrapy](https://docs.scrapy.org/en/latest/intro/overview.html) | Rastreo y extracción de páginas o fuentes estructuradas. | No hace falta incorporarlo para empezar por APIs científicas. No reemplaza el acceso autorizado ni la interpretación de las fuentes. |

Propuesta de implementación inicial: consultas reproducibles a Europe PMC, deduplicación por identificadores, expansión bibliográfica cuando haya datos verificables y corpus local versionado. Usar herramientas existentes para descubrir literatura y estudiar visualizaciones; evaluar compatibilidad y mantenimiento antes de integrar motores completos.

Para recuperar automáticamente contenido de PMC, usar los [servicios de recuperación que especifica PMC](https://pmc.ncbi.nlm.nih.gov/tools/textmining), conservando condiciones de reutilización. Los abstracts, los PDF, los datasets y las herramientas de búsqueda tienen procedencias y permisos distintos.

## Papel de la IA

La IA propuesta lee el abstract o texto disponible y produce una salida estructurada: resumen, hallazgos, implicaciones descritas e intervenciones estudiadas. Cada elemento conserva el paper y fragmento que lo fundamenta, alcance de lectura, modelo, versión de prompt y hash de entrada. Puede proponer relaciones para la vista previa, identificadas como sugerencias pendientes.

Decisión de Sandra: mantener el proveedor configurable y elegir después por calidad/coste. Los posibles créditos de Google no están confirmados ni determinan la arquitectura. El adaptador de generación debe entregar la misma estructura independientemente del proveedor; cambiarlo no modifica el contrato de frontend. No se crearon cuentas ni se ejecutó consumo de IA para esta entrega.

Una intervención descrita por un paper no equivale a una recomendación individual. Las reglas de aplicabilidad comprueban método de medición, población, entorno, duración de exposición, momento de evaluación y recursos. El estado de misión ayuda a situar la consulta, pero no convierte automáticamente un día de misión en un día equivalente de reposo en cama.

Mostrar resultados cualitativos explicables: contexto compatible, evidencia de un análogo, comparación no válida o información insuficiente. Estos estados describen aplicabilidad de evidencia, no una probabilidad de daño ni una prioridad clínica validada. Cualquier atención o acción operativa requiere fundamento y regla revisados; la IA no inventa umbrales o porcentajes de confianza.

Los resultados cuantitativos conservan variable, grupo, momento, n, unidad y localizador. Si el abstract no proporciona un dato, queda pendiente de lectura del texto completo. La extracción de números debe comprobarse contra la tabla o fragmento original antes de utilizarse en cálculos o acciones.

## Autonomía y funcionamiento sin conexión externa

Propuesta: separar preparación y uso. En Tierra o durante una actualización con conexión se descubren papers, obtienen documentos permitidos, generan borradores de IA y revisan reglas/extracciones. Se publica un paquete con corpus, resúmenes, relaciones, estadísticas, documentos disponibles y versiones.

Durante la consulta, el backend local utiliza ese paquete: buscar, navegar, comparar indicadores y aplicar reglas no requiere llamar a una API pública de IA. Los resúmenes pueden estar precalculados y las explicaciones contextuales construirse con plantillas. Un modelo local es una alternativa posterior, sujeta a recursos y evaluación; no está elegido ni integrado.

La demo alojada en nube no demuestra por sí sola autonomía de vuelo. Para comprobar el comportamiento propuesto se necesita ejecutar localmente el servicio con el paquete instalado y verificar el recorrido sin salida a Internet. El frontend requiere disponibilidad local de su aplicación y recursos; el contrato por sí solo no implementa ese soporte.

Las fechas y versiones del paquete deben ser visibles. No presentar enlaces remotos como documentos disponibles sin conexión: si el texto/PDF no se incluyó, mostrar que solo está instalada su ficha o resumen. Cuando vuelve la conexión, una actualización revisada produce otra versión; no modifica evaluaciones históricas.

NASA ya desarrolla autonomía médica y apoyo a decisiones: [AMO](https://www.nasa.gov/directorates/stmd/game-changing-development-program/autonomous-medical-operations-amo/) aborda apoyo a bordo ante comunicaciones demoradas, y [CMO-DA, publicación 2026](https://ntrs.nasa.gov/citations/20260001797) describe trabajo de interoperabilidad y soporte clínico. Son antecedentes; no corresponde presentar la autonomía o el uso de IA como invenciones de TwinNauta. Las comunicaciones dependen de la misión: la necesidad de diseño es funcionar sin una conexión continua, no asumir ausencia permanente de comunicación en toda misión lunar.

## Entrega para frontend

La [propuesta de contrato 0.3](../contracts/drafts/scientific-explorer-0.3/README.md) incluye búsqueda, ficha, análisis de IA, estadísticas, aplicabilidad, versión del paquete y expansión de grafo. El contrato 0.2 permanece implementado. La propuesta permite maquetar con un adaptador mock; todavía no convierte esas rutas en endpoints existentes.

Frontend presenta búsqueda/filtros, grafo expandible, ficha y original, estados de análisis/revisión y disponibilidad local. Backend conserva búsqueda/ingesta, generación, procedencia, versiones y reglas de interpretación. La selección de proveedor de IA está pendiente y sus claves pertenecen exclusivamente al backend.

## Criterio de éxito del incremento

El objetivo es recorrer un indicador hasta varios estudios pertinentes, ver una comparación metodológica honesta y comprender por qué una conclusión o acción resulta aplicable o sigue pendiente. La cantidad visible debe provenir del corpus real; ni una cuota de papers ni el tamaño del grafo demuestran validación. El primer corpus de candidatos necesita revisión antes de habilitar sus relaciones científicas y acciones.

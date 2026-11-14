# Revisión de contratos esenciales

14 de noviembre de 2026. Resultado: contrato documental 0.2. Esta revisión fue documental, anterior al backend inicial. El estado de la implementación y sus límites de verificación están en `backend/README.md`.

## Conclusión

La forma de los datos y operaciones del recorrido principal queda definida para desarrollar frontend y backend en paralelo. La revisión encontró omisiones técnicas en 0.1 y las corrigió. Esto no cierra la extracción científica, el diseño anatómico o la configuración del proveedor de nube.

## Cobertura del recorrido

| Necesidad | Contrato actual | Resultado |
| --- | --- | --- |
| Elegir caso y día | `Case`, duración y `AssessmentRequest` | Definido; datos disponibles solo hasta el día elegido. |
| Encontrar el GLB | `Case.anatomy_asset` | Forma definida; archivo, URL y licencia pendientes. |
| Seleccionar región | `Region` y mapeo local del frontend | Definido; se retiraron nombres de malla del contrato de backend. |
| Conocer indicadores | `GET /indicators` | Añadido; nombres, unidades e interpretación del basal. |
| Leer evaluación | `Assessment`, hallazgos y contexto de evidencia | Definido; atención informativa separada de severidad clínica. |
| Comparar datos | `Observation` con basal, tipo de estadística y calidad | Añadido; no confundir media de grupo con valor individual. |
| Inspeccionar estudios | `Source` y `EvidenceClaim` | Añadida afirmación, población, entorno, muestra y límites. |
| Explorar evolución | Escenario con dominio, parámetros y tres relojes separados | Añadido dominio y corregidas descripciones ambiguas. |
| Comprender recomendaciones | Acción con fundamento, requisitos y elegibilidad | Añadida razón de habilitación o abstención. |
| Registrar seguimiento | Revisión esperada y conflicto 409 | Definido para evitar sobrescrituras; no modifica ciencia histórica. |
| Abrir tres grafos | Vistas con evaluación, versiones, afirmaciones y fuentes | Definido; relaciones científicas trazables. |
| Reproducir frecuencia cardíaca | Metadatos, ventanas y siguiente inicio/final | Añadidos límites y final de grabación. |
| Diseñar estados alternativos | Ejemplos completa, parcial, insuficiente y fuera del dominio | Añadidos ejemplos ilustrativos; sin resultados clínicos inventados. |
| Mostrar errores | Objeto común y ejemplos 404/409/422 | Definido, incluyendo validación y conflicto. |

## Contrato de almacenamiento que debe respetar backend

Todavía no es una migración ni un diseño físico de tablas. Estas relaciones son el mínimo lógico para PostgreSQL:

- Caso → observaciones y registros de ejercicio precargados. Solo lectura en el primer incremento.
- Evaluación → caso, región, día, entradas congeladas, versiones y fecha.
- Evaluación → escenario, parámetros y resultado; no reconstruir una ejecución anterior con parámetros nuevos.
- Fuente → afirmaciones. Una afirmación puede utilizar varias fuentes y una fuente puede sustentar varias afirmaciones.
- Hallazgo/acción/arista científica → afirmaciones; conservar referencias válidas.
- Acción → evaluación y seguimiento con revisión. Actualizar estado/revisión en una operación atómica y conservar intacto el fundamento original.
- Grabación → dataset, participante original, metadatos y archivo normalizado. No relacionarla como medición individual del caso virtual.

Los IDs de ejemplos son ficticios. En ejecución, usar identificadores de evaluación independientes por solicitud/visitante y no un único registro global que sobrescriba el trabajo de todos. El caso precargado no se edita con los endpoints de esta versión.

## Qué sigue pendiente y cuánto bloquea

| Definición pendiente | Quién la resuelve | Qué bloquea |
| --- | --- | --- |
| GLB, licencia, mallas/puntos y tamaño aceptable | Frontend | Selección anatómica real. Puede avanzar con una maqueta identificada. |
| Modelo, coeficientes, unidades y dominio exacto | Medicina + backend | Cálculo basado en evidencia. Puede avanzar la estructura y los estados de insuficiencia. |
| Interpretaciones y acciones revisadas | Medicina + backend | Recomendaciones basadas en evidencia. Solo ejemplos editoriales mientras estén pendientes. |
| Grabación exacta, licencia, normalización y conteo de faltantes | Electrónica | Telemetría real. Puede avanzar con los ejemplos ficticios. |
| Proveedor, región, presupuesto, archivos y respaldo PostgreSQL | Equipo técnico | Publicación persistente en nube; no el contrato funcional. |
| Versiones compatibles de dependencias y presentación visual | Backend/frontend | Creación de las aplicaciones. No cambia el significado de los datos acordados. |

La IA redactora sigue opcional y diferida: el MVP tiene resúmenes mediante plantillas. Si se incorpora, habrá que acordar entrada/salida, afirmaciones permitidas y respuesta alternativa; no bloquea este contrato.

Login, datos clínicos privados, edición de misión y sesiones, múltiples modelos seleccionables y comparación automática de contramedidas siguen fuera del primer incremento. Una publicación con usuarios o datos reales exigiría revisar ese alcance; no se declara cubierto por la demo actual.

## Criterio para empezar en paralelo

Frontend puede usar los catálogos, evaluación y tres grafos documentales sin inventar tipos o estados. Backend puede implementar estas mismas operaciones sin decidir diseño visual. La integración científica requiere resolver las filas pendientes correspondientes; la cobertura documental no es validación de resultados.

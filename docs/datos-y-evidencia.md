# Datos y evidencia del MVP

## Indicadores elegidos

| Identificador | Magnitud | Unidad pública | Uso |
| --- | --- | --- | --- |
| `quadriceps_csa_relative` | Área transversal relativa al basal | `percent_baseline` | Trayectoria ilustrativa, conservando la definición del modelo. Basal normalizado: 100. |
| `knee_extension_torque` | Torque bajo protocolo definido | `N.m` | Evaluación periódica o referencia de grupo, sin curva diaria inferida. |
| Registro de ejercicio | Plan y sesiones registradas | Minutos, repeticiones y resistencia según modalidad | Reconocer cambios de registro y disponibilidad. No convertir cumplimiento en atrofia. |
| `heart_rate` | Frecuencia cardíaca | `beats/min` | Telemetría didáctica de ejercicio terrestre. |

El área absoluta, si se importa, requiere `cm2` y su propio indicador. No convertir área a volumen, ni área normalizada a cm² sin una medición basal absoluta. El torque publicado de un grupo no es el basal individual de un astronauta.

## Fuentes candidatas y estado

La conversación incluye una auditoría compartida por la usuaria. Sus cifras exactas y el conteo de faltantes no se han vuelto a calcular en esta entrega documental. No se incorporaron datos descargados al repositorio.

| Fuente | Material utilizable propuesto | Comprobación antes de programar el cálculo |
| --- | --- | --- |
| [NASA Bed Rest Study, 2020](https://doi.org/10.1097/CCE.0000000000000269) y [suplemento](https://cdn-links.lww.com/permalink/ccx/a/ccx_1_1_2020_10_22_scott_20-00318_sdc1.pdf) | Tendencias temporales de área muscular durante reposo en cama. La auditoría compartida informa −0,11 % del basal/día para cuádriceps. | Confirmar tabla, método, población, intervalos temporales y significado exacto de la tasa. No aplicar recuperación terrestre durante vuelo ni extrapolar fuera del protocolo. |
| [SPRINT 2024](https://journals.physiology.org/doi/full/10.1152/japplphysiol.00489.2023) | Torque antes/después por grupo y protocolo de ejercicio. | Confirmar tabla, unidad, velocidad angular, condiciones y dispersión. El Excel de fibras no equivale a registros diarios de torque. |
| [PhysioNet, versión 1.0.1](https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/) | `subject-info.csv` y `test_measure.csv`; grabación terrestre. | Revisar licencia, cabeceras, IDs, faltantes y selección de una prueba. Registrar transformación y unidades. |

La referencia reciente [Böcker 2026](https://www.nature.com/articles/s41526-026-00611-2) permite contrastar transferibilidad, no validar automáticamente la tasa del cuádriceps. Comprobar si otras publicaciones reutilizan la misma cohorte antes de contarlas como validación independiente.

## Cuatro procedencias separadas

- Datos humanos medidos: participante, método y contexto de origen conservados.
- Resultados agregados publicados: media, dispersión, población y protocolo.
- Registros sintéticos: creados para el caso de demostración.
- Valores derivados: calculados a partir de entradas identificadas, con versión del procedimiento.

El contrato separa `origin` de `derivation`. Un cálculo sobre entradas sintéticas conserva origen sintético. La grabación cardíaca real pertenece a su participante original; no completa el historial muscular del caso virtual.

## Registro mínimo de cada fuente y parámetro

- ID, título, DOI/URL, versión, fecha de consulta y licencia/condiciones de acceso.
- Archivo exacto y checksum al importar; ubicación de tabla, figura, hoja o columna.
- Población, muestra, entorno, región, protocolo y calendario de medición.
- Variable, unidad, transformación y parámetros adoptados.
- Limitaciones, posible dependencia entre publicaciones y estado de revisión.
- Nombre de quien revisó la extracción y fecha. Una ficha pendiente no habilita una recomendación clínica.

## Acciones y resumen

Primero documentar acciones operativas: revisar un registro, completar información o consultar una evaluación. Cada regla indica entradas, motivo, requisitos y seguimiento. Las alternativas de ejercicio necesitan evidencia y revisión específica; citar el estudio de pérdida muscular no basta para autorizar una intervención.

Los ejemplos del contrato usan contenido sintético y una acción editorial de revisar registros. No son un catálogo clínico aprobado. No publicar una recomendación pendiente como consejo médico.

## Dominio e incertidumbre

- Registrar el rango temporal respaldado por cada modelo; comprobar también el tiempo final del horizonte solicitado.
- La tendencia de referencia tiene condiciones propias. El día de misión de un caso virtual no demuestra exposición equivalente a reposo en cama.
- Distinguir reconstrucción de una tasa publicada de reproducción del modelo estadístico completo.
- El parámetro de cuádriceps no permite inferir una respuesta individual a un porcentaje arbitrario de ejercicio.
- Mostrar calidad de datos, aplicabilidad de evidencia y límites del modelo por separado. No inventar una confianza global o bandas estadísticas.
- No interpolar torque como si hubiera mediciones diarias.

## Necesidad que orienta las decisiones

Las decisiones se contrastan con [MA-201](https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833), sobre contramedidas y recursos limitados, y con las capacidades descritas en el contexto. La base de evidencia, la simulación humana y el apoyo a decisiones ya tienen antecedentes en NASA; la originalidad de TwinNauta sigue siendo una hipótesis a comprobar.

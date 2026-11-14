# Investigación complementaria: datos, interpretación y acciones

Fecha: 14 de noviembre de 2026. Estado: revisión acotada de fuentes; no modifica contratos ni habilita cálculos clínicos. Los PDF de referencia nuevos están guardados en este directorio. No se encontró un nuevo CSV individual adecuado de área transversal del cuádriceps.

## 1. Preguntas y criterio de contraste

1. ¿Puede interpretarse MR079G_CFT70 como torque de rodilla con unidad, velocidad, fechas y grupos conocidos? Se buscó un diccionario explícito del depósito, contrastándolo con el protocolo publicado. Una coincidencia de valores no basta para confirmar la semántica de una columna.
2. ¿Existe una serie individual longitudinal abierta de área transversal del cuádriceps? Se revisaron estudios primarios recientes y declaraciones de acceso. Se excluyeron volumen, espesor, área de fibras aisladas y datos moleculares como sustitutos del indicador.
3. ¿Qué siguientes pasos operativos y qué límites del escenario apoya NASA? Se contrastó la ficha de ejercicio de 2023 con una publicación institucional de 2025 y la brecha MA-201. Las acciones propuestas por TwinNauta siguen siendo propuestas de producto, sujetas a revisión de Medicina.

## 2. MR079G: integridad y semántica

Fuente institucional: NASA LSDA. *Isokinetic Muscle Function (Flight Analog), MR079G*. DOI [10.83263/bk5h-r757](https://doi.org/10.83263/bk5h-r757). [Metadatos oficiales del conjunto CFT70](https://nlsp.nasa.gov/api/v1/data/datasets/273b87ec-c813-5833-972a-d602f473d2ed/full).

**Resultado nuevo:** los metadatos ya conservados en `../nasa_mr079g/cft70_metadata.json`, ruta `related.data_files.items`, incluyen nombre original y `__file_md5sum`. Los nueve CSV locales coinciden con los MD5 publicados por NASA. Esto comprueba integridad de descarga, no unidades, licencia ni validez científica.

| Archivo | MD5 local y publicado | Resultado |
| --- | --- | --- |
| `MR079G_CFT70_POST1_verifiers_ALL.csv` | `c38ed41a572a35a26cf966a9f73def57` | Coincide |
| `MR079G_CFT70_PRE2_verifiers_ALL.csv` | `d682e0af191a10f5eab295701f763ccb` | Coincide |
| `MR079G_CFT70_Demographics_ALL.csv` | `37e9f6cea495c2731957915fce45c9fe` | Coincide |
| `MR079G_CFT70_POST2_verifiers_ALL.csv` | `440b84ce6b4f89a8cecae8da74e82652` | Coincide |
| `MR079G_CFT70_PRE2_strength_ALL.csv` | `f92a5df6460c0aced128e71eea209317` | Coincide |
| `MR079G_CFT70_PRE1_strength_ALL.csv` | `f18cb7eaa57faba28c7c104861131062` | Coincide |
| `MR079G_CFT70_PRE1_verifiers_ALL.csv` | `3e1c9bb35233a2fe8196a4f3cd221282` | Coincide |
| `MR079G_CFT70_POST2_strength_ALL.csv` | `39bce78e8444a8788e5cc39e8b38d055` | Coincide |
| `MR079G_CFT70_POST1_strength_ALL.csv` | `22a08495f3cb7682a4644d5a5b7fa680` | Coincide |

El nombre original publicado ya termina en `.csv`: el catálogo simplificado omitía esa extensión. No se hizo una conversión de formato.

### Contraste con el protocolo

**Cromwell, R. L., Scott, J. M., Downs, M., Yarbough, P. O., Zanello, S. B., & Ploutz-Snyder, L. (2018).** Overview of the NASA 70-day Bed Rest Study. *Medicine & Science in Sports & Exercise, 50*(9), 1909–1919. [DOI 10.1249/MSS.0000000000001617](https://doi.org/10.1249/MSS.0000000000001617). [Texto primario](https://pmc.ncbi.nlm.nih.gov/articles/PMC6591716/).

El apartado **Isokinetic testing** describe Biodex System 4, miembro derecho, torque pico en varias velocidades y trabajo total de 20 repeticiones para resistencia. La tabla 2 sitúa pruebas antes del reposo (−11 y −5) y después (+2 y +12). Es un protocolo general de campaña, no un diccionario de cada archivo del depósito.

| Elemento | Conclusión acotada | Pendiente antes de importarlo como medición normalizada |
| --- | --- | --- |
| `Test_Type=KES` | Compatible con extensión de rodilla y sus pruebas de fuerza en el protocolo. | Falta diccionario que vincule explícitamente el código con el dato depositado. |
| `Angle` | Los valores se parecen a las velocidades del protocolo. Es una inferencia, no confirmación del campo. | No renombrar a velocidad ni asignar °/s automáticamente. |
| `Value` | Fuerza isocinética y resistencia son magnitudes diferentes. | Confirmar N·m para torque y J para trabajo; no asignar una unidad única a todas las filas. |
| PRE1/PRE2/POST1/POST2 | Cuatro evaluaciones coherentes con el calendario general. | Confirmar correspondencia exacta y días por participante; no tratarlos como días de misión. |
| CONTROL/EXERCISE/FLY | Etiquetas depositadas por NASA. | Confirmar intervenciones, inclusiones/exclusiones y correspondencia con artículos. |

No apareció un documento de diccionario en los metadatos consultados: `related.protocol_approach.total=0`, `related.documents.total=0` y `related.external_resources.total=0`. La búsqueda textual tampoco resolvió esos campos. No significa que el diccionario no exista fuera de esos registros.

**Decisión:** conservar/importar únicamente como datos de investigación sin semántica fisiológica confirmada; bloquear cálculos que necesiten unidades o interpretación no verificadas. Siguiente contraste: obtener ficha del archivo o aclaración del archivista a través del canal institucional, sin enviar mensajes por iniciativa del software.

## 3. Área transversal: segunda búsqueda y resultado

- **Sarto et al. (2025),** *Twenty-one days of bed rest alter motor unit properties and neuromuscular junction transmission in young adults*. [DOI 10.1152/japplphysiol.00178.2025](https://doi.org/10.1152/japplphysiol.00178.2025). Mide área del cuádriceps antes/después de 21 días, con nueve participantes. [PDF del repositorio universitario](https://www.research.unipd.it/retrieve/c0abc0b3-5dba-4a08-800e-d3b56cf6c95f/sarto-et-al-2025-twenty-one-days-of-bed-rest-alter-motor-unit-properties-and-neuromuscular-junction-transmission-in.pdf). Su declaración de acceso libera imágenes de unión neuromuscular; los otros datos requieren solicitud. La [API de su suplemento Figshare](https://api.figshare.com/v2/articles/28769750) se consultó: ofrece un DOCX de tabla estadística, no un CSV de área individual. No se adoptó como dataset.
- **Smeuninx et al.,** *A single bout of prior resistance exercise attenuates muscle atrophy and declines in myofibrillar protein synthesis during bed-rest in older men*. [DOI 10.1113/JP285130](https://doi.org/10.1113/JP285130), [texto y declaración de acceso](https://pmc.ncbi.nlm.nih.gov/articles/PMC11702921/). La publicación declara datos no públicos y disponibles previa solicitud. Además usa adultos mayores y cinco días de reposo. No es sustituto directo del estudio NASA ni un archivo descargable inmediato.
- **SPRINT 2025,** *Myonuclear and satellite cell content of the vastus lateralis and soleus with 70 days of simulated microgravity and the NASA SPRINT exercise program*. [Texto primario](https://pmc.ncbi.nlm.nih.gov/articles/PMC12188944/). Explicita el uso de los mismos individuos de resultados previos: no es validación externa independiente y mide variables celulares.

**Decisión:** mantener la reconstrucción ilustrativa del área basada en Scott 2020, sin presentarla como serie individual observada ni predicción individual de vuelo. El dato individual longitudinal sigue pendiente; no rellenarlo mediante digitalización o interpolación sin etiquetar la transformación.

## 4. Acciones y límites: fuentes NASA contrastadas

**NASA, Office of the Chief Health and Medical Officer (2023).** *Exercise Overview*. NASA-STD-3001 Technical Brief **OCHMO-TB-031**. [Página oficial](https://www.nasa.gov/ochmo-tb-031-exercise-overview-2/), [PDF original](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-031-exercise-overview.pdf), página 13.

La ficha describe supervisión de condición física y prescripción por especialistas, seguimiento de tiempo e intensidad y dependencia del equipo disponible. Es una referencia institucional; no reemplaza requisitos de misión ni un protocolo clínico autorizado.

**Taoufik, S. D., Coffey, K. M., & Francisco, D. R. (2025).** *Astronaut physiological deconditioning and exercise prescription countermeasures in spaceflight*. NASA **SP−20250000273**, enero de 2025. [PDF oficial](https://www.nasa.gov/wp-content/uploads/2025/02/sp-20250000273.pdf).

Se descargó y comprobó el PDF. Confirma que los especialistas monitorizan y actualizan prácticas de ejercicio. Explica que comunicaciones demoradas, restricciones de equipo y dificultad de reemplazo de piezas complican la operación de misiones futuras. Es evidencia institucional para considerar disponibilidad y revisión humana, no una ecuación que convierta sesiones omitidas en pérdida muscular.

**NASA Human Research Program (s. f.).** *MA-201: Determine the required exercise countermeasure or countermeasures (i.e., modality or modalities, prescription, monitoring) to protect mission-specific task performance and crew health outcomes*. [Registro oficial de brecha](https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833).

Contraste crítico: NASA reconoce dificultad para aislar efectos de dispositivos y prescripciones, respuestas individuales diferentes y limitaciones de análogos idealizados ante restricciones de misión. Esto impide presentar una tasa única de reposo en cama como resultado inevitable de no entrenar durante el vuelo.

### Acciones de producto propuestas a revisión de Medicina

Estas son inferencias de diseño trazables a las fuentes anteriores, no instrucciones clínicas extraídas literalmente de NASA.

| Condición observable | Siguiente paso propuesto | Responsable humano | Comprobación y límite |
| --- | --- | --- | --- |
| Sesión prevista sin registro | Confirmar si se realizó y completar o corregir el registro. | Tripulante. | Registro confirmado o ausencia explicitada; no inferir lesión ni atrofia a partir de ausencia administrativa. |
| Equipo requerido no disponible | Registrar la restricción y solicitar revisión del plan autorizado. | Tripulante y responsable de contramedidas/medicina. | Estado del equipo y revisión registrada; no generar sustitución automática de cargas o ejercicios. |
| Cambio de torque en evaluaciones comparables | Revisar método, calidad y basal; preparar el caso para evaluación del responsable. | Especialista o responsable clínico designado. | Misma unidad/protocolo y evaluaciones trazables; sin umbral clínico inventado. |
| Datos insuficientes o protocolos distintos | Mostrar lo que falta y qué evaluación o documentación debe confirmarse. | Tripulante y equipo revisor. | Información confirmada; abstenerse de comparación cuantitativa cuando no sea válida. |

La finalización de una tarjeta indica que se revisó o registró una acción; no demuestra recuperación fisiológica. La frecuencia de reevaluación y cualquier cambio de ejercicio requieren protocolo revisado, aún pendiente.

## 5. Archivos nuevos conservados

| Original local | Bytes | Páginas PDF | SHA-256 local |
| --- | ---: | ---: | --- |
| [ochmo-tb-031-exercise-overview.pdf](ochmo-tb-031-exercise-overview.pdf) | 1282311 | 26 | `3bf5e2cd008761da166d00c8fe1b8c2698f82cc8c60112509f7f4eb5e00d898d` |
| [nasa-sp-20250000273.pdf](nasa-sp-20250000273.pdf) | 1339847 | 26 | `3593d09a24f17678b7ab2d9538f4fce8f57e7baa000a171fe7a8c1ca3c10d3bd` |

## 6. Qué quedó resuelto y qué no

Resuelto: integridad MD5 NASA de nueve CSV; protocolo general y calendario publicados; dos documentos oficiales descargados para respaldar seguimiento y restricciones operativas; contraevidencia explícita a una predicción individual simple.

Pendiente: diccionario del archivo para unidades y `Angle`; correspondencia de grupos y cohortes; fechas exactas de evaluaciones; archivo individual longitudinal de área; protocolo aprobado de recomendaciones. Ningún resultado nuevo autoriza atribuir a NASA ausencia de herramientas de apoyo a decisiones ni originalidad clínica de TwinNauta.

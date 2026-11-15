# TwinNauta

Software exploratorio de salud espacial para comprender indicadores, consultar su evidencia y revisar siguientes pasos. El recorrido principal comienza en el modelo anatómico 3D.

**Para continuar:** [entrega prioritaria a frontend](docs/ENTREGA_FRONTEND.md), [backlog backend v2](docs/backlog-backend-v2.md) y [traspaso a otra IA](docs/CONTINUAR_CON_OTRA_IA.md). El [contrato vigente 0.3.0](contracts/openapi.yaml) incluye biblioteca, orientación y síntesis contextual por evaluación. La [base compartida para frontend](backups/README.md) contiene los 27 papers, 26 resúmenes y el contexto de demostración.

## Estado

Contrato compartido 0.3.0 y backend de integración. Incluye backend FastAPI/PostgreSQL con datos sintéticos y setup mínimo de React/TypeScript/Vite/Tailwind. El modelo científico, la anatomía y las pantallas de producto siguen pendientes.

La implementación del backend inicial y el setup mínimo del frontend están autorizados. No se ha desplegado infraestructura ni creado CI o una suite de pruebas. Consultar [backend](backend/README.md) y [frontend](frontend/README.md) para instalación y límites de verificación.

## Tecnologías recomendadas

- Backend: Python + FastAPI, con modelos de entrada/salida de Pydantic.
- Frontend: React + TypeScript + Vite + Tailwind. Se mantienen React Three Fiber/Drei y React Flow como propuesta para la implementación posterior de interfaz.
- Persistencia: PostgreSQL como base principal para el despliegue en nube; archivos científicos separados y versionados.
- Comunicación: HTTP/JSON, contrato OpenAPI 3.1. Resúmenes preparados con IA y persistidos; consultas sin generación automática.

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

## Fuentes científicas y procedencia de los datos

Referencias para la presentación y para reconstruir la procedencia de los datos. Consulta y descarga verificadas el **14 de noviembre de 2026**. Los archivos originales están en [`backend/data/raw/`](backend/data/raw/README.md); disponer de estos archivos no significa que el modelo del MVP esté validado o que sus datos ya estén integrados al backend.

### Área transversal muscular

**Scott, J. M., et al. (2020).** Disuse-Induced Muscle Loss and Rehabilitation: The National Aeronautics and Space Administration Bed Rest Study. *Critical Care Explorations*. https://doi.org/10.1097/CCE.0000000000000269

- Fuente primaria: [artículo completo](https://pmc.ncbi.nlm.nih.gov/articles/PMC7688251/) y [suplemento descargable](https://cdn-links.lww.com/permalink/ccx/a/ccx_1_1_2020_10_22_scott_20-00318_sdc1.pdf).
- Aporta mediciones de área transversal muscular mediante MRI durante 70 días de reposo en cama y rehabilitación posterior. La tabla suplementaria `eTable 3` contiene las tasas publicadas.
- Uso previsto: reconstrucción ilustrativa de la tendencia relativa al basal bajo las condiciones del estudio. Los PDF descargados **no son una base individual de resonancias** ni validan una predicción personal durante el vuelo.

### Torque, ejercicio y propiedades musculares

**Trappe, T. A., et al. (2024).** NASA SPRINT exercise program efficacy for vastus lateralis and soleus skeletal muscle health during 70 days of simulated microgravity. *Journal of Applied Physiology, 136*, 1015–1039. https://doi.org/10.1152/japplphysiol.00489.2023

- Fuente primaria: [artículo completo](https://pmc.ncbi.nlm.nih.gov/articles/PMC11365553/). La tabla 1 aporta resultados agregados de torque antes/después; la tabla 2 describe el protocolo de ejercicio.
- Datos suplementarios: *JAPPL 00489-2023 Supplemental Tables, Figures, and Excel File*. [Registro Figshare y DOI](https://doi.org/10.6084/m9.figshare.23699742), [Excel](https://ndownloader.figshare.com/files/43773237) y [PDF](https://ndownloader.figshare.com/files/43773231). El registro declara licencia CC BY 4.0.
- Se descargó e inspeccionó el Excel: contiene seis hojas con datos individuales de fibras musculares, composición y propiedades celulares. **No contiene una trayectoria diaria de torque de rodilla ni de área del cuádriceps completo.**

**NASA, Life Sciences Data Archive (LSDA). (s. f.).** Isokinetic Muscle Function (Flight Analog), experimento **MR079G**. NASA Life Sciences Portal. https://doi.org/10.83263/bk5h-r757

- Fuente oficial: [registro del experimento](https://nlsp.nasa.gov/search/data/details/f97392b8-b9dd-5bae-af9e-dd76a33bf049?dataType=EXPERIMENTS).
- Se descargaron **nueve CSV de `MR079G_CFT70` y tres de `MR079G_Campaign_11`**: fuerza antes/después, demografía, verificaciones y resúmenes. Se comprobaron las cabeceras y el contenido tabular.
- Archivos locales, enlaces individuales, fechas de consulta, cantidades de filas y hashes SHA-256: [inventario NASA](backend/data/raw/nasa_mr079g/README.md) y [manifiesto de descarga](backend/data/raw/nasa_mr079g/download_manifest.json).
- CFT70 contiene 42 identificadores de sujetos en PRE1, con cobertura menor en las evaluaciones posteriores. No debe equipararse automáticamente con la cohorte analizada en SPRINT. La correspondencia de sujetos/grupos, las unidades y el significado de columnas como `Angle` requieren revisión antes de importar o calcular resultados.

### Frecuencia cardíaca durante ejercicio

**Mongin, D., García Romero, J., & Alvero Cruz, J. R. (2021).** *Treadmill Maximal Exercise Tests from the Exercise Physiology and Human Performance Lab of the University of Malaga* (versión 1.0.1) [Dataset]. PhysioNet. https://doi.org/10.13026/7ezk-j442

- Fuente y diccionario de variables: [página del dataset](https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/).
- Descargas originales: [`test_measure.csv`](https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/test_measure.csv), [`subject-info.csv`](https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/subject-info.csv), [licencia](https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/LICENSE.txt) y [checksums](https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/SHA256SUMS.txt).
- Uso previsto: reproducción didáctica de frecuencia cardíaca durante ejercicio terrestre. Los archivos descargados pasan la verificación de checksums del proveedor. **No son datos de astronautas** y no se vinculan fisiológicamente al caso muscular virtual.

### Protocolo y siguientes pasos operativos

**Cromwell, R. L., et al. (2018).** Overview of the NASA 70-day Bed Rest Study. *Medicine & Science in Sports & Exercise, 50*(9), 1909–1919. [DOI: 10.1249/MSS.0000000000001617](https://doi.org/10.1249/MSS.0000000000001617). Documenta el protocolo y calendario generales; no sustituye el diccionario de los CSV depositados.

**NASA, Office of the Chief Health and Medical Officer. (2023).** *Exercise Overview*. NASA-STD-3001 Technical Brief OCHMO-TB-031. [PDF oficial](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-031-exercise-overview.pdf).

**Taoufik, S. D., Coffey, K. M., & Francisco, D. R. (2025).** *Astronaut physiological deconditioning and exercise prescription countermeasures in spaceflight*. NASA/SP−20250000273. [PDF oficial](https://www.nasa.gov/wp-content/uploads/2025/02/sp-20250000273.pdf).

Los dos documentos institucionales respaldan considerar registros de ejercicio, disponibilidad del equipo, restricciones de misión y revisión por especialistas. Se descargaron sus PDF. Las acciones propuestas y el contraste con la brecha NASA MA-201 están en la [investigación complementaria](backend/data/raw/research_pending/README.md); no constituyen un protocolo clínico aprobado para TwinNauta.

### Límites de uso

Los resultados agregados, las mediciones individuales, los parámetros extraídos y los datos sintéticos se conservarán separados. Las sesiones del astronauta virtual siguen siendo sintéticas; todavía no se verificó una base de sesiones realizadas que permita calcular una relación entre cumplimiento de ejercicio y pérdida muscular individual. Las publicaciones del mismo programa experimental tampoco constituyen validaciones independientes por sí solas.

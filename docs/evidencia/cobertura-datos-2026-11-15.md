# Cobertura de datos conectados

Revisión e integración: 15 de noviembre de 2026. Se auditaron las secciones visibles, los archivos ya descargados y las publicaciones originales. La falta de una medición individual no se resuelve utilizando otra magnitud ni juntando personas de fuentes distintas.

| Sección | Datos conectados | Fuente y alcance |
|---|---|---|
| Torque | 16 participantes, 32 mediciones KES60, fechas y filas originales | NASA MR079G Campaign 17; análogo terrestre; discrepancia de fase conservada |
| Área muscular | Dos tasas grupales publicadas, cuádriceps y sóleo | Scott 2020, suplemento eTable 3; no son área individual actual |
| Comparación con ejercicio | Cuatro medias, SD y n por grupo | SPRINT 2024, tabla 1 |
| Pulso | 602 observaciones, dos ausencias | PhysioNet 1.0.1, prueba 2_1; reloj terrestre propio |
| Sesión observada | Velocidad, HR, VO2, VCO2, RR y ventilación, 602 muestras | Mismo participante y tiempos que el pulso; datos respiración a respiración |
| Laboratorio de vuelo | 168 valores seleccionados en 28 muestras, cuatro tripulantes | NASA OSD-575, Inspiration4; seis variables, siete puntos por persona |
| Grafo | Artículos, temas, síntesis y límites documentales | Fuente y localizador conservados por vínculo; no relaciones causales inferidas |
| Siguientes pasos | Comparaciones publicadas, consulta de método y seguimiento por especialistas | Referencia NASA de ejercicio; no dosificación individual automática |

## Nuevas rutas y uso

- `GET /api/v1/reference-exercise`: conserva las 602 muestras originales de la prueba terrestre con fila de origen. VO2 se entrega en mL/min; se muestra como consumo observado, sin afirmar VO2max. La duración expuesta es el periodo registrado (1046 segundos), no una sesión de entrenamiento prescrita ni una medida de adherencia.
- `GET /api/v1/reference-laboratories`: seis variables del CSV original OSD-575: glucosa, calcio sérico, potasio, sodio, creatinina y albúmina. Los rangos son los del laboratorio en cada fila, sin clasificaciones diagnósticas. Se seleccionan tripulante, muestra y variable. Los eGFR y otros analitos no se incorporaron como nuevas reglas clínicas.
- `/knowledge-graph` conserva la paginación y añade nodos documentales: resumen en evidencia/acciones y límites en escenario. Los vínculos `reports` y `qualifies` no expresan eficacia individual ni validación clínica. Las etiquetas de revisión corresponden al alcance documental de los abstracts.

El dashboard muestra las referencias sin asignarlas al selector de día virtual. La vista del corazón reúne pulso, prueba de ejercicio y laboratorio NASA como fuentes independientes. La vista de cuádriceps incluye la sesión observada para contextualizar medidas funcionales. La vista de grafo en API utiliza estudios, sin ofrecer como alternativa los nodos sintéticos del caso inicial; hay lista accesible si no está disponible WebGL.

## Fuentes y contraste

1. NASA, LSDA. *Isokinetic Muscle Function (Flight Analog), MR079G.* https://doi.org/10.83263/bk5h-r757 . Archivos y límites: `datos-paneles-2026-11-15.md`.
2. Scott et al. (2020). *Disuse-Induced Muscle Loss and Rehabilitation: The NASA Bed Rest Study.* https://doi.org/10.1097/CCE.0000000000000269 . Extracciones y contraste en `backend/data/literature/extractions/core-studies.json`.
3. Trappe et al. (2024). *NASA SPRINT exercise program efficacy…* https://doi.org/10.1152/japplphysiol.00489.2023 . No se asume que los participantes sean los de Campaign 17.
4. Mongin, García Romero y Alvero Cruz (2021). *Treadmill Maximal Exercise Tests…* versión 1.0.1, https://doi.org/10.13026/7ezk-j442 ; diccionario oficial https://www.physionet.org/content/treadmill-exercise-cardioresp/1.0.1/ . Se comprobaron sus seis variables y unidades contra las columnas originales. El máximo observado de consumo de oxígeno no es automáticamente VO2max. La discrepancia de licencia sigue pendiente para redistribución pública.
5. NASA OSDR. *OSD-575*, https://osdr.nasa.gov/bio/repo/data/studies/OSD-575 . El CSV y metadatos originales están en `backend/data/raw/nasa_inspiration4/`, con SHA-256 y enlace exacto. Se contrastó acceso y naturaleza del recurso con *Inspiration4 data access through the NASA Open Science Data Repository* (2024), https://doi.org/10.1038/s41526-024-00393-5 . No se confundió este panel con wearables de acceso controlado.
6. NASA OCHMO. *Exercise Overview*, https://www.nasa.gov/ochmo-tb-031-exercise-overview-2/ ; contraste institucional *Astronaut Exercise*, https://www.nasa.gov/missions/station/iss-research/astronaut-exercise/ . NASA ya utiliza seguimiento de ejercicio y especialistas; TwinNauta visualiza referencias y sus límites, no inventa esta capacidad.

## Diferencias y límites que quedan documentados

- Calcio sérico no equivale a densidad ósea; creatinina no sustituye área muscular o torque.
- El archivo NASA contiene R+194, aunque la descripción del estudio enumera otros puntos. Se conserva y muestra el punto del archivo, con la discrepancia explícita.
- L se refiere al lanzamiento y R al regreso; no se concatenan silenciosamente en días de una misión individual. Las barras muestran muestras, sin inventar datos durante el vuelo.
- Los datos de pulso/respiración terrestre y los de laboratorio de vuelo pertenecen a participantes diferentes.
- Las sesiones realizadas por participantes NASA, una serie individual abierta de CSA y una trayectoria futura individual siguen sin fuente suficiente. Las mediciones aquí conectadas no rellenan esos campos ni habilitan reglas clínicas.
- Las regiones anatómicas sin módulo mantienen su estado de cobertura desconocida; no adquieren datos porque un analito tenga relación general con un sistema corporal.

## Comprobaciones

`cobertura-datos-verificacion.json` conserva los resultados: 168 valores contrastados con cada celda del CSV NASA, cuatro participantes, 602 muestras de ejercicio y referencias íntegras de los grafos. En la revisión HTTP hubo 21 nodos documentales para evidencia, 22 para escenario y 17 para acciones; las vistas filtran estudios por tema, no representan cohortes independientes.

El navegador permitió seleccionar C002, R+194, potasio y consumo de oxígeno; los paneles se actualizaron. Los contratos y tipos se regeneraron. No se invocaron proveedores de IA ni se modificaron datos personales o reglas clínicas en PostgreSQL.

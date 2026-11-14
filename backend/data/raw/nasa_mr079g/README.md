# Datos NASA de función muscular: MR079G

Consulta y descarga: 2026-11-14. Fuente: NASA Life Sciences Data Archive, NASA Life Sciences Portal.

Referencia institucional: **NASA, LSDA. (s. f.). Isokinetic Muscle Function (Flight Analog), MR079G.** https://doi.org/10.83263/bk5h-r757

- [Registro oficial](https://nlsp.nasa.gov/search/data/details/f97392b8-b9dd-5bae-af9e-dd76a33bf049?dataType=EXPERIMENTS).
- [Metadatos originales del experimento y archivos](source_metadata.json).
- [Metadatos específicos CFT70](cft70_metadata.json).
- [Manifiesto con URL exacta, filas, cabeceras, tamaño y SHA-256](download_manifest.json).

## Archivos descargados

Los originales se conservaron sin cambiar su contenido. La vista simplificada del catálogo omite la extensión; los metadatos completos confirman que los archivos originales ya se llaman `.csv`.

Se contrastaron los nueve archivos CFT70 con los MD5 originales publicados en `cft70_metadata.json`, ruta `related.data_files.items`: todos coinciden. El manifiesto incorpora esos valores además del SHA-256 local. Para los tres archivos de Campaign 11 solo se ha registrado el SHA-256 local; no se afirma comprobación contra un hash del proveedor.

| Archivo local | Filas de datos | Enlace directo NASA |
| --- | ---: | --- |
| [MR079G_CFT70_POST1_verifiers_ALL.csv](MR079G_CFT70/MR079G_CFT70_POST1_verifiers_ALL.csv) | 100 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/a527c1d0-a689-5805-aab2-ab8594a496e3/download) |
| [MR079G_CFT70_PRE2_verifiers_ALL.csv](MR079G_CFT70/MR079G_CFT70_PRE2_verifiers_ALL.csv) | 126 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/06f1aa01-cda3-5120-8966-2519fe3f8076/download) |
| [MR079G_CFT70_Demographics_ALL.csv](MR079G_CFT70/MR079G_CFT70_Demographics_ALL.csv) | 151 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/cddf0ba3-0b2d-59cf-af49-bced697e9c3e/download) |
| [MR079G_CFT70_POST2_verifiers_ALL.csv](MR079G_CFT70/MR079G_CFT70_POST2_verifiers_ALL.csv) | 126 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/a1af0c5b-ddf4-5235-b5e4-5df8d45ed5f3/download) |
| [MR079G_CFT70_PRE2_strength_ALL.csv](MR079G_CFT70/MR079G_CFT70_PRE2_strength_ALL.csv) | 1153 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/13e09fe4-3da3-54b4-b999-ee4aaf303f43/download) |
| [MR079G_CFT70_PRE1_strength_ALL.csv](MR079G_CFT70/MR079G_CFT70_PRE1_strength_ALL.csv) | 1260 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/610d93cd-e719-52db-b2b8-5b03919c60eb/download) |
| [MR079G_CFT70_PRE1_verifiers_ALL.csv](MR079G_CFT70/MR079G_CFT70_PRE1_verifiers_ALL.csv) | 126 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/424e5957-ec87-5471-9e7d-40c6e36e3b44/download) |
| [MR079G_CFT70_POST2_strength_ALL.csv](MR079G_CFT70/MR079G_CFT70_POST2_strength_ALL.csv) | 1050 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/41494200-5ead-5393-a860-85695e11552d/download) |
| [MR079G_CFT70_POST1_strength_ALL.csv](MR079G_CFT70/MR079G_CFT70_POST1_strength_ALL.csv) | 1082 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/059f6748-67fe-59d3-82db-a5a3b5bdad8b/download) |
| [MR079G_Campaign_11_April_2013_Exercise_Summary_MULTI.csv](MR079G_Campaign_11/MR079G_Campaign_11_April_2013_Exercise_Summary_MULTI.csv) | 63 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/817cb3ac-29a7-5866-97af-07730375db8c/download) |
| [MR079G_Campaign_11_April_2013_Control_Summary_MULTI.csv](MR079G_Campaign_11/MR079G_Campaign_11_April_2013_Control_Summary_MULTI.csv) | 63 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/d040d38b-fa6a-5250-9fd9-0f28dd1d3578/download) |
| [MR079G_Campaign_11_April_2013_MULTI.csv](MR079G_Campaign_11/MR079G_Campaign_11_April_2013_MULTI.csv) | 315 | [Descargar original](https://nlsp.nasa.gov/api/v1/files/4e1ea365-bf29-519c-9ac2-44743b181ac5/download) |

## Revisión inicial y límites

- Se abrieron y analizaron los doce CSV. Las cuatro tablas CFT70 de fuerza suman 4545 filas: PRE1 1260, PRE2 1153, POST1 1082 y POST2 1050. Son combinaciones de sujetos y pruebas, no 4545 participantes.
- PRE1 contiene 42 identificadores, PRE2 39, POST1 37 y POST2 36. La presencia de un identificador no implica que todas sus mediciones estén disponibles. Existen valores ausentes y cobertura desigual.
- Hay inconsistencias de esquema: `Group` frente a `GROUP`, diferente orden de columnas y una columna final sin nombre en POST2_verifiers. No corregirlas sobre los originales.
- Los grupos originales incluyen CONTROL, EXERCISE y FLY. No asignar automáticamente estos sujetos a los grupos del artículo SPRINT, ni inferir qué intervención recibió cada persona sin documentación adicional.
- Los códigos de prueba incluyen KES, KFS, KEE, KFE y pruebas de tobillo y tronco. `Angle` incluye 0, 30, 60, 120, 180, 300 y 400. El artículo general del programa describe velocidades de dinamometría, pero la tabla no incorpora unidades: confirmar el diccionario y protocolo antes de renombrar esa columna como velocidad o importar sus valores.
- PRE1/PRE2/POST1/POST2 identifican evaluaciones. No convertirlos en días de misión. El calendario general publicado debe contrastarse con las fechas de cada participante y la demografía del archivo.
- Campaign 11 contiene un archivo individual de 315 filas y dos resúmenes de 63 filas cada uno. No mezclar medias, SD y SEM con observaciones individuales. `BR_Day` requiere interpretarse junto a `Test_Phase`; no asumir un día absoluto únicamente por el nombre.
- Los archivos de verificadores describen revisión de datos; no son indicadores fisiológicos.
- Los metadatos declaran disponibilidad pública, pero no incluyen una licencia específica en el registro guardado. No atribuirles automáticamente la licencia de PhysioNet o Figshare.
- No hay mediciones diarias durante el reposo en estos archivos de fuerza; tampoco registros de sesiones de ejercicio realizadas ni área transversal muscular.

## Contraste científico

[Overview of the NASA 70-day Bed Rest Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6591716/) describe el protocolo y calendario generales. Su tabla 2 sitúa las evaluaciones isocinéticas antes y después del reposo; esto es coherente con cuatro archivos de fuerza, pero no demuestra por sí solo la correspondencia exacta de todos los registros del depósito.

[SPRINT 2024](https://doi.org/10.1152/japplphysiol.00489.2023) analiza grupos y variables específicos del programa. Estos trabajos y este depósito pueden compartir participantes: no contarlos como validación externa independiente.

## Otras vías comprobadas

- MRI_Muscle, [registro NASA](https://nlsp.nasa.gov/search/data/details/93b3490c-68a7-5f66-982c-122899c444a4?dataType=EXPERIMENTS): el estado del archivo indica que no se entregaron datos a LSDA. No resuelve la serie de área muscular.
- Leg Muscle Volume by MRI, [registro NASA](https://nlsp.nasa.gov/search/data/details/51659363-fd13-5aea-9175-c79e36e16e73?dataType=EXPERIMENTS): datos protegidos, disponibles mediante solicitud. Además mide volumen, magnitud distinta del área seleccionada.
- MRI after Exposure to Microgravity, [registro NASA](https://nlsp.nasa.gov/search/data/details/0a5a7c7f-6b53-5f22-8380-520f0be6488d?dataType=EXPERIMENTS): los archivos públicos localizados son tablas resumidas y figuras de volumen o T2; no se adoptaron como mediciones longitudinales individuales de área del cuádriceps.
- Estudios NASA de resistencia con volante y dispositivo intermiembros: los metadatos consultados ofrecen informes finales resumidos, sin una tabla individual adecuada identificada.

La serie individual de área transversal del cuádriceps y los registros reales de ejercicio siguen pendientes. La descarga de MR079G mejora la disponibilidad de datos de función muscular, sin cerrar esos pendientes ni validar el modelo.

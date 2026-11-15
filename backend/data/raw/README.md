# Descarga de fuentes originales

Estado al 14 de noviembre de 2026: los originales enumerados abajo están guardados localmente. Los tres archivos de PhysioNet pasan la comprobación con `SHA256SUMS.txt`. El Excel de SPRINT se abrió para inspeccionar sus seis hojas y su MD5 coincide con el publicado en Figshare. Esto verifica los archivos, no la validez de un modelo fisiológico.

Archivos disponibles:

- `bedrest_2020/cc9-2-e0269.pdf`: artículo de 2020.
- `bedrest_2020/supplement.pdf`: suplemento del artículo de 2020.
- `sprint_2024/trappe-et-al-2024-nasa-sprint-exercise-program-efficacy-for-vastus-lateralis-and-soleus-skeletal-muscle-health-during.pdf`: artículo SPRINT.
- `sprint_2024/supplemental_tables_figures.pdf`: [tablas y figuras suplementarias](https://ndownloader.figshare.com/files/43773231).
- `sprint_2024/supplemental_excel_s1.xlsx`: [datos individuales de fibras musculares](https://ndownloader.figshare.com/files/43773237), hojas Figure 2 a Figure 7. No contiene curvas diarias de torque de rodilla ni área del cuádriceps completo.
- `physionet_treadmill_1.0.1/`: los dos CSV, licencia y archivo de checksums.

Además se descargaron [doce CSV NASA MR079G](nasa_mr079g/README.md), con evaluaciones de fuerza antes/después, demografía, verificaciones y resúmenes de CFT70/Campaign 11. Hay archivos individuales de función muscular; la interpretación de unidades, códigos, grupos y calendario sigue pendiente antes de usarlos en cálculos. No se encontró todavía una serie individual longitudinal de área del cuádriceps adecuada al MVP.

Guardar archivos sin editar. Los resultados extraídos o normalizados se prepararán por separado; no reemplazar el contenido sintético de `../demo/` con archivos sin auditar.

## 1. Área muscular: primera prioridad

- [Artículo completo, NASA Bed Rest Study 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7688251/).
- [Suplemento PDF directo](https://cdn-links.lww.com/permalink/ccx/a/ccx_1_1_2020_10_22_scott_20-00318_sdc1.pdf).

El artículo y el suplemento ya están guardados con los nombres del inventario anterior.

Revisar primero:

1. Métodos y resultados del artículo: participantes, reposo en cama, calendario de resonancias y magnitud medida. Se estudió área transversal, no volumen muscular.
2. Suplemento, página 8 de 9, `eTable 3. Muscle Change per Day`: fila `Quadriceps`, columnas de pérdida y recuperación. La pérdida se expresa respecto al basal BR−6; la recuperación usa otra referencia. No mezclarlas.
3. Suplemento, métodos estadísticos y `eTable 2`: distinguir una reconstrucción de la tasa publicada del modelo estadístico completo.
4. Anotar unidades, días observados, significado del basal y limitaciones. La rehabilitación posterior es terrestre y no se traslada automáticamente al vuelo.

Resultado esperado: una ficha de extracción con la ubicación exacta del parámetro y las condiciones de uso, todavía sujeta a revisión. Los PDF no equivalen a una base individual de resonancias descargable.

## 2. Torque y ejercicio: SPRINT 2024

- [Artículo completo en PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11365553/).
- [Página de la revista](https://journals.physiology.org/doi/full/10.1152/japplphysiol.00489.2023).

El artículo y sus suplementos ya están guardados con los nombres del inventario anterior.

Revisar `Table 1`: torque del cuádriceps antes/después, grupos, tamaño de muestra, media y dispersión, y la nota con el protocolo de evaluación. Revisar `Table 2`: estructura del programa semanal de ejercicio y qué significa cada duración. Conservar por separado el grupo con testosterona; no incluirlo como una recomendación del MVP.

El Excel suplementario de fibras no es indispensable para este primer cálculo. No asumir que contiene una serie diaria de torque, ni convertir su información celular en volumen del músculo completo.

Resultado esperado: tabla de resultados agregados y ficha del protocolo, claramente separadas de mediciones individuales y de registros sintéticos del caso virtual.

## 3. Frecuencia cardíaca: PhysioNet 1.0.1

[Página del dataset](https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/).

En la sección `Files`, descargar los siguientes archivos. Si al abrir un nombre aparece una vista de texto, pulsar `Download`; no guardar esa página HTML como CSV.

| Archivo | Descarga directa | Destino |
| --- | --- | --- |
| `subject-info.csv` | [Descargar](https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/subject-info.csv) | `physionet_treadmill_1.0.1/subject-info.csv` |
| `test_measure.csv` | [Descargar](https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/test_measure.csv) | `physionet_treadmill_1.0.1/test_measure.csv` |
| `LICENSE.txt` | [Descargar](https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/LICENSE.txt) | `physionet_treadmill_1.0.1/LICENSE.txt` |
| `SHA256SUMS.txt` | [Descargar](https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/SHA256SUMS.txt) | `physionet_treadmill_1.0.1/SHA256SUMS.txt` |

Conservar versión 1.0.1 y cita DOI `10.13026/7ezk-j442`.

No hace falta analizar a mano el CSV grande. Después de descargar se comprobarán hashes, cabeceras, IDs, tiempos, valores ausentes y unidades. Se seleccionará una sola prueba y se preparará una señal normalizada con tiempo, frecuencia cardíaca y contexto de ejercicio. Su participante terrestre no es el astronauta virtual.

## Orden de trabajo

Empezar por los dos PDF musculares; luego guardar los CSV y su licencia/checksums; después revisar SPRINT para torque y protocolo. Con esos originales disponibles se podrá extraer información y completar la ficha de procedencia antes de habilitar cálculos.

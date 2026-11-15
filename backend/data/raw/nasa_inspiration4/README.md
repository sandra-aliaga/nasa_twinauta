# Datos humanos NASA: búsqueda de ampliación

OSD-575, Inspiration4: CSV oficial descargado e inspeccionado el 15 de noviembre de 2026. Contiene 28 filas y 58 columnas de un panel metabólico: glucosa, creatinina, electrolitos, enzimas y otras pruebas con unidades y rangos. No contiene área muscular, torque ni frecuencia cardíaca. No se ha integrado ni se usa para rellenar esos indicadores. Los identificadores y puntos temporales deben mapearse contra los metadatos antes de interpretar series individuales.

La copia original se conserva sin transformar; URL y SHA-256 en manifest.json. Página del estudio: https://osdr.nasa.gov/bio/repo/data/studies/OSD-575 .

Hallazgo paralelo: Jones et al., Nature 2024, DOI 10.1038/s41586-024-07648-x (https://pmc.ncbi.nlm.nih.gov/articles/PMC11357997/), publica frecuencia cardíaca y HRV de cuatro tripulantes. La figura extendida 7 muestra promedios horarios, no ECG continuo. No se ha confirmado una descarga pública de esas series en este pase; no confundir el CSV metabólico con telemetría.

LSDA/NLSP (https://www.nasa.gov/hrp/nlsp/) es el repositorio NASA pertinente para investigación humana de vuelo y análogos. La existencia de un registro público no implica acceso inmediato a mediciones individuales; revisar condiciones de solicitud. OS-566 y OS-568 son pistas de experimentos musculares, sin archivo muscular confirmado en este pase.

Conclusión acotada: existen datos humanos reales descargables en NASA. El archivo comprobado aquí no cubre los indicadores musculares elegidos. No se han agotado todos los archivos del portal ni se declara que no existan otros.

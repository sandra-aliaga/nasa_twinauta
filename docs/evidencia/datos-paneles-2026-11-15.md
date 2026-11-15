# Datos para los paneles: investigacion acotada del 15 de noviembre de 2026

## Pregunta y cambio de conclusion

Se busca sustituir tarjetas vacias con resultados observados y trazables, sin unir registros de personas o estudios distintos como un solo astronauta. La afirmacion anterior de que no habia mediciones individuales musculares disponibles fue demasiado amplia: existen CSV de NASA MR079G que ya estaban en el repositorio y esta investigacion descargó otra campaña con su propio diccionario.

## Torque: archivos nuevos comprobados

Fuente institucional: NASA Life Sciences Data Archive, Isokinetic Muscle Function (Flight Analog), MR079G. DOI https://doi.org/10.83263/bk5h-r757 . Registro https://nlsp.nasa.gov/search/data/details/f97392b8-b9dd-5bae-af9e-dd76a33bf049?dataType=EXPERIMENTS .

En `backend/data/raw/nasa_mr079g/MR079G_Campaign_17/` se conservan los dos CSV originales, con 17 y 16 filas respectivamente. `inspection.json` conserva URLs de descarga, SHA-256, fila original, fecha, codigo y valores de 16 participantes con ambas evaluaciones. Es una extraccion descriptiva; no un nuevo modelo.

El diccionario de **la misma Campaign 17**, ya conservado en `backend/data/raw/research_pending/MR079G_Campaign_17_Isokinetic_DataSum_Parameter_Reference_ALL.csv`, define KES60 como extension de rodilla a 60 grados/segundo, cinco repeticiones, dinamometro Biodex, unidad Nm. Por eso esta seleccion evita transferir sin comprobacion el diccionario a Campaign 11 o CFT70. No se adoptan otros codigos: el diccionario contiene discrepancias para algunas velocidades.

Ejemplo real, identificador de deposito 5875: KES60=126.9 Nm, fecha original 5/16/11, y KES60=112.0 Nm, fecha original 6/17/2011. Son registros de un participante de un analogo terrestre, no de un astronauta del caso virtual.

**Contraste y limite detectado:** el archivo denominado BR+6 contiene Test_Phase=PRE_TEST y una columna adicional BR Day=BR+6. No corregir silenciosamente. Se pueden presentar las mediciones por fecha original, indicando la discrepancia; la alineacion del periodo respecto al reposo permanece pendiente. No producir una curva diaria ni atribuir la diferencia a un regimen de ejercicio. El grupo y la duracion exacta no se infieren del codigo de campaña.

El protocolo general NASA de dinamometria de rodilla y sus limites estan documentados en https://pmc.ncbi.nlm.nih.gov/articles/PMC6591716/ . Esa publicacion no prueba por si sola la pertenencia de Campaign 17 a la cohorte de SPRINT. Se conserva la independencia como desconocida.

## Area muscular: resultados publicados y busqueda individual

Scott 2020 sigue siendo la fuente auditada para las tasas grupales de area de cuadriceps y soleo; `backend/data/literature/extractions/core-studies.json` conserva los PDF, hashes, valores y localizadores. Hay datos para una tarjeta de resultado publicado. Una tasa grupal no es una medicion individual de area actual.

Como segunda via se abrio el suplemento Excel de Fernandez-Gonzalo et al. 2021, DOI https://doi.org/10.3389/fphys.2021.676501 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC8322684/ . Descarga comprobada mediante https://www.ebi.ac.uk/europepmc/webservices/rest/PMC8322684/supplementaryFiles . El archivo se conserva en `backend/data/raw/planica_2021/`. Las cuatro hojas contienen condiciones, estadisticas y variabilidad; no se encontro una tabla individual directamente importable de area y torque. El articulo indica acceso a datos brutos previa solicitud. No se presenta como dataset individual abierto.

Los registros MRI_Muscle y Leg Muscle Volume by MRI revisados previamente en `backend/data/raw/nasa_mr079g/README.md` tampoco resuelven una serie individual abierta de area: el primero indica datos no entregados al archivo y el segundo requiere solicitud y mide volumen. Esta busqueda no demuestra ausencia universal de otros datasets.

## Frecuencia cardiaca

La grabacion real PhysioNet ya disponible permite llenar el panel didactico terrestre: 602 muestras de la prueba seleccionada, con dos ausencias, segun la auditoria existente. Condiciones de redistribucion pendientes de aclarar; conservar su procedencia.

Jones et al. 2024, DOI https://doi.org/10.1038/s41586-024-07648-x ; https://pmc.ncbi.nlm.nih.gov/articles/PMC11357997/ , presenta medidas de cuatro tripulantes de Inspiration4. Se contrasto la declaracion de disponibilidad con el texto: los wearables se describen dentro de repositorios con acceso controlado. No se ha confirmado un archivo publico descargable de sus series cardiacas. No copiar puntos visuales como si fueran lecturas originales.

OSD-575, descargado y auditado en el pase anterior, contiene panel metabolico; no aporta estas tres magnitudes. No sustituir frecuencia cardiaca por biomarcadores sericos cardiovasculares.

## Uso concreto en la interfaz

- Torque: comparacion por participante y fecha del deposito Campaign 17, con metodo, unidad y advertencia de fase. Alternativamente medias publicadas SPRINT con SD y n.
- Area: resultado grupal de Scott y grafica solo si se identifica como reconstruccion de referencia; nunca area individual observada inventada.
- Corazon: grabacion terrestre real con su propio reloj, independiente del participante muscular.
- Ejercicio: el protocolo publicado fundamenta el plan; los CSV de torque no contienen sesiones realizadas. El seguimiento virtual debe conservar esa procedencia.

Esta investigacion deja datos preparados, no añade aun un endpoint ni conecta estos nuevos CSV al dashboard. El siguiente trabajo concreto es una vista de referencia con seleccion de fuente/participante, sin sobrescribir evaluaciones ya guardadas ni mezclar los sujetos de ambas fuentes.

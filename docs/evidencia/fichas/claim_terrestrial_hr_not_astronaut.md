# claim_terrestrial_hr_not_astronaut: La frecuencia cardíaca de una prueba terrestre en cinta (PhysioNet 1.0.1) solo puede usarse como telemetría didáctica, no como respuesta de un astronauta

- Estado: corrected
- Investigado: 2026-11-15 por evidence-researcher
- Corregido: 2026-11-15 según verificaciones/claim_terrestrial_hr_not_astronaut.md (veredicto corrected)
- Revisión de Medicina: pendiente

## Pregunta e hipótesis

Pregunta: ¿qué límites hay que declarar al mostrar, en una aplicación sobre astronautas, la frecuencia cardíaca (FC) de una prueba de esfuerzo terrestre del dataset PhysioNet "Treadmill Maximal Exercise Tests" 1.0.1 (prueba `2_1`)?

Hipótesis de partida: la grabación puede usarse como material didáctico de telemetría si se etiqueta como dato humano terrestre de otra persona. No representa la respuesta de un astronauta en vuelo, no sirve para fijar umbrales o zonas, no valida ningún modelo y no completa el historial del astronauta virtual.

Qué la refutaría o modificaría:
- (a) Que la licencia del dataset impida el uso previsto (aplicación pública, redistribución del CSV derivado). Obligaría a descartar o restringir el uso.
- (b) Que la respuesta de FC al ejercicio en vuelo fuera equivalente a la terrestre en todas sus características. Debilitaría el argumento fisiológico, pero no el de identidad: el participante sigue sin ser el astronauta virtual.
- (c) Que la población o el protocolo del dataset fueran comparables a los de la tripulación y sus sesiones en vuelo. Permitiría usos comparativos acotados.

Naturaleza: es una regla de uso de datos (procedencia y aplicabilidad), apoyada en hechos verificables (población, protocolo, licencia) y en diferencias fisiológicas publicadas. No es un resultado fisiológico medido por el equipo.

## Datos para el contrato

```json
{
  "sources": [
    {
      "id": "src_physionet_treadmill_1_0_1",
      "title": "Mongin D, García Romero J, Alvero Cruz JR. Treadmill Maximal Exercise Tests from the Exercise Physiology and Human Performance Lab of the University of Malaga (version 1.0.1). PhysioNet, 2021. DOI 10.13026/7ezk-j442.",
      "url": "https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/",
      "locator": "Página del proyecto: secciones de métodos y descripción de datos. Archivos locales: backend/data/raw/physionet_treadmill_1.0.1/subject-info.csv (línea 680, ID_test 2_1) y test_measure.csv (filas con ID_test 2_1, cabecera time,Speed,HR,VO2,VCO2,RR,VE,ID_test,ID); procedencia en backend/data/processed/physionet_treadmill_1.0.1/heart_rate_2_1.provenance.json.",
      "review_status": "pending",
      "version": "1.0.1",
      "license": "Discrepancia sin resolver: LICENSE.txt del paquete = Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International; la página del proyecto indica PhysioNet Contributor Review Health Data License 1.5.0."
    },
    {
      "id": "src_scott_2023_npj_microgravity",
      "title": "Scott JM et al. Effects of exercise countermeasures on multisystem function in long duration spaceflight astronauts. npj Microgravity 9, 11 (2023). DOI 10.1038/s41526-023-00256-5.",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9898566",
      "locator": "Table 1 (Inflight Aerobic and Resistance Exercise Training), filas Heart Rate y % time in heart rate zone; nota al pie: median, IQR. Métodos: carga del arnés T2 y prescripción por %HRmax.",
      "review_status": "pending",
      "version": "Publicado febrero de 2023",
      "license": null
    },
    {
      "id": "src_ochmo_tb_031_2023",
      "title": "NASA Office of the Chief Health and Medical Officer. Exercise Overview. NASA-STD-3001 Technical Brief OCHMO-TB-031, 10/02/2023.",
      "url": "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-031-exercise-overview.pdf",
      "locator": "p. 4 (VO2max = HR x SV x a-vO2; factores cardiovasculares); p. 11 (FC en T2 y CEVIS, ISS ~180 días); p. 12 (reproducción de Table 1 de Scott 2023); p. 21 (capacidad de recogida de datos: heart rate, VO2max). Copia local: backend/data/raw/research_pending/ochmo-tb-031-exercise-overview.pdf.",
      "review_status": "pending",
      "version": "10/02/2023",
      "license": null
    },
    {
      "id": "src_moore_2014_acsm_abstract",
      "title": "Moore AD Jr, Downs ME, Lee SMC, Feiveson AH, Knudsen P, Evetts SN, Ploutz-Snyder L. Peak oxygen uptake during and after long-duration space flight. Resumen, ACSM Annual Meeting, Orlando, 27-31 mayo 2014. NTRS 20140003748.",
      "url": "https://ntrs.nasa.gov/citations/20140003748",
      "locator": "Resumen completo (1 página), secciones METHODS y RESULTS.",
      "review_status": "pending",
      "version": null,
      "license": null
    },
    {
      "id": "src_shykoff_1996",
      "title": "Shykoff BE, Farhi LE, Olszowka AJ, Pendergast DR, Rokitka MA, Eisenhardt CG, Morin RA. Cardiovascular response to submaximal exercise in sustained microgravity. J Appl Physiol 81(1):26-32, 1996. DOI 10.1152/jappl.1996.81.1.26.",
      "url": "https://doi.org/10.1152/jappl.1996.81.1.26",
      "locator": "Solo resumen, leído en la ficha del repositorio de la Universidad de Buffalo; texto completo no consultado.",
      "review_status": "pending",
      "version": null,
      "license": null
    }
  ],
  "claim": {
    "id": "claim_terrestrial_hr_not_astronaut",
    "statement": "La serie de frecuencia cardíaca mostrada en TwinNauta procede de una prueba de esfuerzo máxima en cinta, en tierra, de un participante del dataset PhysioNet 1.0.1 (prueba 2_1). Es telemetría didáctica: no es el astronauta virtual, no representa ni predice la respuesta cardíaca al ejercicio en microgravedad, no define umbrales ni zonas de FC, no valida ningún modelo y no se combina con el historial muscular del caso. Se muestra con su origen, contexto terrestre, unidades (beats/min, s, km/h) y valores ausentes sin interpolar.",
    "kind": "operational_rule",
    "source_ids": [
      "src_physionet_treadmill_1_0_1",
      "src_scott_2023_npj_microgravity",
      "src_ochmo_tb_031_2023",
      "src_moore_2014_acsm_abstract",
      "src_shykoff_1996"
    ],
    "population": "Se muestra una sola prueba (2_1) de un participante adulto del dataset. El dataset reúne 992 pruebas de 857 participantes, atletas amateurs y profesionales de 10 a 63 años, Universidad de Málaga, 2008-2018. No incluye astronautas ni condiciones de vuelo.",
    "sample_size": 1,
    "environment": "terrestrial_exercise",
    "limitations": [
      "Participante terrestre distinto del astronauta virtual; su FC no completa ni sustituye datos del caso.",
      "Protocolo de prueba máxima incremental hasta agotamiento en cinta sin arnés; las sesiones aeróbicas en la ISS son interval o continuas prescritas por %HRmax en T2 (con carga de arnés) o CEVIS (cicloergómetro).",
      "En vuelo se han descrito cambios en la relación FC-VO2 y en el volumen sistólico durante el ejercicio; la FC terrestre a una velocidad dada no se traslada a vuelo.",
      "Población del dataset (mediana de edad 27,10 años, 15,0 % de pruebas con sexo codificado como mujer) distinta de la cohorte de astronautas de Scott 2023 (46,8 ± 6,1 años, media ± DE).",
      "Muestreo respiración a respiración, con intervalos irregulares; no es una señal de frecuencia fija.",
      "Licencia con discrepancia entre LICENSE.txt (CC BY-NC-SA 4.0) y la página (PhysioNet Contributor Review Health Data License 1.5.0); debe resolverse antes de redistribuir el CSV derivado o publicar la aplicación.",
      "No se derivan umbrales clínicos, zonas de entrenamiento ni recomendaciones.",
      "Licencia sin resolver: el LICENSE.txt del paquete es CC BY-NC-SA 4.0, pero la página del proyecto declara la PhysioNet Contributor Review Health Data License 1.5.0 y un Data Use Agreement 1.5.0, que limitan el uso a investigación científica. Hasta aclararlo con PhysioNet o los autores, no redistribuir la serie derivada en una app pública; enlazar al origen con atribución.",
      "OCHMO-TB-031 pp. 11 y 22 da como FC 'Peak' 163 y 162 lpm, que son límites superiores del rango intercuartílico de Scott 2023 Table 1 (medianas 158 en CEVIS y 153 en T2); la p. 22 confunde además porcentaje de tiempo con porcentaje de sesiones. Citar Scott 2023 Table 1, no esas páginas."
    ],
    "review_status": "pending"
  }
}
```

## Extracción

### Dataset PhysioNet 1.0.1 (archivos locales y página del proyecto)

Archivos locales leídos directamente:

- `backend/data/raw/physionet_treadmill_1.0.1/subject-info.csv`. Cabecera: `Age,Weight,Height,Humidity,Temperature,Sex,ID,ID_test`. Línea 680 (prueba seleccionada): `33.8,68,171.1,,,0,2,2_1`. Es decir, Age 33.8, Weight 68, Height 171.1, Humidity y Temperature vacías, Sex 0, ID 2. La página solo define `Sex = 1 (Female)`; no define el código 0. No se interpreta el sexo del participante 2.
- `backend/data/raw/physionet_treadmill_1.0.1/test_measure.csv`. Cabecera: `time,Speed,HR,VO2,VCO2,RR,VE,ID_test,ID`. Primeras filas de `2_1`: tiempos 0, 2, 4, 7, 9, 11, 14 s; Speed 5; HR 63, 75, 82, 87, 92, 94, 95. Los intervalos son irregulares, coherente con muestreo respiración a respiración.
- `backend/data/raw/physionet_treadmill_1.0.1/LICENSE.txt`. Primera línea: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License". La copia en `physionet-open.s3.amazonaws.com` tiene la misma primera línea.
- `backend/data/processed/physionet_treadmill_1.0.1/heart_rate_2_1.provenance.json`: `origin` "human_dataset", `context` "terrestrial_exercise", unidades `time_s` s, `heart_rate` beats/min, `speed_kmh` km/h; `sample_count` 602; `missing_hr` 2; `first_sample_s` 0.0; `last_sample_s` 1046.0; auditoría del dataset `dataset_rows` 575087 y `dataset_missing_hr` 981; transformaciones declaradas sin interpolación, remuestreo, imputación ni conversión a tiempo de misión. Estas cifras proceden del archivo de procedencia; no se recontaron en esta investigación.

Página del proyecto (https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/), leída mediante extracción automática:

- 992 pruebas máximas de esfuerzo graduado, 857 participantes, grabadas entre 2008 y 2018 en el Exercise Physiology and Human Performance Lab de la Universidad de Málaga.
- "Participants are amateur and professional athletes are of ages ranging from 10 to 63 years old." Mediana de edad 27.10 años [IQR 21.10-36.32]; mediana de peso 73.00 kg; mediana de talla 175.00 cm; `Sex = 1 (Female)`: 149 pruebas (15.0 %).
- Protocolo: pruebas continuas (rampa) o escalonadas; "Most of the exercise phases are preceded by a warmup period of walking at 5 km/h"; "When incremental, the step amplitudes range from 0.5 to 1 km/h"; "the test was considered maximal if the oxygen consumption was saturated"; enfriamiento caminando a 5 km/h. No se indica la duración de cada escalón.
- Equipos: cinta PowerJog serie J, analizador de gases CPX MedGraphics (respiración a respiración), ECG Mortara de 12 derivaciones para la FC. No se indica frecuencia de muestreo en Hz.
- Unidades: `time` s, `Speed` km/h, `HR` beats/min, `VO2` y `VCO2` mL/min, `RR` respiraciones/min, `VE` L/min; en `subject-info.csv` edad en años, peso kg, talla cm, humedad %, temperatura °C.
- Ética: consentimiento informado escrito (de tutores en menores de 18), supervisión médica, Declaración de Helsinki, aprobación del comité ético de la Universidad de Málaga.
- Publicación asociada: Mongin D et al. (2021), Research in Sports Medicine, DOI 10.1080/15438627.2021.1954513 (no leída).
- Licencia indicada en la página: "PhysioNet Contributor Review Health Data License 1.5.0". Política de acceso: "Anyone can access the files, as long as they conform to the terms of the specified license." La página de licencia del proyecto (view-license/1.0.1) muestra ese texto, que limita el uso a "lawful use in scientific research and no other" (punto 6) y prohíbe compartir acceso a "PhysioNet restricted data" (punto 3). No se determinó si estas cláusulas aplican a un proyecto de acceso abierto ni cuál de las dos licencias prevalece.

### Respuesta de la FC al ejercicio en vuelo

- Scott et al. 2023, Table 1 (texto completo en PMC). Nota al pie: "Data presented as median, IQR". Ejercicio en vuelo, ISS, incrementos 26S-50S (abril 2011 a septiembre 2017); 46 astronautas (37 hombres, 9 mujeres), edad 46.8 ± 6.1 años (media ± DE), misiones de 178 ± 48 d (media ± DE).
  - Heart rate average, beats/min: CEVIS 135 (128, 141); T2 131 (121, 137).
  - Heart rate peak, beats/min: CEVIS 158 (150, 163); T2 153 (144, 162).
  - % time above 70% peak heart rate: CEVIS 76 (65, 92); T2 69 (54, 81).
  - % time above 90% peak heart rate: CEVIS 13 (6, 27); T2 11 (4, 24).
  - Speed, all: CEVIS 78 (71, 97) rpm; T2 7 (6, 7) mph. Load, all: CEVIS 137 (123, 153) W; T2 117 (107, 127) lb.
  - Métodos: carga externa del arnés T2 iniciada al 60 % del peso corporal y aumentada según tolerancia; protocolos T2 prescritos al 70-100 % HRmax; el %HRmax se calcula como FC media de las sesiones dividida por la HRmax preflight. El tiempo de ejercicio excluye calentamiento y enfriamiento. No se identificó en la lectura el dispositivo de registro de FC en vuelo. Los autores señalan "considerable variability in the actual exercise performed".
- OCHMO-TB-031, p. 11: misma cohorte y fuente (Scott 2023). Indica para T2 "131 bpm average, Peak 162 bpm" y para CEVIS "135 bpm average, Peak 163 bpm". En la p. 12 reproduce la Table 1 con peak 158 (150, 163) y 153 (144, 162). Los valores "Peak" de la p. 11 (y de la tabla resumen de la p. 22) coinciden con el límite superior del IQR, no con la mediana del pico. Para cualquier uso, citar la Table 1 de Scott 2023, no la p. 11.
- OCHMO-TB-031, p. 4: "VO2max aerobic capacity = Heart Rate + Stroke Volume + arteriovenous oxygen difference [a-VO2]" (figura) y ecuación de Fick VO2 = Qc x A-V O2 difference; entre los factores figuran atrofia cardíaca, volumen plasmático y función vascular.
- Moore et al., resumen ACSM 2014 (NTRS 20140003748, texto completo del resumen leído). 14 astronautas (9 H, 5 M; 49 ± 5 años, media ± DE) de la ISS; pruebas en cicloergómetro hasta el pico ~90 días antes del vuelo, FD15 y cada ~30 d en vuelo, R+1, R+10 y R+30. Resultados textuales: "Peak HR was not significantly different from preflight at any time"; en vuelo, "the SV vs. VO2 slope was lower (P < 0.001), primarily due to elevated SV at rest, and the HR vs. VO2 slope was greater (P < 0.001), largely due to elevated HR during more intense exercise"; en R+1 "resting and submaximal exercise SV was lower (P < 0.001), resting and submaximal exercise HR was higher (P < 0.002)"; "HR and SV returned to preflight levels by R+30". Resultados como estimaciones de modelo mixto para un sujeto promedio. Es un resumen de congreso, no el artículo revisado.
- Shykoff et al. 1996 (solo resumen). 6 sujetos, misiones Spacelab de 9 días (SLS-1, n = 3) y 15 días (SLS-2, n = 3); ejercicio al 30 % y 60 % de la carga de VO2 máximo en 1 G; comparación con controles de pie y supino (no con preflight). En reposo en vuelo, FC al 81 % del valor de pie y 91 % del supino. Pendiente de Q frente a VO2 menor en vuelo (3.5 frente a 6, en l·min⁻¹ por l·min⁻¹). "SV in flight fell with increasing VO2, whereas SV erect rose and SV supine remained constant." El resumen no informa la FC de ejercicio. Vuelos cortos: no se extrapolan a misiones largas.

## Contraevidencia e independencia

- Contraevidencia parcial: la FC pico en vuelo no difirió significativamente de la preflight en el resumen de Moore 2014. Fragmentos de búsqueda atribuyen a Levine et al. 1996 (J Appl Physiol 81(2):686-694; 6 astronautas, 9 o 14 días) que la FC pico no cambió; no se leyó ese resumen. Por tanto no puede afirmarse que toda característica de la FC difiera en vuelo. La regla no depende de ello: se apoya sobre todo en identidad del participante, protocolo, población y entorno.
- Discrepancia sin resolver: un resumen generado por el buscador atribuyó al artículo de Moore 2014 en J Appl Physiol la frase "Peak HR was elevated during spaceflight and immediately after landing", que contradice el resumen ACSM. El artículo (DOI 10.1152/japplphysiol.01251.2013) devolvió HTTP 403 y no se pudo leer. Hasta leerlo, no se usa ninguna afirmación sobre FC pico del artículo.
- Independencia: OCHMO-TB-031 reproduce Scott 2023; no son evidencia independiente. El resumen ACSM de Moore 2014 y el artículo de J Appl Physiol describen la misma cohorte. Shykoff 1996 y Levine 1996 tratan vuelos Spacelab de duración similar y podrían compartir tripulantes; no se comprobó. Scott 2023 (2011-2017) y Moore 2014 (ISS) podrían solaparse en tripulantes; no se comprobó.
- Moore 2014 y Scott 2023 son estudios de vuelo; Shykoff 1996 y Levine 1996 son vuelos cortos (9-15 días). Ninguno es reposo en cama, así que no hay extrapolación desde análogos en esta ficha.
- No se buscaron correcciones o erratas de Scott 2023 ni del dataset de PhysioNet.

## Comparación con NASA

- NASA ya monitoriza la FC durante el ejercicio en vuelo y prescribe por %HRmax (Scott 2023, Métodos; OCHMO-TB-031 p. 11). NASA-STD-3001 indica entre las consideraciones de diseño "the required data collection capability to track crewmember performance (i.e., heart rate, VO2max, etc.)" (OCHMO-TB-031 p. 21). TwinNauta no aporta capacidad nueva de monitorización cardíaca.
- La brecha MA-201 del HRR ("Determine the required exercise countermeasure or countermeasures (i.e., modality or modalities, prescription, monitoring)...") incluye la monitorización como componente; la página no menciona la FC de forma explícita. Una grabación terrestre didáctica no responde a esa brecha.
- No se infiere ninguna carencia de NASA a partir de lo que no aparece en estas páginas.

## Conclusión

Mantener con modificación. La afirmación original ("límite de usar FC de ejercicio terrestre como material didáctico") se concreta en una regla operativa con los límites del bloque `claim`:

1. Se mantiene: el participante no es el astronauta virtual; la prueba es terrestre, máxima, en cinta sin arnés; población y protocolo distintos de la tripulación y de sus sesiones en vuelo.
2. Se añade un argumento fisiológico acotado: en vuelo se han descrito cambios en la relación FC-VO2 y en el volumen sistólico durante el ejercicio (resumen Moore 2014, misma cohorte, no revisado por pares; Shykoff 1996, vuelos cortos). La FC pico no difirió en el resumen de Moore 2014, de modo que no debe decirse que toda la respuesta de FC sea distinta.
3. Se añade una condición previa: resolver la discrepancia de licencia antes de redistribuir `heart_rate_2_1.csv` o publicar la aplicación. Si aplica CC BY-NC-SA 4.0, el CSV derivado requiere atribución, uso no comercial y la misma licencia. Si aplica la Health Data License 1.5.0, el uso "sole purpose of lawful use in scientific research" podría no cubrir una aplicación didáctica. No es una conclusión jurídica.
4. No usar los valores de Scott 2023 como umbrales ni como comparación directa con la grabación terrestre: son medianas de grupo de otra población y modalidad.

## No verificado y siguiente contraste

1. Licencia aplicable (CC BY-NC-SA 4.0 frente a PhysioNet Contributor Review Health Data License 1.5.0). Siguiente paso: consultar el historial de versiones del proyecto en PhysioNet o escribir a sus autores o a PhysioNet. Decidir con el equipo si la aplicación encaja en "NonCommercial" y en "scientific research".
2. Texto completo de Moore et al. 2014, J Appl Physiol 117(3):231-238 (HTTP 403): confirmar la afirmación sobre FC pico, la FC submáxima en vuelo, el dispositivo de registro y las limitaciones. También falta leer el resumen o artículo de Levine 1996.
3. Dispositivo y calidad del registro de FC en vuelo durante T2 y CEVIS, que no se identificaron en Scott 2023. Siguiente paso: buscar en NTRS documentación del monitor de FC de los equipos de ejercicio de la ISS.
4. Código de sexo 0 en `subject-info.csv`, no definido en la página. Siguiente paso: revisar Mongin et al. 2021 o el repositorio GitLab citado en la página.
5. Recuento de 575 087 filas y 981 ausencias de HR: tomado del archivo de procedencia, no recontado aquí.
6. Solapamiento de tripulantes entre Scott 2023 y Moore 2014, y entre Shykoff 1996 y Levine 1996.
7. Fraser et al. 2012 (Aviat Space Environ Med 83(6):577-584, FC diaria en la ISS, n = 7 según fragmentos de búsqueda): no leído; no se usan sus cifras.

## Registro de búsqueda

Todas las consultas el 2026-11-15.

Lectura local:
- `docs/evidencia/README.md`, `docs/evidencia/afirmaciones.md` (fila del claim), `docs/datos-y-evidencia.md`, esquemas `Source` y `EvidenceClaim` de `contracts/openapi.yaml`, `backend/data/raw/README.md`.
- `backend/data/raw/physionet_treadmill_1.0.1/LICENSE.txt`, `subject-info.csv` (primeras líneas y línea 680), `test_measure.csv` (primeras líneas).
- `backend/data/processed/physionet_treadmill_1.0.1/heart_rate_2_1.provenance.json`.
- `backend/data/raw/research_pending/ochmo-tb-031-exercise-overview.pdf`, páginas 1-22 (lectura visual del PDF).

Web:
- https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/ (dos lecturas: métodos y licencia).
- https://physionet.org/files/treadmill-exercise-cardioresp/1.0.1/LICENSE.txt (redirección 302) y https://physionet-open.s3.amazonaws.com/treadmill-exercise-cardioresp/1.0.1/LICENSE.txt
- https://physionet.org/content/treadmill-exercise-cardioresp/view-license/1.0.1/
- Búsqueda: "Moore 2014 peak exercise oxygen uptake during and following long-duration spaceflight heart rate J Appl Physiol".
- Búsqueda: "Scott 2023 npj Microgravity effects of exercise countermeasures on multisystem function long duration spaceflight astronauts".
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9898566 (Scott 2023, texto completo).
- https://ntrs.nasa.gov/api/citations/20140003597/downloads/20140003597.pdf (resultó ser otro resumen: Ade y Moore, transporte de O2 tras vuelo largo, n = 1; no se usa).
- Búsqueda: "heart rate response submaximal exercise International Space Station in-flight compared preflight cycle ergometer cardiac output stroke volume".
- https://ntrs.nasa.gov/api/citations/20140003748/downloads/20140003748.pdf y https://ntrs.nasa.gov/citations/20140003748 (resumen ACSM de Moore 2014, leído completo).
- https://pubmed.ncbi.nlm.nih.gov/24970850/ (fallo por cookies; el PMID no quedó confirmado).
- https://journals.physiology.org/doi/full/10.1152/japplphysiol.01251.2013 (HTTP 403).
- Búsqueda: "\"Peak exercise oxygen uptake during and following long-duration spaceflight\" abstract \"peak HR\"".
- Búsqueda: "treadmill exercise microgravity subject loading system heart rate lower than ground same speed ISS T2 harness" (sin comparación directa de FC a igual velocidad).
- Búsqueda: "Fraser Greaves Shoemaker Blaber Hughson 2012 heart rate and daily physical activity long-duration habitation International Space Station" (solo fragmentos; no leído).
- Búsqueda: "Levine 1996 \"Maximal exercise performance after adaptation to microgravity\" abstract heart rate" (solo fragmentos; no leído).
- https://researchconnect.buffalo.edu/en/publications/cardiovascular-response-to-submaximal-exercise-in-sustained-micro/ (resumen de Shykoff 1996).
- https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833 (MA-201).

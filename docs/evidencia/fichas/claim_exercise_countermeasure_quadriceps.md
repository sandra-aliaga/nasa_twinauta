# claim_exercise_countermeasure_quadriceps: En vuelo ISS de larga duracion con el programa de ejercicio que incluye ARED, el area transversal media del cuadriceps disminuye (perdida grande segun los autores) y se estima menos expuesta a perdidas de al menos 20 % que la pantorrilla, pero no hay control en vuelo sin ejercicio que permita aislar el efecto del ejercicio

- Estado: corrected
- Investigado: 2026-11-15 por evidence-researcher
- Corregido: 2026-11-15 segun verificaciones/claim_exercise_countermeasure_quadriceps.md (veredicto corrected)
- Revision de Medicina: pendiente

Uso previsto en TwinNauta: vista `actions` (fundamento y limites de cualquier tarjeta relacionada con ejercicio de resistencia). Esta ficha no autoriza prescribir ni modificar ejercicio, ni convertir sesiones realizadas u omitidas en cambios de area muscular.

## Pregunta e hipotesis

- Pregunta: que efecto tiene el ejercicio de resistencia realizado en vuelo (ISS, en particular ARED) sobre la masa, el volumen o el area transversal (CSA) del cuadriceps / extensores de rodilla en misiones de larga duracion, medido por imagen (RM, TC, ecografia)?
- Hipotesis inicial: con el programa actual (ARED + T2 + CEVIS), la perdida de tamano del cuadriceps en ~6 meses es pequena y menor que en la era iRED y que en reposo en cama sin ejercicio.
- Que la refutaria: (a) un estudio en vuelo con medicion por imagen del cuadriceps que mostrara perdidas de magnitud similar o mayor en la era ARED que en la era iRED o que en reposo en cama sin ejercicio; (b) evidencia de que la diferencia entre eras se explica por otros factores (duracion, momento de medicion, nutricion, seleccion). Que la modificaria: no encontrar ningun dato de cuadriceps (solo pantorrilla o masa magra), o no encontrar un comparador sin ejercicio en vuelo.
- Resultado: la hipotesis se mantiene solo en su parte descriptiva (perdida media pequena del CSA del cuadriceps con el programa ARED, menor que la de pantorrilla). La parte causal ("el ejercicio de resistencia en vuelo produce/previene") no puede sostenerse con datos de vuelo: no existe grupo sin ejercicio en vuelo y las comparaciones entre eras no son concurrentes. Un metaanalisis de vuelo (Comfort 2021) concluye que las contramedidas actuales no previenen la perdida de tamano muscular de la pierna y no encuentra mejora atribuible a ARED en musculo.

## Datos para el contrato

```json
{
  "sources": [
    {
      "id": "src_scott_2023_npjmicrogravity",
      "title": "Effects of exercise countermeasures on multisystem function in long duration spaceflight astronauts (Scott JM, Feiveson AH, English KL, Spector ER, Sibonga JD, Dillon EL, Ploutz-Snyder L, Everett ME; npj Microgravity 9:11, 2023)",
      "url": "https://doi.org/10.1038/s41526-023-00256-5",
      "locator": "Material suplementario (41526_2023_256_MOESM1_ESM.pdf): Supplemental Table 2 (calendario y n), Supplemental Table 4 (fila 'Quad CSA (cm2)'), Supplemental Figure 4A; articulo: Table 2 (fila 'Quadricep CSA'), Fig. 1a y Fig. 2, Metodos (MRI)",
      "review_status": "pending",
      "version": "Publicado 2023-02-03 (PMC9898566)",
      "license": null
    },
    {
      "id": "src_scott_2021_iscience_telesus",
      "title": "Teleguided self-ultrasound scanning for longitudinal monitoring of muscle mass during spaceflight (Scott JM et al.; iScience 24(4):102344, 2021)",
      "url": "https://doi.org/10.1016/j.isci.2021.102344",
      "locator": "Resultados, seccion de ecografia panoramica (11 astronautas); Figura 2 (paneles A, E, F); Figure S5 y Tables S1-S4 citadas pero no leidas; archivo local backend/data/raw/research_pending/scott_2021_telesus_fulltext.xml",
      "review_status": "pending",
      "version": "PMC8047175; PMID 33870138",
      "license": null
    },
    {
      "id": "src_english_2020_sprint_flight",
      "title": "High intensity training during spaceflight: results from the NASA Sprint Study (English KL et al.; npj Microgravity 6:21, 2020)",
      "url": "https://doi.org/10.1038/s41526-020-00111-x",
      "locator": "Resumen; Resultados (masa magra de pierna por DXA); Table 1 y Table 2 (cuerpo de tabla no leido); Discusion (limitaciones)",
      "review_status": "pending",
      "version": "Publicado 2020-08-18 (PMC7434884)",
      "license": null
    },
    {
      "id": "src_gopalakrishnan_2010_asem",
      "title": "Muscle volume, strength, endurance, and exercise loads during 6-month missions in space (Gopalakrishnan R, Genc KO, Rice AJ, Lee SM, Evans HJ, Maender CC, Ilaslan H, Cavanagh PR; Aviat Space Environ Med 81(2):91-102, 2010)",
      "url": "https://doi.org/10.3357/asem.2583.2010",
      "locator": "Solo resumen (via fragmento de busqueda y registro Europe PMC) y citas en NASA HRP-47072 p. 21 y NASA Evidence Report 2022 p. 38; texto completo no leido",
      "review_status": "pending",
      "version": null,
      "license": null
    },
    {
      "id": "src_nasa_evidence_report_muscle_aerobic_2022",
      "title": "Evidence Report: Risk of Impaired Performance Due to Reduced Muscle Mass, Strength & Endurance and Risk of Reduced Physical Performance Capabilities Due to Reduced Aerobic Capacity (NASA HRP, Human Health Countermeasures Element; Rivas E, Strock N, Dillon EL, Frisco D)",
      "url": "https://ntrs.nasa.gov/api/citations/20220019338/downloads/Evidence%20report%20aerobic%20and%20muscle_FINAL%209-21-22%20Pubpress%20accepted_v2.pdf",
      "locator": "Seccion 1.i.iv p. 38-41 (era iRED, ARED); seccion 1.i.ix p. 49-53 (hardware ARED, Figura 35 citada, Tabla 4); seccion 1.j.iv p. 61 (MRI y ecografia); seccion 4.a-b p. 133-135 (brechas)",
      "review_status": "pending",
      "version": "NTRS 20220019338; nombre de archivo 'FINAL 9-21-22'; portada indica 'Approved for Public Release: Month DD, YYYY' (fecha no rellenada)",
      "license": null
    },
    {
      "id": "src_ochmo_tb031_2023",
      "title": "NASA-STD-3001 Technical Brief OCHMO-TB-031: Exercise Overview (NASA Office of the Chief Health and Medical Officer)",
      "url": "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-031-exercise-overview.pdf",
      "locator": "p. 2 (V1 4024), p. 7 y p. 14 (reposo en cama con ejercicio), p. 16 (cargas ARED), p. 18 (figura 'Physiological Outcomes for Resistive Exercise on Long Duration (178 days) Mission on ISS' y tabla de cambios R+1/R+7/R+30); copia local backend/data/raw/research_pending/ochmo-tb-031-exercise-overview.pdf",
      "review_status": "pending",
      "version": "10/02/2023",
      "license": null
    },
    {
      "id": "src_comfort_2021_sportsmed",
      "title": "Effects of Spaceflight on Musculoskeletal Health: A Systematic Review and Meta-analysis, Considerations for Interplanetary Travel (Comfort P, McMahon JJ, Jones PA, Cuthbert M, Kendall K, Lake JP, Haff GG; Sports Med 51(10):2097-2114, 2021)",
      "url": "https://doi.org/10.1007/s40279-021-01496-9",
      "locator": "Metodos (criterios de inclusion), Resultados (metaanalisis de tamano muscular de miembro inferior), Discusion (ARED vs iRED); texto leido parcialmente (primeros 100 000 caracteres); Table 6 y referencias no leidas",
      "review_status": "pending",
      "version": "PMC8449769; PMID 34115344",
      "license": null
    },
    {
      "id": "src_padilha_2026_jcsm",
      "title": "Disuse-Induced Muscle Atrophy and Muscle Weakness From Hospitalization to Spaceflight: Exercise Succeeds in Prevention and Treatment - A Meta-Analysis (Padilha CS et al.; J Cachexia Sarcopenia Muscle 17(2):e70259, 2026)",
      "url": "https://doi.org/10.1002/jcsm.70259",
      "locator": "Resumen; seccion 3.3 y Figura 7 (masa muscular en vuelo); Figura 4 (fuerza); texto XML de Europe PMC leido parcialmente (primeros 100 000 caracteres)",
      "review_status": "pending",
      "version": "PMC13080877",
      "license": null
    },
    {
      "id": "src_nasa_hrr_ma201",
      "title": "NASA Human Research Roadmap, gap MA-201: Determine the required exercise countermeasure or countermeasures (modality, prescription, monitoring)",
      "url": "https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833",
      "locator": "Descripcion del gap; estado Open; Last Published 05/13/25",
      "review_status": "pending",
      "version": "05/13/25",
      "license": null
    }
  ],
  "claim": {
    "id": "claim_exercise_countermeasure_quadriceps",
    "statement": "En astronautas de la ISS (incrementos 26S-50S, 2011-2017) que realizaron el programa de ejercicio obligatorio con ARED, T2 y CEVIS durante misiones de unos 6 meses, el area transversal media del cuadriceps medida por resonancia magnetica en 12 astronautas fue menor el dia R+1 que unos 40 dias antes del vuelo (77,7 +/- 13,2 cm2 antes frente a 73,3 +/- 12,5 cm2 despues; media +/- DE), con una proporcion de astronautas con perdida de al menos 20 % estimada por el modelo en 0,1 % (IC 95 % 0,0-3,8 %), menor que la estimada para la pantorrilla (10,9 %). Los autores califican de grande la perdida de tamano muscular de la pierna. Esto describe el resultado con ejercicio, no el efecto del ejercicio: en vuelo no hay grupo sin ejercicio, las comparaciones con la era iRED o con Mir no son concurrentes, y una revision sistematica de vuelo no encontro que las contramedidas actuales, incluido ARED, eviten la perdida de tamano muscular de la pierna. La proteccion casi completa del area del cuadriceps con ejercicio de alta carga se ha observado en reposo en cama, no en vuelo.",
    "kind": "observed_result",
    "source_ids": [
      "src_scott_2023_npjmicrogravity",
      "src_scott_2021_iscience_telesus",
      "src_english_2020_sprint_flight",
      "src_gopalakrishnan_2010_asem",
      "src_nasa_evidence_report_muscle_aerobic_2022",
      "src_ochmo_tb031_2023",
      "src_comfort_2021_sportsmed",
      "src_padilha_2026_jcsm",
      "src_nasa_hrr_ma201"
    ],
    "population": "Fuente principal (Scott 2023): 46 astronautas de NASA, CSA, ESA y JAXA (37 hombres, 9 mujeres; 46,8 +/- 6,1 anos; mision 178 +/- 48 d), incrementos ISS 26S-50S (abril 2011 - septiembre 2017), con ARED, T2 y CEVIS; la RM del muslo y la pierna se obtuvo solo en 12 de ellos (L-40 y R+1). Fuentes complementarias: 4 astronautas varones de la era iRED (Gopalakrishnan 2010, ~181 d) y 11 astronautas con ecografia guiada en vuelo (Scott 2021).",
    "sample_size": 12,
    "environment": "spaceflight",
    "limitations": [
      "No hay grupo de control sin ejercicio en vuelo (el ejercicio es obligatorio en la ISS; Scott 2023 lo declara). El dato describe el cambio con ejercicio y no permite estimar el efecto causal del ejercicio de resistencia ni de ARED.",
      "sample_size = 12 se refiere solo al subgrupo con RM de Scott 2023; los demas resultados de esa publicacion tienen n distintos (17, 38, 44) y no deben mezclarse.",
      "Los valores pre y post de area del cuadriceps son medias de grupo con DE; no son trayectorias individuales y no deben convertirse en pacientes sinteticos sin etiquetarlos.",
      "Una sola medicion posterior (R+1) y una previa (L-40): no hay curva temporal en vuelo por RM; no se puede derivar una tasa diaria sin suponer linealidad.",
      "Inconsistencia en Scott 2023: el texto principal habla de CSA de 'lower leg muscles', pero el suplemento lista cuadriceps, isquiotibiales y pantorrilla y la adquisicion va 'from the level of the ankle mortise to the iliac crest'. No se indica el nivel de corte ni si el CSA es maximo o a una altura fija.",
      "Programa de ejercicio heterogeneo: prescripcion de resistencia 3-6 d/semana, variabilidad entre prescripcion y realizacion declarada por los autores; no se analiza la relacion dosis-respuesta para el cuadriceps.",
      "Independencia limitada: Scott 2023, SPRINT en vuelo (English 2020) y Tele-SUS (Scott 2021) proceden del mismo laboratorio de NASA JSC y del mismo periodo; Scott 2023 reconoce solapamiento de participantes con SPRINT. OCHMO-TB-031 y el Evidence Report 2022 reproducen esos mismos datos y no son corroboracion independiente.",
      "Comparacion entre eras (iRED vs ARED) no concurrente: duraciones, momento de medicion (R+1 frente a ~R+5), metodo (volumen frente a CSA) y poblacion distintos.",
      "La proteccion del cuadriceps con ejercicio de alta carga (p. ej. brazos de ejercicio del reposo en cama de 70 d) es un resultado de analogo terrestre; trasladarla a vuelo es una extrapolacion no validada (ver claim_bedrest_spaceflight_transfer).",
      "No se dispone de datos individuales abiertos: el articulo indica acceso por solicitud al NASA Life Sciences Data Archive.",
      "Contraevidencia: Comfort 2021 (metaanalisis de vuelo) concluye que las contramedidas actuales no previenen la perdida de tamano muscular del miembro inferior; describe de forma narrativa perdidas aparentemente mayores con ARED, y su Fig. 6 incluye extensores y flexores de rodilla. El subgrupo de vuelo de Padilha 2026 tiene resultados internamente contradictorios.",
      "El 0,1 % es una estimacion de la cola de la distribucion del modelo con n = 12, no una proporcion observada de astronautas.",
      "El tamano del efecto del cuadriceps en Scott 2023 Fig. 2 (-2,09) se presenta con un intervalo (-8,54, -2,95) que no contiene al valor central; el mismo valor aparece copiado en OCHMO-TB-031 p. 18 (atribuido a 'Scott et al., 2019'). No usar ese tamano del efecto ni su intervalo como parametro.",
      "El cambio porcentual del cuadriceps solo aparece en grafico (Scott 2023 Fig. 1a) y no se digitalizo; no usar valores leidos a ojo."
    ],
    "review_status": "pending"
  }
}
```

## Extraccion

### 1. Scott et al. 2023, npj Microgravity 9:11 (articulo original revisado por pares; observacional, vuelo)

- Acceso: texto completo HTML y XML de Europe PMC leidos (con truncamiento en el ultimo tramo, que contenia referencias); suplemento PDF (41526_2023_256_MOESM1_ESM.pdf) leido completo en sus paginas 1-10. Figura 1a y Figura 2 son imagenes: valores no extraidos.
- Diseno: cohorte observacional, sin grupo sin ejercicio. Modelo lineal mixto con bootstrap; cambio porcentual y tamano del efecto con IC 95 % por metodo delta. Tamano del efecto definido como cambio medio dividido por la DE intraindividual de mediciones preflight repetidas.
- Poblacion: N = 46 (37 H, 9 M), 46,8 +/- 6,1 anos, mision 178 +/- 48 d; incrementos 26S-50S (abril 2011 - septiembre 2017); 10 (22 %) con mision larga previa. Hardware: ARED (resistencia; "constant load of 11-272 kg provided by vacuum cylinders"), T2 y CEVIS. Volumen total de ejercicio "~600 min/wk". Prescripcion: "Resistance exercise was prescribed 3-6 d/wk and aerobic exercise was prescribed 5-6 days per week". Carga en vuelo: "Inflight resistance exercise training load was 181 lbs/session (150, 223)" (unidad y estadistico tal como aparecen; no convertido).
- Metodo de imagen: "Cross-sectional area (CSA) of the lower leg muscles was obtained from MRI scans pre and postflight on 12 astronauts"; "Images were acquired from the level of the ankle mortise to the iliac crest"; "Muscle cross-sectional area was manually traced using Image-J".
- Supplemental Table 2 (calendario): "Cross sectional area (MRI)", N = 12, dias antes del lanzamiento = 40, dias tras el regreso = 1, "Quadriceps, hamstring, calf".
- Supplemental Table 4, "Pre and Postflight Muscle Strength and Size" (valores media +/- DE, copiados tal cual):
  - Quad CSA (cm2): preflight 77.7+/-13.2 (N 12); postflight 73.3+/-12.5 (N 12).
  - Hamstring CSA (cm2): 33.8+/-3.5 (N 12); 31.1+/-3.7 (N 12).
  - Calf CSA (cm2): 17.7+/-4.1 (N 12); postflight "15.6" sin DE impresa (N 12).
- Table 2 del articulo ("Proportion of astronauts that would be expected to have a 20% or greater loss at the first postflight session"; "Values are %, 95% confidence interval"): Quadricep CSA 0.1 (0.0-3.8); Hamstring CSA 0.0 (0.0-2.1); Calf CSA 10.9 (3.2-30.9).
- Texto: "Estimates of percent change indicate mean lower leg muscle cross-sectional area and strength were significantly decreased" (el porcentaje especifico del cuadriceps esta en Fig. 1a, no leido como numero).
- Supplemental Figure 4A: respuestas individuales del CSA del cuadriceps (cm2) pre y post; grafico, no digitalizado.
- Limitaciones declaradas: pocos participantes; sin control sin ejercicio "because exercise is mandatory on ISS"; variabilidad entre ejercicio realizado y prescrito; tres dispositivos ISS no equivalentes al hardware de exploracion; confusores no controlados (dieta, farmacos, radiacion). Solapamiento: "We acknowledge that some astronauts included in this study were also participants in other studies" (cita SPRINT); numero de solapados no indicado.
- Disponibilidad de datos: "Data from this study may be obtained through a data request to the NASA Life Science Data Archive".
- Transformaciones: ninguna. No se calculo un porcentaje a partir de las medias pre y post: el cociente de medias de grupo no equivale a la media de cambios individuales que reporta el modelo de los autores.

### 2. Scott et al. 2021, iScience 24:102344 (articulo original revisado por pares; metodo de monitorizacion en vuelo)

- Acceso: texto completo JATS XML local (backend/data/raw/research_pending/scott_2021_telesus_fulltext.xml). Suplementos (Tables S1-S4, Figures S3-S5) no leidos; valores de la Figura 2 en imagen, no extraidos.
- Objetivo: validar ecografia panoramica autoadquirida con guia remota (Tele-SUS), no evaluar el efecto del ejercicio.
- Poblacion: "11 astronauts (10 males, 1 female; age: 47.5 +/- 5.9 years; body mass: 78.6 +/- 10.6 kg)". Vuelo: "Over an average of 168 +/- 57 days of spaceflight, 74 Tele-SUS sessions were performed". Calidad: "Ninety-one percent (449 of 492 performed) of the images were rated high quality". CV entre evaluadores en 256 imagenes en vuelo: "3.7% to 10.6%".
- Region: cuadriceps anterior (VM, RF, VL en una sola pasada) y pantorrilla posterior.
- Resultado relevante: "On average, there was a decline during spaceflight in all muscles except the RF (Figure S5)". Ecografia a R+1 y RM "within 4 days of ultrasound". Sin diferencias significativas entre ecografia y RM en el cambio de CSA (Figura 2F, media +/- DE; valores no extraidos).
- Limitaciones declaradas: n pequeno, "external validation of Tele-SUS in a larger cohort is warranted"; solo muslo anterior y pantorrilla posterior.
- Relevancia: aporta la unica serie en vuelo localizada (ecografia, varios dias de vuelo) para cuadriceps; confirma que existe una capacidad NASA de monitorizacion del tamano muscular en vuelo; no aisla el efecto del ejercicio.

### 3. English et al. 2020, npj Microgravity 6:21 (articulo original; vuelo; comparacion de dos programas de ejercicio)

- Acceso: texto completo HTML leido (dos tramos); cuerpos de Table 1 y Table 2 no incluidos en el texto obtenido.
- 26 tripulantes ISS: SPRINT n = 9 (8H/1M) frente a control (programa estandar) n = 17 (14H/3M); incrementos 26S-50S.
- No mide RM ni ecografia de cuadriceps. DXA: "Leg lean mass was unchanged after spaceflight (simple main effect for time, P = 0.40"; sin interaccion grupo x tiempo "(P = 0.88". DXA a L-90 y "1-2 weeks after landing (R + 7)".
- Torque extensor de rodilla: "-5.8%" en ambos grupos (resumen).
- Relevancia: comparacion entre dos dosis de ejercicio (ambas con ARED), no frente a ausencia de ejercicio; masa magra de pierna por DXA no equivale a CSA del cuadriceps. Limitaciones: autoasignacion, n pequeno, programa control individualizado, tiempos de prueba no uniformes.

### 4. Gopalakrishnan et al. 2010, Aviat Space Environ Med 81:91-102 (articulo original; era iRED)

- Acceso: solo resumen (fragmento de busqueda y metadatos Europe PMC). Texto completo no leido.
- 4 astronautas varones, 181 +/- 15 d; RM de volumen muscular. Segun el resumen: "Muscle volume change was greater in the calf (-10 to 16%) than the thigh (-4% to -7%), but there was no change in the upper arm (+0.4 to -0.8%)". No se pudo confirmar si el rango es entre individuos o entre musculos, ni la cifra especifica del cuadriceps.
- NASA Evidence Report 2022 p. 38 lo cita como estudio de la "iRED era"; iRED "was limited to a 300-lb maximum load" frente a ARED "600-lb load capability".

### 5. NASA Evidence Report muscular y aerobico 2022 (documento oficial NASA; revision narrativa, no revisada por pares)

- Acceso: PDF completo descargado; leidas p. 1-4, 38-41, 49-53, 61, 133-135, 146, 148-150.
- p. 38: "Calf muscles were found to undergo the greater decrements than thigh muscles (10-18% vs. 4-7% loss, respectively) [57]" (era iRED).
- p. 41: ISS temprana; "only two short periods during Expeditions 3 and 4 when all three U.S. onboard exercise devices (CEVIS, TVIS, and iRED) were capable of being used under nominal conditions (Figure 22)".
- p. 52: ARED reemplazo a iRED en 2008; datos de ARED "are often self-reported" por fallos de instrumentacion.
- p. 53: sobre fuerza isocinetica (no tamano): resultados iRED y ARED "find that no differences were observed"; descrito como "preliminary data".
- p. 61: "Pre- to postflight changes for leg muscle mass has been reported to be about ~20% loss ... [51]" y "Recent studies have reported that leg muscle volume is reduced 7-15% at R+7 [52]". La referencia [52] es English 2020 (p. 146), cuyo texto leido no contiene RM ni volumen muscular y reporta masa magra de pierna sin cambio. Cita no verificable; no se usa como dato.
- p. 135: "Despite four decades of effort, success in prevention of space flight muscle atrophy and skeletal muscle functional deficits has not yet been achieved in every case"; "The minimal dose of exercise needed to maintain aerobic capacity and muscle strength and endurance is unknown"; "It is unknown why large variability of exercise response occurs".

### 6. OCHMO-TB-031 (2023-10-02; ficha tecnica NASA derivada de NASA-STD-3001; no revisada por pares)

- Acceso: PDF local leido p. 2-18.
- p. 2: [V1 4024] "Countermeasures shall maintain in-mission skeletal muscle strength at or above 80% of baseline values" (requisito de fuerza, no de tamano).
- p. 16: cargas ARED basadas en Scott 2023 (p. ej. sentadilla "Average load 181 lbs Range 150 - 223 lbs").
- p. 18: figura "Physiological Outcomes for Resistive Exercise on Long Duration (178 days) Mission on ISS Scott et al., 2019" con "Quad CSA" en el grupo "Leg CSA"; tabla con fila "Quadriceps CSA" en "Change pre-flight to R+1": "-2.09 (-8.54, -2.95)". El estadistico no se indica, la estimacion puntual queda fuera del intervalo impreso y la figura cita "Scott et al., 2019" mientras el texto de p. 11 y 16 cita Scott 2023. No se usa como valor; probablemente corresponde al tamano del efecto de Scott 2023 Fig. 2, sin confirmar.
- p. 7 y p. 14 (reposo en cama, NO vuelo): 14 d de reposo con ejercicio, volumen muscular del muslo "1757 +/- 222" (BR1) y "1771 +/- 240" (BR14) cm3, n = 8; 70 d de reposo, grafico de CSA del cuadriceps con etiquetas "-10%" (grupo sin ejercicio) y "+2%" (grupo de ejercicio), y tabla con CSA del cuadriceps por grupo (CONT, EX, ExT, FLY). Se registran como contexto de analogo; no se extrapolan a vuelo.

### 7. Comfort et al. 2021, Sports Med 51:2097-2114 (revision sistematica y metaanalisis de vuelo)

- Acceso: texto completo PMC leido parcialmente (primeros 100 000 caracteres); Table 6 y lista de referencias no leidas.
- Inclusion: vuelo real >= 30 d con contramedidas de ejercicio; 11 estudios, 138 astronautas/cosmonautas.
- Tamano muscular de miembro inferior: "Hedges g = -1.98, 95% CI -2.72 to -1.23", I2 = 74.38 %. No hubo analisis de moderadores por protocolo de ejercicio; comparacion ARED/iRED solo narrativa; los autores concluyen que ARED no mejoro los resultados musculares, aunque si oseos. Los estudios que aportan tamano muscular de pierna parecen ser principalmente de pantorrilla/soleo; lista completa no verificada.

### 8. Padilha et al. 2026, J Cachexia Sarcopenia Muscle 17:e70259 (metaanalisis multicontexto)

- Acceso: resumen completo y XML de Europe PMC leido parcialmente.
- Vuelo: 206 astronautas (187 H, 19 M), misiones de 160 a 240 d, iRED o ARED. Masa muscular analizada como cambio pre-post "Because no parallel control groups were available". Resultados contradictorios en la misma seccion: "Overall analysis indicated a significant increase in muscle mass in astronauts (ES = 0.27, 95% CI [0.05, 0.48]" y, a la vez, analisis de cambio medio estandarizado con "no significant overall change in muscle mass (ES = 0.002, 95% CI [-0.077, 0.080]; p = 0.966)". Descripcion de la intervencion internamente inconsistente ("twice to three times per day" frente a "3-6 sessions per week"). No se usa como estimacion.

### Transformaciones aplicadas

Ninguna. Valores copiados con su unidad y estadistico. No se calcularon porcentajes, tasas diarias ni diferencias entre eras. No se digitalizaron figuras.

## Contraevidencia e independencia

Contraevidencia y matices:
- Comfort 2021 (vuelo, >= 30 d): gran efecto negativo sobre el tamano muscular del miembro inferior con contramedidas y sin mejora atribuible a ARED en musculo. Esto contradice la lectura "ARED protege el musculo", aunque el metaanalisis parece dominado por pantorrilla y por datos de era iRED/Mir (no verificado en la tabla).
- El propio Scott 2023 muestra que el cuadriceps pierde menos que la pantorrilla; la conclusion de proteccion depende de la region. Aplicar el resultado de cuadriceps a pantorrilla, o viceversa, seria una extrapolacion entre regiones.
- Evidence Report 2022 p. 53: sin diferencias de fuerza isocinetica entre crew iRED y ARED (datos preliminares). Si la fuerza no difiere entre eras, la diferencia de tamano entre eras tampoco puede atribuirse con seguridad al dispositivo.
- Reposo en cama: el ejercicio de alta carga mantiene el CSA del cuadriceps (OCHMO-TB-031 p. 14, citando Ploutz-Snyder 2018). Chen et al. 2025 (Front Physiol, doi:10.3389/fphys.2025.1694891; solo reposo en cama, sin vuelo) encuentra efecto global del entrenamiento de resistencia sobre el CSA, pero el subgrupo de cuadriceps para CSA no es significativo ("g = 0.42 (95% CI -0.14-0.98)") y si lo es para volumen ("g = 1.62"). Es evidencia de analogo, no de vuelo.
- Cita no verificable dentro de NASA: el Evidence Report 2022 (p. 61) atribuye a English 2020 una reduccion de volumen muscular de pierna de 7-15 % a R+7; el texto leido de English 2020 no contiene ese dato. Se registra como discrepancia, no como contradiccion confirmada.

Independencia:
- Scott 2023, English 2020 y Scott 2021 comparten laboratorio (NASA JSC; Ploutz-Snyder, English, Scott), periodo (2011-2017) y, al menos en parte, participantes (Scott 2023 lo reconoce para SPRINT). Es probable, sin verificar, que los 11 astronautas con RM de Tele-SUS y los 12 con RM de Scott 2023 se solapen.
- OCHMO-TB-031 y el Evidence Report 2022 reproducen Scott 2023 y Scott 2021: son documentos institucionales derivados, no replicaciones.
- Gopalakrishnan 2010 (grupo de Cavanagh) es un grupo y una era distintos, pero con n = 4 y metodo distinto (volumen frente a CSA).
- Comfort 2021 y Padilha 2026 reutilizan estudios primarios de vuelo; no constituyen datos nuevos.
- No se encontro una replicacion independiente, con RM, del CSA del cuadriceps en la era ARED fuera del grupo NASA JSC.

## Comparacion con NASA

- Brecha reconocida por NASA: HRR MA-201 (estado Open, publicado 05/13/25) senala que "no study has determined the relative efficacy of individual countermeasures", que el sistema actual "has not proven able to prevent deconditioning in all individuals" y que los analogos usan prescripciones idealizadas. El Evidence Report 2022 (p. 133-135) lista brechas M7 (programa de ejercicio mas eficiente), M9 (hardware de exploracion), M14 (adyuvantes) y M24 (curso temporal de masa y funcion), y declara que la dosis minima de ejercicio es desconocida.
- Capacidad existente: NASA ya dispone de RM pre/post, DXA, dinamometria isocinetica en requisitos medicos (Evidence Report 2022 p. 41), y de ecografia panoramica autoadquirida con guia remota en vuelo (Tele-SUS, Scott 2021; OCHMO-TB-031 p. 13). Los especialistas ACERS monitorizan y prescriben (OCHMO-TB-031 p. 13). TwinNauta no aporta nuevas mediciones ni resuelve MA-201.
- Requisito NASA-STD-3001 [V1 4024] se formula en fuerza (>= 80 % del basal), no en area muscular. No se encontro en las fuentes leidas un requisito o umbral de area del cuadriceps; no se infiere que no exista.
- No se revisaron HDTP, IMM, IMPACT/MEDPRAT ni CMO-DA para esta afirmacion.

## Conclusion

Modificar y mantener con alcance acotado:

- Mantener (descriptivo): con el programa ISS de la era ARED, el CSA medio del cuadriceps por RM a R+1 fue algo menor que antes del vuelo en 12 astronautas, con muy baja proporcion estimada de perdidas >= 20 % y menor afectacion que la pantorrilla (Scott 2023, Table 2 y Supplemental Table 4).
- Modificar: la formulacion original ("efecto del ejercicio de resistencia en vuelo sobre la masa o el area del cuadriceps") no puede sostenerse como efecto causal con datos de vuelo. Debe expresarse como "resultado observado con el programa de ejercicio", indicando la ausencia de control, la dependencia de la region y la contraevidencia de Comfort 2021.
- Implicacion para TwinNauta (`actions`): una tarjeta puede citar esta ficha para explicar por que el ejercicio de resistencia forma parte del plan revisado por especialistas y por que el cuadriceps se monitoriza, pero no para estimar cuanta area preserva una sesion, ni para proponer cambios de carga o volumen. Cualquier valor numerico debe mostrarse como media de grupo de 12 astronautas, no como prediccion individual.

## No verificado y siguiente contraste

No verificado:
- Valores numericos de Fig. 1a y Fig. 2 de Scott 2023 (cambio porcentual medio y tamano del efecto del CSA del cuadriceps con IC 95 %); solo se leyeron las tablas del suplemento y la Table 2.
- Significado del valor "-2.09 (-8.54, -2.95)" de OCHMO-TB-031 p. 18 y la referencia "Scott et al., 2019".
- Texto completo de Gopalakrishnan 2010 (cifra especifica del cuadriceps y significado del rango -4 a -7 %).
- Origen del dato "leg muscle volume is reduced 7-15% at R+7 [52]" del Evidence Report 2022.
- Solapamiento de participantes entre Scott 2023 (RM, n = 12), Scott 2021 (n = 11) y SPRINT en vuelo.
- Suplementos de Scott 2021 (Figure S5, Tables S1-S4) y tablas de English 2020.
- Lista de estudios y Table 6 de Comfort 2021; secciones restantes de Padilha 2026.
- LeBlanc et al. 2000 (Mir, RM de cuadriceps) no se consulto en esta iteracion (HTTP 403 en la iteracion previa).
- Licencias de las publicaciones (dejadas en null).
- Paginas 12-26 de NASA SP-20250000273 (solo se leyeron 1-11; sin datos de area del cuadriceps en ellas).

Siguiente contraste:
1. Leer Fig. 1a/Fig. 2 de Scott 2023 (o solicitar los datos al LSDA por el canal institucional) para obtener el cambio porcentual y el tamano del efecto del cuadriceps con su IC, y contrastarlo con la tabla de OCHMO-TB-031 p. 18.
2. Obtener el texto completo de Gopalakrishnan 2010 y LeBlanc 2000 para una comparacion de eras con metodo y momento de medicion declarados, sin presentarla como efecto del dispositivo.
3. Buscar estudios con RM o ecografia del cuadriceps en vuelo fuera del grupo NASA JSC (ESA, JAXA, Roscosmos) para validacion independiente.
4. Revision de Medicina del enunciado y de la forma en que la tarjeta de `actions` cita este resultado.

## Registro de busqueda

Fecha de todas las consultas: 2026-11-15.

Archivos locales:
- docs/evidencia/README.md; docs/evidencia/afirmaciones.md; docs/datos-y-evidencia.md; contracts/openapi.yaml (esquemas Source y EvidenceClaim)
- docs/evidencia/fichas/claim_bedrest_spaceflight_transfer.md (contexto)
- backend/data/raw/research_pending/README.md
- backend/data/raw/research_pending/scott_2021_telesus_fulltext.xml
- backend/data/raw/research_pending/ochmo-tb-031-exercise-overview.pdf (p. 2-18)
- backend/data/raw/research_pending/nasa-sp-20250000273.pdf (p. 1-4, 7-11)
- backend/data/literature/candidates/bibliography.md; backend/data/literature/candidates/corpus.json (registros English 2020 y Scott 2023)

Consultas y URLs:
- WebSearch: "ARED astronauts thigh quadriceps muscle volume MRI long-duration International Space Station resistance exercise"
- https://www.nature.com/articles/s41526-023-00256-5 (redireccion idp.nature.com; leido via `?error=cookies_not_supported`, dos consultas)
- https://ntrs.nasa.gov/api/citations/20220019338/downloads/Evidence%20report%20aerobic%20and%20muscle_FINAL%209-21-22%20Pubpress%20accepted_v2.pdf (PDF descargado y leido por paginas)
- https://www.nature.com/articles/s41526-020-00111-x?error=cookies_not_supported (offset 0 y 100000)
- WebSearch: Gopalakrishnan 2010 "Muscle volume, strength, endurance, and exercise loads during 6-month missions in space" quadriceps MRI results
- https://pubmed.ncbi.nlm.nih.gov/20131648/ (bloqueado por cookies)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:20131648%20AND%20SRC:MED&resultType=core&format=json (metadatos y resumen de Gopalakrishnan 2010)
- WebSearch: "quadriceps cross-sectional area MRI astronauts before and after 6 months ISS Advanced Resistive Exercise Device results percent change"
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1002/jbmr.1643&resultType=core&format=json (DOI equivocado; articulo no pertinente)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=TITLE:%22Benefits%20for%20bone%20from%20resistance%20exercise%20and%20nutrition%22&resultType=core&format=json (Smith 2012, J Bone Miner Res 27:1896-1906, doi:10.1002/jbmr.1647; solo resumen; masa magra porcentual de cuerpo entero, 5 ARED y 8 iRED; no se incluye en sources por no medir cuadriceps)
- https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1694891/full (Chen 2025; leido parcialmente)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1002/jcsm.70259&resultType=core&format=json
- https://europepmc.org/api/fulltextRepo?pprId=PMC13080877&type=FILE&fileName=null (HTTP 500)
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC13080877/fullTextXML (leido parcialmente)
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9898566/fullTextXML (offset 0 y 100000)
- https://static-content.springer.com/esm/art%3A10.1038%2Fs41526-023-00256-5/MediaObjects/41526_2023_256_MOESM1_ESM.pdf (suplemento descargado; leidas p. 1-10)
- WebSearch: "systematic review spaceflight thigh muscle volume loss astronauts exercise countermeasures era ARED iRED comparison meta-analysis"
- https://pmc.ncbi.nlm.nih.gov/articles/PMC8449769/ (Comfort 2021; leido parcialmente)
- https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833 (MA-201)

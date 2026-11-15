# claim_sprint_knee_extension_torque: Cambio del torque isocinetico de extension de rodilla (60 grados/s) antes y despues de 70 dias de reposo en cama con y sin el protocolo de ejercicio SPRINT

- Estado: pending
- Investigado: 2026-11-14 por evidence-researcher
- Revision de Medicina: pendiente

## Pregunta e hipotesis

Pregunta: en el estudio SPRINT de NASA en reposo en cama, como cambio el torque de extension de rodilla entre antes y despues del reposo en el grupo sin ejercicio y en los grupos con ejercicio, y con que unidad, velocidad, estadistica y dispersion se informo.

Hipotesis de partida (de `docs/datos-y-evidencia.md`): el articulo Trappe et al. 2024 (J Appl Physiol, DOI 10.1152/japplphysiol.00489.2023) contiene torque antes/despues por grupo y protocolo de ejercicio.

Que la refutaria o modificaria: (a) que Trappe 2024 no informe torque de extension de rodilla de musculo completo, sino potencia de fibras aisladas u otra medida; (b) que el torque este publicado en otro articulo de la misma cohorte; (c) que la unidad, la velocidad angular o la dispersion no puedan confirmarse.

Resultado: la hipotesis de partida se modifica. Ver Conclusion.

## Datos para el contrato

```json
{
  "sources": [
    {
      "id": "src_ploutz_snyder_2018_sprint_bedrest",
      "title": "Exercise Training Mitigates Multisystem Deconditioning during Bed Rest. Ploutz-Snyder LL, Downs M, Goetchius E, Crowell B, English KL, Ploutz-Snyder R, Ryder JW, Dillon EL, Sheffield-Moore M, Scott JM. Med Sci Sports Exerc. 2018;50(9):1920-1928. PMID 29924746, PMCID PMC6647016 (author manuscript NIHMS1036346).",
      "url": "https://doi.org/10.1249/MSS.0000000000001618",
      "locator": "Table 3 'Muscle strength and endurance', fila 'Isokinetic KE 60', columnas CONT/Ex/ExT/FLY x BR-5/BR+0; Methods, seccion 'Isokinetic leg strength'. Leido en el manuscrito de autor (PMC6647016) via NCBI BioC, no en la version final de la revista.",
      "review_status": "pending",
      "version": "Author manuscript NIHMS1036346 (PMC6647016); version de editorial no consultada",
      "license": null
    },
    {
      "id": "src_trappe_2024_sprint_vl_soleus",
      "title": "NASA SPRINT exercise program efficacy for vastus lateralis and soleus skeletal muscle health during 70 days of simulated microgravity. Trappe TA, Minchev K, Perkins RK, Lavin KM, Jemiolo B, Ratchford SM, Claiborne A, Lee GA, Finch WH, Ryder JW, Ploutz-Snyder L, Trappe SW. J Appl Physiol (1985). 2024;136(5):1015-1039. PMID 38328821, PMCID PMC11365553.",
      "url": "https://journals.physiology.org/doi/full/10.1152/japplphysiol.00489.2023",
      "locator": "Solo resumen (Europe PMC). Texto completo, tablas, figuras y suplementos no accesibles (HTTP 403 en revista; PMC con verificacion reCAPTCHA; Europe PMC fullTextXML HTTP 500).",
      "review_status": "pending",
      "version": null,
      "license": null
    },
    {
      "id": "src_english_2020_sprint_flight",
      "title": "High intensity training during spaceflight: results from the NASA Sprint Study. English KL, Downs M, Goetchius E, Buxton R, Ryder JW, Ploutz-Snyder R, Guilliams M, Scott JM, Ploutz-Snyder LL. npj Microgravity 2020;6. PMCID PMC7434884.",
      "url": "https://doi.org/10.1038/s41526-020-00111-x",
      "locator": "Table 2 (knee extensor peak torque 60 grados/s, Nm, media +/- EE); Methods (Biodex System 4, NASA Medical Volume B 5.3). Usado solo como contraste en vuelo, no como fuente de la afirmacion.",
      "review_status": "pending",
      "version": null,
      "license": null
    }
  ],
  "claim": {
    "id": "claim_sprint_knee_extension_torque",
    "statement": "En el estudio SPRINT de NASA (70 dias de reposo en cama con inclinacion cabeza abajo de 6 grados), el torque pico isocinetico de extension de rodilla a 60 grados/s (Biodex System 4) disminuyo en el grupo control sedentario de 191.4 +/- 45.0 a 147.7 +/- 42.0 (media +/- DE; unidad no indicada en la tabla) entre BR-5 y BR+0; los grupos con ejercicio SPRINT (EX, ExT) mostraron menor descenso, con interaccion grupo-tiempo significativa frente al control (P < 0.003 segun la nota de la Tabla 3). Resultado agregado por grupo en reposo en cama, no individual ni de vuelo.",
    "kind": "intervention_result",
    "source_ids": [
      "src_ploutz_snyder_2018_sprint_bedrest"
    ],
    "population": "Adultos sanos seleccionados por condicion fisica minima (extension de rodilla > 2.0 N.m/kg en el cribado); mayoritariamente hombres (una mujer completo el estudio antes de la aleatorizacion doble ciego; despues solo se reclutaron hombres). Edad media por grupo 29-37 anos.",
    "sample_size": null,
    "environment": "bed_rest_analog",
    "limitations": [
      "Unidad de torque no declarada en la Tabla 3 ni en el metodo leido; N.m es probable por el dispositivo y el criterio de cribado, pero no esta confirmado en la tabla.",
      "Tamano de muestra inconsistente: el texto indica 34 completaron; los n por grupo en Resultados (8+9+8+8) suman 33; el resumen da CONT n = 9 y Resultados CONT n = 8.",
      "Solo dos momentos (BR-5 y BR+0); no hay curva temporal de torque en esta fuente.",
      "Medias +/- DE de grupo; no son valores individuales ni basal de un astronauta.",
      "Reposo en cama como analogo; los autores advierten que la eficacia de SPRINT en reposo en cama puede no trasladarse directamente al vuelo.",
      "Lectura sobre el manuscrito de autor, no la version final de la revista.",
      "Asignacion del simbolo ** en la fila FLY (versus Ex) inferida por posicion de las notas al pie."
    ],
    "review_status": "pending"
  }
}
```

Nota sobre `sample_size`: se dejo `null` por la inconsistencia 33/34 y CONT 8/9 descrita arriba. Medicina debe decidir que valor registrar o si se registra por grupo.

## Extraccion

### Fuente que contiene el torque: Ploutz-Snyder et al. 2018 (Table 3)

Acceso: texto del manuscrito de autor (NIHMS1036346) obtenido por la API BioC de NCBI para PMC6647016. Se leyo el texto completo disponible en dos tramos (0-100000 y 100000-123204 caracteres). No se consulto la version editorial ni el material suplementario.

Poblacion y cribado (Methods/Results):
- 10,142 personas cribadas; 110 cumplieron criterios; 62 pasaron fase I; 45 cumplieron requisitos de condicion fisica; 39 aleatorizados; 34 completaron (segun texto).
- Criterio de fuerza de inclusion: "knee extension >2.0 N·m·kg−1".
- Sexo: "One female subject completed the study before implementation of the randomized double-blind procedures"; despues solo hombres. No se indica en que grupo estaba esa participante.
- Grupos y n segun Resultados: CONT n = 8 (37 +/- 8 anos), EX n = 9 (33 +/- 10 anos), ExT n = 8 (34 +/- 6 anos), FLY n = 8 (29 +/- 5 anos). El resumen informa CONT n = 9. Las causas de los 5 abandonos no se informan en el texto leido.

Entorno y protocolo:
- 70 dias de reposo en cama con inclinacion cabeza abajo de 6 grados.
- Prescripcion SPRINT: ejercicio aerobico 6 d/semana y de resistencia 3 d/semana. Resistencia (EX/ExT): tres series de cuatro ejercicios en supino (sentadilla, prensa de piernas, curl de pierna unilateral, elevacion de talones). Aerobico: ciclismo continuo de 30 min y sesiones de intervalos en cinta (30 s, 2 min o 4 min), 3 d/semana cada tipo; la intensidad del ciclismo continuo quedo truncada en el texto leido.
- FLY: un dispositivo compacto de volante de inercia para remo y resistencia; aerobico en remo sentado; series aumentadas de 3 a 4 (prensa, elevacion de talones, curl de pierna).
- ExT: inyecciones de enantato de testosterona 100 mg/semana intramuscular, en intervalos de 2 semanas con y sin. No se confirmo en el texto si EX recibio placebo.

Metodo de torque (Methods, "Isokinetic leg strength"):
- "Knee and ankle extension/ flexion muscle strength were measured using an isokinetic dynamometer (Biodex System 4; Biodex Medical Systems, Shirley, NY) following the same protocol used by our group previously."
- Torque pico durante repeticiones maximas, a 60 grados/s (rodilla) y 30 grados/s (tobillo). Contraccion: isocinetica; el texto leido no especifica concentrica/excentrica, pierna evaluada, posicion, numero de repeticiones ni descanso. No se pudo identificar la referencia del "protocolo previo".

Calendario: BR-5 (5 dias antes del inicio del reposo) y BR+0 (dia en que termina el reposo), segun nota de la Tabla 3.

Table 3, "Muscle strength and endurance", fila "Isokinetic KE 60" (copiada tal como aparece; media +/- DE; sin unidad en la fila):

| Grupo | BR-5 | BR+0 |
| --- | --- | --- |
| CONT | 191.4 ± 45.0 | 147.7 ± 42.0 |
| Ex | 201.0 ± 59.6 | 184.9 ± 64.2* |
| ExT | 206.1 ± 32.3 | 197.7 ± 26.8* |
| FLY | 212.7 ± 36.6 | 185.0 ± 32.5** |

Notas al pie (verbatim): "Values are expressed as means ± SD." "* P < 0.003, group-time Interaction versus CONT." "** P < 0.003, group-time Interaction versus Ex." "BR − 5, 5 d before the start of bed rest; BR + 0, the day bed rest is completed; MIF, maximal isometric force; KE, knee extension; PF, plantar flexor." La correspondencia de `**` con la segunda nota se dedujo por el orden de las notas.

Estadistica (Methods): modelos de efectos mixtos separados por variable dependiente con intercepto aleatorio; Stata IC v14.21; alfa bilateral 0.05; ajuste de P por tasa de falso descubrimiento del 10 %. El texto no explica explicitamente el umbral P < 0.003 de la tabla.

Resultados en texto: "Significant interaction effects between the CONT group and all EX groups were observed for ... isokinetic upper and lower leg strength". El articulo no informa porcentajes de cambio de torque de extension de rodilla.

Transformacion de este equipo (valor derivado, no informado por el articulo): cambio relativo de las medias de grupo, (BR+0 - BR-5) / BR-5: CONT -22.8 %, Ex -8.0 %, ExT -4.1 %, FLY -13.0 %. Se calcula sobre medias de grupo; no es el cambio medio individual ni tiene dispersion asociada. No debe presentarse como dato del articulo.

Contexto de la misma tabla/estudio (no forma parte de la afirmacion): Table 4 da area transversal del cuadriceps en cm2 (media +/- DE), p. ej. CONT 75.3 ± 17.7 a 68.1 ± 15.9. Es otra magnitud (area, no torque) y no debe combinarse con el torque.

### Fuente de partida: Trappe et al. 2024

Acceso: solo resumen y metadatos (Europe PMC REST). La pagina de la revista y el PDF devolvieron HTTP 403; PMC (PMC11365553) mostro verificacion reCAPTCHA; el XML de texto completo de Europe PMC devolvio HTTP 500; no esta en el subconjunto de acceso abierto (BioC: sin resultado).

Lo que el resumen permite afirmar:
- Grupos: BR (n = 9), BRE (n = 9), BRE + T (n = 8), 70 dias de reposo a 6 grados cabeza abajo.
- "All groups were periodically tested for muscle (n = 9 times) and aerobic (n = 4 times) power during bedrest." El resumen no dice que medida de potencia muscular ni con que dispositivo.
- Las variables principales del resumen son de fibras aisladas del vasto lateral y del soleo (tamano y potencia de miofibras por tipo MHC, enzimas, capilarizacion) y masa muscular completa. El resumen no menciona "torque", "strength" ni "knee extensor" (comprobado en el texto del resumen recuperado).

Implicacion: no se pudo confirmar que Trappe 2024 contenga torque de extension de rodilla. Las 9 pruebas de potencia muscular durante el reposo no son registros diarios ni se sabe si son torque. Un archivo Excel de fibras de este estudio, si existe, describiria fibras aisladas y no equivale a torque de musculo completo ni a una curva diaria. No se infiere ninguna curva.

### Diferencia entre los grupos de ambas publicaciones

Trappe 2024 informa tres grupos (BR 9, BRE 9, BRE+T 8). Ploutz-Snyder 2018 informa cuatro (CONT, EX, ExT, FLY). La correspondencia BR = CONT, BRE = EX, BRE+T = ExT es plausible pero no se verifico en el texto completo de Trappe 2024; tampoco se pudo conciliar CONT n = 8 (Ploutz-Snyder, Resultados) con BR n = 9 (Trappe).

## Contraevidencia e independencia

Segunda busqueda:
- Dillon et al. 2018, "Efficacy of Testosterone plus NASA Exercise Countermeasures during Head-Down Bed Rest", Med Sci Sports Exerc 50(9):1929-1939, PMID 29924745, PMCID PMC6095739. Resumen: "Leg strength decreased in CON, whereas PEX and TEX were protected against loss in strength." Es la misma campana de reposo en cama y comparte autores; no constituye replica independiente. No se leyo el texto completo.
- English et al. 2020, npj Microgravity (vuelo en la ISS, PMC7434884, acceso abierto). Biodex System 4, protocolo NASA Medical Volume B 5.3, sentado, 95 a 20 grados, 60 y 180 grados/s concentrico/concentrico, torque pico en Nm. Table 2 (60 grados/s, media +/- EE): CON (n = 17) 208 ± 11 antes del vuelo, 194 ± 11 en R+5; SPRINT (n = 9) 191 ± 15 antes, 177 ± 15 en R+5. Descenso significativo en ambos grupos frente al preflight sin interaccion grupo-tiempo informada para extensores de rodilla. Esto no contradice el reposo en cama, pero muestra que en vuelo, frente a un control que tambien hace ejercicio estandar de la ISS, SPRINT no mostro diferencia en torque de extension de rodilla. Comparte autores (Ploutz-Snyder LL, English, Downs, Ryder, Scott) y protocolo; participantes distintos. No es validacion externa independiente. La dispersion es EE, no DE: no comparar directamente con la Tabla 3 de reposo en cama.
- Un estudio europeo de 90 dias de reposo con o sin ejercicio de resistencia (Alkner y Tesch 2004, aparecido en la busqueda) seria un contraste de grupo independiente, pero no se leyo; no se registran cifras.
- No se encontraron correcciones o erratas para Ploutz-Snyder 2018 en la busqueda realizada (busqueda no exhaustiva).

Independencia: Trappe 2024, Ploutz-Snyder 2018 y Dillon 2018 analizan la misma cohorte de reposo en cama. Su concordancia no es validacion externa. English 2020 es otra poblacion (vuelo) del mismo programa de investigacion.

Inconsistencias internas detectadas: n total 34 frente a suma 33; CONT 9 en resumen frente a 8 en Resultados; un dato de masa corporal de ExT escrito como "76 ± 7 yr" en el manuscrito.

## Comparacion con NASA

- HRR gap MA-201 (abierto; ultima publicacion 05/13/25 segun la pagina): determinar contramedidas de ejercicio (modalidad, prescripcion y monitoreo) para proteger tareas de mision y salud. Senala que no se ha determinado la eficacia relativa de contramedidas individuales y que los analogos de reposo en cama usan prescripciones idealizadas y hardware no configurado para vuelo. Lista como tareas completadas el "Integrated Resistance and Aerobic Training Study" (Ploutz-Snyder; 24 sujetos de reposo en cama y 9 de vuelo, segun la pagina), "Exercise Training on Compact Equipment" y el estudio de testosterona, y una tarea "Musculoskeletal Outcomes" con pruebas isocineticas e isometricas.
- Relacion: SPRINT es un estudio de investigacion completado dentro de la cartera de HRP, no un sistema operativo de monitoreo. El gap sigue abierto, de modo que este resultado no cierra la pregunta de contramedidas para misiones de exploracion.
- La cifra de 24 sujetos de reposo en cama en la pagina HRR no coincide de forma evidente con los 33/34 del articulo (posiblemente cuenta solo grupos de la tarea SPRINT); no se verifico.
- No se infiere ninguna carencia de NASA por ausencia de mencion.

## Conclusion

Modificar.

1. La fuente con torque de extension de rodilla antes/despues para la cohorte SPRINT de reposo en cama, accesible y leida, es Ploutz-Snyder et al. 2018, Table 3 (manuscrito de autor), no Trappe 2024. Trappe 2024 solo pudo leerse como resumen y este se centra en fibras aisladas y masa muscular; no se pudo confirmar que contenga torque.
2. Lo confirmado: Biodex System 4, isocinetico, extension de rodilla a 60 grados/s, torque pico, BR-5 y BR+0, medias +/- DE por grupo, interaccion grupo-tiempo significativa (P < 0.003) de EX y ExT frente a CONT.
3. Lo no confirmado: la unidad (N.m probable, no impresa en la tabla), el tipo de contraccion (concentrica no indicada), el n exacto por grupo.
4. Uso permitido en TwinNauta tras revision: referencia de grupo de dos puntos para `knee_extension_torque` en contexto de reposo en cama. No usar como basal individual, ni como curva temporal, ni como efecto esperado en vuelo. English 2020 indica que en vuelo el contraste SPRINT frente al ejercicio estandar no mostro diferencia en este torque.
5. El estado sigue pending hasta revision de Medicina.

Se recomienda que `docs/datos-y-evidencia.md` y `afirmaciones.md` cambien la fuente de torque a Ploutz-Snyder 2018 Table 3 o la anadan junto a Trappe 2024 (este agente no modifica esos archivos).

## No verificado y siguiente contraste

- Texto completo, tablas, figuras y suplementos de Trappe 2024: si contiene alguna medida de torque o potencia de musculo completo (las 9 pruebas de potencia), y cual es el "Excel de fibras" y su contenido. Siguiente paso: acceso institucional o PDF facilitado por la usuaria.
- Unidad de la fila "Isokinetic KE 60": confirmar en la version editorial de Ploutz-Snyder 2018 o en el protocolo citado ("same protocol used by our group previously"), cuya referencia no pudo identificarse.
- Tipo de contraccion, pierna, posicion y numero de repeticiones del protocolo de reposo en cama.
- n por grupo (8 o 9 en CONT; total 33 o 34) y como trato el modelo a quienes faltaban datos.
- Asignacion exacta del simbolo ** en FLY.
- Correspondencia de grupos entre Trappe 2024 (BR/BRE/BRE+T) y Ploutz-Snyder 2018 (CONT/EX/ExT/FLY).
- Disponibilidad de datos individuales (p. ej. NASA LSDA u OSDR): no se encontro declaracion de disponibilidad en el texto leido; no se busco en LSDA.
- Contraste independiente: leer Alkner y Tesch 2004 (90 dias) u otras campanas de reposo de grupos distintos.
- Si existe una version final con errata de Ploutz-Snyder 2018.

## Registro de busqueda

Fecha de todas las consultas: 2026-11-14.

Archivos locales leidos: `.claude/agents/evidence-researcher.md`, `docs/evidencia/README.md`, `docs/datos-y-evidencia.md`, `contracts/openapi.yaml` (esquemas `Source`, `EvidenceClaim`), coincidencias de "sprint/torque" en `docs/`.

URLs consultadas:
- https://journals.physiology.org/doi/full/10.1152/japplphysiol.00489.2023 (HTTP 403)
- https://journals.physiology.org/doi/pdf/10.1152/japplphysiol.00489.2023 (HTTP 403)
- https://pubmed.ncbi.nlm.nih.gov/38328821/ (pagina de cookies, sin contenido)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC10979826 (verificacion, sin contenido)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11365553/ (reCAPTCHA, sin contenido)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1152/japplphysiol.00489.2023&resultType=core&format=json (metadatos y resumen de Trappe 2024)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:38328821%20AND%20SRC:MED&resultType=core&format=json (resumen de Trappe 2024)
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11365553/fullTextXML (HTTP 500, dos intentos)
- https://europepmc.org/api/fulltextRepo?pprId=PMC11365553&type=FILE&fileName=PMC11365553.xml (HTTP 500)
- https://europepmc.org/article/MED/38328821 (HTTP 403)
- https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/PMC11365553/unicode (sin resultado)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%22Exercise%20training%20mitigates%20multisystem%20deconditioning%20during%20bed%20rest%22&resultType=core&format=json (metadatos Ploutz-Snyder 2018)
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6647016/fullTextXML (HTTP 500)
- https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/PMC6647016/unicode (texto del manuscrito de autor de Ploutz-Snyder 2018; leido completo en dos tramos)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=%22Efficacy%20of%20testosterone%20plus%20NASA%20exercise%20countermeasures%22&resultType=core&format=json (resumen Dillon 2018)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1038/s41526-020-00111-x&resultType=core&format=json (resumen English 2020)
- https://www.nature.com/articles/s41526-020-00111-x (redireccion a autenticacion, no seguida)
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7434884/fullTextXML (texto completo English 2020, primeros 100000 caracteres)
- https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833 (gap MA-201)
- https://bohrium.dp.tech/paper/arxiv/3c1151a569cd8e76016b608e683726f95295cac4e3ada2d3342dbd3fd10de673 (HTTP 404)
- https://biomed.reviewer.ly/app/publication/288e9df4-0d12-42f1-aac1-25c213146bb0 (dominio no resuelto)

Busquedas web:
- "10.1152/japplphysiol.00489.2023 bed rest SPRINT knee extension"
- "Trappe 2024 \"SPRINT\" bedrest testosterone myocellular quadriceps soleus J Appl Physiol 136 1015 PMC"
- "ntrs.nasa.gov SPRINT 70 day bed rest knee extension isokinetic torque exercise countermeasure Ploutz-Snyder" (sin documento NTRS pertinente)
- "Trappe 2024 SPRINT bedrest \"knee extensor\" OR \"knee extension\" torque isokinetic vastus lateralis soleus 70 days results" (modo extendido)
- "figshare \"SPRINT\" Trappe vastus lateralis soleus supplemental bedrest 70 days single fiber" (sin dataset localizado)

Limitacion del metodo: las paginas se leyeron mediante una herramienta que resume el contenido con un modelo auxiliar; los valores de la Tabla 3 se pidieron dos veces como texto literal de la fila y coincidieron. Conviene que la verificacion los contraste contra el PDF.

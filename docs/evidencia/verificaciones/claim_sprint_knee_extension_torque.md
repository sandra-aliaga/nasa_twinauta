# Verificacion: claim_sprint_knee_extension_torque

- Verificado: 2026-11-14 por evidence-verifier
- Ficha verificada: `docs/evidencia/fichas/claim_sprint_knee_extension_torque.md`
- Estado de la afirmacion: pending (esta verificacion no aprueba evidencia ni marca nada como reviewed)

## Veredicto

**corrected.** Las cifras de la Tabla 3 de Ploutz-Snyder 2018 se confirmaron de forma literal (texto sin resumir) y la asignacion de asteriscos es la indicada. Pero la ficha contiene un error material: Trappe et al. 2024 **si** contiene el torque isocinetico de extension de rodilla a 60 grados/s, en N.m, por grupo (Table 1, "Quadriceps strength, Nm"). Esa tabla, que cita a Ploutz-Snyder 2018 como fuente previa de parte de los datos, (a) confirma la unidad N.m, (b) cambia la definicion temporal (pico de BR-11 y BR-5 frente a BR+2) y (c) asigna los valores de los dos grupos de ejercicio tradicional al reves que Ploutz-Snyder 2018. Mientras no se resuelva ese cruce, no se puede atribuir con seguridad que cifras corresponden a "Ex" y cuales a "ExT". Los valores del grupo control no se ven afectados.

## Nota sobre independencia del procedimiento

La regla indica leer primero solo "Datos para el contrato" y "Extraccion". La ficha se abrio completa en una sola lectura, por lo que tambien se vieron "Contraevidencia", "Comparacion con NASA" y "Conclusion" antes de comprobar. Para compensarlo, todas las cifras se comprobaron sobre texto literal descargado con curl (JSON/HTML sin pasar por ningun modelo que resuma), y se buscaron fuentes no usadas por la ficha (texto completo de Trappe 2024, Dillon 2018, referencia 5 de Ploutz-Snyder 2018, Alkner y Tesch 2004).

## Acceso literal conseguido

| Documento | Via | Tipo de texto | Resultado |
| --- | --- | --- | --- |
| Ploutz-Snyder 2018, manuscrito de autor | https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/PMC6647016/unicode (HTTP 200, 123204 bytes) | JSON con el XML JATS de la Tabla 3 | Leido literalmente |
| Ploutz-Snyder 2018, manuscrito de autor | https://pmc.ncbi.nlm.nih.gov/articles/PMC6647016/ (HTTP 200) | HTML de PMC ("Author manuscript; available in PMC: 2019 Jul 23") | Leido literalmente; confirma tabla y notas al pie con sus identificadores |
| Ploutz-Snyder 2018, version de la revista | https://doi.org/10.1249/MSS.0000000000001618 -> ovid.com (pagina de resumen con verificacion captcha) | - | **No leido.** No se pudo contrastar con el PDF ni con la version editorial |
| Trappe 2024, version final | https://pmc.ncbi.nlm.nih.gov/articles/PMC11365553/ (HTTP 200, 392545 bytes; "Articles from Journal of Applied Physiology are provided here courtesy of American Physiological Society") | HTML de PMC, texto completo | Leido literalmente (tablas en texto plano) |
| Trappe 2024, suplemento | https://doi.org/10.6084/m9.figshare.23699742 | - | **No abierto** |
| Dillon 2018 (misma campana) | https://pmc.ncbi.nlm.nih.gov/articles/PMC6095739/ | HTML de PMC (manuscrito de autor) | Metodos leidos literalmente; suplementos SDC 3, 5 y 6 no abiertos |
| English 2020 (vuelo) | https://pmc.ncbi.nlm.nih.gov/articles/PMC7434884/ | HTML de PMC | Table 2 y Methods leidos literalmente |
| Alkner y Tesch 2004 | Europe PMC REST, DOI 10.1007/s00421-004-1172-8 | Solo resumen | Resumen leido |

## Tabla de comprobaciones

| # | Comprobacion | Resultado | Evidencia |
| --- | --- | --- | --- |
| 1 | Existencia | Correcto | Ploutz-Snyder 2018: el DOI resuelve a ovid.com ".../10.1249/mss.0000000000001618~exercise-training-mitigates-multisystem-deconditioning"; PMC6647016 da el mismo titulo, autores y MSSE 50(9). Trappe 2024: PMC11365553 muestra "J Appl Physiol (1985). 2024 Feb 8;136(5):1015-1039. doi: 10.1152/japplphysiol.00489.2023" y el titulo de la ficha. English 2020: PMC7434884, titulo "High intensity training during spaceflight: results from the NASA Sprint Study". |
| 2a | Valores de la fila "Isokinetic KE 60" (Ploutz-Snyder 2018, Table 3) | Correcto, literal | XML de la tabla en BioC y HTML de PMC: CONT 191.4 +/- 45.0 / 147.7 +/- 42.0; Ex 201.0 +/- 59.6 / 184.9 +/- 64.2*; ExT 206.1 +/- 32.3 / 197.7 +/- 26.8*; FLY 212.7 +/- 36.6 / 185.0 +/- 32.5**. Encabezado: CONT, Ex, ExT, FLY, cada uno con BR - 5 y BR + 0. Pie: "Values are expressed as means ± SD." Coincide con la ficha cifra por cifra. Solo manuscrito de autor; la version editorial no se pudo leer. |
| 2b | Asteriscos | Correcto, ya no inferido | En el XML, `*` enlaza a `rid="TFN3"` y `**` a `rid="TFN4"`. En el HTML de PMC: `id="TFN3"` -> "* P < 0.003, group-time Interaction versus CONT."; `id="TFN4"` -> "** P < 0.003, group-time Interaction versus Ex." Ex y ExT: interaccion frente a CONT. FLY: interaccion frente a Ex, sin marca frente a CONT en esta fila. |
| 2c | Unidad | Falta en la fuente de la afirmacion; confirmada por otra publicacion de la misma cohorte | La fila "Isokinetic KE 60" no lleva unidad en Ploutz-Snyder 2018, a diferencia de otras filas ("Leg press MIF, N"). Trappe 2024, Table 1 ("Subject characteristics of BR, BRE, and BRE+T"): "Quadriceps strength, Nm", con la nota "quadriceps and plantar flexor strength reflects isokinetic maximal strength at 60°/s and 30°/s, respectively. Some of these data have been reported previously (35)". La referencia 35 es Ploutz-Snyder 2018. Unidad: N.m (torque absoluto, no N.m/kg). |
| 2d | Tipo de contraccion | No confirmado | Ploutz-Snyder 2018 solo dice "peak torque production was assessed during maximal repetitions performed at 60°·s−1" y remite a "the same protocol used by our group previously (5)". La referencia 5 es Ploutz-Snyder LL et al., MSSE 2014;46(2):358-68, doi 10.1249/MSS.0b013e3182a62f85 (no leida; no hay PMCID en Europe PMC). Dillon 2018 remite a SDC 3 (no abierto). English 2020 (vuelo, otro estudio) usa concentrico/concentrico; no se puede trasladar sin comprobarlo. |
| 2e | Pierna | No indicado en Ploutz-Snyder 2018; indicado en una publicacion hermana | Dillon 2018 (misma campana de 70 dias, Biodex): "Testing was performed using the right limb." No se comprobo que sea exactamente la misma sesion de prueba que la Tabla 3 de Ploutz-Snyder. |
| 2f | Tamano de muestra por grupo | Inconsistente; la ficha lo describe bien | Ploutz-Snyder 2018, resumen: "Subjects (n = 34) ... 9 ... (CONT), 9 ... (EX), 8 ... (ExT), and 8 ... flywheel" (suma 34). Resultados: "CONT: n = 8 ... EX: n = 9 ... ExT: n = 8 ... FLY: n = 8" (suma 33, frente a "34" en la misma frase). Trappe 2024 Table 1: BR 9, BRE 9, BRE + T 8, "26 individuals"; "All subjects were males, except for one female that was included in the control group." La tabla no da n por celda. |
| 2g | Temporalidad | Discrepancia no recogida en la ficha | Ploutz-Snyder 2018: "BR + 0, the day bed rest is completed". Trappe 2024 Table 1: "strength: peak value from BR-11 and BR-5 to BR + 2". Dillon 2018: pruebas en "BR-12 and BR-5 ... BR+2 and BR+12". Las medias post casi coinciden (148 frente a 147.7), lo que indica la misma sesion post etiquetada de forma distinta; las medias pre difieren porque Trappe usa el mayor de dos valores. |
| 3 | Fidelidad | Requiere correccion | (a) "unidad no indicada en la tabla" es literalmente cierto, pero la unidad esta disponible: N.m. (b) La frase sobre EX y ExT es fiel a la Tabla 3, pero la ficha no advierte que Trappe 2024 asigna esos valores a los grupos opuestos (ver 6). (c) Falta indicar que FLY no tiene interaccion marcada frente a CONT en esta fila, aunque el resumen de Ploutz-Snyder diga que hubo interaccion en "isokinetic upper and lower leg strength" para "all EX groups". (d) Es correcto que el articulo no informa porcentajes; Trappe 2024 si los informa como media +/- DE del cambio: BR -26 +/- 11 %, BRE -6 +/- 7 %, BRE + T -15 +/- 5 %. El -22.8 % derivado por la ficha para CONT (cociente de medias, pre = BR-5) no debe mezclarse con el -26 % de Trappe (pre = pico de dos sesiones). |
| 4 | Aplicabilidad | Correcto con restricciones adicionales | Reposo en cama de 70 dias a 6 grados, sujetos sanos (mayoria hombres; una mujer en el control). Dos momentos, medias de grupo. Ademas: Trappe 2024 indica que el control (BR) hizo 9 sesiones de prueba de potencia muscular y 4 de potencia aerobica durante el reposo (Table 9) y atribuye a ello respuestas atipicas del control; el control no es desuso puro. Sin dato de vuelo. |
| 5 | Contraevidencia (busqueda propia) | Encontrada y consistente en direccion | Alkner BA, Tesch PA. Eur J Appl Physiol 2004;93:294-305, doi 10.1007/s00421-004-1172-8, PMID 15338217 (resumen): 90 dias a 6 grados, BR n = 9 y BRE n = 8 hombres; en BR el torque o la fuerza de extension de rodilla disminuyeron un 31-60 %; con ejercicio de resistencia en volante de inercia, la disminucion del torque no especifico de la tarea fue menor (P < 0.05). Grupo y cohorte distintos; replica la direccion, con otra magnitud y otro protocolo. English 2020 (vuelo, Table 2, media +/- EE, Nm): CON 208 +/- 11 -> 194 +/- 11 en R+5; SPRINT 191 +/- 15 -> 177 +/- 15. Hay efecto del tiempo sin interaccion de grupo en extension de rodilla a 60 grados/s; literal y coincidente con la ficha. |
| 6 | Independencia | Correcto, con un problema nuevo | Ploutz-Snyder 2018, Trappe 2024 y Dillon 2018 son la misma cohorte; Trappe 2024 cita a Ploutz-Snyder 2018 para estos datos ("Some of these data have been reported previously (35)"), de modo que no se corroboran entre si. **Cruce de etiquetas**: Trappe BRE (sin testosterona): edad 34 +/- 5, peso 76 +/- 7 kg, torque 211 +/- 32 -> 198 +/- 27 Nm. Coincide con Ploutz-Snyder ExT (con testosterona): 34 +/- 6 anos, 76 +/- 7 ("yr" en el manuscrito), 206.1 +/- 32.3 -> 197.7 +/- 26.8. Trappe BRE + T: 33 +/- 10, 77 +/- 14 kg, 217 +/- 70 -> 185 +/- 64. Coincide con Ploutz-Snyder Ex: 33 +/- 10, 77 +/- 14, 201.0 +/- 59.6 -> 184.9 +/- 64.2. En ambos articulos el grupo de 9 es el de ejercicio sin testosterona. No se puede determinar cual de las dos publicaciones intercambio las etiquetas. Dillon 2018 (con grupos PEX/TEX) no lo resolvio en el texto leido. |
| 7 | Campos del contrato | Correcto en forma | Los tres `Source` tienen id, title, url, locator, review_status "pending", version y license (se admite null), segun `contracts/openapi.yaml` (`Source`, l. 436). `EvidenceClaim` (l. 1308): kind "intervention_result" y environment "bed_rest_analog" son valores validos; sample_size null esta permitido; review_status "pending". El `locator` de `src_trappe_2024_sprint_vl_soleus` ya no es correcto (ver correcciones). |

## Pregunta (e): contenido de Trappe 2024 sobre torque o fuerza de rodilla

Lectura literal del texto completo en PMC:

- **Si contiene torque de musculo completo**: Table 1, filas "Quadriceps strength, Nm" (Pre, Post, Delta) y "Plantar flexor strength, Nm"; isocinetico a 60 grados/s (cuadriceps) y 30 grados/s (flexores plantares); media +/- DE; datos parcialmente publicados antes en Ploutz-Snyder 2018. Valores: BR 200 +/- 47 -> 148 +/- 42 (Delta -26 +/- 11 %); BRE 211 +/- 32 -> 198 +/- 27 (-6 +/- 7 %); BRE + T 217 +/- 70 -> 185 +/- 64 (-15 +/- 5 %).
- La unica aparicion de "torque" en el resto del texto es el motor de torque del montaje de fibras aisladas (Cambridge Technology 308B), no una medida de musculo completo.
- Las "9 sessions" de potencia muscular (Table 9) se hicieron en un cicloergometro supino de carga inercial ("angular acceleration of an un-resisted flywheel"); es potencia de pedaleo, no torque de extension de rodilla. No se publican sus valores en el texto leido.
- Fuerza de fibras aisladas (P_o, P_o/CSA en kN.m^-2) en Tables 5-7; no equivale a torque de musculo completo.
- Disponibilidad: "Data will be made available by the authors upon reasonable request." El Excel S1 de figshare contiene datos individuales, citado en las figuras de fibras y enzimas; no se abrio y no se sabe si incluye torque.

## Correcciones propuestas

| Campo | Valor actual | Valor propuesto | Fuente |
| --- | --- | --- | --- |
| claim.statement | "...de 191.4 +/- 45.0 a 147.7 +/- 42.0 (media +/- DE; unidad no indicada en la tabla) entre BR-5 y BR+0; los grupos con ejercicio SPRINT (EX, ExT) mostraron menor descenso, con interaccion grupo-tiempo significativa frente al control (P < 0.003 segun la nota de la Tabla 3)." | "...de 191.4 +/- 45.0 a 147.7 +/- 42.0 N.m (media +/- DE; la unidad no figura en la Tabla 3 de Ploutz-Snyder 2018 y se toma de Trappe 2024, Table 1, que presenta los mismos datos) entre BR-5 y BR+0. Los dos grupos con ejercicio en equipo tradicional (con y sin testosterona) mostraron menor descenso, con interaccion grupo-tiempo frente al control (P < 0.003, nota de la Tabla 3). El grupo con volante de inercia (FLY) no tiene esa marca frente al control en esta fila." | Ploutz-Snyder 2018 Table 3 y notas TFN3/TFN4 (PMC6647016); Trappe 2024 Table 1 (PMC11365553) |
| claim.limitations ("Unidad de torque no declarada...") | "N.m es probable ..., pero no esta confirmado en la tabla." | "La Tabla 3 no imprime la unidad; Trappe 2024 (Table 1, misma cohorte y datos) la declara como Nm. Es torque absoluto, no normalizado por masa." | Trappe 2024 Table 1 |
| claim.limitations ("Asignacion del simbolo **...") | "inferida por posicion de las notas al pie" | Eliminar o sustituir por: "Comprobado en el XML de PMC: * = TFN3 (frente a CONT), ** = TFN4 (frente a Ex)." | HTML/BioC de PMC6647016 |
| claim.limitations (nueva) | (no existe) | "Trappe 2024 asigna los valores de Ex y ExT de Ploutz-Snyder 2018 a los grupos opuestos (BRE+T frente a BRE), y tambien la edad y el peso. No se ha resuelto cual es correcta; no atribuir cifras a 'con testosterona' o 'sin testosterona' hasta confirmarlo." | Ploutz-Snyder 2018 Results y Table 3; Trappe 2024 Table 1 |
| claim.limitations (nueva) | (no existe) | "Momento posterior: BR+0 segun Ploutz-Snyder 2018; BR+2 segun Trappe 2024 y Dillon 2018. Momento previo: BR-5 (Ploutz-Snyder) frente a pico de BR-11 y BR-5 (Trappe)." | Ploutz-Snyder 2018 Table 3 (nota); Trappe 2024 Table 1 (nota); Dillon 2018 Methods |
| claim.limitations (nueva) | (no existe) | "Tipo de contraccion no declarado en Ploutz-Snyder 2018 (remite a Ploutz-Snyder 2014, doi 10.1249/MSS.0b013e3182a62f85, no leido). Pierna derecha segun Dillon 2018 (misma campana), no indicada en la fuente principal." | Ploutz-Snyder 2018 Methods y ref. 5; Dillon 2018 Methods |
| claim.limitations (nueva) | (no existe) | "El grupo control realizo 9 pruebas de potencia muscular y 4 de potencia aerobica durante el reposo; no representa desuso sin carga." | Trappe 2024 Table 9 y Discussion |
| claim.population | "...una mujer completo el estudio ... No se indica en que grupo..." (texto de la Extraccion) | Anadir: "La unica mujer estaba en el grupo control (Trappe 2024)." | Trappe 2024, Methods ("one female that was included in the control group") |
| claim.sample_size | null | Mantener null, con nota: el resumen de Ploutz-Snyder (34; CONT 9) y Trappe 2024 (BR 9) coinciden frente a Resultados de Ploutz-Snyder (CONT 8; suma 33). La decision corresponde a Medicina. | Ploutz-Snyder 2018 Abstract/Results; Trappe 2024 Table 1 |
| sources[src_trappe_2024_sprint_vl_soleus].locator | "Solo resumen (Europe PMC). Texto completo, tablas, figuras y suplementos no accesibles..." | "Table 1 'Subject characteristics of BR, BRE, and BRE+T', fila 'Quadriceps strength, Nm' (Pre, Post, Delta; media +/- DE; isocinetico 60 grados/s; pre = pico BR-11/BR-5, post = BR+2). Texto completo leido en PMC11365553. Suplemento figshare 10.6084/m9.figshare.23699742 no inspeccionado." | PMC11365553 |
| sources[src_trappe_2024_sprint_vl_soleus].version | null | "Version final publicada (PMC11365553)" | PMC11365553 |
| claim.source_ids | ["src_ploutz_snyder_2018_sprint_bedrest"] | Opcional: anadir "src_trappe_2024_sprint_vl_soleus" como fuente de la unidad, dejando constancia de que no es corroboracion independiente | - |
| Hipotesis de `docs/datos-y-evidencia.md` | (la ficha concluye que no se pudo confirmar torque en Trappe 2024) | La hipotesis de partida era correcta en lo esencial: Trappe 2024 contiene torque antes y despues por grupo (3 grupos, sin FLY). La ficha no modifica ese archivo; queda como recomendacion. | Trappe 2024 Table 1 |

## Lo que no pude verificar literalmente

- **Version editorial y PDF de Ploutz-Snyder 2018**: el DOI lleva a ovid.com con captcha; solo se leyo el manuscrito de autor (NIHMS en PMC6647016). No se puede descartar que la version final corrija la unidad, los n o las etiquetas Ex/ExT.
- PDF de la revista de Trappe 2024: se leyo la version final en PMC (HTML), no el PDF. Las tablas se leyeron como texto plano, no renderizadas. Su orden de columnas (BR, BRE, BRE + T) es coherente en todas las filas.
- Suplemento de Trappe 2024 (figshare 23699742): no abierto; se desconoce si el Excel S1 incluye torque individual.
- Referencia 5 de Ploutz-Snyder 2018 (MSSE 2014;46:358-68): no leida; tipo de contraccion, posicion y repeticiones sin confirmar.
- Suplementos SDC 3, 5 y 6 de Dillon 2018 (protocolo y tablas de fuerza): no abiertos. Podrian resolver el cruce Ex/ExT.
- Cual de los dos articulos tiene las etiquetas Ex/ExT correctas.
- Si la sesion "BR+0" de Ploutz-Snyder es la misma que "BR+2" de Trappe y Dillon; lo indica la coincidencia de medias post, pero no esta comprobado.
- Erratas: no se busco de forma exhaustiva una correccion publicada de ninguno de los dos articulos.
- Alkner y Tesch 2004: solo resumen.

## Diferencias con la conclusion del investigador

1. La ficha concluye que no se pudo confirmar torque de rodilla en Trappe 2024. **Incorrecto**: Trappe 2024 Table 1 lo contiene, en Nm, con Pre, Post y Delta % por grupo. La ficha solo pudo leer el resumen; aqui se obtuvo el texto completo de PMC con una descarga directa.
2. La ficha deja la unidad como no confirmada. Queda confirmada como N.m por Trappe 2024, que reutiliza los datos, aunque la Tabla 3 de Ploutz-Snyder sigue sin imprimirla.
3. La ficha infiere la asignacion de `**`; aqui se confirmo por los identificadores de nota (TFN4 = "versus Ex").
4. La ficha plantea como "plausible" la correspondencia BR = CONT, BRE = EX y BRE+T = ExT. Para el control se mantiene (mismas cifras y demografia). Para los grupos de ejercicio, los datos indican lo contrario: los valores y la demografia de BRE coinciden con los de ExT, y los de BRE+T con los de Ex. Es una contradiccion entre publicaciones que la ficha no detecto.
5. La ficha no recoge la diferencia de momentos (BR+0 frente a BR+2; pre de una sesion frente a pico de dos) ni que el control realizo pruebas periodicas de potencia.
6. Coincidencias: valores numericos de la Tabla 3, media +/- DE, P < 0.003 frente a CONT para Ex y ExT, Biodex System 4, 60 grados/s, inconsistencia 33/34 y CONT 8/9, cifras de English 2020 y caracter no independiente de las publicaciones de la cohorte.

## Registro

Fecha de todas las consultas: 2026-11-14. Las descargas se hicieron con curl y se guardaron en el directorio temporal de la sesion; el texto se extrajo con Python (`-I`), sin herramientas que resuman.

- https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/PMC6647016/unicode (200)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6647016/ (200)
- https://doi.org/10.1249/MSS.0000000000001618 -> ovid.com (200, pagina de resumen con captcha; sin tabla)
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6647016/fullTextXML (503)
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11365553/fullTextXML (503)
- https://www.ncbi.nlm.nih.gov/research/bionlp/RESTful/pmcoa.cgi/BioC_json/PMC11365553/unicode (429)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC11365553/ (200, texto completo)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6095739/ (200)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7434884/ (200)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1249/MSS.0b013e3182a62f85 (sin PMCID)
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1007/s00421-004-1172-8&resultType=core&format=json (resumen de Alkner y Tesch 2004)
- `contracts/openapi.yaml`, esquemas `Source` (l. 436) y `EvidenceClaim` (l. 1308)

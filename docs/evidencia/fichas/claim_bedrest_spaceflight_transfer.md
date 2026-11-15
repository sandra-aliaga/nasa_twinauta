# claim_bedrest_spaceflight_transfer: Los cambios musculares del muslo en reposo en cama con inclinacion cefalica solo son trasladables a vuelo de larga duracion de forma aproximada, dependiente de region, duracion, contramedidas y momento de medicion

- Estado: pending
- Investigado: 2026-11-14 por evidence-researcher
- Revision de Medicina: pendiente

Uso previsto en TwinNauta: LIMITACION del escenario de referencia basado en reposo en cama. Esta ficha no valida ese escenario ni la tasa de cuadriceps de `claim_bedrest_quadriceps_csa_rate`.

## Pregunta e hipotesis

- Pregunta: hasta que punto los cambios de tamano del cuadriceps / musculos del muslo observados en reposo en cama con inclinacion cefalica (HDBR) se reproducen en vuelo espacial de larga duracion (aprox. 6 meses, con ejercicio a bordo)?
- Hipotesis de trabajo: HDBR reproduce la direccion del cambio (perdida de area/volumen en musculos antigravitatorios de la pierna), pero no su magnitud ni su ritmo de forma intercambiable, porque difieren duracion, contramedidas, poblacion, region muscular y momento de la medicion posterior.
- Que la refutaria: una comparacion directa vuelo vs HDBR, con el mismo metodo de imagen, la misma region del muslo, momentos de medicion equivalentes y grupos independientes, que mostrara magnitudes y trayectorias equivalentes sin necesidad de ajustar duracion ni contramedidas. Tambien la modificaria un estudio que mostrara que la diferencia desaparece al controlar el ejercicio en vuelo.
- Resultado de la busqueda: no se encontro esa comparacion directa para el muslo en vuelo de larga duracion moderno. La fuente de partida (Bocker 2026) compara vuelo y HDBR, pero mide la pantorrilla, no el muslo.

## Datos para el contrato

```json
{
  "sources": [
    {
      "id": "src_bocker_2026_npjmicrogravity",
      "title": "Comparison of musculoskeletal responses and its variability after long-term spaceflight and prolonged bed rest conditions (Bocker J, Lau P, Mittag U, Bloch W, Vico L, Rittweger J; npj Microgravity 12:43, 2026)",
      "url": "https://doi.org/10.1038/s41526-026-00611-2",
      "locator": "Resumen; Tabla 1; Fig. 3 (vuelo vs reposo en cama); Fig. 5 (ajuste logaritmico Ar.M Tib66); Discusion (limitaciones)",
      "review_status": "pending",
      "version": "Version publicada 2026-05-25",
      "license": "CC BY 4.0"
    },
    {
      "id": "src_nasa_hrp47072_muscle_2015",
      "title": "Evidence Report: Risk of Impaired Performance Due to Reduced Muscle Mass, Strength, and Endurance (HRP-47072, NASA JSC)",
      "url": "https://humanresearchroadmap.nasa.gov/Evidence/reports/Muscle.pdf",
      "locator": "Seccion IV.A.5 (Shuttle-Mir), Figura 8 y texto siguiente (p. 19-20); Seccion IV.A.6 (ISS, p. 21); Seccion IV.B.1-2 (p. 28-30)",
      "review_status": "pending",
      "version": "Approved for Public Release: March 9, 2015",
      "license": null
    },
    {
      "id": "src_english_2020_sprint_flight",
      "title": "High intensity training during spaceflight: results from the NASA Sprint Study (English KL et al.; npj Microgravity 6:21, 2020)",
      "url": "https://doi.org/10.1038/s41526-020-00111-x",
      "locator": "Resultados (masa magra de pierna por DXA; torque extensor de rodilla); Discusion (limitaciones)",
      "review_status": "pending",
      "version": "Version publicada 2020-08-18",
      "license": null
    },
    {
      "id": "src_akima_2000_msse",
      "title": "Effect of short-duration spaceflight on thigh and leg muscle volume (Akima H et al.; Med Sci Sports Exerc 32(10):1743-1747, 2000)",
      "url": "https://journals.lww.com/acsm-msse/fulltext/2000/10000/effect_of_short_duration_spaceflight_on_thigh_and.13.aspx",
      "locator": "Solo resumen via registro bibliografico BISp; texto completo no leido (HTTP 402)",
      "review_status": "pending",
      "version": null,
      "license": null
    },
    {
      "id": "src_murgia_2022_pnasnexus",
      "title": "Signatures of muscle disuse in spaceflight and bed rest revealed by single muscle fiber proteomics (Murgia M et al.; PNAS Nexus 1(3):pgac086, 2022)",
      "url": "https://doi.org/10.1093/pnasnexus/pgac086",
      "locator": "Resumen; Resultados (proteoma mitocondrial); Discusion",
      "review_status": "pending",
      "version": null,
      "license": null
    },
    {
      "id": "src_nasa_hrr_ma201",
      "title": "NASA Human Research Roadmap, gap MA-201 (contramedidas de ejercicio)",
      "url": "https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833",
      "locator": "Descripcion del gap y tareas vinculadas; ultima publicacion 05/13/25",
      "review_status": "pending",
      "version": "05/13/25",
      "license": null
    }
  ],
  "claim": {
    "id": "claim_bedrest_spaceflight_transfer",
    "statement": "La perdida de tamano muscular de la pierna en reposo en cama con inclinacion cefalica de 6 grados coincide en direccion con la observada tras vuelo de larga duracion, pero su magnitud y ritmo no son intercambiables: dependen de la duracion, de las contramedidas (ejercicio en vuelo frente a reposo sin ejercicio), de la region muscular y del momento de medicion. La comparacion directa disponible mas reciente (Bocker 2026) mide la pantorrilla con pQCT, no el muslo; para el cuadriceps solo hay comparaciones antiguas, con muestras muy pequenas y del mismo grupo investigador. Por tanto, una trayectoria de cuadriceps derivada de reposo en cama solo puede mostrarse como referencia de analogo terrestre, no como prediccion de vuelo.",
    "kind": "observed_result",
    "source_ids": [
      "src_bocker_2026_npjmicrogravity",
      "src_nasa_hrp47072_muscle_2015",
      "src_english_2020_sprint_flight",
      "src_akima_2000_msse",
      "src_murgia_2022_pnasnexus",
      "src_nasa_hrr_ma201"
    ],
    "population": "Bocker 2026: 13 viajeros espaciales varones (16 conjuntos de datos; 3 volaron dos veces), 34-56 anos, mision mediana 178 d (165-340 d), con ejercicio casi diario de protocolo no disponible; y 11 varones jovenes (22-39 anos) del grupo control sin contramedidas de 60 d de HDBR a 6 grados (estudio RSL). Fuentes complementarias: tripulantes Shuttle/Mir/ISS y voluntarios de reposo en cama de estudios distintos.",
    "sample_size": null,
    "environment": "bed_rest_analog",
    "limitations": [
      "La comparacion directa principal (Bocker 2026) mide area muscular de la pantorrilla con pQCT en 38 % y 66 % de la tibia; no mide cuadriceps ni muslo. Aplicarla al cuadriceps es una extrapolacion entre regiones.",
      "El reposo en cama comparado no tenia contramedidas; los viajeros espaciales hacian ejercicio casi diario. La diferencia de magnitud no puede atribuirse solo al entorno.",
      "Momentos de medicion distintos: R+1 tras vuelo frente a R+3 tras reposo en cama (limitacion principal declarada por los autores).",
      "Grupos con edades distintas (media 47,1 frente a 28,3 anos) y todos varones; no informa sobre mujeres.",
      "La equivalencia de unos 80 d de HDBR con 180 d de vuelo procede de un ajuste logaritmico sobre datos de dos estudios de reposo en cama (LTBR y RSL) para Ar.M Tib66; los propios autores indican que requiere confirmacion.",
      "Las comparaciones de muslo vuelo vs reposo en cama (LeBlanc; Akima) tienen n de 3 en vuelo, misiones antiguas o cortas y comparan con reposo en cama del mismo grupo investigador.",
      "Independencia limitada: EDOS-2, RSL y LTBR comparten investigadores (Rittweger, Vico); los datos RSL se analizaron antes en Bocker 2022.",
      "sample_size es null porque la afirmacion combina grupos de vuelo y de reposo en cama de distintas fuentes; el enum environment del contrato no tiene un valor para estudios comparativos vuelo vs analogo.",
      "La perdida en reposo en cama con inclinacion cefalica no incluye los estresores operativos y psicologicos del vuelo (HRP-47072, seccion IV.B.1)."
    ],
    "review_status": "pending"
  }
}
```

## Extraccion

### 1. Bocker et al. 2026, npj Microgravity 12:43 (fuente de partida; articulo original revisado por pares)

- Acceso: texto completo HTML leido (open access, CC BY 4.0). Suplementos no leidos.
- Diseno: analisis original de dos conjuntos de datos existentes; no es revision sistematica ni metaanalisis.
- Vuelo (EDOS-2, seguimiento de EDOS, Vico et al. 2017, J Bone Miner Res 32:2010-2021): 13 varones, 16 conjuntos de datos (3 repetidores), edad al lanzamiento 34-56 anos (media 47,1; DE 5,9). Mision mediana 178 d (rango 165-340). Mediciones: basal, R+1, R+14, R+90. Ejercicio "casi diario"; texto: "the exact exercise protocols were not available and could therefore not be integrated in this work". ARED no se menciona.
- Reposo en cama (RSL, grupo control): 11 varones, 60 d de HDBR a 6 grados sin contramedidas, edad 22-39 (media 28,3; DE 5,5). Mediciones: basal, R+3, R+14, R+90. Referencias del estudio RSL: Kramer et al. 2017 (Sci Rep 7:13177; PLoS One 12:e0169793). El grupo de intervencion RSL fue excluido.
- Metodo: pQCT (Stratec XCT2000 en GTC, XCT3000 en DLR). Variable muscular: area transversal muscular de la pantorrilla, Ar.M, en mm2, en Tib38 y Tib66. Los autores escriben que pQCT "is not the gold standard for determining Ar.M". No hay datos de muslo, femur ni cuadriceps en el articulo.
- Resultados musculares (cambio porcentual, media y DE, Tabla 1 / Fig. 3):
  - Vuelo, R+1: Tib38 -13,3 % (DE 5,0 %); Tib66 -12,5 % (DE 4,9 %). Recuperacion completa a R+90.
  - Reposo en cama, R+3: Tib38 -6,2 % (DE 4,0 %); Tib66 -7,9 % (DE 2,7 %). Sin diferencia significativa respecto al basal desde R+14.
  - Diferencia vuelo vs reposo en cama en R+1/R+3: Tib38 p < 0,001; Tib66 p = 0,01.
  - Resumen: "The muscle loss observed post-flight was approximately doubled compared to that was observed 2 months of bed rest".
- Variabilidad: test de Levene con varianzas desiguales solo para Ar.M Tib66 en R+1/R+3 (p = 0,03) y vBMC.tot Tib38 en R+90 (p = 0,01). Los autores concluyen que la variabilidad es similar entre condiciones.
- Fig. 5: ajuste de una funcion logaritmica a datos de reposo en cama de LTBR (Rittweger et al. 2005) y RSL para Ar.M Tib66. Texto: "muscle atrophy after 90 days of bed rest exceeds the spaceflight amount"; "strict 6° head-down tilt bed rest of approximately 80 days leads to a comparable loss of Ar.M" ... "as 180 days of microgravity exposure with physical training". Los autores indican que la equivalencia de 60-80 d necesita confirmacion.
- Hueso (contexto, no objeto de esta ficha): perdidas comparables salvo Tib98 (p = 0,01). Los autores afirman que la adaptacion esqueletica de la pierna tras 6 meses "could be effectively modeled by 60 days of bed rest without countermeasures".
- Limitaciones declaradas: momento de medicion distinto (R+1 vs R+3) como limitacion principal; pQCT no es el patron de referencia para Ar.M; diferencia de edad; falta de documentacion de entrenamiento, dieta y contramedidas en vuelo; posible error tipo I por multiples pruebas de varianza; repetidores sin garantia de recuperacion completa entre vuelos.
- Lectura critica para TwinNauta: la perdida muscular de pantorrilla tras vuelo con ejercicio fue mayor que tras 60 d de HDBR sin ejercicio. Eso contradice usar un ritmo diario de HDBR como si fuera el ritmo en vuelo sin ajuste. Ademas, medir 2 dias mas tarde tras HDBR puede subestimar la perdida de reposo en cama, de modo que la razon "aproximadamente el doble" tampoco debe adoptarse como factor de conversion.

### 2. NASA HRP-47072 (2015), Evidence Report muscular (documento oficial NASA; revision narrativa, no articulo revisado por pares)

- Acceso: PDF completo leido (texto extraido localmente).
- Seccion IV.A.5, p. 19-20, Figura 8: "Percent change in selected muscle groups during short-duration (8 d; n = 8) and long-duration (115 d; n = 3) spaceflight (Mir 18) compared with long-duration bed rest (119 d). Data are from (LeBlanc et al. 1995; LeBlanc et al. 1992) and the Shuttle/Mir Final Report." Texto: "There is a good correlation between long-duration bed rest and spaceflight of similar duration except that losses in the back muscles are much lower with bed rest." Los valores de la Figura 8 no se extrajeron (figura en imagen).
- Seccion IV.A.6, p. 21 (ISS, era iRED): Gopalakrishnan et al. 2010, 4 astronautas, 161-194 d: "Calf muscles were found to undergo greater decrements than thigh muscles (10-18% and 4-7% loss, respectively)". Fuerza isocinetica de extensores de rodilla: perdida del 10 % (medida aproximadamente una semana despues del aterrizaje). Cifras citadas por NASA; el articulo original no se leyo.
- Seccion IV.B.1, p. 28-29: bed rest es un modelo apropiado segun Adams et al. 2003, pero: "Absent from human analog studies are the unique operational and psychological stressors associated with spaceflight that exacerbate the physiological changes resulting from muscle unloading".
- Seccion IV.B.2, p. 29: reposo en cama sin contramedidas, cuadriceps: ~6 % a 14 d y 16-18 % (extensores de rodilla) a 17 semanas (LeBlanc et al. 1992); -10 % (varones) y -17 % (mujeres) a 29 d, -18 % (varones, 89 d) y -21 % (mujeres, 57 d) (Alkner y Tesch 2004a; Trappe et al. 2007b). Cifras citadas por NASA, no extraidas de los articulos originales.
- Observacion (inferencia del investigador, no comparacion publicada): la perdida de muslo de 4-7 % en ~6 meses de ISS con ejercicio es menor que la de cuadriceps en 89 d de reposo en cama sin ejercicio (-18 %). Son estudios, metodos y contramedidas distintos; no es una comparacion directa y no permite calcular un factor de traslado.

### 3. English et al. 2020, npj Microgravity 6:21 (articulo original, vuelo)

- Acceso: texto HTML leido parcialmente (primeros 100 000 caracteres); Tabla 1 no leida.
- 26 tripulantes ISS (~6 meses): SPRINT n = 9 (8 H / 1 M), control n = 17 (14 H / 3 M); incrementos 26S-50S (2011-2017).
- No mide volumen ni area de cuadriceps; mide masa magra de pierna por DXA: sin cambio significativo tras el vuelo (efecto tiempo P = 0,40; grupo x tiempo P = 0,88). Torque extensor de rodilla: -5,8 % (ambos grupos).
- El articulo afirma que en reposo en cama el protocolo SPRINT fue "largely effective to prevent multisystem physiologic deconditioning", pero no presenta una comparacion numerica vuelo vs reposo en cama de la misma variable.
- Limitaciones declaradas: autoasignacion a grupos, n pequeno (riesgo de error tipo II), grupo control con prescripcion cambiante.
- Relevancia: muestra que el resultado en vuelo depende del ejercicio realizado; la variable (masa magra DXA) no equivale a area transversal del cuadriceps.

### 4. Akima et al. 2000, MSSE 32(10):1743-1747 (articulo original; solo resumen)

- Acceso: solo resumen parafraseado por el registro BISp; texto completo de pago (HTTP 402). DOI no confirmado.
- 3 astronautas, vuelos de 9, 15 y 16 d; MRI de muslo y pierna. Segun el resumen, la atrofia tras al menos dos semanas en vuelo parecio mayor que tras 20 d de reposo en cama. Cifras exactas por musculo: null (no leidas).
- Limitacion: vuelos cortos, n = 3, comparacion con reposo en cama del mismo grupo investigador.

### 5. Murgia et al. 2022, PNAS Nexus 1(3):pgac086 (articulo original; proteomica)

- Acceso: texto completo HTML leido parcialmente.
- Reposo en cama 10 d (n = 10, biopsia de vasto lateral) frente a 2 astronautas ISS ~6 meses (biopsias descritas como soleo). Proteinas de adhesion focal disminuyeron en ambas condiciones; el proteoma mitocondrial cayo de forma marcada en vuelo y solo de forma sutil en reposo en cama.
- Relevancia: senal de que el mecanismo no es identico, pero confunde musculo (vasto lateral vs soleo), duracion (10 d vs 6 meses) y n = 2. No mide tamano muscular.

### Transformaciones aplicadas

Ninguna. Los valores se copian como aparecen (porcentaje de cambio respecto al basal, media y DE cuando se indica). No se calcularon tasas diarias ni factores de conversion.

## Contraevidencia e independencia

Contraevidencia y matices:
- A favor de la transferibilidad: HRP-47072 describe "a good correlation" entre reposo en cama largo (119 d) y vuelo Mir de duracion similar para musculos de la pierna, con excepcion de la espalda. Bocker 2026 concluye que el reposo en cama es "a valuable analog" y que la variabilidad es similar.
- En contra o matizando: Bocker 2026 encuentra una perdida de pantorrilla tras vuelo aproximadamente doble que tras 60 d de reposo en cama, con diferencias estadisticamente significativas. Akima 2000 sugiere un ritmo mayor en vuelos cortos. En ISS con ejercicio, la perdida de muslo citada (4-7 %) es menor que la de reposo en cama largo sin ejercicio, lo que indica que en vuelo de larga duracion el ejercicio domina la magnitud. Murgia 2022 muestra diferencias moleculares (mitocondria).
- Region: tanto en reposo en cama como en vuelo la pantorrilla (soleo/gastrocnemio) pierde mas que el cuadriceps (HRP-47072, p. 21 y p. 29). Una relacion vuelo/reposo medida en pantorrilla no se puede trasladar al cuadriceps.
- No se encontro una revision sistematica que compare cuantitativamente la atrofia de cuadriceps en vuelo frente a reposo en cama. Padilha et al. 2026 (J Cachexia Sarcopenia Muscle, doi:10.1002/jcsm.70259) es un metaanalisis sobre el efecto del ejercicio en desuso; segun fragmentos de busqueda, el ejercicio preserva masa muscular en reposo en cama y en vuelo pero sin beneficio consistente en fuerza en vuelo. Texto no leido (HTTP 403); no se usa como fuente del claim.

Independencia:
- Bocker 2026: EDOS-2 (Vico como coautora de EDOS), RSL y LTBR (Rittweger como coautor) comparten investigadores; los datos RSL se analizaron antes en Bocker et al. 2022 (Front Physiol 12:743876). La Fig. 5 combina dos estudios de reposo en cama del mismo entorno investigador. No hay validacion externa de la equivalencia 80 d / 180 d.
- Repetidores de vuelo en Bocker 2026: 3 personas aportan dos conjuntos de datos cada una; no son observaciones independientes.
- No pudo comprobarse si participantes de EDOS-2 coinciden con los de EDOS (Vico 2017).
- LeBlanc (bed rest 1992/1995 y Mir) y Akima (vuelo y reposo en cama de 20 d) comparan con reposo en cama de su propio grupo y metodo: la coherencia de metodo es una ventaja, pero no es replicacion independiente.
- Relevante para TwinNauta, sin verificar: segun resultados de busqueda, Scott et al. 2020 (Crit Care Explor; fuente de `claim_bedrest_quadriceps_csa_rate`) es un analisis preespecificado del ensayo de 70 d de reposo en cama de NASA; el estudio SPRINT de reposo en cama (`claim_sprint_knee_extension_torque`) parece proceder de la misma campana. Si se confirma, la tasa de area y el torque del escenario no son evidencia independiente entre si. El mismo fragmento indica que el recto femoral no cambio en ese estudio; no verificado.

## Comparacion con NASA

- NASA HRP-47072 (2015) ya usa el reposo en cama como analogo y documenta su limite: sin estresores operativos ni psicologicos del vuelo, y diferencias por region (espalda). TwinNauta no aporta una nueva comparacion; solo puede mostrar la limitacion.
- HRR MA-201 (estado: Open; publicado 05/13/25) indica que los estudios en analogo como el reposo en cama "typically have not evaluated the effects on performance of mission-specific tasks" y que usan prescripciones idealizadas y equipos no configurados para vuelo. El cierre previsto combina datos de vuelo, analogos y estudios en tierra. Es una brecha reconocida por NASA sobre contramedidas, relacionada pero no identica a la transferibilidad de la atrofia.
- No se reviso Bone-301, HDTP, IMM ni otras herramientas en esta ficha; no se infiere que NASA carezca de modelos de traslado reposo-vuelo.

## Conclusion

Modificar y mantener como limitacion, con alcance acotado:

- Mantener: el reposo en cama con inclinacion cefalica es un analogo aceptado de la direccion de la perdida muscular de la pierna, y NASA lo usa como tal.
- Modificar: no puede afirmarse que la tasa de cuadriceps de reposo en cama sea trasladable a vuelo de larga duracion. La evidencia directa reciente (Bocker 2026) es de pantorrilla con pQCT, muestra magnitudes distintas y confunde entorno con ejercicio, edad y momento de medicion. Las comparaciones de muslo son antiguas, con n de 3 en vuelo y del mismo grupo.
- Implicacion para TwinNauta: el escenario debe etiquetarse como "trayectoria de referencia de analogo terrestre (reposo en cama con o sin ejercicio, segun la fuente)", sin presentarse como prediccion para un astronauta en vuelo. No usar la razon "aproximadamente el doble" ni la equivalencia "80 d ~ 180 d" como factor de conversion: son resultados de pantorrilla, con limitaciones declaradas por los autores y sin validacion externa.

## No verificado y siguiente contraste

No verificado:
- Texto completo de LeBlanc et al. 2000 (J Appl Physiol 89:2158-2164, doi:10.1152/jappl.2000.89.6.2158; HTTP 403) y valores numericos de la Figura 8 de HRP-47072 (Mir-18 vs 119 d de reposo en cama, cuadriceps).
- Texto completo de Akima 2000 y de Gopalakrishnan et al. 2010 (Aviat Space Environ Med 81:91-102); las cifras de muslo ISS (4-7 %) proceden de la cita de NASA.
- Tabla 1 y suplementos de Bocker 2026 y de English 2020.
- Cohortes compartidas entre Scott 2020 (CCE), SPRINT de reposo en cama y Ploutz-Snyder 2018; posible solapamiento EDOS / EDOS-2.
- Texto de Padilha 2026 y de Trappe et al. 2023 (J Appl Physiol, doi:10.1152/japplphysiol.00412.2023; analisis de reposo en cama por sexo, HTTP 403).

Siguiente contraste:
1. Leer LeBlanc 2000 y la Figura 8 de HRP-47072 para obtener los cambios de cuadriceps en Mir frente a 119 d de reposo en cama con metodo comun.
2. Buscar datos de cuadriceps por MRI en vuelos ISS con ARED (p. ej. estudios posteriores a 2010, NTRS, OSDR/LSDA) y compararlos con el brazo control y el brazo SPRINT del reposo en cama de 70 d, separando ejercicio y entorno.
3. Confirmar el origen de cohorte de Scott 2020 y SPRINT 2024 para documentar la dependencia en `claim_bedrest_quadriceps_csa_rate` y `claim_sprint_knee_extension_torque`.
4. Revision de Medicina sobre la etiqueta de limitacion que mostrara el frontend.

## Registro de busqueda

Fecha de todas las consultas: 2026-11-14.

- https://www.nature.com/articles/s41526-026-00611-2 (redirecciones idp.nature.com; leido via `?error=cookies_not_supported`, texto completo en dos partes, offset 0 y 100000)
- WebSearch: "quadriceps thigh muscle volume MRI spaceflight versus bed rest comparison same methods astronauts"
- https://journals.physiology.org/doi/full/10.1152/jappl.2000.89.6.2158 (HTTP 403)
- https://pubmed.ncbi.nlm.nih.gov/11090563/ (bloqueado por cookies)
- WebSearch: LeBlanc 2000 "Muscle volume, MRI relaxation times (T2), and body composition after spaceflight" abstract
- https://humanresearchroadmap.nasa.gov/Evidence/reports/Muscle.pdf (PDF descargado; texto extraido con pdftotext; leidas p. 19-21 y 28-30)
- https://doi.org/10.1097/CCE.0000000000000269 (redireccion a journals.lww.com; no leido)
- WebSearch: "Critical Care Explorations" 2020 bed rest muscle cross-sectional area NASA 70-day (solo fragmentos)
- WebSearch: SPRINT ISS astronauts thigh muscle volume MRI compared with 70-day bed rest analog
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7434884 (verificacion reCAPTCHA; no leido)
- https://www.nature.com/articles/s41526-020-00111-x (leido via `?error=cookies_not_supported`, primeros 100 000 caracteres)
- WebSearch: systematic review meta-analysis muscle atrophy rate spaceflight versus head-down tilt bed rest quadriceps
- https://onlinelibrary.wiley.com/doi/10.1002/jcsm.70259 (HTTP 403)
- WebSearch: Padilha 2026 meta-analysis spaceflight subgroup (solo fragmentos)
- https://journals.physiology.org/doi/full/10.1152/japplphysiol.00412.2023 (HTTP 403)
- WebSearch: Trappe 2023 "Microgravity-induced skeletal muscle atrophy in women and men" (solo fragmentos)
- https://journals.lww.com/acsm-msse/fulltext/2000/10000/effect_of_short_duration_spaceflight_on_thigh_and.13.aspx (HTTP 402)
- https://www.researchgate.net/publication/12284107_Effect_of_short-duration_spaceflight_on_thigh_and_leg_muscle_volume (HTTP 403)
- https://scilit.com/publications/a705b37f449752f6485465ef24ea94a9 (HTTP 403)
- https://www.bisp-surf.de/Record/PU199912408974 (registro bibliografico de Akima 2000, resumen parafraseado)
- WebSearch: Gopalakrishnan 2010 "Muscle volume, strength, endurance, and exercise loads during 6-month missions in space" (solo fragmentos)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9896895/ (Murgia 2022, leido parcialmente)
- https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833 (MA-201)

# claim_bedrest_quadriceps_csa_rate: Tasa de cambio del area transversal (CSA) del cuadriceps durante 70 dias de reposo en cama con inclinacion cefalica de 6 grados (cohorte NASA, n = 9 controles sedentarios)

- Estado: pending
- Investigado: 2026-11-14 por evidence-researcher
- Revision de Medicina: pendiente

## Pregunta e hipotesis

**Pregunta.** Que tasa diaria de cambio del area transversal del cuadriceps publica el estudio NASA de 70 dias de reposo en cama (Scott et al. 2020), como se midio, durante que periodo y que significa exactamente la cifra?

**Hipotesis de partida (auditoria del equipo).** El suplemento (eTable 3) informa -0,11 % del basal por dia para el cuadriceps.

**Que la refutaria o modificaria.**
- Que la cifra no aparezca en eTable 3, que corresponda a otro musculo o a otra magnitud (volumen, cm2/dia, cm2/semana).
- Que el basal de referencia no sea el valor previo al reposo, o que la tasa corresponda a la fase de recuperacion.
- Que el DOI no corresponda a un estudio de reposo en cama de NASA.
- Que el modelo lineal no sea el que mejor ajusta para el cuadriceps, lo cual limitaria la lectura "tasa constante por dia".

## Datos para el contrato

```json
{
  "sources": [
    {
      "id": "src_scott_2020_cce_bedrest",
      "title": "Disuse-Induced Muscle Loss and Rehabilitation: The National Aeronautics and Space Administration Bed Rest Study. Scott JM, Downs M, Buxton R, Goetchius E, Crowell B, Ploutz-Snyder R, Hackney KJ, Ryder J, English K, Ploutz-Snyder LL. Crit Care Explor. 2020;2(12):e0269. PMID 33251515; PMCID PMC7688251; NCT00891449",
      "url": "https://doi.org/10.1097/CCE.0000000000000269",
      "locator": "Texto principal (PMC7688251): Abstract, Methods, Results (Fig. 1A cuadriceps), Discussion. Suplemento sdc1 (Online Data Supplement): Supplemental Methods pp. 2-4; eTable 2 p. 7; eTable 3 'Muscle Change per Day' p. 8, fila 'Quadriceps', columna 'Muscle Loss, relative to BR-6 (%)' = -0.11",
      "review_status": "pending",
      "version": "Version publicada 2020-11-24 (vol. 2, num. 12, e0269); suplemento descargado 2026-11-14 desde cdn-links.lww.com, 9 paginas, 531.4 KB",
      "license": null
    },
    {
      "id": "src_scott_2020_cce_bedrest_sdc1",
      "title": "Online Data Supplement. Disuse-Induced Muscle Loss and Rehabilitation: The NASA Bed Rest Study (Scott et al. 2020)",
      "url": "https://cdn-links.lww.com/permalink/ccx/a/ccx_1_1_2020_10_22_scott_20-00318_sdc1.pdf",
      "locator": "p. 8, eTable 3 'Muscle Change per Day', Upper Leg > Quadriceps; columnas 'Muscle Loss, relative to BR-6 (%)' y 'Muscle Gain, relative to BR 70 (%)'",
      "review_status": "pending",
      "version": "Archivo sdc1 consultado 2026-11-14 (531.4 KB); sin checksum registrado",
      "license": null
    }
  ],
  "claim": {
    "id": "claim_bedrest_quadriceps_csa_rate",
    "statement": "En 9 adultos sanos (8 hombres, 1 mujer) sometidos a 70 dias de reposo en cama con inclinacion cefalica de 6 grados sin ejercicio, el area transversal del cuadriceps agrupado (RF, VL, vasto medial y vasto intermedio), medida por RM axial T2 a 3T y promediada entre cortes, disminuyo segun un modelo lineal de efectos mixtos con una tasa publicada de -0.11 % por dia relativa al valor previo al reposo (BR-6). La tabla no informa dispersion, intervalo de confianza ni el procedimiento de conversion a % por dia.",
    "kind": "observed_result",
    "source_ids": ["src_scott_2020_cce_bedrest", "src_scott_2020_cce_bedrest_sdc1"],
    "population": "Adultos sanos (8 hombres, 1 mujer; edad 36 +/- 6 anos; masa 79 +/- 9 kg), grupo control sedentario del ensayo aleatorizado NASA de 70 dias de reposo en cama (NCT00891449); seleccionados con VO2pico > 30 ml/kg/min y extension de rodilla > 2.0 Nm/kg",
    "sample_size": 9,
    "environment": "bed_rest_analog",
    "limitations": [
      "Reposo en cama con inclinacion cefalica de 6 grados en Tierra, no vuelo espacial; la transferencia a microgravedad no esta establecida por este estudio.",
      "eTable 3 informa una tasa puntual sin dispersion, intervalo de confianza ni p; no hay base publicada para construir bandas de incertidumbre a partir de esta tabla.",
      "El suplemento no describe como se paso de la pendiente del modelo (x = semanas de reposo) a % del basal por dia; la conversion no puede reproducirse con lo publicado.",
      "Para el cuadriceps el R2 del modelo lineal es .015 y el modelo de decaimiento exponencial tiene AIC/BIC menores (747.37/747.97 frente a 752.73/753.12, eTable 2); la eleccion del modelo lineal es de los autores.",
      "CSA promediada entre cortes (media 15 cortes por punto en pierna superior, rango 10-20), no volumen muscular ni masa; no convertir a volumen.",
      "Dominio temporal: mediciones en BR-6 y BR 3 a BR 69; no extrapolar fuera de 70 dias ni a otras regiones musculares.",
      "n = 9, un solo centro; la misma cohorte se reutiliza en otras publicaciones del ensayo (no son replicacion independiente).",
      "Medias de grupo: no representan la trayectoria de un individuo."
    ],
    "review_status": "pending"
  }
}
```

## Extraccion

### Identidad del DOI (comprobada)

- El DOI 10.1097/CCE.0000000000000269 resuelve a journals.lww.com (devolvio HTTP 402, acceso de pago desde esa ruta). El convertidor de identificadores de PMC lo asocia a PMCID PMC7688251 y PMID 33251515; el texto completo se leyo en PMC.
- Titulo: "Disuse-Induced Muscle Loss and Rehabilitation: The National Aeronautics and Space Administration Bed Rest Study". Crit Care Explor. 2020;2(12):e0269, publicado en linea el 2020-11-24.
- Vinculo con NASA: el suplemento describe reclutamiento por el NASA Johnson Space Center Test Subject Facility y ejecucion en la NASA Flight Analogs Research Unit; una autora (Downs) es empleada de NASA; financiacion parcial de NASA Human Research Program y NSBRI; ensayo registrado NCT00891449. Se trata de un subestudio preespecificado del ensayo NASA de 70 dias (referencia de diseno: Cromwell et al., Med Sci Sports Exerc 2018).
- La revista (cuidados criticos) se explica por el enfoque del articulo: usar el reposo en cama como modelo de perdida muscular por desuso y rehabilitacion aplicable a pacientes hospitalizados. Es un articulo de revista revisado por pares; el tipo de articulo no figura en la pagina de PMC.

### Poblacion, entorno y protocolo

- n = 9 asignados aleatoriamente al reposo sedentario (8 hombres, 1 mujer), edad 36 +/- 6 anos, masa 79 +/- 9 kg (texto principal, segun PMC). Adherencia al reposo 100 %.
- Fases (Supplemental Methods, p. 2): 13 dias ambulatorios previos; 70 dias en cama a 6 grados de inclinacion cefalica, monitorizacion 24 h; fase posterior ambulatoria con rehabilitacion de 11 dias (eTable 1). Estiramientos dos veces al dia y masaje cada dos dias durante el reposo.
- Criterios de entrada (p. 2): VO2pico > 30 ml/kg/min y extension de rodilla > 2.0 Nm/kg, descritos por los autores como el extremo inferior del rango del cuerpo de astronautas.
- Metodo (texto principal y p. 3): RM axial ponderada en T2 a 3T desde tobillo hasta cresta iliaca; trazado manual en ImageJ; CSA promediada entre cortes. Cuadriceps agrupado = recto femoral, vasto lateral, vasto medial y vasto intermedio (p. 3).
- Calendario de RM: BR-6 (basal); BR 3, 7, 11, 15, 22, 29, 36, 53, 69 (reposo); BR+3, +6, +10 (recuperacion).
- No se encontro en la pagina de PMC el numero de participantes con RM en cada punto ni datos faltantes por punto.
- No se encontro la CSA basal absoluta del cuadriceps (media y DE) en el texto leido.

### Modelo estadistico (Supplemental Methods, pp. 3-4)

- Stata SE v15.1. Para la fase de reposo: modelo lineal de efectos mixtos con "number of weeks of bedrest" como predictor fijo e intercepto aleatorio por sujeto; comparado con decaimiento exponencial de 3 parametros (errores estandar ajustados por conglomerado) y polinomios fraccionales (potencias -2 a 3), mediante AIC, BIC y R2.
- Despues, modelo lineal por tramos de dos pendientes (reposo y post-reposo) con nodo entre ambas fases e intercepto aleatorio.
- El suplemento no explica como las pendientes se expresan como "% por dia" relativo a BR-6.

### eTable 3 (suplemento, p. 8), copiada tal como aparece

Titulo: "eTable 3. Muscle Change per Day." Columnas: "Muscle Loss, relative to BR-6 (%)" y "Muscle Gain, relative to BR 70 (%)".

| Muscle | Muscle Loss, relative to BR-6 (%) | Muscle Gain, relative to BR 70 (%) |
| --- | --- | --- |
| Upper Leg | | |
| Quadriceps | -0.11 | 0.41 |
| Rectus Femoris | -0.03 | 0.24 |
| Vastus Lateralis | -0.11 | 0.39 |
| Vastii | -0.12 | 0.43 |
| Hamstrings | -0.16 | 0.60 |
| Adductors | -0.07 | 0.53 |
| Lower Leg | | |
| MG | -0.29 | 1.54 |
| LG | -0.22 | 1.15 |
| Soleus | -0.33 | 1.54 |

Nota al pie: "Abbreviations: BR, bed rest; MG, medial gastrocnemius; LG, lateral gastrocnemius." No hay dispersion, IC, p ni n por fila.

**Lectura de la cifra auditada.** La cifra -0.11 existe y esta en la fila Quadriceps, primera columna. Segun titulo y encabezado significa: cambio por dia de la CSA del cuadriceps agrupado durante el reposo, expresado en % relativo al valor de BR-6 (basal previo al reposo). La auditoria ("-0,11 % del basal por dia") coincide con la tabla. Observaciones:
- Es una tasa de grupo derivada de un modelo, no una medicion individual ni una media de cambios individuales.
- El texto principal no repite la cifra del cuadriceps: remite a eTable 3. En el Abstract solo aparece la del soleo (-0.33%/d) y en la Discussion tasas aproximadas de "~0.1% and ~0.3% per day" para pierna superior e inferior.
- La segunda columna (0.41 para el cuadriceps) es recuperacion por dia relativa a "BR 70" durante la rehabilitacion; no se debe aplicar durante el vuelo. El encabezado dice BR 70 mientras que la ultima RM en reposo fue BR 69; la diferencia no se explica.
- El recto femoral no cambio de forma significativa durante el reposo segun el Abstract; su -0.03 no debe tratarse como perdida demostrada.
- Otro resultado del texto: tras 11 dias de rehabilitacion el cuadriceps seguia por debajo del basal en -3.74 cm2 (IC 95 % -7.36 a -0.12; p = 0.04; Fig. 1A). Es un deficit post-rehabilitacion en cm2, no una tasa.

### eTable 2 (suplemento, p. 7), filas pertinentes

"eTable 2. Model fit of linear and non-linear muscle declines during bedrest."

| Quadriceps | Multiple R2 | AIC | BIC |
| --- | --- | --- | --- |
| Linear Model | .015 | 752.73 | 753.12 |
| Exponential Decay | .016 | 747.37 | 747.97 |
| Best Fractional Polynomial | .015 | 749.37 | 750.16 |

Observaciones (del equipo investigador, no de los autores): para el cuadriceps, AIC y BIC favorecen numericamente al decaimiento exponencial sobre el lineal; los autores concluyen que el lineal "fit the data well" (p. 4). Los R2 son muy bajos en todos los musculos; no se explica si es R2 marginal (solo efectos fijos). En la fila Soleus/Linear Model el BIC (518.67) es menor que el AIC (519.28), lo que no es esperable con mas de 7 observaciones; posible errata no comprobada.

### Transformaciones aplicadas

Ninguna sobre los valores registrados. Solo como comprobacion de orden de magnitud (calculo del equipo, no publicado): -0.11 %/dia sostenido durante 69 dias equivale aproximadamente a -7.6 % respecto a BR-6, suponiendo linealidad. No usar este numero como resultado del articulo.

## Contraevidencia e independencia

- **Misma cohorte, no independiente.** El ensayo NASA de 70 dias (NCT00891449) produjo otras publicaciones con los mismos 9 controles: Ploutz-Snyder et al., Med Sci Sports Exerc 2018 (doi 10.1249/mss.0000000000001618; 34 participantes en cuatro grupos, controles n = 9) y, segun indices consultados, Trappe et al., J Appl Physiol 2024 (SPRINT, 10.1152/japplphysiol.00489.2023), fuente de la afirmacion `claim_sprint_knee_extension_torque`. Ninguna de ellas valida externamente la tasa de Scott 2020. No se leyeron sus valores de cuadriceps.
- **Estudio independiente con magnitud mayor.** Alkner y Tesch, Eur J Appl Physiol 2004 (doi 10.1007/s00421-004-1172-8): 17 hombres, 90 dias de reposo a 6 grados; grupo sin ejercicio n = 9; volumen del extensor de rodilla por RM disminuyo 18 % (P < 0.05) antes/despues (solo resumen leido). Si se supusiera linealidad seria del orden de -0.2 %/dia (calculo del equipo), aproximadamente el doble que -0.11 %/dia. Diferencias que impiden comparar directamente: volumen frente a CSA promediada, 90 frente a 70 dias, otra cohorte y otra instalacion, solo hombres. Indica que la tasa de Scott 2020 no debe presentarse como valor universal del reposo en cama. Scott et al. citan a Alkner y Tesch (ref. 12) en la Discussion como coherente en el patron (flexores plantares mas susceptibles que extensores de rodilla).
- **Ajuste del modelo.** La propia eTable 2 muestra que la forma lineal no es la de menor AIC para el cuadriceps; la tasa constante por dia es una simplificacion de los autores.
- **Correcciones.** No se encontro fe de erratas para este articulo en las paginas consultadas; no se busco de forma exhaustiva.

## Comparacion con NASA

- El estudio en si es de NASA (Flight Analogs Research Unit, HRP). No es una herramienta operativa ni un modelo validado para vuelo; es un resultado de analogo terrestre.
- HRR MA-201 (estado: abierto): "Determine the required exercise countermeasure or countermeasures (i.e., modality or modalities, prescription, monitoring) to protect mission-specific task performance and crew health outcomes." La descripcion indica que los estudios sobre eficacia de contramedidas en vuelo son limitados y que el reposo en cama se ha usado para estudiarlas, a menudo con prescripciones idealizadas. La tasa de este estudio describe la perdida sin contramedida; no responde a la brecha sobre que ejercicio prescribir.
- No se verifico si modelos de NASA (Digital Astronaut, IMM) usan esta tasa como parametro.

## Conclusion

**Mantener, con modificacion de la redaccion.** La cifra -0.11 % por dia existe, se localiza en eTable 3 (suplemento sdc1, p. 8, fila Quadriceps, columna "Muscle Loss, relative to BR-6 (%)") y significa cambio diario de la CSA media del cuadriceps agrupado, por RM, relativo al valor previo al reposo, durante 70 dias de reposo a 6 grados, en 9 controles sanos de un estudio NASA. El DOI corresponde efectivamente a ese estudio.

Uso aceptable propuesto (pendiente de Medicina): parametro de una trayectoria ilustrativa de `quadriceps_csa_relative` en el escenario de reposo en cama, con dominio 0-70 dias, etiquetado como resultado agregado publicado en analogo terrestre. No aceptable: aplicarlo como tasa de vuelo sin la limitacion de transferencia, construir bandas de incertidumbre a partir de esta tabla, aplicarlo a un individuo, o usar la columna de recuperacion durante la mision.

## No verificado y siguiente contraste

- Procedimiento exacto de conversion de la pendiente (por semana, en cm2) a % de BR-6 por dia; pendiente y su error estandar en unidades originales. Siguiente paso: buscar en Fig. 1A o contactar autores; si no esta, declararlo en el modelo.
- CSA basal absoluta del cuadriceps y numero de participantes con RM en cada punto (no encontrados en el texto leido).
- Licencia del articulo: PMC indica que el trabajo de empleados federales no esta sujeto a copyright de EE. UU. y muestra un aviso de copyright; no se confirmo la licencia Creative Commons especifica. `license` queda null.
- Valores de cuadriceps de los controles en Ploutz-Snyder 2018 y Trappe 2024 (misma cohorte) para comprobar coherencia interna.
- Texto completo de Alkner y Tesch 2004 (solo se leyo el resumen) y otros reposos largos independientes (p. ej., campanas europeas de 60 dias) para un rango de tasas.
- Transferencia a vuelo: depende de `claim_bedrest_spaceflight_transfer`.

## Registro de busqueda

Todas las consultas el 2026-11-14.

- https://doi.org/10.1097/CCE.0000000000000269 (redireccion 302 a journals.lww.com)
- https://journals.lww.com/10.1097/CCE.0000000000000269 (HTTP 402, no accesible)
- Busqueda web: "10.1097/CCE.0000000000000269" (sin resultado directo)
- https://pmc.ncbi.nlm.nih.gov/tools/idconv/api/v1/articles/?ids=10.1097/CCE.0000000000000269&format=json (PMCID PMC7688251, PMID 33251515)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7688251/ (texto completo, leido mediante extraccion; dos consultas)
- https://cdn-links.lww.com/permalink/ccx/a/ccx_1_1_2020_10_22_scott_20-00318_sdc1.pdf (PDF de 9 paginas, leido completo como imagen de pagina; eTable 2 p. 7, eTable 3 p. 8)
- Busqueda web: Ploutz-Snyder 2018 "Exercise training mitigates multisystem deconditioning during bed rest" quadriceps volume control group 70-day (resultados: researchexperts.utmb.edu, ntrs.nasa.gov/citations/20110018184, indices de terceros; no se leyo el texto completo)
- Busqueda web: Alkner Tesch 2004 90 days bed rest quadriceps muscle volume MRI
- https://link.springer.com/doi/10.1007/s00421-004-1172-8 (redireccion a login, no accesible)
- https://pubmed.ncbi.nlm.nih.gov/15338217/ (no cargo: requiere cookies)
- https://www.springermedicine.com/knee-extensor-and-plantar-flexor-muscle-size-and-function-follow/21064746 (resumen de Alkner y Tesch 2004)
- https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833 (MA-201)

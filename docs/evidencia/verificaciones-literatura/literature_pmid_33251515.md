# Verificacion de literatura: literature_pmid_33251515

Verificacion asistida por IA (Claude), 2026-11-15. No es revision medica ni aprobacion cientifica.

## Identificacion

- Titulo: Disuse-Induced Muscle Loss and Rehabilitation: The National Aeronautics and Space Administration Bed Rest Study.
- Autores: Scott JM, Downs M, Buxton R, Goetchius E, Crowell B, Ploutz-Snyder R, Hackney KJ, Ryder J, English K, Ploutz-Snyder LL.
- Revista: Critical Care Explorations 2020;2(12):e0269 (publicado en linea 2020-11-24).
- Identificadores: PMID 33251515; DOI 10.1097/CCE.0000000000000269; PMCID PMC7688251; ClinicalTrials.gov NCT00891449.
- Tipo segun PubMed: Journal Article.
- Ficha verificada: `backend/data/literature/generated/deepseek-corpus-v2-20261115/literature_pmid_33251515.json` (modelo openai_compatible:18ca5273336d/deepseek-v4-pro, prompt abstract-analysis-0.1).
- Metadatos bibliograficos: correctos. Coinciden titulo, autores, ano, revista, volumen, numero, pagina e identificadores (el corpus guarda el DOI en minusculas, equivalente).

## Fuentes leidas

Texto completo leido: si.

- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=33251515&retmode=xml
  - Alcance: Registro PubMed via API oficial E-utilities (mismo contenido que https://pubmed.ncbi.nlm.nih.gov/33251515/): metadatos y abstract completo.
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC7688251/fullTextXML
  - Alcance: Texto completo en acceso abierto (Europe PMC, XML JATS de PMC7688251): cuerpo, tablas y leyendas de figuras. No incluye material suplementario ni las figuras como imagen.

## Veredicto del resumen

**consistente.** El resumen dice lo mismo que el abstract y el texto completo, sin anadir cifras. Omite el tamano de muestra (n = 9; 8 hombres y 1 mujer) y que la rehabilitacion no tuvo grupo de comparacion; conviene anadirlo. Un item tiene el valor p cortado.

## Comprobacion por item

1. [finding] "Durante 70 días de reposo en cama sedentario, hubo una disminución lineal del área de sección transversal muscular en todos los músculos de la pierna excepto el recto femoral, que no cambió."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract; Resultados y Discusion. Matiz del texto completo: el ajuste lineal fue 'similar' al exponencial y al polinomico fraccional (eTable 2), es decir, no se demostro que el lineal sea mejor; n = 9.
2. [finding] "La tasa de atrofia más alta durante el reposo en cama ocurrió en el sóleo (-0,33%/d)."
   - Veredicto: **sustentado**
   - Nota y ubicacion: La cifra -0,33%/d figura en el abstract. El cuerpo del articulo remite a eTable 3 (suplemento no leido) y en la Discusion habla de tasas de ~0,1%/d en muslo y ~0,3%/d en pierna, y de las mayores tasas en isquiotibiales y soleo.
3. [finding] "Tras 11 días de rehabilitación, el cuádriceps permaneció significativamente reducido en comparación con los valores previos al reposo (-3,74 cm²; IC 95%, -7,36 a -0,12; p = 0,04)."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Resultados. Es la diferencia de area transversal (cm2) entre BR+10 y el basal BR-6.
4. [finding] "Tras 11 días de rehabilitación, los isquiotibiales permanecieron significativamente reducidos en comparación con los valores previos al reposo (-2,30 cm²; IC 95%, -4,07 a -0,54; p = 0,01)."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Resultados.
5. [finding] "Tras 11 días de rehabilitación, el gastrocnemio medial permaneció significativamente reducido en comparación con los valores previos al reposo (-0,62 cm²; IC 95%, -1,10 a -0,14; p = 0,01)."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Resultados.
6. [finding] "Tras 11 días de rehabilitación, el sóleo permaneció significativamente reducido en comparación con los valores previos al reposo (-1,85 cm²; IC 95%, -2,90 a -0,81; p)."
   - Veredicto: **parcial**
   - Nota y ubicacion: Las cifras son correctas, pero el valor p quedo cortado ('p'). En el original es p < 0,01 (abstract de PubMed y Resultados).
7. [finding] "El programa de rehabilitación de 11 días fue seguro y efectivo para iniciar una trayectoria rápida de recuperación muscular."
   - Veredicto: **parcial**
   - Nota y ubicacion: Es la conclusion literal de los autores. Limites: los 9 participantes recibieron la rehabilitacion (sin grupo de comparacion); 'seguro' significa que no hubo eventos adversos graves relacionados con la rehabilitacion en n = 9; a los 11 dias cuatro musculos seguian por debajo del basal.
8. [studied_intervention] "El programa de rehabilitación de 11 días consistió en ejercicio de baja intensidad y progresó a mayor duración de ejercicio aeróbico, ejercicios pliométricos y ejercicio de resistencia de mayor intensidad."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Metodos (inicio con caminata de baja intensidad, flexibilidad y equilibrio). El detalle del programa esta en eTable 1 (suplemento no leido).

## Correcciones propuestas

- Item 6, texto corregido: 'Tras 11 dias de rehabilitacion, el soleo permanecio significativamente reducido en comparacion con los valores previos al reposo (-1,85 cm2; IC 95%, -2,90 a -0,81; p < 0,01).'
- Item 7, texto propuesto: 'Segun los autores, el programa de rehabilitacion de 11 dias fue seguro (sin eventos adversos graves relacionados, n = 9) e inicio una recuperacion rapida; no hubo grupo de comparacion sin rehabilitacion y cuadriceps, isquiotibiales, gastrocnemio medial y soleo seguian por debajo del basal.'
- Resumen: anadir 'Se analizaron 9 participantes (8 hombres, 1 mujer; 36 +/- 6 anos) del brazo sedentario de un ensayo aleatorizado' y precisar que el recto femoral no cambio.
- El campo abstract guardado en el archivo generado esta truncado: se perdio el texto situado entre un signo '<' y el siguiente '>' (probable limpieza de etiquetas HTML). Restaurar el abstract desde PubMed antes de regenerar la ficha. Texto perdido: 'p < 0.01) remained significantly lower than baseline.'

## Datos del estudio

- Diseno: Analisis preespecificado (subestudio) del brazo sedentario de un ensayo aleatorizado unicentrico (estudio de reposo en cama de 70 dias de NASA, 2011-2014). Seguimiento longitudinal sin comparador para la rehabilitacion.
- Poblacion: Adultos sanos; criterio 24-55 anos; muestra analizada 36 +/- 6 anos, 79 +/- 9 kg, 8 hombres y 1 mujer.
- Tamano de muestra y grupos: n = 9; 13 momentos de MRI (1 antes, 9 durante, 3 despues); 11 588 imagenes cuantificadas.
- Entorno: Reposo en cama sedentario con monitorizacion 24 h (la Discusion lo describe como head-down tilt; el angulo no aparece en el cuerpo del texto).
- Exposicion y duracion: 70 dias de reposo sin ejercicio, seguidos de 11 dias de rehabilitacion multimodal progresiva.
- Desenlaces principales: Area transversal por MRI (promedio de cortes) de recto femoral, vasto lateral, cuadriceps, isquiotibiales, aductores, gastrocnemio medial y lateral y soleo; tasa de atrofia y de recuperacion; fuerza isocinetica de rodilla y su asociacion con el tamano (D de Somers 0,59 y 0,70).

## Limitaciones

- Declarada: participantes sanos; en pacientes hospitalizados la perdida podria ser mayor.
- Declarada: la MRI requiere equipo no disponible a pie de cama.
- Declarada: el contenido de agua muscular puede alterar el tamano medido (mitigado con 12 h sin ejercicio y 1 h en supino antes de la MRI).
- Declarada: se midio cantidad y no calidad muscular (posible infiltracion lipidica).
- Declarada: 11 dias de rehabilitacion pueden ser insuficientes.
- Observada por el verificador, no declarada: n = 9 con una sola mujer y rehabilitacion sin grupo de comparacion.

## Aplicabilidad y extrapolaciones no permitidas

Es una referencia longitudinal de area transversal por MRI en un analogo sin ejercicio. Un astronauta en mision larga si hace ejercicio y esta en microgravedad real. No se puede: usar -0,33%/d como prediccion individual en vuelo; tratar el area transversal como volumen; extender la linealidad mas alla de 70 dias (los autores suponen que habria meseta); inferir diferencias por sexo; presentar la rehabilitacion como eficaz frente a no rehabilitar.

## Lo que queda sin verificar

- Supplemental Digital Content (eMethods, eTable 1 a 3): tasas por musculo, angulo de inclinacion y detalle del programa. La cifra -0,33%/d solo se confirmo en el abstract.
- Figuras 1 y 2 (curvas por musculo).
- Publicaciones del ensayo principal (referencias 5 y 6 del articulo) no consultadas.

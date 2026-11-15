# Verificacion de literatura: literature_pmid_39920735

Verificacion asistida por IA (Claude), 2026-11-15. No es revision medica ni aprobacion cientifica.

## Identificacion

- Titulo: Resistance exercise training improves disuse-induced skeletal muscle atrophy in humans: a meta-analysis of randomized controlled trials.
- Autores: Guo X, Zhou Y, Li X, Mu J.
- Revista: BMC Musculoskeletal Disorders 2025;26(1):134 (publicado 2025-02-07).
- Identificadores: PMID 39920735; DOI 10.1186/s12891-025-08384-7; PMCID PMC11806896; PROSPERO CRD42023414999.
- Tipo segun PubMed: Meta-Analysis.
- Ficha verificada: `backend/data/literature/generated/deepseek-corpus-v2-20261115/literature_pmid_39920735.json` (modelo openai_compatible:18ca5273336d/deepseek-v4-pro, prompt abstract-analysis-0.2).
- Metadatos bibliograficos: correctos. Coinciden titulo, autores, ano, revista, volumen, numero, pagina e identificadores.

## Fuentes leidas

Texto completo leido: si.

- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=39920735&retmode=xml
  - Alcance: Registro PubMed via API oficial E-utilities (mismo contenido que https://pubmed.ncbi.nlm.nih.gov/39920735/): metadatos y abstract completo.
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11806896/fullTextXML
  - Alcance: Texto completo en acceso abierto (Europe PMC, XML JATS de PMC11806896): cuerpo, tablas y leyendas de figuras. No incluye material suplementario ni las figuras como imagen.

## Veredicto del resumen

**con_correcciones.** El resumen y el primer item escriben 'p<0,05' para el volumen del cuadriceps; ese valor no esta en el original, que da p < 0,001 (el abstract recibido estaba cortado justo ahi). 'Mejoro la funcion muscular' exagera: el metaanalisis compara grupos y muestra menor perdida con ejercicio. La recomendacion para vuelo espacial es de los autores, pero ninguno de los 11 ensayos fue en vuelo.

## Comprobacion por item

1. [finding] "RET preserve significativamente el volumen del cuádriceps durante el desuso (n=5, MD=252,56, IC 95%=151,92–353,21, p<0,05)."
   - Veredicto: **parcial**
   - Nota y ubicacion: DM e IC correctos (abstract; Tabla 3: 5 estudios, 37 vs 39 participantes, I2 = 54%), pero el valor p es < 0,001, no < 0,05. 'n = 5' son estudios, no participantes. Las unidades de la DM no se indican en el abstract y la leyenda de la Figura 3 dice 'muscle volume (cm2)', unidad que no corresponde a un volumen.
2. [finding] "RET mejoró la función muscular (pico de potencia, fuerza concéntrica, fuerza excéntrica, torque isométrico) durante inmovilización/desuso."
   - Veredicto: **parcial**
   - Nota y ubicacion: Las DM agrupadas favorecen al ejercicio frente al control (atenuan la perdida); no demuestran mejora respecto al basal. Varios desenlaces dependen de un solo estudio con dos momentos de medida (potencia pico y fuerzas concentrica y excentrica de pantorrilla: 16 vs 18). El numero de estudios del abstract no coincide con la Tabla 3 (p. ej. MVC de cuadriceps 4 vs 3; MVC de pantorrilla 3 vs 2). Heterogeneidad alta en torque de extension de rodilla (I2 = 79%) y potencia de cuadriceps (I2 = 93%).
3. [implication] "RET debe recomendarse para mantener la salud muscular y neuromuscular en vuelos espaciales, reposo en cama e inmovilización/desuso."
   - Veredicto: **parcial**
   - Nota y ubicacion: Es la recomendacion literal de los autores (Conclusiones), no un resultado. Los 11 ensayos son de reposo en cama con inclinacion de -6 grados (8) o suspension unilateral de miembro inferior (3) segun la Tabla 2; ninguno es de vuelo espacial.
4. [implication] "Se necesitan más investigaciones en poblaciones diversas y condiciones de desuso, y más estudios de alta calidad para demostrar estos beneficios de forma concluyente."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Conclusiones del abstract y seccion Limitaciones.
5. [studied_intervention] "Entrenamiento de resistencia (RET) comparado con no ejercicio durante inmovilización/desuso."
   - Veredicto: **parcial**
   - Nota y ubicacion: Asi lo define el abstract, pero la Tabla 2 incluye como 'RET' intervenciones que no son entrenamiento de resistencia en sentido estricto: entrenamiento por intervalos al 40-80% del VO2pico (2 estudios) y saltos (1 estudio), ademas de volante de inercia, sentadillas, prensa e isometricos.

## Correcciones propuestas

- Item 1, texto corregido: 'El RET atenuo la perdida de volumen del cuadriceps durante el desuso frente al control sin ejercicio (5 estudios; DM = 252,56; IC 95%: 151,92 a 353,21; p < 0,001; I2 = 54%).'
- Resumen: cambiar 'p<0,05' por 'p < 0,001' y 'mejoro la funcion muscular' por 'atenuo la perdida de funcion muscular frente al control'.
- Item 2, texto propuesto: 'Frente al control, el RET atenuo la perdida de fuerza maxima voluntaria, potencia pico, fuerza concentrica y excentrica y torque isometrico de rodilla; varios de estos desenlaces provienen de 1 a 3 estudios.'
- Item 3 y resumen: anadir 'recomendacion de los autores; ninguno de los 11 ensayos se realizo en vuelo espacial (8 de reposo en cama, 3 de suspension unilateral)'.
- Resumen: 'Este metaanalisis' en lugar de 'Esta metanalisis'.
- El campo abstract guardado en el archivo generado esta truncado: se perdio el texto situado entre un signo '<' y el siguiente '>' (probable limpieza de etiquetas HTML). Restaurar el abstract desde PubMed antes de regenerar la ficha. Texto perdido: todos los resultados posteriores a 'p < 0.001). RET demonstrated...' hasta el final de Results.

## Datos del estudio

- Diseno: Metaanalisis de 11 ensayos controlados aleatorizados (PRISMA, PROSPERO; modelo de efectos aleatorios, diferencia de medias, RevMan 5.3); busqueda en Web of Science, PubMed, EBSCO y Cochrane hasta 2023-03-20.
- Poblacion: Adultos sanos; edades medias entre ~21 y ~42 anos; 8 estudios solo con hombres, 1 solo con mujeres (16) y 1 mixto (14 hombres, 7 mujeres), segun la Tabla 2.
- Tamano de muestra y grupos: 11 ensayos, cada uno con 5 a 12 participantes por brazo. Por desenlace: volumen de cuadriceps 37 vs 39; torque de extension de rodilla 67 vs 75; desenlaces de pantorrilla 16 vs 18 a 24 vs 27.
- Entorno: Analogos en tierra: reposo en cama con inclinacion de -6 grados (8 ensayos) y suspension unilateral de miembro inferior (3 ensayos). Sin vuelo espacial.
- Exposicion y duracion: Desuso de 14 a 90 dias; ejercicio de 2 a 7 veces por semana, de tipo e intensidad muy variables.
- Desenlaces principales: Volumen de cuadriceps por MRI; fuerza maxima voluntaria, potencia pico y fuerza concentrica y excentrica de cuadriceps y pantorrilla; torque isometrico de extension y flexion de rodilla.

## Limitaciones

- Declarada: variabilidad de programas de ejercicio y de modelos de desuso; no se puede identificar un protocolo optimo (tipo, intensidad, frecuencia, duracion).
- Declarada: solo adultos sanos; no generalizable a otras poblaciones.
- Declarada: faltan seguimientos a largo plazo.
- En Resultados (riesgo de sesgo): todos los estudios con alto riesgo en ocultacion de la asignacion y cegamiento.
- Observadas por el verificador: discrepancias entre el abstract y la Tabla 3 en el numero de estudios; unidades de la DM poco claras; una fila de la Tabla 2 (Bamman) indica 18 hombres con 8 + 8 participantes.

## Aplicabilidad y extrapolaciones no permitidas

Apoya la direccion del efecto: en analogos, ejercitar contra resistencia reduce la perdida de volumen y fuerza de cuadriceps y pantorrilla. No se puede: usar las DM como beneficio esperado para un astronauta (unidades inciertas, heterogeneidad, pocos estudios); derivar una dosis o protocolo; equiparar estas intervenciones con el equipo de ejercicio de una mision; afirmar que el efecto esta demostrado en vuelo espacial o en misiones largas (maximo 90 dias de reposo).

## Lo que queda sin verificar

- Figuras 2 a 7 (riesgo de sesgo y graficos de bosque): no se pudieron ver; por eso no se confirmaron unidades ni pesos por estudio.
- Los 11 ensayos primarios no se consultaron (clasificacion del modelo de desuso y del tipo de ejercicio tomada de la Tabla 2).
- Solapamiento de ensayos primarios con otras sintesis del corpus.

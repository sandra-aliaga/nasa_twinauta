# Verificacion de literatura: literature_pmid_38874988

Verificacion asistida por IA (Claude), 2026-11-15. No es revision medica ni aprobacion cientifica.

## Identificacion

- Titulo: The role of muscle disuse in muscular and cardiovascular fitness: A systematic review and meta-regression.
- Autores: Casuso RA, Huertas JR, Aragon-Vela J.
- Revista: European Journal of Sport Science 2024;24(6):812-823 (publicado en linea 2024-03-18).
- Identificadores: PMID 38874988; DOI 10.1002/ejsc.12093; PMCID PMC11235952; PROSPERO CRD42021254605.
- Tipo segun PubMed: Systematic Review; Meta-Analysis.
- Ficha verificada: `backend/data/literature/generated/deepseek-corpus-v2-20261115/literature_pmid_38874988.json` (modelo openai_compatible:18ca5273336d/deepseek-v4-pro, prompt abstract-analysis-0.2).
- Metadatos bibliograficos: correctos. Coinciden titulo, autores, ano, revista, volumen, numero, paginas e identificadores.

## Fuentes leidas

Texto completo leido: si.

- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=38874988&retmode=xml
  - Alcance: Registro PubMed via API oficial E-utilities (mismo contenido que https://pubmed.ncbi.nlm.nih.gov/38874988/): metadatos y abstract completo.
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11235952/fullTextXML
  - Alcance: Texto completo en acceso abierto (Europe PMC, XML JATS de PMC11235952): cuerpo, tablas y leyendas de figuras. No incluye material suplementario ni las figuras como imagen.

## Veredicto del resumen

**con_correcciones.** El resumen y los items estan en ingles; deben estar en espanol. En contenido: 'predicted' exagera una asociacion a nivel de estudio; las 'diferencias regionales' no fueron estadisticamente significativas en el texto completo; y la advertencia sobre personas mayores es una opinion de los autores que el propio analisis no respalda (sin diferencias entre mayores y jovenes).

## Comprobacion por item

1. [finding] "Muscle disuse significantly reduced VO2max (SMD: -0.93; 95% CI: -1.27 to -0.58) and MM (SMD: -0.34; 95% CI: -0.57 to -0.10)."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Tabla 1 (N = 14 muestras: VO2max -0,927 [-1,270; -0,583]; masa -0,337 [-0,571; -0,104]). El item omite 'en 14 estudios' por el truncamiento; el texto completo precisa 12 estudios con 14 muestras (n = 143), todos de reposo en cama salvo uno.
2. [finding] "Data from 47 studies showed a decline in strength (-0.88; 95% CI: -1.04 to -0.73) and mass (SMD: -0.47; 95% CI: -0.58 to -0.36)."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Resultados (47 estudios, 54 muestras, n = 570). Ambas cifras son diferencias de medias estandarizadas.
3. [finding] "MS loss was twice as high as MM loss, but differences existed between anatomical regions."
   - Veredicto: **parcial**
   - Nota y ubicacion: 'El doble' es la razon entre efectos estandarizados (-0,88 vs -0,47), no entre porcentajes. El analisis de subgrupos no hallo diferencias significativas entre regiones (fuerza p = 0,36; masa p = 0,20); lo que varia es la razon descriptiva fuerza/masa (pantorrilla 1,2; muslo 2,2; brazo 3,4) y las pendientes de la Figura 1.
4. [finding] "Meta-regression analysis revealed that initial MS was inversely associated with MS decline."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Tabla 2 (30 estudios de extension de rodilla en Nm: pendiente -0,294 [-0,447; -0,140], p = 0,0002; ajustada por duracion -0,199, p = 0,003). Es metarregresion a nivel de estudio sobre perdida absoluta; no es prediccion individual.
5. [implication] "A period of muscle disuse can have devastating consequences in old subjects with low muscular strength."
   - Veredicto: **parcial**
   - Nota y ubicacion: Frase literal del abstract, pero es una opinion. En el texto completo no hubo diferencia significativa entre mayores y jovenes en la perdida de fuerza (p = 0,381) ni de masa (p = 0,210), con solo 9 muestras de mayores.

## Correcciones propuestas

- Resumen, texto propuesto en espanol: 'Revision sistematica con metaanalisis y metarregresion de 51 estudios en adultos sanos sometidos a reposo en cama, inmovilizacion o descarga de una extremidad (5 a 84 dias). El desuso redujo el VO2max (DME -0,93; IC 95%: -1,27 a -0,58) y la masa muscular (DME -0,34; IC 95%: -0,57 a -0,10) en 14 muestras; en 47 estudios disminuyeron la fuerza (DME -0,88; IC 95%: -1,04 a -0,73) y la masa (DME -0,47; IC 95%: -0,58 a -0,36). El efecto estandarizado sobre la fuerza fue aproximadamente el doble que sobre la masa; la razon vario por region sin diferencias estadisticamente significativas. A nivel de estudio, una mayor fuerza inicial de extension de rodilla se asocio con una mayor perdida absoluta de fuerza. Los autores advierten, como opinion, sobre las consecuencias en personas mayores con poca fuerza.'
- Traducir los cinco items al espanol.
- Item 3, texto propuesto: 'El efecto estandarizado del desuso sobre la fuerza fue aproximadamente el doble que sobre la masa muscular; la razon fuerza/masa vario por region (pantorrilla 1,2; muslo 2,2; brazo 3,4), sin diferencias estadisticamente significativas entre regiones.'
- Item 4, texto propuesto: 'En la metarregresion (30 estudios de extension de rodilla), una mayor fuerza inicial se asocio con una mayor perdida de fuerza; es una asociacion entre estudios, no una prediccion individual.'
- Item 5: marcar como opinion de los autores y anadir que el analisis no hallo diferencias significativas entre mayores y jovenes.
- El campo abstract guardado en el archivo generado esta truncado: se perdio el texto situado entre un signo '<' y el siguiente '>' (probable limpieza de etiquetas HTML). Restaurar el abstract desde PubMed antes de regenerar la ficha. Texto perdido: '< 0.05. Data from the participants in 14 studies showed a decline in both VO2max'.

## Datos del estudio

- Diseno: Revision sistematica con metaanalisis de efectos aleatorios y metarregresion (PRISMA, PROSPERO); comparacion pre-post en grupos unicos o grupos control; busqueda en PubMed y Web of Science hasta 2022-12-31.
- Poblacion: Adultos sanos de 18 anos o mas; 43 estudios en jovenes y 9 en mayores (edad media > 60 anos). Sujetos no entrenados (VO2max inicial medio 42 y 25 mL/kg/min).
- Tamano de muestra y grupos: 51 estudios. VO2max y masa: 12 estudios, 14 muestras, n = 143. Fuerza y masa: 47 estudios, 54 muestras, n = 570.
- Entorno: Sintesis mixta en tierra: reposo en cama (28 estudios), inmovilizacion de extremidad (18) y descarga o suspension (5). Sin vuelo espacial.
- Exposicion y duracion: Desuso de 5 a 84 dias (media de 33 dias en reposo en cama y 14 en inmovilizacion, segun la Discusion).
- Desenlaces principales: Diferencias de medias estandarizadas de VO2max, fuerza y masa muscular (un marcador por estudio: volumen > area transversal > masa magra de pierna); perdida de torque de extension de rodilla (-39,9 Nm), volumen de cuadriceps (-138 mL) y area transversal (-4,9 cm2); moderadores: duracion y valores iniciales.

## Limitaciones

- Declarada: procedimientos distintos entre estudios generan heterogeneidad (abordada con subgrupos y duracion como moderador).
- Declarada: no se contacto a los autores de dos estudios con datos faltantes.
- En Resultados: prueba de Egger significativa para fuerza (p < 0,001) y masa (p = 0,005), compatible con sesgo de publicacion.
- En Discusion: 10 de 14 estudios de VO2max midieron masa magra con DXA, menos precisa que la MRI; los sujetos no eran entrenados; faltan pruebas de potencia.
- El marcador de masa mezcla volumen, area transversal y masa magra segun el estudio.

## Aplicabilidad y extrapolaciones no permitidas

Confirma la advertencia del corpus: las relaciones agregadas no sirven como conversion individual entre masa y fuerza. Apoya, a nivel cualitativo, que en desuso la fuerza y el VO2max caen mas que el tamano muscular. No se puede: usar la razon 2:1 como factor de conversion; afirmar que un astronauta mas fuerte perdera mas fuerza (asociacion entre estudios, perdida absoluta); trasladar las magnitudes al vuelo espacial o a una tripulacion que entrena; sostener con este articulo que las personas mayores pierden mas.

## Lo que queda sin verificar

- Tablas suplementarias S1 a S7 y figuras suplementarias (lista de estudios, calidad, subgrupos, metarregresion de volumen y area).
- Figuras 1 a 3 (solo leyendas).
- Solapamiento de estudios primarios con otras sintesis del corpus (cita a Preobrazenski 2023, PMID 36883219).

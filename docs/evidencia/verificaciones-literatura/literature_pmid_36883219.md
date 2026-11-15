# Verificacion de literatura: literature_pmid_36883219

Verificacion asistida por IA (Claude), 2026-11-15. No es revision medica ni aprobacion cientifica.

## Identificacion

- Titulo: Single-leg disuse decreases skeletal muscle strength, size, and power in uninjured adults: A systematic review and meta-analysis.
- Autores: Preobrazenski N, Seigel J, Halliday S, Janssen I, McGlory C.
- Revista: Journal of Cachexia, Sarcopenia and Muscle 2023;14(2):684-696 (publicado en linea 2023-03-07).
- Identificadores: PMID 36883219; DOI 10.1002/jcsm.13201; PMCID PMC10067508; prerregistro OSF osf.io/wdexu.
- Tipo segun PubMed: Systematic Review; Meta-Analysis.
- Ficha verificada: `backend/data/literature/generated/deepseek-corpus-v2-20261115/literature_pmid_36883219.json` (modelo openai_compatible:18ca5273336d/deepseek-v4-pro, prompt abstract-analysis-0.2).
- Metadatos bibliograficos: correctos. Coinciden titulo, autores, ano, revista, volumen, numero, paginas e identificadores.

## Fuentes leidas

Texto completo leido: si.

- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=36883219&retmode=xml
  - Alcance: Registro PubMed via API oficial E-utilities (mismo contenido que https://pubmed.ncbi.nlm.nih.gov/36883219/): metadatos y abstract completo.
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC10067508/fullTextXML
  - Alcance: Texto completo en acceso abierto (Europe PMC, XML JATS de PMC10067508): cuerpo, tablas y leyendas de figuras. No incluye material suplementario ni las figuras como imagen.

## Veredicto del resumen

**con_correcciones.** Las cifras son correctas. Hay que corregir: (1) la frase 'faltan estudios que incluyan a mujeres, hombres y adultos mayores de 40' traduce mal el original, que se refiere a estudios con mujeres y con datos por sexo; (2) 'g' debe identificarse como g de Hedges, un efecto estandarizado sin unidades y no un porcentaje; (3) el titulo menciona potencia, pero no hubo metaanalisis de potencia.

## Comprobacion por item

1. [finding] "La fuerza extensora de la pierna disminuyó tras el desuso de una sola pierna; el tamaño del efecto global fue -0.80 (IC 95%: -0.92 a -0.68), con una disminución que alcanzó su nadir después de 14 días."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Resultados (Figura 2: N = 35 estudios, n = 429). Es g de Hedges (g_av), no un porcentaje. 'Nadir beyond 14 days' es interpretacion de los subgrupos (>7 a <=14 dias -0,93; >14 dias -0,95; ANOVA entre subgrupos P = 0,05); la Discusion habla de meseta tras 14 dias. En porcentaje descriptivo: -23 +/- 6% a los 14 dias (N = 24 estudios).
2. [finding] "El tamaño del extensor de la pierna disminuyó tras el desuso de una sola pierna; el tamaño del efecto global fue -0.41 (IC 95%: -0.51 a -0.31), con una disminución que alcanzó su nadir después de 14 días."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Resultados (Figura 3: N = 20 estudios, n = 233). Para el tamano, las diferencias entre subgrupos de duracion no fueron significativas (ANOVA P = 0,46), asi que el 'nadir despues de 14 dias' es debil para esta variable. En porcentaje descriptivo: cuadriceps -8 +/- 3% a los 14 dias (N = 12).
3. [finding] "Después de 14 días de desuso, los modelos con yeso y con ortesis mostraron disminuciones similares en la fuerza extensora de la pierna (yeso: -0.94; ortesis: -0.90) y en el tamaño (yeso: -0.61; ortesis: -0.48)."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Estimaciones puntuales correctas (abstract; Resultados; ANOVA yeso vs ortesis P = 0,86 fuerza y P = 0,68 tamano). El item omite los intervalos: para tamano con ortesis el IC 95% (-1,04 a 0,07) incluye el cero, con 3 estudios y n = 41 por modelo; los autores piden cautela por ser exploratorio.
4. [implication] "Faltan estudios que incluyan a mujeres, hombres y adultos mayores de 40 años en la investigación sobre el desuso de una sola pierna."
   - Veredicto: **parcial**
   - Nota y ubicacion: Traduccion imprecisa. El original dice 'Studies including females and males and adults over 40 years of age are lacking'; el texto completo aclara que 31 de 86 estudios incluyeron mujeres, solo 1 presento datos desagregados por sexo y 11 incluyeron mayores de 40 anos. No faltan estudios en hombres.

## Correcciones propuestas

- Item 4 y resumen, texto corregido: 'Faltan estudios que incluyan mujeres y desagreguen los datos por sexo, y estudios en adultos mayores de 40 anos (31 de 86 estudios incluyeron mujeres, 1 presento datos por sexo y 11 incluyeron mayores de 40).'
- Resumen: sustituir '(g = -0.80)' y '(g = -0.41)' por '(g de Hedges -0,80; IC 95%: -0,92 a -0,68)' y '(g de Hedges -0,41; IC 95%: -0,51 a -0,31)', indicando que es un efecto estandarizado y no un porcentaje.
- Item 3, texto propuesto: 'Tras 14 dias, yeso y ortesis no difirieron en la disminucion de fuerza (yeso -0,94 [-1,30; -0,59]; ortesis -0,90 [-1,18; -0,63]) ni de tamano (yeso -0,61 [-0,87; -0,35]; ortesis -0,48 [-1,04; 0,07], intervalo que incluye el cero); analisis exploratorio con pocos estudios.'
- Resumen: anadir que no se hizo metaanalisis de potencia por datos insuficientes.

## Datos del estudio

- Diseno: Revision sistematica con metaanalisis de efectos aleatorios (PRISMA, prerregistrada); cambios pre-post dentro de grupos sin contramedida; subgrupos por duracion y por modelo.
- Poblacion: Adultos sin lesion, en su mayoria hombres jovenes; en el metaanalisis de fuerza, 68 de 429 participantes tenian 40 anos o mas y al menos 78 eran mujeres.
- Tamano de muestra y grupos: 86 estudios en la revision; 40 en metaanalisis (35 de fuerza, n = 429; 20 de tamano, n = 233).
- Entorno: Desuso de una sola pierna en tierra (yeso, ortesis o suspension unilateral). No es reposo en cama ni vuelo espacial.
- Exposicion y duracion: Duraciones agrupadas en <=7 dias, >7 a <=14 dias y >14 dias; la mas frecuente fue 14 dias.
- Desenlaces principales: g de Hedges de fuerza extensora (isometrica preferente) y de tamano extensor (volumen o area transversal de cuadriceps o vasto lateral por MRI o TC); porcentajes descriptivos; potencia solo en revision narrativa.

## Limitaciones

- Declarada: la formula d_av esta pensada para muestras independientes; no se disponia de la correlacion pre-post.
- Declarada: la mayoria de estudios con riesgo de sesgo incierto o alto; los efectos podrian estar inflados.
- Declarada: certeza GRADE rebajada por imprecision (muestras pequenas, intervalos amplios).
- Declarada: pocos estudios con mujeres, con datos por sexo y con adultos de mediana edad o mayores; sin analisis por sexo o edad.
- Declarada: la comparacion yeso vs ortesis se limita a 14 dias y pocos datos; los resultados en no lesionados pueden no reflejar escenarios clinicos.
- Posible sesgo de publicacion en fuerza (Egger P = 0,03), que los autores consideran poco plausible.

## Aplicabilidad y extrapolaciones no permitidas

Es un contraste externo de fuerza y tamano en desuso, con una advertencia fuerte de transferencia: la otra pierna y el resto del cuerpo siguen cargados y no hay desplazamiento de fluidos. No se puede: convertir g en porcentaje de perdida; aplicar la meseta a 14 dias al vuelo o al reposo en cama; usar la razon fuerza/tamano como conversion individual; mezclar las medidas de tamano (el metaanalisis combina volumen y area transversal).

## Lo que queda sin verificar

- Hojas suplementarias S1 a S12 (lista de estudios, datos extraidos, riesgo de sesgo, GRADE, subgrupos) y figuras (graficos de bosque).
- Inconsistencias internas: fecha de la busqueda 30 de enero de 2022 (abstract) vs 20 de enero de 2022 (Metodos); en la Discusion los IC aparecen como [-0,94; -0,67] y [-0,52; -0,30], distintos de Resultados y abstract; numero de estudios por modelo en tamano (3 en Resultados, 'cuatro puntos' en Discusion).
- Solapamiento de estudios primarios con otras sintesis del corpus.

# Verificacion de literatura: literature_pmid_31098391

Verificacion asistida por IA (Claude), 2026-11-15. No es revision medica ni aprobacion cientifica.

## Identificacion

- Titulo: A comparison of exercise interventions from bed rest studies for the prevention of musculoskeletal loss.
- Autores: Konda NN, Karri RS, Winnard A, Nasser M, Evetts S, Boudreau E, Caplan N, Gradwell D, Velho RM.
- Revista: npj Microgravity 2019;5:12 (publicado en linea 2019-05-08).
- Identificadores: PMID 31098391; DOI 10.1038/s41526-019-0073-4; PMCID PMC6506471.
- Tipo segun PubMed: Journal Article. Por contenido es una revision sistematica narrativa (declara PRISMA) sin metaanalisis.
- Ficha verificada: `backend/data/literature/generated/deepseek-corpus-v2-20261115/literature_pmid_31098391.json` (modelo openai_compatible:18ca5273336d/deepseek-v4-pro, prompt abstract-analysis-0.2).
- Metadatos bibliograficos: correctos. Titulo, autores, ano, revista, volumen, pagina e identificadores del corpus coinciden con PubMed y con el XML de Europe PMC.

## Fuentes leidas

Texto completo leido: si.

- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=31098391&retmode=xml
  - Alcance: Registro PubMed via API oficial E-utilities (mismo contenido que https://pubmed.ncbi.nlm.nih.gov/31098391/): metadatos y abstract completo.
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6506471/fullTextXML
  - Alcance: Texto completo en acceso abierto (Europe PMC, XML JATS de PMC6506471): cuerpo, tablas y leyendas de figuras. No incluye material suplementario ni las figuras como imagen.

## Veredicto del resumen

**con_correcciones.** El resumen reproduce el abstract que recibio el modelo, pero ese abstract estaba truncado y el resumen presenta 4,59% como si fuera la perdida de cadera de la revision. En el texto completo esa cifra es el valor del grupo control de un solo estudio (maximo observado), no una estimacion combinada. Falta la perdida de 6% en epifisis tibial y la atenuacion osea en cadera y tibia distal. La frase sobre 'perdida osea y muscular en la cadera' viene del abstract, pero el cuerpo del articulo no informa musculo de cadera.

## Comprobacion por item

1. [finding] "La pérdida de densidad mineral ósea fue más significativa en la cadera, con una reducción del 4,59% (p < 0,05)."
   - Veredicto: **parcial**
   - Nota y ubicacion: La cifra existe (abstract; Tabla 2; Discusion: 'up to -4.59%'), pero corresponde al grupo control de un unico estudio (Cavanagh et al., n = 6, 84 dias, pQCT), no a un valor combinado. La misma frase del abstract original incluye -6% en epifisis tibial (Rittweger et al., LTBR, control n = 9, 90 dias), que el item omite por el truncamiento.
2. [finding] "Los cambios en el área transversal muscular indicaron que la pantorrilla y el cuádriceps fueron los más afectados por el reposo en cama."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Tabla 4: pantorrilla control -18,0% a -33,0% (4 estudios); cuadriceps control -15,8% y -23,3% (2 estudios). Atencion: la Tabla 4 se titula 'CSA' pero mezcla area transversal por pQCT (Rittweger) con volumen por MRI (Cavanagh, Shackelford).
3. [finding] "Las intervenciones con ejercicio atenuaron significativamente la pérdida de masa muscular."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract; Resultados ('Muscle comparisons') y Tabla 4: en pantorrilla los 4 estudios muestran diferencia entre grupos (p < 0,05); en cuadriceps, 2 estudios. La magnitud medida es area transversal o volumen, no masa.
4. [finding] "ZLS, cinta con LBNP y ejercicio resistivo atenuaron significativamente la pérdida ósea y muscular en la cadera en comparación con el valor basal y los controles."
   - Veredicto: **parcial**
   - Nota y ubicacion: Frase literal del abstract. En el texto completo solo el hueso de cadera esta sustentado (Tabla 2: ZLS +1,34% vs -4,59%; cinta LBNP +0,31% vs -1,64%; LBNP + RE -1,99% vs -4,03%; RE -0,90% vs -3,40%). No se informa musculo de cadera; la atenuacion muscular se describe en pantorrilla y cuadriceps con RE, volante de inercia y ZLS, y los estudios con cinta LBNP no aportan datos musculares en la Tabla 4.
5. [finding] "A pesar de la intervención con ejercicio, todavía se observaron altas tasas de pérdida ósea."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract. Texto completo: p. ej. LBNP + RE aun pierde 1,99% en cadera (p < 0,05 vs basal) y la tibia distal por HR-pQCT pierde densidad en todos los brazos. Matiz: en dos estudios (Cavanagh, Zwart) la DMO de cadera aumento en el grupo de ejercicio, de modo que no es uniforme.

## Correcciones propuestas

- Item 1, texto propuesto: 'Los sitios del miembro inferior tuvieron las mayores perdidas de densidad mineral osea: hasta 4,59% en cadera total (grupo control de un estudio, n = 6, 84 dias; p < 0,05) y 6% en epifisis tibial (grupo control de otro estudio, n = 9, 90 dias; p < 0,05). Son valores maximos por estudio, no una estimacion combinada.'
- Item 4, texto propuesto: 'ZLS, cinta con LBNP y ejercicio resistivo atenuaron la perdida osea en la cadera frente al basal y a los controles. La perdida muscular en pantorrilla y cuadriceps fue atenuada por ejercicio resistivo, volante de inercia y ZLS. La revision no informa musculo de cadera.'
- Resumen: sustituir 'La perdida osea mas significativa ocurrio en la cadera (4,59%)' por 'Las mayores perdidas oseas se observaron en el miembro inferior (hasta 4,59% en cadera y 6% en epifisis tibial en grupos control de estudios individuales)' y anadir 'El ejercicio atenuo la perdida osea en cadera y tibia distal frente a los controles (p < 0,05)'.
- Resumen e items: decir 'area transversal o volumen muscular' en lugar de 'masa muscular' cuando se describa lo medido.
- El campo abstract guardado en el archivo generado esta truncado: se perdio el texto situado entre un signo '<' y el siguiente '>' (probable limpieza de etiquetas HTML). Restaurar el abstract desde PubMed antes de regenerar la ficha. Texto perdido: '(p < 0.05) and the tibial epiphysis by 6% (p < 0.05). Exercise attenuated bone loss at the hip and distal tibia compared to controls (p < 0.05).'

## Datos del estudio

- Diseno: Revision sistematica narrativa (PRISMA, sin metaanalisis) de 8 ensayos de reposo en cama con brazo de ejercicio y brazo control. El abstract cita MEDLINE; Metodos indica MEDLINE y Cochrane Library.
- Poblacion: Adultos sanos de 19 a 50 anos (criterio de elegibilidad); estudios solo de hombres, solo de mujeres o mixtos.
- Tamano de muestra y grupos: 8 estudios; 11 a 25 participantes por estudio (media 18); brazos de ejercicio de 5 a 10 y control de 6 a 18. Shackelford: control n = 16 en Tablas 1 y 4 y n = 18 en Tabla 2 (inconsistencia del articulo).
- Entorno: Reposo en cama (analogo terrestre): 6 estudios con inclinacion de -6 grados y 2 horizontales. Sin datos originales de vuelo espacial.
- Exposicion y duracion: 30 a 119 dias de reposo (media 70). Contramedidas: ejercicio resistivo, resistivo con vibracion, volante de inercia, cinta con presion negativa (LBNP), simulador de locomocion en gravedad cero (ZLS).
- Desenlaces principales: Cambio porcentual de DMO/CMO (DXA, pQCT, HR-pQCT) en 7 sitios; area transversal o volumen muscular de pantorrilla, antebrazo y cuadriceps; biomarcadores oseos (solo direccion del cambio).

## Limitaciones

- Declaradas: se presentan juntos DMO y CMO como cambio porcentual; HR-pQCT sensible a artefactos de movimiento.
- Declaradas: gran variabilidad interindividual y muestras pequenas; duraciones muy distintas (30 a 119 dias).
- Declaradas: diferencias por sexo en metabolismo oseo; es 'muy dificil' extrapolar a la duracion de una mision a Marte.
- Declaradas (riesgo de sesgo): reporte selectivo de sitios o tiempos en varios estudios; 4 de 8 no indican control de adherencia; Shackelford asigno por orden de inscripcion (no aleatorio).
- Declarada: los estudios combinan principios de ejercicio distintos, lo que impide saber que metodo tuvo mayor efecto.

## Aplicabilidad y extrapolaciones no permitidas

Sirve como apoyo cualitativo: en analogos el miembro inferior es el mas afectado y el ejercicio atenua pero no anula la perdida. No se puede: usar 4,59% (ni 6%) como perdida esperada de un astronauta; tratar los dispositivos como equivalentes entre si o al ARED; derivar una dosis optima; extrapolar mas alla de 119 dias; mezclar area transversal con volumen; presentar estos datos como de vuelo.

## Lo que queda sin verificar

- Material suplementario (estrategia de busqueda, tabla de riesgo de sesgo) y figuras.
- Los 8 estudios primarios no se consultaron: las cifras se comprobaron solo contra las tablas de la revision.
- Inconsistencias internas no resueltas: cadera Zwart +0,31% (Tabla 2) vs 0,4% (Discusion); la perdida de 33% en pantorrilla se cita con la referencia 30 pero la Tabla 4 la atribuye a Cavanagh.

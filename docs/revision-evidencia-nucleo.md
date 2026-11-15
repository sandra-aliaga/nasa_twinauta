# Revisión documental del núcleo muscular

Estado: extracción documental comprobada; revisión de Medicina pendiente. No modifica los 27 candidatos, reglas, elegibilidad, PostgreSQL ni resultados de la aplicación. Los datos estructurados están en [core-studies.json](../backend/data/literature/extractions/core-studies.json), con hashes de los originales y localizadores.

## Pregunta y contraste

¿Los datos elegidos permiten ilustrar tamaño y función sin inventar una respuesta individual? La hipótesis se mantiene solo para referencias del estudio. Una incompatibilidad de método, tiempo, población o resultado limita su uso. Se inspeccionaron texto y tablas originales locales, se visualizaron las tablas y se hizo una segunda búsqueda de límites temporales y transferencia a vuelo.

## Scott 2020: área transversal

[Artículo](https://pmc.ncbi.nlm.nih.gov/articles/PMC7688251/): nueve participantes, ocho hombres y una mujer, 70 días de reposo y rehabilitación terrestre posterior. La medida es área por MRI, promediada entre cortes. El suplemento, página PDF 8, eTable 3, reporta pérdida diaria relativa a BR-6: cuádriceps −0,11 y sóleo −0,33 % del basal/día. Se comprobaron visualmente las celdas.

Mantener como referencia ilustrativa acotada; antes de programar la curva hay que resolver el anclaje basal/tiempo cero. No representa pérdida por faltar a sesiones. No componer diariamente sobre el valor restante, convertir a torque ni emplear la recuperación terrestre como recuperación en vuelo. La tabla no aporta intervalos para esas tasas. El artículo considera ajustes comparables; eTable 2 muestra diferencias de AIC/BIC que impiden afirmar que la recta sea un modelo universal único.

## SPRINT 2024: función muscular

[Artículo](https://journals.physiology.org/doi/full/10.1152/japplphysiol.00489.2023): 26 participantes; brazos BR, BRE y BRE con testosterona de 9, 9 y 8 personas. Tabla 1, página PDF 3 / impresa 1017, visualizada. Para nuestra comparación se extraen únicamente BR y BRE:

| Condición | Basal, media ± DE | Posterior, media ± DE |
| --- | --- | --- |
| BR | 200 ± 47 N·m | 148 ± 42 N·m |
| BRE | 211 ± 32 N·m | 198 ± 27 N·m |

El método es extensión de rodilla isocinética a 60°/s. La nota define basal como el máximo de BR-11 y BR-5; posterior en BR+2. No es una serie diaria. La dispersión es DE, no intervalo de confianza ni límite individual. La misma tabla contiene volumen por MRI; no mezclarlo con área. Su calendario MRI difiere entre nota y narrativa: conservar la discrepancia. Parte de la tabla procede de una publicación anterior, referencia 35; cotejar cohortes antes de contar replicación. El brazo farmacológico no se propone como acción.

## Segunda búsqueda: qué cambia y qué queda pendiente

- [Marušič et al., 2021](https://journals.physiology.org/doi/full/10.1152/japplphysiol.00363.2020): la síntesis describe pérdida no uniforme y respuestas diferentes de tamaño y fuerza. Se consultaron extractos indexados del editor; el acceso directo devolvió 403. No se reauditaron sus estudios incluidos ni se adoptó su ecuación. Impide presentar una pendiente o conversión área→torque como universal; no refuta por sí sola el ajuste de Scott.
- [Böcker et al., 2026](https://pubmed.ncbi.nlm.nih.gov/42185309/): abstract original consultado; compara vuelo y reposo con pQCT en localizaciones tibiales. Cambian método, región y exposición. No valida nuestros coeficientes del cuádriceps. Texto completo y solapamiento individual pendientes.
- Scott y SPRINT pertenecen al programa NASA de 70 días; no declararlos validaciones independientes. Falta el mapa explícito de participantes, brazos y publicaciones.

## Comparación con NASA y decisión de producto

[MA-201](https://humanresearchroadmap.nasa.gov/gaps/gap.aspx?i=833), en su estado de conocimiento y objetivo de cierre, reconoce incertidumbre de eficacia y restricciones de recursos para exploración. NASA ya reúne resultados de reposo y vuelo para requisitos de ejercicio en su [resumen técnico](https://www.nasa.gov/ochmo-tb-031-exercise-overview-2/). Ninguna de esas páginas prueba que NASA carezca de nuestra experiencia de interfaz.

Mantener los indicadores seleccionados y la separación entre observaciones del caso y referencias publicadas. Mostrar método, tiempo, grupo y dispersión antes de comparar. La propuesta es facilitar lectura y decisiones operativas con fuentes; no resolver MA-201 ni prescribir desde dos estudios.

Próximo cierre con Medicina: confirmar cada extracción, conciliar cohortes/calendarios, contrastar métodos en vuelo y definir qué condiciones permiten una comparación. Solo después incorporar contenido versionado a fichas/grafos. Las extracciones actuales no se cargan automáticamente en la aplicación.

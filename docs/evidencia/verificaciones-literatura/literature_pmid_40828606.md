# Verificacion de literatura: literature_pmid_40828606

Verificacion asistida por IA (Claude), 2026-11-15. No es revision medica ni aprobacion cientifica.

## Identificacion

- Titulo: Muscle-specific atrophy of the lower limb musculature in response to simulated microgravity exposure in women.
- Autores: Rogers KR, Yoon G, Vincenty CS, Trappe SW, Trappe TA.
- Revista: Journal of Applied Physiology (1985) 2025;139(3):759-765 (publicado en linea 2025-08-19).
- Identificadores: PMID 40828606; DOI 10.1152/japplphysiol.00483.2025; sin PMCID.
- Tipo segun PubMed: Journal Article. PubMed registra un comentario publicado sobre el articulo: J Appl Physiol 2026;140(3):825-826, DOI 10.1152/japplphysiol.00906.2025 (no figura en el corpus).
- Ficha verificada: `backend/data/literature/generated/deepseek-corpus-v2-20261115/literature_pmid_40828606.json` (modelo openai_compatible:18ca5273336d/deepseek-v4-pro, prompt abstract-analysis-0.2).
- Metadatos bibliograficos: correctos. Coinciden titulo, autores, ano, revista, volumen, numero, paginas y DOI. Falta en el corpus la referencia al comentario publicado en 2026.

## Fuentes leidas

Texto completo leido: no, solo abstract.

- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40828606&retmode=xml
  - Alcance: Registro PubMed via API oficial E-utilities (mismo contenido que https://pubmed.ncbi.nlm.nih.gov/40828606/): metadatos y abstract completo.
- https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=ext_id:40828606%20src:med&resultType=core&format=json
  - Alcance: Registro de Europe PMC: metadatos, financiacion y disponibilidad (no es acceso abierto; sin texto completo).
- https://journals.physiology.org/doi/full/10.1152/japplphysiol.00483.2025
  - Alcance: Editorial: intento fallido (HTTP 403); no se leyo nada.

## Veredicto del resumen

**con_correcciones.** Solo se pudo leer el abstract. El resumen no dice nada falso, pero omite todos los resultados cuantitativos porque el abstract recibido estaba truncado: perdida en los 17 musculos, rango de -10% a -29% y comparacion con hombres. Ademas presenta la especificidad por sexo sin aclarar que se basa en datos de hombres obtenidos previamente.

## Comprobacion por item

1. [finding] "Ocho mujeres (34±4 años) se sometieron a 60 días de microgravedad simulada mediante reposo en cama con inclinación de cabeza hacia abajo de 6°."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract. Es descripcion del metodo, no un hallazgo (el tipo 'finding' no corresponde).
2. [finding] "Se determinaron cambios en el volumen muscular determinado por resonancia magnética de 17 músculos de las extremidades inferiores después de 1 y 2 meses."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract. Es descripcion del metodo, no un hallazgo.
3. [finding] "El volumen muscular disminuyó significativamente."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract, pero incompleto: el volumen disminuyo (P < 0,05) en los 17 musculos tras 1 y 2 meses; del menos afectado (recto femoral -10%) a los mas afectados (soleo -27%, gastrocnemio lateral -28%, gastrocnemio medial -29%).
4. [finding] "La atrofia del músculo esquelético inducida por microgravedad de las extremidades inferiores ocurre de manera específica según el músculo y el sexo."
   - Veredicto: **parcial**
   - Nota y ubicacion: La especificidad por musculo esta en el abstract (vastos -22% vs recto femoral -10%; semimembranoso y biceps femoral cabeza larga -20% vs gracil, biceps femoral cabeza corta y semitendinoso -12%). La especificidad por sexo se apoya en comparar con datos de hombres (33 +/- 7 anos) que 'previamente' pasaron mediciones similares: no es un grupo concurrente. Resultado: mayor atrofia en mujeres en 16 de 17 musculos (P < 0,05) y al menos el doble en 7.
5. [implication] "Esta nueva información debería considerarse en el desarrollo de contramedidas de ejercicio para astronautas en misiones espaciales de larga duración."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract (frase final y apartado NEW & NOTEWORTHY). Es una recomendacion de los autores.

## Correcciones propuestas

- Resumen, texto propuesto: 'Ocho mujeres (34 +/- 4 anos) completaron 60 dias de reposo en cama con inclinacion de cabeza de -6 grados. Por resonancia magnetica, el volumen de los 17 musculos del miembro inferior estudiados disminuyo (P < 0,05) tras 1 y 2 meses, desde -10% en el recto femoral hasta -27% a -29% en soleo y gastrocnemios. Hubo diferencias dentro de grupos musculares (vastos -22% frente a recto femoral -10%). Frente a datos de hombres (33 +/- 7 anos) obtenidos previamente con mediciones similares, las mujeres mostraron mayor atrofia en 16 de 17 musculos y al menos el doble en 7. Los autores proponen tenerlo en cuenta al disenar contramedidas de ejercicio.'
- Item 3, texto corregido: 'El volumen muscular disminuyo (P < 0,05) en los 17 musculos tras 1 y 2 meses, entre -10% (recto femoral) y -27% a -29% (soleo y gastrocnemios).'
- Item 4, texto propuesto: 'La atrofia fue especifica por musculo. En comparacion con datos de hombres obtenidos previamente (no concurrentes), las mujeres mostraron mayor atrofia en 16 de 17 musculos (P < 0,05).'
- Items 1 y 2: reclasificar como metodo o poblacion, no como hallazgo.
- Registrar en el corpus el comentario publicado (J Appl Physiol 2026;140(3):825-826).
- El campo abstract guardado en el archivo generado esta truncado: se perdio el texto situado entre un signo '<' y el siguiente '>' (probable limpieza de etiquetas HTML). Restaurar el abstract desde PubMed antes de regenerar la ficha. Texto perdido: practicamente toda la seccion de resultados del abstract.

## Datos del estudio

- Diseno: Estudio longitudinal pre-post en un solo grupo de mujeres, con comparacion frente a datos de hombres obtenidos previamente (segun el abstract). No verificado en texto completo.
- Poblacion: 8 mujeres de 34 +/- 4 anos; comparador: hombres de 33 +/- 7 anos (numero no indicado en el abstract).
- Tamano de muestra y grupos: n = 8 mujeres; n de hombres no verificable.
- Entorno: Reposo en cama con inclinacion de cabeza de -6 grados (microgravedad simulada).
- Exposicion y duracion: 60 dias; mediciones tras 1 y 2 meses. El abstract no indica si hubo o no contramedidas ni la campana de procedencia.
- Desenlaces principales: Volumen por MRI de 17 musculos del miembro inferior: -10% (recto femoral) a -29% (gastrocnemio medial); vastos -22%.

## Limitaciones

- No verificable: el abstract no declara limitaciones y no se accedio al texto completo.
- Observadas por el verificador a partir del abstract: muestra de 8 participantes; comparacion por sexo con datos historicos; sin grupo control concurrente descrito.

## Aplicabilidad y extrapolaciones no permitidas

Pertinente para heterogeneidad por musculo y por sexo en un analogo de 60 dias, midiendo volumen. No se puede: tomar la diferencia por sexo como establecida (comparacion no concurrente, n = 8); convertir porcentajes de volumen en area transversal o en fuerza; aplicar estas magnitudes a una tripulacion que entrena en vuelo; atribuir los porcentajes a un mes concreto (el abstract no separa 1 y 2 meses por musculo).

## Lo que queda sin verificar

- Todo el texto completo: Metodos, origen y tamano del grupo de hombres, campana de reposo en cama, presencia o ausencia de contramedidas, valores por musculo en cada momento, limitaciones declaradas.
- Contenido del comentario publicado en 2026 y si cuestiona el analisis.
- Europe PMC indica financiacion de NASA (NNJ04HF72G); no se pudo confirmar a que campana corresponde.

# Verificacion de literatura: literature_pmid_41894197

Verificacion asistida por IA (Claude), 2026-11-15. No es revision medica ni aprobacion cientifica.

## Identificacion

- Titulo: Impact of 14 days of head-down bed rest and an exercise countermeasure on skeletal muscle atrophy, proteome and circulatory cytokines in older adults.
- Autores: Lagace JC, St-Martin P, Avino M, Ghachem A, Hajj-Boutros G, Morais JA, McPhee JS, Lambert K, Riesco E, Dionne IJ.
- Revista: Experimental Physiology 2026 (publicado en linea 2026-03-27; PubMed aun no registra volumen ni paginas).
- Identificadores: PMID 41894197; DOI 10.1113/EP093524; PMCID PMC13394170; ClinicalTrials.gov NCT04964999.
- Tipo segun PubMed: Journal Article (ensayo aleatorizado de dos brazos segun el texto).
- Ficha verificada: `backend/data/literature/generated/deepseek-corpus-v2-20261115/literature_pmid_41894197.json` (modelo openai_compatible:18ca5273336d/deepseek-v4-pro, prompt abstract-analysis-0.1).
- Metadatos bibliograficos: correctos. Coinciden titulo, autores, ano, revista e identificadores; la ausencia de volumen y paginas en el corpus es coherente con PubMed.

## Fuentes leidas

Texto completo leido: si.

- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=41894197&retmode=xml
  - Alcance: Registro PubMed via API oficial E-utilities (mismo contenido que https://pubmed.ncbi.nlm.nih.gov/41894197/): metadatos y abstract completo.
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC13394170/fullTextXML
  - Alcance: Texto completo en acceso abierto (Europe PMC, XML JATS de PMC13394170): cuerpo, tablas y leyendas de figuras. No incluye material suplementario ni las figuras como imagen.

## Veredicto del resumen

**con_correcciones.** El resumen coincide con el abstract. Dos ajustes tras leer el texto completo: la 'recuperacion completa a las 4 semanas' tiene una excepcion que la propia conclusion del articulo declara (volumen del muslo en el grupo control), y la perdida de masa magra por DXA queda dentro del error de medida del metodo, por lo que los autores piden cautela. Error gramatical: 'un contramedida'.

## Comprobacion por item

1. [finding] "El reposo en cama indujo disminuciones significativas en la masa magra total y de las extremidades inferiores, la fuerza extensora de la rodilla y la calidad muscular."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Resultados: masa magra total -0,68 kg (-1,5%), de miembros inferiores -0,34 kg (-2,0%), fuerza extensora de rodilla -23,6 Nm (-13,4%), calidad muscular -0,28 Nm/cm3. Matiz: los cambios de masa magra quedan dentro del coeficiente de variacion de la DXA (~2%) y los autores piden interpretarlos con cautela.
2. [finding] "La intervención de ejercicio mixto mitigó la pérdida de volumen del músculo del muslo."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Resultados: interaccion grupo por tiempo P = 0,0076; control -3,99 cm3 (P = 0,0005; n = 11); ejercicio -0,71 cm3 (P = 0,40; n = 7). Unidades tal como las da el articulo.
3. [finding] "La intervención de ejercicio mixto no previno las reducciones en la masa magra total o de las extremidades inferiores, la fuerza o la calidad muscular."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Resultados: sin interaccion grupo por tiempo en masa magra (P >= 0,619), fuerza (P >= 0,407) ni calidad (P >= 0,652). Matiz: dentro de cada grupo la fuerza bajo 16,5% (control) y 6,7% (ejercicio); los autores reconocen potencia estadistica limitada.
4. [finding] "Todos los participantes se recuperaron completamente después de 4 semanas de recuperación."
   - Veredicto: **parcial**
   - Nota y ubicacion: Frase literal del abstract. La Conclusion del texto completo anade una excepcion: 'except for thigh muscle volume in the control group'. Ademas el seguimiento a 4 semanas tiene n = 20 (2 controles retirados en el dia 3 de recuperacion).
5. [implication] "La participación diaria en un contramedida de ejercicio preserva el volumen del músculo del muslo durante 2 semanas de reposo en cama en adultos mayores sanos, pero es insuficiente para mitigar la fuerza muscular y la masa magra total."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Conclusion del abstract y del texto completo.
6. [studied_intervention] "Contramedida de ejercicio mixto con tres sesiones diarias de ejercicio durante el reposo en cama con inclinación de cabeza hacia abajo."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Metodos: tres sesiones diarias supervisadas (60 a 75 min/dia en total), aerobicas en cicloergometro (continuas, progresivas y por intervalos) y de resistencia con peso corporal, bandas y poleas; control con movilizacion pasiva.

## Correcciones propuestas

- Item 4 y ultima frase del resumen, texto corregido: 'Tras 4 semanas de recuperacion, la masa magra, la fuerza extensora de rodilla y la calidad muscular ya no diferian del basal; segun la conclusion del texto completo, la excepcion fue el volumen del muslo del grupo control (seguimiento con n = 20).'
- Resumen e items: 'una contramedida' en lugar de 'un contramedida'.
- Item 1, anadir: 'Los cambios de masa magra (-1,5% total; -2,0% en miembros inferiores) estan dentro del error de medida de la DXA (~2%) y los autores piden interpretarlos con cautela.'
- Item 6, texto propuesto: 'Contramedida de ejercicio mixto: tres sesiones diarias supervisadas (60 a 75 min/dia) de ejercicio aerobico en cicloergometro y de resistencia con bandas y poleas, frente a un grupo control con movilizacion pasiva.'

## Datos del estudio

- Diseno: Ensayo aleatorizado de dos brazos paralelos dentro del estudio canadiense BROA (Bed Rest in Older Adults); modelos lineales mixtos. Parte de los datos (DXA, fuerza de rodilla, volumen de muslo pre y post) ya se habian publicado en otros articulos de la misma cohorte.
- Poblacion: Adultos sanos de 55 a 65 anos (mujeres posmenopausicas); 11 hombres y 11 mujeres completaron el reposo; mediana de edad 58 y 59 anos por grupo.
- Tamano de muestra y grupos: 23 incluidos; 22 completaron el reposo (ejercicio 11, control 11); 20 completaron el protocolo. MRI con n menor en el grupo de ejercicio (7 a 9).
- Entorno: Reposo en cama con inclinacion de cabeza de -6 grados (analogo de microgravedad), en regimen de internamiento.
- Exposicion y duracion: 14 dias de reposo; 7 dias de recuperacion internados y seguimientos a 4 semanas y 4 meses. Dieta de mantenimiento con al menos 1,2 g/kg/dia de proteina.
- Desenlaces principales: Masa magra y grasa por DXA; volumen y grasa del muslo por MRI; fuerza isometrica de extension de rodilla y de prension; calidad muscular (Nm por cm3); proteoma muscular y citocinas plasmaticas.

## Limitaciones

- Declarada: potencia estadistica limitada por abandonos y pruebas no completadas.
- Declarada: momento de las mediciones (fuerza el dia 2 y DXA el dia 3 de recuperacion), que pudo permitir cierta recuperacion.
- Declarada: la ingesta energetica no difirio entre grupos, por lo que un grupo pudo estar en exceso o en deficit calorico.
- Declarada: el ejercicio de alta intensidad puede no ser viable en personas mayores hospitalizadas.
- En Discusion: los cambios de masa magra por DXA caen dentro del coeficiente de variacion del metodo; la dieta alta en proteina pudo atenuar las perdidas; la MRI solo cubre el muslo.
- La calidad muscular combina fuerza y volumen medidos en dias distintos.

## Aplicabilidad y extrapolaciones no permitidas

Util para distinguir preservacion de volumen de preservacion de fuerza y calidad muscular, en adultos de 55 a 65 anos y en un analogo corto. No se puede: extrapolar 14 dias a una mision larga; asumir que conservar volumen conserva fuerza (no hubo correlacion entre ambos cambios); tratar el volumen del muslo como area transversal o como masa magra; trasladar el protocolo de ejercicio a una mision o a pacientes hospitalizados; contar este articulo como evidencia independiente de las otras publicaciones de la cohorte BROA.

## Lo que queda sin verificar

- Figuras 1 a 8 y material suplementario.
- Secciones de proteomica y citocinas: no se comprobaron en detalle (ningun item las cubre).
- Publicaciones previas de la misma cohorte (Hajj-Boutros 2023 y 2024; Dulac 2025) no consultadas.
- Resultado del volumen del muslo del grupo control a las 4 semanas: solo consta en la Conclusion, sin cifra en el texto leido. La fuerza aparece como -13,4% en Resultados y -11,6% en Discusion.

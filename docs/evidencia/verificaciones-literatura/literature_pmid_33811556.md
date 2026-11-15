# Verificacion de literatura: literature_pmid_33811556

Verificacion asistida por IA (Claude), 2026-11-15. No es revision medica ni aprobacion cientifica.

## Identificacion

- Titulo: Daily 30-min exposure to artificial gravity during 60 days of bed rest does not maintain aerobic exercise capacity but mitigates some deteriorations of muscle function: results from the AGBRESA RCT.
- Autores: Kramer A, Venegas-Carro M, Zange J, Sies W, Maffiuletti NA, Gruber M, Degens H, Moreno-Villanueva M, Mulder E.
- Revista: European Journal of Applied Physiology 2021;121(7):2015-2026 (publicado en linea 2021-04-03).
- Identificadores: PMID 33811556; DOI 10.1007/s00421-021-04673-w; PMCID PMC8192329; registro DRKS00015677.
- Tipo segun PubMed: Randomized Controlled Trial.
- Ficha verificada: `backend/data/literature/generated/deepseek-corpus-v2-20261115/literature_pmid_33811556.json` (modelo openai_compatible:18ca5273336d/deepseek-v4-pro, prompt abstract-analysis-0.2).
- Metadatos bibliograficos: correctos. Coinciden titulo, autores, ano, revista, volumen, numero, paginas e identificadores.

## Fuentes leidas

Texto completo leido: si.

- https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=33811556&retmode=xml
  - Alcance: Registro PubMed via API oficial E-utilities (mismo contenido que https://pubmed.ncbi.nlm.nih.gov/33811556/): metadatos y abstract completo.
- https://www.ebi.ac.uk/europepmc/webservices/rest/PMC8192329/fullTextXML
  - Alcance: Texto completo en acceso abierto (Europe PMC, XML JATS de PMC8192329): cuerpo, tablas y leyendas de figuras. No incluye material suplementario ni las figuras como imagen.

## Veredicto del resumen

**consistente.** El resumen no anade ni exagera. Es incompleto porque el abstract recibido estaba truncado: no menciona la mitigacion en fuerza y tasa de desarrollo de fuerza de flexion plantar, los porcentajes por grupo ni la diferencia entre mujeres y hombres. Un item tiene el valor p cortado.

## Comprobacion por item

1. [finding] "AG no tuvo efecto significativo en la capacidad de ejercicio aeróbico, función muscular flexora y fuerza de extensión isométrica de rodilla ni tasa de desarrollo de fuerza."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Tabla 1 (interaccion grupo*tiempo: VO2max relativo p = 0,31; MVC extension de rodilla p = 0,11; RFD extension de rodilla p = 0,41; flexion de rodilla p = 0,14; dorsiflexion p = 0,51). Matices: la RFD sin efecto es la de extension de rodilla (la de flexion plantar si mostro efecto) y el torque isocinetico de extension de rodilla tuvo interaccion significativa (p = 0,03; Tabla 1), dato que no esta en el abstract.
2. [finding] "AG mitigó los efectos del reposo en cama sobre la potencia de salto (interacción grupo*tiempo del rmANOVA p...)."
   - Veredicto: **parcial**
   - Nota y ubicacion: Hallazgo correcto pero cortado. Original: interaccion grupo*tiempo p < 0,001; iAG -25%, cAG -26%, CTRL -33% (abstract; Tabla 1). El item omite la fuerza de flexion plantar (p = 0,003; -35%, -31%, -48%) y la RFD de flexion plantar (p = 0,020; -28%, -12%, -40%).
3. [implication] "Los protocolos de AG no fueron adecuados para mantener la capacidad de ejercicio aeróbico, probablemente debido a la muy baja demanda cardiorrespiratoria de esta intervención."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Conclusion del abstract; la Discusion lo apoya en que el consumo de oxigeno durante la centrifugacion se mantuvo en niveles de reposo (dato de otra publicacion del mismo grupo y cohorte).
4. [implication] "Sin embargo, mitigaron algunas pérdidas en la función muscular, potencialmente debido a las contracciones musculares de baja intensidad durante la centrifugación utilizadas para evitar el presíncope."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Conclusion del abstract, formulada como hipotesis ('potentially'). El texto completo anade que el efecto protector no es suficiente para justificar la centrifugacion como unica contramedida.
5. [studied_intervention] "Los participantes de los grupos de intervención completaron 30 min de centrifugación por día: cAG continuamente y iAG por 6×5 min, con una aceleración de 1g en el centro de masa."
   - Veredicto: **sustentado**
   - Nota y ubicacion: Abstract y Metodos (centrifuga de brazo corto de 3,8 m de radio, ~2 g en los pies, pausas de 3 min en iAG, sesiones en posicion horizontal).

## Correcciones propuestas

- Item 2, texto corregido: 'La AG mitigo los efectos del reposo en cama sobre la potencia de salto (interaccion grupo*tiempo del rmANOVA p < 0,001; iAG -25%, cAG -26%, CTRL -33%), la fuerza de flexion plantar (p = 0,003; iAG -35%, cAG -31%, CTRL -48%) y la tasa de desarrollo de fuerza de flexion plantar (p = 0,020; iAG -28%, cAG -12%, CTRL -40%).'
- Resumen: anadir 'Tambien mitigo la perdida de fuerza y de tasa de desarrollo de fuerza de flexion plantar' y 'En el analisis agrupado (16 hombres, 8 mujeres) las mujeres perdieron mas potencia de salto (p < 0,001) y fuerza de extension de rodilla (p = 0,010)'.
- Item 1: precisar 'tasa de desarrollo de fuerza de extension de rodilla'.
- El campo abstract guardado en el archivo generado esta truncado: se perdio el texto situado entre un signo '<' y el siguiente '>' (probable limpieza de etiquetas HTML). Restaurar el abstract desde PubMed antes de regenerar la ficha. Texto perdido: desde 'p < 0.001; iAG - 25%...' hasta 'knee extension strength (p = 0.010).'

## Datos del estudio

- Diseno: Ensayo aleatorizado unicentrico de grupos paralelos con 3 brazos (AGBRESA, DLR :envihab, Colonia, 2019); analisis por protocolo con rmANOVA; sin pruebas post hoc.
- Poblacion: 24 adultos sanos (16 hombres, 8 mujeres), 33 +/- 9 anos, 74 +/- 10 kg.
- Tamano de muestra y grupos: n = 24: AG intermitente 8 (3 mujeres), AG continua 8 (3 mujeres), control 8 (2 mujeres).
- Entorno: Reposo en cama con inclinacion de cabeza de -6 grados (analogo terrestre), 24 h/dia.
- Exposicion y duracion: 60 dias de reposo; 30 min diarios de centrifugacion (continua 1 x 30 min o intermitente 6 x 5 min) con 1 g en el centro de masa. Sin ejercicio.
- Desenlaces principales: VO2max en cicloergometro; fuerza isometrica maxima y tasa de desarrollo de fuerza de extension de rodilla y flexion plantar; torque isocinetico de rodilla, tobillo y tronco; potencia en salto con contramovimiento. Control: VO2max -24%, extension de rodilla isometrica -35%, flexion plantar -48% (Tabla 1).

## Limitaciones

- Declarada: muestra pequena (8 por grupo); por ello solo se informan pruebas omnibus, sin post hoc ni subgrupos.
- Declarada: la comparacion por sexo agrupa los tres brazos (16 vs 8) y debe confirmarse con muestras mayores.
- En Metodos, no listadas como limitacion: evaluadores no cegados de forma estricta; analisis por protocolo; en la segunda campana 4 participantes entraron 3 semanas despues como reemplazo.
- Las dos modalidades de AG no se compararon en detalle entre si.

## Aplicabilidad y extrapolaciones no permitidas

Aporta la magnitud de la perdida funcional en 60 dias de analogo sin ejercicio y muestra que 30 min/dia de centrifugacion pasiva no bastan. La gravedad artificial no es una contramedida disponible en la ISS. No se puede: predecir la perdida de un astronauta que entrena; generalizar a otros niveles de g, duraciones o a centrifugacion con ejercicio; tomar la diferencia por sexo como hecho establecido; convertir estas perdidas de fuerza en perdida de area o volumen muscular (no se midieron aqui).

## Lo que queda sin verificar

- Figuras 1 a 4 (solo leyendas).
- Publicaciones relacionadas de AGBRESA citadas para explicar el mecanismo (actividad muscular y consumo de oxigeno durante la centrifugacion) no consultadas.
- Independencia respecto de otros articulos de la misma cohorte AGBRESA.

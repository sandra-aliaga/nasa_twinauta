# Verificación: claim_terrestrial_hr_not_astronaut

- Verificado: 2026-11-15 por verificador independiente
- Alcance acotado por encargo: (1) licencia del dataset PhysioNet 1.0.1; (2) cifras de FC de Scott 2023 Table 1 y error atribuido a OCHMO-TB-031 p. 11 y p. 22; (3) un intento del artículo Moore et al. 2014 (J Appl Physiol). No se repitieron las demás comprobaciones de la ficha (CSV locales, Shykoff 1996, resumen ACSM de Moore, MA-201).
- Este documento no aprueba evidencia. Todo sigue en `review_status: "pending"`.

## Veredicto

**corrected** (correcciones menores; la regla operativa se sostiene).

La regla de uso es correcta y prudente. Las cifras de Scott 2023 y el error de OCHMO-TB-031 p. 11 se confirman. Hay que añadir que la p. 22 del brief contiene un segundo error (confunde "% del tiempo por encima del 70 % de la FC pico" con "% de sesiones"). En la licencia, la discrepancia se confirma; conviene precisar en la ficha las cláusulas de la licencia de PhysioNet que no encajan con un proyecto abierto y registrar que existe una versión posterior del proyecto. El artículo Moore 2014 no pudo leerse (HTTP 403).

## Comprobaciones

| # | Comprobación | Resultado | Evidencia |
|---|---|---|---|
| 1 | Existencia | Confirmada para PhysioNet, Scott 2023 y OCHMO-TB-031 (copia local). Moore 2014 J Appl Physiol: no verificado. | PhysioNet: https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/ (autores Denis Mongin, Jeronimo García Romero, Jose Ramon Alvero Cruz; publicado 10 dic 2021; versión 1.0.1; DOI 10.13026/7ezk-j442). La página indica además un DOI de "latest version" 10.13026/94yv-6145, no mencionado en la ficha. Scott 2023: Europe PMC REST https://www.ebi.ac.uk/europepmc/webservices/rest/PMC9898566/fullTextXML (título, Scott JM ... Everett ME, NPJ Microgravity 9:11, 2023). PMC y nature.com no cargaron (verificación de navegador / redirección a login). Moore 2014: doi.org -> physiology.org -> journals.physiology.org, HTTP 403. |
| 2 | Ubicación | Confirmada. | Scott 2023 Table 1 "Inflight Aerobic and Resistance Exercise Training", nota "Data presented as median, IQR": FC media CEVIS 135 (128, 141), T2 131 (121, 137); FC pico CEVIS 158 (150, 163), T2 153 (144, 162); % tiempo >70 % FC pico CEVIS 76 (65, 92), T2 69 (54, 81); >90 % CEVIS 13 (6, 27), T2 11 (4, 24). 46 astronautas (37 H, 9 M), 46,8 ± 6,1 años. OCHMO-TB-031 copia local: p. 11 "131 bpm average / Peak 162 bpm" (T2) y "135 bpm average / Peak 163 bpm" (CEVIS); p. 12 reproduce la Table 1 con 158 (150, 163) y 153 (144, 162); p. 22, columna "Crew Usage": T2 "(162 peak bpm)", CEVIS "(163 peak bpm)". |
| 3 | Fidelidad | Correcta, con un añadido. | El "Peak" de p. 11 y p. 22 coincide con el límite superior del IQR, no con la mediana: confirmado. Error adicional no recogido en la ficha: en p. 22, T2 figura como "76% peak heart rate for 69% of sessions" y CEVIS como "70% peak heart rate for 76% of sessions", cuando la Table 1 da el % de tiempo (no de sesiones) por encima del 70 % de la FC pico (T2 69, CEVIS 76); para T2 además aparece "76%" en lugar de "70%". No usar la p. 22 como fuente de cifras. |
| 4 | Aplicabilidad | Adecuada. | La regla limita la FC terrestre a uso didáctico y prohíbe umbrales, zonas, validación y mezcla con el caso. Los valores de Scott son medianas de grupo en vuelo (T2/CEVIS), no comparables con una prueba máxima terrestre individual; la ficha ya lo indica (conclusión punto 4). |
| 5 | Contraevidencia | No ampliada en este alcance. | No se pudo leer Moore 2014 J Appl Physiol para resolver la discrepancia sobre FC pico que la ficha declara. No se buscó otra contraevidencia por el alcance acotado. |
| 6 | Independencia | Confirmada la dependencia declarada. | OCHMO-TB-031 p. 11-12 cita explícitamente Scott et al. (2023) y la misma cohorte (incrementos 26S-50S, 46 astronautas). No es corroboración independiente. |
| 7 | Campos del contrato | Forma válida. | `Source`: id, title, url (uri), locator, review_status, version, license presentes; `review_status` "pending". `EvidenceClaim`: kind "operational_rule" y environment "terrestrial_exercise" están en los enums de `contracts/openapi.yaml` (líneas 1327-1352); sample_size 1 válido (minimum 1); review_status "pending". |

## Licencia (punto 1 del encargo)

Comparación literal:

- `backend/data/raw/physionet_treadmill_1.0.1/LICENSE.txt` (local), línea 1: "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License". Coincide con lo que dice la ficha.
- Página del proyecto 1.0.1: "License (for files): PhysioNet Contributor Review Health Data License 1.5.0"; "Data Use Agreement: PhysioNet Contributor Review Health Data Use Agreement 1.5.0"; política de acceso: "Anyone can access the files, as long as they conform to the terms of the specified license." No se menciona acceso con credenciales. Coincide con la ficha; la ficha no nombra el Data Use Agreement.
- Página de licencia (https://physionet.org/content/treadmill-exercise-cardioresp/view-license/1.0.1/), leída mediante extracción automática: cláusulas sobre no reidentificar (1, 2, 5), no compartir acceso a "PhysioNet restricted data" (3), seguridad (4), "sole purpose of lawful use in scientific research and no other" (6), certificación vigente en protección de sujetos humanos y HIPAA (7), aportar el código de las publicaciones a un repositorio abierto (8) y terminación (9). La herramienta de extracción indicó que el enlace de origen del texto apunta a una carpeta "drafts". No lo comprobé de forma independiente.

Qué permitiría cada una para una aplicación didáctica pública de un concurso (resumen sin valor de asesoría legal):

- CC BY-NC-SA 4.0: permite copiar, redistribuir y adaptar (por ejemplo, el CSV derivado `heart_rate_2_1.csv`) con tres condiciones: atribución (autores, título, licencia, indicar cambios), uso no comercial y que el material adaptado se distribuya bajo la misma licencia o una compatible. Una aplicación educativa sin monetización encaja razonablemente en "NonCommercial". Que el concurso tenga premios o patrocinadores no lo vuelve comercial de forma evidente, pero no está resuelto aquí. ShareAlike afectaría al CSV derivado, no necesariamente al código de la aplicación.
- PhysioNet Contributor Review Health Data License 1.5.0: restringe el uso a investigación científica (cláusula 6) e impide compartir el acceso (cláusula 3). Leída literalmente, una aplicación pública didáctica que redistribuye la serie no encaja. La cláusula 7 (certificación HIPAA) y las referencias a "restricted data" no son coherentes con un proyecto de acceso abierto. Esto sugiere que es una plantilla general de PhysioNet y no un texto pensado para este dataset, pero es una inferencia: no está confirmada.
- Consecuencia práctica: la condición previa de la ficha (resolver la discrepancia antes de redistribuir el CSV o publicar) es correcta. La opción más prudente mientras no se resuelva: no redistribuir el CSV derivado, enlazar al origen y atribuir según CC BY-NC-SA, o consultar a PhysioNet o a los autores.

## Correcciones propuestas

| Campo | Valor actual | Valor propuesto | Fuente |
|---|---|---|---|
| `src_ochmo_tb_031_2023.locator` | "p. 4 (...); p. 11 (FC en T2 y CEVIS, ISS ~180 días); p. 12 (reproducción de Table 1 de Scott 2023); p. 21 (...)" | Añadir: "p. 11 y p. 22 dan como 'Peak' 162/163 bpm, que corresponden al límite superior del IQR de la Table 1 de Scott 2023, no a la mediana; p. 22 además confunde % de tiempo por encima del 70 % de la FC pico con % de sesiones. Usar Scott 2023 Table 1 para cifras." | OCHMO-TB-031 copia local, p. 11, 12, 22; Scott 2023 Table 1 |
| Extracción, párrafo OCHMO p. 11 | Solo menciona el error del pico | Añadir el error de p. 22: "76% peak heart rate for 69% of sessions" (T2) y "70% peak heart rate for 76% of sessions" (CEVIS) frente a % de tiempo >70 % FC pico 69 y 76 en la Table 1 | Ídem |
| `src_physionet_treadmill_1_0_1.license` | "Discrepancia sin resolver: LICENSE.txt ... CC BY-NC-SA 4.0; la página ... Health Data License 1.5.0." | Mantener y añadir: "La página declara también el Data Use Agreement 1.5.0; existe una versión posterior del proyecto (DOI latest version 10.13026/94yv-6145) cuya licencia no se comprobó." | Página del proyecto 1.0.1 |
| `src_scott_2023_npj_microgravity.url` | https://pmc.ncbi.nlm.nih.gov/articles/PMC9898566 | Sin cambio. Nota: hoy PMC devolvió una verificación de navegador; el contenido se confirmó vía Europe PMC (PMC9898566). Valorar `https://doi.org/10.1038/s41526-023-00256-5` como URL canónica. | Europe PMC REST |

## No verificado

- Moore et al. 2014, J Appl Physiol (DOI 10.1152/japplphysiol.01251.2013): HTTP 403 tras las redirecciones del DOI. Se intentó una vez, según el encargo. Sigue sin resolverse la discrepancia sobre la FC pico en vuelo entre el resumen ACSM y el fragmento de buscador citado por la ficha.
- Página de PMC de Scott 2023: no cargó. Las cifras se confirmaron en el XML de Europe PMC del mismo PMCID y en la reproducción de la p. 12 de OCHMO-TB-031.
- La licencia de la versión más reciente del proyecto PhysioNet (DOI 10.13026/94yv-6145) y el historial de cambios de licencia.
- El supuesto origen "drafts" del texto de la licencia 1.5.0, que solo informó la herramienta de extracción.
- Fuera de alcance: CSV locales y archivo de procedencia, Shykoff 1996, resumen ACSM de Moore 2014 (NTRS), Levine 1996, MA-201, OCHMO p. 4 y p. 21.

## Diferencias con la conclusión del investigador

- Coincido con "mantener con modificación" y con la condición previa sobre la licencia.
- La ficha detecta el error de "Peak" en p. 11 y p. 22, pero no el error de la p. 22 sobre % de sesiones frente a % de tiempo. Refuerza su recomendación de citar solo la Table 1 de Scott.
- La ficha no menciona que la licencia de la página incluye cláusulas (certificación HIPAA, "restricted data") incoherentes con el acceso abierto declarado ni que existe una versión posterior del dataset. Ninguna de las dos cosas cambia la conclusión, pero ayuda a resolver la consulta a PhysioNet.
- Sobre Moore 2014: el estado sigue siendo el que declara la ficha (no leído, no usar afirmaciones de FC pico del artículo).

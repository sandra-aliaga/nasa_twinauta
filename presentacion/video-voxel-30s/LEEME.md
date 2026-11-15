# TwinNauta — voxel world / 30 segundos

Proyecto HTML con un mundo 3D de bloques, astronauta articulado, terreno que se construye, camara orbital, lecturas flotantes, grafo expandible visualmente y biblioteca de libros. Toda la geometria es original y procedural; no utiliza recursos de Minecraft. Como fondos tenues al 24 % de opacidad, incorpora cinco imagenes extraidas del PDF proporcionado por la usuaria. Three.js se reutiliza desde la dependencia instalada del proyecto y se distribuye con su licencia MIT.

## Abrir

Desde esta carpeta:

```bash
python -m http.server 8769 --bind 127.0.0.1
```

Abrir http://127.0.0.1:8769 en un navegador con WebGL2. No requiere plugins ni conexion externa. Play/Pause y la barra temporal permiten ensayar. El video no contiene voz.

En `Final 5 seconds`, cargar una grabacion de al menos cinco segundos. Se reproduce sin su audio original desde el segundo 25, conservando la musica. `Export WebM` genera el video completo en aproximadamente treinta segundos; mantener la pestana visible. Para convertir a MP4:

```bash
ffmpeg -i TwinNauta_dynamic_EN.webm -vf "fps=30,tpad=stop_mode=clone:stop_duration=1" -af apad -t 30 -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart TwinNauta_voxel_EN.mp4
```

`Edit the on-screen script` permite cambiar los titulos y subtitulos. `Save script JSON` descarga los textos; para persistirlos al recargar, sustituir el arreglo `script` de `motion.js`. Ese archivo contiene tambien modelos, colores, posiciones, conexiones y movimientos de camara. La musica instrumental separada esta en `music.wav`; ensayar su nivel con la persona que narrara.

## Secuencia

| Tiempo | Escena | Mensaje |
| --- | --- | --- |
| 0–4 | Isla de bloques y tres edificios de investigacion | NASA ya tiene simulacion biomecanica e investigacion de apoyo a decisiones. |
| 4–8 | Astronauta rodeado de registros | Los datos requieren calidad, contexto y significado. Torque ausente no es cero. |
| 8–12 | Camara se acerca y se ilumina el muslo | Seleccionar region, revisar indicadores y basal. |
| 12–17 | Cubos se ensamblan en un grafo espacial | Fundamento, escenarios y siguientes pasos conectados con fuentes y limites. |
| 17–21 | Biblioteca voxel y articulo desplegado | Revisar fuente, poblacion, metodo y aplicabilidad. |
| 21–25 | Astronauta frente al portal TwinNauta | Informacion conectada para una siguiente comprobacion humana. |
| 25–30 | Espacio reemplazable | Grabacion real de la plataforma. |

## Fidelidad a la app: inspeccion de codigo actual

La animacion es una representacion conceptual, no una grabacion del software. Los estados de calidad y sus comprobaciones representan el flujo propuesto en el PDF; no se presentan como reglas clinicas validadas. Se revisaron estos archivos existentes, sin modificarlos:

- `frontend/src/App.tsx`: seleccion de region/dia, evaluacion, grafo de estudios o del caso y apertura de biblioteca.
- `frontend/src/components/EvaluationTab.tsx`: observaciones, ausencia, origen, calidad, metodo, basal y ejercicio.
- `frontend/src/components/graph/GraphExplorer.tsx` y `frontend/src/lib/graph.ts`: fundamento, escenario y acciones; nodos y relaciones con tipos distintos.
- `frontend/src/components/explorer/ExplorerView.tsx`: filtros de articulos y biblioteca en lista o grafo.
- `frontend/src/components/explorer/GuidanceCard.tsx`: orientacion contextual, aplicabilidad, condiciones y pasos.
- `docs/ENTREGA_FRONTEND.md`: contrato, sintesis con citas y fragmentos, corpus, caso sintetico de cuadricpes/dia 10, restricciones de los pasos operativos.

Los nombres Scott 2020 y SPRINT 2024 proceden de las fuentes del proyecto. El grafo del video ilustra categorias y recorrido, no reproduce aristas de una evaluacion real ni demuestra causalidad. No se presenta validacion clinica, prescripcion automatica, prediccion individual ni conexion con sistemas NASA.

## Antecedentes NASA comprobados para este video

- NASA, Digital Astronaut Simulation Tool (2023): simulacion biomecanica, modelos musculoesqueleticos y cargas durante tareas/ejercicio. https://www.nasa.gov/general/digital-astronaut-simulation-tool/
- NASA NTRS, documento 20260001797 (2026): presentacion que describe CMO-DA y pruebas de concepto de apoyo a decisiones; no se equipara con un sistema clinico desplegado en vuelo. https://ntrs.nasa.gov/citations/20260001797

Consultados el 15 de noviembre de 2026. La escena inicial dice “research references / no NASA system integration”. TwinNauta aporta aqui una experiencia de exploracion y trazabilidad del prototipo; no se afirma que NASA carezca de esas capacidades.

## Revision a partir del PDF de la usuaria

Fuente: `/home/leeeen/descargas/TwinNauta NASA Space Apps.pdf` (16 paginas). Se reutilizan las imagenes de las paginas 1, 2, 4, 7 y 12, extraidas sin texto superpuesto de las diapositivas.

- Pagina 3: calidad, vigencia y disponibilidad de los indicadores.
- Pagina 5: capturar, comprobar, interpretar y elegir seguimiento.
- Pagina 6: suficiente → revisar tendencia; dudoso → verificar medicion; antiguo → actualizar dato; ausente → solicitar registro.
- Paginas 8–9 y 12: evidencia, procedencia, limites y decision humana.

Los candidatos de radiacion, sueño o vestibular de la propuesta original no se presentan como modulos implementados. Se conserva el alcance muscular actual.

La camara usa una trayectoria continua en tiempo global. Los objetos entran y salen con interpolacion suave, los titulos se desvanecen y los fondos se mezclan progresivamente. El astronauta permanece visible y camina entre las estaciones. La version anterior del video y del codigo se conserva en `version-anterior/`.

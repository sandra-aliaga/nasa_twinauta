# TwinNauta: montaje con grabacion real

## Version actual: HTML animado

La usuaria grabara la pagina manualmente. La exportacion MP4 animada anterior
quedo interrumpida; no usar el archivo marcado `incomplete` como video final.
Se corrigio la reproduccion para posicionar cada video al entrar en su escena
y dejarlo avanzar con su velocidad correspondiente, sin saltos periodicos
provocados por reajustar `currentTime` durante toda la escena.

Abrir `http://127.0.0.1:8768/presentacion/video-demo/index.html` mientras el
servidor local este activo. Para iniciarlo de nuevo desde la raiz del proyecto:

```bash
python -m http.server 8768 --bind 127.0.0.1
```

Poner el navegador en pantalla completa con F11 y pulsar **Play 30s**.
El boton desaparece durante la reproduccion. Recargar para volver a empezar.
La animacion incluye la apertura FAR FROM EARTH letra a letra, fundido a negro,
aparicion de TwinNauta, paneles con movimiento, grafo, paper, hospital y cierre.
Las escenas de la app usan capturas reales con acercamientos CSS; solo el grafo
conserva la grabacion de video. Las capturas llevan la etiqueta visible
**Actual app screenshot**, grande y con borde celeste resaltado.
El badge de IA tiene fondo oscuro y borde ambar.

La pagina reproduce una melodia instrumental original de 30 segundos al pulsar
Play. Es una composicion sintetizada localmente, sin grabaciones ni samples
externos: notas suaves, acordes ambientales y un arpegio que aumenta en la parte
de investigacion. El volumen de fondo deja espacio a la narracion.
Para grabarla, habilitar tambien el audio del sistema en el grabador.
Las pistas separadas son `output/playwright/twinnauta-score.wav` y
`output/playwright/twinnauta-score.mp3`. Para regenerarlas con Python y NumPy:

```bash
python presentacion/video-demo/compose_music.py
```
La marca **AI-generated footage** aparece en los fragmentos generados del
astronauta y el paciente. Los paneles ampliados proceden de capturas reales
de la aplicacion a 3840 x 2160; las cifras no se redibujaron ni se inventaron.
El panel de comparacion y el de pasos usan recortes distintos de la misma
captura real que contiene resultados SPRINT y sus siguientes pasos.

Exportacion reproducible a 1920 x 1080, 30 fps, durante 30 segundos:

```bash
node presentacion/video-demo/render-html.mjs
```

El renderizador usa Firefox de Playwright disponible con Playwright CLI en esta
maquina. En otro equipo configurar `PLAYWRIGHT_MODULE` con la ruta absoluta al
`index.mjs` del paquete `playwright`. Requiere FFmpeg. La exportacion recorre
900 fotogramas con tiempos deterministas, para evitar tirones de una captura
de pantalla en tiempo real. Resultado: `output/playwright/TwinNauta-30s-EN-HTML.mp4`.
Las vistas previas quedan en `output/playwright/html-preview/`.

Los clips generados originales son 720p/24 fps; la captura de la app es 1080p/25 fps;
exportar a 1080p/30 fps no crea detalle ni movimiento originalmente ausentes.
La tipografia y los movimientos de la composicion HTML se calculan a 30 fps.
La pagina y el renderizador HTML incluyen la melodia; la narracion se graba aparte.

La pagina requiere `output/playwright/media.json`, las capturas `state-4k.jpg`,
`actions-4k.jpg`, `dashboard-4k.jpg` y `paper-4k.jpg`, `recorrido-ingles.webm`,
`hospital-misti-5s.mp4`, `twinnauta-score.wav` y el video
original del astronauta. `media.json` contiene su ruta local relativa a la raiz
del proyecto. Estos archivos multimedia no se versionan.

Los originales permanecen en `presentacion/videos/`. Las exportaciones se guardan
en `output/playwright/`, excluido de Git para evitar subir videos pesados.

## Archivos para editar o presentar

- `TwinNauta-30s-EN-HTML.mp4`: version actual con animacion HTML.
- `TwinNauta-30s-EN.mp4`: primera propuesta, con textos en ingles,
  acercamientos, transiciones y cierre con el dominio indicado por el equipo.
- `recorrido-ingles.mp4`: grabacion real completa sin rotulos de edicion.
- `recorrido-con-zooms-18s.mp4`: solo la app, con acercamientos y textos.
- `recorrido-ingles.webm`: captura original de Playwright a 1920 x 1080.
- `hospital-sin-texto.mp4`: copia recortada para eliminar las letras de la ventana.
- `hospital-misti-5s.mp4`: paciente en cama y vista del volcan; omite la parte
  donde el personaje se incorpora. Es un corte entre dos momentos del original.
- `edit/01.mp4` a `edit/09.mp4`: segmentos del montaje por separado.

Las exportaciones son mudas para incorporar despues narracion y musica elegidas
por el equipo. No se generaron datos ni pantallas falsas para la grabacion.
El astronauta y el paciente son los clips generados aportados por el equipo;
el recorrido procede de la aplicacion local, conectada al backend y PostgreSQL.
La propuesta hospitalaria de Arequipa se presenta como vision futura.

## Recrear la edicion

Requiere FFmpeg, las fuentes DejaVu de `/usr/share/fonts/TTF/`, ambos originales
y la captura `output/playwright/recorrido-ingles.webm`.

Desde la raiz del repositorio:

```bash
bash presentacion/video-demo/render.sh
```

La captura utilizada dura 31,76 segundos. Los cortes de `render.sh` corresponden
a esa toma concreta; si se vuelve a grabar, revisar sus tiempos antes de exportar.

## Recorrido grabado

Frontend en `http://127.0.0.1:5173`, modo API y pulso habilitado. Backend en
`http://127.0.0.1:8000`, PostgreSQL local iniciado. Se integro la traduccion de
`feat/frontend-skeleton`, commit `734e808`, y se instalaron sus dependencias.

Se uso Playwright CLI con Firefox, viewport 1920 x 1080 y selector English:

```bash
playwright-cli -s=video open http://127.0.0.1:5173 --browser firefox
playwright-cli -s=video resize 1920 1080
playwright-cli -s=video snapshot
# Cerrar la guia si aparece y seleccionar English usando referencias actuales.
playwright-cli -s=video video-start output/playwright/recorrido-ingles.webm --size=1920x1080
# Inicio -> Quadriceps -> What is happening -> What could happen -> What to do
# -> Open 3D map -> Scientific library -> buscar SPRINT -> abrir paper NASA SPRINT.
playwright-cli -s=video video-stop
```

En la toma original, aproximadamente: inicio 0-3 s, estado 4-7 s, escenarios
8-10 s, acciones 11-14 s, grafo 16-19 s, biblioteca 20-23 s y paper 24-31 s.
El montaje acerca las zonas relevantes mediante recorte del video, sin modificar
el contenido del frontend. Sus textos resumen la experiencia; las limitaciones
de cada resultado siguen siendo las que muestra la aplicacion.

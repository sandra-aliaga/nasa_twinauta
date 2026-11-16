# TwinNauta: dos videos promocionales

Dos piezas de 20 segundos, 1920 × 1080, 30 fps, completamente en inglés y sin pista de audio.

## Guiones

### 01 — The Mission Continues

| Tiempo | Mensaje | Visual |
| --- | --- | --- |
| 0–3 | THE MISSION CONTINUES. | Astronauta y órbita animada |
| 3–6 | YOUR BODY CHANGES. | Escaneo y foco corporal |
| 6–9 | WHAT DO THE NUMBERS MEAN? | Indicadores separados |
| 9–13 | MEET TWINNAUTA. | Región, medición y seguimiento conectados |
| 13–17 | TRACE THE EVIDENCE. | Red de indicador, evidencia, contexto y siguiente comprobación |
| 17–20 | Understand the change. See the next step. | Cierre de marca |

### 02 — Missing Record

| Tiempo | Mensaje | Visual |
| --- | --- | --- |
| 0–3 | MISSED EXERCISE? | Registro ausente |
| 3–6 | OR JUST A MISSING RECORD? | Se distingue ausencia de incumplimiento |
| 6–10 | CONTEXT CHANGES THE QUESTION. | Región, basal y registro |
| 10–14 | CHECK THE SOURCE. | Población, método y límites |
| 14–17 | CONFIRM THE RECORD. | Siguiente comprobación humana |
| 17–20 | Connected data. Traceable evidence. Human decisions. | Cierre de marca |

## Archivos y edición

Abrir `index.html` para reproducir las dos piezas. Los storyboards muestran seis momentos de cada película. `render_films.py` contiene guiones, posiciones, efectos, movimiento de cámara y configuración de exportación.

Para regenerar, con Python, Pillow y FFmpeg disponibles:

```powershell
python render_films.py --film both
```

También admite `--film A` o `--film B`. La tipografía usa Segoe UI de Windows; adaptar FONT_DIR en otros sistemas.

## Procedencia y alcance

Se reutilizan dos imágenes ya incorporadas por la usuaria al repositorio en `presentacion/video-voxel-30s/assets/`: pdf-000.png y pdf-001.png. La documentación original las identifica como imágenes extraídas de su presentación. Se guardan copias en assets para regenerar estas piezas. No se determina aquí una licencia nueva ni autoría adicional.

Animaciones y paneles son visualizaciones conceptuales, no una grabación de la interfaz. La imagen anatómica muestra sistemas que no constituyen módulos implementados. El relato se concentra en músculo, ejercicio y evidencia. Scott 2020 y SPRINT 2024 son referencias existentes del proyecto, no validaciones clínicas de TwinNauta. El caso de registro ausente corresponde al ejemplo sintético documentado.

La exportación usa `-an`: no incluye audio. Los JSON de verificación registran duración, resolución y la única pista de video. Los archivos de la aplicación y el video previo no se modifican.

# Fuentes y alcance del pitch

Consulta: 15 de noviembre de 2026. El PDF original de Canva se conserva en su ubicacion original. Esta entrega reemplaza el relato de planificacion por el estado del prototipo comprobado en esta sesion y una proyeccion terrestre acotada.

Revision visual: se incorporaron dos fondos conceptuales generados con IA y la comparacion publicada de la diapositiva 11. El PDF principal tiene doce diapositivas; las tres de fuentes permanecen separadas. La pauta del guion sigue siendo de 300 segundos. Se agregó frecuencia cardíaca como diapositiva 8; el contraste terrestre queda en la 10 y la comparación publicada en la 11. La version anterior de diez diapositivas esta en `version-anterior/`.

## Referencias formales

1. Garcia AD. **Digital Astronaut Simulation Tool**. NASA Johnson Space Center; 27 de julio de 2023. [Pagina oficial](https://www.nasa.gov/general/digital-astronaut-simulation-tool/). Herramienta de simulacion biomecanica usada para investigacion e ingenieria. No se afirma un gemelo clinico integral ni una integracion de TwinNauta con DAS.
2. NASA TechPort. **Human Digital Twin Platform (HDTP)**. Proyecto 154412; actualizado el 22 de enero de 2026. [Registro oficial](https://techport.nasa.gov/projects/154412). Figura como proyecto tecnologico completado; eso no demuestra certificacion clinica o uso operativo en vuelo. La pagina directa requiere JavaScript: se contrasto su descripcion indexada oficial; no se inspecciono una distribucion de software o dataset del proyecto.
3. Le T. **NASA Human Research Program’s Continue Using of AI Technology to Mitigate Exploration Medical Risk**. Aerospace Medical Association 96th Annual Scientific Meeting; 2026. NASA NTRS 20260001797. [Registro oficial](https://ntrs.nasa.gov/citations/20260001797). Presentacion de congreso que describe pruebas de concepto de CMO-DA; no se trata como validacion clinica publicada del producto ni como prueba de despliegue en vuelo.
4. Scott JM, et al. **Disuse-Induced Muscle Loss and Rehabilitation: The National Aeronautics and Space Administration Bed Rest Study**. Critical Care Explorations. 2020;2(12):e0269. [DOI](https://doi.org/10.1097/CCE.0000000000000269). Nueve participantes, 70 dias de reposo en cama. Las extracciones de area muscular estan documentadas en `docs/revision-evidencia-nucleo.md`. El pitch no publica una curva individual ni extrapola sus tasas a una mision.
5. Trappe TA, et al. **NASA SPRINT exercise program efficacy for vastus lateralis and soleus skeletal muscle health during 70 days of simulated microgravity**. Journal of Applied Physiology. 2024;136(5):1015–1039. [DOI](https://doi.org/10.1152/japplphysiol.00489.2023), [PubMed](https://pubmed.ncbi.nlm.nih.gov/38328821/). Contexto de contramedidas y resultados musculares. No equiparar el conjunto con Scott a dos validaciones independientes; comprobar cohortes. No inferir una prescripcion desde sus resultados.
6. Kakihara T, Kataoka H, Tanaka S. **Effects of short-term bed rest on skeletal muscle function in patients with diabetes mellitus**. Journal of Diabetes & Metabolic Disorders. 2025;24(2):163. [DOI](https://doi.org/10.1007/s40200-025-01676-8), [PubMed](https://pubmed.ncbi.nlm.nih.gov/40657328/). Estudio primario: 50 pacientes de 65 anos o mas, hospitalizados por fractura vertebral, diez dias de reposo y ejercicios. Reporta descenso de masa y calidad muscular con fuerza preservada. No demuestra que todas las hospitalizaciones tengan ese resultado ni valida TwinNauta.
7. Padilha CS, et al. **Disuse-Induced Muscle Atrophy and Muscle Weakness From Hospitalization to Spaceflight: Exercise Succeeds in Prevention and Treatment—A Meta-Analysis**. Journal of Cachexia, Sarcopenia and Muscle. 2026. [DOI](https://doi.org/10.1002/jcsm.70259), [PubMed](https://pubmed.ncbi.nlm.nih.gov/41983453/). Sintesis secundaria consultada como contraste: las respuestas difieren por entorno y resultado; no justifica equivalencia entre vuelo y pacientes ni una dosis universal de ejercicio.
8. Mongin D, Garcia Romero J, Alvero Cruz JR. **Treadmill Maximal Exercise Tests from the Exercise Physiology and Human Performance Lab of the University of Malaga**. PhysioNet; 2021. Version 1.0.1. DOI: 10.13026/7ezk-j442. [Repositorio](https://physionet.org/content/treadmill-exercise-cardioresp/1.0.1/). Telemetria de ejercicio terrestre, separada del caso sintetico. El pitch no afirma disponer de telemetria privada de astronautas. Mantener la revision de redistribucion registrada por frontend.
9. Mulavara AP, et al. **Physiological and Functional Alterations after Spaceflight and Bed Rest**. Medicine & Science in Sports & Exercise. 2018;50(9):1961–1980. [DOI](https://doi.org/10.1249/MSS.0000000000001615), [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6133205/). Localizador: Discussion, Neuromuscular function; Fig. 4 y Table 2. La diapositiva 11 conserva los porcentajes redondeados publicados para potencia maxima del tren inferior. No son tasas diarias, efectos causales del ejercicio ni datos de pacientes. Las condiciones difieren; el grupo terrestre es un analogo experimental con voluntarios sanos. La consulta directa fue bloqueada por reCAPTCHA y redireccion del DOI; se comprobo el contenido indexado del original. No se redigitalizaron las figuras ni se verificaron los tamanos por variable: no se incluyen tamanos muestrales o intervalos inventados. Es una referencia explicativa del pitch, no una nueva regla del backend.

## Como se contrasto el relato

- Pregunta: ¿es correcto presentar TwinNauta como la invencion de un gemelo digital humano? DAS y HDTP muestran antecedentes. CMO-DA confirma que NASA tambien investiga apoyo a decisiones. Se cambia el argumento hacia una experiencia de consulta trazable, sin afirmar que NASA carezca de ella.
- Pregunta: ¿hay un puente con Tierra? El estudio primario de Kakihara aporta un contexto hospitalario concreto. El metaanalisis reciente de Padilha cuestiona la transferencia simple de resultados entre contextos. Se conserva la proyeccion como adaptacion futura, con validacion por poblacion; se retiran las afirmaciones sobre deteccion de trombosis y el piloto regional no acordado.
- Pregunta: ¿que esta implementado? Se comprobaron biblioteca, tres sintesis del caso, anatomia y telemetria contra PostgreSQL/API/frontend. Los conteos salen de `backend/data/literature/candidates/knowledge_base.json` y de las preparaciones disponibles. Son 27 candidatos y 26 resumenes, no 27 estudios revisados o validaciones del software.
- Lectura local: el contenido preparado se guarda en PostgreSQL. La demostracion se ejecuto con proveedor IA desactivado. No se ha verificado todo el producto sin red; los enlaces originales requieren conexion o copias autorizadas.

## Recursos visuales

Las imagenes de `assets/original-*` se extrajeron del PDF facilitado por el equipo, creado en Canva. La nueva diapositiva 11 reutiliza las figuras del astronauta y el paciente de esa composicion. No se atribuyen a NASA ni se presentan como imagenes del producto o de misiones reales. La procedencia y los permisos originales siguen siendo los del material del equipo. El esquema de relaciones de la diapositiva 6 explica navegacion; no es una visualizacion de resultados experimentales.

`assets/portada-orbita-ia.png` y `assets/contraste-espacio-tierra-ia.png` son fondos generados mediante la herramienta integrada image_gen. No documentan personas, tratamientos o misiones reales. Las instrucciones exactas se guardan en `IMAGENES_IA.md`. Los originales generados se conservan en su carpeta de origen; el PPTX utiliza las copias del proyecto.

## Archivos y reproduccion

- `TwinNauta_pitch_5_min.pdf`: doce diapositivas para proyectar.
- `TwinNauta_fuentes.pdf`: tres diapositivas de respaldo con enlaces.
- `TwinNauta_pitch_editable.pptx`: doce principales mas tres de fuentes; texto y diagramas editables.
- `guion_5_minutos.md`: guion actualizado, pauta de 300 segundos y respuestas breves. Ensayar para ajustar ritmo y pausas.
- `generar_pitch.py`: generador reproducible con python-pptx y Pillow; usa las imagenes locales. No cambia la aplicacion.

Para regenerar, ejecutar el generador en un entorno que tenga `python-pptx` y `Pillow`, exportar el PPTX a PDF con LibreOffice y separar las primeras doce paginas de las tres de respaldo. El entorno usado en esta sesion es temporal, en `/tmp/twinauta-pitch-env`; no se anadieron dependencias al backend o frontend.

## Frecuencia cardiaca incorporada al pitch

La diapositiva 8 muestra un esquema de señal con una ausencia, creado con elementos vectoriales. No reproduce lecturas de un participante ni representa un ECG. Los conteos 602 muestras y dos sin valor se recalcularon desde `backend/data/processed/physionet_treadmill_1.0.1/heart_rate_2_1.csv`; son metadatos de la grabacion preparada, no una medicion del astronauta virtual. La ausencia dibujada es conceptual y no localiza los valores ausentes reales.

La pagina actual del dataset y su enlace de licencia indican PhysioNet Contributor Review Health Data License 1.5.0, mientras que `LICENSE.txt` descargado indica CC BY-NC-SA 4.0. La discrepancia sigue pendiente: no se incluyeron puntos de la serie en el PDF. Referencia adicional solicitada por el repositorio: Mongin D, Chabert C, Courvoisier DS, Garcia-Romero J, Alvero-Cruz JR. **Heart rate recovery to assess fitness: Comparison of different calculation methods in a large cross-sectional study**. Research in Sports Medicine; 2021. [DOI](https://doi.org/10.1080/15438627.2021.1954513). No se aplica aqui un indice de recuperacion ni se afirma deteccion de arritmias.

Guion actualizado: 593 palabras; pauta de 300 segundos. Revision transversal y prioridades del proyecto en [evaluacion-proyecto-y-pitch](../../docs/revisiones/evaluacion-proyecto-y-pitch-2026-11-15.md). La version anterior de once diapositivas queda en `version-sin-cardiaca/`.

## Mapas y esquemas incorporados

Se sustituyeron partes textuales por diagramas editables en cinco diapositivas, conservando doce paginas de exposicion y la pauta de cinco minutos:

- Diapositiva 3: mapa de antecedentes NASA que convergen en una referencia para TwinNauta; las uniones no representan interoperabilidad de software.
- Diapositiva 4: mapa del recorrido, tres preguntas conectadas y decision humana como punto comun.
- Diapositiva 5: esquema estilo Ishikawa para ordenar preguntas sobre mediciones, registro, protocolo y recursos. Es una lista de comprobacion conceptual, no un analisis causal validado ni una atribucion de causas clinicas al caso.
- Diapositiva 6: mapa semantico que conecta observaciones, calidad y literatura con explicacion, fuente, contexto y siguiente comprobacion. Las relaciones son conceptuales; no prueban aplicabilidad individual o causalidad.
- Diapositiva 9: flujo de preparar, guardar/versionar y consultar. Se conserva la advertencia de que falta verificar el recorrido completo sin red.

La diapositiva de frecuencia cardiaca mantiene un esquema ilustrativo y los conteos auditados de la grabacion separada. La version previa a los mapas esta en `version-sin-mapas/`.

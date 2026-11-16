# Backend inicial

Entrega documental actual: [alcance, fuentes y reproducción](../docs/evidencia/revision-documental-2026-11-15.md). Se publicaron 26 resúmenes revisados documentalmente contra abstracts oficiales y seis cifras agregadas de tablas originales; un registro carece de abstract. Para instalar esta publicación en una base con seed, ejecutar `python -m app.publish_documentary_review --apply` desde `backend/`. La revisión clínica, las reglas de acciones y los parámetros de simulación conservan sus estados separados; las secciones históricas siguientes documentan las etapas previas.

Responsable: Sandra. FastAPI, Pydantic, SQLAlchemy, psycopg y PostgreSQL. Implementa el [contrato 0.3.0](../contracts/README.md), con biblioteca, síntesis contextual y contenido de demostración.

## Alcance

Catálogos, evaluaciones independientes filtradas hasta el día solicitado, tres vistas de grafo, seguimiento de acciones con revisión y bloqueo de fila, CORS y errores estructurados. La primera migración conserva casos e instantáneas como JSONB con relaciones y seguimiento de acciones separado.

Como parte del contrato vigente, `GET /api/v1/health-modules` expone el catálogo versionado de cobertura técnica. `GET /api/v1/knowledge-base/metadata` describe el paquete local de 27 candidatos bibliográficos, `GET /api/v1/papers` permite buscarlos desde PostgreSQL, `GET /api/v1/papers/{paper_id}` abre una ficha con sus límites de revisión, análisis y aplicabilidad, y `GET /api/v1/knowledge-graph?view=evidence` muestra relaciones temáticas editoriales. `GET /api/v1/assessments/{assessment_id}/guidance` consulta orientación operativa congelada. El único módulo publicado es `quadriceps_health`, con `interpretation_status: review_pending`; estas rutas no habilitan cálculos ni recomendaciones científicas.

El modelo científico sigue pendiente: los escenarios devuelven `insufficient_data`. La telemetría admite la señal sintética inicial y una grabación independiente de PhysioNet; consultar la sección de telemetría. Hay preparación opcional de resúmenes mediante un proveedor configurable y ejecución explícita por CLI; se ejecutó un piloto real de DeepSeek guardado en archivos, sin habilitar prescripción médica. Los datos iniciales del caso están en `data/demo/`, separados de los ejemplos documentales.

## Instalación y arranque

### Conexion con Neon

El proyecto Neon se vincula desde la raiz del repositorio. `neon deploy` actualiza
las conexiones en `.env.local`, excluido de Git. El backend lee primero
`backend/.env` y despues `.env.local` de la raiz; las variables del proceso tienen
prioridad sobre ambos archivos. El archivo local anterior se conserva.

`DATABASE_URL` se usa para las consultas de la aplicacion.
`DATABASE_URL_UNPOOLED`, si existe, se usa exclusivamente para Alembic con la
conexion directa. En Render, configurar estas variables en el servicio del
backend; el frontend nunca debe recibir credenciales PostgreSQL.

La configuracion Neon de la raiz mantiene PostgreSQL y no habilita servicios
adicionales. Conectar no aplica migraciones ni importa el respaldo; esas
operaciones son pasos separados. Formato del backend: `make backend-format`;
comprobacion: `make backend-check`. Formato de los archivos de configuracion Neon:
`frontend/node_modules/.bin/prettier --write neon.ts package.json package-lock.json`
(usar `--check` en lugar de `--write` para comprobar).

### Síntesis contextual y contrato vigentes

La API actual es 0.3.0, con [OpenAPI completo](../contracts/openapi.yaml) y [entrega frontend](../docs/ENTREGA_FRONTEND.md). `GET /api/v1/cases/{case_id}/assessments` descubre las evaluaciones disponibles; `GET /api/v1/assessments/{id}/context` sirve las tres secciones, sus grafos de citas, fragmentos, pasos y procedencia. La evaluación instalada `assessment_demo_001` tiene contenido disponible. Una evaluación nueva sin preparación devuelve `unavailable`, sin generar IA ni heredar la síntesis de otro caso.

Se aplicó `0005_prepared_contexts` a la instancia local. La tabla mantiene versiones separadas de los datos de evaluación y del seguimiento de acciones. El importador `python -m app.prepared_contexts data/literature/generated/deepseek-context-v3-20261114` valida el paquete en modo preview; `--execute` instala una versión de forma idempotente y verifica identidad, hash y referencias antes de publicarla. No sobrescribe una evaluación existente con contenido diferente.

Para compartir la misma base: [respaldo e instrucciones](../backups/README.md). Se restauró en otra instancia y se compararon hashes/conteos de todas las tablas y respuestas HTTP, sin necesitar los roles del origen. El respaldo no contiene claves ni contraseñas.

### Entorno local preparado

Se creó una instancia PostgreSQL propia del proyecto en `127.0.0.1:55432`, con base `twinauta` y rol de aplicación `twinauta_app`. Su contraseña aleatoria se añadió únicamente a la última `DATABASE_URL` de `backend/.env`, abriendo el archivo en modo append sin leer su contenido anterior. La clave DeepSeek se conservó. `.env` y `backend/.local/` están excluidos de Git.

La instancia se encuentra en `backend/.local/postgres`; no modifica el servidor PostgreSQL existente del puerto 5432. Se aplicaron las migraciones hasta `0004_analysis_summary`, se cargó el caso de demostración y 27 candidatos, y se importaron los 26 resúmenes disponibles. El usuario de aplicación es propietario de esta base y no es superusuario.

Desde la raíz:

```bash
make db-status
make db-start
make backend-run
```

`db-start` se necesita cuando la instancia esté detenida; ejecutarlo sobre una instancia ya activa devuelve el aviso de PostgreSQL. `make db-stop` la detiene conservando los datos. Estas órdenes presuponen las herramientas PostgreSQL ya instaladas. No se instaló un servicio de sistema ni se configuró nube.

### Cargar o actualizar resúmenes preparados

Desde `backend/`, el preview solo valida archivos y no conecta a la base:

```bash
uv run python -m app.import_prepared_analyses data/literature/generated/deepseek-corpus-v2-20261115
```

Añadir `--execute` importa en la base configurada y ya migrada. No llama a DeepSeek ni aplica migraciones por sí mismo. La carga comprueba corpus, hashes, citas y compatibilidad con los abstracts persistidos. Es atómica e idempotente: una segunda ejecución conserva los mismos 26 registros. Un contenido corregido produce otra versión identificada por su contenido y conserva el historial.

`GET /api/v1/papers/{paper_id}` ya sirve `summary.status: available`, `analysis.status: ready`, citas y procedencia para los 26 artículos, manteniendo el estado real de revisión en sus metadatos. El candidato sin abstract conserva `unavailable`. No requiere cambios de contrato ni generación en las consultas. La síntesis contextual de tres secciones continúa guardada en archivos; su publicación por evaluación es una integración separada.

La carga se verificó primero en PostgreSQL temporal con repetición, rollback ante una incompatibilidad tardía y 27 fichas consultadas por HTTP. Después se ejecutó sobre la instancia local propia del proyecto. No se modificaron bases del servidor previo.

Requisitos: Python 3.12 o posterior compatible con el manifest, uv y PostgreSQL. Ejecutar Make desde la raíz del repositorio.

1. Crear una base PostgreSQL y un usuario propios, o utilizar los provistos por el servicio de nube. El backend no crea usuarios ni bases automáticamente.
2. Copiar `backend/.env.example` a `backend/.env` y ajustar `DATABASE_URL`. Las credenciales del ejemplo son públicas y ficticias. Se admiten URLs `postgres://`, `postgresql://` y `postgresql+psycopg://`.
3. Ejecutar:

```bash
make backend-install
make migrate
make seed
make backend-run
```

La carga inicial es explícita y no sobrescribe un caso existente. Las dependencias declaradas ya se resolvieron y `uv.lock` está disponible. La instalación inicial requiere acceso al registro Python o una caché completa.

Después de arrancar, la documentación estará en `http://localhost:8000/docs` y la API en `/api/v1`. `/health/live` comprueba el proceso y `/health/ready` la conexión y las tablas PostgreSQL. Indicadores y telemetría no requieren la base; casos y evaluaciones sí.

CORS admite inicialmente `http://localhost:5173` y `http://127.0.0.1:5173`. En nube, configurar `CORS_ORIGINS` como lista JSON de orígenes concretos. Las credenciales de PostgreSQL solo pertenecen al backend.

## Primer intercambio

```bash
curl http://localhost:8000/api/v1/cases
curl http://localhost:8000/api/v1/health-modules
curl http://localhost:8000/api/v1/knowledge-base/metadata
curl 'http://localhost:8000/api/v1/papers?q=quadriceps&limit=10'
curl http://localhost:8000/api/v1/papers/literature_pmid_33251515
curl 'http://localhost:8000/api/v1/knowledge-graph?view=evidence&limit=10'
curl -X POST http://localhost:8000/api/v1/assessments \
  -H 'Content-Type: application/json' \
  --data-binary @contracts/examples/assessment-request.json
```

Conservar el `assessment_id` devuelto; los IDs documentales no son evaluaciones almacenadas. Cada solicitud crea una instantánea distinta. La consulta superpone el estado actual de acciones sin recalcular la evaluación histórica.

## Organización

- `app/main.py`, `api.py`, `errors.py`: aplicación, rutas y errores públicos.
- `app/schemas.py`: payloads y validaciones del contrato.
- `app/assessments.py`: evaluación editorial, persistencia y seguimiento.
- `app/graphs.py`, `simulation.py`: grafos y límite del modelo pendiente.
- `app/catalog.py`, `telemetry.py`: datos y reproducción de ventanas.
- `data/demo/health-modules.json`: catálogo técnico versionado de módulos; no contiene reglas clínicas habilitadas.
- `data/literature/candidates/knowledge_base.json`: metadatos del corpus local; sus 27 registros siguen pendientes de auditoría de texto completo.
- `migrations/versions/0002_literature_candidates.py`: tabla separada para candidatos bibliográficos.
- `app/database.py`, `migrations/`: tablas PostgreSQL y migración inicial.
- `app/seed.py`: carga idempotente del caso ficticio.
- `app/prepare_data.py`: verificación de originales PhysioNet y extracción reproducible de una sesión terrestre, sin modificar la API ni cargar PostgreSQL.

## Preparación de datos reales

Desde `backend/`, con Python 3.12 o posterior, sin instalar dependencias adicionales:

```bash
python -m app.prepare_data --test-id 2_1
```

Comprueba los hashes oficiales de los originales y genera un CSV de 602 muestras con dos valores de HR ausentes, más un JSON de procedencia en `data/processed/physionet_treadmill_1.0.1/`. Conserva tiempos originales y filas de origen, sin interpolar ni convertirlos a días de misión. Consultar [artefactos preparados](data/processed/README.md).

## Telemetría terrestre disponible

La grabación real tiene ID `physionet_treadmill_1_0_1_2_1`, dataset `physionet_treadmill_1.0.1` y participante original `2` (prueba `2_1`). Se carga desde los archivos preparados, sin requerir PostgreSQL ni descargar datos durante una solicitud.

```bash
curl http://localhost:8000/api/v1/telemetry/physionet_treadmill_1_0_1_2_1/metadata
curl 'http://localhost:8000/api/v1/telemetry/physionet_treadmill_1_0_1_2_1?start_s=0&end_s=120'
```

El frontend debe conservar los metadatos y avanzar mediante `next_start_s` hasta recibir `null`. Cada ventana admite como máximo 120 segundos y 2000 puntos; conserva las marcas temporales irregulares y `null` con su motivo cuando falta HR. No se interpola ni se deriva una recomendación clínica. El último dato está en 1046 segundos. El extremo exclusivo de la grabación es el menor número de punto flotante superior, `1046.0000000000002`, para incluir esa muestra sin asumir una nueva medición o cadencia. Las ventanas solicitadas conservan sus límites; solo se recortan los puntos.

La respuesta declara `origin: human_dataset`, `context: terrestrial_exercise` y `content_mode: evidence_based`. La revisión de su `source` se limita a procedencia, versión, unidades y fidelidad del archivo; no acredita validez clínica ni respuesta en microgravedad. Incluye atribución a Mongin, García Romero y Alvero Cruz (2021), DOI y licencia CC BY-NC-SA 4.0 con enlace al original. El JSON de preparación conserva su estado histórico `pending`; no se modificó para simular una revisión clínica.

La señal `recording_illustrative_001` sigue disponible y el caso ficticio conserva ese ID. La grabación humana se consulta de forma independiente por el ID documentado: no se reemplazó la historia del astronauta virtual ni se añadió una operación de listado fuera del contrato. El cargador comprueba el SHA-256 del CSV derivado contra su procedencia y rechaza inconsistencias de tiempos, conteos o identificación.

Se verificaron las funciones y después las rutas HTTP con FastAPI y PostgreSQL aislado: recorrido íntegro de las 602 muestras, dos ausencias, límites, última muestra, 404/422 y compatibilidad sintética. `Source.review_status: reviewed` registra la comprobación técnica de procedencia, unidad y fidelidad de esta grabación; no una revisión clínica de recomendaciones. La ficha de preparación mantiene su estado histórico pendiente y no se sobrescribió. Ver [evidencia de ejecución](../docs/verificacion-backend.md).

## Orientación contextual disponible

Cada evaluación nueva guarda una orientación descriptiva en su JSONB existente. No requiere otra tabla o migración adicional a las ya existentes. Consultarla no usa una API de IA, no recalcula la evaluación y no modifica sus datos.

```text
GET /api/v1/assessments/{assessment_id}/guidance
```

- `insufficient_data`: indicadores ausentes, falta de basal declarado, calidad sospechosa o métodos no comparables. Se conservan los motivos y observaciones consideradas.
- `partial`: registros de ejercicio sin confirmar o equipo señalado como no disponible. El equipo de una sesión histórica no prueba su estado actual: el siguiente paso propone confirmarlo.
- `review_pending`: datos accesibles sin esas incidencias operativas; la interpretación fisiológica todavía necesita reglas revisadas. No equivale a estado saludable.
- `not_supported`: región sin un módulo técnico único/implementado o evaluación antigua sin orientación guardada. Un ID de evaluación inexistente devuelve 404.

Los pasos son propuestas operativas con elegibilidad `unknown` y revisión pendiente; no son cambios de carga o prescripciones. No hay umbrales ni puntuación de riesgo. La comparación de métodos es conservadora y no infiere equivalencias desde nombres parecidos. Las filas futuras se excluyen antes de construir la orientación.

Se guardan versiones de módulo, reglas operativas y corpus junto a la evaluación. Cambiar los registros del caso no cambia su orientación anterior; una evaluación antigua no obtiene orientación nueva de forma silenciosa. `GET /assessments/{id}` conserva su estructura previa sin exponer metadatos internos adicionales.

Esta implementación completa el comportamiento técnico de lectura y los estados operativos del primer módulo, no KB-05 ni un motor clínico general. La aplicabilidad de cada paper y la trayectoria muscular siguen sin habilitarse automáticamente.

## Preparación opcional de abstracts con IA

Requiere una base migrada y sembrada; la migración nueva `0004_analysis_summary` añade un campo nullable y conserva registros anteriores. **No se aplicó a la base de Sandra.** Se verificó únicamente en PostgreSQL temporal aislado. El código no aplica migraciones automáticamente.

Sin `--execute`, el comando solo muestra qué abstracts seleccionados están disponibles en la base, sin escribir análisis ni llamar a proveedores:

```bash
cd backend
uv run python -m app.analyze_papers --paper-id literature_pmid_33251515
```

La configuración por defecto es `ANALYSIS_PROVIDER=disabled`. Para una instalación local de Ollama existente, configurar en el entorno privado:

```dotenv
ANALYSIS_PROVIDER=ollama
ANALYSIS_URL=http://127.0.0.1:11434/api/chat
ANALYSIS_MODEL=nombre-del-modelo-ya-instalado
```

No se instala Ollama ni se descargan modelos desde el backend. Para un servicio compatible con Chat Completions, utilizar `ANALYSIS_PROVIDER=openai_compatible`, la URL completa de su endpoint `/chat/completions`, el modelo elegido y `ANALYSIS_API_KEY` cuando corresponda. Esto es compatibilidad de protocolo HTTP, no garantía para todos los modelos o servicios. El adaptador usa JSON y valida localmente el esquema. Referencias: [Ollama chat](https://docs.ollama.com/api/chat), [salidas estructuradas](https://docs.ollama.com/capabilities/structured-outputs) y [compatibilidad de Gemini](https://ai.google.dev/gemini-api/docs/openai). Se preparó DeepSeek como proveedor de análisis; se ejecutó el piloto local descrito más abajo. Los créditos Google no se confirmaron.

Configuración local preparada para DeepSeek: `backend/.env` privado selecciona `openai_compatible`, endpoint `https://api.deepseek.com/chat/completions`, modelo `deepseek-v4-pro`, timeout de 60 s, máximo de 2048 tokens de salida y `ANALYSIS_THINKING=disabled`. Solo falta pegar la clave en `ANALYSIS_API_KEY=`. El archivo está excluido de Git; `.env.example` mantiene generación deshabilitada como valor compartido. La configuración se usó después en el piloto real descrito más abajo; no implica evaluación científica completa.

El parámetro opcional `ANALYSIS_THINKING` se envía únicamente cuando está configurado y exige el adaptador Chat Completions. Se incluye en la identidad de caché para no reutilizar un análisis de otro modo. DeepSeek activa razonamiento por defecto; la desactivación explícita sigue su [documentación](https://api-docs.deepseek.com/guides/thinking_mode/). Otros proveedores pueden no admitir este parámetro: omitirlo al cambiarlos. El modelo y el límite de salida siguen siendo configurables; el límite de tokens no es un tope monetario global.

Con proveedor preparado y autorización para ejecutarlo:

```bash
uv run python -m app.analyze_papers --paper-id literature_pmid_33251515 --execute
```

- Solo se procesan IDs explícitos, sin generar todo el corpus por defecto. Se puede pasar más de un ID; cada paper se guarda en su propia transacción. `--force` evita la caché y puede consumir otra llamada.
- Se reutiliza el último intento solo si terminó correctamente y coincide en texto, proveedor/endpoint, modelo y versión de prompt. Cambiar el abstract invalida su reutilización. Un intento fallido no se anuncia como una preparación exitosa.
- La solicitud tiene timeout y límite de salida; no hay reintentos ni cambio automático de proveedor. Los errores no incluyen claves ni cuerpos de respuesta del servicio.
- El modelo devuelve resumen y elementos tipados. Sus fragmentos de apoyo deben existir literalmente en el abstract, normalizando espacios. Una cita inexistente, una salida truncada o un campo de revisión añadido por el modelo rechazan el resultado.
- El backend asigna `review_status: pending` y localizador `abstract`. Esta comprobación de fragmentos no demuestra que el resumen sea semánticamente correcto: Medicina debe revisarlo. No se extraen estadísticas aprobadas ni se habilitan acciones desde esta generación.
- Se guardan intentos `running`, `ready` o `failed`, hash de entrada, modelo/endpoint identificado y prompt. Los GET consultan resultados persistidos y nunca generan contenido ni consumen créditos. Resumen y análisis salen del mismo intento; si no hay resultado vigente, se explicita su ausencia.

Verificación técnica: se usó un proveedor HTTP **simulado local**, con respuestas de prueba, y PostgreSQL aislado. Se comprobaron ambos protocolos, caché, revisión pendiente, fallos, fragmentos inexistentes, salida truncada y preview sin llamadas. No se evaluó calidad de un modelo real ni funcionamiento completo de la aplicación en vuelo.

## Piloto real: tres resúmenes del caso

`app.prepare_context` prepara explícitamente entre uno y tres abstracts y después una síntesis del caso, con tres secciones: fundamento de la alerta, escenario sin abordar el problema y siguientes pasos. No se ejecuta desde GET ni requiere PostgreSQL. Sin `--execute` muestra el alcance sin escribir ni consumir API:

```bash
cd backend
uv run python -m app.prepare_context --paper-id literature_pmid_33251515 literature_pmid_38328821 --output-dir /tmp/twinauta-context
```

Añadir `--execute` permite hasta tres llamadas en este ejemplo, con el proveedor configurado y un destino nuevo. `--assessment ruta.json` permite otra instantánea compatible con `Assessment`. `--prepared-papers-dir ruta` reutiliza resúmenes previos solo si coinciden ID, abstract/hash, modelo y prompt, y las citas vuelven a validarse; en ese modo solo se solicita una síntesis. Un fallo detiene el trabajo y guarda el progreso; no hay reintentos automáticos. Cambiar de destino y volver a ejecutar puede generar gasto adicional.

El backend proporciona observaciones, orientación operativa y evidencia candidata. La IA selecciona IDs de fragmentos verificados y pasos existentes; no asigna probabilidades ni habilita tratamientos. Se rechazan referencias desconocidas. `context.json` conserva entrada por hash, versiones, tres secciones, fragmentos de evidencia y tres vistas `GraphPage` con aristas `cites`/`llm_suggestion` pendientes. Estas aristas indican citas propuestas, no respaldo científico aprobado. Si no hay fuentes para una sección, puede contener únicamente el nodo del resumen.

**Ejecución real inicial:** dos abstracts preparados y una síntesis estructuralmente válida con DeepSeek Pro, en cuatro llamadas totales. El primer intento de síntesis se rechazó por una cita no literal; se conservaron los dos resúmenes y se cambió a selección de fragmentos por ID. Archivos en `data/literature/generated/deepseek-pilot-20261114/` y `data/literature/generated/deepseek-context-v2-20261114/`. No se cambió la base de Sandra.

**Calidad pendiente:** la lectura del resultado encontró una formulación que confunde basal con estado actual, una afirmación cuya sección no cita el paper correspondiente y una descripción imprecisa de los pasos. Se registraron en `quality-review.json`. La validación de fragmentos verifica procedencia literal, no corrección semántica. El borrador permanece sin aprobación para uso de producto. En ese punto se preparó prompt `context-synthesis-0.3`; su ejecución posterior y la inspección del resultado se describen en la sección de preparación completa. El caso no tiene medición actual de área ni torque, por lo que no permite diagnosticar atrofia o predecir una trayectoria individual.

Las tres respuestas aceptadas reportaron 10 073 tokens de entrada y 3022 de salida. Su estimación según las tarifas consultadas es US$0,012632–0,025263; excluye el intento de síntesis rechazado, cuyo uso no quedó registrado en la versión inicial. No es el saldo ni la factura total. El transporte actual conserva los tokens reportados también cuando falla la validación posterior. Se comprobó el formato y los IDs de las salidas reales y se probaron las ramas de error con respuestas simuladas.

Los archivos son borradores locales. **Todavía no se importan a PostgreSQL ni se muestran mediante los endpoints o la interfaz.** No se sustituyeron las instantáneas originales. Falta revisar contenido, definir publicación versionada y acordar la exposición contextual con frontend.

## Preparación completa de los abstracts disponibles

Se completaron las ejecuciones disponibles del corpus: **26 abstracts preparados, uno omitido por ausencia de texto**, y síntesis del caso con prompt `context-synthesis-0.3` ejecutado. La inspección de esa síntesis resolvió los problemas de basal/estado actual y pasos detectados en el piloto anterior; continúa pendiente de Medicina. Los archivos vigentes y el historial están en [generated/README.md](data/literature/generated/README.md).

El protocolo `abstract-analysis-0.2` solicita IDs de fragmentos de hasta 400 caracteres; el backend recupera el texto exacto y devuelve el mismo `AnalysisDraft` público. Esto evita que el modelo transcriba citas con modificaciones. No garantiza interpretación semántica correcta. Los borradores previos `0.1` pueden reutilizarse solo con fuente/hash, modelo y citas válidos; conservan su versión original.

Para revisar el alcance de otro lote sin consumir llamadas, desde `backend/`:

```bash
uv run python -m app.prepare_abstracts --all --reuse-dir data/literature/generated/deepseek-corpus-v2-20261115 --output-dir /tmp/twinauta-abstract-preview
```

Con el mismo corpus y proveedor, el preview informa cero llamadas pendientes, 26 reutilizables y uno sin abstract. `--paper-id ID...` permite seleccionar un subconjunto en lugar de `--all`. La ejecución requiere `--execute` y un destino nuevo; procesa cada pendiente una vez y registra resultados/uso individual. Se detiene ante errores de acceso, saldo o límite del proveedor, tres fallos consecutivos o interrupción. No reintenta automáticamente y conserva los resultados anteriores. Los archivos locales todavía no alimentan las rutas bibliográficas de PostgreSQL.

## Paquete científico local

La CLI prepara una carpeta transportable usando exclusivamente archivos del repositorio. No necesita PostgreSQL, proveedor de IA ni conexión a Internet; no aplica migraciones ni carga registros en la base.

Desde `backend/`, con las dependencias del proyecto ya disponibles:

```bash
uv run python -m app.scientific_bundle build --output-dir /tmp/twinauta-scientific-bundle
uv run python -m app.scientific_bundle verify /tmp/twinauta-scientific-bundle
```

El destino debe ser nuevo. Incluye `corpus.json`, `knowledge_base.json`, `health-modules.json`, `indicators.json` y un `manifest.json` con versiones, tamaños, hashes SHA-256 y exclusiones. Construir dos veces desde los mismos archivos produce el mismo identificador. Los hashes detectan cambios respecto al manifiesto; no autentican a su autor ni certifican revisión científica.

Para seleccionar esa biblioteca, configurar `SCIENTIFIC_BUNDLE_PATH` con la ruta de la carpeta y reiniciar el proceso. Sin esa variable se utilizan los archivos originales. Un paquete configurado inválido produce un error y no se sustituye silenciosamente por otra biblioteca. Se comprueban estructura, conteos, identificadores únicos, referencias a indicadores y coherencia de versiones. Un candidato sin revisar no puede declarar elegibilidad clínica o de parámetros.

Esta primera entrega contiene **27 candidatos, ninguno revisado**, y los catálogos actuales. No incluye PDFs, textos completos, análisis generados, reglas clínicas, base de datos, telemetría ni recursos del frontend. Las reglas operativas se ejecutan desde el código: el manifiesto registra la versión compatible, no las distribuye como reglas clínicas.

La selección cambia la fuente local del catálogo y de una carga explícita posterior; **no actualiza registros ya persistidos ni sus instantáneas**. El seed actual conserva las filas existentes y la búsqueda conserva su versión de corpus actual. Instalar un corpus distinto requerirá definir y verificar su actualización y sincronización con PostgreSQL. Tampoco se ha demostrado todavía el recorrido completo de la interfaz sin Internet: los enlaces a papers remotos necesitan conexión si el documento no está instalado.

Se verificaron construcción reproducible y carga del catálogo con conexiones de socket bloqueadas; rechazo de alteraciones, conteos incoherentes, IDs duplicados, elegibilidad sin revisión, indicadores desconocidos, archivos simbólicos y destino existente. Las comprobaciones se ejecutaron con copias temporales, sin acceder a la base de datos.

## Preparación de la revisión científica

La [revisión documental del núcleo](../docs/revision-evidencia-nucleo.md) contiene las primeras extracciones de Scott 2020 y SPRINT 2024, sus localizadores y el contraste con NASA y otras publicaciones. [Datos estructurados](data/literature/extractions/core-studies.json): dos tasas de área y cuatro medias de torque con DE. Se comprobaron las tablas originales, pero la revisión de Medicina sigue pendiente. No se importan al corpus ni a los grafos automáticamente y no habilitan reglas o simulación.

Desde `backend/`, generar una carpeta nueva para entregar a Medicina:

```bash
uv run python -m app.audit_literature --output-dir /tmp/twinauta-literature-review
```

El comando utiliza el corpus local seleccionado (incluido `SCIENTIFIC_BUNDLE_PATH` cuando esté configurado), sin PostgreSQL, IA ni acceso a la red. No sobrescribe carpetas existentes ni modifica artículos, estados de revisión o elegibilidad.

- `inventory.json`: conteos, identificadores repetidos y familias de cohortes previamente señaladas en el corpus para comprobar. Una familia no acredita participantes compartidos ni independencia.
- `review-queue.csv`: índice de artículos, enlaces, disponibilidad del abstract e incidencias de metadatos.
- `review-queue.json`: fichas con identificadores y hash del abstract, contexto indexado sin revisar y campos de revisión vacíos. Incluye población/grupos, métodos/unidades, protocolo, resultados con estadísticas y localizadores, límites, cohortes, contraste independiente, comparación con NASA y condiciones de aplicabilidad/acciones.

**Procedimiento humano:** abrir el original y sus suplementos, completar cada extracción con tabla/figura/página, comprobar cohortes y buscar evidencia que cuestione la interpretación. Registrar responsable y fecha. Dejar explícitamente pendiente cualquier campo que no pueda verificarse. La herramienta no descarga textos ni completa esos campos; tampoco importa las fichas rellenadas al backend o habilita reglas. Esa revisión y su incorporación requieren un paso posterior controlado.

La comprobación local inicial encontró 27 registros, 26 abstracts, un registro sin abstract y ningún identificador DOI/PMID/PMCID repetido después de normalizar espacios exteriores y mayúsculas. No detecta todas las variantes bibliográficas ni demuestra independencia. Se verificaron exportación reproducible, lectura CSV/JSON, incidencias, detección de identificadores repetidos y preservación del destino con sockets bloqueados.

## Validación de las fichas rellenadas

Editar únicamente `review` dentro de cada ficha de `review-queue.json`. Conservar el inventario y todos los campos de procedencia exportados. Desde `backend/`:

```bash
uv run python -m app.review_literature /tmp/twinauta-literature-review
```

El comando valida sin escribir. Para guardar una recepción local separada, añadir `--output-dir /tmp/twinauta-review-receipt` con un destino nuevo. La recepción incluye las fichas normalizadas y un `receipt.json` con versión del corpus, conteos y hashes del inventario, entrada y copia normalizada. No se importa a PostgreSQL ni se modifica el corpus.

- Estados admitidos: `pending`, `in_progress`, `ready_for_review`. El último indica completitud estructural para revisión, **no aprobación científica**. Las plantillas vacías exportadas son válidas como pendientes.
- Una ficha lista requiere responsable, fecha ISO 8601 con zona horaria, todos los campos narrativos, límites y fuentes de contraste y NASA. Si una dimensión no aplica, explicarlo en su campo. Los resultados numéricos pueden quedar vacíos en trabajos sin extracción cuantitativa; explicarlo en la decisión.
- Cada resultado numérico usa `outcome`, `value`, `statistic_type`, `unit`, `group`, `timepoint`, `source_locator` y opcionalmente `notes`. El valor debe ser finito. Intervalos o dispersiones necesitan entradas explícitas con su tipo; no deducirlos ni mezclar magnitudes.
- Cada fuente de contraste o NASA usa `url` (HTTP/HTTPS), `locator` y `finding`. Su presencia y formato no prueban contenido, independencia, pertenencia a NASA ni que el enlace sea accesible: se comprueba durante la revisión humana.
- Se rechazan IDs desconocidos/repetidos, filas faltantes, cambios en metadatos o hash del abstract y corpus diferentes. Si cambió el corpus instalado, exportar de nuevo y reconciliar las notas; no editar el hash para forzar aceptación. Esta versión recibe la cola completa.
- Los campos desconocidos y estados de aprobación no se admiten. La recepción declara aprobación científica y elegibilidad clínica/de parámetros como `false`, incluso con todas las fichas listas. No crea reglas ni recomendaciones.

Se verificaron 18 comprobaciones con sockets bloqueados, incluidas fichas sintéticas completas (solo para comprobar el programa), cambios de fuente, duplicados, campos faltantes, fechas sin zona, valores no finitos, resultados sin localizador, recepción y preservación del destino. Ningún ejemplo de verificación se incorporó como evidencia científica.

## Exportación local de las tres vistas del grafo

Desde `backend/`, generar snapshots de consulta o fixtures para frontend sin arrancar PostgreSQL ni consumir APIs:

```bash
uv run python -m app.export_knowledge_graph --output-dir /tmp/twinauta-knowledge-graphs
```

Opcionalmente, añadir `--paper-id literature_pmid_33251515` para limitar cada vista al paper y vecinos por tema, o `--page-size 10` para comprobar la fusión de páginas (entre 1 y 100 papers por página). El destino debe ser nuevo. Se utiliza el corpus local configurado y se rechazan versiones no soportadas por la proyección actual.

La carpeta contiene un `manifest.json`, `paper-cards.json` con las 27 fichas breves y enlaces de acceso, y archivos `evidence-NNN.json`, `scenario-NNN.json`, `actions-NNN.json`. Cada archivo gráfico respeta `GraphPage`; el manifiesto enumera páginas, conteos, tamaños y hashes. Las fichas breves incluyen todo el corpus, también al exportar un vecindario, para resolver IDs; no incluyen abstracts, resúmenes o estadísticas revisadas.

Frontend puede cargar estas páginas como fixtures y fusionar por `node.id` y `edge.id`. Los nodos de tema se repiten entre páginas; los papers se paginan sin repetirse dentro de una vista. Para recorrer el export usar la lista de archivos del manifiesto. Los cursores de la API solo corresponden si filtros, versión y datos persistidos coinciden; el export no consulta ni sincroniza PostgreSQL. No equivale a implementar navegación offline en la interfaz.

Las tres vistas actuales son selecciones temáticas: no prueban pronóstico, causalidad ni eficacia de una acción. Todas las aristas exportadas son `addresses` con base `editorial_classification`, revisión pendiente y localizador `classification.topics`. El vecindario depende del corpus y sus etiquetas; no representa todas las publicaciones relacionadas. No se inventan citas entre papers ni relaciones de apoyo/contradicción. Las etiquetas compartidas pueden dar lugar a vecindarios amplios.

Verificado con sockets bloqueados: esquema, hashes, reproducibilidad, tres vistas, recorrido completo de páginas, fuentes y extremos resolubles, vecindario, límites y preservación de destino. Se cotejó cada página con la función del servicio usando una sesión simulada con registros en memoria; esta comprobación no ejecutó HTTP ni PostgreSQL. El corpus actual produce 22 papers en evidencia, 23 en escenarios y 17 en acciones; los conteos se solapan y no miden calidad científica.

## Formato y verificación

```bash
make backend-format
make backend-check
```

Se incluye Ruff y configuración de hooks locales; `prek install` requiere que el checkout permita escribir en `.git`. No se creó CI ni una suite de pruebas.

Se ejecutaron migración, seed doble, 31 llamadas HTTP y persistencia tras reinicio de API con PostgreSQL 18.6 y Python 3.12.12. `make backend-check`, hook backend y `uv lock --check` pasaron. La instancia de prueba ya se detuvo. Los detalles y límites están en [verificación local](../docs/verificacion-backend.md); esto no valida el modelo clínico ni los endpoints propuestos del explorador 0.3.

Para nube, el proveedor sigue pendiente. Migrar y cargar datos antes de exponer la demo. Desde `backend/`, el comando base es `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000`; ajustar el puerto al proveedor y no usar `--reload`. Esta versión de integración usa contenido ficticio y no incluye autenticación.

## Parametrización de SQL

Las búsquedas, filtros, IDs e inserciones usan SQLAlchemy, que envía valores como parámetros separados. El patrón de búsqueda se construye como dato y se pasa a `ilike`, sin concatenarlo al SQL. Las consultas textuales de salud son constantes sin entrada del cliente. El script local de creación de roles/base usó composición segura de psycopg (`Identifier` y `Literal`) para DDL; no interpolación libre de nombres o contraseña.

Se verificaron búsqueda e ID con una cadena de inyección: el contenido no aparece en el texto SQL y sí en sus parámetros; no se alteraron tablas o filas. Resultado en [sql-verification.json](../backups/sql-verification.json). Referencias: [parámetros](https://www.psycopg.org/psycopg3/docs/basic/params.html) y [composición segura](https://www.psycopg.org/psycopg3/docs/api/sql.html).

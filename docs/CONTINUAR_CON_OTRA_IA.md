# Traspaso de TwinNauta a otra IA

## Instrucción inicial sugerida

```text
Continúa TwinNauta desde este repositorio. Lee AGENTS.md,
docs/ENTREGA_FRONTEND.md, docs/backlog-backend-v2.md y este documento.
Prioriza consolidar el contrato modular 0.3 con frontend (KB-01).
El backend 0.2 funciona; no lo reconstruyas. La biblioteca contextual,
los resúmenes de IA y el uso offline son el núcleo del siguiente incremento.
Se autorizó implementación backend, pero no desplegar/contratar servicios,
construir la interfaz de mi compañera ni añadir CI o suites extensas.
Usa Concord con tu propia identidad antes de editar. Comprueba el estado
actual de Git y conserva cambios existentes. Informa avances, hallazgos
y cualquier conclusión que obligue a cambiar lo implementado.
```

## Decisiones confirmadas

- Sandra lleva backend; su compañera implementa toda la interfaz. React/TypeScript/Vite/Tailwind mínimo; Python/FastAPI/PostgreSQL en backend.
- El núcleo es apoyo contextual: región/indicador → basal/evolución/contexto → evidencia comparable → explicación y siguientes pasos. No es una recomendación fija por paper ni una simple biblioteca.
- Motor ampliable por módulos. MVP: cuádriceps, área transversal relativa al basal y torque; ejercicio como contexto y frecuencia cardíaca terrestre didáctica. No inventar soporte de todo el cuerpo.
- Un corpus común con tres vistas: evidencia, implicaciones/escenario y acciones/contramedidas. Múltiples papers, métodos, resultados y limitaciones visibles, ficha y original.
- IA para analizar abstracts/textos, resumir y sugerir relaciones/intervenciones. Salida trazable y pendiente de revisión; no diagnóstico/prescripción autónomos desde abstracts. Proveedor configurable, elección futura calidad/coste; posibles créditos Google sin confirmar.
- Consulta preparada para funcionar sin Internet mediante corpus/índice/resúmenes/reglas locales versionados. Modelo local es una opción posterior; no se eligió ni integró.
- Medicina revisa evidencia, reglas y acciones. No inventar confianza, umbrales, intervalos ni relaciones causales; separar área, volumen, fibras y torque.

## Qué existe y qué no

Backend 0.2 implementa nueve operaciones, evaluación inicial sintética, tres grafos introductorios, seguimiento con revisión y persistencia PostgreSQL. `simulation.py` mantiene el límite de información insuficiente: modelo científico no habilitado.

PhysioNet real está integrado de manera independiente: `physionet_treadmill_1_0_1_2_1`, 602 muestras, dos faltantes. Conserva el caso y grabación sintéticos. `Source.review_status: reviewed` se refiere a comprobación técnica de procedencia/unidades de esa grabación, no a revisión clínica. La ficha histórica de preparación sigue pendiente y no se sobrescribió.

Se probaron migración, seed doble, 31 llamadas HTTP, telemetría y persistencia tras reiniciar API. Ruff, hook y lock check pasaron. Python 3.12.12/PostgreSQL 18.6 aislado. Servicios detenidos; evidencia temporal `/tmp/twinauta-be01.GDNTG0/`. Ver `docs/verificacion-backend.md`; volver a comprobar el entorno en otra máquina.

La propuesta 0.3 está en `contracts/drafts/scientific-explorer-0.3/`, separada del contrato vigente. Contiene seis operaciones propuestas, JSON Schema y ejemplos. Como primeros incrementos de KB-02/03, `GET /api/v1/health-modules` expone el catálogo técnico versionado con `quadriceps_health` en revisión pendiente, `GET /api/v1/knowledge-base/metadata` describe el paquete local de 27 candidatos, `GET /api/v1/papers` busca esas tarjetas desde PostgreSQL y `GET /api/v1/papers/{paper_id}` abre su ficha bibliográfica con análisis y aplicabilidad no preparados. Los papers siguen sin auditoría de texto completo ni estadísticas revisadas; tampoco están implementados el motor contextual general, generación IA ni autonomía offline completa.

## Fuentes y datos locales

- `backend/data/raw/`: artículos/suplementos Scott 2020, SPRINT 2024, Excel de fibras y originales PhysioNet. Este último pasa hashes del proveedor.
- `backend/data/raw/nasa_mr079g/`: doce CSV, manifiesto, metadatos y nueve MD5 CFT70 coincidentes con NASA. Unidades/Angle/grupos/calendario no resueltos: no importar semántica por inferencia.
- `backend/data/raw/research_pending/`: informe, documentos NASA y diccionario Campaign17. No demuestra semántica CFT70; se reportaron inconsistencias de códigos/unidades. Mantener la cautela y revisar el original.
- `backend/data/processed/physionet_treadmill_1.0.1/`: sesión derivada y procedencia, reproducibles con `python -m app.prepare_data --test-id 2_1` desde backend.
- `backend/data/literature/candidates/`: 27 publicaciones candidatas, 26 abstracts, 23 PMCID, seis consultas originales; 130 registros recuperados/120 IDs únicos antes de selección. Todos identificados, no auditados a texto completo. Bibliografía, selección y preguntas de contraste conservadas. Headstart/Open Knowledge Maps no está integrado; la búsqueda usada fue Europe PMC.

El modelo lineal Scott 2020 tiene dominio y población propios; otras síntesis temporales requieren contraste, no una sustitución automática. Las publicaciones NASA pueden compartir cohorte. Los registros de ejercicio virtuales siguen siendo sintéticos.

## Estado de Git y coordinación

Hay cambios de código/documentación y archivos nuevos sin commit/push hechos por esta sesión. Inspeccionar `git status` y diffs antes de continuar. `schemas.py` y parte de `telemetry.py` ya tenían cambios previos: conservarlos. No limpiar archivos desconocidos ni resetear el árbol.

Concord está configurado. El ID `codex:1b0bf139` pertenece a la sesión anterior: **no reutilizarlo**. Registrar la identidad propia del nuevo cliente. BE-01/03/14 están completados con alcance técnico/discovery; BE-02 y BE-16 quedaron para revisión. Consultar el estado actual, no asumir que la lista histórica sigue vigente. El backlog v2 usa nuevos IDs KB y no está íntegramente cargado a Concord; registrar al asignar.

No lanzar automáticamente toda la flota. Comenzar por KB-01 y delimitar archivos; después catálogo, servicios bibliográficos y análisis configurable pueden avanzar en paralelo con auditoría de Medicina. Las implementaciones que dependan de una unidad o regla sin comprobar permanecen bloqueadas, pero la biblioteca puede mostrar candidatos explícitamente pendientes.

## Verificación de esta entrega documental

Los ejemplos de la propuesta se validaron con AJV Draft 2020-12 disponible localmente; tipos/referencias y extremos de aristas comprobados. El chequeo de formato URI/date se excluyó de AJV. La validación documental no equivale a ejecutar las rutas propuestas ni aprobar contenido clínico.

No instalar Context7 ni usarlo salvo petición expresa. Reutilizar formato/hook del proyecto; no añadir nuevas herramientas por iniciar otra sesión. No modificar frontend más allá de documentación acordada.

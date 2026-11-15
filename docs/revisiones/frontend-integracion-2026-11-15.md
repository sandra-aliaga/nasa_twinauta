# Revision de integracion frontend - 2026-11-15

Se integro `origin/feat/frontend-skeleton` hasta `ddb46c5` sobre `main` (`07466df`), sin conflictos. No se modificaron los contratos vigentes, las credenciales ni los datos de PostgreSQL. No se realizaron llamadas a proveedores de IA.

## Verificado

- Instalacion reproducible con `npm ci --no-audit --no-fund` (189 paquetes).
- `make check`: formato y lint backend, Prettier, TypeScript y build Vite pasan.
- Navegador Firefox conectado a la API real: catalogos, modelo 3D, seleccion de cuadriceps, reutilizacion de `assessment_demo_001` y las tres secciones de sintesis preparada.
- Biblioteca: busqueda, ficha de Scott 2020 con resumen preparado y fragmentos, y grafo bibliografico servidos por la API.
- Telemetria terrestre: metadatos y las nueve ventanas hasta el final de la grabacion respondieron HTTP 200; se verificaron la carga de la grafica y los controles de reproduccion y pausa. La habilitacion es exclusivamente para esta ejecucion local.
- La ausencia de trayectoria muscular corresponde al estado del backend: el modelo cientifico sigue pendiente. No es un error de renderizado.

## Pendientes encontrados

1. **Paginacion de la lista bibliografica.** `ExplorerView.tsx` muestra solo `items` de la primera respuesta y no consume `page.next_cursor`. La API devuelve por defecto 25 registros; al quitar el filtro de region, el corpus de 27 no puede recorrerse completo desde la lista. El grafo bibliografico si tiene carga de paginas. Anadir una accion para cargar la pagina siguiente y reiniciar el cursor al cambiar filtros.
2. **Grafo de la sintesis contextual.** `GraphExplorer.tsx` y `useGraph.ts` siguen consultando `/graphs/{view}` (Graph original). `ContextSection.tsx` presenta las relaciones de `/context` como lista de texto. Para ampliar visualmente los fundamentos de los resumenes, conectar sus tres GraphPage conservando la distincion entre datos, reglas y citas. El grafo global de biblioteca ya funciona.
3. **Reutilizacion por escenario.** `openOrCreate` busca coincidencias por region y dia, pero no compara `reference_start_day` ni `horizon_days`. Hoy la interfaz usa valores constantes. Si se vuelven configurables, comprobar tambien esos parametros antes de reutilizar una evaluacion.
4. **Tamano del build.** Vite avisa de chunks mayores a 500 kB: aproximadamente 708 kB para la entrada y 1 MB para el visor 3D. El GLB publico se redujo a 2.6 MB. No impide ejecutar; queda optimizacion pendiente.

No se cambiaron componentes visuales durante esta revision. La revision cientifica, la licencia de redistribucion pendiente indicada por frontend y el despliegue en nube siguen siendo trabajos separados.

## Ejecucion local

PostgreSQL usa la instancia existente del proyecto en `127.0.0.1:55432`. Si esta detenida, desde la raiz:

```bash
make db-start
```

En una terminal, desde `backend/`:

```bash
ANALYSIS_PROVIDER=disabled .venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
```

En otra, desde `frontend/`:

```bash
VITE_DATA_SOURCE=api VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1 VITE_ENABLE_HEART_RATE=true npm run dev
```

Interfaz: http://127.0.0.1:5173. API interactiva: http://127.0.0.1:8000/docs. Estas variables son de proceso y no sobrescriben `.env`. Mantener el panel cardiaco desactivado en distribucion publica hasta resolver la licencia documentada por frontend.

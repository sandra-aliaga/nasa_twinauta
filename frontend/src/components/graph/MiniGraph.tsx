import type { GraphView } from "../../api";
import { useGraph } from "../../hooks/useGraph";
import { VIEW_LABELS } from "../../lib/graph";
import { GraphCanvas } from "./GraphCanvas";

type MiniGraphProps = {
  assessmentId: string;
  view: GraphView;
  onExpand: () => void;
};

/** Small read-only preview over the body; the full view opens on demand. */
export function MiniGraph({ assessmentId, view, onExpand }: MiniGraphProps) {
  const state = useGraph(assessmentId, view);

  return (
    <div className="absolute right-4 top-4 z-10 hidden w-72 overflow-hidden rounded-lg border border-slate-700 bg-slate-950/85 shadow-xl backdrop-blur md:block">
      <div className="flex items-center justify-between border-b border-slate-800 px-3 py-1.5">
        <span className="text-xs text-slate-300">
          Relaciones · {VIEW_LABELS[view]}
        </span>
        <button
          type="button"
          onClick={onExpand}
          className="rounded px-2 py-0.5 text-xs text-sky-300 hover:bg-sky-500/10"
        >
          Ampliar
        </button>
      </div>
      <button
        type="button"
        onClick={onExpand}
        aria-label={`Ampliar grafo de ${VIEW_LABELS[view]}`}
        className="block h-40 w-full cursor-zoom-in"
      >
        {state?.status === "ready" && state.data.nodes.length > 0 ? (
          <div className="pointer-events-none h-full w-full">
            <GraphCanvas graph={state.data} compact />
          </div>
        ) : (
          <span className="text-xs text-slate-500">
            {state?.status === "error"
              ? "No se pudo cargar el grafo"
              : state?.status === "ready"
                ? "Sin relaciones"
                : "Cargando…"}
          </span>
        )}
      </button>
    </div>
  );
}

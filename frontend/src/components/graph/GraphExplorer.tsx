import { useEffect, useRef, useState } from "react";

import type { Graph, GraphView } from "../../api";
import { useGraph } from "../../hooks/useGraph";
import { KIND_LABELS, KIND_STYLES, VIEW_LABELS } from "../../lib/graph";
import {
  CLAIM_KIND_LABELS,
  ENVIRONMENT_LABELS,
  REVIEW_LABELS,
} from "../../lib/labels";
import { ErrorNotice, Notice, Skeleton, Tag } from "../common";
import { GraphCanvas } from "./GraphCanvas";

type GraphExplorerProps = {
  assessmentId: string;
  view: GraphView;
  onViewChange: (view: GraphView) => void;
  onBack: () => void;
  /** Catalog labels used for nodes whose label is a bare identifier. */
  labels?: Record<string, string>;
};

/** Expanded graph: canvas, view selector, legend and a node detail card. */
export function GraphExplorer({
  assessmentId,
  view,
  onViewChange,
  onBack,
  labels,
}: GraphExplorerProps) {
  const state = useGraph(assessmentId, view, labels);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // On narrow screens the panel sits below; bring the graph into view.
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      rootRef.current?.scrollIntoView({ block: "start" });
    }
  }, []);

  // A node id only makes sense inside its own view.
  useEffect(() => setSelectedId(null), [assessmentId, view]);

  const graph = state?.status === "ready" ? state.data : null;

  return (
    <div
      ref={rootRef}
      className="flex h-full min-h-[480px] animate-fade-in flex-col"
    >
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-slate-500"
        >
          ← Volver al cuerpo
        </button>
        <div role="group" aria-label="Vista del grafo" className="flex gap-1">
          {(Object.keys(VIEW_LABELS) as GraphView[]).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={item === view}
              onClick={() => onViewChange(item)}
              className={`rounded-md px-3 py-1 text-sm ${
                item === view
                  ? "bg-sky-500/20 text-sky-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {VIEW_LABELS[item]}
            </button>
          ))}
        </div>
        {graph ? (
          <Tag tone={graph.content_mode === "illustrative" ? "amber" : "sky"}>
            {graph.content_mode === "illustrative"
              ? "Contenido ilustrativo"
              : "Basado en evidencia"}
          </Tag>
        ) : null}
      </div>

      <div className="relative min-h-0 flex-1">
        {state === null || state.status === "loading" ? (
          <div className="p-6">
            <Skeleton lines={5} label="Cargando grafo" />
          </div>
        ) : state.status === "error" ? (
          <div className="p-6">
            <ErrorNotice error={state.error} />
          </div>
        ) : state.data.nodes.length === 0 ? (
          <div className="p-6">
            <Notice title="Sin relaciones para esta vista">
              No hay nodos ni relaciones para «{VIEW_LABELS[view]}» en esta
              evaluación.
            </Notice>
          </div>
        ) : (
          <>
            <GraphCanvas
              graph={state.data}
              selectedNodeId={selectedId}
              onSelectNode={setSelectedId}
            />
            <Legend graph={state.data} />
            {selectedId ? (
              <NodeDetail
                graph={state.data}
                nodeId={selectedId}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <p className="pointer-events-none absolute right-4 top-4 rounded-md bg-slate-900/80 px-3 py-2 text-xs text-slate-400">
                Selecciona un nodo para ver su descripción y fuentes.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Legend limited to the kinds present, so it never lists unused colors. */
function Legend({ graph }: { graph: Graph }) {
  const kinds = [...new Set(graph.nodes.map((node) => node.kind))];
  return (
    <div className="absolute bottom-4 right-4 max-w-xs rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-slate-300">
      <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">
        Tipos de nodo
      </p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {kinds.map((kind) => (
          <li key={kind} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${KIND_STYLES[kind].dot}`} />
            {KIND_LABELS[kind]}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] leading-snug text-slate-400">
        Las flechas muestran de dónde sale cada dato o regla; no indican
        causalidad. Los colores agrupan tipos, no niveles de riesgo.
      </p>
    </div>
  );
}

function NodeDetail({
  graph,
  nodeId,
  onClose,
}: {
  graph: Graph;
  nodeId: string;
  onClose: () => void;
}) {
  const node = graph.nodes.find((item) => item.id === nodeId);
  if (!node) return null;

  const sources = graph.sources.filter((source) =>
    node.source_ids.includes(source.id),
  );
  // Claims attached to the edges that touch this node.
  const claimIds = new Set(
    graph.edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .flatMap((edge) => edge.claim_ids),
  );
  const claims = graph.claims.filter((claim) => claimIds.has(claim.id));

  return (
    <section
      aria-label="Detalle del nodo"
      className="absolute right-4 top-4 max-h-[calc(100%-2rem)] w-80 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/95 p-4 text-sm shadow-xl"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-400">
            <span
              className={`h-1.5 w-1.5 rounded-full ${KIND_STYLES[node.kind].dot}`}
            />
            {KIND_LABELS[node.kind]}
          </p>
          <h3 className="mt-1 font-semibold text-slate-100">{node.label}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle"
          className="rounded px-2 text-slate-400 hover:text-slate-100"
        >
          ×
        </button>
      </div>
      <p className="mt-2 text-slate-300">{node.description}</p>

      {sources.length > 0 ? (
        <div className="mt-3">
          <h4 className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Fuentes
          </h4>
          <ul className="mt-1 space-y-2">
            {sources.map((source) => (
              <li key={source.id}>
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sky-300 underline-offset-2 hover:underline"
                  >
                    {source.title}
                  </a>
                ) : (
                  <span className="text-slate-200">{source.title}</span>
                )}
                <p className="text-xs text-slate-400">
                  {source.locator} · {REVIEW_LABELS[source.review_status]}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {claims.length > 0 ? (
        <div className="mt-3">
          <h4 className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Afirmaciones relacionadas
          </h4>
          <ul className="mt-1 space-y-3">
            {claims.map((claim) => (
              <li
                key={claim.id}
                className="rounded-md border border-slate-800 p-2"
              >
                <p className="text-slate-200">{claim.statement}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <Tag tone="violet">{CLAIM_KIND_LABELS[claim.kind]}</Tag>
                  <Tag
                    tone={claim.environment === "spaceflight" ? "sky" : "amber"}
                  >
                    {ENVIRONMENT_LABELS[claim.environment]}
                  </Tag>
                  <Tag
                    tone={
                      claim.review_status === "reviewed" ? "emerald" : "slate"
                    }
                  >
                    {REVIEW_LABELS[claim.review_status]}
                  </Tag>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {claim.population}
                  {claim.sample_size !== null
                    ? ` · n = ${claim.sample_size}`
                    : ""}
                </p>
                {claim.limitations.length > 0 ? (
                  <ul className="mt-1 list-disc pl-4 text-xs text-orange-200/80">
                    {claim.limitations.map((limit) => (
                      <li key={limit}>{limit}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {sources.length === 0 && claims.length === 0 ? (
        <p className="mt-3 text-xs text-slate-400">
          Este nodo no tiene fuentes ni afirmaciones asociadas en el contrato.
        </p>
      ) : null}
    </section>
  );
}

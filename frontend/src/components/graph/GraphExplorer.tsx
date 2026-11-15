import { useEffect, useRef } from "react";

import { dataSource, type Graph, type GraphView } from "../../api";
import type { GraphPage } from "../../api/explorer/types";
import {
  BASIS_LABELS,
  NODE_KIND_LABELS,
  RELATION_LABELS,
} from "../../lib/explorerLabels";
import type { LoadState } from "../../hooks/useCatalog";
import { KIND_LABELS, KIND_STYLES, VIEW_LABELS } from "../../lib/graph";
import {
  CLAIM_KIND_LABELS,
  ENVIRONMENT_LABELS,
  REVIEW_LABELS,
} from "../../lib/labels";
import { ErrorNotice, Notice, ReviewedTag, Skeleton, Tag } from "../common";
import { GraphCanvas } from "./GraphCanvas";

export type GraphMode = "3d" | "flat";
/** "studies": literature of the corpus; "case": the assessment's own graph. */
export type GraphSource = "studies" | "case";

type GraphExplorerProps = {
  state: LoadState<Graph> | null;
  view: GraphView;
  onViewChange: (view: GraphView) => void;
  onBack: () => void;
  selectedId: string | null;
  onSelect: (nodeId: string | null) => void;
  /** "3d": the nodes live in the body scene and this draws only the chrome. */
  mode: GraphMode;
  onModeChange: (mode: GraphMode) => void;
  can3d: boolean;
  source: GraphSource;
  onSourceChange: (source: GraphSource) => void;
  studies: LoadState<GraphPage> | null;
  onOpenPaper: (paperId: string) => void;
};

/** Expanded graph: canvas, view selector, legend and a node detail card. */
export function GraphExplorer({
  state,
  view,
  onViewChange,
  onBack,
  selectedId,
  onSelect,
  mode,
  onModeChange,
  can3d,
  source,
  onSourceChange,
  studies,
  onOpenPaper,
}: GraphExplorerProps) {
  const setSelectedId = onSelect;
  const showStudies = source === "studies";
  const is3d = can3d && (showStudies || mode === "3d");
  const sourceOptions: GraphSource[] =
    dataSource.kind === "api" ? ["studies"] : ["studies", "case"];
  const rootRef = useRef<HTMLDivElement>(null);

  // On narrow screens the panel sits below; bring the graph into view.
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      rootRef.current?.scrollIntoView({ block: "start" });
    }
  }, []);

  const graph = state?.status === "ready" ? state.data : null;

  return (
    <div
      ref={rootRef}
      className={`flex h-full min-h-[480px] animate-fade-in flex-col ${
        is3d ? "pointer-events-none" : ""
      }`}
    >
      <div className="pointer-events-auto flex flex-wrap items-center gap-3 border-b border-slate-800 bg-slate-950/70 px-4 py-3 backdrop-blur">
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
        {can3d ? (
          <div
            role="group"
            aria-label="Qué muestra el mapa"
            className="flex rounded-full bg-slate-800 p-0.5 text-xs"
          >
            {sourceOptions.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={source === item}
                onClick={() => onSourceChange(item)}
                className={`rounded-full px-3 py-1 font-medium ${
                  source === item
                    ? "bg-sky-500 text-slate-950"
                    : "text-slate-300 hover:text-slate-50"
                }`}
              >
                {item === "studies" ? "Estudios" : "Datos del caso"}
              </button>
            ))}
          </div>
        ) : null}
        {can3d && !showStudies ? (
          <div
            role="group"
            aria-label="Tipo de mapa"
            className="ml-auto flex rounded-full bg-slate-800 p-0.5 text-xs"
          >
            {(["3d", "flat"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={mode === item}
                onClick={() => onModeChange(item)}
                className={`rounded-full px-3 py-1 font-medium ${
                  mode === item
                    ? "bg-sky-500 text-slate-950"
                    : "text-slate-300 hover:text-slate-50"
                }`}
              >
                {item === "3d" ? "Mapa 3D" : "Mapa plano"}
              </button>
            ))}
          </div>
        ) : null}
        {graph && !showStudies ? (
          <Tag tone={graph.content_mode === "illustrative" ? "amber" : "sky"}>
            {graph.content_mode === "illustrative"
              ? "Contenido ilustrativo"
              : "Basado en evidencia"}
          </Tag>
        ) : null}
      </div>

      <div className="relative min-h-0 flex-1">
        {showStudies ? (
          <StudiesChrome
            studies={studies}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onOpenPaper={onOpenPaper}
            showNodeList={!can3d}
          />
        ) : state === null || state.status === "loading" ? (
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
            {is3d ? (
              <ul className="sr-only">
                {state.data.nodes.map((node) => (
                  <li key={node.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(node.id)}
                    >
                      {KIND_LABELS[node.kind]}: {node.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <GraphCanvas
                graph={state.data}
                selectedNodeId={selectedId}
                onSelectNode={setSelectedId}
              />
            )}
            <Legend graph={state.data} />
            {selectedId ? (
              <NodeDetail
                graph={state.data}
                nodeId={selectedId}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <p className="pointer-events-none absolute right-4 top-4 rounded-md bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
                {is3d
                  ? "Toca una tarjeta para ver de dónde sale. Arrastra para girar."
                  : "Selecciona un nodo para ver su descripción y fuentes."}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Chrome of the studies map: status, list for assistive tech and detail. */
function StudiesChrome({
  studies,
  selectedId,
  onSelect,
  onOpenPaper,
  showNodeList,
}: {
  studies: LoadState<GraphPage> | null;
  selectedId: string | null;
  onSelect: (nodeId: string | null) => void;
  onOpenPaper: (paperId: string) => void;
  showNodeList: boolean;
}) {
  if (studies === null || studies.status === "loading") {
    return (
      <div className="p-6">
        <Skeleton lines={5} label="Cargando estudios" />
      </div>
    );
  }
  if (studies.status === "error") {
    return (
      <div className="pointer-events-auto p-6">
        <ErrorNotice error={studies.error} />
      </div>
    );
  }
  const page = studies.data;
  if (page.nodes.length === 0) {
    return (
      <div className="pointer-events-auto p-6">
        <Notice title="Sin estudios para esta vista">
          El corpus no tiene estudios relacionados con esta zona en esta vista.
        </Notice>
      </div>
    );
  }
  const node = page.nodes.find((item) => item.id === selectedId);
  const labelOf = (id: string) =>
    page.nodes.find((item) => item.id === id)?.label ?? id;
  const links = page.edges.filter(
    (edge) => edge.source === selectedId || edge.target === selectedId,
  );
  return (
    <>
      <ul
        className={
          showNodeList
            ? "pointer-events-auto grid gap-2 overflow-auto p-4 text-sm text-slate-300"
            : "sr-only"
        }
      >
        {page.nodes.map((item) => (
          <li key={item.id}>
            <button type="button" onClick={() => onSelect(item.id)}>
              {NODE_KIND_LABELS[item.kind]}: {item.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="pointer-events-auto absolute bottom-4 right-4 max-w-xs rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-slate-300">
        <p className="font-medium text-slate-100">
          {page.counts.papers_returned} estudios del corpus
          {page.page.has_more ? " (hay más en la biblioteca)" : ""}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-slate-400">
          {page.counts.papers_reviewed_returned} con revisión documental.{" "}
          {page.nodes.filter((item) => item.kind === "claim").length} síntesis o
          límites vinculados.
        </p>
        <details className="mt-1 text-[11px] leading-snug text-slate-400">
          <summary className="cursor-pointer">
            Alcance de las conexiones
          </summary>
          <p>{page.scope_description}</p>
        </details>
      </div>
      {node ? (
        <section
          aria-label="Detalle del nodo"
          className="pointer-events-auto absolute right-4 top-4 max-h-[calc(100%-2rem)] w-80 animate-slide-in-right overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/95 p-4 text-sm shadow-xl"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-slate-400">
                {NODE_KIND_LABELS[node.kind]}
              </p>
              <h3 className="mt-1 font-semibold text-slate-100">
                {node.label}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onSelect(null)}
              aria-label="Cerrar detalle"
              className="rounded px-2 text-slate-400 hover:text-slate-100"
            >
              ×
            </button>
          </div>
          <div className="mt-2">
            <ReviewedTag status={node.review_status} />
          </div>
          {node.paper_id ? (
            <button
              type="button"
              onClick={() => onOpenPaper(node.paper_id ?? "")}
              className="mt-3 w-full rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-400"
            >
              Abrir el estudio en la biblioteca
            </button>
          ) : null}
          {links.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-xs text-slate-300">
              {links.map((edge) => (
                <li key={edge.id}>
                  <span className="text-slate-400">
                    {RELATION_LABELS[edge.relation]}:
                  </span>{" "}
                  {labelOf(
                    edge.source === selectedId ? edge.target : edge.source,
                  )}{" "}
                  <Tag
                    tone={edge.basis === "llm_suggestion" ? "amber" : "subtle"}
                  >
                    {BASIS_LABELS[edge.basis]}
                  </Tag>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : (
        <p className="pointer-events-none absolute right-4 top-4 rounded-md bg-slate-900/80 px-3 py-2 text-xs text-slate-300">
          Toca una tarjeta para ver de qué trata. Arrastra para girar.
        </p>
      )}
    </>
  );
}

/** Legend limited to the kinds present, so it never lists unused colors. */
function Legend({ graph }: { graph: Graph }) {
  const kinds = [...new Set(graph.nodes.map((node) => node.kind))];
  return (
    <div className="pointer-events-auto absolute bottom-4 right-4 max-w-xs rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-xs text-slate-300">
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
      className="pointer-events-auto absolute right-4 top-4 max-h-[calc(100%-2rem)] w-80 animate-slide-in-right overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/95 p-4 text-sm shadow-xl"
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
                  {source.locator}
                  {source.review_status === "reviewed" ? " · revisado" : ""}
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
                  <ReviewedTag status={claim.review_status} />
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

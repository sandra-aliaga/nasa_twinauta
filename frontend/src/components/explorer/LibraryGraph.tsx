import "@xyflow/react/dist/style.css";

import { graphlib, layout } from "@dagrejs/dagre";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useEffect, useMemo, useState } from "react";

import { toApiError, type ApiError } from "../../api";
import { explorerSource } from "../../api/explorer";
import type {
  GraphPage,
  GraphQuery,
  KnowledgeEdge,
  KnowledgeNode,
} from "../../api/explorer/types";
import { isAbort } from "../../hooks/useCatalog";
import { nodeIdFromKey } from "../../lib/graph";
import {
  BASIS_LABELS,
  NODE_KIND_LABELS,
  RELATION_LABELS,
} from "../../lib/explorerLabels";
import { REVIEW_LABELS } from "../../lib/labels";
import { ErrorNotice, Notice, Skeleton } from "../common";
import { tr, useLanguage } from "../../i18n";

const WIDTH = 220;
const HEIGHT = 66;

// Basis decides the stroke: AI suggestions must never look like reviewed links.
const BASIS_STROKES: Record<
  KnowledgeEdge["basis"],
  { color: string; dash?: string }
> = {
  reviewed_extraction: { color: "#a78bfa" },
  editorial_classification: { color: "#64748b", dash: "2 4" },
  provider_metadata: { color: "#94a3b8", dash: "6 3" },
  llm_suggestion: { color: "#fbbf24", dash: "4 4" },
};

type LibraryNodeData = { node: KnowledgeNode };

function LibraryNodeView({ data, selected }: NodeProps<Node<LibraryNodeData>>) {
  const { node } = data;
  return (
    <div
      className={`w-[220px] rounded-lg border bg-slate-900/95 px-3 py-2 shadow-lg shadow-black/40 ${
        node.kind === "paper" ? "border-violet-400/60" : "border-cyan-400/60"
      } ${selected ? "ring-2 ring-sky-300" : ""}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!border-0 !bg-slate-500"
      />
      <div className="flex justify-between gap-2 text-[10px] uppercase tracking-wide text-slate-400">
        <span>{NODE_KIND_LABELS[node.kind]}</span>
        {node.review_status === "reviewed" ? (
          <span className="text-emerald-300">{tr("Revisado")}</span>
        ) : null}
      </div>
      <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-slate-100">
        {tr(node.label)}
      </p>
      <Handle
        type="source"
        position={Position.Right}
        className="!border-0 !bg-slate-500"
      />
    </div>
  );
}

const nodeTypes = { library: LibraryNodeView };

type Merged = {
  nodes: Map<string, KnowledgeNode>;
  edges: Map<string, KnowledgeEdge>;
  corpusVersion: string;
  notes: string[];
};

/** Merge pages by id, never across corpus versions (draft 0.3 rule). */
function merge(previous: Merged | null, page: GraphPage): Merged {
  const base: Merged =
    previous && previous.corpusVersion === page.corpus_version
      ? previous
      : {
          nodes: new Map(),
          edges: new Map(),
          corpusVersion: page.corpus_version,
          notes: [],
        };
  const nodes = new Map(base.nodes);
  const edges = new Map(base.edges);
  for (const node of page.nodes) nodes.set(node.id, node);
  for (const edge of page.edges) edges.set(edge.id, edge);
  const notes = base.notes.includes(page.scope_description)
    ? base.notes
    : [...base.notes, page.scope_description];
  return { nodes, edges, corpusVersion: page.corpus_version, notes };
}

type LibraryGraphProps = {
  query: Omit<GraphQuery, "cursor" | "paper_id">;
  /** Open assessment; sent with neighbour expansion as the handoff asks. */
  assessmentId?: string | null;
  onOpenPaper: (paperId: string) => void;
};

/** Library graph: filters, "load more" pages and neighbour expansion. */
export function LibraryGraph({
  query,
  assessmentId = null,
  onOpenPaper,
}: LibraryGraphProps) {
  const [merged, setMerged] = useState<Merged | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const queryKey = JSON.stringify(query);

  // A new filter set starts a new exploration.
  useEffect(() => {
    const controller = new AbortController();
    setMerged(null);
    setSelected(null);
    setError(null);
    setLoading(true);
    explorerSource
      .getKnowledgeGraph(query, controller.signal)
      .then((page) => {
        setMerged(merge(null, page));
        setCursor(page.page.has_more ? page.page.next_cursor : null);
      })
      .catch((reason: unknown) => {
        if (!isAbort(reason)) setError(toApiError(reason));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
    // queryKey captures every filter value.
  }, [queryKey]);

  function load(
    extra: Pick<GraphQuery, "cursor" | "paper_id" | "assessment_id">,
  ) {
    setLoading(true);
    setError(null);
    explorerSource
      .getKnowledgeGraph({ ...query, ...extra })
      .then((page) => {
        setMerged((prev) => merge(prev, page));
        if (extra.cursor !== undefined) {
          setCursor(page.page.has_more ? page.page.next_cursor : null);
        }
      })
      .catch((reason: unknown) => {
        const apiError = toApiError(reason);
        // Stale cursor: restart the exploration as the draft prescribes.
        if (apiError.status === 409) {
          setMerged(null);
          setCursor(null);
        }
        setError(apiError);
      })
      .finally(() => setLoading(false));
  }

  const language = useLanguage();
  const flow = useMemo(
    () => (merged ? toFlow(merged, selected) : null),
    [merged, selected, language],
  );
  const selectedNode = selected ? (merged?.nodes.get(selected) ?? null) : null;

  if (!merged) {
    if (error) return <ErrorNotice error={error} />;
    return (
      <div className="h-[55vh] min-h-[340px] rounded-lg border border-slate-800 p-4">
        <Skeleton lines={5} label={tr("Cargando grafo de la biblioteca")} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
        {merged.notes.map((note) => (
          <span key={note} className="rounded bg-slate-900 px-2 py-1">
            {tr(note)}
          </span>
        ))}
        {cursor ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => load({ cursor })}
            className="rounded-md border border-slate-700 px-2 py-1 text-slate-200 hover:border-slate-500 disabled:opacity-50"
          >
            {tr("Cargar más")}
          </button>
        ) : null}
        {loading ? <span>{tr("Cargando…")}</span> : null}
      </div>
      {error ? <ErrorNotice error={error} /> : null}

      {merged.nodes.size === 0 ? (
        <Notice title={tr("Sin relaciones para estos filtros")}>
          {tr(
            "No hay publicaciones ni relaciones en el corpus para esta combinación.",
          )}
        </Notice>
      ) : (
        <>
          <div className="h-[55vh] min-h-[340px] rounded-lg border border-slate-800">
            <ReactFlowProvider>
              <ReactFlow
                nodes={flow?.nodes ?? []}
                edges={flow?.edges ?? []}
                nodeTypes={nodeTypes}
                colorMode="dark"
                fitView
                fitViewOptions={{ padding: 0.2 }}
                nodesDraggable={false}
                nodesConnectable={false}
                edgesFocusable={false}
                minZoom={0.2}
                onNodeClick={(_, node) => setSelected(node.id)}
                onPaneClick={() => setSelected(null)}
                onKeyDown={(event) => {
                  const id = nodeIdFromKey(event);
                  if (id) setSelected(id);
                }}
                style={{ background: "transparent" }}
              >
                <Background gap={22} color="#1e293b" />
                <Controls showInteractive={false} />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
          <div className="grid gap-2 lg:grid-cols-2">
            {selectedNode ? (
              <NodeCard
                node={selectedNode}
                edges={[...merged.edges.values()].filter(
                  (edge) =>
                    edge.source === selectedNode.id ||
                    edge.target === selectedNode.id,
                )}
                loading={loading}
                onExpand={() =>
                  load({
                    paper_id: selectedNode.paper_id ?? undefined,
                    assessment_id: assessmentId ?? undefined,
                  })
                }
                onOpenPaper={onOpenPaper}
                onClose={() => setSelected(null)}
              />
            ) : (
              <p className="rounded-lg border border-dashed border-slate-800 p-3 text-xs text-slate-400">
                {tr(
                  "Selecciona un nodo (clic o Intro) para ver sus relaciones.",
                )}
              </p>
            )}
            <Legend />
          </div>
        </>
      )}
    </div>
  );
}

function toFlow(merged: Merged, focus: string | null) {
  const g = new graphlib.Graph();
  g.setGraph({
    rankdir: "LR",
    nodesep: 28,
    ranksep: 80,
    marginx: 10,
    marginy: 10,
  });
  g.setDefaultEdgeLabel(() => ({}));
  for (const id of merged.nodes.keys())
    g.setNode(id, { width: WIDTH, height: HEIGHT });
  for (const edge of merged.edges.values()) g.setEdge(edge.source, edge.target);
  layout(g);

  const nodes: Node<LibraryNodeData>[] = [...merged.nodes.values()].map(
    (node) => {
      const position = g.node(node.id);
      return {
        id: node.id,
        type: "library",
        position: { x: position.x - WIDTH / 2, y: position.y - HEIGHT / 2 },
        data: { node },
        selected: node.id === focus,
        ariaRole: "button",
        ariaLabel: tr("{{value0}}: {{value1}}. Intro para ver el detalle.", {
          value0: String(NODE_KIND_LABELS[node.kind]),
          value1: tr(node.label),
        }),
      };
    },
  );
  const edges: Edge[] = [...merged.edges.values()].map((edge) => {
    const stroke = BASIS_STROKES[edge.basis];
    const dimmed =
      focus !== null && edge.source !== focus && edge.target !== focus;
    const ai = edge.basis === "llm_suggestion";
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: `${RELATION_LABELS[edge.relation]}${ai ? tr(" (IA)") : ""}`,
      markerEnd: { type: MarkerType.ArrowClosed, color: stroke.color },
      style: {
        stroke: stroke.color,
        strokeDasharray: stroke.dash,
        strokeWidth: 1.5,
        opacity: dimmed ? 0.25 : 1,
      },
      labelStyle: { fill: ai ? "#fde68a" : "#e2e8f0", fontSize: 11 },
      labelBgStyle: { fill: "#0f172a" },
      labelBgPadding: [4, 2] as [number, number],
    };
  });
  return { nodes, edges };
}

function Legend() {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-[11px] text-slate-300">
      <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">
        {tr("Origen de la relación")}
      </p>
      <ul className="space-y-1">
        {(Object.keys(BASIS_STROKES) as KnowledgeEdge["basis"][]).map(
          (basis) => (
            <li key={basis} className="flex items-center gap-2">
              <svg width="28" height="6" aria-hidden="true">
                <line
                  x1="0"
                  y1="3"
                  x2="28"
                  y2="3"
                  stroke={BASIS_STROKES[basis].color}
                  strokeWidth="2"
                  strokeDasharray={BASIS_STROKES[basis].dash}
                />
              </svg>
              {BASIS_LABELS[basis]}
            </li>
          ),
        )}
      </ul>
      <p className="mt-2 text-[10px] leading-snug text-slate-400">
        {tr("Citar o tratar un tema no es respaldo científico.")}
      </p>
    </div>
  );
}

function NodeCard({
  node,
  edges,
  loading,
  onExpand,
  onOpenPaper,
  onClose,
}: {
  node: KnowledgeNode;
  edges: KnowledgeEdge[];
  loading: boolean;
  onExpand: () => void;
  onOpenPaper: (paperId: string) => void;
  onClose: () => void;
}) {
  return (
    <section
      aria-label={tr("Detalle del nodo")}
      className="rounded-lg border border-slate-700 bg-slate-900/95 p-4 text-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-slate-400">
            {NODE_KIND_LABELS[node.kind]}
            {node.review_status === "reviewed" ? tr(" · revisado") : ""}
          </p>
          <h3 className="mt-1 font-semibold text-slate-100">
            {tr(node.label)}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={tr("Cerrar detalle")}
          className="rounded px-2 text-slate-400 hover:text-slate-100"
        >
          ×
        </button>
      </div>
      {node.paper_id ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOpenPaper(node.paper_id as string)}
            className="rounded-md border border-sky-500/60 px-2 py-1 text-xs text-sky-200 hover:bg-sky-500/10"
          >
            {tr("Abrir ficha")}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onExpand}
            className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:border-slate-500 disabled:opacity-50"
          >
            {tr("Ampliar vecinos")}
          </button>
        </div>
      ) : null}
      {edges.length > 0 ? (
        <ul className="mt-3 space-y-2 text-xs">
          {edges.map((edge) => (
            <li
              key={edge.id}
              className="rounded-md border border-slate-800 p-2"
            >
              <p className="text-slate-200">
                {RELATION_LABELS[edge.relation]} · {BASIS_LABELS[edge.basis]}
              </p>
              <p className="text-slate-400">
                {edge.review_status === "reviewed" ? tr("Revisado · ") : ""}
                {edge.source_locators.join("; ")}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-slate-400">
          {tr("Sin relaciones cargadas para este nodo.")}
        </p>
      )}
    </section>
  );
}

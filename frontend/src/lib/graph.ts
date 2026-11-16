/**
 * Graph presentation helpers. The backend owns the meaning of nodes and
 * edges; the frontend only decides positions, colors and wording.
 */
import { graphlib, layout } from "@dagrejs/dagre";
import { MarkerType, type Edge, type Node } from "@xyflow/react";

import type { Graph, GraphView } from "../api";
import type { GraphPage, KnowledgeNode } from "../api/explorer/types";
import { NODE_KIND_LABELS } from "./explorerLabels";
import { tr, translated } from "../i18n";

type NodeKind = Graph["nodes"][number]["kind"];
type Relation = Graph["edges"][number]["relation"];

export const VIEW_LABELS: Record<GraphView, string> = translated({
  evidence: "Fundamento",
  scenario: "Escenario",
  actions: "Acciones",
});

export const KIND_LABELS: Record<NodeKind, string> = translated({
  finding: "Hallazgo",
  observation: "Observación",
  exercise: "Ejercicio",
  claim: "Afirmación",
  source: "Fuente",
  limitation: "Limitación",
  scenario: "Escenario",
  model: "Modelo",
  parameter: "Parámetro",
  action: "Acción",
  requirement: "Requisito",
});

/** Tailwind classes per kind. Colors group roles, they do not mean risk. */
export const KIND_STYLES: Record<NodeKind, { border: string; dot: string }> = {
  finding: { border: "border-sky-400/70", dot: "bg-sky-400" },
  observation: { border: "border-cyan-400/60", dot: "bg-cyan-400" },
  exercise: { border: "border-teal-400/60", dot: "bg-teal-400" },
  claim: { border: "border-violet-400/70", dot: "bg-violet-400" },
  source: { border: "border-slate-400/60", dot: "bg-slate-300" },
  limitation: { border: "border-orange-300/60", dot: "bg-orange-300" },
  scenario: { border: "border-indigo-400/70", dot: "bg-indigo-400" },
  model: { border: "border-indigo-300/60", dot: "bg-indigo-300" },
  parameter: { border: "border-indigo-200/50", dot: "bg-indigo-200" },
  action: { border: "border-emerald-400/70", dot: "bg-emerald-400" },
  requirement: { border: "border-emerald-200/50", dot: "bg-emerald-200" },
};

/** Same hues as KIND_STYLES, as hex values for the 3D map. */
export const KIND_HEX: Record<NodeKind, string> = {
  finding: "#38bdf8",
  observation: "#22d3ee",
  exercise: "#2dd4bf",
  claim: "#a78bfa",
  source: "#cbd5e1",
  limitation: "#fdba74",
  scenario: "#818cf8",
  model: "#a5b4fc",
  parameter: "#c7d2fe",
  action: "#34d399",
  requirement: "#a7f3d0",
};

/** Edge strokes. Only "supported_by" is drawn as backing evidence. */
export const RELATION_STROKES: Record<
  Relation,
  { color: string; dash?: string }
> = {
  supported_by: { color: "#a78bfa" },
  uses: { color: "#38bdf8" },
  computed_with: { color: "#818cf8" },
  addresses: { color: "#34d399" },
  requires: { color: "#6ee7b7", dash: "4 3" },
  limited_by: { color: "#fdba74", dash: "6 4" },
  describes: { color: "#64748b", dash: "2 4" },
};

export const NODE_WIDTH = 210;
export const NODE_HEIGHT = 64;

export type TwinNodeData = {
  kind: NodeKind;
  label: string;
  compact: boolean;
};

/** Convert a contract graph into positioned React Flow nodes and edges. */
export function toFlow(
  graph: Graph,
  options: { compact: boolean; focusNodeId?: string | null },
): { nodes: Node<TwinNodeData>[]; edges: Edge[] } {
  const g = new graphlib.Graph();
  g.setGraph({
    rankdir: "LR",
    nodesep: 28,
    ranksep: 70,
    marginx: 10,
    marginy: 10,
  });
  g.setDefaultEdgeLabel(() => ({}));
  for (const node of graph.nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of graph.edges) g.setEdge(edge.source, edge.target);
  layout(g);

  const nodes: Node<TwinNodeData>[] = graph.nodes.map((node) => {
    const position = g.node(node.id);
    return {
      id: node.id,
      type: "twin",
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
      data: {
        kind: node.kind,
        label: tr(node.label),
        compact: options.compact,
      },
      ariaRole: "button",
      ariaLabel: tr("{{value0}}: {{value1}}. Intro para ver el detalle.", {
        value0: String(KIND_LABELS[node.kind]),
        value1: tr(node.label),
      }),
    };
  });

  // Labels repeat a lot, so only the edges of the focused node show them.
  const focus = options.focusNodeId ?? null;
  const edges: Edge[] = graph.edges.map((edge) => {
    const stroke = RELATION_STROKES[edge.relation];
    const touches =
      focus !== null && (edge.source === focus || edge.target === focus);
    const dimmed = focus !== null && !touches;
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: !options.compact && touches ? edge.label : undefined,
      markerEnd: { type: MarkerType.ArrowClosed, color: stroke.color },
      style: {
        stroke: stroke.color,
        strokeDasharray: stroke.dash,
        strokeWidth: touches ? 2.25 : 1.5,
        opacity: dimmed ? 0.25 : 1,
      },
      labelStyle: { fill: "#e2e8f0", fontSize: 11 },
      labelBgStyle: { fill: "#0f172a" },
      labelBgPadding: [4, 2] as [number, number],
      zIndex: touches ? 1 : 0,
    };
  });

  return { nodes, edges };
}

/** Enter or Space on a focused node selects it, like a click. */
export function nodeIdFromKey(event: React.KeyboardEvent): string | null {
  if (event.key !== "Enter" && event.key !== " ") return null;
  const target = event.target as HTMLElement;
  const node = target.closest<HTMLElement>(".react-flow__node");
  const id = node?.dataset.id ?? null;
  if (id) event.preventDefault();
  return id;
}

/** Renderer-neutral map for the 3D view: the case graph or a set of studies. */
export type MapData = {
  nodes: { id: string; label: string; kindLabel: string; color: string }[];
  edges: { id: string; source: string; target: string; color: string }[];
  layout: "columns" | "orbit";
};

/** The assessment graph, keeping the direction of its relations. */
export function caseMap(graph: Graph): MapData {
  return {
    layout: "columns",
    nodes: graph.nodes.map((node) => ({
      id: node.id,
      label: tr(node.label),
      kindLabel: KIND_LABELS[node.kind],
      color: KIND_HEX[node.kind],
    })),
    edges: graph.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      color: RELATION_STROKES[edge.relation].color,
    })),
  };
}

/** Display names for the corpus topic ids; unknown ids are shown as sent. */
const TOPIC_LABELS: Record<string, string> = translated({
  status: "Estado actual",
  mechanisms: "Mecanismos",
  evolution: "Evolución",
  recovery: "Recuperación",
  countermeasures: "Contramedidas",
});

const STUDY_HEX: Record<KnowledgeNode["kind"], string> = {
  paper: "#8cbcff",
  topic: "#b69cff",
  indicator: "#22d3ee",
  claim: "#a78bfa",
  action: "#ffb454",
  intervention: "#34d399",
};

/**
 * Studies of the corpus and what they address. AI-suggested links keep the
 * amber stroke so they never look like reviewed ones.
 */
export function studyMap(page: GraphPage): MapData {
  return {
    layout: "orbit",
    nodes: page.nodes.map((node) => ({
      id: node.id,
      label:
        node.kind === "topic"
          ? (TOPIC_LABELS[node.label] ?? node.label)
          : node.label,
      kindLabel: NODE_KIND_LABELS[node.kind],
      color: STUDY_HEX[node.kind],
    })),
    edges: page.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      color: edge.basis === "llm_suggestion" ? "#ffb454" : "#6f78b4",
    })),
  };
}

/**
 * Graph presentation helpers. The backend owns the meaning of nodes and
 * edges; the frontend only decides positions, colors and wording.
 */
import { graphlib, layout } from "@dagrejs/dagre";
import { MarkerType, type Edge, type Node } from "@xyflow/react";

import type { Graph, GraphView } from "../api";

type NodeKind = Graph["nodes"][number]["kind"];
type Relation = Graph["edges"][number]["relation"];

export const VIEW_LABELS: Record<GraphView, string> = {
  evidence: "Fundamento",
  scenario: "Escenario",
  actions: "Acciones",
};

export const KIND_LABELS: Record<NodeKind, string> = {
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
};

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

/** Edge strokes. Only "supported_by" is drawn as backing evidence. */
const RELATION_STROKES: Record<Relation, { color: string; dash?: string }> = {
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
      data: { kind: node.kind, label: node.label, compact: options.compact },
      ariaRole: "button",
      ariaLabel: `${KIND_LABELS[node.kind]}: ${node.label}. Intro para ver el detalle.`,
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

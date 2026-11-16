import { tr, useLanguage } from "../../i18n";
import "@xyflow/react/dist/style.css";

import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { useMemo } from "react";

import type { Graph } from "../../api";
import {
  KIND_LABELS,
  KIND_STYLES,
  nodeIdFromKey,
  toFlow,
  type TwinNodeData,
} from "../../lib/graph";

type TwinNode = Node<TwinNodeData>;

function TwinNodeView({ data, selected }: NodeProps<TwinNode>) {
  const style = KIND_STYLES[data.kind];
  return (
    <div
      className={`w-[210px] rounded-lg border bg-slate-900/95 px-3 py-2 shadow-lg shadow-black/40 ${style.border} ${
        selected ? "ring-2 ring-sky-300" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!border-0 !bg-slate-500"
      />
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-400">
        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        {KIND_LABELS[data.kind]}
      </div>
      <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-slate-100">
        {tr(data.label)}
      </p>
      <Handle
        type="source"
        position={Position.Right}
        className="!border-0 !bg-slate-500"
      />
    </div>
  );
}

const nodeTypes = { twin: TwinNodeView };

type GraphCanvasProps = {
  graph: Graph;
  /** Compact mode: read-only thumbnail without edge labels or controls. */
  compact?: boolean;
  selectedNodeId?: string | null;
  onSelectNode?: (nodeId: string | null) => void;
};

/** Read-only rendering of a contract graph. Connections cannot be edited. */
export function GraphCanvas({
  graph,
  compact = false,
  selectedNodeId = null,
  onSelectNode,
}: GraphCanvasProps) {
  const language = useLanguage();
  const { nodes, edges } = useMemo(
    () => toFlow(graph, { compact, focusNodeId: selectedNodeId }),
    [graph, compact, selectedNodeId, language],
  );
  const shownNodes = useMemo(
    () =>
      nodes.map((node) => ({ ...node, selected: node.id === selectedNodeId })),
    [nodes, selectedNodeId],
  );

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={shownNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        colorMode="dark"
        fitView
        fitViewOptions={{ padding: compact ? 0.08 : 0.2 }}
        nodesDraggable={false}
        nodesConnectable={false}
        edgesFocusable={false}
        elementsSelectable={!compact}
        panOnDrag={!compact}
        zoomOnScroll={!compact}
        zoomOnPinch={!compact}
        zoomOnDoubleClick={!compact}
        preventScrolling={!compact}
        minZoom={0.2}
        onNodeClick={(_, node) => onSelectNode?.(node.id)}
        onPaneClick={() => onSelectNode?.(null)}
        onKeyDown={(event) => {
          const id = compact ? null : nodeIdFromKey(event);
          if (id) onSelectNode?.(id);
        }}
        style={{ background: "transparent" }}
      >
        {compact ? null : (
          <Background gap={22} color="#334155" bgColor="transparent" />
        )}
        {compact ? null : <Controls showInteractive={false} />}
      </ReactFlow>
    </ReactFlowProvider>
  );
}

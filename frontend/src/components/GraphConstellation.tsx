import { graphlib, layout as dagreLayout } from "@dagrejs/dagre";
import { Line, useBounds, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Box3,
  CanvasTexture,
  SRGBColorSpace,
  Vector3,
  type Group,
} from "three";

import { MODEL_URL } from "../lib/anatomy";
import type { MapData } from "../lib/graph";

type Props = {
  map: MapData;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
};

const CARD_W = 512;
const CARD_H = 152;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Wrap a label into at most two lines, ending with an ellipsis if cut. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > 2) {
    let last = lines[1];
    while (last && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    return [lines[0], `${last}…`];
  }
  return lines;
}

/** Draw one node card; the kind is written as text, not only as a color. */
function cardTexture(kindLabel: string, label: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "rgba(20, 24, 66, 0.94)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.roundRect(4, 4, CARD_W - 8, CARD_H - 8, 26);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(34, 40, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '500 24px "Figtree", system-ui, sans-serif';
    ctx.fillText(kindLabel, 52, 48);
    ctx.fillStyle = "#f8f9ff";
    ctx.font = '600 31px "Figtree", system-ui, sans-serif';
    wrap(ctx, label, CARD_W - 56).forEach((line, index) => {
      ctx.fillText(line, 26, 92 + index * 38);
    });
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/** Normalised (0..1) column layout: same reading order as the flat map. */
function columnLayout(map: MapData): Map<string, { u: number; v: number }> {
  const g = new graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: 28, ranksep: 70 });
  g.setDefaultEdgeLabel(() => ({}));
  for (const node of map.nodes) g.setNode(node.id, { width: 210, height: 64 });
  for (const edge of map.edges) g.setEdge(edge.source, edge.target);
  dagreLayout(g);
  const points = map.nodes.map((node) => ({ id: node.id, ...g.node(node.id) }));
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const [minX, maxX] = [Math.min(...xs), Math.max(...xs)];
  const [minY, maxY] = [Math.min(...ys), Math.max(...ys)];
  return new Map(
    points.map((p) => [
      p.id,
      {
        u: maxX > minX ? (p.x - minX) / (maxX - minX) : 0.5,
        v: maxY > minY ? (p.y - minY) / (maxY - minY) : 0.5,
      },
    ]),
  );
}

/**
 * A map laid out around the body, in the same 3D scene. "columns" keeps the
 * direction of the relations on an arc in front of the body; "orbit" spreads
 * a set of studies on a spiral around it. Depth only arranges the cards and
 * carries no meaning.
 */
export function GraphConstellation({
  map,
  selectedNodeId,
  onSelectNode,
}: Props) {
  const { scene } = useGLTF(MODEL_URL);
  const bounds = useBounds();

  const layout = useMemo(() => {
    const body = new Box3().setFromObject(scene);
    const center = body.getCenter(new Vector3());
    const height = body.getSize(new Vector3()).y || 1;
    const radius = height * 0.62;
    const count = map.nodes.length;
    const cardWidth = height * (count > 8 ? 0.34 : 0.44);
    // Positions are relative to the body center, the pivot of the sway.
    const positions = new Map<string, Vector3>();
    if (map.layout === "orbit") {
      map.nodes.forEach((node, index) => {
        const angle = index * GOLDEN_ANGLE;
        const v = count > 1 ? index / (count - 1) : 0.5;
        positions.set(
          node.id,
          new Vector3(
            radius * Math.sin(angle),
            (0.5 - v) * height * 0.9,
            radius * Math.cos(angle) * 0.75,
          ),
        );
      });
    } else {
      const spread = (70 * Math.PI) / 180;
      for (const [id, { u, v }] of columnLayout(map)) {
        const angle = (u - 0.5) * 2 * spread;
        positions.set(
          id,
          new Vector3(
            radius * Math.sin(angle),
            (0.5 - v) * height * 0.85,
            radius * Math.cos(angle) * 0.6,
          ),
        );
      }
    }
    const box = body.clone();
    for (const position of positions.values()) {
      box.expandByPoint(position.clone().add(center));
    }
    box.expandByScalar(cardWidth * 0.3);
    return { positions, cardWidth, box, center };
  }, [scene, map]);

  const textures = useMemo(
    () =>
      new Map(
        map.nodes.map((node) => [
          node.id,
          cardTexture(node.kindLabel, node.label, node.color),
        ]),
      ),
    [map],
  );
  useEffect(
    () => () => {
      for (const texture of textures.values()) texture.dispose();
    },
    [textures],
  );

  // Frame the body together with its map.
  useEffect(() => {
    bounds.refresh(layout.box).clip().fit();
    // bounds is recreated by drei on each render; the layout drives the fit.
  }, [layout]);

  const neighbours = useMemo(() => {
    if (!selectedNodeId) return null;
    const ids = new Set([selectedNodeId]);
    for (const edge of map.edges) {
      if (edge.source === selectedNodeId) ids.add(edge.target);
      if (edge.target === selectedNodeId) ids.add(edge.source);
    }
    return ids;
  }, [map, selectedNodeId]);

  const cardHeight = layout.cardWidth * (CARD_H / CARD_W);

  // A slow sway shows the depth of the map without ever turning it away;
  // it rests while a card is selected and under reduced motion.
  const group = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const still =
      selectedNodeId !== null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = still ? 0 : Math.sin(clock.elapsedTime * 0.35) * 0.3;
    group.current.rotation.y += (target - group.current.rotation.y) * 0.05;
  });

  return (
    <group ref={group} position={layout.center}>
      {map.edges.map((edge) => {
        const from = layout.positions.get(edge.source);
        const to = layout.positions.get(edge.target);
        if (!from || !to) return null;
        const touches =
          selectedNodeId !== null &&
          (edge.source === selectedNodeId || edge.target === selectedNodeId);
        return (
          <Line
            key={edge.id}
            points={[from, to]}
            color={edge.color}
            lineWidth={touches ? 2.5 : 1.2}
            transparent
            opacity={selectedNodeId === null ? 0.6 : touches ? 0.95 : 0.12}
            depthTest={false}
            renderOrder={19}
          />
        );
      })}
      {map.nodes.map((node) => {
        const position = layout.positions.get(node.id);
        if (!position) return null;
        const selected = node.id === selectedNodeId;
        const faded = neighbours !== null && !neighbours.has(node.id);
        const scale = selected ? 1.15 : 1;
        return (
          <sprite
            key={node.id}
            position={position}
            scale={[layout.cardWidth * scale, cardHeight * scale, 1]}
            renderOrder={selected ? 21 : 20}
            onClick={(event) => {
              event.stopPropagation();
              onSelectNode(selected ? null : node.id);
            }}
            onPointerOver={() => (document.body.style.cursor = "pointer")}
            onPointerOut={() => (document.body.style.cursor = "")}
          >
            <spriteMaterial
              map={textures.get(node.id)}
              transparent
              opacity={faded ? 0.3 : 1}
              depthTest={false}
            />
          </sprite>
        );
      })}
    </group>
  );
}

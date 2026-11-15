import {
  Billboard,
  Bounds,
  Float,
  OrbitControls,
  useBounds,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";

import { GraphConstellation } from "./GraphConstellation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Box3,
  Color,
  Mesh,
  type MeshBasicMaterial,
  MeshStandardMaterial,
  Vector3,
  type Material,
  type Object3D,
} from "three";

import type { MapData } from "../lib/graph";
import {
  ANATOMY_COLORS,
  HEART_ANCHOR_MESHES,
  HEART_ZONE_ID,
  MODEL_URL,
  REGION_MESHES,
  type CameraFocus,
} from "../lib/anatomy";

const SELECTED_COLOR = new Color(ANATOMY_COLORS.selected);
const HOVER_COLOR = new Color("#b8d6ff");
const NO_EMISSION = new Color("#000000");

// Camera moves between body and region; disabled for reduced motion.
const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

// Neutral material for the rest of the body while a region is selected.
const CONTEXT_MATERIAL = new MeshStandardMaterial({
  color: ANATOMY_COLORS.context,
  roughness: 0.85,
  metalness: 0,
});

type EmissiveMaterial = Material & {
  emissive: Color;
  emissiveIntensity: number;
};

function isEmissive(material: Material): material is EmissiveMaterial {
  return (
    "emissive" in material &&
    (material as EmissiveMaterial).emissive instanceof Color
  );
}

/**
 * Original glTF node name. GLTFLoader sanitizes object.name (spaces become
 * underscores) and keeps the original in userData.name.
 */
function sourceName(object: Object3D): string {
  const original: unknown = object.userData.name;
  return typeof original === "string" ? original : object.name;
}

/** Walk up the hierarchy until a node name maps to a region. */
function regionOf(
  object: Object3D | null,
  meshToRegion: Map<string, string>,
): string | null {
  let current: Object3D | null = object;
  while (current) {
    const region = meshToRegion.get(sourceName(current));
    if (region) return region;
    current = current.parent;
  }
  return null;
}

type ModelProps = {
  regionIds: string[];
  selectedRegionId: string | null;
  onSelect: (regionId: string) => void;
  focus: CameraFocus;
  /** Regions whose open assessment has something to review. */
  flaggedRegionIds: string[];
  /** When set, this map is drawn around the body. */
  graph: MapData | null;
  /** Show the beacon of the heart-rate example on the chest. */
  heartEnabled: boolean;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
};

type BodyProps = Omit<
  ModelProps,
  "graph" | "selectedNodeId" | "onSelectNode"
> & {
  graphActive: boolean;
};

const BEACON_COLORS = {
  flagged: "#ffb454",
  tracked: "#5aa0ff",
  heart: "#b69cff",
} as const;

/**
 * Pulsing marker in front of a region. It says "there is something to look
 * at here" (a finding to review, or simply a tracked zone); it is not a
 * severity signal.
 */
function Beacon({
  position,
  radius,
  tone,
  onSelect,
}: {
  position: [number, number, number];
  radius: number;
  tone: keyof typeof BEACON_COLORS;
  onSelect: () => void;
}) {
  const ring = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (!ring.current || REDUCED_MOTION) return;
    const t = (clock.elapsedTime % 2.2) / 2.2;
    ring.current.scale.setScalar(0.7 + 1.5 * t);
    (ring.current.material as MeshBasicMaterial).opacity = 0.85 * (1 - t);
  });
  const color = BEACON_COLORS[tone];
  return (
    <Billboard position={position}>
      <mesh ref={ring} renderOrder={10}>
        <ringGeometry args={[radius * 0.8, radius, 48]} />
        <meshBasicMaterial color={color} transparent depthTest={false} />
      </mesh>
      <mesh
        renderOrder={11}
        onClick={(event) => {
          event.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        <circleGeometry args={[radius * 0.5, 32]} />
        <meshBasicMaterial color={color} depthTest={false} />
      </mesh>
    </Billboard>
  );
}

function Model({
  regionIds,
  selectedRegionId,
  onSelect,
  focus,
  flaggedRegionIds,
  graphActive,
  heartEnabled,
}: BodyProps) {
  const { scene } = useGLTF(MODEL_URL);
  const [hovered, setHovered] = useState<string | null>(null);

  // Only regions published by the backend become selectable.
  const meshToRegion = useMemo(() => {
    const map = new Map<string, string>();
    for (const regionId of regionIds) {
      for (const name of REGION_MESHES[regionId] ?? []) map.set(name, regionId);
    }
    return map;
  }, [regionIds]);

  // Region meshes get their own material copy so highlighting one muscle
  // does not tint every mesh that shares the original material. The other
  // meshes keep their original material to restore it after a selection.
  const { regionMeshes, contextMeshes } = useMemo(() => {
    const regionMeshes: { mesh: Mesh; regionId: string }[] = [];
    const contextMeshes: { mesh: Mesh; original: Material }[] = [];
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      if (!object.userData.twinautaOriginalMaterial) {
        object.userData.twinautaOriginalMaterial = object.material;
      }
      const original = object.userData.twinautaOriginalMaterial as Material;
      const regionId = regionOf(object, meshToRegion);
      if (!regionId) {
        contextMeshes.push({ mesh: object, original });
        return;
      }
      // A plain colored material: tinting the red texture would turn the
      // region purple and stop matching the legend.
      if (!object.userData.twinautaOwnMaterial) {
        object.material = new MeshStandardMaterial({
          color: ANATOMY_COLORS.selectable,
          roughness: 0.6,
          metalness: 0,
        });
        object.userData.twinautaOwnMaterial = true;
      }
      regionMeshes.push({ mesh: object, regionId });
    });
    return { regionMeshes, contextMeshes };
  }, [scene, meshToRegion]);

  // With a selection the rest of the body turns neutral, so the region is
  // the only colored part; without one the anatomical texture is kept.
  useEffect(() => {
    for (const { mesh, original } of contextMeshes) {
      mesh.material =
        selectedRegionId || graphActive ? CONTEXT_MATERIAL : original;
    }
  }, [contextMeshes, selectedRegionId, graphActive]);

  // Frame the selected region or the whole body.
  const bounds = useBounds();
  useEffect(() => {
    // The map frames the scene itself while it is open.
    if (graphActive) return;
    const targets = regionMeshes.filter(
      (item) => item.regionId === selectedRegionId,
    );
    if (focus === "region" && targets.length > 0) {
      const box = new Box3();
      for (const { mesh } of targets) box.expandByObject(mesh);
      // Leave room around the region (knees, hips) instead of a tight crop.
      const size = box.getSize(new Vector3());
      box.expandByVector(size.multiplyScalar(0.2));
      bounds.refresh(box).clip().fit();
    } else {
      bounds.refresh(scene).clip().fit();
    }
    // bounds is recreated by drei on each render; the inputs drive the fit.
  }, [focus, selectedRegionId, regionMeshes, scene, graphActive]);

  useEffect(() => {
    for (const { mesh, regionId } of regionMeshes) {
      const material = mesh.material as Material;
      if (!isEmissive(material)) continue;
      const isSelected = regionId === selectedRegionId;
      if ("color" in material && material.color instanceof Color) {
        material.color.set(
          isSelected ? ANATOMY_COLORS.selected : ANATOMY_COLORS.selectable,
        );
      }
      if (isSelected) {
        material.emissive.copy(SELECTED_COLOR);
        material.emissiveIntensity = 0.35;
      } else if (regionId === hovered) {
        material.emissive.copy(HOVER_COLOR);
        material.emissiveIntensity = 0.3;
      } else {
        material.emissive.copy(NO_EMISSION);
        material.emissiveIntensity = 0;
      }
    }
  }, [regionMeshes, selectedRegionId, hovered]);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  function handleMove(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    setHovered(regionOf(event.object, meshToRegion));
  }

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    const regionId = regionOf(event.object, meshToRegion);
    if (regionId) onSelect(regionId);
  }

  // One beacon per body side of each unselected region (the mesh names
  // start with "Left"/"Right"), placed just in front of the muscles.
  const beacons = useMemo(() => {
    scene.updateWorldMatrix(true, true);
    const boxes = new Map<string, { regionId: string; box: Box3 }>();
    for (const { mesh, regionId } of regionMeshes) {
      let name = "";
      for (let o: Object3D | null = mesh; o && !name; o = o.parent) {
        if (meshToRegion.has(sourceName(o))) name = sourceName(o);
      }
      const side = name.startsWith("Left")
        ? "L"
        : name.startsWith("Right")
          ? "R"
          : "C";
      const key = `${regionId}:${side}`;
      const entry = boxes.get(key) ?? { regionId, box: new Box3() };
      entry.box.expandByObject(mesh);
      boxes.set(key, entry);
    }
    return [...boxes.entries()].map(([key, { regionId, box }]) => {
      const center = box.getCenter(new Vector3());
      const size = box.getSize(new Vector3());
      return {
        key,
        regionId,
        position: [center.x, center.y, box.max.z + size.z * 0.2] as [
          number,
          number,
          number,
        ],
        radius: Math.max(size.x, size.z) * 0.4,
      };
    });
  }, [scene, regionMeshes, meshToRegion]);

  // The heart beacon sits on the left chest, pulled toward the midline.
  const heartBeacon = useMemo(() => {
    if (!heartEnabled) return null;
    scene.updateWorldMatrix(true, true);
    const box = new Box3();
    scene.traverse((object) => {
      if (HEART_ANCHOR_MESHES.includes(sourceName(object))) {
        box.expandByObject(object);
      }
    });
    if (box.isEmpty()) return null;
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const midline = new Box3().setFromObject(scene).getCenter(new Vector3()).x;
    return {
      position: [
        center.x + (midline - center.x) * 0.55,
        center.y,
        box.max.z + size.z * 0.15,
      ] as [number, number, number],
      radius: size.x * 0.28,
    };
  }, [scene, heartEnabled]);

  return (
    <>
      <primitive
        object={scene}
        onPointerMove={handleMove}
        onPointerOut={() => setHovered(null)}
        onClick={handleClick}
      />
      {beacons
        .filter(
          (beacon) => !graphActive && beacon.regionId !== selectedRegionId,
        )
        .map((beacon) => (
          <Beacon
            key={beacon.key}
            position={beacon.position}
            radius={beacon.radius}
            tone={
              flaggedRegionIds.includes(beacon.regionId) ? "flagged" : "tracked"
            }
            onSelect={() => onSelect(beacon.regionId)}
          />
        ))}
      {heartBeacon && !graphActive && selectedRegionId !== HEART_ZONE_ID ? (
        <Beacon
          position={heartBeacon.position}
          radius={heartBeacon.radius}
          tone="heart"
          onSelect={() => onSelect(HEART_ZONE_ID)}
        />
      ) : null}
    </>
  );
}

/**
 * Plain DOM overlay outside the canvas. drei's <Html> mounts its own React
 * root, and unmounting it when Suspense resolves raced with React rendering.
 */
function LoadingOverlay() {
  // useProgress counts finished files, not bytes: a single GLB jumps 0 -> 100.
  const { active } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <p className="rounded-md bg-slate-900/80 px-3 py-1 text-sm text-slate-200">
        Cargando modelo 3D (2,6 MB)…
      </p>
    </div>
  );
}

/** Interactive 3D body. Default export so it can be lazy-loaded. */
export default function AnatomyViewer({
  regionIds,
  selectedRegionId,
  onSelect,
  focus,
  flaggedRegionIds,
  graph,
  heartEnabled,
  selectedNodeId,
  onSelectNode,
}: ModelProps) {
  // A gentle drift only; the body keeps facing the viewer so beacons
  // stay visible.
  const animate = !REDUCED_MOTION;

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 1, 4], fov: 35 }}
        dpr={[1, 2]}
        className="h-full w-full"
        aria-label="Modelo anatómico 3D"
        onPointerMissed={() => {
          if (graph) onSelectNode(null);
        }}
      >
        <hemisphereLight args={["#e2e8f0", "#1e293b", 1.1]} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <directionalLight position={[-4, 2, -3]} intensity={0.6} />
        <Suspense fallback={null}>
          <Bounds
            fit
            clip
            observe
            margin={1.15}
            maxDuration={REDUCED_MOTION ? 0.01 : 0.6}
            interpolateFunc={easeInOutCubic}
          >
            {/* Gentle drift, evocative of microgravity; it is not data. */}
            <Float
              enabled={animate}
              speed={1.2}
              floatIntensity={0.3}
              rotationIntensity={0.25}
            >
              <Model
                regionIds={regionIds}
                selectedRegionId={selectedRegionId}
                onSelect={onSelect}
                focus={focus}
                flaggedRegionIds={flaggedRegionIds}
                graphActive={graph !== null}
                heartEnabled={heartEnabled}
              />
            </Float>
            {graph ? (
              <GraphConstellation
                map={graph}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
              />
            ) : null}
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault enablePan={false} enableDamping />
      </Canvas>
      <LoadingOverlay />
    </div>
  );
}

useGLTF.preload(MODEL_URL);

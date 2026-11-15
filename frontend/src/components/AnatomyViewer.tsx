import { Bounds, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Color, Mesh, type Material, type Object3D } from "three";

import { MODEL_URL, REGION_MESHES } from "../lib/anatomy";

const SELECTED_COLOR = new Color("#38bdf8");
const HOVER_COLOR = new Color("#7dd3fc");
const NO_EMISSION = new Color("#000000");

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
};

function Model({ regionIds, selectedRegionId, onSelect }: ModelProps) {
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
  // does not tint every mesh that shares the original material.
  const regionMeshes = useMemo(() => {
    const meshes: { mesh: Mesh; regionId: string }[] = [];
    scene.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const regionId = regionOf(object, meshToRegion);
      if (!regionId) return;
      if (!object.userData.twinautaOwnMaterial) {
        object.material = (object.material as Material).clone();
        object.userData.twinautaOwnMaterial = true;
      }
      meshes.push({ mesh: object, regionId });
    });
    return meshes;
  }, [scene, meshToRegion]);

  useEffect(() => {
    for (const { mesh, regionId } of regionMeshes) {
      const material = mesh.material as Material;
      if (!isEmissive(material)) continue;
      if (regionId === selectedRegionId) {
        material.emissive.copy(SELECTED_COLOR);
        material.emissiveIntensity = 0.55;
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

  return (
    <primitive
      object={scene}
      onPointerMove={handleMove}
      onPointerOut={() => setHovered(null)}
      onClick={handleClick}
    />
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
        Cargando modelo 3D (16 MB)…
      </p>
    </div>
  );
}

/** Interactive 3D body. Default export so it can be lazy-loaded. */
export default function AnatomyViewer({
  regionIds,
  selectedRegionId,
  onSelect,
}: ModelProps) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: [0, 1, 4], fov: 35 }}
        dpr={[1, 2]}
        className="h-full w-full"
        aria-label="Modelo anatómico 3D"
      >
        <color attach="background" args={["#020617"]} />
        <hemisphereLight args={["#e2e8f0", "#1e293b", 1.1]} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <directionalLight position={[-4, 2, -3]} intensity={0.6} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.05}>
            <Model
              regionIds={regionIds}
              selectedRegionId={selectedRegionId}
              onSelect={onSelect}
            />
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault enablePan={false} enableDamping />
      </Canvas>
      <LoadingOverlay />
    </div>
  );
}

useGLTF.preload(MODEL_URL);

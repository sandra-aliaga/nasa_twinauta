import { Component, lazy, Suspense, useState, type ReactNode } from "react";

import type { Region } from "../api";
import {
  hasWebGL,
  MODEL_CREDIT,
  REGION_MESHES,
  REGION_MODEL_NOTES,
} from "../lib/anatomy";
import { BodyMockup } from "./BodyMockup";
import { Notice } from "./common";

// Three.js is large: load it only when the 3D view is actually shown.
const AnatomyViewer = lazy(() => import("./AnatomyViewer"));

type FallbackBoundaryProps = { fallback: ReactNode; children: ReactNode };

/** Show the 2D body if the model or WebGL fails at runtime. */
class FallbackBoundary extends Component<
  FallbackBoundaryProps,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[TwinNauta] 3D viewer failed, using 2D fallback.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type AnatomyStageProps = {
  regions: Region[];
  selectedRegionId: string | null;
  onSelect: (regionId: string) => void;
};

/** Body view: 3D model when possible, 2D placeholder otherwise. */
export function AnatomyStage({
  regions,
  selectedRegionId,
  onSelect,
}: AnatomyStageProps) {
  const [webgl] = useState(hasWebGL);
  const mappedRegions = regions.filter((region) => REGION_MESHES[region.id]);
  const unmappedRegions = regions.filter((region) => !REGION_MESHES[region.id]);
  const note = selectedRegionId
    ? REGION_MODEL_NOTES[selectedRegionId]
    : undefined;

  const fallback = (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <Notice title="Vista 3D no disponible" tone="warning">
          Se muestra la silueta 2D. El navegador no admite WebGL o el modelo no
          pudo cargarse.
        </Notice>
      </div>
      <BodyMockup
        regions={regions}
        selectedRegionId={selectedRegionId}
        onSelect={onSelect}
      />
    </div>
  );

  if (!webgl) return fallback;

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="relative min-h-0 flex-1">
        <FallbackBoundary fallback={fallback}>
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                Preparando visor 3D…
              </div>
            }
          >
            <AnatomyViewer
              regionIds={mappedRegions.map((region) => region.id)}
              selectedRegionId={selectedRegionId}
              onSelect={onSelect}
            />
          </Suspense>
        </FallbackBoundary>
      </div>

      <div className="space-y-2 border-t border-slate-800 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Regiones:</span>
          {[...mappedRegions, ...unmappedRegions].map((region) => {
            const selected = region.id === selectedRegionId;
            return (
              <button
                key={region.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(region.id)}
                className={`rounded-md border px-3 py-1 text-sm ${
                  selected
                    ? "border-sky-400 bg-sky-500/20 text-sky-100"
                    : "border-slate-700 text-slate-200 hover:border-sky-400"
                }`}
              >
                {region.label}
              </button>
            );
          })}
        </div>
        {note ? <p className="text-xs text-amber-200/90">{note}</p> : null}
        <p className="text-xs text-slate-500">
          Arrastre para girar y use la rueda para acercar. Lateralidad no
          individualizada: ambos lados forman una región. {MODEL_CREDIT}
        </p>
      </div>
    </div>
  );
}

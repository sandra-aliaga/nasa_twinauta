import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Region } from "../api";
import {
  ANATOMY_COLORS,
  hasWebGL,
  MODEL_CREDIT,
  REGION_MESHES,
  REGION_MODEL_NOTES,
  type CameraFocus,
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
  /** Floating card over the empty left side of the 3D view (wide screens). */
  sidePanel?: ReactNode;
};

/** Body view: 3D model when possible, 2D placeholder otherwise. */
export function AnatomyStage({
  regions,
  selectedRegionId,
  onSelect,
  sidePanel,
}: AnatomyStageProps) {
  const [webgl] = useState(hasWebGL);
  const [sideOpen, setSideOpen] = useState(true);
  // A new selection frames its region; the user can return to the body.
  const [focus, setFocus] = useState<CameraFocus>("body");
  useEffect(() => {
    setFocus(selectedRegionId ? "region" : "body");
  }, [selectedRegionId]);
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
              focus={focus}
            />
          </Suspense>
        </FallbackBoundary>
        {sidePanel ? (
          sideOpen ? (
            <div className="absolute bottom-4 left-4 top-4 z-10 hidden w-72 animate-slide-in-right flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950/75 shadow-xl shadow-black/40 backdrop-blur lg:flex">
              <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {sidePanel}
              </div>
              <button
                type="button"
                onClick={() => setSideOpen(false)}
                className="border-t border-slate-800 px-4 py-2 text-left text-xs text-slate-400 hover:text-slate-200"
              >
                ‹ Ocultar ficha
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSideOpen(true)}
              className="absolute left-4 top-4 z-10 hidden rounded-md border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs text-slate-200 hover:border-sky-400 lg:block"
            >
              Ficha del caso ›
            </button>
          )
        ) : null}
        {selectedRegionId && REGION_MESHES[selectedRegionId] ? (
          <button
            type="button"
            onClick={() => setFocus(focus === "region" ? "body" : "region")}
            className="absolute left-1/2 top-4 -translate-x-1/2 rounded-md border border-slate-700 bg-slate-950/80 px-3 py-1 text-xs text-slate-200 hover:border-sky-400"
          >
            {focus === "region" ? "Ver cuerpo completo" : "Enfocar región"}
          </button>
        ) : null}
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
        <ul
          aria-label="Leyenda del modelo"
          className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400"
        >
          <LegendItem color={ANATOMY_COLORS.selectable}>
            Región con módulo (se puede seleccionar)
          </LegendItem>
          <LegendItem color={ANATOMY_COLORS.selected}>
            Región seleccionada
          </LegendItem>
          <LegendItem color={ANATOMY_COLORS.context}>
            Resto del cuerpo: contexto, no evaluado
          </LegendItem>
          <li>Los colores no indican estado de salud.</li>
        </ul>
        {note ? <p className="text-xs text-amber-200/90">{note}</p> : null}
        <p className="text-xs text-slate-400">
          Arrastre para girar y use la rueda para acercar. Lateralidad no
          individualizada: ambos lados forman una región. {MODEL_CREDIT}
        </p>
      </div>
    </div>
  );
}

function LegendItem({
  color,
  children,
}: {
  color: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {children}
    </li>
  );
}

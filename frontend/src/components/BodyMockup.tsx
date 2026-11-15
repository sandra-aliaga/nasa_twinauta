import type { Region } from "../api";

/**
 * Frontend-owned mapping from semantic region ids to selectable shapes.
 * Both thighs form one region: the contract has no laterality.
 * This is a 2D placeholder until the GLB and its license are reviewed.
 */
const REGION_SHAPES: Record<string, string[]> = {
  quadriceps: [
    "M84 214 Q80 250 84 292 L104 292 Q108 250 106 214 Z",
    "M116 214 Q114 250 118 292 L138 292 Q142 250 138 214 Z",
  ],
};

type BodyMockupProps = {
  regions: Region[];
  selectedRegionId: string | null;
  onSelect: (regionId: string) => void;
};

/** Selectable body silhouette. Regions without a shape are listed below. */
export function BodyMockup({
  regions,
  selectedRegionId,
  onSelect,
}: BodyMockupProps) {
  const unmapped = regions.filter((region) => !REGION_SHAPES[region.id]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <svg
        viewBox="0 0 222 420"
        className="h-[min(70vh,560px)] w-auto"
        role="group"
        aria-label="Silueta del cuerpo con regiones seleccionables"
      >
        {/* Static silhouette: not selectable, not anatomical. */}
        <g className="fill-slate-800 stroke-slate-600" strokeWidth={1.5}>
          <circle cx={111} cy={40} r={26} />
          <rect x={98} y={64} width={26} height={14} rx={4} />
          <path d="M70 80 Q111 70 152 80 L148 210 Q111 222 74 210 Z" />
          <path d="M70 84 L48 170 L40 236 L54 238 L64 176 L80 112 Z" />
          <path d="M152 84 L174 170 L182 236 L168 238 L158 176 L142 112 Z" />
          <path d="M74 210 Q111 222 148 210 L140 216 L82 216 Z" />
          <path d="M84 292 L104 292 L102 380 L86 380 Z" />
          <path d="M118 292 L138 292 L136 380 L120 380 Z" />
          <path d="M82 380 L104 380 L106 396 L78 396 Z" />
          <path d="M118 380 L140 380 L144 396 L116 396 Z" />
        </g>

        {regions
          .filter((region) => REGION_SHAPES[region.id])
          .map((region) => {
            const selected = region.id === selectedRegionId;
            return (
              <g
                key={region.id}
                role="button"
                tabIndex={0}
                aria-pressed={selected}
                aria-label={`Seleccionar ${region.label}`}
                onClick={() => onSelect(region.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(region.id);
                  }
                }}
                className={`cursor-pointer outline-none transition ${
                  selected
                    ? "fill-sky-400/80 stroke-sky-200"
                    : "fill-slate-600 stroke-slate-400 hover:fill-sky-500/50 focus-visible:fill-sky-500/50"
                }`}
                strokeWidth={1.5}
              >
                <title>{region.label}</title>
                {REGION_SHAPES[region.id].map((d) => (
                  <path key={d} d={d} />
                ))}
              </g>
            );
          })}
      </svg>

      {unmapped.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2">
          {unmapped.map((region) => (
            <button
              key={region.id}
              type="button"
              onClick={() => onSelect(region.id)}
              className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-sky-400"
            >
              {region.label}
            </button>
          ))}
        </div>
      ) : null}

      <p className="max-w-sm text-center text-xs text-slate-500">
        Maqueta 2D sin precisión anatómica. El modelo 3D y su licencia están
        pendientes. Seleccione el muslo para elegir el cuádriceps.
      </p>
    </div>
  );
}

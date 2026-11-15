import type { CSSProperties } from "react";

import { explorerSource } from "../api/explorer";
import type { PaperCard } from "../api/explorer/types";
import { useLoad } from "../hooks/useLoad";
import { CardiacPanel } from "./CardiacPanel";
import { ErrorNotice, Skeleton } from "./common";

// The corpus is about muscle; these searches find its cardiovascular papers.
const HEART_QUERIES = ["cardiovascular", "cardiac"];

/**
 * Heart zone. It is not an assessment: the backend has no cardiac module or
 * heart data for the virtual astronaut. It shows the terrestrial heart-rate
 * example and the studies of the corpus that deal with the cardiovascular
 * system, each labelled for what it is.
 */
export function HeartPanel({
  caseRecordingId,
  onClose,
  onOpenPaper,
}: {
  caseRecordingId: string | null;
  onClose: () => void;
  onOpenPaper: (paperId: string) => void;
}) {
  const papers = useLoad("heart-papers", async (signal) => {
    const pages = await Promise.all(
      HEART_QUERIES.map((q) => explorerSource.searchPapers({ q }, signal)),
    );
    const unique = new Map<string, PaperCard>();
    for (const page of pages) {
      for (const item of page.items) unique.set(item.id, item);
    }
    return [...unique.values()];
  });

  return (
    <div className="flex h-full animate-fade-in flex-col">
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <h2 className="flex items-center gap-2 font-display text-base font-medium text-slate-50">
          <svg
            viewBox="0 0 16 16"
            className="h-4 w-4 text-step-next"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M8 14s-5.5-3.4-5.5-7.3A3 3 0 0 1 8 5a3 3 0 0 1 5.5 1.7C13.5 10.6 8 14 8 14z"
            />
          </svg>
          Corazón
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar región"
          className="rounded-md px-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        >
          ×
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        <div
          className="hud-panel px-4 py-3"
          style={{ "--rail": "var(--color-step-next)" } as CSSProperties}
        >
          <p className="text-sm font-semibold text-slate-50">
            Frecuencia cardíaca durante ejercicio
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Reproducción de una prueba real en cinta de PhysioNet, con tiempo,
            unidad y procedencia de cada medición. Esta fuente terrestre se
            consulta de forma independiente de los estudios musculares.
          </p>
        </div>

        <CardiacPanel
          embedded
          caseRecordingId={caseRecordingId}
          onClose={onClose}
        />

        <section>
          <h3 className="text-sm font-medium text-slate-100">
            Estudios sobre el sistema cardiovascular
          </h3>
          {papers === null || papers.status === "loading" ? (
            <Skeleton lines={3} label="Cargando estudios" className="mt-2" />
          ) : papers.status === "error" ? (
            <div className="mt-2">
              <ErrorNotice error={papers.error} />
            </div>
          ) : papers.data.length === 0 ? (
            <p className="mt-2 text-xs text-slate-400">
              El corpus actual no tiene estudios cardiovasculares.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {papers.data.map((paper) => (
                <li key={paper.id}>
                  <button
                    type="button"
                    onClick={() => onOpenPaper(paper.id)}
                    className="hud-panel w-full px-4 py-2.5 text-left"
                    style={
                      { "--rail": "var(--color-step-next)" } as CSSProperties
                    }
                  >
                    <span className="block text-sm font-medium text-slate-50">
                      {paper.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">
                      {paper.year} · Abrir en la biblioteca
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-[11px] text-slate-400">
            El corpus se armó para el músculo; estos son los estudios que
            también tratan lo cardiovascular.
          </p>
        </section>
      </div>
    </div>
  );
}

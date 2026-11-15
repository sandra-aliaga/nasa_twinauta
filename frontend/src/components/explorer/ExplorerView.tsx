import { useEffect, useRef, useState } from "react";

import { explorerSource } from "../../api/explorer";
import type { LibraryView, PaperQuery } from "../../api/explorer/types";
import { useLoad } from "../../hooks/useLoad";
import {
  IMPLEMENTATION_LABELS,
  INTERPRETATION_LABELS,
  LIBRARY_VIEW_LABELS,
} from "../../lib/explorerLabels";
import { ENVIRONMENT_LABELS, REVIEW_LABELS } from "../../lib/labels";
import { ErrorNotice, Notice, Skeleton, Tag } from "../common";
import { LibraryGraph } from "./LibraryGraph";
import { PaperDetailView } from "./PaperDetailView";

type Filters = {
  q: string;
  view: LibraryView | "";
  review: "pending" | "reviewed" | "";
  yearFrom: string;
  yearTo: string;
};

const EMPTY: Filters = {
  q: "",
  view: "",
  review: "",
  yearFrom: "",
  yearTo: "",
};

const DEFAULT_GRAPH_VIEW: LibraryView = "evidence";

function toQuery(filters: Filters, regionId: string | null): PaperQuery {
  const query: PaperQuery = {};
  if (filters.q.trim()) query.q = filters.q.trim();
  if (regionId) query.region_id = regionId;
  if (filters.view) query.view = filters.view;
  if (filters.review) query.review_status = filters.review;
  if (filters.yearFrom) query.year_from = Number(filters.yearFrom);
  if (filters.yearTo) query.year_to = Number(filters.yearTo);
  return query;
}

type ExplorerViewProps = {
  /** Region selected on the body, used as an optional filter. */
  regionId: string | null;
  /** Open assessment: adds context applicability to paper records. */
  assessmentId?: string | null;
  /** Paper to open first, e.g. from a citation of the contextual synthesis. */
  initialPaperId?: string | null;
  onBack: () => void;
};

/**
 * Scientific library explorer (contract draft 0.3) running on the mock
 * adapter. It explores the current corpus; it never replaces the frozen
 * graph of an assessment.
 */
export function ExplorerView({
  regionId,
  assessmentId = null,
  initialPaperId = null,
  onBack,
}: ExplorerViewProps) {
  const [draft, setDraft] = useState<Filters>(EMPTY);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [useRegion, setUseRegion] = useState(regionId !== null);
  const [mode, setMode] = useState<"list" | "graph">("list");
  const [paperId, setPaperId] = useState<string | null>(initialPaperId);
  useEffect(() => {
    if (initialPaperId) setPaperId(initialPaperId);
  }, [initialPaperId]);
  const asideRef = useRef<HTMLElement>(null);

  // On narrow screens the record opens below the list: bring it into view.
  useEffect(() => {
    if (paperId && window.matchMedia("(max-width: 1279px)").matches) {
      asideRef.current?.scrollIntoView({ block: "start" });
    }
  }, [paperId]);

  const query = toQuery(filters, useRegion ? regionId : null);
  const queryKey = JSON.stringify(query);
  const papers = useLoad(queryKey, (signal) =>
    explorerSource.searchPapers(query, signal),
  );
  const detail = useLoad(
    paperId && `${paperId}|${assessmentId ?? ""}`,
    (signal) =>
      explorerSource.getPaper(paperId as string, assessmentId ?? null, signal),
  );
  const base = useLoad("kb", (signal) =>
    explorerSource.getKnowledgeBase(signal),
  );
  const modules = useLoad("modules", (signal) =>
    explorerSource.listModules(signal),
  );

  return (
    <div className="flex h-full animate-fade-in flex-col">
      <div className="space-y-3 border-b border-slate-800 px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-slate-500"
          >
            ← Volver al cuerpo
          </button>
          <h2 className="font-display text-base text-slate-50">Biblioteca</h2>
          {base?.status === "ready" ? (
            <span className="text-xs text-slate-400">
              {base.data.paper_count} estudios,{" "}
              {base.data.reviewed_paper_count === 0
                ? "ninguno con revisión médica todavía"
                : `${base.data.reviewed_paper_count} con revisión médica`}
            </span>
          ) : null}
          {explorerSource.kind === "mock" ? (
            <Tag tone="amber">Demo: ejemplos, sin backend</Tag>
          ) : null}
        </div>

        <form
          className="space-y-2 text-xs text-slate-400"
          onSubmit={(event) => {
            event.preventDefault();
            setFilters(draft);
          }}
        >
          <div className="flex gap-2">
            <label className="flex-1">
              <span className="sr-only">Buscar estudios</span>
              <input
                type="search"
                value={draft.q}
                onChange={(event) =>
                  setDraft({ ...draft, q: event.target.value })
                }
                placeholder="Busca por tema, título o autor"
                className="w-full rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
            >
              Buscar
            </button>
          </div>

          {/* Sections as one-tap chips: they apply at once. */}
          <div
            role="group"
            aria-label="Qué quieres saber"
            className="flex flex-wrap gap-1.5"
          >
            {(
              [
                ["", "Todo"],
                ...(Object.keys(LIBRARY_VIEW_LABELS) as LibraryView[]).map(
                  (view) => [view, LIBRARY_VIEW_LABELS[view]] as const,
                ),
              ] as const
            ).map(([value, label]) => (
              <button
                key={value || "all"}
                type="button"
                aria-pressed={filters.view === value}
                onClick={() => {
                  const next = { ...draft, view: value as Filters["view"] };
                  setDraft(next);
                  setFilters(next);
                }}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  filters.view === value
                    ? "bg-sky-500 text-slate-950"
                    : "bg-slate-800 text-slate-300 hover:text-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <details>
            <summary className="cursor-pointer text-slate-300">
              Más filtros
            </summary>
            <div className="mt-2 flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1">
                Revisión
                <select
                  value={draft.review}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      review: event.target.value as Filters["review"],
                    })
                  }
                  className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100"
                >
                  <option value="">Pendientes y revisadas</option>
                  <option value="pending">{REVIEW_LABELS.pending}</option>
                  <option value="reviewed">{REVIEW_LABELS.reviewed}</option>
                </select>
              </label>
              <label className="flex w-20 flex-col gap-1">
                Desde
                <input
                  type="number"
                  inputMode="numeric"
                  value={draft.yearFrom}
                  onChange={(event) =>
                    setDraft({ ...draft, yearFrom: event.target.value })
                  }
                  className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100"
                />
              </label>
              <label className="flex w-20 flex-col gap-1">
                Hasta
                <input
                  type="number"
                  inputMode="numeric"
                  value={draft.yearTo}
                  onChange={(event) =>
                    setDraft({ ...draft, yearTo: event.target.value })
                  }
                  className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-slate-100"
                />
              </label>
              {regionId ? (
                <label className="flex items-center gap-1.5 pb-1">
                  <input
                    type="checkbox"
                    checked={useRegion}
                    onChange={(event) => setUseRegion(event.target.checked)}
                    className="accent-sky-400"
                  />
                  Solo la zona seleccionada
                </label>
              ) : null}
              <button
                type="submit"
                className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-slate-500"
              >
                Aplicar
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(EMPTY);
                  setFilters(EMPTY);
                }}
                className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:border-slate-500"
              >
                Limpiar
              </button>
            </div>
          </details>
        </form>

        <div
          role="group"
          aria-label="Modo de exploración"
          className="flex gap-1"
        >
          {(
            [
              ["list", "Lista"],
              ["graph", "Mapa de estudios"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
              className={`rounded-md px-3 py-1 text-sm ${
                mode === value
                  ? "bg-sky-500/20 text-sky-100"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 ${
          mode === "list" ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""
        }`}
      >
        <div className="min-h-0 space-y-4">
          {mode === "list" ? (
            <section aria-label="Resultados">
              {papers === null || papers.status === "loading" ? (
                <Notice title="Buscando en el corpus…" />
              ) : papers.status === "error" ? (
                <ErrorNotice error={papers.error} />
              ) : papers.data.items.length === 0 ? (
                <Notice title="Sin resultados">
                  No hay publicaciones del corpus para estos filtros. Esto no
                  significa que no existan estudios sobre el tema.
                </Notice>
              ) : (
                <>
                  <p className="mb-2 text-xs text-slate-400">
                    {papers.data.total_matching === 1
                      ? "1 publicación del corpus coincide"
                      : `${papers.data.total_matching} publicaciones del corpus coinciden`}{" "}
                    · los más recientes primero
                  </p>
                  <ul className="space-y-2">
                    {papers.data.items.map((paper) => (
                      <li key={paper.id}>
                        <button
                          type="button"
                          onClick={() => setPaperId(paper.id)}
                          aria-current={paper.id === paperId}
                          className="hud-panel w-full px-4 py-3 text-left"
                          style={
                            {
                              "--rail":
                                paper.id === paperId
                                  ? "var(--color-sky-400)"
                                  : "var(--color-slate-600)",
                            } as React.CSSProperties
                          }
                        >
                          <p className="text-xs text-slate-400">
                            {paper.year} ·{" "}
                            {ENVIRONMENT_LABELS[paper.environment]}
                            {paper.review_status === "reviewed"
                              ? " · revisado"
                              : ""}
                          </p>
                          <p
                            className={`mt-0.5 text-sm font-medium ${
                              paper.id === paperId
                                ? "text-sky-200"
                                : "text-slate-100"
                            }`}
                          >
                            {paper.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {paper.authors.slice(0, 3).join(", ")}
                            {paper.authors.length > 3 ? " y otros" : ""}
                          </p>
                          {paper.sections.length > 0 ? (
                            <p className="mt-1.5 text-xs text-slate-300">
                              Trata:{" "}
                              {paper.sections
                                .map((section) =>
                                  LIBRARY_VIEW_LABELS[section].toLowerCase(),
                                )
                                .join(", ")}
                            </p>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          ) : (
            <>
              {query.view ? null : (
                <p className="text-xs text-slate-400">
                  El grafo se consulta por sección. Sin sección elegida se
                  muestra «{LIBRARY_VIEW_LABELS[DEFAULT_GRAPH_VIEW]}»; cambie la
                  sección en los filtros para ver otra.
                </p>
              )}
              <LibraryGraph
                // The contract requires a view for the graph, unlike the list.
                query={{ ...query, view: query.view ?? DEFAULT_GRAPH_VIEW }}
                assessmentId={assessmentId}
                onOpenPaper={(id) => {
                  setPaperId(id);
                }}
              />
            </>
          )}

          <section
            aria-label="Cobertura de módulos"
            className="rounded-lg border border-slate-800 p-3"
          >
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Cobertura de módulos
            </h3>
            {modules?.status === "ready" ? (
              <ul className="mt-2 space-y-2 text-xs">
                {modules.data.modules.map((module) => (
                  <li key={module.id}>
                    <p className="text-slate-200">
                      {module.label} · v{module.version}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <Tag>
                        {IMPLEMENTATION_LABELS[module.implementation_status]}
                      </Tag>
                      <Tag
                        tone={
                          module.interpretation_status === "reviewed"
                            ? "emerald"
                            : "amber"
                        }
                      >
                        {INTERPRETATION_LABELS[module.interpretation_status]}
                      </Tag>
                    </div>
                    <p className="mt-1 text-slate-400">
                      {module.coverage_description}
                    </p>
                  </li>
                ))}
                <li className="text-slate-400">
                  Las regiones sin módulo no se interpretan; no significa que
                  estén sanas.
                </li>
              </ul>
            ) : modules?.status === "error" ? (
              <ErrorNotice error={modules.error} />
            ) : (
              <Skeleton lines={2} label="Cargando catálogo" className="mt-2" />
            )}
          </section>
        </div>

        <aside
          ref={asideRef}
          aria-label="Ficha de la publicación"
          className="min-h-0 scroll-mt-4"
        >
          <div key={paperId ?? "none"} className="animate-slide-in-right">
            {paperId === null ? (
              <Notice title="Ninguna publicación seleccionada">
                Elige una publicación de la lista o un nodo del grafo para abrir
                su ficha.
              </Notice>
            ) : detail === null || detail.status === "loading" ? (
              <Skeleton lines={8} label="Cargando ficha" />
            ) : detail.status === "error" ? (
              <ErrorNotice error={detail.error} />
            ) : (
              <PaperDetailView detail={detail.data} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

import { dataSource, toApiError, type TelemetryRecording } from "../api";
import { isAbort, type LoadState } from "../hooks/useCatalog";
import { ORIGIN_LABELS } from "../lib/labels";
import { ErrorNotice, Notice, Tag } from "./common";

type CardiacPanelProps = {
  recordingId: string;
  onClose: () => void;
};

/**
 * Didactic heart-rate panel. It belongs to an independent terrestrial
 * recording, so its clock (seconds) never mixes with mission days.
 * Metadata is loaded first, as the contract requires; playback comes next.
 */
export function CardiacPanel({ recordingId, onClose }: CardiacPanelProps) {
  const [state, setState] = useState<LoadState<TelemetryRecording>>({
    status: "loading",
  });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    dataSource
      .getRecordingMetadata(recordingId, controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((error: unknown) => {
        if (!isAbort(error)) {
          setState({ status: "error", error: toApiError(error) });
        }
      });
    return () => controller.abort();
  }, [recordingId]);

  return (
    <section className="border-t border-slate-800 bg-slate-900/70 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-100">
          Frecuencia cardíaca (didáctica)
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        >
          Cerrar
        </button>
      </div>

      {state.status === "loading" ? (
        <p className="mt-2 text-xs text-slate-400">Cargando metadatos…</p>
      ) : null}
      {state.status === "error" ? (
        <div className="mt-2">
          <ErrorNotice error={state.error} />
        </div>
      ) : null}
      {state.status === "ready" ? (
        <div className="mt-2 space-y-2">
          <div className="flex flex-wrap gap-1">
            <Tag tone="violet">Ejercicio terrestre</Tag>
            <Tag>Participante {state.data.participant_id}</Tag>
            <Tag>{ORIGIN_LABELS[state.data.origin]}</Tag>
            <Tag>Duración {state.data.end_s - state.data.start_s} s</Tag>
          </div>
          <Notice title="No es una medición del astronauta virtual">
            {`Procede de otro participante y otro dataset (${state.data.dataset_id}). `}
            Su tiempo está en segundos desde el inicio de la prueba.
          </Notice>
          <p className="text-xs text-slate-500">
            Reproducción por ventanas: siguiente paso.
          </p>
        </div>
      ) : null}
    </section>
  );
}

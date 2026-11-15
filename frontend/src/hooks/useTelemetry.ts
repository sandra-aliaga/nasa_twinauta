import { useEffect, useState } from "react";

import {
  dataSource,
  toApiError,
  type ApiError,
  type TelemetryRecording,
  type TelemetryWindow,
} from "../api";
import { isAbort } from "./useCatalog";

type Point = TelemetryWindow["points"][number];

export type TelemetryState =
  | { status: "loading" }
  | { status: "error"; error: ApiError }
  | {
      status: "ready";
      recording: TelemetryRecording;
      source: TelemetryWindow["source"] | null;
      points: Point[];
      /** Upper bound (seconds) of the data loaded so far. */
      loadedUntil: number;
      complete: boolean;
      /** Set when a later window failed; earlier points stay usable. */
      windowError: ApiError | null;
    };

/**
 * Load a recording's metadata and then every window in order, following
 * next_start_s as the contract requires. Points are appended as they arrive,
 * so playback can start before the whole recording is loaded.
 */
export function useTelemetry(recordingId: string): TelemetryState {
  const [state, setState] = useState<TelemetryState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    setState({ status: "loading" });

    async function load() {
      const recording = await dataSource.getRecordingMetadata(
        recordingId,
        signal,
      );
      let points: Point[] = [];
      let start: number | null = recording.start_s;
      setState({
        status: "ready",
        recording,
        source: null,
        points,
        loadedUntil: recording.start_s,
        complete: false,
        windowError: null,
      });

      while (start !== null) {
        const end = start + recording.max_window_seconds;
        let window: TelemetryWindow;
        try {
          window = await dataSource.getTelemetryWindow(
            recordingId,
            start,
            end,
            signal,
          );
        } catch (error) {
          if (isAbort(error)) throw error;
          const windowError = toApiError(error);
          setState((prev) =>
            prev.status === "ready" ? { ...prev, windowError } : prev,
          );
          return;
        }
        points = points.concat(window.points);
        const next = window.next_start_s;
        setState({
          status: "ready",
          recording,
          source: window.source,
          points,
          loadedUntil: next ?? window.recording_end_s,
          complete: next === null,
          windowError: null,
        });
        start = next;
      }
    }

    load().catch((error: unknown) => {
      if (!isAbort(error))
        setState({ status: "error", error: toApiError(error) });
    });
    return () => controller.abort();
  }, [recordingId]);

  return state;
}

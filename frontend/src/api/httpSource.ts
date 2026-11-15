import type { DataSource } from "./dataSource";
import { ApiError, isApiErrorBody } from "./errors";

/** Perform a JSON request and normalize non-2xx responses to ApiError. */
async function requestJson<T>(
  baseUrl: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...init.headers },
  });

  if (!response.ok) {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      // Body is not JSON; fall back to a generic error object below.
      body = null;
    }
    throw new ApiError(
      response.status,
      isApiErrorBody(body)
        ? body
        : {
            code: "http_error",
            message: `El servicio respondió con estado ${response.status}.`,
            details: [],
          },
    );
  }

  return (await response.json()) as T;
}

/** Create a data source that calls the backend described by the contract. */
export function createHttpSource(baseUrl: string): DataSource {
  const base = baseUrl.replace(/\/+$/, "");
  const enc = encodeURIComponent;

  return {
    kind: "api",
    listCases: (signal) => requestJson(base, "/cases", { signal }),
    listIndicators: (signal) => requestJson(base, "/indicators", { signal }),
    listRegions: (caseId, signal) =>
      requestJson(base, `/cases/${enc(caseId)}/regions`, { signal }),
    createAssessment: (request, signal) =>
      requestJson(base, "/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal,
      }),
    getAssessment: (assessmentId, signal) =>
      requestJson(base, `/assessments/${enc(assessmentId)}`, { signal }),
    getGraph: (assessmentId, view, signal) =>
      requestJson(base, `/assessments/${enc(assessmentId)}/graphs/${view}`, {
        signal,
      }),
    updateAction: (assessmentId, actionId, update) =>
      requestJson(
        base,
        `/assessments/${enc(assessmentId)}/actions/${enc(actionId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        },
      ),
    getTelemetryWindow: (recordingId, startS, endS, signal) =>
      requestJson(
        base,
        `/telemetry/${enc(recordingId)}?start_s=${startS}&end_s=${endS}`,
        { signal },
      ),
    getRecordingMetadata: (recordingId, signal) =>
      requestJson(base, `/telemetry/${enc(recordingId)}/metadata`, { signal }),
  };
}

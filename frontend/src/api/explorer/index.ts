import { createExplorerHttp } from "./httpSource";
import { createExplorerMock } from "./mockSource";
import type { ExplorerSource } from "./source";

export type { ExplorerSource } from "./source";

/** Same mode as the main data source: the backend in "api", the fixture otherwise. */
function selectExplorerSource(): ExplorerSource {
  const mode = import.meta.env.VITE_DATA_SOURCE ?? "examples";
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return mode === "api" && baseUrl
    ? createExplorerHttp(baseUrl)
    : createExplorerMock();
}

export const explorerSource: ExplorerSource = selectExplorerSource();

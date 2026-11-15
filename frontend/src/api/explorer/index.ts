import { createExplorerHttp } from "./httpSource";
import { apiBaseUrl, dataMode } from "../config";
import { createExplorerMock } from "./mockSource";
import type { ExplorerSource } from "./source";

export type { ExplorerSource } from "./source";

/** Use the same explicit mode as the main data source. */
function selectExplorerSource(): ExplorerSource {
  return dataMode === "api"
    ? createExplorerHttp(apiBaseUrl)
    : createExplorerMock();
}

export const explorerSource: ExplorerSource = selectExplorerSource();

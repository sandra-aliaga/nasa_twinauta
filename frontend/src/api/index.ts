import type { DataSource } from "./dataSource";
import { apiBaseUrl, dataMode } from "./config";
import { createExamplesSource } from "./examplesSource";
import { createHttpSource } from "./httpSource";

/** Select fixtures only when explicitly requested. */
function selectDataSource(): DataSource {
  if (dataMode === "api") {
    return createHttpSource(apiBaseUrl);
  }
  return createExamplesSource();
}

export const dataSource: DataSource = selectDataSource();
export type { DataSource } from "./dataSource";
export { ApiError, toApiError } from "./errors";
export type * from "./types";

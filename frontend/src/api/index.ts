import type { DataSource } from "./dataSource";
import { createExamplesSource } from "./examplesSource";
import { createHttpSource } from "./httpSource";

/**
 * Pick the data source from VITE_DATA_SOURCE ("examples" by default).
 * The API source requires VITE_API_BASE_URL.
 */
function selectDataSource(): DataSource {
  const mode = import.meta.env.VITE_DATA_SOURCE ?? "examples";
  if (mode === "api") {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    if (!baseUrl) {
      throw new Error(
        "VITE_API_BASE_URL is required when VITE_DATA_SOURCE=api.",
      );
    }
    return createHttpSource(baseUrl);
  }
  return createExamplesSource();
}

export const dataSource: DataSource = selectDataSource();
export type { DataSource } from "./dataSource";
export { ApiError, toApiError } from "./errors";
export type * from "./types";

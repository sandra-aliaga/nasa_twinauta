/** Explicit fixtures are available for design work; normal builds use the API. */
export const dataMode = import.meta.env.VITE_DATA_SOURCE ?? "api";
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";

if (dataMode !== "api" && dataMode !== "examples") {
  throw new Error("VITE_DATA_SOURCE must be api or examples.");
}

import type { ApiErrorBody } from "./types";
/** Error raised by any data source, normalized to the shared contract shape. */
export class ApiError extends Error {
  readonly status: number | null;
  readonly code: string;
  readonly details: string[];

  constructor(status: number | null, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.details = body.details;
  }
}

/** Return true when a value matches the contract error object. */
export function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.code === "string" &&
    typeof candidate.message === "string" &&
    Array.isArray(candidate.details)
  );
}

/** Convert an unknown thrown value into an ApiError for display. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof TypeError) {
    return new ApiError(null, {
      code: "network_error",
      message: "No se pudo conectar con el servicio.",
      details: [
        "Compruebe la conexión o que el backend esté en marcha.",
        `Detalle técnico: ${error.message}`,
      ],
    });
  }
  return new ApiError(null, {
    code: "unexpected_error",
    message: "Ocurrió un error inesperado.",
    details: [error instanceof Error ? error.message : String(error)],
  });
}

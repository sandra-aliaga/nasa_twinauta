import { useEffect, useState } from "react";

import { toApiError } from "../api";
import { isAbort, type LoadState } from "./useCatalog";

/**
 * Generic loader with abort on change. `key` must change whenever the
 * request changes; null skips loading.
 */
export function useLoad<T>(
  key: string | null,
  load: (signal: AbortSignal) => Promise<T>,
): LoadState<T> | null {
  const [state, setState] = useState<LoadState<T> | null>(null);

  useEffect(() => {
    if (key === null) {
      setState(null);
      return;
    }
    const controller = new AbortController();
    setState({ status: "loading" });
    load(controller.signal)
      .then((data) => setState({ status: "ready", data }))
      .catch((error: unknown) => {
        if (!isAbort(error))
          setState({ status: "error", error: toApiError(error) });
      });
    return () => controller.abort();
    // `load` is recreated on each render; `key` identifies the request.
  }, [key]);

  return state;
}

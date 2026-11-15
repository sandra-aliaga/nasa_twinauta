/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_SOURCE?: "examples" | "api";
  readonly VITE_API_BASE_URL?: string;
  /** "true" shows the terrestrial heart-rate panel; off unless set. */
  readonly VITE_ENABLE_HEART_RATE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

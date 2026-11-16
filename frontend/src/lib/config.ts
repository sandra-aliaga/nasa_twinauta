import { msg } from "../i18n";
/**
 * Reference scenario request values. They mirror
 * contracts/examples/assessment-request.json and are placeholders until the
 * reviewed model domain is known; the backend decides if they are in domain.
 */
export const REFERENCE_START_DAY = 0;
export const HORIZON_DAYS = 20;

/** Initial mission day shown in the selector before any evaluation. */
export const INITIAL_MISSION_DAY = 10;

/**
 * Reference recordings offered besides the case recording. The API has no
 * catalog of recordings yet; this id is published in docs/ENTREGA_FRONTEND.md.
 * It belongs to another participant on a treadmill, never to the virtual case.
 */
export const REFERENCE_RECORDINGS = [
  {
    id: "physionet_treadmill_1_0_1_2_1",
    label: msg("Referencia real: prueba en cinta (PhysioNet)"),
  },
] as const;

/**
 * The heart-rate panel shows a terrestrial PhysioNet recording. The recording stays
 * separate from the muscular study; public redistribution terms need review.
 */
export const HEART_RATE_ENABLED =
  import.meta.env.VITE_ENABLE_HEART_RATE !== "false";

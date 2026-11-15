/**
 * Frontend-owned anatomy asset and mapping from semantic region ids to GLB
 * mesh names. The backend only knows region ids (contract 0.2).
 */

/** Served from frontend/public/models. */
export const MODEL_URL =
  "/models/full-body-muscular-system-superficial-layer.glb";

/** Declared in the GLB asset metadata (asset.copyright). */
export const MODEL_CREDIT =
  "Modelo anatómico: Innerscene Corp, dominio público (CC0 1.0).";

/**
 * Both sides form one region: the contract has no laterality.
 * The model is a superficial layer, so the vastus intermedius (deep) is absent.
 */
export const REGION_MESHES: Record<string, string[]> = {
  quadriceps: [
    "Left rectus femoris",
    "Right rectus femoris",
    "Left vastus lateralis",
    "Right vastus lateralis",
    "Left vastus medialis",
    "Right vastus medialis",
  ],
};

/** Honest notes about what the 3D representation does not show. */
export const REGION_MODEL_NOTES: Record<string, string> = {
  quadriceps:
    "El modelo solo representa la capa superficial: el vasto intermedio no aparece, aunque forma parte del cuádriceps.",
};

/** Detect WebGL support before mounting the 3D canvas. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    // Some browsers throw when WebGL is disabled by policy.
    return false;
  }
}

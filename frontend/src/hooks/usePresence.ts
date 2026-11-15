import { useEffect, useState } from "react";

/**
 * Keep an element mounted while its exit animation plays. Returns whether to
 * render it and whether it is leaving (to apply the exit animation class).
 */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const id = window.setTimeout(() => setMounted(false), reduced ? 0 : exitMs);
    return () => window.clearTimeout(id);
  }, [open, exitMs]);

  return { mounted: open || mounted, leaving: !open && mounted };
}

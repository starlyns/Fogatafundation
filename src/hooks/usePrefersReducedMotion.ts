"use client";

import { useEffect, useState } from "react";

/**
 * Tracks `prefers-reduced-motion`. Returns `true` when the user has asked the
 * system to minimise motion. Defaults to `true` until measured so we never
 * flash heavy animation at someone who opted out.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

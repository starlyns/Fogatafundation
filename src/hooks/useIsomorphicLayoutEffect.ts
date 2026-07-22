import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect warns during SSR. This swaps to useEffect on the server so
 * GSAP setup (which must run before paint on the client) stays quiet.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

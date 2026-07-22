/**
 * Tiny mutable store shared between the GSAP/ScrollTrigger layer (which writes
 * scroll-driven progress values) and the React Three Fiber layer (which reads
 * them inside `useFrame`). Kept outside React state on purpose: these values
 * update every frame and must never trigger re-renders.
 */

export type ScrollState = {
  /** Normalised 0..1 progress through the pinned "How it works" section. */
  howItWorks: number;
  /** Normalised pointer position, -1..1 on each axis, for camera parallax. */
  pointerX: number;
  pointerY: number;
  /** Final CTA ember intensity, 0..1, rises as the section enters view. */
  finalCtaIntensity: number;
};

export const scrollState: ScrollState = {
  howItWorks: 0,
  pointerX: 0,
  pointerY: 0,
  finalCtaIntensity: 0,
};

/** Reset — used on unmount/cleanup so a remount starts from a known state. */
export function resetScrollState() {
  scrollState.howItWorks = 0;
  scrollState.pointerX = 0;
  scrollState.pointerY = 0;
  scrollState.finalCtaIntensity = 0;
}

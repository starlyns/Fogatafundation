/**
 * Central GSAP entry point. Registering plugins here — at module-evaluation
 * time on the client — guarantees they're available before any component's
 * layout effect runs (child effects fire before parent effects, so registering
 * inside a provider effect would be too late). Registration is guarded so the
 * server bundle never touches browser-only plugin internals.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

export { gsap, ScrollTrigger, SplitText };

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { detectDeviceProfile, type DeviceProfile } from "@/lib/device";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { scrollState } from "@/lib/store";

type ExperienceContextValue = {
  reducedMotion: boolean;
  device: DeviceProfile;
  /** True once we've measured the client — 3D should wait for this. */
  ready: boolean;
  lenis: Lenis | null;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function useExperience(): ExperienceContextValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    throw new Error("useExperience must be used within <ExperienceProvider>");
  }
  return ctx;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion();
  const [device, setDevice] = useState<DeviceProfile>(() =>
    detectDeviceProfile(),
  );
  const [ready, setReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Measure real device capability on the client after mount.
  useEffect(() => {
    setDevice(detectDeviceProfile());
    setReady(true);
  }, []);

  // GSAP plugins are registered on import in "@/lib/gsap".

  // Smooth scrolling via Lenis, driven by GSAP's ticker so ScrollTrigger and
  // Lenis share a single requestAnimationFrame loop. Disabled entirely when the
  // user prefers reduced motion.
  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) {
      // Ensure native scrolling and no lingering ScrollTriggers.
      ScrollTrigger.getAll().forEach((t) => t.kill());
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      // GSAP ticker time is in seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Pointer tracking for camera parallax (skipped under reduced motion / touch).
  useEffect(() => {
    if (reducedMotion || device.isTouch) {
      scrollState.pointerX = 0;
      scrollState.pointerY = 0;
      return;
    }
    const onMove = (event: PointerEvent) => {
      scrollState.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, device.isTouch]);

  const value = useMemo<ExperienceContextValue>(
    () => ({ reducedMotion, device, ready, lenis: lenisRef.current }),
    [reducedMotion, device, ready],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

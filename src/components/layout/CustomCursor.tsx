"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useExperience } from "@/components/providers/ExperienceProvider";

/**
 * Desktop-only ember cursor: a soft glowing dot that eases toward the pointer
 * and scales up over interactive elements. Disabled on touch devices. Under
 * reduced motion it follows instantly (no easing) but stays available.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const { device, reducedMotion } = useExperience();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only on precise pointers (mouse), never touch.
    const fine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(fine && !device.isTouch);
  }, [device.isTouch]);

  useEffect(() => {
    if (!enabled || !dotRef.current) return;
    const dot = dotRef.current;
    const xTo = gsap.quickTo(dot, "x", {
      duration: reducedMotion ? 0 : 0.5,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(dot, "y", {
      duration: reducedMotion ? 0 : 0.5,
      ease: "power3.out",
    });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        "a,button,[data-cursor='magnetic'],input,summary",
      );
      gsap.to(dot, {
        scale: target ? 2.4 : 1,
        opacity: target ? 0.5 : 0.9,
        duration: 0.3,
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(255,209,102,0.9) 0%, rgba(255,87,34,0.5) 45%, rgba(255,87,34,0) 70%)",
      }}
    />
  );
}

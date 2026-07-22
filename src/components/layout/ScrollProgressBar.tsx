"use client";

import { useEffect, useRef } from "react";

/**
 * Thin ember-gradient progress bar pinned to the very top of the viewport.
 * Uses a transform scale so it never triggers layout, and reads native scroll
 * metrics (works whether or not Lenis is active).
 */
export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? doc.scrollTop / max : 0;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-redOrange via-ember to-spark"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { useExperience } from "@/components/providers/ExperienceProvider";

const CIRCUMFERENCE = 2 * Math.PI * 20; // r = 20

/**
 * Ember-styled back-to-top button, bottom-right. Fades in past the hero and
 * carries a circular scroll-progress ring. Scrolls to top via Lenis when
 * available, otherwise native smooth (or instant under reduced motion).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);
  const { lenis, reducedMotion } = useExperience();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? doc.scrollTop / max : 0;
      setVisible(doc.scrollTop > window.innerHeight * 0.9);
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = `${
          CIRCUMFERENCE * (1 - progress)
        }`;
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

  const toTop = () => {
    if (lenis && !reducedMotion) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      data-cursor="magnetic"
      className={`fixed bottom-6 right-6 z-[65] flex h-14 w-14 items-center justify-center rounded-full border border-ember/30 bg-black/70 text-spark backdrop-blur-md transition-all duration-500 hover:border-ember hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 48 48"
        aria-hidden
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
        />
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="url(#btt-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
        <defs>
          <linearGradient id="btt-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E03E00" />
            <stop offset="100%" stopColor="#FFD166" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="relative"
      >
        <path
          d="M8 13V3M8 3L3 8M8 3L13 8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

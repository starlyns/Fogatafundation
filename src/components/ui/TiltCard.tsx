"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { useExperience } from "@/components/providers/ExperienceProvider";

/**
 * Card with a subtle 3D tilt toward the pointer and an ember edge-glow that
 * intensifies on hover. Tilt is disabled under reduced motion / on touch; the
 * glow still responds to hover via CSS in those cases.
 */
export function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion, device } = useExperience();
  const tilt = !reducedMotion && !device.isTouch;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(ref.current, {
      rotateY: px * 10,
      rotateX: -py * 10,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 900,
      transformOrigin: "center",
    });
  };

  const onLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`ember-glow-card group relative rounded-2xl border border-white/8 bg-charcoal p-6 transition-colors ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

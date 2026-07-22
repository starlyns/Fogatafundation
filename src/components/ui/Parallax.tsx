"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useExperience } from "@/components/providers/ExperienceProvider";

/**
 * Scrubbed vertical parallax. `speed` > 0 moves the element slower than scroll
 * (recedes); negative moves it faster. No-op under reduced motion.
 */
export function Parallax({
  children,
  speed = 0.2,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useExperience();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !ref.current) return;
    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reducedMotion, speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useExperience } from "@/components/providers/ExperienceProvider";

/**
 * Counts up to `value` when scrolled into view. Under reduced motion the final
 * value is shown immediately.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { reducedMotion } = useExperience();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      el.textContent = `${prefix}${value.toLocaleString()}${suffix}`;
      return;
    }
    const obj = { n: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        n: value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = `${prefix}${Math.round(obj.n).toLocaleString()}${suffix}`;
        },
      });
    }, el);
    return () => ctx.revert();
  }, [reducedMotion, value, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {reducedMotion ? value.toLocaleString() : "0"}
      {suffix}
    </span>
  );
}

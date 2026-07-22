"use client";

import { useRef, type ElementType, type FC, type ReactNode, type Ref } from "react";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useExperience } from "@/components/providers/ExperienceProvider";

type RevealProps = {
  children: ReactNode;
  /** Element to render. Defaults to a div. */
  as?: ElementType;
  className?: string;
  /** Stagger direct children instead of animating the block as one. */
  stagger?: boolean;
  delay?: number;
  /** Vertical offset the content rises from. */
  y?: number;
};

/**
 * Fade-and-rise on scroll into view. When reduced motion is on, it renders the
 * content immediately with no transform so nothing is hidden.
 */
export function Reveal({
  children,
  as,
  className = "",
  stagger = false,
  delay = 0,
  y = 28,
}: RevealProps) {
  // Cast the polymorphic tag to a loose component signature: only intrinsic
  // tags are ever passed, and React 19's JSX types can't spread a ref across
  // the full ElementType union.
  const Tag = (as ?? "div") as unknown as FC<{
    ref: Ref<HTMLElement>;
    className?: string;
    children?: ReactNode;
  }>;
  const ref = useRef<HTMLElement>(null);
  const { reducedMotion } = useExperience();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !ref.current) return;
    const el = ref.current;

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.9,
        ease: "power3.out",
        delay,
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, stagger, delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

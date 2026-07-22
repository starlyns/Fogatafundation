"use client";

import {
  useRef,
  type CSSProperties,
  type ElementType,
  type FC,
  type ReactNode,
  type Ref,
} from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useExperience } from "@/components/providers/ExperienceProvider";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate on scroll into view (default) or immediately on mount. */
  trigger?: "scroll" | "mount";
  /** Split by characters (default) or words for very long headings. */
  by?: "chars" | "words";
  delay?: number;
};

/**
 * Headline animated with GSAP SplitText — a character (or word) stagger that
 * rises and fades in. Under reduced motion, the text renders statically.
 * SplitText restores the original DOM on cleanup so screen readers always see
 * the intact heading.
 */
export function SplitHeading({
  children,
  as,
  className = "",
  trigger = "scroll",
  by = "chars",
  delay = 0,
}: Props) {
  // Cast the polymorphic tag to a loose component signature: only intrinsic
  // tags are ever passed, and React 19's JSX types can't spread a ref across
  // the full ElementType union.
  const Tag = (as ?? "h2") as unknown as FC<{
    ref: Ref<HTMLElement>;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
  }>;
  const ref = useRef<HTMLElement>(null);
  const { reducedMotion } = useExperience();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !ref.current) return;
    const el = ref.current;
    let split: SplitText | null = null;

    const ctx = gsap.context(() => {
      split = new SplitText(el, {
        type: by,
        // Wrap each unit so overflow can clip the rise-in.
        linesClass: "split-line",
      });
      const targets = by === "chars" ? split.chars : split.words;

      gsap.from(targets, {
        yPercent: 120,
        opacity: 0,
        rotateX: -40,
        transformOrigin: "0% 100%",
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.03,
        delay,
        scrollTrigger:
          trigger === "scroll"
            ? { trigger: el, start: "top 85%", once: true }
            : undefined,
      });
    }, el);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [reducedMotion, by, trigger, delay]);

  return (
    <Tag ref={ref} className={className} style={{ perspective: 800 }}>
      {children}
    </Tag>
  );
}

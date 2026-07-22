"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap } from "@/lib/gsap";
import { useExperience } from "@/components/providers/ExperienceProvider";

type Variant = "primary" | "ghost" | "spark";

type Props = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-ember to-redOrange text-white shadow-[0_10px_40px_-10px_rgba(255,87,34,0.7)]",
  spark:
    "bg-gradient-to-b from-spark to-amber text-black shadow-[0_10px_40px_-10px_rgba(255,209,102,0.7)]",
  ghost:
    "border border-white/20 bg-white/[0.02] text-textPrimary backdrop-blur-sm hover:border-ember/60 hover:text-white",
};

/**
 * A magnetic CTA: the button eases toward the pointer on hover. Falls back to a
 * plain button when reduced motion is requested or on touch devices.
 */
export function MagneticButton({
  href,
  variant = "primary",
  children,
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { reducedMotion, device } = useExperience();
  const magnetic = !reducedMotion && !device.isTouch;

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, { x: x * 0.3, y: y * 0.4, duration: 0.6, ease: "power3.out" });
  };

  const handleLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor="magnetic"
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

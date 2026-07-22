"use client";

import { Suspense, type ReactNode } from "react";
import { View } from "@react-three/drei";
import { useExperience } from "@/components/providers/ExperienceProvider";

/**
 * Wraps a section's 3D content in a drei `<View>`, which renders a tracking div
 * in the DOM; the shared root Canvas composites the scene into that div's
 * bounds. Returns nothing under reduced motion or before the client is ready,
 * so the section's static fallback shows through instead.
 *
 * The wrapper div is decorative — always `aria-hidden`.
 */
export function SceneView({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { reducedMotion, ready } = useExperience();

  if (reducedMotion || !ready) return null;

  return (
    <View
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </View>
  );
}

"use client";

import { type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { View, Preload } from "@react-three/drei";
import * as THREE from "three";
import { useExperience } from "@/components/providers/ExperienceProvider";

/**
 * The one and only WebGL canvas. It is fixed to the viewport and composites
 * every section's `<View>` via drei's `View.Port`. Pointer events are disabled
 * so the 3D layer never blocks the DOM UI on top of it.
 *
 * Renders nothing when the user prefers reduced motion — sections fall back to
 * static gradients — or before the client has measured device capability.
 */
export function CanvasRoot({
  eventSource,
}: {
  eventSource: RefObject<HTMLElement | null>;
}) {
  const { reducedMotion, ready, device } = useExperience();

  if (reducedMotion || !ready) return null;

  return (
    <Canvas
      className="canvas-root"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
      eventSource={eventSource as RefObject<HTMLElement>}
      eventPrefix="client"
      dpr={device.dpr}
      gl={{
        antialias: device.antialias,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <View.Port />
      <Preload all />
    </Canvas>
  );
}

"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS_HEX } from "@/lib/constants";
import { scrollState } from "@/lib/store";

const BASE_POSITIONS: [number, number, number][] = [
  [-3.2, 1.4, 0],
  [2.8, 2.0, -1.5],
  [-2.4, -1.8, 1.2],
  [3.0, -1.4, 0.8],
  [0.2, 0.3, -2.2],
];

/**
 * Five cold, unlit nodes drifting slowly apart — the point is disconnection, so
 * they never ignite. Faint rim light only, so they read as present but dormant.
 */
export function ColdNodes() {
  const groupRefs = useRef<THREE.Group[]>([]);
  const seeds = useMemo(
    () => BASE_POSITIONS.map(() => Math.random() * Math.PI * 2),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    groupRefs.current.forEach((g, i) => {
      if (!g) return;
      const seed = seeds[i];
      const base = BASE_POSITIONS[i];
      // Slow drift outward from centre, plus gentle bob.
      const drift = 0.4 + Math.sin(t * 0.15 + seed) * 0.2;
      g.position.set(
        base[0] * (1 + drift * 0.06),
        base[1] * (1 + drift * 0.06) + Math.sin(t * 0.4 + seed) * 0.15,
        base[2],
      );
      g.rotation.x = t * 0.1 + seed;
      g.rotation.y = t * 0.14 + seed;

      // Very slight pointer parallax on the whole cluster.
      g.position.x += scrollState.pointerX * 0.1;
    });
  });

  return (
    <group>
      <ambientLight intensity={0.12} />
      <directionalLight position={[4, 6, 4]} intensity={0.4} color="#5a5a66" />
      {BASE_POSITIONS.map((p, i) => (
        <group
          key={i}
          position={p}
          ref={(g) => {
            if (g) groupRefs.current[i] = g;
          }}
        >
          <mesh>
            <icosahedronGeometry args={[0.55, 1]} />
            <meshStandardMaterial
              color={COLORS_HEX.charcoal}
              emissive={COLORS_HEX.redOrange}
              emissiveIntensity={0.02}
              roughness={0.85}
              metalness={0.25}
              flatShading
            />
          </mesh>
          {/* Faint cold wire shell. */}
          <mesh>
            <icosahedronGeometry args={[0.58, 1]} />
            <meshBasicMaterial
              color="#3a3a44"
              wireframe
              transparent
              opacity={0.25}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

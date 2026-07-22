"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS_HEX } from "@/lib/constants";
import { scrollState } from "@/lib/store";

const RADIUS = 1.6;

/** A point on a sphere from spherical coords. */
function spherePoint(radius: number, lat: number, lon: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

type ArcData = {
  geometry: THREE.TubeGeometry;
  color: THREE.Color;
  phase: number;
};

/**
 * The hero centrepiece: a slow, dark globe with a scattering of surface points
 * and glowing arcs that lift off the surface to connect distant points — the
 * fire jumping from place to place. Rotates slowly and drifts with the pointer.
 */
export function HeroGlobe({
  arcCount = 14,
  pointCount = 260,
}: {
  arcCount?: number;
  pointCount?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const arcMaterials = useRef<THREE.MeshBasicMaterial[]>([]);

  // Surface points as a single Points cloud.
  const pointPositions = useMemo(() => {
    const arr = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      // Even-ish distribution via golden spiral.
      const y = 1 - (i / (pointCount - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * Math.PI * (3 - Math.sqrt(5));
      arr[i * 3 + 0] = Math.cos(phi) * r * RADIUS;
      arr[i * 3 + 1] = y * RADIUS;
      arr[i * 3 + 2] = Math.sin(phi) * r * RADIUS;
    }
    return arr;
  }, [pointCount]);

  // Arcs lifted above the surface between random point pairs.
  const arcs = useMemo<ArcData[]>(() => {
    const palette = [COLORS_HEX.ember, COLORS_HEX.amber, COLORS_HEX.spark];
    const out: ArcData[] = [];
    for (let i = 0; i < arcCount; i++) {
      const start = spherePoint(
        RADIUS,
        Math.random() * 140 - 70,
        Math.random() * 360 - 180,
      );
      const end = spherePoint(
        RADIUS,
        Math.random() * 140 - 70,
        Math.random() * 360 - 180,
      );
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(RADIUS + 0.5 + Math.random() * 0.5);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const geometry = new THREE.TubeGeometry(curve, 40, 0.012, 6, false);
      out.push({
        geometry,
        color: new THREE.Color(palette[i % palette.length]),
        phase: Math.random() * Math.PI * 2,
      });
    }
    return out;
  }, [arcCount]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;

    // Pointer parallax — ease the group toward a small tilt.
    const targetX = scrollState.pointerY * 0.15;
    const targetY = scrollState.pointerX * 0.25;
    groupRef.current.rotation.x +=
      (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.position.x +=
      (targetY * 0.4 - groupRef.current.position.x) * 0.05;

    // Pulse arc brightness.
    const t = state.clock.elapsedTime;
    arcMaterials.current.forEach((mat, i) => {
      if (!mat) return;
      const phase = arcs[i]?.phase ?? 0;
      mat.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.4 + phase));
    });
  });

  return (
    <group ref={groupRef}>
      {/* Dark globe body. */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          color={COLORS_HEX.charcoal}
          emissive={COLORS_HEX.redOrange}
          emissiveIntensity={0.04}
          roughness={0.75}
          metalness={0.2}
        />
      </mesh>

      {/* Faint wireframe shell for structure. */}
      <mesh>
        <icosahedronGeometry args={[RADIUS + 0.005, 4]} />
        <meshBasicMaterial
          color={COLORS_HEX.ember}
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Surface points. */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={COLORS_HEX.amber}
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Glowing connection arcs. */}
      {arcs.map((arc, i) => (
        <mesh key={i} geometry={arc.geometry}>
          <meshBasicMaterial
            ref={(m) => {
              if (m) arcMaterials.current[i] = m;
            }}
            color={arc.color}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

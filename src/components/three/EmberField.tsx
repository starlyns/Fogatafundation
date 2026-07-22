"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS_HEX } from "@/lib/constants";
import { scrollState } from "@/lib/store";
import {
  emberVertexShader,
  emberFragmentShader,
} from "@/components/three/shaders/ember";

type EmberFieldProps = {
  /** Base particle count before device scaling is applied. */
  count?: number;
  /** Multiplier from the device tier (1 = full, 0.2 = weak hardware). */
  particleScale?: number;
  /** Bounding box the embers occupy: [width, height, depth]. */
  area?: [number, number, number];
  speed?: number;
  size?: number;
  intensity?: number;
  pixelRatio?: number;
  /** When set, drive intensity from `scrollState.finalCtaIntensity` instead. */
  intensityFromStore?: boolean;
};

/**
 * GPU ember field: a single `points` object with a custom additive shader.
 * All motion happens on the GPU; the CPU only advances a time uniform.
 */
export function EmberField({
  count = 1400,
  particleScale = 1,
  area = [14, 18, 8],
  speed = 1.4,
  size = 26,
  intensity = 1,
  pixelRatio = 1.5,
  intensityFromStore = false,
}: EmberFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const resolvedCount = Math.max(24, Math.floor(count * particleScale));

  const { positions, seeds, scales } = useMemo(() => {
    const [w, h, d] = area;
    const positions = new Float32Array(resolvedCount * 3);
    const seeds = new Float32Array(resolvedCount);
    const scales = new Float32Array(resolvedCount);
    for (let i = 0; i < resolvedCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * w;
      positions[i * 3 + 1] = Math.random() * h;
      positions[i * 3 + 2] = (Math.random() - 0.5) * d;
      seeds[i] = Math.random();
      scales[i] = 0.4 + Math.random() * 1.4;
    }
    return { positions, seeds, scales };
  }, [resolvedCount, area]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeed: { value: speed },
      uHeight: { value: area[1] },
      uPixelRatio: { value: pixelRatio },
      uSize: { value: size },
      uIntensity: { value: intensity },
      uColorEmber: { value: new THREE.Color(COLORS_HEX.ember) },
      uColorAmber: { value: new THREE.Color(COLORS_HEX.amber) },
      uColorSpark: { value: new THREE.Color(COLORS_HEX.spark) },
    }),
    // Uniform object is created once; individual values are updated below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useFrame((_, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += delta;
    mat.uniforms.uIntensity.value = intensityFromStore
      ? scrollState.finalCtaIntensity
      : intensity;
    mat.uniforms.uSpeed.value = speed;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={emberVertexShader}
        fragmentShader={emberFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

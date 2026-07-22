"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS_HEX } from "@/lib/constants";
import { scrollState } from "@/lib/store";

/** The six stage positions the flame travels through, winding across space. */
const NODE_POINTS: [number, number, number][] = [
  [-4.4, -2.2, 0.2],
  [-2.6, 0.8, -1.4],
  [-0.8, -1.6, 1.2],
  [0.9, 1.4, -1.1],
  [2.6, -0.7, 1.3],
  [4.4, 2.1, -0.2],
];

const NODE_COUNT = NODE_POINTS.length;
const TRAIL_COUNT = 60;

/**
 * "How it works" centrepiece scene. A glowing flame travels a CatmullRom curve
 * through six nodes. As it reaches each node the node ignites (emissive ramps,
 * a light blooms, the incoming connection illuminates) and the camera tracks
 * along behind the flame. Progress is read from the shared scroll store so the
 * GSAP scrub owns timing without triggering React re-renders.
 */
export function FlamePath() {
  const { camera } = useThree();

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        NODE_POINTS.map((p) => new THREE.Vector3(...p)),
        false,
        "catmullrom",
        0.5,
      ),
    [],
  );

  // Parametric t for each node (0..1) along the curve.
  const nodeT = useMemo(
    () => NODE_POINTS.map((_, i) => i / (NODE_COUNT - 1)),
    [],
  );

  // Connection tube geometries between consecutive nodes.
  const connectionGeoms = useMemo(() => {
    const geoms: THREE.TubeGeometry[] = [];
    for (let i = 0; i < NODE_COUNT - 1; i++) {
      const seg = new THREE.CatmullRomCurve3([
        new THREE.Vector3(...NODE_POINTS[i]),
        new THREE.Vector3(...NODE_POINTS[i + 1]),
      ]);
      geoms.push(new THREE.TubeGeometry(seg, 24, 0.02, 6, false));
    }
    return geoms;
  }, []);

  // Refs to materials/objects we animate every frame.
  const nodeMatRefs = useRef<THREE.MeshStandardMaterial[]>([]);
  const nodeLightRefs = useRef<THREE.PointLight[]>([]);
  const connMatRefs = useRef<THREE.MeshBasicMaterial[]>([]);
  const flameRef = useRef<THREE.Group>(null);
  const flameLightRef = useRef<THREE.PointLight>(null);
  const trailRef = useRef<THREE.Points>(null);

  const trailPositions = useMemo(
    () => new Float32Array(TRAIL_COUNT * 3),
    [],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const tmp2 = useMemo(() => new THREE.Vector3(), []);
  const camTarget = useMemo(() => new THREE.Vector3(), []);
  const camOffset = useMemo(() => new THREE.Vector3(0, 1.6, 6.2), []);

  useFrame((state) => {
    const progress = THREE.MathUtils.clamp(scrollState.howItWorks, 0, 1);

    // Flame position along the curve.
    curve.getPointAt(progress, tmp);
    if (flameRef.current) {
      flameRef.current.position.copy(tmp);
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.12;
      flameRef.current.scale.setScalar(pulse);
    }
    if (flameLightRef.current) {
      flameLightRef.current.position.copy(tmp);
    }

    // Camera tracks behind and slightly above the flame, looking ahead.
    const lookAhead = Math.min(progress + 0.08, 1);
    curve.getPointAt(lookAhead, camTarget);
    tmp2.copy(tmp).add(camOffset);
    camera.position.lerp(tmp2, 0.06);
    camera.lookAt(camTarget);

    // Ignite nodes the flame has reached.
    for (let i = 0; i < NODE_COUNT; i++) {
      const lit = THREE.MathUtils.smoothstep(
        progress,
        nodeT[i] - 0.05,
        nodeT[i] + 0.01,
      );
      const mat = nodeMatRefs.current[i];
      if (mat) {
        mat.emissiveIntensity = 0.05 + lit * 2.6;
        mat.color.setHex(lit > 0.5 ? COLORS_HEX.amber : COLORS_HEX.charcoal);
      }
      const light = nodeLightRefs.current[i];
      if (light) light.intensity = lit * 6;
    }

    // Illuminate connections as the flame crosses them.
    for (let i = 0; i < connMatRefs.current.length; i++) {
      const mat = connMatRefs.current[i];
      if (!mat) continue;
      const lit = THREE.MathUtils.smoothstep(
        progress,
        nodeT[i],
        nodeT[i + 1],
      );
      mat.opacity = 0.08 + lit * 0.9;
    }

    // Trailing particles: sample the curve just behind the flame.
    if (trailRef.current) {
      const posAttr = trailRef.current.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const back = progress - (i / TRAIL_COUNT) * 0.06;
        const t = THREE.MathUtils.clamp(back, 0, 1);
        curve.getPointAt(t, tmp2);
        const spread = (i / TRAIL_COUNT) * 0.25;
        posAttr.setXYZ(
          i,
          tmp2.x + (Math.random() - 0.5) * spread,
          tmp2.y + (Math.random() - 0.5) * spread + (i / TRAIL_COUNT) * 0.2,
          tmp2.z + (Math.random() - 0.5) * spread,
        );
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      <ambientLight intensity={0.15} />

      {/* Nodes. */}
      {NODE_POINTS.map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <icosahedronGeometry args={[0.32, 1]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) nodeMatRefs.current[i] = m;
              }}
              color={COLORS_HEX.charcoal}
              emissive={COLORS_HEX.ember}
              emissiveIntensity={0.05}
              roughness={0.4}
              metalness={0.3}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            ref={(l) => {
              if (l) nodeLightRefs.current[i] = l;
            }}
            color={COLORS_HEX.amber}
            intensity={0}
            distance={4}
            decay={2}
          />
        </group>
      ))}

      {/* Connections. */}
      {connectionGeoms.map((geom, i) => (
        <mesh key={i} geometry={geom}>
          <meshBasicMaterial
            ref={(m) => {
              if (m) connMatRefs.current[i] = m;
            }}
            color={COLORS_HEX.ember}
            transparent
            opacity={0.08}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Trailing particles. */}
      <points ref={trailRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[trailPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color={COLORS_HEX.spark}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      {/* The flame. */}
      <group ref={flameRef}>
        <mesh>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshBasicMaterial color={COLORS_HEX.spark} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshBasicMaterial
            color={COLORS_HEX.ember}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
      <pointLight
        ref={flameLightRef}
        color={COLORS_HEX.ember}
        intensity={5}
        distance={6}
        decay={2}
      />
    </group>
  );
}

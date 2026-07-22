"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { SceneView } from "@/components/three/SceneView";
import { EmberField } from "@/components/three/EmberField";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { Placeholder } from "@/components/ui/Placeholder";
import { ANCHORS } from "@/lib/constants";
import { useExperience } from "@/components/providers/ExperienceProvider";

const LINES = [
  "Fogata means bonfire. One fire, carried from hand to hand, until the whole hillside is alight.",
  "At Pentecost the Spirit fell as tongues of fire, and people from every nation heard the wonders of God in their own language.",
  "That is still the promise: not one language exalted above the rest, but every tongue gathered around the same flame.",
  "The fire was never meant to stay in one place. It spreads — church to missionary, ministry to tribe — until no one is left in the dark.",
];

export function Vision() {
  const { device } = useExperience();

  return (
    <section
      id={ANCHORS.vision}
      className="relative w-full overflow-hidden bg-charcoal py-28 sm:py-36"
    >
      {/* Drifting embers behind the copy. */}
      <SceneView className="opacity-70">
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
        <EmberField
          count={700}
          particleScale={device.particleScale}
          area={[18, 22, 6]}
          speed={0.9}
          intensity={0.6}
          pixelRatio={device.dpr[1]}
        />
      </SceneView>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-ember">
            The vision
          </span>
          <SplitHeading
            by="words"
            className="font-display text-3xl font-bold leading-tight text-textPrimary sm:text-4xl lg:text-5xl"
          >
            At Pentecost, one fire became many tongues — and every nation heard.
          </SplitHeading>

          <div className="mt-8 space-y-5">
            {LINES.map((line, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p className="max-w-xl text-lg leading-relaxed text-textMuted">
                  {line}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Full-bleed image placeholder with parallax. */}
        <Parallax speed={0.12} className="lg:h-[34rem]">
          <div className="h-[24rem] w-full sm:h-[30rem] lg:h-full">
            <Placeholder
              kind="IMAGE"
              label="Nations gathered in firelight"
              dimensions="2400x1400"
              description="Full-bleed photograph: a gathering of people from many nations around firelight."
              aspect="12 / 7"
            />
          </div>
        </Parallax>
      </div>
    </section>
  );
}

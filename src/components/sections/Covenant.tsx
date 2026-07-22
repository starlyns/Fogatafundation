"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { SceneView } from "@/components/three/SceneView";
import { EmberField } from "@/components/three/EmberField";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/ui/Parallax";
import { ANCHORS } from "@/lib/constants";
import { useExperience } from "@/components/providers/ExperienceProvider";

const PRINCIPLES = [
  {
    title: "We never own the data",
    body: "Every ministry keeps full ownership of its work. Fogata connects — it never takes.",
  },
  {
    title: "AI assists, never replaces",
    body: "AI produces a first draft — a starting point, never a substitute for people who know the language and love the tribe.",
  },
  {
    title: "Every translation is human-validated",
    body: "A draft is not Scripture. Nothing is called Scripture until translators and the partner ministry validate every verse.",
  },
];

export function Covenant() {
  const { device } = useExperience();

  return (
    <section
      id={ANCHORS.covenant}
      className="relative w-full overflow-hidden bg-black py-28 sm:py-36"
    >
      {/* Calmer, low ember field. */}
      <SceneView className="opacity-50">
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={50} />
        <EmberField
          count={500}
          particleScale={device.particleScale}
          area={[20, 22, 6]}
          speed={0.6}
          intensity={0.5}
          pixelRatio={device.dpr[1]}
        />
      </SceneView>

      {/* Multi-layer parallax glows for depth. */}
      <Parallax speed={0.3} className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-redOrange/20 blur-[120px]" />
      </Parallax>
      <Parallax speed={0.15} className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute right-[8%] bottom-[15%] h-80 w-80 rounded-full bg-ember/15 blur-[130px]" />
      </Parallax>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center sm:px-8">
        <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-ember">
          Our covenant
        </span>
        <SplitHeading
          by="words"
          className="mx-auto max-w-3xl font-display text-3xl font-bold leading-tight text-textPrimary sm:text-4xl lg:text-5xl"
        >
          Trust is the wood this fire burns on.
        </SplitHeading>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 0.1}
              className="rounded-2xl border border-white/8 bg-charcoal/60 p-8 text-left backdrop-blur-sm"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-ember/40 bg-ember/10">
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-ember to-spark" />
              </div>
              <h3 className="font-display text-lg font-bold text-textPrimary">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-textMuted">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

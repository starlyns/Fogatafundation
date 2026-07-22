"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { SceneView } from "@/components/three/SceneView";
import { ColdNodes } from "@/components/three/ColdNodes";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ANCHORS } from "@/lib/constants";

const ITEMS = [
  {
    n: "01",
    title: "Churches",
    body: "Ready to fund and pray — but unsure where the need is.",
  },
  {
    n: "02",
    title: "Missionaries",
    body: "On the field — but often without backing or tools.",
  },
  {
    n: "03",
    title: "Translation data",
    body: "Decades of linguistic work — locked away, unused.",
  },
  {
    n: "04",
    title: "Training",
    body: "Proven methods — not reaching the people who need them.",
  },
  {
    n: "05",
    title: "People-group data",
    body: "We know who is still waiting — by name.",
  },
];

export function Gap() {
  return (
    <section
      id={ANCHORS.gap}
      className="relative w-full overflow-hidden bg-black py-28 sm:py-36"
    >
      {/* Cold, drifting, unlit nodes — disconnection made visible. */}
      <SceneView className="opacity-90">
        <PerspectiveCamera makeDefault position={[0, 0, 9]} fov={45} />
        <ColdNodes />
      </SceneView>

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-ember">
            The gap
          </span>
          <SplitHeading
            by="words"
            className="font-display text-3xl font-bold leading-tight text-textPrimary sm:text-4xl lg:text-5xl"
          >
            Everything needed already exists. It just isn&rsquo;t connected.
          </SplitHeading>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal
              as="li"
              key={item.n}
              delay={i * 0.06}
              className="group flex flex-col gap-3 bg-charcoal p-8 transition-colors hover:bg-charcoalSoft"
            >
              <span className="font-mono text-sm text-ember/70">{item.n}</span>
              <h3 className="font-display text-xl font-bold text-textPrimary">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-textMuted">
                {item.body}
              </p>
            </Reveal>
          ))}
          {/* Balancing tile with the closing line on wide layouts. */}
          <Reveal
            as="li"
            delay={0.3}
            className="flex items-center bg-gradient-to-br from-charcoalSoft to-charcoal p-8"
          >
            <p className="font-display text-lg font-semibold leading-snug text-amber">
              Fogata never owns the pieces. It connects them — and the fire
              spreads.
            </p>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

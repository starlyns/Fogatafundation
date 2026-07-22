"use client";

import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SceneView } from "@/components/three/SceneView";
import { FlamePath } from "@/components/three/FlamePath";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { scrollState } from "@/lib/store";
import { ANCHORS } from "@/lib/constants";

const STAGES = [
  {
    n: "01",
    title: "Church",
    body: "Sponsors a specific unreached tribe.",
  },
  {
    n: "02",
    title: "Missionary",
    body: "The link on the ground with the community.",
  },
  {
    n: "03",
    title: "Translation ministry",
    body: "Shares its linguistic data, and keeps ownership.",
  },
  {
    n: "04",
    title: "AI draft",
    body: "A first translation draft, generated in months, not years.",
  },
  {
    n: "05",
    title: "Validation",
    body: "Field-checked, then human-validated verse by verse.",
  },
  {
    n: "06",
    title: "Tribe",
    body: "Scripture arrives in their own language.",
  },
];

const N = STAGES.length;

export function HowItWorks() {
  const { reducedMotion, device } = useExperience();
  const pinRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !pinRef.current) return;
    const pin = pinRef.current;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=400%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          scrollState.howItWorks = p;
          // Reveal each stage's caption as its node ignites.
          for (let i = 0; i < N; i++) {
            const center = i / (N - 1);
            const vis = gsap.utils.clamp(
              0,
              1,
              1 - Math.abs(p - center) / 0.11,
            );
            const el = textRefs.current[i];
            if (el) {
              el.style.opacity = String(vis);
              el.style.transform = `translateY(${(1 - vis) * 26}px)`;
            }
          }
        },
      });
    }, pin);

    return () => {
      ctx.revert();
      scrollState.howItWorks = 0;
    };
  }, [reducedMotion]);

  // Reduced-motion fallback: a static vertical diagram, everything lit.
  if (reducedMotion) {
    return (
      <section
        id={ANCHORS.howItWorks}
        className="relative w-full bg-black py-28 sm:py-36"
      >
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <div className="mb-14 text-center">
            <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-ember">
              How it works
            </span>
            <h2 className="font-display text-3xl font-bold text-textPrimary sm:text-4xl">
              How the fire travels
            </h2>
          </div>
          <ol className="relative ml-4 border-l border-ember/40">
            {STAGES.map((s) => (
              <li key={s.n} className="relative mb-10 pl-8">
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-gradient-to-tr from-ember to-spark shadow-[0_0_16px_rgba(255,87,34,0.8)]" />
                <span className="font-mono text-xs text-ember/70">{s.n}</span>
                <h3 className="font-display text-xl font-bold text-textPrimary">
                  {s.title}
                </h3>
                <p className="text-textMuted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id={ANCHORS.howItWorks} className="relative w-full bg-black">
      {/* Pinned viewport — the flame scene + captions live here. */}
      <div
        ref={pinRef}
        className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden"
      >
        <SceneView>
          <PerspectiveCamera makeDefault position={[0, 1.6, 8]} fov={50} />
          <FlamePath />
        </SceneView>

        {/* Section label */}
        <div className="pointer-events-none absolute left-1/2 top-10 z-10 -translate-x-1/2 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-ember">
            How it works
          </span>
        </div>

        {/* Stage captions, revealed as each node ignites. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-16 z-10 mx-auto max-w-xl px-6 text-center">
          <div className="relative h-32">
            {STAGES.map((s, i) => (
              <div
                key={s.n}
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <span className="mb-2 font-mono text-sm text-spark">
                  {s.n} / 0{N}
                </span>
                <h3 className="font-display text-3xl font-black text-textPrimary sm:text-4xl">
                  {s.title}
                </h3>
                <p className="mt-2 text-lg text-textMuted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress hint */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.3em] text-textMuted/60">
          Keep scrolling
        </div>
      </div>
    </section>
  );
}

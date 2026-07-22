"use client";

import { useRef } from "react";
import { PerspectiveCamera } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SceneView } from "@/components/three/SceneView";
import { EmberField } from "@/components/three/EmberField";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Button } from "@/components/ui/Button";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { scrollState } from "@/lib/store";
import { ANCHORS, SITE } from "@/lib/constants";

export function FinalCta() {
  const { device, reducedMotion } = useExperience();
  const sectionRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "center center",
        scrub: true,
        onUpdate: (self) => {
          // Rise from a low glow to full as the section enters view.
          scrollState.finalCtaIntensity = 0.3 + self.progress * 0.7;
        },
      });
    }, el);
    return () => {
      ctx.revert();
      scrollState.finalCtaIntensity = 0;
    };
  }, [reducedMotion]);

  return (
    <>
      <section
        ref={sectionRef}
        id={ANCHORS.sponsor}
        className="relative flex min-h-[90svh] w-full items-center justify-center overflow-hidden bg-black"
      >
        {/* Full-bleed ember field, intensity rising on entry. */}
        <SceneView>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={55} />
          <EmberField
            count={2000}
            particleScale={device.particleScale}
            area={[22, 24, 8]}
            speed={1.6}
            intensityFromStore
            pixelRatio={device.dpr[1]}
          />
          {device.postProcessing && (
            <EffectComposer>
              <Bloom
                intensity={1.1}
                luminanceThreshold={0.15}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
            </EffectComposer>
          )}
        </SceneView>

        {/* Reduced-motion / fallback glow. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(224,62,0,0.35)_0%,transparent_60%)]" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8">
          <SplitHeading
            by="words"
            className="font-display text-4xl font-black leading-tight text-textPrimary sm:text-6xl lg:text-7xl"
          >
            A tribe is waiting for your flame.
          </SplitHeading>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button href={`#${ANCHORS.sponsor}`} variant="spark">
              Sponsor a tribe
            </Button>
            <Button href={`#${ANCHORS.doorEveryone}`} variant="primary">
              Donate
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="relative w-full border-t border-white/8 bg-[#08080a] py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-6 w-6 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-redOrange to-spark blur-[6px] opacity-70" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-spark to-amber" />
            </span>
            <span className="font-display text-lg font-bold text-textPrimary">
              {SITE.name}
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-textMuted">
            Connecting churches, missionaries, and Bible translation ministries
            to bring Scripture to every unreached language community.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="mt-6 inline-block text-sm text-spark transition-colors hover:text-white"
          >
            {SITE.email}
          </a>
        </div>

        {/* Newsletter signup */}
        <div>
          <h3 className="font-display text-base font-semibold text-textPrimary">
            Stay close to the fire
          </h3>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-textPrimary placeholder:text-textMuted/60 focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/30"
            />
            <button
              type="submit"
              className="rounded-full bg-gradient-to-b from-ember to-redOrange px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Sign up
            </button>
          </form>
          <a
            href="#statement-of-faith"
            className="mt-6 inline-block text-sm text-textMuted underline-offset-4 transition-colors hover:text-textPrimary hover:underline"
          >
            Statement of faith
          </a>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-white/5 px-6 pt-8 sm:px-8">
        <p className="text-xs text-textMuted/70">
          © 2026 {SITE.name}. {SITE.tagline} {SITE.scripture}
        </p>
      </div>
    </footer>
  );
}

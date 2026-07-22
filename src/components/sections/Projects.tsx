"use client";

import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { ANCHORS, SITE } from "@/lib/constants";

/**
 * Project Mosaic Gallery — where a visitor picks the language community
 * they'll sponsor. Sits between "Ways to participate" and "Our covenant".
 */
export function Projects() {
  return (
    <section
      id={ANCHORS.projects}
      className="relative w-full overflow-hidden bg-charcoal py-28 sm:py-36"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-20">
          <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-ember">
            Choose your project
          </span>
          <SplitHeading
            by="words"
            className="font-display text-3xl font-bold leading-tight text-textPrimary sm:text-4xl lg:text-5xl"
          >
            Twelve communities. Twelve flames waiting to be lit.
          </SplitHeading>
          <Reveal>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-textMuted">
              Each of these is ready — a missionary in place, a translation
              partner committed. All that&rsquo;s missing is a church, a
              business, or a family to carry it.
            </p>
          </Reveal>
        </div>

        <ProjectsGallery />

        <Reveal>
          <p className="mx-auto mt-14 max-w-xl text-center text-base leading-relaxed text-textMuted">
            Not sure which?{" "}
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                "Match us with a community",
              )}`}
              className="font-semibold text-amber underline decoration-ember/50 underline-offset-4 transition-colors hover:text-spark"
            >
              Let us match you with the community that needs it most.
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

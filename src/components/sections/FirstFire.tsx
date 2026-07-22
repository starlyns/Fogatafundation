"use client";

import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { Placeholder } from "@/components/ui/Placeholder";
import { ANCHORS } from "@/lib/constants";

const COUNTS = [
  { value: 1, label: "Sponsoring church" },
  { value: 1, label: "Unreached tribe" },
  { value: 1, label: "Missionary on the ground" },
  { value: 1, label: "Translation partner" },
];

export function FirstFire() {
  return (
    <section
      id={ANCHORS.firstFire}
      className="relative w-full overflow-hidden bg-charcoal py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-ember">
              The first fire
            </span>
            <SplitHeading
              by="words"
              className="font-display text-3xl font-bold leading-tight text-textPrimary sm:text-4xl lg:text-5xl"
            >
              The first fire is already lit.
            </SplitHeading>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-textMuted">
                Our pilot is small on purpose: one church, one tribe, one
                missionary, and one translation partner — proving the whole
                chain end to end before we spread it. This is where the metaphor
                becomes a method.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {COUNTS.map((c) => (
                <Reveal
                  key={c.label}
                  className="rounded-xl border border-white/8 bg-black/40 p-5 text-center"
                >
                  <CountUp
                    value={c.value}
                    className="font-display text-4xl font-black text-spark"
                  />
                  <p className="mt-2 text-xs leading-tight text-textMuted">
                    {c.label}
                  </p>
                </Reveal>
              ))}
            </div>

            <p className="mt-6 text-xs italic text-textMuted/70">
              [PLACEHOLDER — replace with live verified counts]
            </p>
          </div>

          <Placeholder
            kind="IMAGE/VIDEO"
            label="Pilot in the field"
            dimensions="1600x900"
            description="Pilot field footage or photography — the church, tribe, missionary, and translation partner at work."
            aspect="16 / 9"
          />
        </div>
      </div>
    </section>
  );
}

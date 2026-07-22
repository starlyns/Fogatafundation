"use client";

import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { Placeholder } from "@/components/ui/Placeholder";
import { ANCHORS } from "@/lib/constants";

const DOORS = [
  {
    id: ANCHORS.doorChurches,
    audience: "Churches",
    title: "Sponsor a people group.",
    body: "Adopt a specific unreached tribe. Your church becomes the fire that funds and prays a language community toward the gospel.",
    cta: "Sponsor a tribe",
    href: `#${ANCHORS.sponsor}`,
    image: "Church community sending in prayer",
  },
  {
    id: ANCHORS.doorMissionaries,
    audience: "Missionaries",
    title: "Take the field.",
    body: "Be the link on the ground — connecting a sponsoring church, a waiting tribe, and the translation that reaches them.",
    cta: "Join the field",
    href: `#${ANCHORS.doorMissionaries}`,
    image: "Missionary with a local community",
  },
  {
    id: ANCHORS.doorMinistries,
    audience: "Translation ministries",
    title: "Multiply your reach.",
    body: "Your linguistic work already exists. Share it, keep ownership, and let Fogata help it reach the field faster.",
    cta: "Partner with us",
    href: `#${ANCHORS.doorMinistries}`,
    image: "Translators reviewing linguistic work",
  },
  {
    id: ANCHORS.doorEveryone,
    audience: "Everyone",
    title: "Fan the flame.",
    body: "Give, pray, and spread the word. No one is too small to help finish the Great Commission.",
    cta: "Give / Pray / Share",
    href: `#${ANCHORS.doorEveryone}`,
    image: "Hands passing a small flame",
  },
];

export function Participate() {
  return (
    <section
      id={ANCHORS.participate}
      className="relative w-full overflow-hidden bg-charcoal py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-ember">
            Ways to participate
          </span>
          <SplitHeading
            by="words"
            className="font-display text-4xl font-black text-textPrimary sm:text-5xl lg:text-6xl"
          >
            One call. Four doors.
          </SplitHeading>
          <p className="mt-5 text-lg text-textMuted">
            Wherever you stand, there is a place at this fire.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {DOORS.map((door, i) => (
            <Reveal key={door.id} delay={i * 0.08}>
              {/* Anchor target for this specific door. */}
              <span id={door.id} className="block scroll-mt-28" />
              <TiltCard className="flex h-full flex-col">
                <div className="mb-6 h-44 overflow-hidden rounded-xl">
                  <Placeholder
                    kind="IMAGE"
                    label={door.audience}
                    dimensions="800x600"
                    description={door.image}
                  />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-amber">
                  {door.audience}
                </span>
                <h3 className="mt-2 font-display text-2xl font-bold text-textPrimary">
                  {door.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-textMuted">
                  {door.body}
                </p>
                <a
                  href={door.href}
                  data-cursor="magnetic"
                  className="mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-spark transition-colors hover:text-white"
                >
                  {door.cta}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

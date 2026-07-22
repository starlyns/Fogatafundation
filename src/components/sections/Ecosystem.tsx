"use client";

import { ANCHORS } from "@/lib/constants";

const CATEGORIES = [
  "Bible translation orgs",
  "Linguistic data partners",
  "Missionary training schools",
  "People-group researchers",
  "Sending churches",
];

export function Ecosystem() {
  // Duplicate the set so the marquee can loop seamlessly.
  const items = [...CATEGORIES, ...CATEGORIES];

  return (
    <section
      id={ANCHORS.ecosystem}
      className="relative w-full overflow-hidden border-y border-white/5 bg-black py-20"
    >
      <div className="mx-auto mb-12 max-w-4xl px-6 text-center">
        <h2 className="font-display text-xl font-semibold text-textMuted sm:text-2xl">
          Connecting the kinds of ministries that finish the task.
        </h2>
      </div>

      {/* Marquee — low opacity, ember-tinted. */}
      <div
        className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        aria-hidden
      >
        <ul className="marquee flex shrink-0 items-center gap-12 pr-12">
          {items.map((label, i) => (
            <li
              key={i}
              className="flex items-center gap-4 whitespace-nowrap text-sm uppercase tracking-[0.2em] text-amber/40"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ember/50" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      {/* Logo placeholder row. */}
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 px-6 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((label, i) => (
          <div key={i} className="grayscale opacity-60">
            <div className="flex h-20 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center text-[0.6rem] uppercase tracking-wider text-textMuted">
              LOGO PLACEHOLDER
              <br />
              240x120
            </div>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl px-6 text-center text-xs italic text-textMuted/60">
        Illustrative categories — no specific endorsements implied.
      </p>
    </section>
  );
}

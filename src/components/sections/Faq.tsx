"use client";

import { useRef, useState } from "react";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ANCHORS } from "@/lib/constants";

const FAQS = [
  {
    q: "Is an AI draft the same as Scripture?",
    a: "No. A draft is a starting point, not Scripture. Nothing Fogata helps produce is called Scripture until translators and the partner ministry have field-checked and human-validated every verse.",
  },
  {
    q: "What exactly does the AI do?",
    a: "AI generates a first translation draft in months instead of years — a rough first pass that gives translators something to refine. It assists the people who know the language; it never replaces them.",
  },
  {
    q: "Who owns the translation data?",
    a: "The ministry does. Every partner keeps full ownership of its linguistic work. Fogata connects the pieces and helps them reach the field faster — it never takes ownership of the data.",
  },
];

function FaqItem({
  q,
  a,
  open,
  onToggle,
  id,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative border-b border-white/8">
      {/* Ember line that animates along the open item. */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[2px] origin-top bg-gradient-to-b from-ember to-spark transition-transform duration-500"
        style={{ transform: `scaleY(${open ? 1 : 0})` }}
      />
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-6 pl-6 pr-2 text-left transition-colors hover:text-spark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark"
        >
          <span className="font-display text-lg font-semibold text-textPrimary sm:text-xl">
            {q}
          </span>
          <span
            aria-hidden
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ember/40 text-ember transition-transform duration-300 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </h3>
      <div
        ref={panelRef}
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className="overflow-hidden pl-6 pr-8"
        style={{
          maxHeight: open ? (panelRef.current?.scrollHeight ?? 400) : 0,
          transition: "max-height 0.5s ease",
        }}
      >
        <p className="pb-6 text-base leading-relaxed text-textMuted">{a}</p>
      </div>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id={ANCHORS.faq}
      className="relative w-full bg-charcoal py-28 sm:py-36"
    >
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <div className="mb-14 text-center">
          <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.35em] text-ember">
            FAQ
          </span>
          <SplitHeading
            by="words"
            className="font-display text-3xl font-bold text-textPrimary sm:text-4xl"
          >
            Honest answers to fair questions.
          </SplitHeading>
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/30">
          {FAQS.map((item, i) => (
            <FaqItem
              key={i}
              id={`faq-${i}`}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

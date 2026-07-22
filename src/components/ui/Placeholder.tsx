import type { CSSProperties } from "react";

type PlaceholderProps = {
  /** e.g. "IMAGE" | "VIDEO" | "LOGO" */
  kind?: string;
  /** Short label shown large. */
  label: string;
  /** Intended asset dimensions, e.g. "2400x1400". */
  dimensions: string;
  /** What the final asset should contain. */
  description: string;
  className?: string;
  style?: CSSProperties;
  /** Optional aspect-ratio hint, e.g. "16 / 9". */
  aspect?: string;
};

/**
 * Every image/video/logo placeholder in the site renders through this so they
 * are consistent and trivial to find (search the codebase for `<Placeholder`).
 * Renders a dark box with an ember border, the label, intended dimensions, and
 * a description of the content that belongs there.
 */
export function Placeholder({
  kind = "IMAGE",
  label,
  dimensions,
  description,
  className = "",
  style,
  aspect,
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`${kind} placeholder: ${label}. ${description}`}
      data-placeholder={kind.toLowerCase()}
      className={`ember-frame relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#0d0d0f] p-6 text-center ${className}`}
      style={{ aspectRatio: aspect, ...style }}
    >
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-ember">
        {kind} placeholder
      </span>
      <span className="font-display text-lg font-bold text-textPrimary sm:text-xl">
        {label}
      </span>
      <span className="rounded-full border border-ember/40 px-3 py-1 font-mono text-xs text-amber">
        {dimensions}
      </span>
      <span className="max-w-xs text-xs leading-relaxed text-textMuted">
        {description}
      </span>
    </div>
  );
}

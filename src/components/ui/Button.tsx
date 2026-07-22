import type { AnchorHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "spark";

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  children: ReactNode;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-spark focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const variants: Record<Variant, string> = {
  // Ember-filled primary CTA.
  primary:
    "bg-gradient-to-b from-ember to-redOrange text-white shadow-[0_10px_40px_-10px_rgba(255,87,34,0.7)] hover:shadow-[0_16px_50px_-8px_rgba(255,87,34,0.9)] hover:-translate-y-0.5",
  // Gold spark — reserved for the highest-emphasis actions.
  spark:
    "bg-gradient-to-b from-spark to-amber text-black shadow-[0_10px_40px_-10px_rgba(255,209,102,0.7)] hover:shadow-[0_16px_50px_-8px_rgba(255,209,102,0.9)] hover:-translate-y-0.5",
  ghost:
    "border border-white/20 bg-white/[0.02] text-textPrimary backdrop-blur-sm hover:border-ember/60 hover:text-white",
};

/**
 * Anchor-based button (the site is single-page, so every CTA is a link to an
 * anchor or route). Kept as an `<a>` for correct keyboard + semantics.
 */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </a>
  );
}

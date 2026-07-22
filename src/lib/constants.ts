/**
 * Fogata design tokens and site copy.
 * Centralised so colors, palette, and text are consistent across 2D and 3D layers.
 */

export const COLORS = {
  // Base — deep charcoal / near black
  black: "#0A0A0B",
  charcoal: "#141416",
  charcoalSoft: "#1C1C20",
  // Fire palette
  ember: "#FF5722",
  amber: "#FFA726",
  redOrange: "#E03E00",
  // Bright gold spark accent (use sparingly)
  spark: "#FFD166",
  // Text
  textPrimary: "#F5F1EA",
  textMuted: "#A7A29B",
} as const;

/** Numeric versions for Three.js material colors. */
export const COLORS_HEX = {
  ember: 0xff5722,
  amber: 0xffa726,
  redOrange: 0xe03e00,
  spark: 0xffd166,
  black: 0x0a0a0b,
  charcoal: 0x141416,
} as const;

/** Anchor ids used by the nav and the four "doors" in Participate. */
export const ANCHORS = {
  vision: "vision",
  gap: "gap",
  howItWorks: "how-it-works",
  participate: "participate",
  projects: "projects",
  covenant: "covenant",
  firstFire: "first-fire",
  ecosystem: "ecosystem",
  faq: "faq",
  sponsor: "sponsor",
  // The four participate doors each route to their own anchor.
  doorChurches: "participate-churches",
  doorMissionaries: "participate-missionaries",
  doorMinistries: "participate-ministries",
  doorEveryone: "participate-everyone",
} as const;

export const NAV_LINKS = [
  { label: "Vision", href: `#${ANCHORS.vision}` },
  { label: "How it works", href: `#${ANCHORS.howItWorks}` },
  { label: "Participate", href: `#${ANCHORS.participate}` },
  { label: "Projects", href: `#${ANCHORS.projects}` },
  { label: "FAQ", href: `#${ANCHORS.faq}` },
] as const;

export const SITE = {
  name: "Fogata",
  tagline: "Every language. One flame.",
  email: "hello@fogata.org",
  scripture: "Acts 2 · Revelation 7:9",
} as const;

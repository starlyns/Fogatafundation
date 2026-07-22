/**
 * Project Mosaic Gallery data.
 *
 * PLACEHOLDER CONTENT — every entry below is illustrative seed data, not a
 * real, verified project. Before launch:
 *   1. Replace every entry with a real community project (verify names,
 *      populations, statuses with the field team).
 *   2. Replace every image (see /public/projects/*.svg placeholders — each
 *      states the intended photo and dimensions, 400x600 @2x).
 *   3. Replace every Stripe link — search the codebase for
 *      PLACEHOLDER_STRIPE_URL to find all twelve.
 */

export type Project = {
  id: string;
  /** People group name. */
  name: string;
  country: string;
  language: string;
  population: string;
  /** 2–3 sentences: the community and what this project will do. */
  description: string;
  /** e.g. "Missionary in place · Translation partner committed" */
  status: string;
  /** 0–100 */
  fundedPercent: number;
  /** Path to the tile image (400x600 @2x). */
  image: string;
  /** Stripe payment link for sponsoring this project. */
  stripeUrl: string;
};

export const PROJECTS: Project[] = [
  {
    id: "kelora",
    name: "Kelora",
    country: "Indonesia",
    language: "Kelora",
    population: "~9,000",
    description:
      "A highland community of terrace farmers whose language has never been written down. This project funds an alphabet, an oral Scripture set, and the first drafted Gospel of Luke.",
    status: "Missionary in place · Translation partner committed",
    fundedPercent: 42,
    image: "/projects/kelora.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_kelora",
  },
  {
    id: "awarai",
    name: "Awarai",
    country: "Papua New Guinea",
    language: "Awarai",
    population: "~4,500",
    description:
      "River-valley clans reachable only by boat, with strong oral storytelling traditions. Sponsorship completes an audio New Testament draft and trains four local storytellers to carry it village to village.",
    status: "Missionary in place · Translation partner committed",
    fundedPercent: 18,
    image: "/projects/awarai.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_awarai",
  },
  {
    id: "tchamba-ri",
    name: "Tchamba-Ri",
    country: "Chad",
    language: "Tchamba",
    population: "~22,000",
    description:
      "Semi-nomadic herding families spread across the Sahel. This project produces a first draft of Genesis and the Gospels, checked by a mother-tongue review team the sponsorship helps train.",
    status: "Missionary in place · Review team forming",
    fundedPercent: 63,
    image: "/projects/tchamba-ri.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_tchamba-ri",
  },
  {
    id: "yankuna",
    name: "Yankuna",
    country: "Colombia",
    language: "Yankuna",
    population: "~6,800",
    description:
      "A riverine community in the Amazon basin with a young, growing church that reads Scripture in a trade language few fully understand. Sponsorship delivers the New Testament in the language they pray in.",
    status: "Missionary in place · Translation partner committed",
    fundedPercent: 77,
    image: "/projects/yankuna.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_yankuna",
  },
  {
    id: "miskale",
    name: "Miskale",
    country: "Ethiopia",
    language: "Miskale",
    population: "~31,000",
    description:
      "Escarpment villages where Scripture exists only in a neighbouring tongue. This project drafts Mark and Acts and funds a literacy program so the church can read what it receives.",
    status: "Missionary in place · Literacy program planned",
    fundedPercent: 8,
    image: "/projects/miskale.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_miskale",
  },
  {
    id: "dorvati",
    name: "Dorvati",
    country: "Nepal",
    language: "Dorvati",
    population: "~12,000",
    description:
      "High-valley communities cut off by snow half the year, with a handful of believers and no Scripture. Sponsorship funds an oral Bible set for winter listening and a drafted Gospel of John.",
    status: "Missionary in place · Translation partner committed",
    fundedPercent: 35,
    image: "/projects/dorvati.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_dorvati",
  },
  {
    id: "sarnai",
    name: "Sarnai",
    country: "Mongolia",
    language: "Sarnai",
    population: "~7,200",
    description:
      "Steppe herding families whose dialect differs enough from the national language that Scripture doesn't land. This project adapts the Gospels with a local review team and records them for radio.",
    status: "Translation partner committed · Radio partner engaged",
    fundedPercent: 51,
    image: "/projects/sarnai.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_sarnai",
  },
  {
    id: "uxpanal",
    name: "Uxpanal",
    country: "Mexico",
    language: "Uxpanal",
    population: "~15,500",
    description:
      "Mountain towns where the older generation speaks little Spanish and the young are losing the mother tongue. Sponsorship funds a New Testament draft and a youth media project that keeps the language alive.",
    status: "Missionary in place · Translation partner committed",
    fundedPercent: 84,
    image: "/projects/uxpanal.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_uxpanal",
  },
  {
    id: "ranomea",
    name: "Ranomea",
    country: "Madagascar",
    language: "Ranomea",
    population: "~19,000",
    description:
      "Coastal fishing villages with deep ancestral traditions and no gospel witness. This project places Scripture portions alongside a church-planting team already learning the language.",
    status: "Missionary in place · Church-planting team on site",
    fundedPercent: 26,
    image: "/projects/ranomea.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_ranomea",
  },
  {
    id: "bakhtari",
    name: "Bakhtari",
    country: "Central Asia",
    language: "Bakhtari",
    population: "~48,000",
    description:
      "A valley people in a sensitive region where believers meet quietly in homes. Sponsorship funds a discreet digital New Testament draft, distributed by trusted local partners.",
    status: "Local partners in place · Translation partner committed",
    fundedPercent: 12,
    image: "/projects/bakhtari.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_bakhtari",
  },
  {
    id: "temuan-batu",
    name: "Temuan Batu",
    country: "Malaysia",
    language: "Temuan",
    population: "~5,400",
    description:
      "Forest-edge villages balancing old ways with rapid change. This project completes an oral Scripture library and trains two local translators to carry the written draft forward.",
    status: "Missionary in place · Translators in training",
    fundedPercent: 58,
    image: "/projects/temuan-batu.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_temuan-batu",
  },
  {
    id: "vaikoro",
    name: "Vaikoro",
    country: "Solomon Islands",
    language: "Vaikoro",
    population: "~3,100",
    description:
      "An island community of a few thousand whose language may not survive another generation. Sponsorship funds the first and likely only Scripture this language will ever have.",
    status: "Missionary in place · Translation partner committed",
    fundedPercent: 5,
    image: "/projects/vaikoro.svg",
    stripeUrl: "https://buy.stripe.com/test_PLACEHOLDER_STRIPE_URL_vaikoro",
  },
];

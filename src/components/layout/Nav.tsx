"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { NAV_LINKS, ANCHORS, SITE } from "@/lib/constants";
import { useExperience } from "@/components/providers/ExperienceProvider";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lenis, reducedMotion } = useExperience();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNav = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (!target) return;
    if (lenis && !reducedMotion) {
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
    } else {
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] transition-all duration-500 ${
        scrolled
          ? "border-b border-white/5 bg-black/60 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"
        aria-label="Primary"
      >
        <a
          href="#top"
          onClick={(e) => handleNav(e, "#top")}
          className="group flex items-center gap-2.5"
          data-cursor="magnetic"
        >
          <span className="relative flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-redOrange to-spark blur-[6px] opacity-70 transition-opacity group-hover:opacity-100" />
            <span className="relative h-3 w-3 rounded-full bg-gradient-to-tr from-spark to-amber" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-textPrimary">
            {SITE.name}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="text-sm text-textMuted transition-colors hover:text-textPrimary"
                data-cursor="magnetic"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`#${ANCHORS.sponsor}`}
              onClick={(e) => handleNav(e, `#${ANCHORS.sponsor}`)}
              className="rounded-full bg-gradient-to-b from-ember to-redOrange px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(255,87,34,0.7)] transition-transform hover:-translate-y-0.5"
              data-cursor="magnetic"
            >
              Sponsor
            </a>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-textPrimary md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 h-[2px] w-5 bg-current transition-all duration-300 ${
                menuOpen ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-[2px] w-5 bg-current transition-all duration-300 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-[2px] w-5 bg-current transition-all duration-300 ${
                menuOpen ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[-1] flex flex-col justify-center gap-2 bg-black/95 px-8 backdrop-blur-xl transition-all duration-500 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNav(e, link.href)}
            className="border-b border-white/5 py-4 font-display text-3xl font-bold text-textPrimary"
          >
            {link.label}
          </a>
        ))}
        <a
          href={`#${ANCHORS.sponsor}`}
          onClick={(e) => handleNav(e, `#${ANCHORS.sponsor}`)}
          className="mt-6 rounded-full bg-gradient-to-b from-ember to-redOrange px-6 py-4 text-center text-lg font-semibold text-white"
        >
          Sponsor a tribe
        </a>
      </div>
    </header>
  );
}

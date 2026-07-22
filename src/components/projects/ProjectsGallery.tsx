"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { LayoutGroup, motion } from "motion/react";
import { PROJECTS, type Project } from "@/data/projects";
import { useExperience } from "@/components/providers/ExperienceProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** The expensive-feeling easing shared by every gallery animation. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Vertical offsets that scatter the mosaic so it reads organic, not grid. */
const STAGGER = [0, 28, 8, 40, 16, 34];

const PANEL_WIDTH = 320;
const GAP = 16;

type Size = { w: number; h: number };

function tileSizes(tablet: boolean): { base: Size; big: Size } {
  return tablet
    ? { base: { w: 160, h: 240 }, big: { w: 200, h: 280 } }
    : { base: { w: 200, h: 300 }, big: { w: 250, h: 350 } };
}

export function ProjectsGallery() {
  const { reducedMotion } = useExperience();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const canHover = useMediaQuery("(hover: hover)");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [panelSide, setPanelSide] = useState<"left" | "right">("right");
  const [focusIdx, setFocusIdx] = useState(0);

  const listRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef(new Map<string, HTMLButtonElement>());

  const { base, big } = tileSizes(isTablet);
  const selectedIndex = PROJECTS.findIndex((p) => p.id === selectedId);
  const selected = selectedIndex >= 0 ? PROJECTS[selectedIndex] : null;

  const layoutTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: EASE };

  const deselect = useCallback(() => setSelectedId(null), []);

  const select = useCallback(
    (project: Project) => {
      setSelectedId((current) => {
        if (current === project.id) return null;
        // Decide which side the panel slides out on: right unless that would
        // push it past the container's right edge, then left.
        const tile = tileRefs.current.get(project.id);
        const container = listRef.current;
        if (tile && container && !isMobile) {
          const t = tile.getBoundingClientRect();
          const c = container.getBoundingClientRect();
          const bigW = 250; // desktop growth target; tablet is narrower
          setPanelSide(t.left + bigW + GAP + PANEL_WIDTH > c.right ? "left" : "right");
        }
        return project.id;
      });
    },
    [isMobile],
  );

  // Escape deselects from anywhere; clicking/tapping outside the gallery does too.
  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") deselect();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        deselect();
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [selectedId, deselect]);

  // Roving-tabindex arrow-key navigation across the tiles.
  const onListKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    let next: number | null = null;
    if (e.key in moves) {
      next = (focusIdx + moves[e.key] + PROJECTS.length) % PROJECTS.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = PROJECTS.length - 1;
    }
    if (next !== null) {
      e.preventDefault();
      setFocusIdx(next);
      tileRefs.current.get(PROJECTS[next].id)?.focus();
    }
  };

  // Where the info panel sits in the flow:
  // desktop/tablet — directly beside the tile (before it when sliding left);
  // mobile — after the end of the selected tile's 2-column row (accordion).
  const panelIndex = useMemo(() => {
    if (selectedIndex < 0) return -1;
    if (isMobile) {
      return Math.min(selectedIndex - (selectedIndex % 2) + 2, PROJECTS.length);
    }
    return panelSide === "right" ? selectedIndex + 1 : selectedIndex;
  }, [selectedIndex, isMobile, panelSide]);

  const items: ReactNode[] = PROJECTS.map((project, i) => {
    const isSelected = project.id === selectedId;
    const grown =
      !reducedMotion &&
      !isMobile &&
      (isSelected || (canHover && hoveredId === project.id && !selectedId));
    const dimmed = selectedId !== null && !isSelected;
    const size = grown ? big : base;
    const showName =
      isMobile || !canHover || isSelected || hoveredId === project.id;

    return (
      <motion.div
        key={project.id}
        layout
        transition={layoutTransition}
        className="relative"
        style={
          isMobile
            ? { width: "calc(50% - 6px)", aspectRatio: "2 / 3" }
            : {
                width: size.w,
                height: size.h,
                marginTop: STAGGER[i % STAGGER.length],
              }
        }
      >
        {isSelected && <span className="fire-ring" aria-hidden />}
        <motion.button
          layout
          transition={layoutTransition}
          ref={(el) => {
            if (el) tileRefs.current.set(project.id, el);
            else tileRefs.current.delete(project.id);
          }}
          type="button"
          role="option"
          aria-selected={isSelected}
          tabIndex={i === focusIdx ? 0 : -1}
          onFocus={() => setFocusIdx(i)}
          onClick={() => select(project)}
          onMouseEnter={() => setHoveredId(project.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group relative block h-full w-full overflow-hidden bg-charcoalSoft text-left"
          style={{
            borderRadius: grown || isSelected ? 16 : 12,
            boxShadow: grown
              ? "0 24px 60px -20px rgba(255,87,34,0.45)"
              : "0 8px 24px -16px rgba(0,0,0,0.8)",
            transition: `box-shadow 0.45s cubic-bezier(0.22,1,0.36,1)`,
          }}
        >
          {/* Image layer — 85% brightness at rest, full on hover/selection. */}
          <motion.div
            layout
            transition={layoutTransition}
            className="absolute inset-0"
            style={{
              filter: `brightness(${grown || isSelected ? 1 : 0.85}) saturate(${dimmed ? 0.3 : 1})`,
              transition: "filter 0.3s ease",
            }}
          >
            <Image
              src={project.image}
              alt={`Portrait of the ${project.name} community, ${project.country} (placeholder image)`}
              fill
              sizes="(max-width: 767px) 50vw, 250px"
              className="object-cover"
            />
          </motion.div>

          {/* Legibility gradient from the bottom. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          {/* Dark overlay dropping unselected tiles back. */}
          <div
            className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-300"
            style={{ opacity: dimmed ? 0.65 : 0 }}
          />

          {/* People-group name, fading up on hover. */}
          <motion.span
            layout="position"
            className="absolute inset-x-0 bottom-0 p-4 font-display text-lg font-bold text-textPrimary transition-all duration-300"
            style={{
              opacity: showName ? 1 : 0,
              transform: showName ? "translateY(0)" : "translateY(8px)",
            }}
          >
            {project.name}
            <span className="mt-0.5 block text-[0.65rem] font-normal uppercase tracking-[0.2em] text-textMuted">
              {project.country}
            </span>
          </motion.span>
        </motion.button>
      </motion.div>
    );
  });

  if (selected && panelIndex >= 0) {
    items.splice(
      panelIndex,
      0,
      <ProjectPanel
        key={`panel-${selected.id}`}
        project={selected}
        side={panelSide}
        height={reducedMotion ? base.h : big.h}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
      />,
    );
  }

  return (
    <div>
      {/* Screen-reader announcement when a project opens. */}
      <div aria-live="polite" className="sr-only">
        {selected
          ? `${selected.name} selected. Project details panel open. Press Escape to close.`
          : ""}
      </div>

      <LayoutGroup>
        <div
          ref={listRef}
          role="listbox"
          aria-label="Choose a language community to sponsor"
          aria-orientation="horizontal"
          onKeyDown={onListKeyDown}
          className={
            isMobile
              ? "flex flex-wrap justify-center gap-3"
              : "flex flex-wrap items-start justify-center gap-4 pb-10"
          }
        >
          {items}
        </div>
      </LayoutGroup>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ProjectPanel({
  project,
  side,
  height,
  isMobile,
  reducedMotion,
}: {
  project: Project;
  side: "left" | "right";
  height: number;
  isMobile: boolean;
  reducedMotion: boolean;
}) {
  const panelRef = useRef<HTMLElement>(null);

  const funded = Math.max(0, Math.min(100, project.fundedPercent));

  return (
    <motion.aside
      ref={panelRef}
      layout
      role="region"
      aria-label={`${project.name} — project details`}
      initial={
        reducedMotion
          ? { opacity: 1 }
          : { opacity: 0, x: isMobile ? 0 : side === "right" ? -24 : 24, y: isMobile ? -12 : 0 }
      }
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={
        reducedMotion ? { duration: 0 } : { duration: 0.35, ease: EASE }
      }
      className="relative z-10 overflow-hidden rounded-2xl bg-white shadow-[0_24px_70px_-24px_rgba(0,0,0,0.6)]"
      style={
        isMobile
          ? { width: "100%" }
          : { width: PANEL_WIDTH, height, marginTop: 0 }
      }
    >
      <div
        className="flex h-full flex-col gap-3 overflow-y-auto p-5"
        style={{ color: "#666666" }}
      >
        <h3
          className="font-display text-xl font-bold leading-tight"
          style={{ color: "#333333" }}
        >
          {project.name}
        </h3>

        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em]">
          {project.country} · {project.language} · {project.population}
        </p>

        <p className="text-sm leading-relaxed">{project.description}</p>

        <p className="text-xs font-medium">{project.status}</p>

        <div className="mt-auto pt-1">
          <div
            className="h-1 w-full overflow-hidden rounded-full"
            style={{ background: "rgba(0,0,0,0.08)" }}
            role="progressbar"
            aria-valuenow={funded}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${project.name} funding progress`}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${funded}%`, background: "#FF5722" }}
            />
          </div>
          <p className="mt-1.5 text-xs">{funded}% sponsored</p>

          <a
            href={project.stripeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-full rounded-full py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(255,87,34,0.8)]"
            style={{ background: "#FF5722" }}
          >
            Sponsor Now
          </a>
        </div>
      </div>
    </motion.aside>
  );
}

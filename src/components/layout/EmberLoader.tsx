"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { SITE } from "@/lib/constants";

/**
 * Branded ember loader. drei's `useProgress` reports Three.js asset loading.
 * These scenes ship no external textures or models, so normally nothing loads
 * and the loader dismisses almost immediately — it only lingers if a scene is
 * genuinely still fetching (`active`). Either way it never blocks reading the
 * hero, which is plain DOM.
 */
export function EmberLoader() {
  const { active, progress } = useProgress();
  // Start hidden so the loader never flashes over already-painted content when
  // there is nothing to load; reveal only if a scene actually starts fetching.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active && progress < 100) {
      setVisible(true);
      return;
    }
    if (visible) {
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [active, progress, visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#0A0A0B]"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-ember/30" />
        <span className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-tr from-redOrange to-spark blur-[6px]" />
        <span className="relative h-4 w-4 rounded-full bg-spark" />
      </div>
      <p className="font-display text-sm font-semibold uppercase tracking-[0.4em] text-textMuted">
        {SITE.name}
      </p>
      <span className="sr-only">Loading experience…</span>
    </div>
  );
}

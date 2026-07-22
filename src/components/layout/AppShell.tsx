"use client";

import { useRef, type ReactNode } from "react";
import { CanvasRoot } from "@/components/three/CanvasRoot";
import { Nav } from "@/components/layout/Nav";
import { ScrollProgressBar } from "@/components/layout/ScrollProgressBar";
import { BackToTop } from "@/components/layout/BackToTop";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { EmberLoader } from "@/components/layout/EmberLoader";

/**
 * Client shell that owns the DOM root the WebGL canvas tracks for pointer
 * events, and mounts every global overlay (nav, progress bar, cursor, canvas,
 * back-to-top). Section content is passed as children.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef} className="relative">
      <EmberLoader />
      <ScrollProgressBar />
      <Nav />
      <CustomCursor />
      {/* The single persistent Canvas sits behind all content. */}
      <CanvasRoot eventSource={rootRef} />
      <main id="content">{children}</main>
      <BackToTop />
    </div>
  );
}

/**
 * Device capability tiering. Runs once on the client to decide how heavy the
 * 3D experience is allowed to be. A stuttering 3D site reads as cheap, so we
 * scale particle counts, DPR, and post-processing to the hardware.
 */

export type Tier = "low" | "mid" | "high";

export type DeviceProfile = {
  tier: Tier;
  /** Device-pixel-ratio cap passed to the R3F Canvas. */
  dpr: [number, number];
  /** Multiplier applied to particle counts (1 = full, 0.2 = ~80% fewer). */
  particleScale: number;
  /** Whether bloom / post-processing is allowed. */
  postProcessing: boolean;
  /** MSAA on the canvas. */
  antialias: boolean;
  isTouch: boolean;
};

function detectWebGLRenderer(): string {
  if (typeof document === "undefined") return "";
  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return "";
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (!ext) return "";
    return String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "");
  } catch {
    return "";
  }
}

export function detectDeviceProfile(): DeviceProfile {
  // Server / no-DOM fallback: assume a capable desktop but stay conservative.
  if (typeof window === "undefined") {
    return {
      tier: "mid",
      dpr: [1, 1.5],
      particleScale: 0.5,
      postProcessing: false,
      antialias: true,
      isTouch: false,
    };
  }

  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  const deviceMemory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const isTouch =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const renderer = detectWebGLRenderer().toLowerCase();

  // Known-weak GPU signatures (integrated / mobile / software).
  const weakGpu =
    /swiftshader|llvmpipe|software|mali-4|adreno 3|adreno 4|powervr|apple gpu \(low/.test(
      renderer,
    );

  let tier: Tier = "high";

  if (width < 768 || cores <= 4 || deviceMemory <= 4 || weakGpu) {
    tier = "low";
  } else if (width < 1280 || cores <= 8 || deviceMemory <= 8) {
    tier = "mid";
  }

  // Touch devices never get the heaviest tier — thermal + battery headroom.
  if (isTouch && tier === "high") tier = "mid";

  switch (tier) {
    case "high":
      return {
        tier,
        dpr: [1, 2],
        particleScale: 1,
        postProcessing: true,
        antialias: true,
        isTouch,
      };
    case "mid":
      return {
        tier,
        dpr: [1, 1.5],
        particleScale: 0.5,
        postProcessing: true,
        antialias: true,
        isTouch,
      };
    case "low":
    default:
      return {
        tier,
        dpr: [1, 1.5],
        // ~80% fewer particles on the weakest tier.
        particleScale: 0.2,
        postProcessing: false,
        antialias: false,
        isTouch,
      };
  }
}

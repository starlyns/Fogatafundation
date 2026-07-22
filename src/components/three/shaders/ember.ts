/**
 * GLSL for the ember particle field. Points drift upward, sway gently, and
 * flicker between ember, amber, and gold. Designed for additive blending so
 * overlapping embers bloom into brighter cores.
 */

export const emberVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uHeight;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute float aSeed;
  attribute float aScale;

  varying float vSeed;
  varying float vLife;

  void main() {
    vSeed = aSeed;

    vec3 pos = position;

    // Continuous upward drift, wrapped into [0, uHeight] then centred.
    float speed = uSpeed * (0.5 + aSeed);
    float y = mod(pos.y + uTime * speed, uHeight);
    pos.y = y - uHeight * 0.5;

    // Life is 0 at the bottom, 1 at the top — used to fade embers as they rise.
    vLife = y / uHeight;

    // Lateral sway so the column feels alive, not like falling rain in reverse.
    pos.x += sin(uTime * 0.6 + aSeed * 6.2831) * 0.35 * (0.4 + aSeed);
    pos.z += cos(uTime * 0.5 + aSeed * 6.2831) * 0.35 * (0.4 + aSeed);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Perspective size attenuation.
    gl_PointSize = uSize * aScale * uPixelRatio * (18.0 / -mvPosition.z);
  }
`;

export const emberFragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uColorEmber;
  uniform vec3 uColorAmber;
  uniform vec3 uColorSpark;
  uniform float uTime;
  uniform float uIntensity;

  varying float vSeed;
  varying float vLife;

  void main() {
    // Soft round particle.
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    if (alpha <= 0.001) discard;

    // Flicker per-ember.
    float flicker = 0.7 + 0.3 * sin(uTime * (6.0 + vSeed * 8.0) + vSeed * 40.0);

    // Colour ramps from deep ember at birth to bright spark near the top, with
    // amber in the middle. Rare embers flare gold.
    vec3 color = mix(uColorEmber, uColorAmber, smoothstep(0.0, 0.5, vLife));
    color = mix(color, uColorSpark, smoothstep(0.7, 1.0, vLife) * step(0.82, vSeed));

    // Fade in from the bottom, fade out near the top.
    float lifeFade = smoothstep(0.0, 0.08, vLife) * (1.0 - smoothstep(0.75, 1.0, vLife));

    gl_FragColor = vec4(color * flicker, alpha * lifeFade * uIntensity);
  }
`;

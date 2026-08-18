/**
 * Animated shader backgrounds, powered by Paper Shaders (paper.design).
 *
 * The Hero (Shader) block renders an empty mount element carrying its editor
 * settings as JSON:
 *
 *   <div data-paper-shader data-shader='{"preset":"mesh","colors":[...]}'></div>
 *
 * This file finds those elements and mounts a WebGL canvas into each one.
 * Paper Shaders injects its own stylesheet the first time it mounts, which is
 * why the element must carry the `data-paper-shader` attribute — that's the
 * selector the library positions the canvas with.
 *
 * Loaded only by the shader block's {% canopy scripts %} section, so pages
 * without a shader hero never pay for it.
 */

import {
  ShaderMount,
  getShaderColorFromString,
  getShaderNoiseTexture,
  meshGradientFragmentShader,
  warpFragmentShader,
  WarpPatterns,
  grainGradientFragmentShader,
  GrainGradientShapes,
  godRaysFragmentShader,
  swirlFragmentShader,
  ditheringFragmentShader,
  DitheringShapes,
  DitheringTypes,
} from "@paper-design/shaders";

/* ---------------------------------------------------------------------------
   Shared helpers
   --------------------------------------------------------------------------- */

const FIT = { none: 0, contain: 1, cover: 2 };

const clamp01 = (n, fallback = 0) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : fallback;
};

const num = (n, fallback) => {
  const v = Number(n);
  return Number.isFinite(v) ? v : fallback;
};

/** Look a named variation up in one of the library's enums, with a fallback. */
const shapeOf = (table, name, fallback) => table[name] ?? table[fallback];

/**
 * Warp, grain and rays sample a shared noise texture. getShaderNoiseTexture()
 * hands back an <img> with its src set but not yet decoded, and ShaderMount
 * throws outright if a texture uniform isn't fully loaded — so the mount has
 * to wait for it. It's a data URI, so this settles almost immediately.
 */
const noiseTexture = getShaderNoiseTexture();

const noiseReady =
  !noiseTexture || noiseTexture.complete
    ? Promise.resolve()
    : new Promise((resolve) => {
        noiseTexture.addEventListener("load", resolve, { once: true });
        noiseTexture.addEventListener("error", resolve, { once: true });
      });

/**
 * Sizing uniforms every shader in the library expects. `fit` differs per
 * shader family: object shaders (mesh, rays, swirl) want to cover the canvas,
 * pattern shaders (warp, grain, dither) tile at their own scale.
 */
const sizing = (cfg, fit) => ({
  u_fit: FIT[fit] ?? FIT.none,
  u_scale: num(cfg.scale, 1),
  u_rotation: num(cfg.rotation, 0),
  u_originX: 0.5,
  u_originY: 0.5,
  u_offsetX: 0,
  u_offsetY: 0,
  u_worldWidth: 0,
  u_worldHeight: 0,
});

/** Editor colours -> vec4 list, trimmed to what the shader can actually take. */
const colors = (cfg, max) => {
  const list = (Array.isArray(cfg.colors) ? cfg.colors : [])
    .filter((c) => typeof c === "string" && c.trim() !== "")
    .slice(0, max);

  // Every shader divides by u_colorsCount, so never hand back an empty list.
  if (list.length === 0) list.push("#ffffff");

  return { u_colors: list.map(getShaderColorFromString), u_colorsCount: list.length };
};

/* ---------------------------------------------------------------------------
   Presets.

   Each preset maps the block's generic controls (intensity, distortion, grain,
   softness) onto the uniforms that shader actually exposes, so an editor can
   switch preset without every slider losing its meaning.
   --------------------------------------------------------------------------- */

const PRESETS = {
  // Flowing liquid colour — the closest to a marbled album-art background.
  mesh: (cfg) => ({
    shader: meshGradientFragmentShader,
    uniforms: {
      ...sizing(cfg, "cover"),
      ...colors(cfg, 10),
      u_distortion: clamp01(cfg.distortion, 0.8),
      u_swirl: clamp01(cfg.intensity, 0.6),
      u_grainMixer: clamp01(cfg.grain, 0),
      u_grainOverlay: clamp01(cfg.grain, 0) * 0.5,
    },
  }),

  // Smoky, marbled bands warped by noise.
  warp: (cfg) => ({
    shader: warpFragmentShader,
    uniforms: {
      ...sizing(cfg, "none"),
      ...colors(cfg, 10),
      u_proportion: 0.5,
      u_softness: clamp01(cfg.softness, 1),
      u_shape: shapeOf(WarpPatterns, cfg.shape, "stripes"),
      u_shapeScale: 0.1,
      u_distortion: clamp01(cfg.distortion, 0.25),
      u_swirl: clamp01(cfg.intensity, 0.8),
      u_swirlIterations: 10,
      u_noiseTexture: noiseTexture,
    },
  }),

  // Grainy risograph-style gradient.
  grain: (cfg) => ({
    shader: grainGradientFragmentShader,
    uniforms: {
      ...sizing(cfg, "cover"),
      ...colors(cfg, 7),
      u_colorBack: getShaderColorFromString(cfg.color_back || "#00000000"),
      u_softness: clamp01(cfg.softness, 0.6),
      u_intensity: clamp01(cfg.intensity, 0.45),
      u_noise: clamp01(cfg.grain, 0.35),
      u_shape: shapeOf(GrainGradientShapes, cfg.shape, "blob"),
      u_noiseTexture: noiseTexture,
    },
  }),

  // Light rays from the centre — dramatic behind big type.
  rays: (cfg) => ({
    shader: godRaysFragmentShader,
    uniforms: {
      ...sizing(cfg, "cover"),
      ...colors(cfg, 5),
      u_colorBack: getShaderColorFromString(cfg.color_back || "#000000"),
      u_colorBloom: getShaderColorFromString(cfg.color_bloom || cfg.colors?.[0] || "#ffffff"),
      u_bloom: 0.4,
      u_intensity: clamp01(cfg.intensity, 0.5),
      u_density: clamp01(cfg.distortion, 0.4),
      u_spotty: 0.25,
      u_midSize: 0.6,
      u_midIntensity: 0.35,
      u_noiseTexture: noiseTexture,
    },
  }),

  // Twisting concentric bands.
  swirl: (cfg) => ({
    shader: swirlFragmentShader,
    uniforms: {
      ...sizing(cfg, "cover"),
      ...colors(cfg, 10),
      u_colorBack: getShaderColorFromString(cfg.color_back || "#000000"),
      u_bandCount: num(cfg.bands, 4),
      u_twist: clamp01(cfg.intensity, 0.3),
      u_center: 0.4,
      u_proportion: 0.5,
      u_softness: clamp01(cfg.softness, 0.6),
      u_noiseFrequency: 0.5,
      u_noise: clamp01(cfg.grain, 0.2),
    },
  }),

  // Two-tone Bayer dithering — lo-fi, print-like.
  dither: (cfg) => ({
    shader: ditheringFragmentShader,
    uniforms: {
      ...sizing(cfg, "cover"),
      u_colorBack: getShaderColorFromString(cfg.color_back || "#000000"),
      u_colorFront: getShaderColorFromString(cfg.colors?.[0] || "#ffffff"),
      u_shape: shapeOf(DitheringShapes, cfg.shape, "ripple"),
      u_type: DitheringTypes["8x8"],
      u_pxSize: num(cfg.pixel_size, 3),
    },
  }),
};

/* ---------------------------------------------------------------------------
   Mounting
   --------------------------------------------------------------------------- */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function mount(element) {
  if (element.dataset.shaderMounted) return;

  let cfg;
  try {
    cfg = JSON.parse(element.dataset.shader || "{}");
  } catch {
    console.warn("Shader background: could not parse settings", element);
    return;
  }

  const build = PRESETS[cfg.preset] ?? PRESETS.mesh;
  const { shader, uniforms } = build(cfg);

  // A still frame is rendered when the visitor asks for reduced motion —
  // speed 0 also stops the library's rAF loop entirely.
  const speed = prefersReducedMotion.matches ? 0 : num(cfg.speed, 0.6);

  try {
    new ShaderMount(element, shader, uniforms, undefined, speed, num(cfg.frame, 0));
    element.dataset.shaderMounted = "true";
  } catch (error) {
    // No WebGL2 (older browsers, blocked contexts) — the block's CSS gradient
    // fallback stays visible, so the hero is still readable.
    console.warn("Shader background: mount failed", error);
  }
}

function mountAll() {
  // Every mount waits on the noise texture, not just the presets that sample
  // it — it resolves in the same tick for a data URI, and it keeps the
  // ordering identical for all six presets.
  noiseReady.then(() => {
    document.querySelectorAll("[data-shader]").forEach(mount);
  });
}

// The block emits its own <script> tag, so two shader heroes on one page load
// this file twice. Mounting is already idempotent, but the observer below is
// not — bail out rather than stack up a second one.
if (!window.__paperShaderBgInit) {
  window.__paperShaderBgInit = true;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll, { once: true });
  } else {
    mountAll();
  }

  // The Canopy editor swaps block markup in place; re-scan so a newly inserted
  // or re-rendered hero picks up its shader without a page reload.
  new MutationObserver(mountAll).observe(document.body, {
    childList: true,
    subtree: true,
  });
}

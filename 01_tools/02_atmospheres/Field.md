---
type: atmosphere
name: field
for: [human, ai]
visibility: local
status: active
---
# Field

*A particle flow atmosphere.*

> **This is a background cover.** The Field atmosphere occupies `z-index: 0` and fills the viewport. All text, UI, components, lenses, and layouts go on top of it at `z-index: 2` or higher. The atmosphere's container has `pointer-events: none` so mouse events pass through to content above, while cursor response is handled by a global `window` listener. Field works with any layout and any set of lenses; it does not know or care what sits on top.

This doc describes what the Field atmosphere looks like, what can be configured, and how to integrate it into an artifact. For the category charter (what atmospheres are in general), see `atmospheres.md`. For other atmospheres in the library, see the filenames listed there.

---

## At a glance

| | |
|---|---|
| **Name** | Field |
| **Role** | Background cover (atmosphere, `z-index: 0`) |
| **Type** | Full-viewport canvas |
| **Interaction** | Responds to cursor with flow-around deflection |
| **Performance** | ~350 particles, 60fps on modest hardware, respects `prefers-reduced-motion` |
| **Dependencies** | None (vanilla JS) |
| **File size** | ~18KB uncompressed, ~623 lines of implementation |

Use Field as the background layer behind contemplative content: essays, landing pages, reading interfaces, anything that benefits from the sense of a breathing surrounding field. It sits beneath text and UI, stays out of the way, and gives the page a quality of being alive without being busy.

Do not use for dashboards, technical documentation, or any interface where motion in the periphery would compete with active reading or decision-making.

---

## Visual character

The field is a dark, ethereal space populated by small glowing particles that trace short luminous lines as they move. Default palette is deep graphite with sky-blue particles, though this can be retuned.

The particles never settle. They cycle slowly through four distinct behaviors, each with its own mood:

- **Fish.** Particles school together in organic flocks. They drift, split, reform, and follow a slowly-evolving curl current underneath. Dominant feeling: cohesion and intelligence in motion.
- **Snow.** Particles radiate outward from the center with depth-based scale and brightness, as if flying forward through a field of stars or falling snow at night. Dominant feeling: travel, forward motion through space.
- **Water.** The upper two-thirds of the frame has downward gravity with turbulence. The lower third has sinusoidal wave forces. Particles cascade down and pool into a moving surface at the bottom. Dominant feeling: gathering, settling.
- **Electric.** Per-particle sine oscillations with occasional sharp zap impulses. Jittery but constrained. Dominant feeling: latent potential, energy held in pattern.

The transitions between phases take seven seconds and are eased so no moment feels like a hard cut. The full cycle (all four phases plus transitions) takes about two minutes.

The cursor, when present on the canvas, acts as a small physical obstacle. A 40px zone at its position is a hard mask (no particles can enter). In a larger zone out to 120px, particles that would head into the cursor get redirected tangentially instead and flow around its edge. The effect reads as if the cursor has a subtle magnetic field that routes the current.

---

## What's configurable

Everything sits in a `CONFIG` object at the top of the script. Parameters are grouped below by how often you'd typically adjust them.

### Colors (change freely)

| Key | Default | Notes |
|---|---|---|
| `backgroundColor` | `'#0B0D10'` | The canvas base color. Works best with dark colors because particles use additive blending. For light backgrounds, drop `mainDotAlpha` to 0.25 or lower and expect a very different feel. |
| `lineColor` | `'#7DD3FC'` | Color of particles, trails, and glow. Any hex color. More saturated colors glow more vividly under additive blending. |

### Speed (change freely)

| Key | Default | Range | Notes |
|---|---|---|---|
| `speed` | `0.85` | `0.25` to `1.35` | Global time multiplier. Scales both particle motion and time-based patterns (phase cycling, oscillations, whisper fade envelopes) together. 0.5 feels meditative, 1.0 is natural pace, 1.3 is energetic. Bind this to a slider if you want runtime control. |

### Cursor interaction (tune for context)

| Key | Default | Notes |
|---|---|---|
| `cursorInner` | `40` | Radius of the hard mask in pixels. Particles physically cannot occupy this zone. Set to `0` to disable the mask while keeping the flow-around. |
| `cursorRadius` | `120` | Outer edge of the deflection zone. Between `cursorInner` and this, inward-moving particles get redirected tangentially. Larger values create a broader influence area. |
| `cursorStrength` | `0.5` | Magnitude of the gentle outward maintenance push applied throughout the deflection zone. The redirect math that actually bends trajectories has its own internal multiplier, so this knob mostly controls how strongly the zone "holds" particles away from resting positions near the cursor. Set to `0` to disable cursor interaction entirely. |

### Density and brightness (tune for visual weight)

| Key | Default | Notes |
|---|---|---|
| `mainCount` | `220` | Number of primary particles. More means richer field but more CPU. Cap around `400` on most hardware. |
| `whisperCount` | `130` | Number of secondary particles that fade in and out on a 16-second cycle. They add depth without crowding because they are only visible half the time. |
| `mainDotAlpha` | `0.7` | Peak brightness of primary dot glows, range `0` to `1`. The fastest knob for dimming. |
| `mainAlpha` | `0.5` | Brightness of the trail lines connecting past positions. |
| `whisperDotMaxAlpha` | `0.3` | Peak brightness of whisper dot glows at the top of their fade cycle. |
| `whisperMaxAlpha` | `0.28` | Peak brightness of whisper trail lines. |

### Structural (usually leave alone)

These control the underlying physics and timing. Changing them alters the fundamental feel of the atmosphere.

| Key | Default | Notes |
|---|---|---|
| `maxSpeed` | `1.8` | Velocity cap per particle in pixels per frame. |
| `damping` | `0.972` | Per-frame velocity persistence. Higher means smoother and slower to respond to new forces. |
| `phaseDuration` | `22000` | Milliseconds spent in each phase before blending begins. |
| `transitionDuration` | `7000` | Milliseconds spent blending between phases. |
| `mainHistory` | `130` | Trail length in frames for primary particles. |
| `whisperHistory` | `105` | Trail length in frames for whispers. |
| `mainWidth` | `0.35` | Line thickness in pixels for primary trails. |
| `whisperWidth` | `0.18` | Line thickness for whisper trails. |
| `mainDotSize` | `4.5` | Glow sprite radius for primary dots. |
| `whisperDotSize` | `2.0` | Glow sprite radius for whisper dots. |
| `whisperCyclePeriod` | `16000` | Milliseconds for one whisper fade-in-and-out cycle. |

---

## How it behaves

### The four-phase cycle

The `forces` array contains four functions, one per phase. At any moment the draw loop checks which phase is current and which is next, and blends their outputs using an ease-in-out curve applied to the transition progress. The cycle order is fixed: `fish → snow → water → electric → fish`.

Each phase computes a force vector `{x, y}` per particle. Under the hood:

- `fishForce` combines boids (separation, alignment, cohesion) at a 75px neighbor radius, a curl noise field that drifts slowly, and a gentle boundary pull toward the viewport center when particles stray too far.
- `snowForce` pushes particles radially outward from the viewport center, with a small downward bias and a gentle curl perturbation. Depth (set per particle at respawn) determines apparent size and brightness, creating a parallax feel.
- `waterForce` is zone-aware. Above `0.68 * H`, gravity plus curl turbulence. Below, sinusoidal horizontal and vertical waves. Particles falling off the bottom get respawned at the top.
- `electricForce` sums two sine waves per axis per particle, plus a random zap impulse on about 0.14% of frames. Each zap lasts 7 frames in a random direction.

Phase transitions blend force outputs: `fx = f1.x * (1 - ease) + f2.x * ease`. The forces being blended still read from the current simulation time, so the "identity" of each phase stays coherent through the transition.

### Cursor flow-around

The cursor interaction lives in a single function, `cursorForce(p)`. It runs per particle per frame.

If the cursor is not on the canvas, or the particle is outside `cursorRadius`, it returns zero force.

If the particle is inside `cursorInner`, it returns a strong outward push whose magnitude scales with penetration depth, plus a cancellation force for any inward velocity component. Particles get ejected to the boundary within a few frames.

If the particle is between `cursorInner` and `cursorRadius`, the function decomposes the particle's velocity into radial (toward/away from cursor) and tangential (around cursor) components. If the radial component is inward, it gets converted to tangential force in whichever direction the particle was already drifting sideways. This is the flow-around behavior. If the particle is moving away or already tangentially, only a gentle outward maintenance push applies so it doesn't drift back.

Cursor force does NOT scale with `CONFIG.speed`. Interactive response stays immediate even when the ambient flow is slow.

### Speed scaling

`CONFIG.speed` affects two places in the loop. First, the RAF wrapper advances a `simTime` counter at `realDelta * CONFIG.speed`, and this counter (not real time) is what gets passed into every time-based computation (phase cycling, curl noise evolution, whisper fade envelopes, electric oscillations). Second, each particle's position update multiplies velocity by `CONFIG.speed` before integration. The combined effect is uniform: 0.5× means everything visible runs at half pace.

The animation reads `CONFIG.speed` on every frame, so changes take effect on the next draw. You can bind a slider to it and see immediate response.

---

## Integration

### Minimal embed

The atmosphere is three things in the markup: a fullscreen container for the canvas, the canvas itself, and a thin "glass veil" layer that softens text readability by muting the particles slightly. All three are siblings at the start of `<body>`. None of your content nests inside them.

```html
<body>
  <!-- Atmosphere: always first, always at z-index 0 -->
  <div class="field" aria-hidden="true">
    <canvas id="flow"></canvas>
  </div>
  <div class="glass-veil" aria-hidden="true"></div>

  <!-- Everything else goes here, at z-index 2 or higher -->
  <main class="your-content">...</main>

  <!-- Script at the end -->
  <script>/* atmosphere code */</script>
</body>
```

The CSS needed on top of whatever else your artifact has:

```css
html, body {
  margin: 0;
  background: #0B0D10;  /* match CONFIG.backgroundColor to avoid flash before first paint */
  overflow: hidden;      /* or overflow-x: hidden if the page scrolls */
}
.field {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.field canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
.glass-veil {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: rgba(11, 13, 16, 0.025);
  backdrop-filter: blur(0.8px) saturate(1.04);
  -webkit-backdrop-filter: blur(0.8px) saturate(1.04);
}
.your-content {
  position: relative;  /* required so z-index takes effect */
  z-index: 2;
}
```

The script tag goes just before the closing `</body>`. See the full implementation at the end of this doc.

### Composing with layouts

Any layout works on top. Grid, flexbox, absolute positioning, scrolling pages, single-viewport apps. The layout container just needs `position: relative` (or another positioning scheme) and a `z-index` of 2 or higher. The atmosphere is layout-blind; it doesn't know or care what the layout does.

### Composing with lenses

Any lens works on top. Lenses that render in their own container (Word Cloud, Sentiment map, HMW affinity, etc.) sit at `z-index: 3+` above both the atmosphere and any underlying layout. The atmosphere's additive-blended glow will show through transparent parts of the lens without interfering, and the glass veil at `z-index: 1` provides the readability softening between them.

If a lens needs a solid background (for readability on top of a busy atmosphere), give the lens container its own background color at `z-index: 3` and let the atmosphere show only where the lens has gaps.

### Wiring a speed slider

`CONFIG.speed` is read every frame. To expose a slider:

```html
<input type="range" id="speed-slider" min="0.25" max="1.35" step="0.05" value="0.85" />
```

```js
document.getElementById('speed-slider').addEventListener('input', (e) => {
  CONFIG.speed = parseFloat(e.target.value);
});
```

The slider can live anywhere in your UI at `z-index: 5+` (interactive layer). The atmosphere will respond instantly.

### Common variations

**Warmer palette.** Change `backgroundColor` to `'#1A1410'` (dark warm brown) and `lineColor` to `'#F59E0B'` (amber) or `'#FB923C'` (orange). Amber reads as brighter than sky blue at the same alpha, so also drop `mainDotAlpha` to around `0.55` and `whisperDotMaxAlpha` to `0.22`.

**Subtler, less dense field.** For use behind busier content or smaller viewports. Set `mainCount: 140`, `whisperCount: 90`, `mainDotAlpha: 0.45`, `mainAlpha: 0.35`.

**No cursor interaction.** Set `cursorRadius: 0`. The `cursorForce` function short-circuits and returns zero for every particle. Useful if the atmosphere sits behind UI where deflection would feel noisy.

**Slower, more meditative.** Set `speed: 0.55`, `phaseDuration: 30000`. The phases last longer and everything drifts more.

**Single-phase.** If the phase cycle is too busy for your context and you want just one behavior, edit the `forces` array and `phaseKey` array to contain only one entry each, for example `const forces = [fishForce]` and `const phaseKey = ['fish']`. The phase cycle math will then always return the same phase.

**Paused/static.** The script already handles `prefers-reduced-motion: reduce` by painting a single frame of particles in random positions and stopping the loop. No configuration needed.

---

## AI implementation instructions

When a user asks for the Field atmosphere (or similar: "the flow animation," "the particle background," "the ambient one with the particles"), execute these steps in order.

**1. Place the atmosphere at the base of the artifact.**

- Add `.field` (containing `<canvas id="flow">`) and `.glass-veil` as siblings at the start of `<body>`, before any content.
- Give them `z-index: 0` and `z-index: 1` respectively, and `pointer-events: none` on both.
- Make sure `<body>` has `background` matching `CONFIG.backgroundColor` to avoid a flash before first paint.

**2. Place all content on top at z-index 2 or higher.**

- Any existing layout wrapper gets `position: relative` and `z-index: 2` (or higher).
- Any lens containers sit at `z-index: 3+`.
- Any interactive UI (buttons, inputs, modals) sit at `z-index: 5+`.
- Do NOT nest content inside `.field` or `.glass-veil`. They are background layers, not containers.

**3. Tune CONFIG for the context before writing anything else.**

- If the content on top is text-heavy and quiet, keep defaults.
- If the content is busier, reduce density and brightness (see "Subtler" variation).
- If the palette needs to match an existing brand, change `backgroundColor` and `lineColor` first, then validate `mainDotAlpha` against the new hue (brighter hues need lower alpha).
- If the user has requested a speed slider, keep `CONFIG.speed` at default and add the slider UI per the wiring section.

**4. Do not modify these without user explicit request:**

- The `cursorForce` function internals (the flow-around math is tuned).
- The Perlin noise / curl implementation (the seed `2026` is arbitrary but changing it changes the noise field entirely).
- The `damping` and `maxSpeed` defaults (they are balanced against each other).
- The glow sprite gradient (the removal of pure white at the center is intentional and prevents overexposure from additive blending; do not add `rgba(255,255,255,1)` back at stop 0 unless the user is deliberately asking for a more "hot" look).

**5. If the user wants new phases added, extend these three things together:**

- Add a new force function with the same signature: `function myForce(p, t) { return { x: fx, y: fy }; }`.
- Push it onto the `forces` array.
- Push a matching key string onto the `phaseKey` array.
- Optionally add a case to `respawnForPhase` if particles need specific respawn behavior for the new phase.

The phase cycle math will automatically include any number of phases in order, as long as `forces.length === phaseKey.length`.

**6. Sanity checks before declaring done:**

- The canvas visibly paints on load (not a blank screen).
- Moving the cursor creates visible deflection in the particles.
- Content on top is fully readable and interactive.
- No console errors in browser devtools.
- `prefers-reduced-motion` behavior works (particles paint once and stop moving).

---

## Full implementation

Complete standalone HTML file. Paste into a new `.html` artifact and it runs. Adjust the `CONFIG` object at the top of the script to retune. For composing into an artifact with content, extract just the `<style>` rules, the two `<div>` elements, and the `<script>` block.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Field</title>
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #0B0D10;
  }
  .field {
    position: fixed;
    inset: 0;
    pointer-events: none;
  }
  .field canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  .glass-veil {
    position: fixed;
    inset: 0;
    pointer-events: none;
    background: rgba(11, 13, 16, 0.025);
    backdrop-filter: blur(0.8px) saturate(1.04);
    -webkit-backdrop-filter: blur(0.8px) saturate(1.04);
  }
</style>
</head>
<body>

<div class="field" aria-hidden="true">
  <canvas id="flow"></canvas>
</div>
<div class="glass-veil" aria-hidden="true"></div>

<script>
(() => {
  const CONFIG = {
    backgroundColor: '#0B0D10',
    lineColor: '#7DD3FC',

    speed: 0.85,

    phaseDuration: 22000,
    transitionDuration: 7000,

    maxSpeed: 1.8,
    damping: 0.972,

    cursorInner: 40,
    cursorRadius: 120,
    cursorStrength: 0.5,

    mainCount: 220,
    mainHistory: 130,
    mainWidth: 0.35,
    mainAlpha: 0.5,
    mainDotSize: 4.5,
    mainDotAlpha: 0.7,

    whisperCount: 130,
    whisperHistory: 105,
    whisperWidth: 0.18,
    whisperMaxAlpha: 0.28,
    whisperDotSize: 2.0,
    whisperDotMaxAlpha: 0.3,
    whisperCyclePeriod: 16000,
  };

  document.body.style.background = CONFIG.backgroundColor;

  const canvas = document.getElementById('flow');
  const ctx = canvas.getContext('2d');

  let W, H, dpr, CX, CY;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let cursorX = 0, cursorY = 0, cursorActive = false;

  function hexToRgb(hex) {
    const n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const BG = hexToRgb(CONFIG.backgroundColor);
  const LC = hexToRgb(CONFIG.lineColor);

  function createGlowSprite() {
    const size = 40;
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const gctx = cv.getContext('2d');
    const grad = gctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    grad.addColorStop(0, `rgba(${LC[0]}, ${LC[1]}, ${LC[2]}, 0.7)`);
    grad.addColorStop(0.25, `rgba(${LC[0]}, ${LC[1]}, ${LC[2]}, 0.38)`);
    grad.addColorStop(0.6, `rgba(${LC[0]}, ${LC[1]}, ${LC[2]}, 0.1)`);
    grad.addColorStop(1, `rgba(${LC[0]}, ${LC[1]}, ${LC[2]}, 0)`);
    gctx.fillStyle = grad;
    gctx.fillRect(0, 0, size, size);
    return cv;
  }
  const glowSprite = createGlowSprite();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    CX = W / 2; CY = H / 2;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = CONFIG.backgroundColor;
    ctx.fillRect(0, 0, W, H);
  }

  function makePerm(seed) {
    const p = 256;
    const perm = new Uint8Array(p * 2);
    for (let i = 0; i < p; i++) perm[i] = i;
    let s = seed;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = p - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }
    for (let i = 0; i < p; i++) perm[p + i] = perm[i];
    return perm;
  }
  const perm = makePerm(2026);
  const fadeN = t => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const gradVec = (hash, x, y) => {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };
  function noise2D(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fadeN(x), v = fadeN(y);
    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];
    return lerp(
      lerp(gradVec(aa, x, y), gradVec(ba, x - 1, y), u),
      lerp(gradVec(ab, x, y - 1), gradVec(bb, x - 1, y - 1), u),
      v
    );
  }
  function curl(x, y, t) {
    const eps = 0.01;
    const a = (noise2D(x, y + eps + t) - noise2D(x, y - eps + t)) / (2 * eps);
    const b = (noise2D(x + eps, y + t) - noise2D(x - eps, y + t)) / (2 * eps);
    return { x: a, y: -b };
  }

  const particles = [];
  function seedParticles() {
    particles.length = 0;
    for (let i = 0; i < CONFIG.mainCount; i++) {
      particles.push({
        kind: 'main',
        x: Math.random() * W, y: Math.random() * H,
        vx: 0, vy: 0,
        seed: Math.random() * 1000,
        zap: 0, zapDir: 0,
        depth: Math.random(),
        history: [],
        historyLimit: CONFIG.mainHistory * 2,
        phase: 0,
      });
    }
    for (let i = 0; i < CONFIG.whisperCount; i++) {
      particles.push({
        kind: 'whisper',
        x: Math.random() * W, y: Math.random() * H,
        vx: 0, vy: 0,
        seed: Math.random() * 1000,
        zap: 0, zapDir: 0,
        depth: Math.random(),
        history: [],
        historyLimit: CONFIG.whisperHistory * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  const cellSize = 70;
  let cols, rows, grid;
  function initGrid() {
    cols = Math.ceil(W / cellSize) + 1;
    rows = Math.ceil(H / cellSize) + 1;
  }
  function rebuildGrid() {
    grid = new Array(cols * rows);
    for (let i = 0; i < grid.length; i++) grid[i] = null;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const cx = Math.floor(p.x / cellSize);
      const cy = Math.floor(p.y / cellSize);
      if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) continue;
      const idx = cy * cols + cx;
      if (!grid[idx]) grid[idx] = [];
      grid[idx].push(i);
    }
  }
  function forEachNeighbor(p, radius, cb) {
    const cx = Math.floor(p.x / cellSize);
    const cy = Math.floor(p.y / cellSize);
    const r = Math.ceil(radius / cellSize);
    const r2 = radius * radius;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const cell = grid[ny * cols + nx];
        if (!cell) continue;
        for (const idx of cell) {
          const n = particles[idx];
          if (n === p) continue;
          const ddx = n.x - p.x, ddy = n.y - p.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < r2) cb(n, d2, ddx, ddy);
        }
      }
    }
  }

  function fishForce(p, t) {
    let ax = 0, ay = 0;
    let count = 0, avgVx = 0, avgVy = 0, avgX = 0, avgY = 0;
    let sepX = 0, sepY = 0;
    forEachNeighbor(p, 75, (n, d2, ddx, ddy) => {
      count++;
      avgVx += n.vx; avgVy += n.vy;
      avgX += n.x; avgY += n.y;
      if (d2 < 900 && d2 > 0) {
        const inv = 1 / d2;
        sepX -= ddx * inv; sepY -= ddy * inv;
      }
    });
    if (count > 0) {
      avgVx /= count; avgVy /= count;
      avgX /= count; avgY /= count;
      ax += (avgVx - p.vx) * 0.05;
      ay += (avgVy - p.vy) * 0.05;
      ax += (avgX - p.x) * 0.0004;
      ay += (avgY - p.y) * 0.0004;
      ax += sepX * 55; ay += sepY * 55;
    }
    const nt = t * 0.00008;
    const c = curl(p.x * 0.0012, p.y * 0.0012, nt);
    ax += c.x * 0.45; ay += c.y * 0.45;
    const dx = CX - p.x, dy = CY - p.y;
    const d = Math.hypot(dx, dy);
    const boundary = Math.min(W, H) * 0.38;
    if (d > boundary) {
      const pull = (d - boundary) * 0.0015;
      ax += (dx / d) * pull;
      ay += (dy / d) * pull;
    }
    return { x: ax, y: ay };
  }

  function snowForce(p, t) {
    const dx = p.x - CX, dy = p.y - CY;
    const d = Math.hypot(dx, dy) + 0.01;
    const speed = 0.16 + p.depth * 0.3;
    let ax = (dx / d) * speed;
    let ay = (dy / d) * speed + 0.025;
    const nt = t * 0.00018;
    const c = curl(p.x * 0.0025, p.y * 0.0025, nt);
    ax += c.x * 0.13; ay += c.y * 0.13;
    return { x: ax, y: ay };
  }

  function waterForce(p, t) {
    const bottomZone = H * 0.68;
    let ax = 0, ay = 0;
    if (p.y < bottomZone) {
      ay = 0.26;
      const nt = t * 0.00025;
      const c = curl(p.x * 0.003, p.y * 0.0025, nt);
      ax = c.x * 0.4; ay += c.y * 0.08;
    } else {
      const waveT = t * 0.0012;
      ax = Math.sin(p.y * 0.035 + waveT + p.seed * 0.01) * 0.6;
      ay = Math.cos(p.x * 0.012 + waveT) * 0.22;
      if (p.y > H - 40) ay -= 0.3;
    }
    return { x: ax, y: ay };
  }

  function electricForce(p, t) {
    const s = p.seed;
    let ax = Math.sin(t * 0.002 + s * 17) * 0.22
           + Math.sin(t * 0.004 + s * 29) * 0.1;
    let ay = Math.cos(t * 0.0019 + s * 23) * 0.22
           + Math.sin(t * 0.0036 + s * 31) * 0.1;
    if (p.zap > 0) {
      p.zap--;
      ax += Math.cos(p.zapDir) * 0.85;
      ay += Math.sin(p.zapDir) * 0.85;
    } else if (Math.random() < 0.0014) {
      p.zap = 7;
      p.zapDir = Math.random() * Math.PI * 2;
    }
    return { x: ax, y: ay };
  }

  function cursorForce(p) {
    if (!cursorActive) return { x: 0, y: 0 };
    const dx = p.x - cursorX;
    const dy = p.y - cursorY;
    const d = Math.hypot(dx, dy);

    const inner = CONFIG.cursorInner;
    const outer = CONFIG.cursorRadius;

    if (d >= outer) return { x: 0, y: 0 };
    if (d < 0.01) return { x: 1.5, y: 0 };

    const nx = dx / d;
    const ny = dy / d;
    const tx = -ny;
    const ty = nx;

    const vRadial = p.vx * nx + p.vy * ny;
    const vTangent = p.vx * tx + p.vy * ty;

    let fx = 0, fy = 0;

    if (d < inner) {
      const overshoot = (inner - d) / inner;
      const hardPush = 1.2 + overshoot * 2.0;
      fx += nx * hardPush;
      fy += ny * hardPush;
      if (vRadial < 0) {
        fx -= vRadial * nx * 1.5;
        fy -= vRadial * ny * 1.5;
      }
      return { x: fx, y: fy };
    }

    const t = 1 - (d - inner) / (outer - inner);
    const strength = t * t;

    if (vRadial < 0) {
      const tangSign = vTangent >= 0 ? 1 : -1;
      const redirectForce = -vRadial * strength * 1.1;
      fx += nx * redirectForce;
      fy += ny * redirectForce;
      fx += tx * redirectForce * tangSign;
      fy += ty * redirectForce * tangSign;
    }

    const outPush = strength * CONFIG.cursorStrength * 0.3;
    fx += nx * outPush;
    fy += ny * outPush;

    return { x: fx, y: fy };
  }

  const forces = [fishForce, snowForce, waterForce, electricForce];
  const phaseKey = ['fish', 'snow', 'water', 'electric'];

  function phaseInfo(t) {
    const total = CONFIG.phaseDuration + CONFIG.transitionDuration;
    const cycle = total * 4;
    const ct = ((t % cycle) + cycle) % cycle;
    const idx = Math.floor(ct / total);
    const within = ct % total;
    if (within < CONFIG.phaseDuration) {
      return { current: idx, next: idx, transition: 0 };
    }
    const tr = (within - CONFIG.phaseDuration) / CONFIG.transitionDuration;
    return { current: idx, next: (idx + 1) % 4, transition: tr };
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function respawnForPhase(p, key) {
    if (key === 'snow') {
      p.x = CX + (Math.random() - 0.5) * 30;
      p.y = CY + (Math.random() - 0.5) * 30;
      p.vx = 0; p.vy = 0;
      p.depth = Math.random();
    } else if (key === 'water') {
      p.x = Math.random() * W;
      p.y = -10 - Math.random() * 40;
      p.vx = 0; p.vy = 0;
    } else {
      p.x = Math.random() * W;
      p.y = Math.random() * H;
      p.vx = 0; p.vy = 0;
    }
  }

  function drawGlow(x, y, size, alpha) {
    ctx.globalAlpha = alpha;
    ctx.drawImage(glowSprite, x - size, y - size, size * 2, size * 2);
  }

  function draw(t) {
    const speedFactor = CONFIG.speed;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = CONFIG.backgroundColor;
    ctx.fillRect(0, 0, W, H);

    rebuildGrid();
    const info = phaseInfo(t);
    const curKey = phaseKey[info.current];
    const nextKey = phaseKey[info.next];
    const ease = easeInOut(info.transition);
    const blending = info.transition > 0;
    const f1 = forces[info.current];
    const f2 = forces[info.next];

    for (const p of particles) {
      let fx, fy;
      if (blending) {
        const a = f1(p, t);
        const b = f2(p, t);
        fx = a.x * (1 - ease) + b.x * ease;
        fy = a.y * (1 - ease) + b.y * ease;
      } else {
        const a = f1(p, t);
        fx = a.x; fy = a.y;
      }

      const cf = cursorForce(p);
      fx += cf.x;
      fy += cf.y;

      p.vx = p.vx * CONFIG.damping + fx;
      p.vy = p.vy * CONFIG.damping + fy;
      const sp = Math.hypot(p.vx, p.vy);
      if (sp > CONFIG.maxSpeed) {
        p.vx = (p.vx / sp) * CONFIG.maxSpeed;
        p.vy = (p.vy / sp) * CONFIG.maxSpeed;
      }
      p.x += p.vx * speedFactor;
      p.y += p.vy * speedFactor;

      const activeKey = ease < 0.5 ? curKey : nextKey;
      let cleared = false;
      if (activeKey === 'water') {
        if (p.y > H + 12) { respawnForPhase(p, activeKey); cleared = true; }
      } else if (activeKey === 'snow') {
        if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) {
          respawnForPhase(p, activeKey);
          cleared = true;
        }
      } else {
        if (p.x < -20) { p.x = W + 20; cleared = true; }
        else if (p.x > W + 20) { p.x = -20; cleared = true; }
        if (p.y < -20) { p.y = H + 20; cleared = true; }
        else if (p.y > H + 20) { p.y = -20; cleared = true; }
      }
      if (cleared) p.history.length = 0;

      p.history.push(p.x, p.y);
      if (p.history.length > p.historyLimit) {
        p.history.splice(0, 2);
      }
    }

    const freq = (Math.PI * 2) / CONFIG.whisperCyclePeriod;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineWidth = CONFIG.whisperWidth;
    for (const p of particles) {
      if (p.kind !== 'whisper') continue;
      const envRaw = Math.sin(t * freq + p.phase);
      const env = envRaw > 0 ? Math.pow(envRaw, 1.6) : 0;
      if (env < 0.02) continue;

      let lineA = CONFIG.whisperMaxAlpha * env;

      if (curKey === 'snow' || nextKey === 'snow') {
        const dd = Math.hypot(p.x - CX, p.y - CY);
        const maxD = Math.hypot(CX, CY);
        const td = Math.min(1, dd / maxD);
        const snowAmt = curKey === 'snow' ? (nextKey === 'snow' ? 1 : 1 - ease) : ease;
        const depthFactor = 0.3 + td;
        lineA *= (1 - snowAmt) + depthFactor * snowAmt;
      }

      if (p.history.length >= 4) {
        ctx.strokeStyle = `rgba(${LC[0]}, ${LC[1]}, ${LC[2]}, ${lineA})`;
        ctx.beginPath();
        ctx.moveTo(p.history[0], p.history[1]);
        for (let i = 2; i < p.history.length; i += 2) {
          ctx.lineTo(p.history[i], p.history[i + 1]);
        }
        ctx.stroke();
      }
    }

    ctx.lineWidth = CONFIG.mainWidth;
    for (const p of particles) {
      if (p.kind !== 'main') continue;

      let lineA = CONFIG.mainAlpha;

      if (curKey === 'snow' || nextKey === 'snow') {
        const dd = Math.hypot(p.x - CX, p.y - CY);
        const maxD = Math.hypot(CX, CY);
        const td = Math.min(1, dd / maxD);
        const snowAmt = curKey === 'snow' ? (nextKey === 'snow' ? 1 : 1 - ease) : ease;
        const depthAlpha = 0.15 + td * 0.75;
        lineA = lineA * (1 - snowAmt) + depthAlpha * 0.55 * snowAmt;
      }

      if (p.history.length >= 4) {
        ctx.strokeStyle = `rgba(${LC[0]}, ${LC[1]}, ${LC[2]}, ${lineA})`;
        ctx.beginPath();
        ctx.moveTo(p.history[0], p.history[1]);
        for (let i = 2; i < p.history.length; i += 2) {
          ctx.lineTo(p.history[i], p.history[i + 1]);
        }
        ctx.stroke();
      }
    }

    ctx.globalCompositeOperation = 'lighter';

    for (const p of particles) {
      if (p.kind !== 'whisper') continue;
      const envRaw = Math.sin(t * freq + p.phase);
      const env = envRaw > 0 ? Math.pow(envRaw, 1.6) : 0;
      if (env < 0.04) continue;
      const dotA = CONFIG.whisperDotMaxAlpha * env;
      drawGlow(p.x, p.y, CONFIG.whisperDotSize, dotA);
    }

    for (const p of particles) {
      if (p.kind !== 'main') continue;

      let dotA = CONFIG.mainDotAlpha;
      let dotS = CONFIG.mainDotSize;

      if (curKey === 'snow' || nextKey === 'snow') {
        const dd = Math.hypot(p.x - CX, p.y - CY);
        const maxD = Math.hypot(CX, CY);
        const td = Math.min(1, dd / maxD);
        const snowAmt = curKey === 'snow' ? (nextKey === 'snow' ? 1 : 1 - ease) : ease;
        const depthAlpha = 0.2 + td * 0.8;
        const depthSize = 1.5 + td * 4.5;
        dotA = dotA * (1 - snowAmt) + depthAlpha * snowAmt;
        dotS = dotS * (1 - snowAmt) + depthSize * snowAmt;
      }

      drawGlow(p.x, p.y, dotS, dotA);
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  resize();
  initGrid();
  seedParticles();
  window.addEventListener('resize', () => {
    resize();
    initGrid();
  });

  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorActive = true;
  });

  document.addEventListener('mouseleave', () => {
    cursorActive = false;
  });

  if (prefersReducedMotion) {
    ctx.fillStyle = CONFIG.backgroundColor;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (const p of particles) {
      if (p.kind !== 'main') continue;
      drawGlow(p.x, p.y, CONFIG.mainDotSize, CONFIG.mainDotAlpha);
    }
    ctx.globalCompositeOperation = 'source-over';
  } else {
    let simTime = 0;
    let lastReal = 0;
    function loop(now) {
      if (lastReal === 0) lastReal = now;
      const realDelta = Math.min(50, now - lastReal);
      lastReal = now;
      simTime += realDelta * CONFIG.speed;
      draw(simTime);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }
})();
</script>

</body>
</html>
```

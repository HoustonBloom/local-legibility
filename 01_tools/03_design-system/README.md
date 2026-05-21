---
type: instructions
subject: design-system
for: [human, ai]
visibility: local
---
# Design System

Shared visual tokens consumed by lenses, atmospheres, and shared components. Fonts, colors, spacing, shadows, motion.

Every style-source in this folder is one coherent brand or aesthetic. A cut config picks one via its `style-source:` frontmatter field. A lens reads the tokens and applies them as CSS custom properties in the output HTML.

---

## What's in this folder

| File | What it defines |
|---|---|
| [[default-tokens]] | Warm-cream editorial. Plus Jakarta Sans + Space Grotesk + Aldrich + JetBrains Mono. Sage / butter / blush palette with neo-brutalist offset shadows. The starter style source the example lens templates use. |

Add new style-sources as needed. Keep each self-contained: a reader should understand the full token set from one file.

---

## How tokens flow into artifacts

```
Cut config              → names a style-source via `style-source:`
         ↓
Style-source file       → defines fonts, colors, spacing, patterns
         ↓
Lens rendering          → emits CSS custom properties in output HTML
         ↓
Atmosphere (optional)   → pulls colors from tokens for its background
```

A cut config can override any token inline in its `## Visual Direction` section. The style-source provides defaults, not constraints.

---

## Authoring a new style-source

1. Copy `default-tokens.md` as a starting point.
2. **Palette.** Base colors, text-on-bg variants, accent colors, at least 4 tint/shade stops per hue.
3. **Typography.** Font stacks for body, display, retro/accent, mono. Include Google Fonts `@import` lines if using web fonts.
4. **Spacing scale** and any repeated visual patterns (border-radius, shadow offsets).
5. **Pre-validated text-color variants** so a lens can pick one that meets WCAG AA contrast against a given background.
6. **Test** with an existing lens render to confirm tokens feel coherent together.

---

## Amplification register

A style-source defines visual vocabulary. The design-system workflow applies it at a configurable intensity:

- `light`: tokens applied, no ornamentation beyond what the lens strictly requires.
- `medium` (default): tokens + standard ornamentation. Offset shadows on cards, eyebrow labels on sections, accent underlines on key headings.
- `high`: full visual treatment. Inline SVG motifs, illustrative callouts, atmospheric flourishes where the lens permits.

Pass `amplification:` in the cut config frontmatter to override the default. This is the knob you reach for instead of stacking lenses to force more visual richness.

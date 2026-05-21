---
type: instructions
subject: atmospheres
for: [human, ai]
visibility: local
---
# Atmospheres

*A category in the system for pre-composed ambient background expression.*

> **Every atmosphere is a background cover.** Atmospheres sit at the base layer of an artifact, beneath all other content. Text, UI, components, lenses, and layouts always compose on top of them at higher z-index. An atmosphere is not a container for content. Content sits above it, never inside it.

This document defines what an atmosphere is, where it sits relative to the other kinds of things in the system, and how to author a new one. For a specific atmosphere's implementation and configuration, see its own spec file (the first in the library is [[Field]]). For the step-by-step authoring workflow, see [[ADDING-AN-ATMOSPHERE]].

---

## What this category is

An **atmosphere** is a self-contained ambient background layer for an artifact. It provides the felt quality of the space without contributing to meaning or function directly.

Examples of what an atmosphere might be:

- A particle field that flows behind text.
- A slow gradient wash that shifts hue across the viewport.
- An organic background that bloom-pulses with a slow rhythm.
- A grain-textured dark backdrop with very subtle motion.
- A still, high-contrast color field with no motion at all.

Each of these is composed of many smaller parts working together (color, timing, density, motion physics, texture) but reads as one cohesive thing when applied. Atmospheres are authored once, placed in the library, and then selected and tuned per artifact.

---

## The background cover rule

Every atmosphere follows the same integration contract. This is the rule that makes atmospheres slot cleanly into any artifact regardless of what the artifact contains.

```
  ┌─────────────────────────────────────────────────┐
  │ z-index: 5+    Interactive UI (inputs, modals)  │
  │ z-index: 3+    Content & layout (text, cards)   │
  │ z-index: 2+    Lenses (display treatments)      │
  │ z-index: 1     Glass veil (optional softener)   │
  │ z-index: 0     Atmosphere (background cover)    │
  └─────────────────────────────────────────────────┘
```

- The atmosphere occupies `z-index: 0` and fills the viewport (`position: fixed; inset: 0`).
- Its container has `pointer-events: none` so mouse events pass through to content above.
- The atmosphere listens globally on `window` for any interaction it needs (like cursor response), so interaction works regardless of what sits on top.
- An optional "glass veil" at `z-index: 1` softens the atmosphere slightly to keep text readable.
- All other content (lenses, components, layouts, text) stacks on top at `z-index: 2` or higher.

An AI implementing an atmosphere never has to think about what's on top. It just places the atmosphere at the bottom and lets the rest of the artifact stack naturally above.

---

## Where atmospheres sit in the system

| Category | Purpose | What it does |
|---|---|---|
| **Tokens** | Atomic design values | Holds a single value like a color or spacing unit. |
| **Atmospheres** | **Ambient background layer** | **Sets the felt quality of the space.** |
| **Components** | Functional UI units | Does a job. A button, a form, a chart. |
| **Lenses** | Interpretive / display modes | Transforms data or conversation into a way of seeing. |
| **Layout** | Spatial organization | Defines how things sit relative to each other. |
| **Design system** | Rules and constraints | Governs how everything above should behave together. |

An atmosphere is composed (like components and lenses) but non-functional. It does not accept input, does not produce output, does not interpret data. It is environmental. You do not use an atmosphere to do a thing. You use an atmosphere to be somewhere specific.

---

## Why this category needs to exist

Before atmospheres had a name, the ambient background layer was getting smuggled into other categories. A particle background would sit inside a layout file. A gradient wash would end up embedded in a component's stylesheet. A slow hue shift would be pasted into a design system as an afterthought. None of these placements fit, because none of those categories are about the felt quality of the surrounding space.

Giving this layer its own name does three things. It makes the system legible to anyone reading it. It lets the ambient layer be reusable across artifacts without being tied to a specific layout or component. And it creates a clean interface for tokens to flow through, for components and lenses to sit on top of, and for the designer to select one and swap it without rewriting anything else.

"This artifact uses the Field atmosphere" is now a sentence that communicates something precise. "Swap to Liquid for the next section" is now a coherent directive.

---

## Defining properties

All atmospheres share these properties. If a candidate is missing one, it probably belongs in a different category.

- **Background cover.** Sits at `z-index: 0` (or bottom of its parent stacking context), fills the space, and lets everything else compose on top.
- **Ambient, not focal.** Never competes for direct attention.
- **Environmental.** Affects the whole viewport or region, not a specific element.
- **Expressive.** Has a recognizable character, mood, or identity. You can name the feeling it produces.
- **Composed.** Made of many parts working as one. A single color value is a token; a single motion curve is a timing function; neither alone is an atmosphere.
- **Pre-composed and authored.** Each atmosphere is designed deliberately, saved to the library, and used as a unit. You don't assemble an atmosphere from atomic design tokens at use-site.
- **Configurable, not rewritable.** Has a small set of knobs (typically colors, speed, density, intensity) that let it be tuned for a specific context without changing its essential character.
- **Swappable.** Can be replaced with another atmosphere without affecting anything else in the artifact.
- **Content-agnostic and layout-agnostic.** Does not know or care what sits on top. Works with any layout, any set of lenses, any components.
- **Non-functional.** Does not accept user input that changes artifact state or produces output. Interaction (like cursor response) is an expressive quality, not a functional behavior.

---

## How atmospheres compose with other system elements

**Tokens flow into atmospheres.** Every atmosphere has a small configuration surface (`CONFIG`). Colors, speed defaults, and other tunable values can be pulled from the design system's tokens so the atmosphere stays consistent with the rest of the palette.

**Lenses sit on top of atmospheres.** A lens is a way of displaying or interpreting something. An atmosphere is the background beneath that display. They operate on different axes and don't conflict. A Sentiment lens and a Field atmosphere occupy the same artifact without stepping on each other because the lens lives at `z-index: 3+` while the atmosphere lives at `z-index: 0`.

**Components sit on top of atmospheres.** UI components, content, and interactive elements sit at `z-index: 3+`. The atmosphere doesn't know they exist.

**Layouts structure the space that sits on top of an atmosphere.** Layout defines the boxes that organize content. Atmosphere fills the space beneath those boxes. An atmosphere never has a layout; layouts never include an atmosphere in their definition.

**Design system constrains which atmospheres are available.** A design system for a serious publication might permit only the Field and Dust atmospheres. A playful product might permit Bloom and Ember.

---

## How to use an atmosphere

Applying an atmosphere to an artifact is a four-step process. An AI can execute this without improvisation.

1. **Select** one from the library based on context (mood, content type, brand).
2. **Place** its three markup elements (canvas container, glass veil, script) at the start of `<body>`. Nothing nests inside the atmosphere; it's a sibling of everything else.
3. **Tune** the `CONFIG` knobs to match the specific context. Colors to match the brand, speed to match the pacing, density to match the content weight.
4. **Stack** all other content on top at `z-index: 2+` with `position: relative` (or higher-positioning scheme) so z-index applies.

Each atmosphere's spec describes its own integration and configuration in detail.

### Scoping an atmosphere to a section (not the full viewport)

The default atmosphere contract is viewport-scoped (`position: fixed; inset: 0`). When an atmosphere is scoped to a specific section instead (e.g., behind a card grid only, not the whole page), the integration has a failure mode that keeps recurring. Fix it once, at the point of integration, by following this rule:

**The atmosphere must fill the section edge-to-edge. The section must not carry any horizontal or vertical padding. Padding lives on an inner wrapper.**

```
┌─ .grid-section ───────────────────────────────┐  ← padding: 0
│ ┌─ .field-bg  (z:0, sticky, inset:0) ───────┐ │     overflow: hidden
│ │ canvas                                    │ │     border-radius
│ └───────────────────────────────────────────┘ │     background (dark base)
│ ┌─ .field-veil (z:1)                        ┐ │     isolation: isolate
│ └───────────────────────────────────────────┘ │
│ ┌─ .grid (z:2)                              ┐ │  ← padding lives HERE
│ │ cards                                     │ │
│ └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

Why this matters: with `* { box-sizing: border-box }` set globally, a sticky atmosphere child with `width: 100%` resolves to the *content box* of its parent. If the section has horizontal padding, the atmosphere sits inside that padding and the section's base color bleeds through on the left and right edges. The fix is to put padding on an inner wrapper and keep the section itself at `padding: 0`.

Checklist for section-scoped atmospheres:

- [ ] Outer section: `position: relative`, `overflow: hidden`, `padding: 0`, `isolation: isolate`, a solid background color, border-radius if desired.
- [ ] Atmosphere layer (canvas/veil): `position: sticky` or `absolute`, `top: 0; left: 0; right: 0`, `width: 100%`, low z-index.
- [ ] Inner content wrapper: carries all the padding. Sits at higher z-index.
- [ ] Avoid `mix-blend-mode: screen` on atmosphere canvases when the parent has `overflow: hidden` + `border-radius`. It produces a visible seam at the clipped edges. Use normal compositing with reduced opacity instead.
- [ ] **Match the canvas BG to the section BG.** Most canvas atmospheres trail-fade by filling the canvas with `rgba(BG, 0.08)` each frame. If the canvas script's `BG = [r, g, b]` constant does not match the section's CSS `background-color`, the canvas slowly washes toward the wrong color and the atmosphere reads as broken. When re-coloring a section, update BOTH the section's CSS background AND the canvas script's BG constant together. Also recolor the line/particle color for contrast against the new base.
- [ ] Test at multiple widths. The bug is often invisible at desktop and obvious at narrow widths where the padding-to-content ratio is larger.

---

## How to author a new atmosphere

See [[ADDING-AN-ATMOSPHERE]] for the full workflow. Summary:

A new atmosphere in the library has two artifacts:

1. **The implementation.** A working `.html` file that runs standalone and demonstrates the atmosphere in isolation over a blank background. Lives in `_examples/<name>.html`.
2. **The spec doc.** A `.md` file that describes the atmosphere for both humans and AIs. Lives in `01_tools/02_atmospheres/<Name>.md`.

The spec doc follows the structure in [[_template]]. Every atmosphere spec must have the same sections in the same order so the library stays legible.

Keep the human-facing sections readable top-to-bottom. Keep the AI-facing sections as numbered checklists.

---

## Naming and file conventions

**Category name:** Atmospheres (plural).

**Individual atmosphere name:** a short, evocative, one-word noun. Prefer terms from the natural world or physics. Good names: Field, Liquid, Bloom, Dust, Current, Ember, Drift, Weather, Grain, Pulse, Stillness. Avoid technical descriptors like "ParticleFlowBackground" or marketing flourishes like "SuperFlowUltra".

**Filenames:**

- Charter: `README.md` (this file)
- Spec doc: `<Name>.md` (Title Case, single word)
- Implementation: `_examples/<name>.html` (lowercase)
- Template: `_template.md`

**In prose:** "the Field atmosphere," "the Liquid atmosphere." When context is clear, just "Field" or "Liquid."

---

## File layout

```
01_tools/02_atmospheres/
├── README.md                   ← this charter
├── ADDING-AN-ATMOSPHERE.md      ← authoring workflow
├── _template.md      ← template scaffold
├── Field.md                     ← Field spec doc
└── _examples/
    └── field.html               ← Field reference implementation
```

---

## Current library

| Atmosphere | Character | Spec |
|---|---|---|
| **Field** | Particle flow through four phases (fish, snow, water, electric) with cursor flow-around deflection. Ethereal, contemplative, slow-breathing. | [[Field]] |

As new atmospheres are authored, they are added here. The table stays brief; each atmosphere's own spec holds the detail.

---

## Candidate future atmospheres

These are placeholders to think against, not commitments.

- **Liquid.** A slow, flowing gradient wash that moves like heavy water. Simple, calm, good for reading-focused artifacts.
- **Bloom.** Organic expanding shapes with a slow pulse. Good for celebratory or generative contexts.
- **Dust.** Settling particles with very subtle motion. Good for archival or reflective content.
- **Ember.** Warm glow with occasional spark points. Good for evening or intimate tonal register.
- **Stillness.** A still atmosphere with no motion, just a considered color field and texture. Good when any motion at all would be too much.
- **Weather.** An atmosphere that itself changes slowly over time (not just within a loop, but across hours or days). Good for long-running dashboards or living pages.

---

## Open questions

These are noted but not yet resolved.

- **How do atmospheres layer?** Can two atmospheres be active at once (a Dust overlay on top of a Field base)? Or is one-at-a-time the rule?
- **How do atmospheres transition?** When one atmosphere is swapped for another, is the transition authored (a crossfade) or instant?
- **Can atmospheres be conditional?** An atmosphere that switches character based on time of day, scroll position, or content state.
- **What's the performance contract?** Should every atmosphere guarantee 60fps on a 5-year-old laptop? Should there be a "light" variant of each atmosphere for lower-end devices?

These get answered as the library grows.

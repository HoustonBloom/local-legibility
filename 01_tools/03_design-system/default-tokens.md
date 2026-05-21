---
type: design-system
subject: default-tokens
for: [human, ai]
visibility: local
status: active
---
# Default Tokens

The starter style source the example lens templates use. Warm-cream editorial palette with Plus Jakarta Sans (display), Space Grotesk (body), Aldrich (retro / kicker), JetBrains Mono (data and code). Neo-brutalist offset shadows on cards.

Copy this file and rename it for your own brand. The lenses will pick up whatever you put in `style-source:` in the cut config.

---

## Color palette

```css
--ink: #1f1d1a;       /* primary text */
--ink-soft: #44403c;  /* body text */
--ink-faint: #6e6760; /* meta, footnote */

--paper: #faf6ee;       /* default background */
--paper-warm: #f5eede;  /* alt background */
--paper-deep: #ece1c7;  /* alt background */

--sage: #6fa67f;        /* primary accent */
--sage-deep: #1f5028;   /* sage emphasis */
--sage-soft: #dcebd7;   /* sage background */

--butter: #f5d88e;      /* highlight */
--butter-deep: #6b4613; /* highlight emphasis */
--butter-soft: #fbefc8; /* highlight background */

--blush: #f9a8b8;       /* secondary accent */
--blush-soft: #fcdee4;  /* blush background */
--blush-text: #7a2c3c;  /* blush text emphasis */

--rule: #e7dec9;        /* dividers */
```

Contrast pairs (validated WCAG AA):

| Background | Text token |
|---|---|
| paper, paper-warm, paper-deep | ink, ink-soft |
| sage-soft | ink, sage-deep |
| blush-soft | ink, blush-text |
| butter-soft | ink, butter-deep |
| ink (dark) | paper, butter (accents) |

---

## Typography

```css
--font-sans:    "Space Grotesk", system-ui, sans-serif;       /* body */
--font-display: "Plus Jakarta Sans", system-ui, sans-serif;   /* headings */
--font-retro:   "Aldrich", monospace;                          /* kickers, eyebrows */
--font-mono:    "JetBrains Mono", monospace;                  /* data, code, timer */
```

Google Fonts import:

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Aldrich&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Visual patterns

- **Offset shadows on cards:** `box-shadow: 4px 4px 0 var(--ink)`. Border `2px solid var(--ink)`, border-radius `12px`, background `#fffdf6` (slightly warmer than paper).
- **Kicker labels:** `font-family: var(--font-retro); font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase;`. Color tracks the section background.
- **Section dividers:** `border-top: 1px solid var(--rule)` between vertically-stacked sections.

---

## Authoring a new style-source

1. Copy this file. Rename to `<your-brand>.md` and set `subject: <your-brand>`.
2. Replace the palette, typography, and visual patterns.
3. Keep the contrast-pair table. Lenses read it to pick a text token that meets WCAG AA against a given background.
4. Test with a render before adopting.

A lens consumes a style-source by emitting its tokens as CSS custom properties in the output HTML. The token file is the canonical source; the rendered frame is a fork.

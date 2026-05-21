---
type: lens
name: storyboard-editorial
for: [human, ai]
visibility: local
status: pending
---

# Lens: storyboard-editorial

A rendering system that turns narrative use case content into editorial storyboard frames. Each frame carries one scene, one narrative, and one set of design principles, composed in a warm cream editorial aesthetic with hand-crafted SVG illustration. Frames can be rendered alone or stacked inside the storybook-carousel window chrome described below.

## What this lens does

Given a cut config and its tagged content files, this lens produces a self-contained HTML frame with the following structure, in order:

1. Eyebrow label (case number or section marker)
2. Serif italic title
3. Italic dek (tagline)
4. Full-width SVG scene illustration
5. Sans-serif caption with time/place specifics
6. Prose body (2–3 short paragraphs)
7. Principle chip row
8. Horizontal rule with eyebrow label "how the data moves"
9. Flow strip SVG (create → capture → store)
10. Right-aligned footer attribution

Four bracket corners mark the frame's edges. The whole composition sits on warm cream inside an outer deeper-cream page surface.

## When to use this lens

- Narrative use case storyboarding
- Walking a reader through a scene before explaining the system behind it
- Documents where illustration must carry emotional register, not just decoration
- Materials that will be shared externally (presentations, pitches, essays)
- Any content where the reader should feel the system working before reading a technical sentence

## When NOT to use this lens

- Technical documentation where illustration would be premature or misleading
- Content shorter than a single scene (brief notes, quick memos)
- Data-heavy content where charts would carry the meaning (use a chart lens)
- Content without a specific time, place, and person to ground the scene

## Required inputs

### Per frame (cut config)

The cut config must provide the following body sections. Missing sections either fall back to narrative defaults (if the cut references a narrative) or cause the lens to omit that element.

```yaml
---
type: cut
date: YYYY-MM-DD
project: [Project Name]
slug: YYYYMMDD_concept-descriptor
audience: [who this is for]
tone: [voice descriptors]
content-tag: [tag that selects vault files]
lens: storyboard-editorial
case-number: "01"                    # required; drives eyebrow and dropdown label
scene-accent: rose                   # required; see scene-accent palette below
principles: [Make harm legible, Start local]  # required; drives chip row
scene-hint: [brief composition cue]  # optional; guides illustration
output: 03_cuts/frames/YYYYMMDD_concept-descriptor.html
window: [window-slug]
tags: [cut, storyboard, ...]
visibility: local
last-updated: YYYY-MM-DD
---
```

Required body sections:

- **Title** (h1) — short phrase, sentence case
- **Dek** — one italic sentence expanding the title
- **Scene** — concrete moment: time, place, specific named people, one visible object or action. This drives the illustration and the caption.
- **Pain** — 2–3 sentences establishing the real-world problem with evidence (numbers, studies, data points preferred)
- **Footer note** — attribution line (e.g., "Relational Space · use case storyboards · v2")

### Per window (optional carousel grouping)

If multiple frames share a window, the window manifest lists them in display order:

```yaml
---
type: window
name: storybook-carousel
frames:
  - 20260419_case-01-morning-commons
  - 20260419_case-02-leftover-network
  - 20260419_case-03-food-forest
  # ... etc
---
```

## Output specification

A single standalone HTML file with:

- All CSS inline in `<style>` (no external stylesheets)
- All JavaScript inline in `<script>` (no external scripts)
- All SVG inline in the markup (no image file references)
- No fonts loaded from a server (system fonts only)
- No tracking, no analytics, no external fetches
- Renders correctly when opened offline
- Prints cleanly with all frames visible and page breaks between

This matches the "frozen intelligence packet" requirement from the Cuts README.

## Design tokens

All colors are hardcoded. This is a physical-color editorial scene; do not use CSS theme variables that could invert in dark mode. The cream palette should always display cream.

### Palette

| Token | Hex | Role |
|---|---|---|
| page-bg | `#E8DFCC` | Outer page surface behind frames |
| frame-bg | `#F2EBDD` | Cut frame background |
| frame-inner-bg | `#EDE4D2` | Scene SVG background, window panel inset |
| ground | `#D8CFBE` | Horizon / ground in exterior scenes |
| ink | `#2B1F1A` | Primary text and silhouettes |
| ink-soft | `#6B5D53` | Secondary text, weathered elements |
| ink-whisper | `#A89F8B` | Tertiary text, subtle dashed lines |
| divider | `#C9BFA8` | Rule lines and separators |
| brick | `#B94A3D` | Primary accent: eyebrows, bracket corners, chip borders, ledger lines |
| brick-deep | `#8C362C` | Chip text, deeper brick accents |
| window-lit | `#D4A574` | Amber for lit windows in exterior scenes |

### Scene-accent palette

Each case can carry a scene-specific accent drawn from this set. Use sparingly — one accent per scene, layered over the base palette.

| Name | Hex | Typical use |
|---|---|---|
| rose | `#D8A598` | Food, warmth, domestic interior objects |
| amber | `#D4A574` | Light sources, warm interior ambience |
| moss | `#6B8E5F` | Gardens, plants, organic life |
| moss-deep | `#5D7F56` | Trees, crop rows, shadow foliage |
| sage | `#8CA88F` | Distant foliage, muted green |
| terracotta | `#C48A7B` | Secondary warm accent, ceramics |
| storm | `#6B6E73` | Stormy sky cloud masses |
| storm-light | `#7E8087` | Secondary cloud layer |

### Typography

Two families. No webfonts.

- **Serif**: `Georgia, 'Times New Roman', serif` — used for title, dek, specific italicized data points inside scene SVGs (the 72% statistic in HOA case)
- **Sans**: `-apple-system, system-ui, 'Inter', sans-serif` — used for eyebrow, caption, body, chip, flow label, footer, and all SVG labels

Font-size scale (desktop → tablet → mobile):

| Element | Desktop | Tablet (≤720px) | Mobile (≤520px) | Narrow (≤380px) |
|---|---|---|---|---|
| Meta header | 12px | 11.5px | 11.5px | — |
| Eyebrow | 12px | 12px | 11.5px | 11.5px |
| Title | 32px | 28px | 24px | 22px |
| Dek | 16px | 15px | 14.5px | — |
| Body | 16.5px | 16px | 15.5px | — |
| Caption | 13.5px | 13.5px | 13px | — |
| Chip | 12.5px | 12.5px | 12px | — |
| Flow label | 12px | 12px | 11.5px | — |
| Footer | 11.5px | 11.5px | 11px | — |
| Dropdown | 15px | 15px | 14.5px | 13.5px |
| SVG scene chip text | 12px | — | — | — |
| SVG flow strip labels | 13px | — | — | — |

Line-height: 1.65 for body, 1.5 for caption, 1.4 for dek, 1.15 for title, 1.5 default.

Weights: 400 regular, 500 for eyebrow/flow-label/meta. No 600 or 700.

Letter spacing: eyebrows and flow labels use 0.22em; meta uses 0.22em; chips use 0.06–0.08em; dek/body use default.

### Spacing and radii

- Frame padding (desktop): `52px 56px 44px`
- Frame padding (tablet, ≤720px): `44px 34px 36px`
- Frame padding (mobile, ≤520px): `38px 22px 30px`
- Frame padding (narrow, ≤380px): `32px 18px 26px`
- Frame border-radius: `2px` (subtle, editorial)
- Chip border-radius: `16px` (pill)
- Arrow button radius: `50%` (circle)
- Dropdown radius: `22px` (pill)
- Section separators: `padding-top: 24px; border-top: 0.5px solid #C9BFA8`

### Borders and strokes

- Bracket corners: `1.5px solid #B94A3D`, 22px arm length, 14px inset from frame edge
- Chip border: `1px solid #B94A3D`
- Arrow button border: `1px solid #B94A3D`
- Dropdown border: `1px solid #B94A3D`
- SVG stroke weights: 1.3px for bracket motif, 1px for ledger arcs, 0.5–0.7px for hairline details, 2–3px for architectural elements (window frames, house outlines)

## Components

### Frame container

```html
<article class="pnl">
  <div class="cf">
    <div class="br tl"></div>
    <div class="br tr"></div>
    <div class="br bl"></div>
    <div class="br br2"></div>
    <!-- content -->
  </div>
</article>
```

The four `<div class="br ...">` elements are the bracket corners. Each is an absolutely-positioned 22×22 square with two borders forming the L-shape.

### Header block

```html
<div class="eye">Case 02 · Storyboard</div>
<h1 class="ttl">Neighborhood leftover network</h1>
<div class="dek">How a block learns to share what it has, one Pyrex at a time.</div>
```

Eyebrow is brick-colored, 0.22em letter-spacing, sentence case. Title is Georgia italic 32px, no title case. Dek is Georgia italic 16px, ink-soft color, sentence case.

### Scene SVG

```html
<svg class="scn" viewBox="0 0 680 380" role="img" aria-label="...">
  <!-- scene composition -->
</svg>
```

viewBox is always `0 0 680 380`. This matches the content width and gives 1.79:1 aspect ratio. Do not change the viewBox width — it allows text inside the SVG to render at the intended pixel size on desktop.

Place the principle chips as the last element in the SVG so they layer on top of the scene. See Scene composition section below for illustration guidance.

### Caption

```html
<div class="cap">Thursday, 7:15 PM · Katy cul-de-sac · two quarts of tortilla soup on the porch; Devi walks over at 8 with a Pyrex.</div>
```

Sans-serif italic 13.5px, ink-soft color. The caption carries specifics the illustration implies: time, location, named people, the concrete object that anchors the scene. Use the middle-dot `·` as separator between phrases.

### Body prose

```html
<div class="bod">
  <p>The United States wastes 30 to 40% of its food supply...</p>
  <p>The failure isn't scarcity. It's legibility.</p>
</div>
```

2–3 short paragraphs. First paragraph: establishes the pain with evidence. Final sentence: often a short declarative that names the failure mode in one beat. Body maxes at 560px width for reading rhythm.

### Principle chips

```html
<div class="cbar">
  <span class="chp">Design for sufficiency</span>
  <span class="chp">Start local</span>
</div>
```

Sans-serif 12.5px, brick border, brick-deep text, cream fill, pill shape. Sentence case, one chip per principle. These appear BOTH in the scene SVG (as overlay tags) and below the body text — the duplication is intentional; HTML chips are accessible at all sizes, SVG chips shrink on mobile.

### Flow strip

```html
<div class="sep">
  <div class="flb">How the data moves</div>
  <svg viewBox="0 0 680 90" style="width:100%;display:block" role="img" aria-label="Flow: create, capture, store.">
    <!-- three bracket-framed nodes with connecting lines -->
  </svg>
</div>
```

The flow strip is IDENTICAL across all frames. Copy the SVG verbatim from the reference implementation. Three bracket-framed nodes at x-positions ~112, ~340, ~568. Each node has:
- Four bracket-corner L-paths forming a 22×34 frame
- A distinguishing glyph inside (filled circle for create, three horizontal lines for capture, vault-box for store)
- Connecting hairlines with arrow endings between nodes

Below each node, a sans-serif 13px label in ink-soft: `create`, `capture`, `store`. Lowercase, letter-spacing 0.12em.

### Footer

```html
<div class="ft">Relational Space · use case storyboards · v2</div>
```

Sans-serif 11.5px, ink-whisper color, right-aligned. Use consistent attribution across all frames in the same window.

## Scene illustration composition

This is the creative-bearing element. The lens does not mechanize scene composition; it provides guidelines.

### General principles

- **Editorial flat illustration, not realistic photography.** Think Christoph Niemann, Tom Haugomat, Ryo Takemasa. Simplified forms, strong silhouettes, restrained palette.
- **No gradients.** Flat fills only. Layer opaque shapes for depth.
- **Silhouette-first.** Major masses in ink. Detail comes from color accents (lit windows, objects, subtle dashed lines) layered on top.
- **One scene-accent color per frame.** Pull from scene-accent palette. All other elements use the base palette.
- **Specific over generic.** A specific porch, a specific Pyrex, a specific cul-de-sac. Never a placeholder figure or anonymous space.
- **Time of day matters.** Dusk, morning, stormy afternoon — each has a palette signature (dusk: ambers glowing in dark; morning: pale warm sky; storm: storm-gray overwhelming cream).

### Composition types

Match the composition type to the narrative register:

| Composition type | When | Camera angle | Example |
|---|---|---|---|
| Exterior dusk | Intimate block-level moments | Street level, slight 3/4 | Leftover Network |
| Interior morning | Quiet first-person scenes | Through a window or at a desk | Morning Commons |
| Aerial | Coordination across households | Top-down or high-oblique | Food Forest |
| Interior warm | Workspace, social commerce | Ground level, scene depth | Coworking Matching |
| Civic diagram | Async deliberation, grids | Flat / schematic | HOA Assembly |
| Stage scene | Public-facing performance | Facing the stage | Speaker Rewards |
| Exterior stormy | Crisis preparation | Street level, low horizon | Hurricane Prep |

### Overlay chips

Principle chips inside the SVG should:
- Float in negative space (sky for exteriors, above furniture for interiors)
- Use `rect` with `rx=13` (pill shape) filled cream with brick stroke
- Center the `text` with `text-anchor="middle"`, `fill="#8C362C"`, sans font
- Rise in priority order: top chip = most load-bearing principle
- Stack vertically with 4–6px gap if more than one

### Ledger arc (optional)

Many scenes carry a dashed brick-colored arc representing the data flow between elements. Use when the connection is structurally meaningful (Leftover Network's window-to-window arc; Hurricane Prep's across-block curve).

```svg
<path d="M 215 262 Q 315 150 440 256"
  stroke="#B94A3D" stroke-width="1.3"
  fill="none" stroke-dasharray="3,4" opacity="0.65"/>
<circle cx="215" cy="262" r="2.5" fill="#B94A3D" opacity="0.75"/>
<circle cx="440" cy="256" r="2.5" fill="#B94A3D" opacity="0.75"/>
```

Two anchor points, a quadratic curve between them, dashed 3,4, opacity 0.65. Small filled circles at the endpoints.

## Window chrome: storybook-carousel

When multiple frames share a window, wrap them with the storybook-carousel navigation. Key properties:

### Structure

```html
<body>
  <div class="wrap">
    <div class="meta">Project · subtitle · version · date</div>
    <div id="pnls">
      <!-- all <article class="pnl"> panels -->
    </div>
  </div>
  <nav class="navbar" aria-label="Storyboard navigation">
    <div class="navinner">
      <div class="dots" id="dots" role="tablist"></div>
      <div class="ctrls">
        <button class="narr" id="prev">[left chevron]</button>
        <select class="nsel" id="sel"><!-- options --></select>
        <button class="narr" id="nxt">[right chevron]</button>
      </div>
    </div>
  </nav>
  <script><!-- carousel logic --></script>
</body>
```

### Nav behavior

- Fixed at bottom of viewport, full-width
- Backdrop filter `saturate(1.4) blur(20px)` with 94% opacity cream fill
- Top hairline border, subtle upward box-shadow
- Inner content max-width 720px, centered
- iOS safe-area padding via `env(safe-area-inset-bottom)`

### Dots row

- Centered above the controls row inside the nav
- 7×7 cream circles, brick when active, 1.15 scale on active
- Clickable to jump to that story

### Controls row

- Left arrow button (44×44, circular, brick border, disabled at first story)
- Dropdown select with all story titles (flex: 1, max 340px, Georgia italic)
- Right arrow button (matching, disabled at last story)

### Keyboard

- Left/right arrow keys navigate (ignored when focus is in select)
- All nav elements keyboard-accessible with visible focus rings

### Script behavior

```javascript
// Simplified outline
show(i) {
  // mark panel i visible, others hidden
  // update dot active state
  // sync dropdown value
  // toggle arrow disabled states
  // smooth-scroll to top
}
```

The body needs `padding-bottom: 130px` (desktop) to 148px (mobile) so the last panel doesn't get hidden under the fixed nav.

## Responsive behavior

Three breakpoints; everything scales.

### Desktop (> 720px)
- Full type scale
- Frame padding `52px 56px 44px`
- Bracket corner arm 22px

### Tablet (≤ 720px)
- Body padding reduces to `24px 14px 140px`
- Frame padding `44px 34px 36px`
- Title 28px, body 16px

### Mobile (≤ 520px)
- Body padding `20px 12px 148px`
- Frame padding `38px 22px 30px`
- Bracket corner arm 18px
- Title 24px, body 15.5px
- All SVG text becomes effectively smaller due to viewBox scaling — this is accepted, with HTML elements below carrying full accessible info
- Touch targets remain ≥ 44×44

### Narrow mobile (≤ 380px)
- Frame padding `32px 18px 26px`
- Title 22px
- Dropdown compressed to 13.5px font

## Print behavior

```css
@media print {
  body { background: #F2EBDD; padding: 0; font-size: 11pt; }
  .navbar, .meta { display: none !important; }
  .pnl, .pnl.hidden { display: block !important; page-break-after: always; margin-bottom: 0; }
  .cf { box-shadow: none; page-break-inside: avoid; }
}
```

Printed output:
- All frames visible (no carousel state)
- Page break between each frame
- Nav and meta strip hidden
- Box shadow removed from frames

## Accessibility

- `<h2 class="sr-only">` at top of document with one-sentence summary
- Every SVG has `role="img"` with `aria-label` describing the scene
- All interactive elements have accessible names (aria-label on buttons, on select)
- Dot row has `role="tablist"`, each dot has `role="tab"` and `aria-label`
- Focus rings visible on all keyboard-focusable elements (arrow buttons, dropdown, dots)
- `:focus-visible` used so mouse focus doesn't show rings but keyboard focus does
- Color contrast: ink on cream passes WCAG AA at body size; brick-deep on cream passes at 12px+

## Priority hierarchy

When rendering, resolve each section per the Cuts README hierarchy:

1. **Cut config body** (highest) — if the cut has a Voice, Structure, Emphasis, etc. section, use it
2. **Narrative file** (middle) — inherited defaults if `narrative:` referenced and cut lacks the section
3. **Lens defaults** (lowest) — fall back to this lens's defaults as specified below

### Lens-level defaults

**Voice (if not overridden):** Scene-first, then architecture. Open in a specific moment with a specific person. Name the architecture by what it does, not in the abstract. Present tense. Sentence case. Terse. No em dashes unless absolutely necessary. No AI-isms. Treat the reader as intelligent and impatient.

**Structure (if not overridden):** Eyebrow → Title → Dek → Scene SVG → Caption → Body (pain first, declarative second) → Chips → Separator → Flow label → Flow strip → Footer. Fixed order.

**Emphasis (if not overridden):** Evidence numbers in the pain paragraph. Specific named people in the scene and caption. Principle chips visible in every scene.

**De-emphasis (if not overridden):** Abstract explanation before the scene is shown. Meta-commentary. Stock photography or emoji as visual stand-ins. ALL-CAPS typography. Title Case headings.

**Visual direction (if not overridden):** Warm cream palette. Editorial SVG illustration. Bracket corner motif. Print-friendly.

## Quality bar

A frame rendered with this lens passes if:

- [ ] A reader who skims only the scene panel and caption gets what the case is about
- [ ] The principle chips are legible at every breakpoint (HTML chips, at minimum)
- [ ] The scene illustration has one distinctive detail that distinguishes it from the other cases in the window
- [ ] The pain paragraph carries at least one verifiable evidence point (a number, a study, a documented event)
- [ ] The scene caption names a specific time and place
- [ ] The file opens cleanly offline with no console errors
- [ ] Keyboard-only users can navigate the full window
- [ ] Printing produces one page per frame

## Template / starting point

When a reference implementation exists in your `03_cuts/`, To add a new frame to an existing window:

1. Copy one existing `<article class="pnl">...</article>` block
2. Replace the content: eyebrow number, title, dek, scene SVG, caption, body, chips, footer
3. Add the matching `<option>` to the dropdown
4. The JS auto-wires new panels; no other changes needed

To start a new window:

1. Copy the full v2 file as a scaffold
2. Clear all `<article>` blocks
3. Update the meta header
4. Update the `<title>` and `<meta name="description">`
5. Add panels one at a time

## Known limitations

- **Scene SVG text shrinks on narrow mobile.** SVG text inherits the viewBox scale, so 12px in a 680-viewBox rendered at 350px becomes effectively 6px. The HTML chips below the scene carry the accessible version, so nothing critical is lost, but the in-scene chips become decorative. Consider hiding them via CSS media query if they become visually cluttered.
- **Scene illustration quality varies by case.** Some compositions are harder to execute in SVG than others (the HOA grid is easier than the hurricane sky). Accept composition-appropriate complexity.
- **The flow strip is identical across all frames.** This is intentional for visual consistency but may feel repetitive when reading the whole window. If it becomes an issue, consider making it a page-level element at the end rather than per-frame.

## Related

- A principle library (e.g. your own design principles) supplies the chip vocabulary

## Open questions

- **Should this be two lenses or one?** The per-frame rendering (storyboard-editorial) and the window chrome (storybook-carousel) are designed together but can be used independently. Worth splitting into two related specs once a second window uses the carousel chrome with different frame content.
- **Narrative preset.** Consider pulling the voice/structure defaults into a dedicated narrative file (`00_cultivate-local-intelligence/Local Brain/01_tools/04_workflows/_narratives/editorial-storyboard-narrative.md`) so cuts can inherit without the lens spec having to carry the voice guidance.
- **Scene composition skill.** The scene illustration section describes patterns but doesn't mechanize them. A follow-up "scene-composer" skill could take a scene description and emit SVG directly, which would let cuts specify only narrative content and leave illustration to the skill.
- **Per-case accent consistency.** Currently each case picks its own scene-accent; across a window, this works because seven different moods are appropriate. In a window with a tighter theme, consistency might matter more — worth defining a window-level palette override.

## Session tools and skills used

| Tool / skill | Used for | Verdict |
|---|---|---|
| `visualize:read_me` (art, mockup modules) | Loaded design constraints before building the v2 widget and standalone artifact | Useful — gave hardcoded-color permission for physical-color scenes |
| `visualize:show_widget` | Prototyped the carousel in chat before committing to standalone HTML | Useful — let the user react to the visual direction before file creation |
| `create_file` + `present_files` | Producing v1, v2, and this lens spec | Useful |
| `obsidian-markdown` skill | Available but not loaded in this session | Not loaded — frontmatter and wikilink conventions carried from context. Lens spec is vault-destined; worth verifying conventions against the skill on next session. |
| `frontend-design` skill | Available but not loaded | Not loaded — applied design instinct plus visualize constraints. May have missed some conventions that the skill encodes. |
| `brainstorming` skill | Available but not loaded | Not loaded — iteration was user-driven ("love it", "at the bottom", "make this .md"). Skill not needed. |
| `memory_user_edits` | Not used this session | N/A |

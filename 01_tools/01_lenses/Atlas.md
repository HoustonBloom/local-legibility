---
type: source-doc
category: lens
name: atlas
version: v0.1.1
for: [human, ai]
visibility: local
status: draft
last-updated: 2026-05-16
---

# Lens: Atlas

*A spatial relational map: nodes and edges revealing who-holds-what across an ecosystem, plus a trainer roster that lights up each holder's caught set.*

---

## What this lens does

Atlas renders a connected-graph view of an ecosystem (entities, people, concepts, values) with a trainer-roster sidebar. Two reading surfaces:

1. **Front-page exploratory map.** Paper-warm theme. Full ecosystem visible at once. Nodes colored by type, sized by importance, with strong vs loose ties drawn as solid vs dashed edges. Pan, pinch-zoom, scroll-wheel zoom, tap-to-focus on any node, double-tap-to-reset. No trainer overlay; this is the unbiased view.

2. **Trainer-focused overlay (full-screen).** Deep-dark theme. Tap a trainer card and the same map repaints in that trainer's lens color, with the nodes they hold lit up and everything else dimmed. Inventory drawer below the map shows their caught roster as scrollable cards. Tap any node (on the map or in the drawer) and the map zooms in, highlights neighbors, and shows a tooltip with the strategic read.

People render as head-and-shoulders glyphs. Entities, concepts, and values render as dots. Confidence states (caught, spotted, rumored, unverified) carry visually distinct ring overlays. The map answers the strategic question: *if this person leaves the room, what falls out of the ecosystem?*

## When to use this lens

- Mapping an ecosystem an organization is positioned within
- ICP and market research where the network shape is itself the finding
- Lexicon mapping (terms as nodes, sources as trainers, who-caught-what)
- Member-tool inventories where coverage and ownership matter
- Sales account maps where personal bridges between orgs carry the deal
- Any "who holds the relationship" or "where are our weak ties" question

## When NOT to use this lens

- Linear narrative content. Use [[Explainer]].
- A single decision-ask aimed at one person. Use [[Pitch]].
- Vault-wide internal state (projects, log, queue). Use [[Observatory]].
- One-item-at-a-time stumble browsing. Use [[Share]].
- An audience deck. Use [[Reel]].
- A polished company-facing site. Use [[Product Website]] or [[Company Website]].

Atlas overlaps Observatory's Map layer conceptually but operates on a fundamentally different input: Atlas takes a curated ecosystem of external entities and relationships; Observatory takes the vault itself. When lens composition is formalized, Observatory's Map layer may compose with Atlas rather than reinvent it.

## Required inputs

### From the cut config

Standard cut-config frontmatter applies. Atlas-specific fields:

| Field | Required | What it controls |
|---|---|---|
| `data` | yes | Path to the data JSON file, or "inline" if the data block is embedded in the cut body |
| `palette` | no | Override for cluster zone colors; map of cluster-id to hex |
| `viewbox` | no | SVG viewBox dimensions. Default `1000 1000` |
| `accent` | no | Accent color for front-map focus state. Default `#d4793d` |
| `default-trainer-color` | no | Lens color used when no per-trainer color set. Default `#e8a05b` |

### From the tagged content (data shape)

The data file (JSON or inline JSON in the cut body) must conform to this shape:

```json
{
  "trainers": [
    {
      "id": "string-slug",
      "name": "Display Name",
      "role": "one-line role description",
      "color": "#hex (the lens color for this trainer's overlay)",
      "accent": "leaf | sparkle | lines | ring | flower | bloom | triangle",
      "summary": "one to two sentences describing what this trainer holds in the ecosystem",
      "section": "primary | secondary (groups in the roster, e.g. core team vs ecosystem bridges)"
    }
  ],
  "nodes": [
    {
      "id": "string-slug",
      "label": "Display Label",
      "x": 0,
      "y": 0,
      "r": 3,
      "contributors": ["trainer-id", "..."],
      "type": "domain-specific tag (e.g. concept | research | governance | person | unknown | fragment)",
      "critter": "circle | stage | shield | twin | block | wave | sprout | web | flower | bloom | ring | sparkle | leaf | starry | prism | orbit | gear | tiny",
      "state": "caught | spotted | rumored | unverified",
      "strategic": "optional one-line strategic read shown in tooltip"
    }
  ],
  "edges": [
    ["node-id-a", "node-id-b", "strong | loose"]
  ],
  "clusters": [
    {
      "id": "string",
      "label": "deliberative democracy",
      "cx": 0, "cy": 0, "rx": 0, "ry": 0,
      "fill": "#hex"
    }
  ]
}
```

**Field notes:**
- `x` and `y` are in the SVG viewBox coordinate system (default 0 to 1000 on each axis).
- `r` is the node radius. People still receive `r`; the glyph scales to `r * 1.5`.
- `contributors` drives the lit-up behavior in the trainer-focused view. A node with an empty contributors array is rendered but never lit up.
- `state` is optional. When present on a node, a ring overlay with that state's color/dash pattern appears around the node. States are: solid green (caught), solid orange (spotted), dashed purple (rumored), dashed red (unverified).
- Edge tuples carry a third element for tie strength: `strong` (solid) or `loose` (dashed). Solid = formalized, confirmed, action-ready. Dashed = speculative, indirect, ex-affiliation, or unconfirmed.
- `clusters` are optional background ellipses with text labels. They render at low opacity behind the nodes.

The data file lives at the path given by the cut config's `data` field, typically alongside the cut config in `Cuts/frames/`. For inline data, embed a fenced `json` block under a `## Data` heading in the cut body.

## Output contract

- Single self-contained HTML file. No external runtime dependencies except Google Fonts (Fraunces, Newsreader).
- File size envelope: 30 to 80 KB depending on data volume.
- Mobile-first. Viewport meta with `maximum-scale=1` to prevent accidental zoom; in-map pinch zoom is handled by the lens.
- Responsive trainer-card grid: 2 columns on narrow viewports, 3 at 560px+, 4 at 820px+.
- Accessibility: real `<button>` elements, ARIA labels on every interactive element, `prefers-reduced-motion` respected (animation disabled), tooltips readable by screen readers.
- Browser support: modern evergreen (Chrome, Safari, Firefox, Edge, mobile Safari, Chrome Android).
- Vault writing rules apply to all rendered text. No em dashes anywhere on the surface. No invented numbers in tooltips.

## Named elements (for partial updates)

An Atlas frame is composed of seven addressable elements. Each is fenced in the source HTML with `<!-- ATLAS SECTION: <name> -->` markers. An agent asked to "update the map" must only modify the relevant data subsection inside `atlas-data` and must not touch anything else.

| Element | What it is | What an agent edits to change it |
|---|---|---|
| `atlas-data` | The single `<script id="atlas-data">` block holding `trainers`, `nodes`, `edges`, `clusters` | Only this block, surgically per subkey |
| `header` | Page title, eyebrow, subtitle, counter | HTML inside the header markers |
| `front-map` | Exploratory map of the whole ecosystem (paper-warm theme) | Nothing here directly; map is data-driven |
| `trainer-roster` | Core team + ecosystem bridges grid | Nothing here directly; roster is data-driven |
| `footer-note` | Attribution and version line | HTML inside the footer-note markers |
| `trainer-detail` | Full-screen overlay when a trainer is tapped | Nothing here directly; overlay is rendered from data |
| `render-engine` | The `<script>` that draws everything | Only when changing lens behavior, never for content changes |

**Partial-update protocol (must follow when handed an Atlas frame):**

- **"Update the map" or "change the network":** Modify only `nodes`, `edges`, and `clusters` inside `atlas-data`. Do not touch `trainers`. Do not touch any HTML section. Do not touch the render-engine script.
- **"Update the trainer roster":** Modify only `trainers` inside `atlas-data`. Do not touch `nodes`, `edges`, or `clusters`.
- **"Update the header copy" or "change the title":** Modify only HTML inside the `ATLAS SECTION: header` markers.
- **"Update the footer":** Modify only HTML inside the `ATLAS SECTION: footer-note` markers.
- **"Change visual style" or "modify the rendering":** Modify only the `<style>` block in the head, and only the named CSS classes documented in the Token consumption section below.

Before editing, an agent should read the `<!-- ATLAS LENS · ELEMENT MAP -->` comment block at the top of the body. It enumerates the partial-update rules verbatim.

## Visual structure

Top-to-bottom on the front page:

1. **Header.** Eyebrow (small italic uppercase), display title in Fraunces, italic subtitle, optional pulse-dot counter.
2. **Front-map card.** Paper-warm rounded card with cluster-zone background tints, edges, nodes, labels, optional cluster labels. Floating tooltip top-left (or top-right on wide viewports). Floating reset button (see Reset buttons under Interaction model). Card height: `clamp(420px, 64vh, 640px)`.
3. **Legend strip.** Inline swatches showing: solid line = formalized tie, dashed line = loose / speculative, dot = entity or concept, person glyph = person.
4. **Trainer roster.** Grouped by `section` field. Section labels in italic uppercase. Card grid below each label, with bobbing humanoid SVG avatars per trainer.
5. **Footer note.** Small italic gray, italicizing the metaphor.

Trainer-focused overlay (full-screen, slides in on tap):

1. **Sticky header.** Back button, small humanoid avatar, trainer name, trainer role.
2. **Map (top half).** Deep-dark theme, lit nodes in trainer's color, dimmed nodes faded. Floating reset button top-right (see Reset buttons under Interaction model).
3. **Inventory drawer (bottom half).** Sorted: entities first, concepts second, people third. Each item is a critter SVG plus name plus state pill.

## Interaction model

**Pan and zoom (both maps):**
- Drag (mouse or touch) to pan
- Mouse wheel zooms around cursor
- Pinch (two fingers) zooms around pinch midpoint
- Double-click or double-tap resets view
- Movement threshold of 5px so small jiggles still register as taps

**Focus:**
- Tap any node on the front map → camera zooms to node, neighbors highlight in accent color, tooltip appears, reset button visible
- Tap any node on the trainer-overlay map → same behavior using the trainer's lens color
- Tap an inventory-drawer item → focuses the corresponding map node and scrolls the item into view

**Trainer roster:**
- Tap a trainer card → opens the full-screen overlay
- Back button or Escape closes the overlay

**Reset buttons (one per map, always visible):**

Each map carries its own dedicated reset button as an explicit affordance alongside the double-tap gesture. The double-tap reset is a power-user shortcut; the button is the discoverable, accessible path for anyone who hasn't read the hint text.

- **Front map button.** Element id `front-reset-btn`, class `.front-reset-btn`. Positioned top-right on mobile, top-left on viewports ≥720px (so it doesn't collide with the tooltip, which pins top-right on wide viewports). Label: "reset view".
- **Trainer-overlay button.** Element id `reset-btn`, class `.reset-btn`. Positioned top-right. Label: "reset view".
- **Default state (no node focused).** Muted styling: low-opacity text and border that reads as ambient rather than actionable. The button is present and clickable but visually quiet so it never competes with the map content.
- **Focused state (a node is selected).** The render engine adds the `.visible` class to the button, which raises the color and border to the accent color (front map) or `--lens-color` (trainer overlay). This is the cue that there's now something *to* reset.
- **Hover state.** Same color treatment as focused, so the button previews its actionable state on mouse-over even when no node is selected.
- **Click behavior.** Resets BOTH focus AND pan/zoom in a single action. Clears `focusedNodeId`, drops the `.focusing` class on the inner group, removes the tooltip, removes the `.visible` class on the button, snaps map transform back to identity (scale 1, translate 0). On the trainer overlay, also resets the inventory carousel position and progress dots.
- **Why two buttons, not one shared component.** The theming differs (paper-warm vs deep-dark) and the activation color differs (accent vs per-trainer lens color). Keeping them separate keeps each map's styling self-contained.

**Reduced motion:** All bob animations and pulse dots disabled. Pan/zoom transitions become instant. Focus animations become 0ms transitions.

## Token consumption

**Fonts (must be loaded):**
- `Fraunces` (display, with variable opsz and SOFT axes)
- `Newsreader` (body, with variable opsz)

**Color tokens (CSS custom properties):**
- `--bg-warm`, `--bg-warm-2`: paper-warm background for the front page
- `--bg-deep`, `--bg-deep-2`: deep-dark background for the trainer overlay
- `--ink`, `--ink-soft`, `--ink-faint`: text on warm
- `--accent`: orange focus highlight on front map
- `--lens-color`: per-trainer overlay color, set inline at runtime

**State colors (not exposed as variables; hardcoded for visual consistency across instances):**
- Caught: `#7a9268` (sage)
- Spotted: `#d4793d` (terracotta)
- Rumored: `#b496d0` (lavender, dashed)
- Unverified: `#c95040` (red, finely dashed)

**Type colors (exposed as the `frontTypeColors` JS object; safe to override per cut):**
- `concept: #a89684`, `deliberation: #9aa9c4`, `civic-tech: #c4a880`, `research: #b496d0`, `governance: #8db09c`, `regen: #7a9268`, `person: #c8b88c`, `unknown: #a89684`, `fragment: #bfae99`. Add a domain-specific type (e.g. `org: #d4793d`) when your atlas needs one.

**Reset button CSS classes (load-bearing, do not rename):**
- `.front-reset-btn` plus id `#front-reset-btn`: the front-map reset button. Glows in `var(--accent)` when `.visible` is added.
- `.reset-btn` plus id `#reset-btn`: the trainer-overlay reset button. Glows in `var(--lens-color)` (falls back to `#e8a05b`) when `.visible` is added.
- `.visible`: the focused-state modifier the render engine adds when a node is selected. Removed on `resetFocus()`, on Escape, on back-button click, on map-background click.

**Safe to override per cut:** per-trainer color, type colors, cluster zone colors, accent.
**Not safe to override:** the paper-warm vs deep-dark theme split between front-map and trainer-overlay (the contrast carries meaning: exploratory vs focused), and the reset-button class names and id selectors (the render engine looks them up by name).

## Reference implementation

The first version of this lens shipped as part of an ecosystem-mapping project. A neutral sample render will land in a follow-up release; until then, see the Lenses tab in `Getting Started.html` for the visual grammar.

## Notes on edge cases

- **Nodes with empty `contributors: []`.** Render normally but never light up under any trainer. Useful for "no one holds this yet" markers (unverified entities, unfiled leads).
- **Disconnected nodes.** Nodes with no edges appear at their x/y position with no lines. Useful for explicit gaps in the ecosystem (e.g., an outside actor floating at the far edge with the unverified ring).
- **Long labels.** SVG `paint-order: stroke` plus a white text stroke keeps labels legible against any fill. Labels show only for nodes with `r >= 6` by default; people always show labels.
- **Single-trainer atlases.** Still renders the front map as exploratory; the trainer overlay becomes the only focused view. Roster section can be hidden via CSS if desired.
- **Empty clusters array.** Cluster zone tints and labels are simply skipped. The map renders fine without them.
- **Mobile portrait.** Cluster zone labels shrink, drawer max-height adjusts via `vh`. Pan/zoom works the same as desktop.
- **Nodes outside the default 0-1000 viewBox.** Will render but get clipped. Either expand the `viewbox` cut config field or relocate the nodes inside the default range.

## Version history

- **v0.1.1** (2026-05-16): Documentation-only update. Reset buttons promoted from a passing mention to a first-class subsection under Interaction model. Added the two-button architecture (front + trainer overlay), default-muted vs `.visible`-glow state model, click-resets-both-focus-and-pan/zoom behavior, and load-bearing CSS class names (`.front-reset-btn`, `.reset-btn`, `.visible`) to the Token consumption section.
- **v0.1.0** (2026-05-15): Initial draft. Lens shipped as part of an ecosystem-mapping project.

## Remaining integration surfaces (TODO before full ship)

Per [[ADDING-A-LENS]], a fully-integrated lens lands in five places. v0.1.0 has only the first two:

- [x] Spec doc: this file
- [x] Reference implementation: `_examples/example-atlas.html`
- [ ] Build script registry: add `EXAMPLE_ATLAS` entry to `00_overview/build-window-frames.mjs`
- [ ] Lens catalog card: add `<section class="lens">` to `00_overview/lens-catalog.html` with a hand-drawn SVG thumbnail showing the network-graph shape, plus a placeholder `<script type="text/html" id="example-atlas">{{EXAMPLE_ATLAS}}</script>`
- [ ] Skill registration: add Atlas + one-paragraph description to `04_workflows/cut-packet/SKILL.md` under "Currently shipped lens types"
- [ ] Rebuild packet window: `node 00_overview/build-window-frames.mjs`
- [ ] Verifier: `node 00_overview/verify-window-frames.mjs` passes
- [ ] Kit README lens count updated
- [ ] Gallery rebuilt: `cd Cuts && node build-gallery-index.mjs`

## Connections

- [[Observatory]]: the closest existing lens. Observatory's Map layer hints at a Network Graph pattern; Atlas IS that pattern. When lens composition is formalized, Observatory may compose with Atlas rather than reimplementing.
- [[../00_overview/CUTS-SPEC|Cuts spec]]: defines the cut-config-to-frame pipeline Atlas plugs into.
- [[../00_overview/ADDING-COMPONENTS|Adding a component]]: shared lens authoring workflow.
- [[ADDING-A-LENS]]: lens-specific integration surfaces.

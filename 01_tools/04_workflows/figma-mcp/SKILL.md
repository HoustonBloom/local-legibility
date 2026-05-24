---
name: figma-mcp
description: Load this skill before any Figma MCP call (use_figma, get_design_context, search_design_system, get_screenshot, etc.). Captures API traps learned in production, the user's design-system conventions, and the working patterns that keep Figma builds fast and 1:1 with source. Fires automatically on any Figma MCP tool use and when the user mentions Figma, design tokens, prototype reactions, or design system libraries.
---

# Figma MCP : Working With the user's Design System

Persistent working memory for any agent writing to Figma via the MCP server. Captures what works, what breaks, and what the user actually wants.

## When this skill fires

Any time the agent is about to:

- Call `use_figma`, `get_design_context`, `search_design_system`, `get_screenshot`, `get_metadata`, `use_figma`, `generate_diagram`, or any other Figma MCP tool
- Build, modify, or inspect anything in a Figma file
- Translate an HTML / CSS source into Figma
- Set up design tokens, text styles, component variants, or prototype reactions

Load it before the tool call, not after.

## Pre-flight checklist

Before the first `use_figma` call in any session:

1. **Inspect before creating.** Dump the target file's page list, existing variable collections, and node structure. Different runs see different state. Names get renamed (frames turn into "Frame 1"), positions shift, cards multiply. Match what is there, do not assume.
2. **Confirm fonts.** Call `figma.listAvailableFontsAsync()` and check every family you plan to use. Font family AND style names are case + space sensitive.
3. **Grep the type file before novel APIs.** For anything you have not used before (reactions, variable modes, component variants, effects), grep `plugin-api-standalone.d.ts` in the figma-use skill folder for the relevant symbol. Three API rejections in a row cost more time than one grep.
4. **Have the library handy.** Load the user's variable collections and text styles up front:
   ```js
   const colls = await figma.variables.getLocalVariableCollectionsAsync();
   const styles = await figma.getLocalTextStylesAsync();
   ```
   Bind variables via `figma.variables.setBoundVariableForPaint(paint, "color", v)`. Apply text styles via `await node.setTextStyleIdAsync(styleId)`.

## Known API traps (production-observed)

These traps are not documented prominently. Each one costs a script round-trip.

### Reactions / prototyping

| Trap | Fix |
|---|---|
| `reactions[].action: {...}` singular is rejected | Use `reactions[].actions: [{...}]` plural array |
| `deprecatedVersion` field on `MOUSE_ENTER` / `MOUSE_LEAVE` triggers is rejected | Omit it. Trigger is just `{ type: "MOUSE_ENTER", delay: 0 }` |
| `overlayRelativePosition` in action is rejected unless destination `overlayPositionType === "MANUAL"` | Either set the frame to MANUAL and position yourself, or omit `overlayRelativePosition` and let Figma center |
| `overlayPositionType` is read-only from plugin API | User must set this in the Prototype panel manually |
| `overlayBackground` is read-only from plugin API | User sets backdrop dim manually |
| `overlayBackgroundInteraction` is read-only from plugin API | User sets click-outside-to-close manually |

When these manual steps are required, tell the user explicitly which sidebar panel to use.

### Node mutation

| Trap | Fix |
|---|---|
| `figma.notify()` throws "not implemented" | Never call it. Use `return` for output |
| `setPluginData` / `getPluginData` not supported | Use `setSharedPluginData` / `getSharedPluginData`, or track relationships in a plain JS array within the script |
| `console.log()` is not returned to the agent | Use `return` for everything you need to see |
| Fills / strokes are read-only arrays | Reassign with a new array: `node.fills = node.fills.map(...)` |
| `setBoundVariableForPaint` returns a NEW paint | Must capture and reassign |
| `layoutSizingHorizontal = "FILL"` before `appendChild` throws | Append first, then set sizing |
| `resize()` resets sizing modes to FIXED | Call resize before `layoutSizingHorizontal/Vertical` |
| `figma.currentPage = page` does NOT work | Use `await figma.setCurrentPageAsync(page)` |
| Colors use 0 to 1, not 0 to 255 | Divide hex channels by 255 |
| Paint `color` takes `{r,g,b}` only; opacity is a paint-level field | `{ type: "SOLID", color: {r,g,b}, opacity: 0.5 }`, not `{color: {r,g,b,a: 0.5}}` |

### Font name quirks

Style names differ across families. Always verify.

| Family | Semi-bold style name | Extra-bold style name |
|---|---|---|
| Inter | `Semi Bold` (space) | `Extra Bold` (space) |
| Plus Jakarta Sans | `SemiBold` (no space) | `ExtraBold` (no space) |
| JetBrains Mono | N/A | `ExtraBold` (no space) |
| DM Serif Display | N/A | N/A (only Regular + Italic) |

If a `loadFontAsync` call fails, call `listAvailableFontsAsync()` and filter by family to see the exact style strings available.

## the user's design system

Her files usually have two coexisting palettes.

### Cuts · Gallery (warm editorial)

Used by every cut rendered through the publishing pipeline.

- Neutrals: `cream` `#ece5d6`, `cream-2` `#e3dccb`, `cream-3` `#d8d1bf`
- Ink scale: `ink` `#1a1a1a`, `ink-soft` `#4a4439`, `ink-softer` `#6a6357`
- Rust family: `rust` `#8b2a1a`, `rust-soft` `#a8412e`, `rust-wash` (rust at 8% alpha)
- Green: `green` `#2d5a3f`, `green-paper` `#e8f0eb`
- Butter: `butter` `#f3d88b`, `butter-wash` `#f7ecc7`
- Edges (stroke-only): `edge` (ink 10%), `edge-soft` (ink 6%)

### Portfolio (neutral + pastel)

Used on `[your-website-folder]`.

- Neutrals: `ink` `#09090b`, `paper` `#fafafa`, `paper-dark` `#f4f4f5`
- Warm scale: `warm-100` through `warm-700`. **`warm-400` is decorative only, never text (fails WCAG AA everywhere).** `warm-500` only on paper.
- Pastel pairs (hero + light): `lavender` / `sage` / `sky` / `butter` / `blush`

### Two collisions worth naming

- `butter` exists in both palettes with slightly different hex (`#f3d88b` vs `#f5d88e`). Call out which you are using.
- `ink` differs too (`#1a1a1a` Cuts vs `#09090b` Portfolio).

### Typography stack (seven families)

Used across both systems.

- `01 Display Serif` : DM Serif Display (editorial display, Cuts covers)
- `02 Display Sans` : Plus Jakarta Sans (workhorse display + UI)
- `03 UI Sans` : Inter (Gallery card UI, sans body on cards)
- `04 Body Sans` : Space Grotesk (Portfolio body)
- `05 Retro` : Aldrich (retro accent, Z820 stats)
- `06 Mono` : JetBrains Mono (code, meta, slugs, counters, eyebrows)
- `07 Script` : Caveat (handwritten sign-offs)

Her text styles follow the numbered naming pattern. Always apply them via `setTextStyleIdAsync`, not raw `fontName` + `fontSize`.

## Working patterns that work

### 1. Incremental writes, not monoliths

Split any build into logical units. One call creates variables. The next creates components. The next composes layouts. The next binds styles. Each call returns IDs for the next to consume. One `use_figma` script per step. This is the single biggest predictor of success.

### 2. Always return affected node IDs

Every script that creates or mutates must end with:

```js
return { createdNodeIds: {...}, mutatedNodeIds: [...] };
```

Subsequent calls reference by ID. You cannot see what `console.log` wrote.

### 3. Screenshot after milestones

Structural checks go to `get_metadata`. Visual checks go to `get_screenshot`. Use both. Do not build on an unverified foundation.

### 4. Find nodes by name or structure, not hardcoded IDs across sessions

the user renames and moves things. Between sessions, `"Card / favorite / ..."` might exist but `"Meta row"` might have been renamed to `"Frame"` by a copy-paste. Search by structural predicate (FRAME with 2 TEXT children separated by ` · `) when names are unreliable.

### 5. Track decorations in JS arrays, not plugin data

For floating nodes (ribbons, corner stars, overlays that need to attach to a parent after layout resolves), collect `{ node, owner, kind }` in a plain JS array within the script. Position them after the layout engine has settled using `absoluteBoundingBox`. `setPluginData` is not available.

### 6. Prefer `layoutPositioning = "ABSOLUTE"` for floating decorations

Instead of making decorations siblings of the card and positioning them on the page, reparent them INTO the card (auto-layout parent) and set `child.layoutPositioning = "ABSOLUTE"`. They become part of the card's subtree so screenshots of the card include them, and moving the card moves its decorations.

### 7. Bind, do not hardcode

If a color appears in the user's variable collection, bind the paint to the variable. If a size matches a text style, apply the text style. Propagation beats repetition.

## the user's preferences

### 1:1 fidelity with source matters

When translating a CSS source (a rendered HTML frame) into Figma, match the **real render function**, not an idealized version. Read the rendering JS, not just the CSS. Do not fabricate elements that are not present.

Example failure mode: adding a "meta row" with audience + lens + date to a card when the real render function only emits title + slug + tags + timestamp. She will call this out.

### Flag deltas explicitly

When something differs from source (a hex value rounded, a placeholder where a real value is not yet known, an API limitation preventing 1:1), call it out at the end of the response. Do not silently approximate.

### Writing voice (applies to content authored as or for her)

From `_/Writing Rules.md`:

- No em dashes. Ever. Use periods or colons instead.
- No filler intensifiers (very, quite, really, actually, truly)
- No hedging
- No AI-isms (delve, tapestry, nuanced, multifaceted, landscape, paradigm shift)
- No exclamation marks unless quoting
- Voice: confident, direct, between academic and conversational
- Short sentences for impact. Fragments are deliberate.

This applies to anything written FOR her (cuts, essays, docs). Chat responses are looser but still benefit from the discipline.

### She iterates visually and moves things

Between your script runs, expect:

- Renamed frames (custom names replaced by `Frame`, `Frame 1`, etc.)
- Cards duplicated into variants
- Pages added (`Icons`, `Style Guide`, `HANDOFF`, `COMPONENTS`)
- Mockups moved between pages

Always query the current structure before mutating. Use descriptive predicates, not old IDs.

### Offer next-step options

At the end of a task, give her a short list of plausible next moves. Two to four options. Lets her pick direction without writing a new prompt from scratch.

## Common Figma MCP workflows

### Building a card library from an HTML source

1. Read the HTML source (CSS + rendering function) and identify the atomic elements
2. Inspect the target Figma file (pages, existing variables, fonts)
3. Build one canonical card variant with correct structure, bound to library variables + text styles
4. Verify visually with `get_screenshot`
5. Clone for state variants (favorite, pending-deprecate, window)
6. Combine with `combineAsVariants` into a component set if she wants interactive components
7. Offer next steps

### Creating a design system library

1. Create a variable collection for each distinct palette
2. For every variable, set explicit scopes based on usage (`TEXT_FILL`, `STROKE_COLOR`, etc.). **Never leave as `ALL_SCOPES`.**
3. Add descriptions that carry WCAG or usage rules
4. Create text styles in groups (`01 Display Serif / Hero 72`, etc.)
5. Remind her to publish the library from the Assets panel (`Libraries → Publish`)

### Building a prototype interaction

1. Create the destination states as separate frames (or as variants of a component)
2. Build the interactive element (card, button) with the MOUSE_ENTER / ON_CLICK reaction
3. For overlays, the destination frame's overlay properties (`overlayPositionType`, `overlayBackground`, `overlayBackgroundInteraction`) are read-only. Tell her to set them in the Prototype panel manually.
4. Set `figma.currentPage.flowStartingPoints = [{ nodeId, name }]` so Play mode opens at the right frame

### Handing off documentation

When she asks for handoff docs:

- A data surfacing table (field, variable, text style) works well
- Tag / chip state specimens rendered with real variable bindings help developers
- Include source line references (file:line) so developers can verify
- Flag gaps between mockup and source explicitly

## How the user works with this skill

the user (the user) does not invoke this skill manually. The skill's `description` field triggers Claude Code to auto-load it the moment an agent looks like it is about to use Figma MCP. That means:

- No slash command needed
- No "read this first" reminder from her
- The agent gets this context whether she mentions Figma or not, as long as she mentions a Figma file, a design token, a component, or the agent proactively reaches for `use_figma`

She can update the skill by editing this file directly. New lessons go under `Revision log` at the bottom.

## Revision log

### v1.1 : 2026-04-20 (extended session)

Additions from later in the same session:

- **Read the render function, not just the CSS.** When translating an HTML page into Figma, the CSS tells you what each class *looks* like but not which classes are actually emitted. Always find the JavaScript or template that builds the DOM and walk that. Fabricating elements that do not exist in the render output is the fastest way to miss 1:1.
- **When names get genericized between sessions, find by structure.** the user moves and copies things. "Meta row" frames can come back as "Frame", "Frame 1". Use structural predicates: FRAME with two direct TEXT children separated by ` · `, or FRAME with children that match a known pattern. Do not rely on names alone across sessions.
- **Workflow docs + Stop hook + skill = three layers of enforcement.** When establishing a new invariant, update (1) the workflow docs so humans + agents reading them see the step, (2) the skill that matches the triggering intent so context auto-loads, and (3) the Stop hook as a session-end backstop. One layer is fragile. Three is resilient.
- **The `update-config` skill handles Claude Code settings changes.** For hook edits, permission rules, environment variables : invoke it instead of editing settings.json directly. It walks the read → merge → edit → validate → prove-fires flow.

### v1.0 : 2026-04-20 (the user + Claude, session one)

Initial capture from first Figma MCP session. Covered:

- OAuth auth flow (Claude Code `/mcp` → browser approve)
- Building frame cards with real CSS-bound structure
- Style guide page with swatches + type specimens
- Converting swatches + specimens into actual Figma variables and text styles with explicit scopes
- Icon page with SVG imports for card-action + hero + control icons
- Handoff page with data-surfacing table and tag-state specimens
- Prototype: card hover reveals actions, info click overlays modal with real metadata

Production-observed traps added to Known API traps:

- `actions: [...]` plural vs `action:` singular
- `deprecatedVersion` field rejected on mouse triggers
- `overlayRelativePosition` / `overlayPositionType` / `overlayBackground` manual-set requirements
- `setPluginData` not supported

the user preferences captured: 1:1 fidelity, flag deltas, no em dashes, visual iteration, offer next steps.

---

*To add lessons from future sessions, append a new dated entry here. Keep the top of the skill stable so agents get consistent pre-flight behavior.*

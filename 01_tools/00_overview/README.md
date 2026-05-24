---
type: instructions
subject: overview
for: [human, ai]
visibility: local
---
# Overview

What the packet is, how it composes, what it needs from your folder, and how it builds.

For higher-level orientation, read the top-level [[../../README|Local Brain README]] first. This doc is the next layer down.

---

## The formula

**Content + Cut + Lens = Intelligence Packet**

- **Content** = files in your vault, tagged with a `visibility:` value that matches the cut's `content-tag:`.
- **Cut** = a config file (`_config.md`) that selects content, names the lens, points at an output path, and optionally names a contact to tune voice for.
- **Lens** = the rendering pattern (see [[../01_lenses/README|Lenses]]).
- **Intelligence Packet** = the resulting HTML frame. Self-contained, no build step to view, travels by email or DM.

Multiple frames can be bundled into a **window**: one HTML file with tabbed navigation. `Getting Started.html` is itself a window, built from source frames in `01_lenses/`.

Full spec: [[CUTS-SPEC]].

---

## The composition stack

Four layers, applied bottom-up, resolved per-section. Cut config body overrides everything above it.

```
Cut config body           (this output, this time)
         ↓
Contact profile overlay   (this audience, always; optional)
         ↓
Lens defaults             (this shape, always)
         ↓
Style-source tokens       (this brand, always)
         ↓
Atmosphere                (this mood, optional)
```

Voice is carried in two places: the lens (generic, by audience type) and the contact profile (specific, by individual reader). Nothing in between.

---

## What Local Brain needs from your folder

The [[ADAPTER-PROMPT]] maps the packet onto whatever structure you already have.

**Required:**
- Markdown files (`.md`) with optional YAML frontmatter.
- **Frontmatter is optional for cuts.** Most lenses work from filename, headings, and content alone.

- Top-level folders that group content by kind.
- A frontmatter `type:` field distinguishing kinds of content.
- A principles folder if you want the principles page to render.

**Optional:**
- A daily changelog file for timeline activity.
- A session-carryover file for current-work display.

---

## Setup

The fast path (Obsidian + Claude Code):

1. Install Obsidian. Open your folder as a vault.
2. Install Claude Code.
3. Drop this packet folder alongside your vault.
4. Open `Getting Started.html`. Read Welcome and Setup.
5. Copy the adapter prompt from the Get Started tab. Paste into Claude with: *"the packet lives at [path], my vault lives at [path]."*
6. Open the First Look audit Claude drops at `03_outbox/first-look.html`.
7. Produce your first frame. Say *"produce that first frame"* or copy a prompt from the audit.

For other stacks (Cursor, Claude Desktop, ChatGPT, Aider), the adapter prompt is agnostic.

---

## Design system

Pure CSS with custom properties. No framework. No build step to view a finished frame. Edit one token in a style-source, every frame using that source updates.

Style-sources live in `01_tools/03_design-system/`. The packet ships `default-tokens.md` as a reference. Copy and adapt.

Full details: [[../03_design-system/README|Design System]].

---

## Building the packet window

Rebuild `Getting Started.html` after editing source frames (`welcome.html`, `workflow.html`, `about.html`, `lens-catalog.html`):

```bash
node 01_tools/00_overview/build-window-frames.mjs
```

To bundle your own multi-frame output (e.g. for a Company Website cut), copy `build-window-frames.mjs` as a template, point it at your frames, and run it.

---

## Known coupling points (the adapter handles these)


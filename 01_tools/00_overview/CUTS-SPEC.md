---
type: spec
subject: cuts
for: [human, ai]
visibility: local
---
# Cuts

A **cut** is a curated selection of vault content, shaped by voice and rendered through a lens into an intelligence packet.

## The Formula

**Content + Cut + Frame = Intelligence Packet**

Multiple frames can be grouped into a **Window**: one HTML file with tabbed navigation.

Three concepts:

### Content (Inputs)
Your existing vault files. Project docs, research, feature specs. You tag them for a cut by adding the cut's `content-tag` to their `visibility` array. The content is not copied. The tag is a pointer. Same file can be tagged for multiple cuts.

### Cut (Config + Voice)
One file that defines:
- **What to pull in**: the `content-tag` that selects vault files
- **Who it is for**: `audience` field. If the audience is a specific contact, their profile's `Rendering Preferences` section is applied as an overlay.
- **How to talk**: Voice, Emphasis, De-emphasis, Visual Direction sections in the body
- **Where to output**: the `output` path for the generated frame HTML
- **Which windows**: `window` array listing which windows include this frame (e.g., `[system-explainer]`). A frame can belong to multiple windows.

The cut is self-contained. Voice direction lives in the body. If the cut targets a specific contact, their rendering preferences layer on top of the lens defaults as a contact overlay.

### Frame (Rendering System)
Like glasses frames that hold lenses. Contains the design system (tokens, components, patterns), lenses (ways of seeing and surfacing data), and structure (navigation and composition). A frame renders one cut into one view.

### Window (Multi-Frame Output)
One HTML file holding multiple frames with tabbed navigation. The window provides the chrome (title bar, frame tabs). Each frame owns its own content and sidebar. One URL, multiple views.

Current window: `_System Explainer.html`

### Intelligence Packet (Output)
A self-contained HTML page. All styles inline. No dependencies. A snapshot frozen at the moment of generation. Can be opened in a browser, emailed, or hosted anywhere.

## File Naming

**Convention:** `YYYYMMDD_concept-descriptor.ext`

Date first for sort order. Underscore separates date from concept. Hyphens within the concept/descriptor. Configs get `_config.md` suffix. Frames get `.html` extension. Config and frame share the same base name.

Examples:
- `20260331_data-sovereignty-audience-briefing_config.md` (cut config)
- `20260331_data-sovereignty-audience-briefing.html` (rendered frame)
- `20260331_security-channel-separation-paul_config.md`
- `20260331_system-design-cuts-explainer_config.md`
- `20260331_worklog-daily_config.md`

All configs and frames live in `03_cuts/frames/`.

## Cut Config Structure

### Frontmatter

```yaml
---
type: cut
date: YYYY-MM-DD
project: [Project Name]
slug: YYYYMMDD_concept-descriptor
audience: [who this is for]
tone: [voice descriptors]
content-tag: [tag that selects vault files]
lens: [rendering system to use]
output: 03_cuts/frames/YYYYMMDD_concept-descriptor.html
window: [window-slug]               # which windows include this frame (array)
tags: [cut, project-tag, topic-tags]
visibility: local
task: ""
last-updated: YYYY-MM-DD
---
```

### Body Sections

```markdown
# Title

## Inputs
Files with `[content-tag]` in their visibility array.
List them with wikilinks.

## Voice
How to speak. Not just tone. The relationship to the reader.
(Optional. Falls back to the lens defaults when absent.)

## Structure
How to organize the content. BLUF first, timeline-forward, walk-through, etc.
(Optional. Falls back to the lens defaults when absent.)

## Emphasis
What to lead with. What matters most.
(Optional. Falls back to the lens defaults when absent.)

## De-emphasis
What to minimize or omit.
(Optional. Falls back to the lens defaults when absent.)

## Visual Direction
Layout preferences, component choices, color, typography.
(Optional. Falls back to the lens defaults when absent.)
```

## How Content Gets Tagged

A file belongs to a cut when its `visibility` array contains the cut's `content-tag`:

```yaml
# In the content file's frontmatter:
visibility: [local, audience-data-boundaries]
```

This file is now included in the `audience-data-boundaries` cut. Adding the tag does not copy, move, or change the file. It makes the file visible to the cut system.

A file can be tagged for multiple cuts:
```yaml
visibility: [local, audience-data-boundaries, channel-separation-pi]
```

**Never strip content-tags from visibility arrays.** Removing a tag breaks the cut that depends on it.

## Folder Structure

```
03_cuts/
  README.md                                                  ← this file
  _window-SystemExplorer.md                                  ← Window manifest (frame list, tab order)
  frames/                                                    ← all configs and rendered frames
    _System Explainer.html                                   ← THE window. Click this.
    20260331_data-sovereignty-audience-briefing_config.md         ← cut config (edit in Obsidian)
    20260331_data-sovereignty-audience-briefing.html              ← rendered frame (view in browser)
    20260331_system-design-cuts-explainer_config.md           ← config and frame share base name
    20260331_system-design-cuts-explainer.html
    20260331_system-design-windows-concept_config.md
    20260331_system-design-windows-concept.html
    20260331_worklog-daily_config.md
    ...
```

Configs (`_config.md`) and frames (`.html`) live together in `frames/`. Same base name, different suffix/extension. Date-first for chronological sort order.

## Composition Stack

When generating a packet, voice direction and visual styling compose in four layers (top to bottom):

1. **Cut config body** (highest): Voice, Structure, Emphasis, De-emphasis, and Visual Direction sections from the cut config.
2. **Contact overlay** (middle): If the audience is a specific contact, their profile's `Rendering Preferences` section layers over the lens defaults.
3. **Lens defaults**: The lens's built-in structure, sections, and voice defaults.
4. **Style-source tokens**: Design tokens (color, typography, spacing) baked in at generation time.

An atmosphere, if specified, sits at `z-index: 0` beneath all four layers as an ambient background.

Sections resolve independently. A cut can override Voice while leaving Emphasis, De-emphasis, and Visual Direction to the contact overlay or lens defaults.

---

## Worked Example

A complete cut config looks like this. The frontmatter declares everything the skill needs to find content and pick a lens. The body shapes the voice.

```markdown
---
type: cut
date: 2026-03-31
project: My Project
slug: 20260331_system-design-cuts-explainer
audience: the user
tone: clear, annotated, show-don't-tell
content-tag: how-cuts-work
lens: explainer
output: 03_cuts/frames/20260331_system-design-cuts-explainer.html
window: [system-explainer]
tags: [cut, local-intelligence, meta, system-explainer]
visibility: local
last-updated: 2026-03-31
---
# How Cuts Work — A Walk-Through

## Inputs
This cut sources from the cuts system itself. It shows actual file
contents from the vault to explain how the pipeline works.

## Voice
Show the thing, then explain the thing. Lead with the actual file,
the actual code, the actual content. Then annotate it.

No abstraction without a concrete example first.

## Emphasis
- Show actual file contents as code blocks or file previews
- Annotate inline with callouts
- Before and after: show inputs and the output they produced

## De-emphasis
- Abstract diagrams without grounding
- Jargon without examples

## Visual Direction
- File preview cards with filename titlebar and contents below
- Annotation callouts
- Each step fits in one viewport
```

The skill reads this config, finds every vault file with `how-cuts-work` in its `visibility:` array, applies the `explainer` lens, and renders a self-contained HTML frame at the `output` path. The `window:` field links it into a tabbed window if one exists.

Want to see what this produced? Open the packet's window (`Getting Started.html`) — the Lenses tab catal
---
name: display-palette
description: Build and consult a display palette, the full set of presentation patterns available in a vault's artifact corpus, organized by information shape with measured usage counts and exemplars. Use during any display decision ("is there a better way to display this?"), and to create or refresh the palette doc itself.
last-updated: 2026-07-05
---

# Display Palette

A single reference answering "am I using all the patterns available to me in the way that best serves this information?" It turns display from a reflex (whatever the agent reaches for, usually cards and tables) into a decision made against the full inventory.

## The core question

Display decisions should start from **information shape**, not habit:

| Information shape | Pattern family |
|---|---|
| Process or flow over time | storyboard, step rows |
| Chronology, phases | timeline |
| Comparison across options | table |
| Hierarchy, parallel peers | cards |
| Key numbers | stat blocks |
| System structure, mechanism | diagram (+ zoom) |
| Argument, essay | prose with pull callouts |
| Voice, testimony | quote block (real voices only, never fabricated consensus) |
| Sequential browsing of many peers | reel / pager |
| Large set needing recognition | filter chips + visible per-item tags |
| Long page needing a scan spine | icon chips + section overlines |
| Epistemics, caveats | method note |

## Building the palette doc (once per vault, then maintained)

1. **Measure, don't guess.** If the vault has an artifact index with display extraction (see the artifact-sourcing workflow), count pattern usage across the live corpus from it. Otherwise run a one-off probe: a small script testing class-name and marker regexes across the artifact HTML.
2. **Write one row per pattern:** information shape it serves, when it wins, measured usage count, and a known-good exemplar artifact to open for reference.
3. **Name the reflex and the tail explicitly.** In most corpora one or two patterns dominate (cards, tables) while better-fitting patterns sit underused. The palette states this so the agent prefers a tail pattern when the shape matches.
4. **Name the honest gaps.** Information shapes with no owned pattern (commonly: real charts, maps, before/after). Meeting one is a design opportunity to flag to the principal, never a forced fit into the nearest table.
5. **Register the maintenance loop:** when a new pattern ships, add its detection signal to the index script, add its row here, and update the vault's component vocabulary doc if one exists.

## Consulting the palette (every display pass)

- Survey the palette before choosing; the inherited or habitual format is a candidate, never a default.
- Match the information shape to its pattern family; check the exemplar if unsure how the pattern reads in practice.
- State the verdict in one line, naming what else was considered: "considered storyboard, chose table because the reader compares options rather than follows a sequence."
- A shape with no owned pattern gets flagged as a design opportunity, with the principal deciding whether to invent the pattern now.

## Path adapter

Common default (Claude Code + Obsidian vault with a cuts system): the palette doc lives at `Cuts/_components/display-palette.md`, seeded from the `display` fields in `frames-index.json`, with the signal dictionary in `Cuts/build-gallery-index.mjs`. Remap to your vault's locations; the method (measure, one row per pattern, name the reflex, name the gaps) is the portable part.

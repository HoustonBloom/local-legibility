---
type: log-entry
date: YYYY-MM-DD
change: <what changed in one phrase>
affects: [packet, vault]
principles: []  # optional: [make-harm-legible, provide-an-exit, design-for-sufficiency, scale-out-not-up]
for: [human, ai]
visibility: local
---
# YYYY-MM-DD — <Short title for this change>

## What changed

One or two paragraphs, factual. What was added, moved, renamed, deprecated. Reference files by path.

- Bullet the concrete moves if there were several

## Why

The reasoning or feedback that prompted this change. If a specific conversation or incident drove it, name it. Link to the relevant spec, prior entry, or person profile if useful.

## Cascade

Follow-on changes needed. May be open at write time — that's fine. This is where "still to do after this landed" goes.

- Open item one
- Open item two

## Decisions made

- **Decision.** One sentence explanation.
- **Decision.** One sentence explanation.

## Principles tagged

If this change serves one or more design principles, name them here with a brief reason. Pulls from [`../01_tools/00_overview/Design Principles.md`](../01_tools/00_overview/Design%20Principles.md) by default; override vocabulary in frontmatter if your framework differs.

- **<Principle name>.** Why this change embodies it.

---
type: template
subject: window
for: [human, ai]
visibility: local
---
# Cuts System : Window Config

This is the manifest for the System Explainer window. It defines which frames appear as tabs and in what order.

## Frames

| Tab | Frame | Cut Config | Status |
|-----|-------|------------|--------|
| Explainer | 20260331_system-design-cuts-explainer.html | 20260331_system-design-cuts-explainer_config.md | Active |
| Windows | 20260331_system-design-windows-concept.html | 20260331_system-design-windows-concept_config.md | Active |
| Architecture | 20260331_system-design-architecture.html | (inline, no separate cut) | Active |
| Workflow | 20260331_system-design-workflow.html | (inline, no separate cut) | Active |
| Use Cases | 20260331_system-design-use-cases.html | (inline, no separate cut) | Active |
| Open Questions | 20260331_system-design-open-questions.html | (inline, no separate cut) | Active |
| Agent Communication | 20260331_system-design-agent-communication.html | 20260331_system-design-agent-communication_config.md | Active |
| State Audit | 20260331_system-state-audit.html | 20260331_system-state-audit_config.md | Active |

## How It Works

1. Each frame is an HTML file in `03_outbox/frames/`.
2. The window (`_System Explainer.html`) loads all frames as tab panes.
3. Tab navigation switches which frame is visible. JavaScript toggles display.
4. Each frame owns its own sidebar nav and content sections.
5. To add a frame: set `window: [system-explainer]` in the cut config's YAML, build the HTML, add a row to this table, regenerate the window.

## Discovery

The link between a frame and a window is bidirectional:
- **Window to Frames:** This manifest lists all frames in tab order.
- **Frames to Window:** Each cut config's `window` field lists which windows include it (array, supports multiple).

To find all frames that belong to this window, scan cut configs for `window` arrays containing `system-explainer`.

## Regeneration

When Claude regenerates the window, it reads this config and assembles the frames into one HTML file with the window chrome (RetroWindow title bar, frame tabs). Each frame's content is inlined into the output.

## Naming Convention

**Date-first for sort order:** `YYYYMMDD_concept-descriptor.ext`

- Date first, underscore separator
- Hyphens within concept/descriptor
- `.html` for rendered frames
- `_config.md` suffix for cut configs
- Config and frame share the same base name

Examples:
- `20260331_data-sovereignty-audience-briefing_config.md` (config)
- `20260331_data-sovereignty-audience-briefing.html` (rendered frame)

## Notes

- Frame order in the table = tab order in the window.
- "Active" frames are built and rendering. "Planned" frames appear as dimmed tabs.
- A frame can be sourced from a cut config (content + voice direction) or built inline (no cut config, just authored HTML).
- All frames and configs live in `03_outbox/frames/`.

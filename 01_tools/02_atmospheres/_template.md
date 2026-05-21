---
type: template
subject: atmosphere
for: [human, ai]
visibility: local
---
# <Name>

*One-sentence description of the atmosphere's character.*

> **This is a background cover.** The <Name> atmosphere occupies `z-index: 0` and fills the viewport. All text, UI, components, lenses, and layouts go on top of it at `z-index: 2` or higher. The atmosphere's container has `pointer-events: none`. See [[README|the atmospheres charter]] for the full integration contract.

---

## At a glance

| | |
|---|---|
| **Name** | <Name> |
| **Role** | Background cover (atmosphere, `z-index: 0`) |
| **Type** | <canvas / SVG / CSS gradient / etc.> |
| **Interaction** | <cursor response / none / custom> |
| **Performance** | <particle count, framerate target, reduced-motion behavior> |
| **Dependencies** | <vanilla JS / specific libraries / none> |
| **File size** | <approximate kB uncompressed> |

Use when: <1–2 sentences on appropriate contexts>
Do not use when: <1–2 sentences on contexts where this competes with content>

## Visual character

Describe what the atmosphere looks like to a human seeing it for the first time. Color palette, motion quality, density, rhythm. If there are named phases or states, describe each.

## What's configurable

Group configurable parameters by how often they'd be adjusted.

### <Group 1: e.g. Colors — change freely>

| Key | Default | Notes |
|---|---|---|
| `<param>` | `<value>` | <what it controls> |

### <Group 2: e.g. Motion — tune for context>

| Key | Default | Range | Notes |
|---|---|---|---|
| `<param>` | `<value>` | `<low>` to `<high>` | <what it controls> |

Document everything. A parameter that exists in the implementation but is not in this spec is a bug.

## What's fixed

Parameters that are intentionally not configurable. Document why (performance, identity, coherence). This prevents future drift.

## Interaction contract

Does the atmosphere respond to input? If yes:
- What input does it listen for (`mousemove`, `touch`, `resize`)?
- Where does it listen (`window` vs. container)?
- What does it do in response?
- What if input is missing (no pointer device)?

If no interaction, write "None. Atmosphere is passive."

## Accessibility

- `prefers-reduced-motion` behavior: <what changes>
- Does the atmosphere affect text contrast? If so, document the safe overlay opacity (glass veil) needed
- Any epilepsy/strobe concerns: frame rate of flashes, intensity

## Integration

How to drop this atmosphere into an artifact:

```html
<!-- Placed once, at the top of the body -->
<div class="<name>-atmosphere">
  <!-- implementation -->
</div>

<!-- Optional glass veil above it at z-index: 1 -->
<div class="glass-veil"></div>

<!-- All content at z-index: 2+ -->
```

CSS contract:

```css
.<name>-atmosphere {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
```

## Reference implementation

Link to the sample render:

- [[_examples/<name>|Sample render]]

## Notes on composition

Which lenses pair well with this atmosphere. Which content types suit it. Color combinations that work and which to avoid.

## Version history

- **v0.1.0** (YYYY-MM-DD): Initial draft.

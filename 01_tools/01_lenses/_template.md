---
type: template
subject: lens
for: [human, ai]
visibility: local
---
# Lens: <Name>

*One-sentence description of what this lens produces.*

---

## What this lens does

Describe the shape of the output. What sections does it render? What's the reading order? What does the finished frame look like to a human opening it for the first time?

## When to use this lens

- Bullet list of scenarios where this is the right lens
- Be specific about the kind of content and audience

## When NOT to use this lens

- Bullet list of scenarios where a different lens would serve better
- Helps disambiguate from adjacent lenses

## Required inputs

### From the cut config

Enumerate every frontmatter field this lens requires beyond the base cut config (see [[../00_overview/CUTS-SPEC|CUTS-SPEC]] for the base). For each: what it controls, required vs optional, accepted values or formats.

### From the tagged content

What shape must the tagged vault files be in? Do they need specific headings, a certain length, a particular frontmatter key? Be explicit : silence here produces mystery failures later.

## Output contract

What the rendered frame guarantees:
- Dimensions / responsive behavior
- Fonts loaded
- Style tokens consumed
- File size envelope (approximate range, kB)
- Accessibility commitments (semantic structure, aria, reduced-motion)

## Visual structure

Describe the layout top-to-bottom. Reference specific components, spacing, color roles. This is where the lens's visual identity gets codified.

## Interaction model

If the lens has any interactive elements (scroll, tabs, modal, keyboard navigation), document them. If none, say "Static, no interaction."

## Token consumption

Which design-system tokens does this lens use? Fonts, colors, spacing. Notes on where substitutions are safe vs. where changing the token breaks the lens.

## Reference implementation

Link to the sample render:

- [[_examples/example-<slug>|Sample render]]

## Notes on edge cases

Unusual content, empty states, overflow, long titles, missing optional inputs. What does the lens do when something is off?

## Version history

- **v0.1.0** (YYYY-MM-DD): Initial draft.

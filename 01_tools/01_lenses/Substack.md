---
type: source-doc
category: lens
subject: substack-lens
for: [human, ai]
visibility: local
version: v0.1.0
status: replicated-not-authored
last-updated: 2026-05-16
---
# Lens: Substack

*Long-form essay rendering with Substack-style typography: single column, serif body, generous reading rhythm, optional audio player. Designed for long-form drafts before they ship to a real Substack publication.*

---

## STATUS: Replicated, not yet properly authored

This spec is a v0.1.0 quick-replication of a one-off pattern first used in an earlier cut. The lens captures that pattern so future cuts can reference `lens: substack` instead of `lens: null`. It does **not** yet ship as a fully-integrated lens.

### TODO before this is a real lens

The full lens-integration checklist lives in [[ADDING-A-LENS]]. Status against that checklist as of 2026-05-16:

- [x] Spec exists at `01_lenses/Substack.md` (this file)
- [ ] Example exists at `01_lenses/_examples/example-substack.html`. **NOT YET DONE.** The existing one-off `Cuts/frames/20260514_a-gift-to-designers.html` is the de-facto reference. To formalize, copy a stripped-content version into `_examples/example-substack.html`.
- [ ] Added to `EXAMPLE_FRAMES` in `build-window-frames.mjs`. **NOT YET DONE.**
- [ ] `<section class="lens">` card added to `lens-catalog.html` with hand-drawn SVG thumbnail. **NOT YET DONE.**
- [ ] Template placeholder added at bottom of catalog. **NOT YET DONE.**
- [ ] Lens name + description added to `cut-packet/SKILL.md`. **NOT YET DONE.**
- [ ] Build runs clean (`build-window-frames.mjs`). **NOT YET DONE.**
- [ ] Verifier passes (`verify-window-frames.mjs`). **NOT YET DONE.**
- [ ] Kit README lens count updated. **NOT YET DONE.**
- [ ] Gallery index rebuilt. Pending after first cut renders.

Until the checklist completes, cuts using this lens still render correctly because the pattern is self-contained in the rendered HTML. But the lens is not yet discoverable through the catalog UI or formally tracked by the cut-packet skill.

### Existing rendered instances of this pattern

- `Cuts/frames/20260514_a-gift-to-designers.html` (original one-off; `lens: null` in its config because the lens did not exist when it was rendered; safe to leave as-is, or update its `lens:` to `substack` and rename to `-substack.html` per the slug-discipline rule)
- `Cuts/frames/20260516_the-loom-in-place-substack.html` (first cut to explicitly use `lens: substack`)

---

## What this lens does

Renders a long-form essay as a clean reading surface modeled on Substack's web reader: white paper, serif body type (Charter / Iowan Old Style / Georgia), single column with a 640px max width, generous vertical rhythm. Sections are visually separated with thin rules. Drafts in flight can include amber-callout placeholder blocks for unfinished sections. Footnote-style connection lists and source citations sit at the bottom.

The lens ships with the canonical Cuts audio player (currently v1.7) embedded inline so the essay can be read aloud. Section navigation works automatically because every essay section is wrapped in `<section class="cluster">`. Canonical player spec lives in the packet at `01_tools/00_overview/player.md`.

## When to use this lens

- Long-form essays, draft or near-final, that will eventually live on a Substack publication
- Standalone written pieces that need an HTML preview separate from the markdown draft (so the writer can read it like a reader would)
- Systems essays, op-eds, or any long-form piece that shares the long-form reading register
- Any draft where the source markdown lives in an unpublished folder and the cut is a render of that source for review before publishing

## When NOT to use this lens

- Short-form social posts (use the Reel lens or a one-off render)
- Pitches, proposals, or decision-shaped documents (use Pitch)
- Multi-frame product or company sites (use Product Website or Company Website)
- Anything that needs custom chrome, branded headers, or non-essay structure
- Internal vault notes. Markdown is the right medium

## Required inputs

### From the cut config

| Field | Required | Purpose |
|---|---|---|
| `lens` | required | Must be `substack` |
| `slug` | required | Date-first, ends in `-substack` (per CLAUDE.md lens slug rule) |
| `source-draft` | required | Path to the markdown source the cut renders from |
| `narrative` or inline voice | required | Voice direction. Pick the voice your byline writes in. |
| `writing-as` | recommended | Byline name. Matches the publication's author name. |
| `audio-player-version` | optional | Default `v1.7`. Embedded inline per `01_tools/00_overview/player.md` |
| `output` | required | Must point under `Cuts/frames/` per CLAUDE.md hard rule |

### From the tagged content

The lens reads from a single `source-draft` markdown file rather than from a `content-tag` selection across the vault, because long-form essays are written as discrete documents, not assembled from fragments.

The source markdown should have:

- A frontmatter block with `title`, optionally `subtitle`, `author`, `date`, `status`, `version`
- Body sections separated by `---` rules
- Inline `[NOTE TO AUTHOR: ...]` markers in placeholder sections that the lens renders as amber callouts
- An optional "Companion artifacts" section at the bottom
- Optional "Notes from the drafter" or editorial-flags section for in-flight drafts

## Output contract

The rendered frame guarantees:

- Mobile-first responsive: 19px base type at <720px, 20px at >=720px
- Single column, max-width 640px
- Charter / Iowan Old Style / Apple Garamond / Georgia / Times New Roman serif stack for body and headers
- System sans (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto) for byline, captions, connections, and footer
- Standard Cuts design tokens (`--paper`, `--paper-deep`, `--ink`, `--ink-soft`, `--ink-faint`, `--rule`, `--accent`) so the v1.2 audio player picks them up cleanly
- Each H2 section wrapped in `<section class="cluster">` so audio-player section navigation works
- Audio player embedded inline (CSS + HTML + JS, no external deps) with `STORAGE_KEY` namespaced to the frame slug
- Sticky-bottom player behavior above 120px reserved padding
- No em dashes anywhere (vault rule)
- No fabricated data (vault rule)

## Visual structure

Top to bottom:

1. **Masthead** with `<h1 class="title">`, optional `<p class="subtitle">` (italic), and `<div class="byline">` (sans, between hairline rules)
2. **Audio player** as a paper-deep panel below the masthead
3. **Article body** as a series of `<section class="cluster">` blocks separated by `<hr class="section-rule">` rules. Each section's H2 becomes a section-navigation target.
4. **Placeholder callouts** for unfinished sections: amber background (`#fff8e6`), orange left border (`#d97706`), label like `⌬ Author writes this section ⌬` followed by a bullet list of what the section needs
5. **Footer source citation** as `<footer class="source">` with thin top rule
6. **Connections list** in sans, smaller type, muted color. Visually distinct from essay body
7. **Companion artifacts** list (optional) for in-flight drafts that have associated companion essays
8. **Notes from the drafter** accordion (optional) for editorial flags the author should resolve before publishing

## Interaction model

Static reading surface with three interactive elements:

- **Audio player.** Tap play to read aloud. Speed pill cycles 0.85 / 0.95 / 1.0 / 1.1 / 1.2. Prev/next buttons jump section boundaries. Slider scrubs anywhere. Voice picker selects from installed OS voices.
- **Sticky-bottom player.** When the user scrolls past the player's natural position, it floats to the bottom of the viewport.
- **Accordion sections** (optional). Editorial-flag accordions at the bottom expand on click.

## Token consumption

| Token | Used for | Safe to substitute? |
|---|---|---|
| `--paper` (#ffffff) | Body background | Yes, but keep contrast high |
| `--paper-deep` (#f5f4f1) | Player background, accordion background | Yes |
| `--ink` (#0a0a0a) | Body text, H1, H2 | Yes within accessibility range |
| `--ink-soft` (#6b6b6b) | Subtitle, byline, footer, connections | Yes |
| `--ink-faint` (#a0a0a0) | Tertiary text | Yes |
| `--rule` (#e6e6e6) | Hairline rules, borders | Yes |
| `--accent` (#c47e2c) | Accordion arrow, placeholder border accent | Yes |
| `--link` (#0a5fc1) | Inline links | Yes |
| `--placeholder-bg` (#fff8e6) | Placeholder callout background | No (coupled to `--placeholder-border`) |
| `--placeholder-border` (#d97706) | Placeholder callout left border | No (coupled to `--placeholder-bg`) |
| `--serif` | Body and headers | Replace as a stack, not a single font |
| `--sans` | Byline, connections, accordion bodies | Replace as a stack |

## Reference implementation

**TODO:** copy a stripped-content version of `Cuts/frames/20260514_a-gift-to-designers.html` into `_examples/example-substack.html` so the catalog UI has a previewable sample. Until then, the de-facto reference is:

- `Cuts/frames/20260514_a-gift-to-designers.html` (first instance, before the lens was named)
- `Cuts/frames/20260516_the-loom-in-place-substack.html` (first instance using `lens: substack` explicitly)

## Notes on edge cases

- **Missing subtitle:** drop the `<p class="subtitle">` entirely; do not render an empty tag.
- **Missing byline:** drop the `<div class="byline">` block.
- **NOTE TO AUTHOR markers in source:** render as amber callouts inline at the position where they appear in the source. Strip the `NOTE TO AUTHOR:` prefix; surface the instruction body.
- **Source citation absent:** drop the `<footer class="source">` block.
- **Connections list absent:** drop the `.connections` block.
- **Very long titles:** title uses `letter-spacing: -0.01em` and `line-height: 1.15`. Two-line wraps are fine; three-line titles indicate the title is too long for the lens.
- **Inline links:** body links use `--link` (blue) and underline. External links should open in a new tab via `target="_blank" rel="noopener"`.
- **Numbered lists in source (e.g. editorial flag enumerations):** render with `<ol>` inside the relevant section; do not flatten to paragraphs.

## Version history

- **v0.1.0** (2026-05-16): Replicated from the one-off pattern at `Cuts/frames/20260514_a-gift-to-designers.html`. Spec authored, integration surfaces (example file, build registry, catalog card, skill registration, build/verify run) deferred. First explicit user: `Cuts/frames/20260516_the-loom-in-place-substack.html`.

## Open questions for proper authoring

When this lens gets upgraded from `replicated` to `authored`:

1. Should the Substack lens have a dark variant? Substack's reader supports dark mode; the current pattern is light-only.
2. Should the connections list become a structured `frontmatter` field on the cut config (e.g. `connections: [Relational Spaces, Gardens-Not-Platforms, ...]`) rather than authored inline in the HTML?
3. Should the source-citation and the audio player's voice/speed default be configurable per cut?
4. Should the lens auto-render a cover image area at the top, or remain image-free by default?
5. Does the lens want a designated "essay end" affordance (e.g. "Read other essays" footer linking to a writing-window) or stay self-contained?
6. Dro
---
type: source-doc
category: lens
version: v0.1.0
for: [human, ai]
visibility: local
---
# Anatomy

Anatomy is a structural diagnostic for a long-form text. The lens reads the document's full body and produces a single HTML page that shows the writer what they actually built: total word count, how many sections the piece has, which section is longest, what share of the body that longest section holds, how the words split across function buckets, and a per-section drill-down with the primary claim, supporting beats, function role, and word-share for each section. The lens pairs with a `Critical Compass` audit by answering a question the audit doesn't try to answer: not "is this trustworthy?" but "is the shape of this thing what I meant?"

**Use when:** the source is a long-form draft (essay, advocacy piece, research write-up, policy memo, white paper) and the reader needs to see the document's shape before judging it. Especially valuable after a `Critical Compass` audit, when the writer has a list of findings and wants to see how those findings map onto the structure they actually built.

---

## What this lens does

Three layers, stacked.

1. **Macro band.** Four headline stats and one horizontal stacked bar that shows how the document's words split across function buckets. The first thing the reader sees is the document's silhouette.
2. **Per-section drill-down.** One collapsible row per section. Sized by word count. Color-coded by function bucket. Expand to see the primary claim, supporting beats, the unstated assumption, and a side panel of facts (word count, % of body, bucket pill).
3. **Notes band.** A short author note about what the document is trying to do, where the load-bearing section is, and what is still soft. Anchors the diagnostic to authorial intent.

The diagnostic is useful because the three layers can disagree with each other. The macro silhouette might show a draft that is mostly setup. The drill-down might show that the section the author considers most important is also one of the shortest. The author's own note might claim the architecture section does the heavy lifting when the word counts say it is dwarfed by the closing implications. When the layers contradict each other like that, the writer does not need a separate critique to know what to revise. The section the three views disagree about is the section to revisit first.

## When NOT to use this lens

- Short documents (under 1,500 words). Anatomy needs structural variation to be informative.
- Documents that are inherently list-shaped (FAQs, glossaries). They have no anatomy to render.
- Critical Compass output itself. Don't anatomize the audit. Anatomize the source.
- Live status or dashboard surfaces. Use Status Report or Observatory.

## Distinction from adjacent lenses

| | Status Report | Atlas | Explainer | **Anatomy** |
|---|---|---|---|---|
| Reader question | Where do we stand? | Who holds what across the ecosystem? | Walk me through this idea | What is the shape of what I wrote? |
| Source | Project state | Ecosystem map | Research + artifacts | A single long-form document |
| Format | Dashboard | Spatial relational map | Numbered beats | Structural diagnostic |
| Primary visual | KPI cards | Force-directed graph | Numbered rows with previews | Stacked bar + drill-down rows |

## Function buckets

The lens accepts a `bucket-scheme` parameter naming a bucket vocabulary. Default schemes:

**`essay-default`** (best for long-form arguments and advocacy):
- **Setup** (rose): establishes terms, names the problem, builds context
- **Bridge** (amber): pivots, transitions, hand-off moves between argument blocks
- **Architecture** (sage): load-bearing claims, definitions, specifications, the thing being argued for
- **Outward + Close** (sky): implications, asks, invitations to action, what to do next

**`research-paper`**:
- Background · Method · Findings · Implications

**`pitch`**:
- Hook · Problem · Solution · Proof · Ask

**`policy-memo`**:
- Context · Recommendation · Rationale · Tradeoffs · Next Steps

Custom schemes are accepted as `[{slug, label, role-sentence, color-token}]`. Up to 6 buckets per scheme. More than 6 buckets makes the macro band illegible at narrow widths.

## Required inputs

### From the cut config

```yaml
type: cut
slug: YYYYMMDD_concept-descriptor
audience: [Name or Role]
content-tag: [tag selecting the source document]
lens: anatomy
bucket-scheme: essay-default    # or research-paper, pitch, policy-memo, custom
source-doc: [path or slug of the single source document]
title: "Structural anatomy of [Source Title]"
output: Cuts/frames/YYYYMMDD_concept-descriptor.html
audio: off                      # default for anatomy: this is a diagnostic surface
chrome-budget: medium           # full earns its place when used as a portfolio surface
```

### From the tagged content

Exactly one source document. The lens does not synthesize across multiple files. If the cut tags more than one file, the lens uses the first by date and warns about the others.

The source document must have:
- A clear sectioning convention: numbered sections (Roman or Arabic) or `<h2>`/`<h3>` headings. The lens uses these as section boundaries.
- A title and (optionally) a version number.
- A body length of at least 1,500 words.

The lens does not require the document to be pre-classified. It infers bucket assignment from the section content using the chosen `bucket-scheme`. The author can override any inferred bucket with an inline marker (`<!-- bucket: setup -->`) at the top of a section.

## Output contract

- One self-contained HTML file. All CSS inline. No external dependencies beyond Google Fonts.
- Responsive: single column at <720px, two-column drill-down at wider widths.
- Approximately 35-60 kB rendered for a 12,000-word source. Scales linearly with section count, not word count.
- Semantic structure: `<section>` containers, `<details>` for the collapsible drill-down rows. Native keyboard accordion behavior.
- Reduced-motion respected. No autoplay anything.
- No fabricated numbers. Every stat in the macro band is measured from the source. If a count is unavailable (e.g., citation count when the source lacks formal citations), the lens omits the stat rather than estimating.

## Visual structure (top to bottom)

1. **Hero.** Kicker (date + version), h1 with source title and "Structural anatomy of" framing, lede (one sentence describing what the document is doing).
2. **Macro band.** Four stat tiles in a row (body words, section count, longest section, longest section's body share). Below: stacked horizontal bar showing bucket distribution as %. Below that: a stack-note callout highlighting one structural observation (e.g., "Section VIII is larger than the substrate spec it federates").
3. **Legend.** Four-to-six bucket chips, each with color swatch + name + one-line role definition.
4. **Per-section drill-down heading.** A small all-caps label: "Section-by-section."
5. **Drill-down rows.** One `<details>` per section. Summary row: section number, title, horizontal bar sized by word share and colored by bucket, word count + % meta on the right. Expanded body: claim (one quoted sentence in a side-ruled card), beats (3-7 bulleted), openness callout (one unstated assumption, in an amber-rule card), side panel with bucket pill + facts table.
6. **End matter.** Compact grid showing supplementary facts: footnote count, distinct sources cited (if known), epigraph if present, version, word-count method (e.g., "body only, frontmatter and footnotes excluded").
7. **Notes band.** Author's note about intent. One to three paragraphs.
8. **Footer.** All-caps small text: lens version, rendered date, integrity statement.

## Interaction model

- Each section row is a `<details>` element. Click summary to expand or collapse. Native keyboard support (Enter/Space toggles).
- Reading order is top-to-bottom. The lens does not introduce navigation chrome (no sticky TOC, no jump links). The macro band itself is the index.
- No JavaScript required for the core diagnostic to work. JS may be added for nice-to-haves (smooth-scroll, copy-link) but the lens degrades gracefully without it.

## Token consumption

Fonts:
- `--font-display`: Plus Jakarta Sans 700 for the h1, stats values, and section titles.
- `--font-sans`: Space Grotesk 400/500/600 for body text.
- `--font-retro`: Aldrich for small-caps kickers and labels.
- `--font-mono`: JetBrains Mono 500/600 for stat units, percentages, and side-panel facts.

Color tokens (`--paper`, `--ink`, `--ink-soft`, `--ink-faint`, `--paper-warm`, `--paper-deep`, plus four bucket triples: setup/bridge/arch/outward, each with a base, soft, and text color). Bucket colors are warm-cream editorial defaults. Safe to swap for a different palette as long as contrast ratios stay WCAG AA against `--paper`.

## How this pairs with `Critical Compass`

A Compass audit examines a draft for weak claims, hidden assumptions, biases, evidence gaps, missing stakeholders, and framing that closes too early. `audit_text` returns the full finding set; `synthesize_audit_verdict` rolls it into a verdict; `generate_audit_artifact_viewer` turns the findings into a read-only HTML viewer the writer can open alongside their draft. All of that answers the writer's question of whether the draft is trustworthy.

Anatomy answers a different question on the same draft: whether the shape of the document matches what the writer meant to build. It measures the draft rather than judging it. A writer who runs both Compass and Anatomy gets two reports that do not overlap. Compass tells the writer which sentences need more evidence or which voices are missing. Anatomy tells the writer where their words actually went and which section the structural weight of the draft is being carried by. The first informs revision content; the second informs revision shape. Most writers want both at once.

The intended pairing inside Compass:

```
prepare_audit_source → audit_text → anatomy_render → revision pass
```

`anatomy_render` is the proposed Compass skill that invokes this lens. Inputs: the prepared source text and (optionally) the audit findings, so the openness callouts per section can cross-reference Compass's evidence-gap and missing-voice flags. Output: a single HTML file the writer can open, scroll, and use to decide which section to revise next.

## Reference implementation

- Sample render: `Cuts/frames/20260518_thesis-anatomy.html` (the lens-candidate render that became this spec)
- Compass skill draft: `_Reference/Compass Suite/anatomy-skill/SKILL.md` (handoff version)

## Notes on edge cases

- **Single-section documents:** the drill-down collapses to one row. The macro band degenerates to a single-color bar. The lens still renders; the diagnostic value is low. Warn the author in the notes band.
- **Documents without explicit headings:** the lens infers boundaries from paragraph breaks of length > N (configurable, default 3). Warn if more than 6 sections are inferred this way; the author probably wants to add explicit headings.
- **Very long sections (>3,000 words in a 12,000-word document):** the bar fills almost the entire row. The lens compresses the bar and surfaces the imbalance in the stack-note callout.
- **Author overrides:** any section with an inline `<!-- bucket: SLUG -->` marker uses that bucket regardless of inferred classification.
- **No fabricated numbers:** if a stat cannot be measured (e.g., distinct sources cited, when the source has no formal citation block), omit the tile rather than guess. CLAUDE.md hard rule.

## Version history

- **v0.1.0** (2026-05-19): Initial spec, derived from an early thesis-anatomy lens-candidate render.

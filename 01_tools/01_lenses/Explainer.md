---
type: lens
name: explainer
for: [human, ai]
visibility: local
status: active
---

# Lens: Explainer

A lens for walking a reader through a body of research or thinking. The narrative is the spine. Project content enriches it: grounding claims in real artifacts, deepening concepts with source material, connecting ideas to other parts of the system. The narrative tells the reader what matters and why. The project content shows them it's real.

---

## When to Use

When a body of research, a design rationale, or a connected set of insights needs to be communicated as a coherent story, and the story is stronger when the reader can touch the actual project artifacts behind it.

Not for status updates (use Debrief). Not for documentation (that's the vault itself). Not for standalone essays that don't reference the system. The Explainer lens exists when the narrative and the project files need each other: the narrative gives the files a reason to exist in sequence, and the files give the narrative proof and depth.

---

## Config Schema

The Explainer lens uses a cut config. The config points to narrative files and content pools.

```yaml
---
type: cut
lens: explainer
narrative:
  - path/to/narrative-file.md
content-tags:
  - tag-specific-to-this-explainer
  - existing-pool-tag
  - another-existing-pool-tag
date: YYYY-MM-DD
project: Project Name
status: active
visibility: local
output: 03_outbox/frames/YYYYMMDD_slug.html
tags: [cut, project-tag, explainer]
last-updated: YYYY-MM-DD
---
```

**`narrative:`** Array of file paths. These files are the spine. They carry the most weight. They contain the pull point markers inline. Multiple narratives are stitched into one scroll in array order.

**`content-tags:`** Array of content-tags. The pool is every vault file whose visibility array contains any of these tags. Tags can be shared with existing cuts. A file already tagged for a [a named contact] briefing is automatically available to this narrative without touching its frontmatter. Add a narrative-specific tag only for files not already in any relevant pool.

No tone field. The narrative carries its own voice. No window field. The Explainer is a standalone scroll.

---

## Structure: Narrative + Pull Points + Supplements + Progress

### The Narrative

The narrative is one or more authored markdown files. Written to be read straight through. Has a beginning, a development, and a landing.

**Question it answers:** "What should I understand, and why does it matter?"

**Required properties:**

- Works as a standalone read. If every pull point failed to resolve, the narrative is still complete and coherent.
- Has sections. The agent parses section headings from the markdown. Sections are the unit of progress.
- Assumes a warm reader. No onboarding. Start with the problem or the insight, not the prerequisites.
- Has a landing. A final section that gives the reader something to carry. Not a summary. A principle, a frame, a tool for future thinking.
- **Show, don't tell.** No narrative section should exceed 3 short paragraphs before a visual element breaks the text: a diagram, table, pull point card, or structured summary. If a concept can be shown with a diagram instead of explained with a paragraph, show it. Every section: ask "can this be visual instead of prose?"

**What makes the narrative fail:**

- Depending on pull point content to carry the argument. If a claim only makes sense after reading a supplement, the claim belongs in the narrative.
- Losing the thread between sections. Each section must hand off cleanly to the next.
- Explaining the system to the reader instead of thinking with them.
- Walls of prose. If a section is 5 paragraphs of text before the reader sees anything visual, the structure is wrong. Break it with a diagram, a comparison table, a structured summary, or a pull point.

**Flex rule:** The narrative adapts completely by topic. A research narrative builds from problem through evidence to principle. A design rationale builds from constraint through options to decision. A vision narrative builds from pain through mechanism to possibility. The shape changes. The requirement (standalone coherence with a clear landing) does not.

---

### Pull Points

Moments in the narrative where project content would deepen the reader's understanding. Not every paragraph has one. A pull point exists when the narrative makes a move that the reader might want to verify, explore, or see in practice.

**Markup format:** HTML comments inline in the narrative markdown. Invisible in Obsidian reading view. Parseable by the agent.

```markdown
content.json is your IR. Vault markdown goes in one side. Any display
system comes out the other.
<!-- pull:ground concepts:content-json,intermediate-representation -->
```

Format: `<!-- pull:[type] concepts:[key1,key2] -->`

Type is one of: `ground`, `deepen`, `connect`, `evidence`, `horizon`. Concepts are comma-separated, kebab-case, no spaces. Freeform vocabulary. Start freeform, formalize from observed patterns if needed.

**What makes pull points fail:**

- Too many. If every other paragraph has one, the reader feels surveilled. Pull points should be occasional.
- Wrong type. A pull point typed as `ground` that surfaces a speculative doc breaks trust. The type sets an expectation the content must meet.
- No relevant content in the pool. A pull point that resolves to nothing is invisible. Not an empty state. Just absent. The narrative still works.

---

### Pull Point Types

Each type has a distinct **shape**: how it renders and how much space it takes. These shapes are not suggestions. They are the visual contract between the pull point type and the reader's expectation.

#### Ground

**When it appears:** The narrative makes a claim about the system. The reader might think: is that actually true? Can I see it?

**What it surfaces:** The actual artifact that proves the claim. A schema, a config, an architecture doc.

**Shape:** Compact receipt. Inline or small card. The reader glances and returns to the narrative. Show the artifact itself (a code block, a schema snippet, a screenshot), not a description of it.

**Failure mode:** Surfacing a description instead of the artifact. The reader wanted proof. A summary is not proof.

#### Deepen

**When it appears:** The narrative introduces a concept and moves on. The concept has depth the reader might want.

**What it surfaces:** The most relevant project file that goes deeper. A research doc, a reference file, prior findings.

**Shape:** Expandable panel or side view. Visually distinct from the narrative flow. The reader opens it at their own pace. The narrative waits. This is the only type that can take significant vertical space.

**Failure mode:** Surfacing something shallow. If the deepening content is thinner than what the narrative already said, the pull point undermines itself.

#### Connect

**When it appears:** The narrative touches something that links to another part of the system. A different project, a different phase, a different document.

**What it surfaces:** The related file, positioned to show the connection point. Not the whole file. The section or concept that intersects.

**Shape:** Bridge card. Shows two things side by side or with a visible link line: the current context and the connected context. The reader sees the intersection, not two summaries.

**Failure mode:** Surfacing something tangentially related. The connection must be specific. Not "this is also about governance" but "this is the governance handshake mechanism the narrative just referenced."

#### Evidence

**When it appears:** The narrative cites research, references findings, or builds on external sources. The reader might think: where did that come from?

**What it surfaces:** The source material. Research notes, external references, data, benchmarks.

**Shape:** Citation card. Compact: source name, key quote or data point, one-line relevance note. Enough to evaluate credibility without leaving the narrative.

**Failure mode:** Surfacing sources without context. The evidence pull point must include the claim, the source, and the connection between them.

#### Horizon

**When it appears:** The narrative points toward something not yet built. A future capability, an open question, a spec in progress.

**What it surfaces:** Whatever exists about the future state. A spec draft, an open questions list, a roadmap item.

**Shape:** Forward-looking card with a distinct visual treatment (dashed border, muted palette, or "planned" badge). Must be visually distinguishable from grounded content at a glance. The reader should never mistake a future for a fact.

**Failure mode:** Presenting speculative content with the same confidence as grounded content. Futures and facts need different visual treatment.

---

### Section Supplements

At the end of each narrative section, the lens collects all pull points that resolved during that section and presents them as a group.

**Question they answer:** "Before I move on, is there anything from this section I want to explore?"

**Required properties:**

- Maximum 4 visible. If more resolved, show highest-relevance items and indicate more are available.
- Each supplement shows: title, one-line summary, pull point type. Enough to decide whether to open. Not enough to substitute for opening.
- Supplements are a pause point, not a gate. The reader can skip entirely.

**What makes supplements fail:**

- Feeling mandatory. If the reader feels they're missing something by skipping, the narrative didn't do its job.
- Feeling like a wall. More than 4 items visible creates decision fatigue.

---

### Progress

Persistent, minimal orientation showing the reader where they are.

**Required properties:**

- Shows all section titles and current position.
- Tapping a section title navigates to that section.
- Current section is visually distinct.
- Resumable. Reader picks up where they stopped.

**What makes progress fail:**

- Competing with the narrative for attention. Progress is a background instrument. Discoverable on scroll, not overlaid on reading.
- Showing too much. Section titles only. No pull point counts, no completion percentages, no time estimates.

---

## Input Contract

| Input | Where it comes from | Required? |
|-------|-------------------|-----------|
| Narrative file(s) | `narrative:` array in cut config | Yes |
| Pool files | Vault files whose visibility contains any tag in `content-tags:` | Yes |
| Section structure | Parsed from narrative markdown headings | Yes (derived) |
| Pull point markers | Inline HTML comments in narrative | Yes |
| Pool file frontmatter | Each pool file's existing YAML: tags, project, category, visibility | Yes (existing) |
| Pool file concepts | `concepts:` array in pool file frontmatter | Preferred |
| Pool file summary | `summary:` field in pool file frontmatter | Preferred |

If `concepts:` is missing from a pool file, the agent falls back to matching against `tags:` and `category:`. Resolution quality degrades but does not fail.

If `summary:` is missing, the agent generates a one-line summary from the file's first paragraph. Authored summaries are better.

---

## Pool File Metadata

Pool files add two optional fields to their existing frontmatter:

```yaml
---
# existing fields unchanged
type: source-doc
project: My Project
visibility: [local, explainer-measure-once]
# new fields for lens resolution
concepts: [content-json, intermediate-representation, schema-contract]
summary: "The JSON schema serving as the stable middle layer between vault markdown and any display system."
---
```

**`concepts:`** Array of concept keys the file carries. These are what pull points resolve against. Kebab-case. Freeform vocabulary.

**`summary:`** One-line description for supplement cards. Enough to decide whether to open the file.

Both fields are useful for any lens, not just Explainer. Adding them enriches the vault's metadata layer for future use.

---

## Resolution

How pull points find their content at render time:

1. Agent reads the narrative, extracts all pull point markers (type + concept keys).
2. Agent reads all pool files (everything whose visibility array contains any tag in `content-tags:`).
3. For each pull point, agent matches concept keys against pool files' `concepts:` arrays. Fallback: match against `tags:` and `category:`.
4. Agent selects the best match per pull point. If no match is relevant, the pull point is invisible.
5. At section boundaries, resolved pull points are grouped into supplements (max 4 visible).

A pull point can resolve to a specific section of a pool file, not just the whole file. The `connect` type specifically requires this: show the intersection, not the full document.

**Future (Phase 3):** Automated scoring (exact concept match > partial overlap > tag proximity) and threshold-based visibility. For now, the agent reads the pool and makes the call.

---

## Dynamic Adaptation

The structure never changes. The content adapts.

**Research narratives:** Narrative builds from problem through pattern through examples to principle. Pull points ground claims in architecture docs, deepen concepts with research files, evidence findings with source material, horizon toward unbuilt specs.

**Design rationale narratives:** Narrative builds from constraint through options to decision. Pull points ground decisions in prior art, deepen trade-off analysis, connect decisions to other system areas, evidence rejected alternatives.

**Vision narratives:** Narrative builds from pain through mechanism to possibility. Pull points connect mechanisms to existing architecture, deepen technical concepts, horizon toward future capabilities, ground the possibility in what already works.

**Onboarding narratives:** Narrative builds from "here's the thing" through "here's how it works" to "here's what you do with it." Pull points ground each explanation in actual artifacts, deepen with reference docs, connect each piece to the larger system.

---

## Lens vs. Style

### Lens decisions (permanent, travel with the lens)

- Single continuous scroll. Not tabs. Not slides.
- Five pull point types: ground, deepen, connect, evidence, horizon. Each has a distinct shape and presentation behavior. Shapes must be visually distinguishable (see Pull Point Types above).
- Pull points that resolve to nothing are invisible, not empty.
- Section supplements appear at section boundaries. Maximum 4 visible.
- **Progress navigation is required.** Persistent, minimal section indicator showing all section titles and current position. Tapping navigates. Must not compete with the narrative for attention. Every rendered frame must implement this.
- The narrative works without any pull points resolving.
- Warm reader assumed. No foundational teaching.
- **Show, don't tell.** No section exceeds 3 short paragraphs before a visual element. Diagrams over prose when the concept is structural or comparative.

### Style decisions (to be defined by the design system)

- How inline pull point anchors are visually indicated (underline, highlight, icon, glow)
- How supplements appear (popover, bottom sheet, slide-in)
- How the side panel opens and closes (push, overlay, slide)
- How section supplements are laid out (cards, row, stack)
- How progress is rendered (dots, bar, section titles, sticky header)
- How pull point types are visually distinguished from each other
- How horizon content is differentiated from grounded content
- Typography, color, spacing, animation
- Mobile vs. desktop responsive behavior

---

## Open Questions

- **Pull point density.** What's the right ratio? Varies by narrative type. Start sparse, add. Not dense, subtract.
- **Pool freshness.** If a pool file updates after the narrative is written, the pull point surfaces the new version. But the narrative's claim might now be outdated. The `sync-with:` mechanism applies here.
- **Multiple narratives sharing a pool.** Different narratives pulling from the same pool files is a feature. Does a file pulled by three narratives surface differently than one pulled by one?
- **Concept key vocabulary.** Freeform or controlled? Start freeform. Formalize from observed patterns if they emerge.
- **Completion tracking.** If the success test is "they finish," do we track completion? Where does that data live?

---

## Rendering Protocol

Before rendering a new Explainer frame:

1. **Review all prior Explainer frames.** Open each `.html` file in `03_outbox/frames/` that was rendered with `lens: explainer`. Study the narrative structures, pull point deployments, visual breaks, and progress navigation implementations. Note what worked (readers stay engaged, concepts land) and what didn't (prose walls, pull points that don't earn their click, progress bars that don't reflect actual progression).

2. **Mix interaction patterns.** The Explainer lens defines structure (narrative spine, pull points, progressive depth, progress nav). It does not dictate how those elements are rendered. A narrative section might use scrollytelling with pinned graphics. Pull points might use reactive documents where parameters are scrubable. A comparison section might use a spatial canvas instead of side-by-side cards. Draw from the Pattern Vocabulary (your project's pattern library, if you maintain one). Combine patterns within a single frame. The interaction mechanic should match the content's argument at each point in the narrative.

3. **Improve on what exists.** Each frame should solve its content's communication problem more effectively than the last. If every Explainer frame uses the same scroll-with-sidebar layout, the lens is being applied mechanically. The narrative spine is the constant. Everything else should respond to the specific content.

**Rendered frames:**
- `20260402_measure-once-arrange-anywhere.html`
- `20260402_constellation-now-next-later.html`
- `20260402_concept-gap-analysis.html`
- `20260402_raspberry-pi-community-hub.html`
- `20260403_detection-to-architecture.html`
- `20260405_zim-distribution-layer.html`

---

## Version History

**v0.1** (2026-04-02, Session 4): Lens defined. Config schema established with `narrative:` array and `content-tags:` array. Five pull point types specified (ground, deepen, connect, evidence, horizon). First narrative identified: "Measure Once, Arrange Anywhere." Pool mapped across 12 files and 5 existing content-tags.

**v0.2** (2026-04-02, Session 5): Audit of 4 rendered explainer frames. Added "show don't tell" rule: max 3 paragraphs before a visual break. Sharpened pull point type shapes with distinct rendering contracts per type. Made progress navigation a hard requirement. Simplified resolution algorithm (deferred automated scoring to Phase 3). Added prose wall as a named failure mode.

**v0.3** (2026-04-02, Session 5): Added Rendering Protocol. Agent must review all prior Explainer frames before rendering a new one. Must mix interaction patterns from Pattern Vocabulary. Each frame should solve its content's communication problem differently. Rendered frames list maintained in protocol section.

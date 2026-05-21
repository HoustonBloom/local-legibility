---
type: source-doc
category: lens
version: v2.1.0
for: [human, ai]
visibility: local
---
# Status Report

A periodic roadmap-and-proof-points view. Captures what the system is proving right now, what it costs to run, and what's next. Built for collaborators who are not day-to-day in the work and need to keep up without swallowing the details.

**Use when:** a collaborator, investor, or partner needs to stay current on a project without being walked through file-level changes. The reader wants the roadmap, the tests in flight, and the cost shape. Not rename logs, not file counts.

## Core rules

These apply to every render. Non-negotiable.

### 1. Never fabricate data

- If a metric isn't tracked, the cell reads **"Not yet measured"** and names what would measure it.
- Do not use `[est]`, `~`, or "roughly" when there's no method behind the number. Estimates imply a process that produced them. If no process exists, say so.
- Exact numbers require a named source (file path, log entry, observable filesystem state). Anything else is off-limits.

### 2. Every report includes a Provenance section

- Lists every source the report was built from.
- Distinguishes **tracked** (verifiable) from **not tracked** (missing).
- Names the instrumentation gap explicitly: "this field would be real if X logged it."
- Reader should be able to walk the sources themselves if they want to audit.

### 3. Features get "why it matters"

- "X shipped" is never enough. "X shipped, which means [concrete capability the reader now has]" is the bar.
- Especially for collaborators not in the daily work: they don't know the code, so name the capability in plain terms.

### 4. Titles carry information

- Every card title, section eyebrow, and thread label must be specific enough to stand alone. A reader should know what's in a section without reading the body.
- **Bad:** "The verb", "Phase 1", "Instrumentation", "Self-install from First Look."
- **Good:** "Pick the word we use for install", "Run the first two-node test", "Measure what the system costs", "Can a stranger install the packet on their own?"
- Questions are often clearer than nouns. "Can X?" tells the reader what's being tested. "X" forces them to guess.

### 5. Do a title read-through before shipping

After all titles are written, **read every title in the render as a single pass, top to bottom.** Page title, H1, section eyebrows, section titles, card titles, thread labels, footer.

Titles written one at a time pass spot-check but fail the read-through. You notice:

- A title that's fine alone but vague next to its neighbors.
- The H1 that doesn't carry a signal anyone would read (the "what it proves, what's missing" problem).
- Inconsistent voice across cards (half questions, half nouns).
- Redundant framings two sections apart.

Fix those before shipping. The read-through is not optional; it's the final check. If a title doesn't stand up when read as part of the set, rewrite it.

## Who this is for

Collaborators one step removed from daily work. They care about:

- **Whether the thing is proving out.** Are the experiments working? Where are we blocked?
- **Cost and performance.** Tokens, minutes, bytes. How does it scale with folder size?
- **What's next.** The roadmap. The proof points queued for the next window.
- **Technical shape.** Hardware, endpoints, integration surfaces. What the system actually does.
- **How this was made.** Where the numbers in the report come from, and what to trust.

They do **not** care about: file renames, README scrubs, internal refactors, design-token counts, em-dash audits. Those belong in a different artifact (a Build Log lens, if ever needed).

## Sections

Render in this order. Each section is authorable in the cut config body under the matching heading.

### 1. Header

Title, date, audience, scope. Pills for lens, audience, snapshot number.

### 2. BLUF

One sentence on the roadmap moment. One sentence on cost trajectory or headline metric (or "Not yet measured, here's why"). Nothing else. No file counts.

### 3. Proof points · tests in flight

**The load-bearing section.** Active experiments with:

- **Hypothesis** — one line. What are we testing?
- **Why it matters** — one line. What does success unlock? (REQUIRED)
- **Status** — running / blocked / done / planned
- **Evidence** — what have we seen so far? Real data only.
- **Result / next read** — when do we expect to know?

Card layout, one card per experiment. Status color-coded: green (done), butter (running), rust (blocked), sky (planned).

### 4. Cost model

The shape of the cost to use the system.

**If instrumentation exists:** render two tables. Install baseline + per-session cost. Use only tracked numbers.

**If instrumentation is missing:** render one compact panel that says *"Cost model not yet measured. Requires `/complete` to log `tokens_in`, `tokens_out`, `duration_minutes`, `files_touched` per session."* Name the instrumentation gap and point at the Roadmap phase that would close it.

Do not show empty tables with `[est]` placeholders. Either numbers are real, or the section says they don't exist yet.

### 5. Session history

Recent sessions from the activity log. Columns: date, duration, tokens, outcome.

**If tracked:** one row per session with real numbers.

**If not tracked:** render with the outcome column only, each row clearly labeled "tokens + duration not yet logged." The outcome column (what was done) is observable from the vault state and is fine to include.

### 6. Roadmap · next 2 to 3 phases

Not a backlog dump. The 2-3 things that would move the needle next. For each:

- **Phase name** (short)
- **Why it matters** (one line, plain terms) — REQUIRED
- **Done when** (one concrete test)
- **Blocked on / ready when** (one phrase)

### 7. Technical specs that matter

Hardware, endpoints, integration surfaces. Things the reader can verify. Only list what exists — don't list aspirational hardware as active.

### 8. Open threads

What does the reader need to act on? Each: tag + label + one-line ask.

### 9. Provenance · How this was made

**Required. No exceptions.**

Three blocks:

**Sources used.** Every file read to produce the report. Paths given. Last-modified dates where available.

**Tracked vs. not tracked.** Two-column list. What the numbers came from vs. what's missing.

**Methodology notes.** Any counts that required a decision (what gets included in "lenses shipped"? what window defines "session"?). Short. Honest.

### 10. Footer

Provenance summary + cut config path + render date + style-source + atmosphere used.

## Sections that are OFF by default

`mode: internal` enables two additional sections for engineering audits:

- **Delta table** — before/after counts for file-level metrics
- **Event grid** — typed change events (rename/consolidate/promote/retire/establish)

Suppressed by default. [a named contact] + most external readers never see them.

## Visual Direction (defaults)

Inherits from the cut's `style-source:`. Default: `default-tokens` remapped to paper-on-ink when `atmosphere: field` is set.

**When `atmosphere: field` is active:**
- Body background: `#0B0D10` (atmosphere handles this)
- Panels: translucent ink with `backdrop-filter: blur`
- Text: paper tones with opacity hierarchy
- Accents: butter (emphasis), sage (done/positive), rust (blocked), sky (planned/tag)

**When no atmosphere:**
- Body: paper
- Panels: card surface with ink borders + 4px offset shadows
- Text: ink scale
- Accents: sage-deep, butter, rust (from the style-source)

Density: dashboard-level. Tight padding, generous section space, mono-heavy on numbers.

## Voice (defaults)

Framed as roadmap, not changelog. Data before words. Every feature mention answers "why should the reader care." Every number names its source.

No em dashes. Colons and periods instead.

## Emphasis

- Proof points. What's being tested, what's working, what's blocked.
- Cost shape when measurable. Instrumentation gap when not.
- Near-term roadmap items with concrete "done" criteria.
- Provenance. Every number traceable.

## De-emphasis

- File renames, README scrubs, refactoring specifics.
- Design-token counts (unless they unlock a concrete capability).
- Internal architecture debates.
- Estimates without methodology.

## Required fields in the cut config

```yaml
type: cut
slug: YYYYMMDD_concept-descriptor
audience: [Name or Role]
content-tag: [tag selecting source files]
lens: status-report
style-source: default-tokens
atmosphere: field              # optional
output: 03_cuts/frames/YYYYMMDD_concept-descriptor.html
date: YYYY-MM-DD
title: "Status Report · [Scope] · YYYY-MM-DD"

# Optional:
window-scope: "[e.g., since 2026-04-19]"
previous-snapshot: [path to prior Status Report]
mode: internal                 # enables delta table + event grid
```

## Data dependencies

The lens pulls from:

- **Activity log entries** (`02_activity/*.md`) for system-shape changes.
- **`/complete` session notes** (`Daily/Sessions/*.md`) for per-session tokens + duration + outcome. **Currently not tracked.** Must be added to `/complete` before Session history and Cost model render real data. Until then, those sections render honest "not tracked" labels.
- **Proof-point log** (TBD: `02_activity/_proof-points.md`) for test hypotheses and results.
- **Roadmap doc** (TBD: `02_activity/_roadmap.md`) for the next 2-3 phases.
- **Vault filesystem** for what's observable: lens specs shipped, workflow specs shipped, atmosphere specs shipped, packet folder state.

When a source is missing, say so in Provenance. Never fill the gap with a guess.

## Composition stack note

Standard: cut body > contact overlay > lens defaults > style-source tokens. Atmosphere optional, at z-index 0.

For [a named contact] specifically: the contact overlay enforces density, BLUF-first, file paths as first-class (from his profile). Those don't conflict with this lens's roadmap framing; they compound.

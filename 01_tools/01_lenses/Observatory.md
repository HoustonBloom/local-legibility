---
type: lens
name: observatory
for: [human, ai]
visibility: local
status: pending
---

# Lens: Observatory

A lens for seeing everything at once. The full system: all 22 projects, grouped by initiative, showing where each one is, what happened recently, what is waiting, and what is stuck. Not a dashboard (dashboards flatten). Not a report (reports narrate). An observatory: a place you go to look at the whole sky and notice what moved.

---

## When to Use

At session start, when the user wants to orient before choosing what to work on. At session end, when she wants to see what shifted. When the question is not "tell me about X" but "show me everything and let me find the signal."

Not for deep dives into a single project (use the hub file). Not for communicating to an external audience (use Explainer or Debrief). Not for reviewing a session's work (use Debrief). The Observatory is the user's instrument. Internal. Honest. No polish needed.

---

## The Question It Answers

"What is the state of the whole system right now, and where is the energy?"

---

## Structure: Three Layers

The Observatory renders three layers of information. Each layer answers a different sub-question. The layers stack vertically in a single scroll.

### Layer 1: The Map

**Question:** "What are all the projects and how do they relate?"

**Organization:** Initiative hierarchy. Three groups:

- **[Your Project]** and its linked products and research
- **[Org]** and its linked products and research
- **Bloom** and its linked products and research
- **Cross-cutting** for projects that serve multiple initiatives or none

Each project appears as a card. The card shows:

| Field | Source | Required |
|-------|--------|----------|
| Project name | Hub file title | Yes |
| Type | `type:` frontmatter (initiative, product, research) | Yes |
| Status | `status:` frontmatter | Yes |
| Maturity | `maturity:` frontmatter (if present) | If set |
| Last updated | Most recent `last-updated:` across all files in the project folder | Yes |
| File count | Number of .md files in the project folder | Yes |
| Open questions count | Line count of Open Questions.md if it exists | If exists |
| Active tasks | Count of non-empty `task:` fields in project files | If any |
| Pending @claude flags | Count of unprocessed @claude flags in project files | If any |

**What makes this layer fail:**
- Treating all 22 projects equally. Projects where work happened this week should be visually distinct from projects that have not been touched in months. Recency is the primary visual signal.
- Hiding gaps. If a project has no maturity field, no _activity/ folder, no open questions file, that is itself information. The observatory surfaces absence, not just presence.

**Flex rule:** The initiative grouping is the default hierarchy, derived from `## Connections to Other Projects` sections in hub files (if your project hubs include them). Projects that serve multiple initiatives appear in the group where they have the strongest connection, with a cross-reference badge for others. If initiative groupings change, the lens adapts without restructuring.

---

### Layer 2: The Log

**Question:** "What happened recently and what is it building toward?"

**Source:** `Daily/Changelog.md`, parsed by date.

**Structure:** A compact timeline. Each entry shows:

| Field | Source |
|-------|--------|
| Date | Entry date header in Changelog |
| Session theme | Entry title/description |
| Projects touched | Project tags in the entry |
| Work items | Bullet points from the entry (collapsed by default, expandable) |
| Files created/modified | File lists from the entry (collapsed by default) |

**Display:** Most recent entries first. Default view shows the last 7 days. Expandable to 14 or 30. Each entry is compact: one line per day unless expanded.

**Connection to Layer 1:** Project cards in the Map layer show a heat indicator derived from how recently and how frequently the project appears in the Changelog. A project touched three times this week glows. A project not touched in two weeks is cool. The log feeds the map.

**What makes this layer fail:**
- Becoming a full session story. The log is a timeline, not a narrative. Each entry is a data point: date, projects, what changed. If the reader wants the narrative, they open the Recap or Explainer frame for that session.
- Showing only work, not direction. The Changelog entries should surface "carries forward" items and session priorities alongside completed work. What was done matters. What it is building toward matters more.

---

### Layer 3: The Queue

**Question:** "What is waiting for attention?"

Three streams, merged into one prioritized view:

**Stream 1: Task fields.** Files where `task:` has content. Each task shows the file name, the task text, and the project it belongs to. These are explicit instructions the user left in frontmatter.

**Stream 2: @claude flags.** Unprocessed `@claude` flags across the vault. Each flag shows the file name, the flag text (the instruction after @claude), and the project. These are inline instructions scattered through files.

**Stream 3: Open questions.** The most recent or most urgent questions from each project's `_activity/Open Questions.md`. Not all questions: the top 1-2 per project that represent active design tensions. The agent selects these by recency (most recently added) and by connection density (questions that reference multiple projects).

**Display:** Merged, not separated by stream. Sorted by a composite of recency and project heat (a task in a hot project ranks higher than a task in a cold one). Each item shows its source stream as a badge (task, @claude, question) so the user can see what kind of attention it needs.

**What makes this layer fail:**
- Showing everything. If there are 71 @claude mentions and 60KB of open questions, the queue is noise. The observatory curates: recent tasks first, then flags in active projects, then open questions ranked by connection density. Cap the visible queue at 15-20 items.
- Not distinguishing actionable from exploratory. A `task:` field is an instruction: do this. An @claude flag is an inline request: handle this. An open question is a design tension: think about this. They need different visual treatment even though they share a list.

---

## Input Contract

| Input | Source | Required? |
|-------|--------|-----------|
| All hub files (00 - *.md) | `Initiatives/`, `Products/`, `Research/` | Yes |
| Frontmatter from all vault files | Parsed YAML: status, maturity, last-updated, task, project, type, visibility | Yes |
| Changelog | `Daily/Changelog.md` | Yes |
| Open Questions files | `[project]/_activity/Open Questions.md` | If they exist |
| @claude flags | Grep across vault for unprocessed @claude markers | Yes |
| How It All Connects | `_/How It All Connects.md` | Yes (for initiative grouping) |
| Project folder file counts | Filesystem scan | Yes |

The Observatory is the most data-hungry lens in the system. It reads from every project, not a tagged pool. There is no content-tag mechanism here. The input is the vault itself.

---

## What the Observatory Is Not

**Not a Diagnostic Dashboard.** The Diagnostic Dashboard lens (from Lens Types) answers "what's working and what isn't" with green/amber/red health indicators. The Observatory shows state, not judgment. A project with no maturity field is not "red." It is a project with no maturity field. The reader decides what needs attention.

**Not a Project Grid.** The website's Project Grid lens answers "what are all the projects and what state are they in" for a public audience. The Observatory is internal. It shows task queues, @claude flags, and open questions that the public grid would never surface.

**Not the Home dashboard.** `! Home.md` is a static entry point with links. The Observatory is a generated snapshot that changes every time it renders. Home tells you where things are. The Observatory tells you where things stand.

---

## Dynamic Adaptation

The structure (Map, Log, Queue) does not change. The content adapts to the vault's current state.

**Early vault (few projects, sparse metadata):** The Map layer is the centerpiece. Most cards will show gaps (no maturity, no _activity/ folder). The gaps are the most useful information: they show where the vault's metadata layer needs work. The Log is thin. The Queue is short.

**Mature vault (all fields populated, activity folders everywhere):** The Log and Queue layers carry more weight. The Map becomes orientation. The Queue becomes the action surface. Heat indicators on project cards become meaningful because the Changelog has depth.

**Session-start render:** Emphasize the Queue. What needs attention right now? The Map and Log provide context for deciding where to start.

**Session-end render:** Emphasize the Log. What changed today? The Map shows the ripple effects. The Queue shows what is still waiting.

---

## Rendering Notes

The Observatory does not use the Explainer's narrative-and-pull-point architecture. It does not use the Debrief's four-tab structure. It is a single scroll with three stacked layers and an interaction model based on expand/collapse and heat.

### Interaction patterns

- **Project cards** are compact by default (name, type, status, heat indicator). Click to expand and see maturity, file count, open questions count, active tasks, last-updated date.
- **Log entries** show one line per day by default (date, theme, project tags). Click to expand and see work items and file lists.
- **Queue items** show the instruction/question text and project. Click to navigate to the source file.
- **Heat indicators** are derived from Changelog frequency. No manual input. The lens calculates heat from the data.

### Visual hierarchy

The Map is the largest layer. The Log is a compact timeline below it. The Queue is a prioritized list at the bottom. On subsequent renders, the section the user last interacted with could be promoted to the top. But for now, the order is fixed: Map, Log, Queue.

---

## Lens vs. Style

### Lens decisions (permanent)

- Three layers: Map, Log, Queue. In that order.
- Initiative hierarchy as the organizing principle for the Map.
- Changelog as the sole source for the Log. No other narrative input.
- Three streams merged for the Queue (tasks, @claude, open questions). Curated, not exhaustive.
- Heat derived from Changelog frequency. Calculated, not asserted.
- Gaps surfaced, not hidden. Missing metadata is visible.
- Single scroll. No tabs.

### Style decisions (to be defined by the design system)

- How project cards render (card grid, list, tree)
- How heat is indicated (color, glow, border weight, position)
- How initiative groups are visually separated
- How the timeline renders (vertical line, horizontal strip, compact rows)
- How expand/collapse works (accordion, inline expand, modal)
- How queue items are badged by stream
- Typography, color, spacing, responsive behavior

---

## Open Questions

- **Staleness threshold.** How many days without a Changelog mention before a project is considered "cool"? 7 days? 14? Should this be configurable per project (some projects have natural long cycles)?
- **Open question ranking.** Selecting the "top 1-2" per project for the Queue requires judgment. What heuristic works? Most recently added? Most cross-references? Most unresolved? Start with recency and iterate.
- **Render frequency.** Should the Observatory be generated once per session (session start and/or end), or should it be a living HTML that updates on vault save? For now, session-based is simpler and matches how frames work. Live rendering is a future capability.
- **Maturity adoption.** Only 6 files currently have `maturity:` set. The Observatory will surface this gap. Should the lens include a "metadata health" indicator showing what percentage of project files have each optional field populated? This would make the observatory self-improving: rendering it reveals what is missing, which prompts filling it in, which makes the next render richer.
- **Changelog format stability.** The Log layer depends on a parseable Changelog. If the format drifts, the lens breaks. Should the Changelog format be formalized in Vault File Standards?
- **Composition with other lenses.** The Observatory's Map layer is close to a Network Graph. Its Log layer is close to a Phase Timeline. Its Queue layer is close to a Diagnostic Dashboard. When lens composition is formalized, the Observatory might be expressed as a composition of three existing lens patterns rather than a standalone definition.

---

## Rendering Protocol

Before rendering a new Observatory frame:

1. **Review all prior Observatory frames.** Open each `.html` file in `03_outbox/frames/` that was rendered with `lens: observatory`. Study how the three layers (Map, Log, Queue) were realized, what data was surfaced, and how the reader navigated between system-wide view and project-level detail.

2. **Mix interaction patterns.** The Observatory lens defines structure (Map, Log, Queue layers) and purpose (vault-wide state, energy detection). It does not dictate how those layers are presented. The Map layer might use a heatmap grid, a spatial canvas, or a semantic zoom. The Log layer might use a timeline, a scrollytelling sequence, or a reactive scrubber. The Queue layer might use sortable cards, a priority matrix, or belief elicitation (ask the reader what they think needs attention, then reveal the data). Draw from the Pattern Vocabulary (your project's pattern library, if you maintain one).

3. **Improve on what exists.** Each Observatory render should surface the vault's state more effectively. If the heatmap worked, try something that adds a dimension the heatmap couldn't show. The Observatory is the most data-rich lens. It should be the most inventive.

**Rendered frames:**
- `20260401_observatory.html`

---

## Version History

**v0.1** (2026-04-01): Lens defined. Three-layer structure (Map, Log, Queue). Input contract specified. Data source audit completed: 208 active files, 14 project hubs, 6 open questions files, 1 changelog, 6 files with maturity set, 1 active task, 71 @claude mentions across 33 files.

**v0.2** (2026-04-02, Session 5): Added Rendering Protocol. Agent must review all prior Observatory frames before rendering a new one. Must mix interaction patterns from Pattern Vocabulary. The Observatory is the most data-rich lens and should be the most inventive. Rendered frames list maintained in protocol section.

---

## Connections

- the lens catalog ([[README|01_lenses README]]): Catalog of all lenses. Observatory is the first lens designed for vault-wide state.
- the lens catalog: The diagnostic dashboard and network graph patterns feed into the Observatory's Map and Queue layers.
- the Recap or Explainer lens: session-level view. The Observatory is the complement: system-level view.
- [[Explainer|Lens: Explainer]]: Narrative-driven. The Observatory is data-driven. Opposite ends of the lens spectrum.
- your agent publishing workflow: How to build frames. The Observatory may follow an abbreviated protocol (Phases 4-6 only) since it has no narrative spine.

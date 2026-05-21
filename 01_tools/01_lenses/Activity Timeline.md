---
type: lens
name: activity-timeline
for: [human, ai]
visibility: local
status: pending
---
# Timeline and Changelog

The timeline is how the packet makes work visible over time. It answers: what was I working on, when, and how does today's work connect to last month's? The changelog is the data source that feeds it.

## The Problem

A vault full of files has no inherent sense of time. Files have creation dates and modification dates, but those do not capture what happened: which projects were touched, what decisions were made, what shifted. The website's constellation map needs temporal data to show activity patterns, and the user needs a browsable record of progress.

## The Solution

Two components working together:

1. **Changelog** (`Daily/Changelog.md`) — A running log of session activity, written at the end of each work session. Each entry is dated, project-tagged, and lists what was done and what files changed.
2. **Timeline** — A binary day-by-day array generated from the changelog. For each day, it records which projects were actively worked on. No weights, no decay. Either you worked on it that day or you did not.

### Changelog format and tag vocabulary

Entry format and the canonical tag list are defined in the `/changelog` skill (`.claude/commands/changelog.md`). Each entry uses `**Projects touched:**` with project tags that auto-map to slugs, and an optional `**Private:**` line to exclude projects from the public timeline.

The generate script builds the tag-to-slug mapping from project frontmatter at build time (`generate-content.mjs:444-452`), so adding a new project with proper tags automatically connects it to the timeline.

## How It Works

### The generate script

The `generateTimeline()` function (`generate-content.mjs:439-546`) parses both changelogs, maps tags to slugs, and produces two binary arrays: `local` (all activity) and `public` (excluding `**Private:**` tagged projects). One object per day, project slugs mapped to `true`.

The `generateSessionDigests()` function (`generate-content.mjs:556-733`) merges changelog entries with session files (`Daily/Sessions/`) to produce richer per-session cards for the "Recent Logs" data lens.

### Historical enrichment

Timelines can be enriched with historical sources (e.g. parsed conversation exports) by writing entries into a `Daily/Changelog-Historical.md` file that gets merged at build time.

## When Changelog Entries Are Written

**Log as you go.** After completing a significant piece of work, Claude updates today's entry in `Daily/Changelog.md`. If no entry exists for today, one is created. If one exists, new bullets and files are added to it.

This is working rule 11 in CLAUDE.md. The `/changelog` skill (`.claude/commands/changelog.md`) defines what counts as significant and the entry format.

### Workflow

1. Work happens
2. After a milestone: update today's changelog entry (or create one)
3. Continue working
4. At session end: `/complete` reviews and finalizes the entry
5. Next `generate-content.mjs` run picks it up
6. Timeline updates on the website

### Why incremental instead of session-end

The previous approach logged everything at session end via `/changelog`. This had three problems:

1. Sessions that ended abruptly had no changelog entry
2. Reconstructing a full session from memory produced less accurate entries
3. The timeline had gaps where work happened but was not recorded

Logging as you go captures work closer to when it happens. The entry accumulates naturally throughout the session. Session-end review can still refine it, but the data is already there.

### Future considerations

- **Git-derived enrichment**: Could changelog entries be cross-referenced with git commits to catch files that were changed but not logged?
- **Hook-triggered reminders**: A post-edit hook could remind Claude to log if significant time has passed since the last changelog update

## Design Decisions

**Why binary (yes/no) instead of weighted?** Earlier versions used recency and engagement scores. Binary is simpler, more honest, and sufficient. You either worked on it or you did not. The constellation map uses this to determine which nodes are active at any point in time.

**Why a text file instead of a database?** The changelog is a markdown file in the vault. It is readable in Obsidian, version-controlled, and portable. It does not require infrastructure. This is consistent with the local-first thesis: your data is your files.

**Why two timelines (local/public)?** Some work is private. The local timeline shows everything. The public timeline respects the `**Private:**` tag. This is the timeline equivalent of the visibility system: you control what is visible, and the default is private.

**Why manual entry instead of automated?** Automated logging (from git, file watchers, etc.) captures what changed but not what mattered. A human-written entry says: "Built the visibility system" rather than "edited 8 files." The narrative is the value. Automation could supplement but not replace the human summary.

## Connections to Other Projects

- **Your project hub** is the parent surface that links to the timeline.
- **Historical-data lenses** rely on the export-parse-map pattern: bring an external archive into the timeline.
- The `/changelog` and `/complete` skills are examples of structured human-agent session workflows.

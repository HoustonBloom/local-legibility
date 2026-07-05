---
type: instructions
subject: workflows
for: [human, ai]
visibility: local
---
# Workflows

Ten Claude Code skills. Each is a slash-command or a named routine your AI can invoke. Installed into `~/.claude/skills/` on setup. The folder names here match the skill names.

```
04_workflows/
├── scan/SKILL.md                ← /scan · surface pending flags, recent work, carryover
├── complete/SKILL.md            ← /complete · hand the next session a baton
├── changelog/SKILL.md           ← /changelog · log shipped milestones, project-tagged
├── cut-packet/SKILL.md          ← produces a frame from a cut config
├── check-gallery/SKILL.md       ← apply favorite / deprecate marks from Gallery.html
├── artifact-sourcing/SKILL.md   ← source new artifacts from prior ones, catalog-first + verified
├── display-palette/SKILL.md     ← the full presentation pattern set, by information shape
├── narrative-overhaul/SKILL.md  ← full teardown + rebuild when a page "just isn't working"
├── yaml-audit/SKILL.md          ← normalize frontmatter across the vault
└── figma-mcp/SKILL.md           ← Figma MCP API conventions (fires on any Figma tool call)
```

`SKILL.md` filenames are load-bearing. Don't rename them. Folder names are the skill's public name.

---

## Session hygiene · the three slash commands

Three things are usually waiting when you sit down. These three workflows used together make the transitions between sessions legible.

### `/scan` · surface what's already there

Three waiting buckets, walked in order and presented as one list:

1. **Pending flags.** `@claude` inline, inbox items, `@sort/` contents, unfinished checkboxes.
2. **Recent activity.** Most-edited files, latest changelog entries, current focus.
3. **Last close-out's handoff.** Whatever your previous session said to carry forward.

### `/complete` · hand the next session a baton

The most underrated continuity move. At session end, name what's next in plain language. The skill writes a session note. The next `/scan` reads it back. The next session opens already oriented.

The pattern that works: not a retrospective. One or two sentences. *"Tomorrow we ship the pricing page."* That's the baton.

### `/changelog` · log progress as you ship

When you ship a meaningful milestone, append one line to `Daily/Changelog.md` with project tags. Builds a browsable arc over weeks.

Log as you go, not just at session end. Captures work even if a session ends abruptly.

---

## Content production

### `cut-packet` · produces a frame

The central engine. Reads a cut config, resolves content from `visibility:` tags, picks a publishing template (auto or explicit), applies contact profile overlay if specified, renders HTML, writes to the config's `output:` path, rebuilds the gallery index.

Full spec: [[cut-packet/SKILL]].

### `check-gallery` · apply marks made in Gallery.html

Gallery.html lets you browse every frame and window. Marks (★ favorite / 🗑 deprecate) held in `localStorage` until exported. This skill applies the export to disk: updates `_favorites.json`, moves deprecated frames to `_deprecated/`, rebuilds the index.

Bridge pattern: static HTML can't write to disk. Exporting JSON and letting a skill apply it is the portable, auditable fix.

---

## Quality · reuse without staleness, display without reflex, rework without timidity

Three workflows that compose into one loop: find what the corpus already holds, present it deliberately, and rebuild hard when a page fails.

### `artifact-sourcing` · reuse-over-rebuild with a verification gate

Prior artifacts are searched through two generated indexes (a greppable catalog and per-artifact text sidecars), verified against their canonical sources before reuse (freshness is recorded state: STALE marks, verified stamps), and every sourcing decision is logged. At 10 logged artifacts, the scan prompts a self-audit. Full spec: [[artifact-sourcing/SKILL]].

### `display-palette` · the full pattern inventory, by information shape

Answers "am I using everything available in the way that best serves this?" One doc, one row per pattern with measured usage and an exemplar; names the corpus's reflex patterns, the underused tail, and the honest gaps. Consulted in every display pass. Full spec: [[display-palette/SKILL]].

### `narrative-overhaul` · teardown and rebuild when a page isn't working

Invocation is permission: reader contract with register calibration, structural fault list, new spine with ONE checkpoint, full rebuild, a walkthrough simulated as the target reader, mechanical verification against the vault's writing rules. Kills the thirty-prompts-of-timid-patching failure. Full spec: [[narrative-overhaul/SKILL]].

---

## Utilities

### `yaml-audit` · normalize frontmatter

Walks the vault, reports frontmatter drift (missing required fields, inconsistent casing, typo'd field names), optionally fixes in place. Run before a packet rebuild to catch issues early.

### `figma-mcp` · Figma MCP API working memory

Fires automatically when your AI uses any Figma MCP tool (`use_figma`, `get_design_context`, etc.). Captures API traps learned in production (reactions, variable modes, prototype nuances) so your AI doesn't relitigate them every session.

---

## They're independent

Use one. Use some. Use all. They compose well but none requires the others.

## Installation

```bash
# Claude Code:
for skill in scan complete changelog cut-packet check-gallery artifact-sourcing display-palette narrative-overhaul yaml-audit figma-mcp; do
  cp -r 01_tools/04_workflows/$skill ~/.claude/skills/$skill
done

# Cursor: into .cursor/rules/ as appropriate
```

## Path conventions

These workflows assume:
- An inbox folder (`00_inbox/`)
- A daily changelog (`Daily/Changelog.md`)
- A sessions folder (`Daily/Sessions/`)
- An outbox folder (`03_outbox/`)

The adapter prompt remaps these to your actual paths if they differ.

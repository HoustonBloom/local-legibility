---
type: instructions
subject: workflows
for: [human, ai]
visibility: local
---
# Workflows

Six Claude Code skills. Each is a slash-command or a named routine your AI can invoke. Installed into `~/.claude/skills/` on setup. The folder names here match the skill names.

```
04_workflows/
├── scan/SKILL.md           ← /scan · surface pending flags, recent work, carryover
├── complete/SKILL.md       ← /complete · hand the next session a baton
├── changelog/SKILL.md      ← /changelog · log shipped milestones, project-tagged
├── cut-packet/SKILL.md     ← produces a frame from a cut config
├── yaml-audit/SKILL.md     ← normalize frontmatter across the vault
└── figma-mcp/SKILL.md      ← Figma MCP API conventions (fires on any Figma tool call)
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

The central engine. Reads a cut config, resolves content from `visibility:` tags, picks a lens (auto or explicit), applies contact profile overlay if specified, renders HTML, writes to the config's `output:` path.

Full spec: [[cut-packet/SKILL]].

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
for skill in scan complete changelog cut-packet yaml-audit figma-mcp; do
  cp -r 01_tools/04_workflows/$skill ~/.claude/skills/$skill
done

# Cursor: into .cursor/rules/ as appropriate
```

## Path conventions

These workflows assume:
- An inbox folder (`00_inbox/`)
- A daily changelog (`Daily/Changelog.md`)
- A sessions folder (`Daily/Sessions/`)
- A cuts/output folder (`03_cuts/`)

The adapter prompt remaps these to your actual paths if they differ.

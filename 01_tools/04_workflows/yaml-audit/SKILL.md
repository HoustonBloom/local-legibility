---
name: yaml-audit
description: Normalize YAML frontmatter on .md files in the Local Intelligence Packet to the bare-minimum schema. Use when the user integrates a new file into the packet, says "normalize the yaml", "audit the frontmatter", "fix the yaml", or drops a new lens/atmosphere/template/instructions/workflow doc into the packet folders. Also triggers when the user asks to "integrate" a file, "add this to the packet", or mentions a file that needs frontmatter cleaned.
---

# YAML Audit

Normalize YAML frontmatter on `.md` files inside `00_cultivate-local-intelligence/Local Brain/`. The goal is a minimal, purpose-driven frontmatter : just enough to identify the file's type, audience, and visibility. No date fields (the filesystem knows), no verbose tag arrays, no project: references that duplicate the folder context.

## When to run

- A new file has been added to the packet (lens spec, atmosphere spec, ABOUT doc, template, workflow guide, prompt)
- An existing file has accumulated frontmatter drift and needs to be cleaned
- The user asks to normalize, audit, or fix YAML

**Do NOT run on:**
- `SKILL.md` files (Claude Code harness reads a specific format : leave alone)
- Files inside `_examples/` (HTML, not MD)
- Files inside `local-brain-preview/` (separate subsystem)

## Schema (bare minimum, by file type)

### Lens spec
Path: `01_tools/01_lenses/<Name>.md` (not underscore-prefixed, not ADDING-*, not ABOUT-*)
```yaml
---
type: lens
name: <slug>                 # lowercase, hyphens (e.g. reel, storyboard-editorial)
for: [human, ai]
visibility: local
status: active | pending     # pending if no rendered example exists yet
---
```
`active` when `_examples/example-<slug>.html` exists; `pending` otherwise.

### Atmosphere spec
Path: `01_tools/02_atmospheres/<Name>.md` (not underscore-prefixed, not ADDING-*, not ABOUT-*)
```yaml
---
type: atmosphere
name: <slug>                 # single lowercase noun
for: [human, ai]
visibility: local
status: active | pending
---
```
`active` when `_examples/<slug>.html` exists; `pending` otherwise.

### ABOUT-X.md (orientation / instructions doc)
```yaml
---
type: instructions
subject: <lenses, atmospheres, contacts, workflows, overview, design-system, vault-canon, activity, outbox, inbox>
for: [human, ai]
visibility: local
---
```

### ADDING-X.md (workflow / how-to doc)
```yaml
---
type: workflow
subject: <lens, atmosphere, component>
for: [human, ai]
visibility: local
---
```

### `_template.md` (scaffold)
```yaml
---
type: template
subject: <lens, atmosphere, person, style-source, window>   # what type the template produces
for: [human, ai]
visibility: local
---
```

### CUTS-SPEC.md
```yaml
---
type: spec
subject: cuts
for: [human, ai]
visibility: local
---
```

### ADAPTER-PROMPT.md
```yaml
---
type: prompt
subject: adapter
for: [human, ai]
visibility: local
---
```

### Style-source (`01_tools/03_design-system/<name>.md`)
```yaml
---
type: style-source
name: <name>
for: [ai]
visibility: local
---
```
`for: [ai]` because style tokens are primarily consumed by the render skill, not read by humans for meaning.

## Workflow

1. **Identify file type from path + filename.** Use the rules above. If the path doesn't match any rule, flag it and ask the user where the file belongs : do not invent a type.

2. **Preserve the body.** Read the file, extract everything below the existing frontmatter (if any). Do not modify the body content.

3. **Generate new frontmatter** from the schema matching the file type.

4. **Write back.** New frontmatter + original body. Single YAML block, no trailing spaces, closing `---` followed by one newline then the body.

5. **Report what changed.** Print a short diff of the old YAML vs. new YAML so the user can confirm.

## Fields to drop if found

These fields were common in older frontmatter and should be removed unless the user explicitly asks to keep them:

- `date`, `last-updated` : filesystem tracks this
- `project` : folder context implies this
- `tags` : derivable from path + type
- `aliases` : keep only if they're functionally needed for wikilink resolution
- `author` : vault is single-author; implicit
- `version` : use Git or file history
- `phase`, `category`, `brand`, `maturity` : keep only if downstream tooling consumes them
- `example:` : discoverable from folder structure

## Fields to ADD if missing

- `type` : required on every file
- `for:` : always `[human, ai]` unless style-source (`[ai]`) or you know the audience is single
- `visibility` : default to `local` for packet files; `public` only if intentionally shipped
- `status` : for lens/atmosphere specs only; derivable from whether an example exists

## Special cases

### SKILL.md files
Leave untouched. Claude Code harness reads `name:` and `description:` from these and interprets them specially. Do not attempt to normalize.

### Content files outside the packet
This skill only applies to `00_cultivate-local-intelligence/Local Brain/`. For vault-level content files (daily notes, cut configs in `03_outbox/`, person profiles in `People/`), use a different schema : the vault's general convention from `CLAUDE.md`.

## Reference implementation

A working script that implements this exact logic: `yaml-audit.mjs` in this skill's folder. Run it directly for a full-packet sweep:

```
node "00_cultivate-local-intelligence/Local Brain/01_tools/04_workflows/yaml-audit/yaml-audit.mjs"
```

The script walks all `.md` files in the packet, determines type by path, and rewrites frontmatter. Prints a summary of what changed.

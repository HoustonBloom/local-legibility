---
type: workflow
subject: component
for: [human, ai]
visibility: local
---
# Adding a new component (lens or atmosphere) — shared workflow

Both lenses and atmospheres are composed design artifacts that slot into the Local Intelligence system at specific surfaces. This doc captures the **steps that are the same** for either one. For the steps that differ, see:

- [[../01_lenses/ADDING-A-LENS|Adding a lens]]
- [[../02_atmospheres/ADDING-AN-ATMOSPHERE|Adding an atmosphere]]

Do not duplicate the shared steps below into the specific docs. Reference this.

---

## 1. Draft the spec from a template

Copy the appropriate template into the canonical folder:

| Component | Template | Canonical folder |
|---|---|---|
| Lens | [[../01_lenses/_template]] | `01_tools/01_lenses/` |
| Atmosphere | [[../02_atmospheres/_template]] | `01_tools/02_atmospheres/` |

Rename the copy to the component's canonical name (Title Case for lenses, single Word for atmospheres).

## 2. Fill every required frontmatter field

Both component types require:

```yaml
type: source-doc      # do not invent a new type; your vault uses source-doc for both
category: lens        # or: atmosphere — this is the semantic category
date: YYYY-MM-DD
status: [active, draft]
visibility: local
version: v0.1.0       # semver so changes are traceable
last-updated: YYYY-MM-DD
tags: [source-doc, <category>, <name-slug>]
```

A component without complete frontmatter should not be merged. If a draft is missing values, leave it in `@sort/` and flag the gaps.

## 3. Fill the body sections listed in the template

Every template has a fixed set of required `##` sections. Skipping one silently leaves a downstream validator guessing. If a section genuinely does not apply, write `Not applicable` with a one-sentence reason — do not delete the heading.

## 4. Create a reference implementation

Every component must ship with at least one rendered sample so a human can see what it actually looks like.

| Component | Sample location |
|---|---|
| Lens | `00_cultivate-local-intelligence/Local Brain/01_tools/01_lenses/_examples/example-<slug>.html` |
| Atmosphere | `01_tools/02_atmospheres/_examples/<name>.html` |

The sample must be self-contained (no external asset dependencies beyond Google Fonts) and open correctly when double-clicked.

## 5. Normalize filenames

- **Lens spec:** `Title Case.md` (e.g. `Storyboard Editorial.md`) to match the existing library.
- **Atmosphere spec:** `Name.md` (single noun, capitalized, e.g. `Field.md`).
- **Sample:** lowercase slug with hyphens, `.html` extension.

If normalization collides with an existing file, stop and ask — do not overwrite.

## 6. Versioning

Bump `version` in frontmatter when the component's contract changes (new required field, renamed section, changed output shape). Git history is the historical record — do not carry old versions inside the packet.

## 7. Validate

Before considering the addition shipped:

- Required frontmatter present and filled
- All required body sections present and filled (or marked `Not applicable`)
- Sample file exists and opens in a browser
- No naming collisions with existing files
- Registry surfaces updated (per the component-specific doc)

If a validator script exists, run it. If not, walk the list above by hand.

## Rules that apply to both

- **Never overwrite an existing component silently.** If a name collides, rename the new one or ask.
- **Do not invent frontmatter fields.** If you need a new field, add it to this doc and both templates first, then use it.
- **Flag gaps.** If a draft has blanks, the drafter fills them. Do not guess on behalf of the author.

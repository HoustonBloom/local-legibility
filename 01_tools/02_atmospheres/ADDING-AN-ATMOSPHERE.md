---
type: workflow
subject: atmosphere
for: [human, ai]
visibility: local
---
# Adding an atmosphere

Start with the [[../00_overview/ADDING-COMPONENTS|shared workflow]] and complete steps 1-7 first. This doc covers the **atmosphere-specific** surfaces after the shared steps.

Atmospheres are a newer category than lenses. The integration surfaces are simpler right now. Most of the sophistication of the lens pipeline (catalog UI, build script base64 injection, skill registration) does not yet exist for atmospheres. See [[README|the atmospheres charter]] for the category definition.

---

## What an atmosphere is (short version)

An atmosphere is the ambient background layer of an artifact : a particle field, a gradient wash, a grain-textured dark backdrop. It occupies `z-index: 0`, `position: fixed; inset: 0`, and has `pointer-events: none`. Lenses, components, and text stack on top. The atmosphere does not know or care what is above it.

Full charter in [[README]].

---

## Atmosphere-specific integration surfaces

### 1. Atmosphere spec

`01_tools/02_atmospheres/<Name>.md`

Copy from [[_template]] and fill every required section. Name is a single capitalized noun (`Field`, `Liquid`, `Grain`). Do not use file extensions in the name : the file is `Field.md`, the atmosphere name is `Field`.

### 2. Reference implementation

`01_tools/02_atmospheres/_examples/<name>.html`

Name is the lowercase version of the atmosphere (`field.html`). The file is a complete, self-contained HTML demo: the atmosphere rendered at fullscreen, plus enough sample text on top to show how content sits above it.

### 3. Update the charter

`01_tools/02_atmospheres/README.md`

Add the new atmosphere to the library list inside the charter, with a one-line description of its feel. Example entry:

```markdown
- **Field** : Particle flow, dark graphite with sky-blue particles, four-phase slow cycle.
```

Keep the library list alphabetical.

---

## Gaps that still exist (future work : not required today)

When the user asks to close these, plan them as separate tasks.

- **No catalog UI for atmospheres.** The Packet's 00 HTML has a `Lenses` tab, no `Atmospheres` tab yet. When this lands, atmospheres will also need to register in a `lens-catalog`-equivalent and the build script.
- **No cut config field for atmospheres.** Cut configs cannot reference an atmosphere in their frontmatter today. When added, it'll likely be an `atmosphere:` field that resolves to `01_tools/02_atmospheres/<Name>.md`.
- **No skill awareness.** The cut-packet skill does not yet read atmospheres or include them in rendered output. Adding this requires teaching the skill to inject the atmosphere's HTML implementation behind the lens-rendered content.

These gaps are intentional for now : atmospheres currently work as a standalone system (drop the atmosphere HTML behind anything manually). Productizing the handoff is a separate scope.

---

## Validation checklist (atmosphere-specific)

- [ ] Spec exists at `01_tools/02_atmospheres/<Name>.md` with complete frontmatter
- [ ] Example exists at `01_tools/02_atmospheres/_examples/<name>.html` and opens cleanly
- [ ] Example demonstrates the z-index contract (atmosphere at 0, sample content above)
- [ ] Charter library list updated
- [ ] No naming collision with existing atmospheres
- [ ] Spec documents what's configurable vs. what's fixed
- [ ] Spec documents `prefers-reduced-motion` behavior

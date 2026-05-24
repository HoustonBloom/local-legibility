---
type: instructions
subject: lenses
for: [human, ai]
visibility: local
---
# Lenses

A **lens** is a rendering system. It turns a cut config plus tagged content into a finished HTML frame. Lenses define structure: layout, sections, components, the visual grammar of the output. Lenses also carry voice defaults (tone and emphasis) that apply when the cut config body does not override them.

Audience-specific voice lives in the contact profile overlay (see [[../05_contacts/README|Contacts]]). Ambient background is the atmosphere's job (see [[../02_atmospheres/README|Atmospheres]]). Visual tokens are the design system's job (see [[../03_design-system/README|Design System]]).

---

## Currently shipped lenses

Every lens has a spec doc and a live example under [[_examples]]. Click a View example button in the packet catalog to preview each.

| Lens | Role | Spec |
|---|---|---|
| Reel | 5 to 9 slide scrollable audience deck | [[Reel]] |
| Explainer | Numbered beats with file previews + margin notes | [[Explainer]] |
| Pitch | 11-slide live-pitch slideshow with presenter mode and five capital-type variants | [[Pitch]] |
| Product Website | Single-page conversion-shaped marketing site | [[Product Website]] |
| Company Website | Multi-page bundled company site with tabbed nav | [[Company Website]] |
| First Look | Kit onboarding audit of a folder | [[First Look]] |
| Share | One-item-at-a-time stumble with per-item display modes + recap | [[Share]] |
| Observatory | Live-status constellation view of a project (spec only; example pending) | [[Observatory]] |
| Storyboard Editorial | Editorial storyboard frames with SVG scenes (spec only; example pending) | [[Storyboard Editorial]] |
| Activity Timeline | Timeline of activity across the vault | [[Activity Timeline]] |


---

## Want to…

How you (or the cut-packet workflow) pick a lens.

| I want to… | Audience | Reading posture | Lens |
|---|---|---|---|
| Orient myself in my own folder | me, just installed | browser | First Look |
| Scan my vault right now | me | desktop | Observatory |
| Explain an idea to a friend in a DM | 1 person | phone, thumbs | Reel |
| Get a specific decision made | 1 decision-maker | email, 5 min | Pitch |
| Walk someone through research + artifacts | curious reader | desktop, long read | Explainer |
| Sell one offering to one buyer persona | narrow | browser, skim | Product Website |
| Show "this is a real company" | multiple personas | email attachment | Company Website |
| Let the reader feel the system before explaining it | general | desktop | Storyboard Editorial |
| Show what shipped, over time | small team | desktop | Activity Timeline |
| Hand a batch of captured items with synthesis recap | 1-small group | phone or browser | Share |

---

## How lenses compose with other system elements

**Lens = structure and voice defaults.** The layout, the sections, the responsive behavior, plus default tone, emphasis, and de-emphasis when the cut doesn't specify its own.

**Contact overlay = audience-specific tuning.** When a cut targets a specific contact, their profile's `Rendering Preferences` section layers on top of the lens defaults. See [[../05_contacts/README|Contacts]].

**Atmosphere = ambient layer.** Particle field, gradient wash, grain texture. Sits at `z-index: 0` beneath the lens's content. See [[../02_atmospheres/README|Atmospheres]].

**Composition stack when rendering a cut:** Cut config body > contact overlay > lens defaults > style-source tokens. Atmosphere sits underneath at z-index 0 when active.

---

## Authoring a new lens

See [[ADDING-A-LENS]] for the step-by-step workflow. Copy [[_template]] to start. The shared component workflow that applies to both lenses and atmospheres is in [[../00_overview/ADDING-COMPONENTS|Adding a component]].

---

## File layout

```
01_tools/01_lenses/
├── README.md                  ← this doc
├── ADDING-A-LENS.md           ← authoring workflow
├── _template.md               ← lens spec scaffold
├── Reel.md, Explainer.md, …   ← lens specs
├── _examples/
│   ├── example-reel.html
│   ├── example-explainer.html
│   └── …                      ← one rendered sample per lens
├── welcome.html, workflow.html,
│   about.html                 ← packet window source frames (bundled into Getting Started.html;
│                                not lenses, but the build pipeline reads from here)
```

---

## Conventions

- **Spec filename:** Title Case (`Reel.md`, `Company Website.md`, `Storyboard Editorial.md`).
- **Example filename:** lowercase with hyphens (`example-reel.html`, `example-storyboard-editorial.html`).
- **Frontmatter:** `type: source-doc`, `category: lens`, `version: vX.Y.Z`. See [[_template]] for the full required set.

---

## Future lenses (not yet implemented)

- `trust-dashboard`: provenance audit view across multiple cuts
- `project-overview`: single project deep dive (different from Observatory: archival vs. live)
- `diff-lens`: what changed between two dates
- `research-brief`: academic-style summary

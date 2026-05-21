---
type: workflow
subject: lens
for: [human, ai]
visibility: local
---
# Adding a lens

Start with the [[../00_overview/ADDING-COMPONENTS|shared workflow]] and complete steps 1–7 there first. This doc covers the **lens-specific** surfaces after the shared steps.

A lens is a rendering system — it turns a cut config plus tagged content into a finished HTML frame. Lenses live in the packet (`00_cultivate-local-intelligence/Local Brain/01_tools/01_lenses/`) and are registered in multiple places so the build pipeline, the catalog UI, and the cut-packet skill all know about them.

---

## Lens-specific integration surfaces

Every new lens must land in **all five** of these places. A lens registered in only some of them will silently fail downstream.

### 1. Lens spec

`00_cultivate-local-intelligence/Local Brain/01_tools/01_lenses/<Title Case Name>.md`

Copy from [[_template]] and fill every required section. The spec is authoritative — the catalog card and skill description both summarize from here.

### 2. Reference implementation (example render)

`00_cultivate-local-intelligence/Local Brain/01_tools/01_lenses/_examples/example-<slug>.html`

Slug is lowercase with hyphens, e.g. `example-storyboard-editorial.html`. The file must be a complete, self-contained HTML document that renders as the canonical reference for what this lens produces.

### 3. Build script registry

`00_cultivate-local-intelligence/Local Brain/01_tools/00_overview/build-window-frames.mjs`

Add a line to the `EXAMPLE_FRAMES` object:

```js
EXAMPLE_<SLUG_UPPER>: path.join(LENSES_DIR, '_examples', 'example-<slug>.html'),
```

The build script reads every entry and base64-encodes the payload into the bundled Kit HTML. If you skip this step, the catalog's preview for your lens will be empty.

### 4. Lens catalog card

`00_cultivate-local-intelligence/Local Brain/01_tools/00_overview/lens-catalog.html`

Add two things:

**A `<section class="lens">` card** in the body of the catalog, with:

- A preview SVG thumbnail (hand-drawn mini-representation of the lens's structure)
- `.lens-body` containing meta, `<h2>`, tagline, what/why sections
- A `<button class="view-btn" data-example="example-<slug>" data-lens="<Display Name>">View example →</button>`

Place the section in **rank order** — the catalog reads top-down as "ranked best-fit first".

**A template placeholder at the bottom of the catalog:**

```html
<script type="text/html" id="example-<slug>">{{EXAMPLE_<SLUG_UPPER>}}</script>
```

The build step replaces `{{EXAMPLE_<SLUG_UPPER>}}` with the base64-encoded sample so clicking "View example" opens the sample in a modal.

### 5. Skill registration

`00_cultivate-local-intelligence/Local Brain/01_tools/04_workflows/cut-packet/SKILL.md`

Add the lens name + one-paragraph description to the **Currently shipped lens types** section. This is what the cut-packet skill references when resolving `lens:` in a cut config. A lens missing from here will not be recognized by the skill even if the spec and catalog card exist.

### 6. Rebuild the packet window

Run the build script:

```
node 00_cultivate-local-intelligence/Local Brain/01_tools/00_overview/build-window-frames.mjs
```

This regenerates `Getting Started.html` with the new lens's payload injected. Verify the file size went up, no build errors, and the verifier (`verify-window-frames.mjs`) passes.

---

## What to surface when existing cuts could use the new lens

Search the vault for cut configs whose `lens:` field matches or could match the new lens. Do **not** auto-update existing cuts. Instead:

- List the candidate configs in the handoff report
- Note which ones the user might want to rerender through the new lens
- Leave the decision to the user

---

## Validation checklist (lens-specific)

- [ ] Spec exists at `01_lenses/<Title Case Name>.md` with complete frontmatter
- [ ] Example exists at `01_lenses/_examples/example-<slug>.html` and opens cleanly
- [ ] Added to `EXAMPLE_FRAMES` in `build-window-frames.mjs`
- [ ] `<section class="lens">` card added to `lens-catalog.html`
- [ ] Template placeholder `<script type="text/html" id="example-<slug>">` added at bottom of catalog
- [ ] Lens name + description added to `SKILL.md`
- [ ] Build runs clean (`build-window-frames.mjs`)
- [ ] Verifier passes (`verify-window-frames.mjs`)
- [ ] Kit README lens count updated (optional, but keep in sync)

---
type: instructions
subject: outbox
for: [human, ai]
visibility: local
---
# Outbox

Your shippable outputs live here. When the cut-packet workflow produces a frame, its `output:` field points inside this folder. Bundled windows and finished publishable work also land here.

**`first-look.html` lands here first.** The adapter prompt's Step 2 generates this audit on the very first run — open it in your browser to see what was found, how every lens ranks for your content, and copy-paste prompts for each. If it isn't here yet, re-run the adapter prompt or tell your AI: "produce the first-look audit before anything else."

## Suggested layout

```
03_cuts/
├── first-look.html                           ← onboarding audit (generated on first adapter run)
├── frames/                                   ← rendered frames + their cut configs (peers)
│   ├── 20260419_my-first-cut_config.md
│   └── 20260419_my-first-cut.html
├── _window-MyProject.md                      ← window manifests (one per window)
├── My Project.html                           ← bundled window outputs (sendable single file)
└── 00_public/                                ← finished work ready to share outside the vault
    ├── 00_assets/                            ← shared images referenced by published outputs
    └── 20260419_example-will-good-technologies-vision/
```

- **Frames** are individual rendered HTML files plus their cut configs. Date-prefixed for sort order.
- **Window manifests** (`_window-*.md`) define which frames make up a tabbed window.
- **Bundled windows** are the shareable single-file outputs you send to people.

## Conventions

- Date prefix: `YYYYMMDD_concept-descriptor.html` (and `_config.md` for the matching config)
- Underscore prefix on window files (`_window-*.md`, `_Window Name.html`) marks them as system files
- Bundled outputs: capitalized brand name (e.g. `My Project.html`)

The cuts skill follows these conventions automatically when given an `output:` path under this folder.

# Local Brain

A vault-agnostic publishing system. Turn any folder of markdown into shareable HTML artifacts, curated for one audience at a time. Bring your own folder structure; Local Brain adapts.

## Quickstart

1. Drop this folder somewhere alongside your existing notes folder (or anywhere you like).
2. Open `Getting Started.html` in any browser. It reads the packet through itself: Welcome, browseable Lenses with live previews, Workflows, and About.
3. From the Welcome tab, copy the adapter prompt and paste it into your AI assistant (Claude Desktop, Claude Code, Cursor, ChatGPT with file access, or anything that can read local files). Tell the assistant where the packet lives and where your content lives.
4. The assistant produces a First Look audit at `03_outbox/first-look.html` in your folder, ranks every lens against your content, and offers to generate your first frame.

That's the whole onboarding. The packet does the rest as you ask for things.

## The four top-level folders

The numbering encodes a workflow: capture, work, log, ship.

| # | Folder | What happens here |
|---|---|---|
| **00** | `00_inbox/` | Drop anything here mid-work. Process it later through a scan workflow. |
| **01** | `01_tools/` | The machinery. Lenses, atmospheres, design tokens, workflows, contacts. You rarely open this unless you're authoring. |
| **02** | `02_activity/` | System-shape changelog. When a lens gets added, a convention changes, or the packet itself is rebuilt, it's logged here. |
| **03** | `03_outbox/` | Everything you produce. Rendered frames, bundled windows, public deliverables. |

`Getting Started.html` is the self-contained entry point: a tabbed window with everything a first-time user needs.

## What lives inside `01_tools/`

Also numbered, by authoring sequence: pick a lens, optionally choose an atmosphere, tune the design system, run a workflow to produce the output.

| # | Folder | Contents |
|---|---|---|
| **00** | `00_overview/` | Specs the whole system shares: `CUTS-SPEC.md`, `ADAPTER-PROMPT.md`, `ADDING-COMPONENTS.md`, `Design Principles.md`. Build scripts and the lens catalog source. |
| **01** | `01_lenses/` | Rendering patterns. Each lens has a `.md` spec and an `_examples/` placeholder template. |
| **02** | `02_atmospheres/` | Ambient background layers applied beneath lens content. |
| **03** | `03_design-system/` | Shared visual tokens (colors, fonts, spacing, shadows). The packet ships `default-tokens.md` as a starter; copy and adapt. |
| **04** | `04_workflows/` | The `cut-packet` engine plus siblings (`yaml-audit`, `changelog`, `figma-mcp`, `complete`, `scan`). |
| **05** | `05_contacts/` | One profile per collaborator. When a cut is aimed at someone specific, their profile overlays rendering preferences on top of the lens defaults. |

Your produced frames live in `03_outbox/`. Open them directly from the file system, or build your own bundled index when you have enough frames to want one.

## The publishing pipeline

Local Brain renders curated HTML frames from selected vault files, shaped by audience.

- **Cut configs** select content (by visibility tag) and audience.
- **Lenses** shape layout. Sixteen specs ship; two carry working examples (first-look, pitch). The other fourteen are spec-only for now: activity-timeline, anatomy, atlas, company-website, explainer, observatory, product-website, recap, reel, session-report, share, status-report, storyboard-editorial, substack. Examples land per lens as the catalog fills.
- **Contact profiles** tune voice and visual register per recipient.
- **Atmospheres** set ambient register.
- **Style-sources** supply visual tokens.

The output is a self-contained HTML file: portable, no build step, no hosting required.

## Design principles

The four commitments that govern every decision. Also the tagging vocabulary for `02_activity/` entries. Tag a change with the principle it serves, and over time you can ask *"what have I done in service of Provide an Exit this quarter?"*

- **Make harm legible.** You cannot organize against what you cannot see. The first act of any system worth building is to restore the feedback loop. Make harm visible, nameable, countable.
- **Provide an exit.** Content stays as portable markdown. No lock-in to the packet, your AI, or the cloud. Your notes never leave your folder unless you ship the output.
- **Design for sufficiency.** The pipeline is one script. The design system is one stylesheet's worth of tokens. Everything is legible. Nothing is optimized for scale it doesn't need.
- **Scale out, not up.** Federation over merger. Sovereign cells share protocols, not ownership. The packet is designed to be installed by anyone, in any folder, without a central service.

Long-form version with examples in `01_tools/00_overview/Design Principles.md`.

## Where to go next

- **First-time setup:** open `Getting Started.html`, copy the adapter prompt from the Welcome tab.
- **Browsing what Local Brain can render:** `Getting Started.html` → Lenses tab.
- **Understanding the pipeline:** `Getting Started.html` → Workflows tab, then `01_tools/00_overview/CUTS-SPEC.md`.
- **Reviewing what you've made:** open the rendered HTML in `03_outbox/` directly.
- **Tracking system changes:** write entries in `02_activity/` using `_template.md`.

## Contributing

The packet is designed to be forked. If you build a new lens, atmosphere, or workflow that other Local Brain users would benefit from, open a PR. The conventions for adding components are in `01_tools/01_lenses/ADDING-A-LENS.md`, `01_tools/02_atmospheres/ADDING-AN-ATMOSPHERE.md`, and `01_tools/00_overview/ADDING-COMPONENTS.md`.

If you fork and run with it for your own community without contributing back, that is also the design. The packet bends to you, not the other way around.

## License

Apache License 2.0. See [LICENSE](./LICENSE).

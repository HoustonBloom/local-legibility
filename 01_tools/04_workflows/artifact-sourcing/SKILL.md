---
name: artifact-sourcing
description: Source new artifacts from the corpus of prior ones, catalog-first and verified, instead of rebuilding from scratch. Use when building any new page, frame, or doc on a topic the vault has covered before, or when the user asks "haven't we already made something like this". Includes the freshness (stale/verified) protocol and the self-grading sourcing log.
last-updated: 2026-07-05
---

# Artifact Sourcing

Reuse-over-rebuild with a verification gate. Prior artifacts are searched through generated indexes (never by scanning raw files), verified against their canonical sources before reuse, and every sourcing decision is logged so the system grades itself.

## Why this exists

A corpus of rendered artifacts accumulates framing, diagrams, and display decisions that keep getting re-derived at full cost. But artifacts drift from their sources, so naive reuse propagates stale claims. This workflow makes reuse cheap (grep two generated files instead of reading megabytes of HTML) and safe (freshness is recorded state, and canon always wins).

## The two generated artifacts

Built by an index script wired to a file-write hook, so they stay current automatically. Reference implementation pattern: a node script that already scans every artifact for gallery metadata gains section, source, summary, and display extraction; measured cost on a ~300-artifact corpus was under 2 seconds full, milliseconds incremental.

1. **The catalog** (one markdown file): one compact block per artifact, every field on one line so `grep -B2 -A9 <term>` recovers a whole block. Fields: slug, date, project, lens, audience, content-tag, title, summary, section headings with anchors, display vocabulary (which presentation patterns the artifact uses), sources (parsed from its config's Inputs section), and a `freshness:` line. A stale roster sits at the top (the batch-update queue) and a deprecated roster at the bottom with explicit DEPRECATED markers so greps hit a warning instead of silence. **Grep it; never read it whole.**
2. **Text sidecars** (one .txt per live artifact): the reader-visible text with `## Heading [#anchor]` markers, so a content grep maps straight to `<artifact>.html#<anchor>`. Incremental via an mtime+size cache. Deprecated artifacts get no sidecars, so content greps cannot hit superseded text.

## The sourcing protocol

Before building a new artifact:

1. **Search the catalog** by topic OR by display pattern needed. For content questions, grep the sidecars. Open only matched sections and the artifact's config. Never scan the raw artifact folder.
2. **Text pass (accuracy).** Read the block's `freshness:` line first:
   - `verified <date>` newer than the artifact's last edit: skip re-verification.
   - `STALE`: use the canonical sources directly; never source the named sections.
   - `(unchecked)`: open the config's Inputs sources and confirm the artifact still captures them. On disagreement the source wins.
3. **On finding drift:** set `stale: true`, `stale-date:`, `stale-reason:` (one line naming what changed and which sections) in the artifact's config immediately. Offer to fix the artifact in-session. If declined, the mark stands; the catalog's stale roster is the later batch queue. When an artifact checks out, stamp `sources-verified: YYYY-MM-DD`.
4. **Display pass (fit).** The sourced artifact's format is a candidate, never a default. [Survey the display palette if one is maintained.] Evaluate against THIS audience, surface, and information shape. State the verdict in one line, naming what else was considered.
5. **Build,** reusing verified framing, structure, and assets as the floor, not the shape. Prior artifacts are evidence and raw material, not templates.
6. **Log one line** to the sourcing log (see below).

**Delegation threshold:** the catalog grep and single-section reads stay in the main session; the builder must read sourced material first-hand for the display pass to mean anything. Delegate to a subagent only when the reading is bulk (verifying against 4+ sources, a batch stale-repair pass, the audit). Bulk sweeps return conclusions, not file dumps.

## The sourcing log (self-grading)

One line per artifact built under this workflow, appended as the last step:

`date | new artifact slug | sourced (slug#anchor list, or "none found" / "none relevant") | display verdict | stale marks set | grep reformulations (count)`

**Audit cadence:** at 10 unaudited entries, the session-start scan prompts an audit: compare iteration rounds per artifact before vs after adoption (from the changelog), review the misses, check display verdicts against what shipped. Record results in the log's Audits section; re-prompt at +10.

## Keeping the chain intact

- Every new artifact config carries a complete Inputs section naming its canonical sources. The whole workflow depends on it.
- Deprecation by file move fires no write hook; after moves, refresh the indexes manually (run the build script).
- Session-start scan surfaces the stale-roster count and the audit-due check.

## Path adapter

Common defaults (Claude Code + Obsidian vault with a cuts system): catalog at `Cuts/frames-catalog.md`, sidecars in `Cuts/_text/`, sourcing log at `Cuts/_sourcing-log.md`, configs beside artifacts in `Cuts/frames/`, index script `Cuts/build-gallery-index.mjs` fired by a PostToolUse hook. Remap to your vault's actual paths; the contracts (catalog block shape, freshness fields, log line) are what matter, not the locations.

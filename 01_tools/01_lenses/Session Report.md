---
type: lens-spec
date: 2026-05-17
status: active
visibility: local
tags: [lens, session-report, exp-004, mobile-first, token-light]
last-updated: 2026-05-17
version: 0.1.0
slug: session-report
---

# Lens: Session Report

A token-light glance-and-act lens for the session-end retrospective. Renders the Check-in 3 output (EXP-004 pilot) as a quick-read HTML cut. Designed to be skimmed in under two minutes, not read end-to-end.

## When to use

At the end of every session, as part of `/complete`. The retrospective content from Check-in 3 IS the cut content. No double-authoring.

This is an internal artifact (not for external readers). You open it to confirm what got done, what's left, and what to carry forward. It is glanceable, not narrative.

## When not to use

- External-reader artifacts (use Substack, Explainer, or Briefing lens instead).
- Anything that needs audio narration (this lens has no audio player by design, see Token Discipline below).
- Anything that needs SVG diagrams (use Explainer instead).

## Inputs

The lens consumes the Check-in 3 retrospective output directly. Required fields:

- **session-start-plan**: What was promised at session start (from Check-in 1, or recap if Check-in 1 was missed)
- **delivered**: List of completed items with verification evidence (tool output, file write confirmation, etc.)
- **partial**: List of items started but not finished, each with its blocker named
- **did-not-start**: List of items planned but skipped
- **surfaced-not-in-changelog**: List of things that came up this session that are not in any changelog yet
- **carryover**: List of items for `Next Session.md`
- **metrics**: EXP-004 counts (false-done claims, "I already asked for this" moments, cut convention violations, etc.)
- **operational-misses**: List of caught mistakes worth preserving

## Output contract

- One HTML file at `Cuts/frames/YYYYMMDD_session-report.html`
- One paired config at `Cuts/frames/YYYYMMDD_session-report_config.md`
- Lens slug `session-report` appears at the end of the filename per the lens-in-filename discipline rule

### Structure (five sections, single column, mobile-first)

1. **Masthead**: date, session label, one-line title
2. **Plan vs delivered**: compact two-column table or paired blocks (one row per planned item, status pill: delivered, partial, skipped)
3. **Metrics**: stat cards in a grid (max 6), each one number with a label, color-coded by target hit (sage) or miss (foil)
4. **Operational misses**: bulleted list, each item one line
5. **Carryover**: bulleted list for `Next Session.md`

### CSS palette

Reuse the standard cuts tokens. No new palette. Sage accent for hits and safe states, foil for misses and risks, amber for partial. Stat cards reuse the pattern from the supply-chain hygiene explainer (`stat-card` class).

### Mobile-first

Single column at every breakpoint. Touch targets >= 44px. No horizontal scroll on stat grids: collapse to 1 column on narrow viewports, 2-3 on wider.

## Token discipline

This lens is explicitly token-light. The discipline:

- **No audio player.** The session-report cut is internal and glanceable, not for listen-on-the-go. Saves ~70 KB per cut. This exempts session-report from the "embed v1.1+ audio player in every new cut" rule from 2026-05-14 onward (rule was written for reader-facing artifacts).
- **No SVG diagrams.** Stat cards carry the metric load. If a section needs a diagram, the work belongs in a different lens (Explainer).
- **Minimal CSS.** Reuse existing tokens. No new components.
- **Target size: 10-15 KB per cut.** Compare to ~57 KB for a typical explainer with audio player and SVGs.

## Source of truth (no separate cut config)

The session note at `Daily/Sessions/YYYY-MM-DD-session.md` IS the canonical record of the session. The session-report cut is a rendered view of that note, not a separate document.

**Convention: skip the paired `_config.md` for session-reports.** Reduces file-pair clutter and avoids duplicating the same content across config and rendered HTML. Standard cut-config fields (audience, lens, output) are implied by the lens itself.

The HTML cut links back to two canonical sources at the top of the page:
- The matching session note (`Daily/Sessions/YYYY-MM-DD-session.md`)
- The matching changelog entry (`Daily/Changelog.md` with anchor to the dated section)

If a session-report cut ever needs feedback iteration (per the Feedback Log convention), feedback gets logged to the session note's frontmatter or body, not to a separate config file.

## Edge cases

- **No Check-in 1 was run this session.** Use the session-start exchange as the de-facto plan and note that the formal Check-in 1 was missed (also log to `_activity/` per EXP-004).
- **Session had no planned scope (e.g., reactive exploration).** Plan-vs-delivered section collapses to "Scope was reactive: [list of work that emerged]." Skip the table.
- **Session was short (<10 min).** Still write the cut. Metrics likely all zeros; that's the point of tracking.
- **Multiple sessions same day.** Filename gets `-session-2`, `-session-3` suffix: `20260517_session-report-2.html`.

## Open questions

- Should the lens auto-link to the matching `Daily/Sessions/YYYY-MM-DD-session.md` file? Probably yes, as a footer link.
- Should metrics auto-extract from `_activity/` entries tagged `exp: exp-004` (when those exist), or stay agent-narrated? Probably auto-extract once `_activity/` entries accumulate over the pilot.
- Should the lens have a 6th section for "what changed in CLAUDE.md or memory this session" (rule churn tracking per EXP-003)? Worth piloting starting session 3.

## Connection to EXP-004

This lens IS the visible output of Check-in 3. The retrospective happens in chat first, then gets rendered as the cut. The retrospective text is the source; the cut is the artifact.

The metrics section is the durable record of EXP-004 measurements per session. At session 5 of the pilot, the metrics across all five session-report cuts get aggregated to make the adopt / revise / retire decision.

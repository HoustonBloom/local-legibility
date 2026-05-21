---
type: instructions
subject: activity
for: [human, ai]
visibility: local
---
# Activity

**Log the system itself, not the work inside it.** This folder records significant changes to your setup over time: a new lens added, a folder restructured, a workflow installed, a convention revised, a contact profile promoted. Different from a project changelog (which tracks work inside projects) and different from a session log (which tracks one session). This is the log of the *shape* of the system.

Entries serve as:

- **Audit trail.** Why does the system look the way it does today? The log is the answer.
- **Fresh-Claude context.** A new AI instance reads recent entries before starting work, so it understands what changed and why.
- **Decision trace.** When something feels off, walk back through the log until you find the decision that shaped it.
- **Substrate for downstream lenses.** Entries tagged against the four design principles become the data a future quarter-report or principle-timeline lens would plot.

---

## How to use it

1. **Drop one file per significant change.** Filename: `YYYYMMDD-descriptor.md`.
2. **Copy `_template.md`** and fill the frontmatter. Set `change:` to a one-phrase summary. Set `affects:` to the relevant subsystem. Optionally tag `principles:` against the four design principles.
3. **Write four short sections.** *What changed* (factual). *Why* (reasoning). *Cascade* (follow-on work open). *Decisions made* (what was chosen and why).
4. **Keep entries short.** This is the log, not the spec. The spec lives in the feature's own files.

---

## Frontmatter

```yaml
---
type: log-entry
date: YYYY-MM-DD
change: <one phrase summarizing the change>
affects: [packet, vault, workflow-name, etc.]
principles: [make-harm-legible, provide-an-exit, ...]  # optional
for: [human, ai]
visibility: local
---
```

Principles tagging is optional per entry. When present, it produces a time-series: "everything I've done in service of Provide an Exit this quarter."

---

## Rendering activity entries as a frame

A bespoke "activity" lens is not in the packet today. Wait until the log is long enough (50+ entries) that a cross-entry view earns its place. Until then, the folder reads chronologically in plain markdown, and the `Activity Timeline` lens spec at `01_tools/01_lenses/Activity Timeline.md` describes the future cross-entry view.

---

## What does NOT belong in Activity

- **Daily project work.** Use your project changelog or daily notes.
- **Meeting notes.** Those go in `daily/meetings/` or the relevant project folder.
- **Cut configs or rendered frames.** Those belong in `03_cuts/frames/`.
- **Contact profile updates.** Edit the profile directly at `01_tools/05_contacts/<Name>.md`.
- **In-progress scratch work.** Use `00_inbox/sandbox/` for that.

---

## Deprecation

If an entry becomes obsolete or wrong, **do not delete it.** Add `status: deprecated` to the frontmatter and a `superseded-by:` pointer to whatever replaced it. History is still useful, especially in the log that tells you why the system is the way it is.

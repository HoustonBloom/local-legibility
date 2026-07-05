---
name: narrative-overhaul
description: Complete narrative teardown and rebuild of a page, frame, or doc. Use when the user says "this page isn't working", "complete narrative overhaul", "rework this", "tear it down", "it's just not landing", "start over on this", or expresses that an artifact needs fundamental rework rather than edits. Invocation IS permission to rebuild; do not patch incrementally.
last-updated: 2026-07-05
---

# Narrative Overhaul

A full teardown and rebuild of an artifact's narrative: structure, titles, register, and reader experience. Invoking this skill changes the working stance. The current artifact becomes evidence of intent, not a constraint to preserve.

## The stance (read this first)

The default agent failure this skill exists to kill: treating an overhaul request as a series of polite local edits, preserving broken structure because it exists, and making the principal spend thirty prompts dragging the page to where one rebuild would have taken it. When this skill is invoked:

- **Rebuild is the default.** Keep a sentence only if it survives the new spine on merit. "It was already there" is not merit.
- **One checkpoint, then full execution.** Align once on the diagnosis and the new spine (step 3), then execute the entire rebuild without asking permission per section.
- **Preservation happens by protocol, not by timidity.** The old version is kept (step 0), so nothing is lost by rebuilding boldly.

This is not a polish pass, a typo sweep, or a styling tweak.

## Path adapter

Where the project's instructions (CLAUDE.md, .cursorrules, README) name a writing-rules doc, a deprecation convention, contact profiles, or a sourcing workflow, use those. Where they don't, the bracketed steps degrade gracefully: skip what the vault doesn't have.

## Workflow

### 0. Preserve the old version

Follow the vault's deprecation convention (commonly: copy to a `_deprecated/` folder with `maturity: deprecated` and `superseded-by:` frontmatter, or rely on git history). For generated artifacts with a config, record the overhaul as a round note in the config. Never delete.

### 1. Establish the reader contract

Before touching a sentence, answer in writing (3 to 6 lines, shown at the checkpoint):

- **Who is this for?** From the artifact's audience field or frontmatter, or ask. [If the vault keeps contact profiles with rendering preferences, read the target's profile and apply it.]
- **What do they already know?** What vocabulary and context can be assumed.
- **What must they walk away with?** The one thing the page exists to transfer.
- **What surface?** Sent file, live walkthrough, print, phone. This drives the display choice.

**Register calibration.** The same information is stated differently per audience. Depth of assumption is the dial:

| Audience | Assumptions allowed | Vocabulary | Depth |
|---|---|---|---|
| Principal's own reference | Full internal context, project names, shorthand | Internal terms fine, compression fine | Skip fundamentals entirely |
| Collaborators | Shared project context, not internals | Define system terms on first use | Explain mechanisms, skip shared philosophy |
| Public | Nothing beyond general literacy | No insider terms without plain introduction; no unexplained acronyms | Earn every concept before using it |

A page failing register is a page written for the wrong row. Check which row the current draft was actually written for; the mismatch is often the whole diagnosis.

### 2. Diagnose structurally

One full read-through AS the target reader. Produce a fault list, not fixes:

- **Spine faults:** sections in the writer's discovery order instead of the reader's question order; sections restating each other; a missing section the reader needs before another lands.
- **Register faults:** terms this reader does not know used undefined, or over-explanation to a reader who holds the context.
- **Title decay:** titles that do not carry information standing alone; eyebrow + heading + lead trios saying one thing three ways.
- **Voice faults:** whatever the vault's writing rules ban (read that doc before this step). Common bans: AI-isms, hedging, filler intensifiers, fabricated consensus.
- **Show-don't-tell faults:** paragraphs describing what a diagram or table should show.

### 3. New spine, one checkpoint

- State the artifact's job in one sentence.
- Draft the new section spine in the reader's question order.
- Draft title candidates that pass the standalone test: the titles alone, read in order, tell the story.
- Present in ONE message: reader contract, compressed fault list, old spine vs new spine, title candidates. Get one confirmation or correction.
- Then execute completely. No further per-section permission requests.

### 4. Rebuild

- Write fresh against the new spine. Consult the old version for facts and evidence, never for structure or phrasing.
- [If the artifact-sourcing workflow is installed, pull verified material through its catalog rather than re-deriving what exists.]
- Every claim keeps its evidence. Rebuilding narrative is never license to loosen facts.
- Define terms at first use according to the register row.
- Display pass: [survey the display palette if one is maintained, and] choose the presentation the information shape and surface demand. Do not inherit the old layout by default. Name what was considered, not just what was chosen.

### 5. Walk it through as the reader

Simulate the first read, top to bottom:

- At each section: what does the reader know now, what question just formed, does the next section answer it?
- Flag every term used before its introduction for this register.
- Flag where the reader would feel talked down to or lost.
- Flag walls of prose where the surface expects scanning.

Fix what the walkthrough catches, then walk it once more. Not done until the walkthrough runs clean.

### 6. Mechanical verification

- Grep the artifact against the writing-rules ban list. Zero hits.
- Copy the titles out in order and check they tell the story alone.
- HTML artifacts: browser-verify; run whatever layout checks the vault mandates; sync mirrors if configured.

### 7. Log

Record the overhaul where the vault logs work (changelog, config round note), including the register verdict and the new spine.

## Failure modes this skill exists to prevent

1. **Timid patching.** Editing sentence by sentence inside a broken structure.
2. **Structure worship.** Keeping the old section order because rearranging feels destructive.
3. **Register bleed.** Public pages in internal vocabulary; reference pages with public-grade over-explanation.
4. **Title decay.** Headers that label instead of inform.
5. **Checkpoint sprawl.** Asking approval per section. One checkpoint at the spine, then finish the job.

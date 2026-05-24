---
type: instructions
subject: inbox
for: [human, ai]
visibility: local
---
# Inbox

**Drop things here when you don't have time to file them.** Next time you run `/scan`, your AI picks them up, adds any missing YAML, renames them if needed, and files each one into its proper home in the vault.

This is the capture step. Filing is a separate step. Don't mix them.

## How to use it

1. **During work, drop anything into this folder.** Voice memo transcripts, pasted text, screenshots, half-formed ideas, feedback from people. Filename it however makes it findable in the moment.
2. **Prefix with `@claude` when you want the AI to act on it.** Example: `@claude help me refine my cv.md`. The scan skill watches for that prefix.
3. **Run `/scan` at session start or end.** The skill walks the inbox, processes `@claude` flags, normalizes frontmatter, and files each item where it belongs.
4. **After scan, the folder should be empty or near-empty.** Anything that survives is either blocked on a decision or not yet actionable. That's a useful signal, not a failure.

## Good filenames to drop

- `@claude help me refine [thing].md`
- `idea, [what the idea is about].md`
- `[contact name] feedback YYYY-MM-DD.md`
- `[topic], [what it is].md`

Whatever lets you find it again in ten minutes is enough.

## What does NOT belong in the inbox

- **Files with a clear home.** File those directly.
- **Cut configs.** Those go in `03_outbox/frames/`.
- **Contact profiles.** Those go in `01_tools/05_contacts/`.
- **Long-running notes that will evolve.** Those belong in the relevant project folder.

The inbox is for drops. Not for work that already has a shape.

## Subfolders for bigger dumps

- `sandbox/` for prototypes that need iteration. More than a drop, less than a project.
- `<date-slug>/` for a session's worth of captures you want to keep grouped.

The scan skill walks subfolders, so organize inside the inbox however helps you.

## About this placeholder

This folder ships empty in the packet. Your real working inbox will usually live at your vault root, one level up from the packet folder. Keeping an empty `00_inbox/` here means downstream users get the capture folder the moment they install the packet.

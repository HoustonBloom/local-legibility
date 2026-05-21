---
name: complete
description: Save session state, write carryover, run session end review. Use at end of any working session.
---

# /complete — Save Session

Save session state before ending a work session. This creates continuity for the next `/memory` load.

## Instructions

1. Ask the user: "What felt important about this session? Anything I should carry forward?"
2. Create a session note at `Daily/Sessions/YYYY-MM-DD-session.md` (use today's date, append a number if multiple sessions in one day: `-session-2.md`).
3. The session note should contain:

```yaml
---
type: session
date: YYYY-MM-DD
status: active
tags: [session]
---
```

4. Session note body:
   - **Worked on:** List what was done this session (files created, edited, decisions made).
   - **Decisions:** Any choices or directions confirmed.
   - **Open questions:** Unresolved threads that need future attention. If a question is project-specific and durable (not just "what to do next"), also add it to that project's `_activity/Open Questions.md`.
   - **Next steps:** Concrete next actions for the next session.
   - **Files modified:** List of files changed during this session.

5. **Save carryover tasks.** Create `@sort/Session Carryover - YYYY-MM-DD.md` with all remaining tasks from this session, organized by priority:
   - **P0:** High impact, needed for system integrity
   - **P1:** Completing current pipeline or feature work
   - **P2:** Vault maintenance and documentation
   - **P3:** Future features and vision work
   - **Misc:** Notes, research items, things to remember

   Each task is a checkbox (`- [ ]`) with a bold title and brief description. The `/scan` skill picks this up at the start of the next session.

6. **Run Session End Review** per CLAUDE.md: review work against How It All Connects and the four design principles. Suggest content ideas, vault updates, website updates, and new cross-links.

7. If today's daily note exists in `Daily/`, update its "Session Log" section with a brief one-line summary of this session.

## Output Format

Confirm what was saved. Keep it brief: "Session saved. Next time, we'll pick up with [next steps]."

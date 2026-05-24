# /changelog : Log Session Activity

Append a timestamped, project-tagged entry to the running changelog. This creates a browsable record of all work done across sessions, visible inside Obsidian and feeding the website timeline.

## When to Log

**Log as you go, not just at session end.** After completing a significant piece of work (shipping a feature, processing a batch of tasks, making a structural decision), append or update today's changelog entry. This captures work even if the session ends abruptly.

Significant work means:
- A feature was built or meaningfully changed
- Files were created, moved, or restructured
- A decision was made that affects the system
- A scan was completed and tasks were processed

Do not log every small edit. One entry per milestone or natural stopping point.

## Instructions

1. Review what was done since the last changelog update (or since session start if no entry exists for today).

2. Identify which projects were touched. Use your vault's project tags exactly. Examples:
   - Initiatives: `#initiative-name`
   - Products: `#product-slug`
   - Research: `#research-slug`
   - Meta / vault: `#vault`, `#workflow`

   Replace these with the slugs your vault actually uses. The point is consistency: a tag should match the folder slug.

3. Open `Daily/Changelog.md`.

4. **If today already has an entry:** Update it. Add new bullets, new files, new project tags. Do not create a duplicate entry for the same date.

5. **If today has no entry:** Append a new entry at the TOP of the log (below the frontmatter and header), using this format:

```markdown
## YYYY-MM-DD

**Projects touched:** #tag1 #tag2 #tag3

- What was done (concise, specific)
- What was done
- Decisions made (if any)

**Files created:**
- `path/to/file.md`

**Files edited:**
- `path/to/file.md`

**Private:** #tag (optional, excludes from public timeline)

---
```

6. Keep entries tight. Scannable, not narrative. Add bullets as work happens rather than trying to reconstruct everything at session end.

## Output Format

Show the entry to the user before writing. Confirm: "Logged to Daily/Changelog.md."

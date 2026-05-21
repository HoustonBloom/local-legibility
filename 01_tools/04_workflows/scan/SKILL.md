# /scan — Process Vault Flags

Scan the vault for all pending instructions from the user. This is the session start checklist automated as a single command.

## Instructions

### 1. Check the Inbox

Read `INBOX.md`. Look for unprocessed items (not struck through with ~~). Report any new items found.

### 2. Check @sort folder

List all files in `@sort/`. Each file may contain:
- Checkboxes (`[ ]`) with tasks to process
- Content below a `---` separator to file into the vault
- `@review` in filenames means the user needs to review (don't process, just report)

Report what's in @sort and ask the user which items to process.

After processing an @sort file: if all tasks are complete and all content has been captured in the vault, **delete the file**. Do not leave processed files in @sort. If unsure whether content was captured, ask the user before deleting.

### 3. Scan for @claude flags

Search all `.md` files in the vault for the string `@claude`. For each match:
- Show the file path
- Show the instruction text that follows `@claude`
- Ask the user which ones to process

After processing an instruction, replace:
```
@claude [the instruction]
```
with:
```
@done(YYYY-MM-DD) [summary of what was done]
```

### 4. Check for session carryover

Look for files in `@sort/` named `Session Carryover*.md`. These contain prioritized tasks from previous sessions. Read the file and present the task list organized by priority (P0, P1, P2, P3, Misc). Ask the user which items to work on this session.



### 7. Clean up stale @sort files

Review all non-carryover files in `@sort/`:
- **Empty stubs** (no actionable content): Delete immediately.
- **Sandbox notes** (`sandbox-*.md`): These are auto-saved by the Notes API. If the content is a task, capture it in the current carryover. Delete the file.
- **Old carryover files**: If a newer carryover exists, check the old one for unprocessed items. Merge any remaining open tasks into the current carryover, then delete the old file. Only keep the single most recent carryover.
- **Processed files**: If all tasks are complete and content captured, delete.

Report what was cleaned and what was kept.

### 8. Check for @sort/@review folders

List any folders in `@sort/` that have `@review` in the name. These are items Claude left for the user to review. Report them but don't process.

## Output

Summary of:
- Inbox items found (count + brief descriptions)
- @sort files found (count + names)
- @claude flags found (count + file locations)
- Session carryover tasks (count by priority level)
- @sort cleanup actions taken (files deleted, tasks merged)
- @review review items pending
- Dev server status and browser state

Ask the user what to act on before doing anything.

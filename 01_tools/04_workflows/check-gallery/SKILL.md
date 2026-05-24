---
name: check-gallery
description: Apply pending favorite and deprecate marks from Cuts/Gallery.html. Load this skill when the user says "check gallery", "process gallery", "apply pending", "process favorites", "apply deprecations", or when a `Cuts/gallery-pending.json` file appears, or when pending gallery JSON is pasted into the conversation. Also fires when the user asks to favorite or deprecate a cut, or when regenerating the gallery index after those marks.
---

# Check Gallery : Apply Pending Favorites and Deprecations

Apply pending marks made in `Cuts/Gallery.html`. The gallery holds marks in `localStorage` until they get exported; this skill processes that export.

## The system

`Cuts/Gallery.html` lets the user browse every frame and window. Hovering a card reveals three actions: ★ Favorite · 🗑 Deprecate · ↗ Open in new tab. Marks are **pending** until this skill applies them.

### Sources of truth

- **Favorites**: `Cuts/_favorites.json` : a single JSON file with a `favorites` array of slugs. No per-file YAML sprawl.
- **Deprecations**: files physically moved to `Cuts/_deprecated/` (per vault convention: never delete, always deprecate).

### User side

When pending marks exist, a **Pending** floating button appears in the gallery (bottom-right). Clicking it opens a modal with three buttons:

- **Discard all** : un-marks everything (localStorage wiped)
- **Copy JSON** : copies pending payload to clipboard
- **Download for Claude** : downloads `gallery-pending.json`

User workflow:
1. Mark cards in the gallery
2. Click **Download for Claude** → saves `gallery-pending.json` to Downloads
3. Drop it into `Cuts/` (so it sits at `Cuts/gallery-pending.json`)
4. Tell Claude: "check gallery"

Alternate: **Copy JSON** and paste it directly into the chat instead of downloading.

## Workflow

### 1. Find the pending payload

Try in this order:
1. Look for `Cuts/gallery-pending.json` : if present, read it.
2. If not, check the conversation : the user may have pasted the JSON.
3. If neither, ask the user: "No pending payload found. Did you click Download or Copy in the gallery?"

### 2. Parse the payload

```json
{
  "generatedAt": "2026-04-20T10:00:00.000Z",
  "favorites_to_add": ["20260419_example-frame-one"],
  "favorites_to_remove": ["20260401_example-frame-two"],
  "deprecate": ["20260401_example-frame-three"]
}
```

### 3. Apply favorites changes

Edit `Cuts/_favorites.json`:
- Add each slug from `favorites_to_add` to the `favorites` array (skip if already present)
- Remove each slug from `favorites_to_remove` from the array

Keep the `note` field intact. Keep the array sorted alphabetically so diffs are clean.

### 4. Apply deprecations

For each slug in `deprecate`:

1. Find the frame HTML at `Cuts/frames/<slug>.html` (or for windows, at whatever `path` is in `frames-index.json`).
2. Find the peer config at `Cuts/frames/<slug>_config.md` if it exists.
3. Create `Cuts/_deprecated/` if it doesn't exist.
4. Move both files (HTML + config) to `Cuts/_deprecated/`. Use `git mv` if this is a git repo, otherwise a plain move.
5. Before moving the config, add to its frontmatter (or prepend if no frontmatter):
   - `maturity: deprecated`
   - `deprecated-date: <today>`
   - `decision-context: "Marked for deprecation via gallery on <date>."`
6. If the slug is a window, also move the window manifest (`Cuts/window-<slug>.md` or `Cuts/_window-<slug>.md`) to `Cuts/_deprecated/`.
7. If the frame/window is referenced in any active window manifest, note it. The user may need to clean those references manually (do not silently remove them).

### 5. Regenerate the gallery index

```
cd Cuts && node build-gallery-index.mjs
```

This picks up the new `_favorites.json` state and the items that moved into `_deprecated/`. Re-run even if nothing changed, to sync timestamps. Expected output includes a line like `✓ Wrote frames-index.json` and a summary of frame count and top tags.

### 6. Clean up the pending file

Delete `Cuts/gallery-pending.json` so the next "check gallery" starts fresh. The gallery's localStorage state is cleared automatically on the user's next page reload. Tell the user to reload to re-sync.

### 7. Report back

Give the user a short summary:
- N favorites added, N removed
- N items deprecated (list them by title)
- Any references that need manual cleanup
- Confirmation: "Reload the gallery (`http://localhost:8100/Gallery.html`) and the marks will be gone."

## Edge cases

- **Slug in `favorites_to_add` that doesn't exist in the index**: skip, warn the user.
- **Slug in `deprecate` that doesn't exist as a file**: skip, warn.
- **Slug already in `_deprecated/` but also in `deprecate`**: already done, skip.
- **Favorite added AND removed in same payload**: remove wins (the user changed their mind last).
- **Config file missing**: just move the HTML, note it.
- **Pending payload with no changes** (empty arrays): skip the file write steps, still regenerate the index (to sync timestamps), delete the pending file, report no-op.

## Related workflows

This skill is one piece of a larger chain. Sister workflows that also rebuild the gallery:

- [[cut-packet SKILL]] : Step 9 rebuilds the gallery index after generating any new frame
- [[ADDING-COMPONENTS]] : Step 8 rebuilds after any new/edited lens or atmosphere
- [[ADDING-A-LENS]] : Validation checklist includes gallery rebuild
- [[ADDING-AN-ATMOSPHERE]] : Validation checklist includes gallery rebuild
- **Session-end Stop hook** (`.claude/settings.json`) : Backstop: if a session touches any of those paths and did not rebuild, the hook catches it at session close

The common invariant: `frames-index.json` is always a pure function of what lives in `Cuts/frames/`, `Cuts/_deprecated/`, `Cuts/window-*.md`, the packet's `lenses/_examples/`, and the packet's `atmospheres/_examples/`. Any edit to those inputs means the index needs a rebuild.

## Related files

- [[Cuts/Gallery.html]] : the UI
- [[Cuts/build-gallery-index.mjs]] : rebuilds `frames-index.json` + `frames-index.js`
- [[Cuts/_favorites.json]] : favorites registry
- [[Cuts/_deprecated/]] : where deprecated cuts end up
- [[Cuts/check-gallery.md]] : original in-folder pointer to this skill

## Design rationale

- **Favorites in one JSON file, not per-file YAML**: avoids YAML sprawl across many files. A central registry is one file to update, no risk of drift between files and references.
- **Deprecation as folder move**: matches vault convention (`_deprecated/` preserves institutional memory; the convention is "never delete, always deprecate").
- **localStorage + manual export**: static HTML cannot write to disk. Exporting a JSON file (or pasting) is the bridge. Reliable, portable, auditable.
- **Pending state visible in UI**: cards show favorited status (gold border + corner star) and pending-deprecate state (dashed rust border + label) so the user sees what is queued without opening the modal.

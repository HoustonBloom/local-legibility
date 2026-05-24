---
type: instructions
subject: examples
for: [human, ai]
visibility: local
---
# Examples

Sample renders for the lenses shipped in this packet.

This release ships clean examples for two lenses: First Look and Pitch. Examples for the other lenses will land in a follow-up release. Until then, lens specs describe the pattern in prose, and the Lenses tab in `Getting Started.html` shows live previews of the visual grammar for each one.

If you want a sample render for a lens that doesn't have one yet, run the lens against your own content using the `cut-packet` workflow. The first run becomes your local example, and the lens spec describes the shape it should take.

---

## Authoring a new example

When contributing an example back to the packet:

1. **Start from neutral content.** Use fictional company, project, and people names. Don't ship a real vault artifact.
2. **Name the file `example-<lens-slug>.html`.** Match the slug in the lens spec.
3. **Inline all assets.** No external image or font references except CDN font loaders. Examples should open standalone in any browser.
4. **Verify no personal data.** Run a grep for common personal-name patterns before committing.

See `../ADDING-A-LENS.md` for the full lens authoring flow.

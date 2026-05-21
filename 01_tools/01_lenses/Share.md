---
type: lens
name: share
for: [human, ai]
visibility: local
status: active
---

# Lens: Share

*A preview-forward, one-item-at-a-time stumble through a set of captured things, closed by a synthesis recap that weaves threads across the items.*

---

## What this lens does

Share renders a collection of captured items (markdown notes, HTML pages, PDFs, external URLs) as a **full-viewport stumble**. Each item is its own slide. The reader moves through one at a time at scroll speed. **The content is the slide** — not a preview of a preview. Markdown is rendered inline. HTML is iframed. PDFs are iframed where possible, and when the source can't embed cleanly (paywalled, auth-gated, CSP-blocked, heavy), the slide falls back to a structured "holding the thread" summary with a button to the source.

The opener frames the set (either a single-statement bluff or a category overview). The closer is a **recap slide** that weaves the items into a set of threads and primes what comes next.

Where Reel · Digest Mode says "here is an external thing, go look at it" with a big link button, Share says "here is the thing — *look at it here* — and here is why it matters." Share is for sharing your own or your circle's captured material. Reel · Digest Mode is for sharing curated external links.

---

## When to use this lens

- Closing out a session and sharing the work product with a collaborator — a set of proposals, drafts, diagrams, captured links from today
- Handing a reviewer a batch of items in a single shareable URL without asking them to chase wikilinks
- Threading the work across a week (or across a capture folder) into one artifact that shows the actual content of each item, not a summary
- Sharing a Slow Water queue externally — the items themselves, previewable in place, plus a synthesis
- Any time the value of the share is in the reader seeing the actual material, not a description of it

---

## When NOT to use this lens

- When every item is an external link meant to be opened away — use **Reel · Digest Mode** (big link button, stumble-style, attribution-forward)
- When you want to tell a single argument across slides that builds to a conclusion — use **Reel** (slide roles: hook → context → reveal → proof → implication → invite)
- When the content is one cohesive essay or long-form narrative — use **Explainer**
- When you want a conversion-shaped landing page — use **Product Website** or **Pitch**
- Fewer than 3 items: the stumble pattern doesn't earn its chrome. Just send the content.

---

## Required inputs

### From the cut config

Beyond the base cut frontmatter (see the cut config schema in [[../00_overview/CUTS-SPEC|CUTS-SPEC]]):

```yaml
---
type: cut
date: YYYY-MM-DD
project: [Project or Capture Surface]
slug: YYYYMMDD_concept-descriptor
audience: [who this is for]
content-tag: [tag selecting vault files]
lens: share
opener-mode: bluff | categories   # required: bluff = single framing statement; categories = chip-row overview
recap: [optional inline recap copy; otherwise recap is derived from the items + threads field]
threads: [array of open threads to surface at close, each a short phrase]
style-source: [design-system token source]
output: 03_cuts/frames/YYYYMMDD_concept-descriptor.html
visibility: local
last-updated: YYYY-MM-DD
---
```

Required fields specific to Share:

| Field | Required | Purpose |
|-------|----------|---------|
| `lens: share` | Yes | Binds the cut to this lens |
| `opener-mode` | Yes | `bluff` or `categories`. See Visual Structure |
| `content-tag` | Yes | Selects which files become items (per base cuts spec) |
| `threads` | Recommended | Array of short phrases the recap slide surfaces as "threads to hold" |
| `recap` | Optional | If omitted, recap is composed from the item list + threads at render time |
| `category-map` | If opener-mode is `categories` | Object: `{ category-slug: [display-label, accent-token] }` |

Per-item fields (inside `## Items` section of the cut body — one block per item):

```yaml
- path: [vault path or URL]
  display-mode: inline | iframe | summary    # optional; the lens auto-picks if omitted
  category: [category slug; required if opener-mode is categories]
  title: [override; optional — defaults to file frontmatter title or first H1]
  why: [optional — one-sentence "why this matters" note]
  thread: [optional — the thread this item belongs to, referenced in the recap]
  action: [optional — "needs review" | "in progress" | "parked" | "shipped"]
  source-note: [optional — for external URLs: publication, author, date]
```

### From the tagged content

Share imposes **no heading contract** on source files (unlike Explainer). The lens renders source material as-is within per-item frames. The only requirement is that each source item is openable by the chosen display mode:

- **Inline mode:** source must be plain text, markdown, HTML fragment, or an image. Markdown is rendered to HTML at render time.
- **Iframe mode:** source must be servable to an iframe — a local HTML file, a PDF with `Content-Disposition: inline`, or a URL that permits embedding (no `X-Frame-Options: DENY`).
- **Summary mode:** no source requirement; the `why` and `thread` fields in the cut body become the slide's body copy. Useful for paywalled articles, auth-gated apps, or items you want to reference without embedding.

---

## Output contract

The rendered frame guarantees:

- **Full-viewport** — fills browser window edge to edge; no letterboxing
- **Fully self-contained HTML** — no external JS except Google Fonts; no localStorage usage (per artifact restrictions)
- **Responsive** — from 320px phone portrait to 2560px wide display; bottom-bar adapts
- **Mobile touch targets** ≥ 44px × 44px (WCAG 2.5.8)
- **Reduced-motion aware** — `@media (prefers-reduced-motion: reduce)` disables slide transitions and the recap reveal animation
- **File size envelope** — base chrome + one slide: ~40 KB. Each inline-mode markdown slide adds ~2–8 KB. Each iframe-mode slide adds ~500 B (the iframe loads lazily). Target total < 200 KB for a 10-item share; < 400 KB at the 15-item cap.
- **Semantic HTML** — each slide is an `<article>`; opener is `<header>`; recap is `<footer class="recap">`
- **ARIA** — `aria-live="polite"` on the bottom-bar note; `aria-hidden` toggled per slide; iframe slides get `title` attribute from the item's title

---

## Visual structure

Top-to-bottom layout. All slides share the same chrome; the **content region** varies per slide by display mode.

### Chrome (shared across all slides)

- **Full viewport** stage (`.stage { position: absolute; top: 0; right: 0; bottom: 0; left: 0 }` — never `fixed`; never `inset` shorthand — see Reel · Digest Mode's Critical Rendering Notes; same constraints apply here)
- **Bottom bar** — single horizontal strip at the bottom:
  - Prev arrow (left)
  - Note area (center) — shows current item's title + a small position indicator (`03 / 09`, mono, rust)
  - Next arrow (right)
- **Slide-type chip** — sits in the top-right of the slide, quiet, showing the display mode: `INLINE` / `IFRAME` / `SUMMARY`. Mono, 10px, faint. This teaches the reader what to expect from the frame without narrating it.

### Opener slide — two modes

**Mode A: Bluff.** A single-statement framing. No category chips. The slide is mostly white space with:
- Kicker (Aldrich retro mono, rust accent): e.g., "CAPTURED · APRIL 20, 2026"
- Title (DM Serif Display, big): the bluff statement — e.g., "Three MVPs from one working session."
- Subtitle (Space Grotesk, muted): one line of context + what the reader will find
- Nav hint (Caveat, small): "arrow through →" — shown ONCE on the opener, never again

**Mode B: Categories.** Same hero composition, plus a chip row below the subtitle:
- A horizontal row of category chips. Each chip shows `category-label · count`
- Category chips use the `category-map` accent tokens — e.g., `[research, butter]`, `[project, sage]`, `[interface-pattern, sky]`
- Chips are **display-only** on the opener (not filter buttons; clicking one jumps to the first item in that category — progressive enhancement, not required)

### Content slides (one per item)

Layout varies by display mode. All content slides share:
- Item number (top-left, mono, faint): `ITEM 03 / 09`
- Category tag (top-left, below item number, if categories are in use): category label in its accent color
- Display-mode chip (top-right, described above)
- Title region (DM Serif Display, scales `clamp(32px, 5.5vmin, 56px)`)
- Source line (below title): `by <author/source>` OR for vault items, the vault path in mono
- Content region (varies — see below)
- "Why this matters" note (optional, Caveat, warm splash background, right-aligned or below content)
- Action chip (bottom-right, if `action` field is set): `NEEDS REVIEW` / `IN PROGRESS` / `PARKED` / `SHIPPED` — colored pill, uppercase letter-tracked

#### Content region — Inline mode

The source markdown renders directly in the slide. Content fills the slide with comfortable reading width (max-width 72ch, centered). Paragraphs, headings, lists, code blocks, images — all rendered native. Thin rust-accent scrollbar if content exceeds viewport. Scroll resets on slide change (same pattern as Reel).

Font scale for inline markdown within a slide is slightly smaller than slide chrome — body 16–18px, not the big 24px slide copy size — to keep more content visible per scroll.

#### Content region — Iframe mode

A full-size iframe fills the content region with a 1px rust accent border. The iframe is sandboxed (`sandbox="allow-scripts allow-same-origin"` for trusted local HTML; `sandbox=""` for untrusted external URLs). Iframe loads lazily (`loading="lazy"`).

For PDFs: iframe with `src="<path>.pdf"`. Most browsers render inline via their built-in PDF viewer. If the browser blocks it, the item quietly falls back to summary mode via JS error handler.

For external URLs: iframe with `src=<url>`. If the site sets `X-Frame-Options: DENY` or CSP blocks embedding, the slide degrades to a summary-mode card automatically (feature detection via `iframe.onerror` + timeout).

Fallback copy when iframe fails: a card showing title, source, the `why` field, and an "open in new tab" button. Same shape as summary mode — see below.

#### Content region — Summary mode

When iframe isn't feasible (paywalled, auth-gated, the item is a thread rather than a document, or explicitly set), the slide shows:
- Title (DM Serif Display, large)
- Source line (sans, muted)
- The `why` field rendered as a hero paragraph (serif, comfortable size) — this is the "why this matters" note
- A scrawl-style margin note (Caveat): "holding the thread: {thread}" — borrows the thread label from the item
- A single button (bottom): **OPEN IN NEW TAB →** or **READ AT SOURCE →** or **OPEN FILE →** depending on path type
- No iframe, no preview — just the context and the handoff

This is the "holding the thread" slide shape the user asked for. The reader learns what the thing is, why it's in the share, what thread it hangs on, and where to go if they want more.

### Recap slide (close)

The close is not a signoff — it's a **synthesis**. Structure:

- Kicker (retro mono): `RECAP · THE THREADS`
- Title (DM Serif Display, big): either the cut's explicit `recap` copy or an auto-generated title like "What came out of this set"
- **Threads list** — each thread from the `threads` array as a line:
  - The thread phrase (sans, bold)
  - Below it: the items that hang on this thread, as small linked pills — clicking a pill navigates back to that item's slide
- **Primes for next time** — a one-line, Caveat-styled note at the bottom: "next: {first thread} wants a spec" or similar — derived from the first thread + action fields, or supplied inline in the cut body
- Signature (mono, faint): `Share · {date} · {N} items`

The recap is the lens's earned conclusion. It should feel like you learned something by going through the set.

---

## Interaction model

- **Navigation:** three input methods, always working.
  1. Bottom-bar arrow buttons (click/tap)
  2. Keyboard: ← → plus Home/End to jump to opener/recap, `r` to jump to recap from anywhere
  3. Swipe (touch devices, 40px horizontal threshold)
- **Scroll reset:** on every slide change, the new slide's content region scrolls back to top
- **Iframe sandboxing:** iframe slides are always sandboxed; their internal scroll is independent from slide nav
- **Category chip click (opener mode B):** progressive enhancement — clicking a category chip navigates to the first item in that category. No filter state; no persistent view change.
- **Recap pill click:** clicking an item-pill in the recap navigates to that item. Useful as a "back to context" move after reading the synthesis.
- **Reduced motion:** slide transitions become instant cuts; no fade, no slide. Recap thread-reveal becomes a plain stack. Iframes load the same either way.
- **No localStorage, no sessionStorage.** All position state lives in in-memory JS only (per artifact constraint).

---

## Token consumption

Design-system tokens consumed (inherited from the cut's `style-source`):

- **Fonts:** Space Grotesk (sans body), Plus Jakarta Sans (sans display), DM Serif Display (serif display), JetBrains Mono (mono), Aldrich (retro kicker), Caveat (hand/annotation)
- **Colors:** `--paper` (slide base), `--ink` (body text), `--rust` (primary accent, used on arrows, scrollbars, and recap thread markers), and the full accent family (`--sage`, `--butter`, `--sky`, `--blush`) for category accents
- **Spacing:** `--gap-slide` (horizontal slide padding, ~clamp(24px, 4vw, 64px)), `--gap-vertical` (rhythm between slide regions, ~24px)

Safe substitutions: font swaps via the style-source. Color swaps via style-source. Category accent assignments via the cut config's `category-map`.

Unsafe substitutions:
- Replacing the rust scrollbar color with a low-contrast tone breaks scroll affordance
- Replacing the bottom-bar position (e.g., moving nav to the top) breaks the lens contract — Share is defined by bottom-bar chrome
- Replacing iframe mode with any other embed approach (object, embed, shadow DOM) breaks sandboxing guarantees

---

## Reference implementation

- [[_examples/example-share|Sample render]] — a Share frame with three inline-mode items, one iframe-mode item, one summary-mode item, and a recap

First production frame: `03_cuts/frames/20260420_share-today-sort_config.md` + `.html` — today's @SORT/_4_20_26 load-test, used to validate the lens end-to-end.

---

## Notes on edge cases

- **Empty `threads` array.** Recap still renders; it uses an auto-derived "what's in this set" paragraph instead of a threads list. Less useful but not broken.
- **Single item.** Lens renders: opener + 1 content slide + recap. But consider whether a share lens is the right move for one thing — usually, just send the thing.
- **More than 15 items.** Render still works but the stumble loses its pacing. Cap with a pinned "...and {N} more" item on the recap that links to the full folder.
- **Iframe refuses to load.** JS fallback swaps the slide's content region to summary mode. A small scrawl note appears: "source wouldn't embed; here's the thread."
- **Long inline markdown.** Scrollable within-slide (same as Reel). A subtle gradient mask at the bottom signals more content below. Max suggested length per slide: one full screen of scroll. Beyond that, break into two items.
- **Missing category in categories mode.** Item gets a neutral `uncategorized` chip in a muted tone. Cut render logs a warning.
- **Vault wikilinks inside inline markdown.** Render as the link text plus a small `↗` glyph (mono, faint). Clicking does nothing in the standalone HTML — they're for reader orientation only, not navigation. Document this in the item's why field if relevant.
- **Iframe loading an Obsidian `.md` path.** Use the rendered HTML export, not the raw markdown. Render script should convert `.md` to `.html` at build time and iframe the HTML.
- **External URL with CORS / iframe-block.** Auto-fallback to summary mode. The `why` and `source-note` fields become the slide copy; a `OPEN IN NEW TAB →` button replaces the iframe.
- **Reduced-motion + iframe slides.** No special handling; iframes don't animate regardless.

---

## Failure modes

- **Inline mode with a giant file (thousands of lines).** The slide becomes a wall of scroll. Break the file into two items, or use summary mode with a "read in full: ..." button.
- **Every slide in summary mode.** The lens becomes a bullet list. If you can't preview anything, use a different lens or write a one-page summary.
- **Category accent collisions.** Two categories sharing the same accent color confuses the reader. Enforce unique accents in the `category-map`.
- **Recap with no threads and no items listed.** A blank synthesis is worse than no recap. Either supply threads, or let the lens auto-derive from the item list.
- **Bluff opener longer than one sentence.** The bluff's job is to frame in one breath. If it takes two sentences, it's not a bluff; use categories mode.
- **Mixing action chips as a decorative element.** Action chips should be set deliberately — they tell the reader what to *do* with the item. Decorative overuse dilutes the signal.

---

## Relationship to other lenses

- **Reel · Digest Mode** — adjacent but different. Digest is link-forward (big CTA button per slide, external content). Share is preview-forward (content renders in the slide). Digest has no recap synthesis; Share does. Use Digest for a weekly external-link roundup; use Share for a captured-work roundup.
- **Explainer** — one artifact explained in beats. Share is many artifacts, each previewed. Use Explainer when you want to teach one thing; use Share when you want to distribute a set.
- **Recap** — Reddit-post-shaped, casual register, conversation-shaped update for a peer. Share is preview-forward and stumble-shaped. Same session can be captured as either: Recap for the casual update, Share for the artifact distribution.

---

## Engagement principles (inherited from Reel canon)

Share inherits the engagement principles documented in Reel:

1. **The interaction mechanic carries meaning.** In Share, the stumble *is* the synthesis — each arrow move is the reader receiving one more piece before the recap ties them together.
2. **Click affordance is non-negotiable.** Filled buttons for CTAs (open in new tab, read at source). Rust accent for secondary links. No narration of the interaction (no "tap to open").
3. **Touch targets meet WCAG 2.5.8.** 44×44 min for arrows, chips, and buttons.
4. **Progressive enrichment, not hidden primary info.** The "why this matters" field is visible without hover; hover expands nothing essential.
5. **Scroll within a slide is cued.** Thin rust scrollbar + gradient mask at overflow (same as Reel).
6. **Teach the interaction once.** The opener shows "arrow through →" in Caveat; never again.
7. **Teach in isolation before combining.** Inline-mode items come before iframe-mode items by default (unless category order overrides) — readers learn the lens is content-first before meeting the embedded-source mode.
8. **End with something that requires everything.** The recap can only land after the stumble; it synthesizes what came before, and if you skip to it, it's just a list.
9. **Respect reduced-motion.** All transitions and reveals honor `prefers-reduced-motion`.

See also: your project's pattern library (if you maintain one), your build-frame conventions.

---

## Critical rendering notes

Inherited from Reel · Digest Mode's hard-won testing (same WebView/iframe constraints apply):

- **NO `position: fixed` on `.stage`.** Use `position: absolute` with explicit `top/right/bottom/left: 0`.
- **NO content before `<!DOCTYPE html>`.** No whitespace, comment, or BOM.
- **Replace `inset: 0` with explicit `top: 0; right: 0; bottom: 0; left: 0;`.**
- **Iframes must set `loading="lazy"`** to keep first-paint fast.
- **Iframe `sandbox` must be set** — `sandbox="allow-scripts allow-same-origin"` for trusted local payloads; `sandbox=""` (empty, most restrictive) for untrusted external URLs.
- **Keep total page size under ~400 KB at the 15-item cap.** Iframes add minimal weight because they load lazily, but inline markdown slides add up fast.

---

## Version history

- **v0.1.0** (2026-04-20): Initial spec. Preview-forward lens distinct from Reel · Digest Mode. Two opener modes (bluff / categories). Three display modes (inline / iframe / summary). Synthesis recap with threads and action-chip bookkeeping. First production use: today's @SORT/_4_20_26 load-test frame.

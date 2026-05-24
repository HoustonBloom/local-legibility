---
type: lens
name: reel
for: [human, ai]
visibility: local
status: active
---

# Lens: Reel

A lens for audience-facing, social-shareable content. **Full viewport. Scrollable slides. Left/right navigation in a persistent bottom bar. Dynamic per-slide layouts. Hyper-responsive : from phone portrait to desktop.**

Reads like an Instagram reel or carousel, but in-browser, unboxed, and content-aware. Each slide stands on its own. No fixed aspect ratio. No forced template.

---

## When to Use

For non-technical readers. For friends, community, customers, new collaborators. For content that needs to travel: shareable in a DM, previewable on a phone, screenshottable one slide at a time.

Not for debriefs. Not for system audits. Not for anything that needs to carry a sustained argument across 2,000 words. The Reel lens is for ideas that can land in six to nine breaths.

---

## Config Schema

```yaml
---
type: cut
date: YYYY-MM-DD
project: [Project Name]
slug: YYYYMMDD_concept-descriptor
audience: [audience modifier name]
content-tag: [tag that selects vault files]
lens: reel
narrative: [voice preset name]           # optional
style-source: default-tokens            # optional
output: 03_outbox/frames/YYYYMMDD_concept-descriptor.html
visibility: local
last-updated: YYYY-MM-DD
---
```

No `window` field. A reel is a standalone artifact.

---

## Structure

### Format

- **Full viewport.** The reel fills the browser window. No square, no fixed aspect ratio box. Slides occupy the viewport minus the bottom bar. On a phone in portrait, the reel is full-bleed. On desktop, it's full-bleed. Content-level max-widths (titles, body copy) keep things readable at any width.
- **Bottom bar chrome.** A single horizontal strip at the bottom of the viewport holds all navigation:
  - **Prev arrow** (left)
  - **Note** (center) : see below
  - **Next arrow** (right)
  The bottom bar has its own background and a subtle top border. It never overlaps slide content.
- **The note.** The center of the bottom bar shows:
  - **Counter**: zero-padded (`03 / 08`) in monospace, rust accent
  - **Title**: short phrase describing the current slide, from the slide's `data-title` attribute
  Both update as you navigate. This replaces the old indicator dots.
- **Left/right navigation.** Three input methods, always working:
  1. Bottom-bar arrow buttons
  2. Keyboard arrow keys (← →, plus Home and End)
  3. Swipe on touch devices (40px threshold)
- **Scrollable slides.** Each slide is vertically scrollable (`overflow-y: auto`) when content overflows the viewport. Thin scrollbar styled in the rust accent. **Scroll resets to the top when navigating to a new slide.**
- **No dots.** No indicator dots anywhere. The bottom-bar note is the single source of position truth.
- **No top chrome.** No counter or UI at the top of slides. Slides use the full upper area freely.

### Slide count

- **Minimum:** 5 slides
- **Standard maximum:** 9 slides
- **Sweet spot:** 6 to 8

Reel pacing fails outside this range. Scroll is a safety valve for a single dense slide; it is not a license for more slides.

### Digest Mode (variant)

For gallery / stumbleupon-style content : weekly link digests, tool roundups, resource collections : where each slide surfaces a distinct external resource with a prominent CTA button, the slide cap extends to **15 slides maximum** (typical: 10-13).

Digest mode keeps everything else from the lens: full viewport, bottom-bar nav, scrollable slides, per-slide dynamic composition, `data-title` attribute on each slide. What changes:

- **Slide role per tool.** Most slides are one-resource-per-slide, each with: category eyebrow, resource name, source/date, a hero quote from the source, short contextual framing, a **big prominent link button** with URL hover tooltip.
- **Attribution-forward.** Each slide credits the source author/org explicitly. Compilation attribution is collective ([community]), never an individual.
- **Accent rotation by section.** Sections (News · Community · AI × Gov · Civic Tools · Methods · Learning) each get a palette slot for visual variety across the gallery.
- **No internal narrative argument across slides.** The cover and close carry the voice; middle slides are a stumble.

**First production use:** [Org] Digest reel, Week of April 7, 2026. Validates the pattern for [Org]'s weekly Substack/LinkedIn link-roundup content format.

#### Critical Rendering Notes

Hard-won from live mobile testing. Every frame must follow these or rendering breaks in WebView/iframe contexts:

- **NO `position: fixed` on `.stage`.** Use `position: absolute` with `width: 100%; height: 100vh;` instead. `fixed` breaks inside iframes (Substack, LinkedIn embeds, Obsidian preview).
- **NO content before `<!DOCTYPE html>`.** Any whitespace, comment, or BOM before the doctype declaration breaks rendering in mobile WebViews.
- **Replace `inset: 0` with explicit `top: 0; right: 0; bottom: 0; left: 0;`.** The `inset` shorthand is unsupported in older WebViews (Android 4.x, some in-app browsers).
- **Keep total file size under ~85KB** for reliable rendering on constrained devices and email-embedded previews.

#### Template Structure: Fixed vs. Dynamic

These elements are **FIXED** across all Digest Mode reels (do not reinvent per issue):

- Grid layout: `.tool-slide` grid rows
- Bottom bar three-tier hierarchy: **TIME → TYPE → DOTS** (see below)
- Slide content hierarchy order (see below)
- Color system + section palette classes
- Navigation JS: swipe, keyboard, dots, arrows
- Cover pill overlay mechanism
- Font stack: Plus Jakarta Sans, DM Serif Display, JetBrains Mono, Caveat
- Button styling: `font-weight: 800`, `2.5px border`, `6px shadow`
- Arrow buttons: dark ink background, cream icon, hover stays dark

These elements are **DYNAMIC** per issue:

- Slide count and content
- Cover headline, subtext, topmeta
- Pill counts per section
- Each slide's content fields (title, quote, context, source, attribution)
- Section assignments and data attributes

#### Design Principle: Show Don't Tell

Never add text that describes interactivity. No "tap to open." No "click here." No "every item links out." The UI communicates affordance through visual design alone. Buttons look like buttons. Links look like links. If the reader needs instructions to use the interface, the interface is wrong.

#### Bottom Bar: Three-Tier Hierarchy

The bottom bar center note displays three tiers of information. **Do NOT flatten or reorder.**

1. **TIME** (top, biggest) : from `data-time` attribute : e.g., "6 min read"
2. **TYPE** (middle, quiet) : from `data-type` attribute : e.g., "News · Essay"
3. **DOTS** (bottom, small) : navigation dots, one per slide

**Why this order:** Read time is the #1 decision factor for whether a reader stays on a slide. Content type is secondary context. Dots are pure wayfinding.

#### Slide Content Hierarchy

Exact order of elements inside every `.tool-slide` grid. Do not reorder.

1. `.slide-date` : colored dot + published date only. No category, no type, no read time in this row.
2. `a.title-link > h2` : the title IS a hyperlink wrapping an `<h2>`, linking to the source URL.
3. `.source-line` : prefixed with "by" + author/org + publication.
4. `.hero-quote` : pull quote with `.attrib` span.
5. `.thread-note.promoted` : stakes/hook note, positioned ABOVE body text with the `.promoted` class.
6. `.ctx` : body paragraph.
7. `.link-btn` : primary CTA button. Intentionally duplicates the title-link URL.
8. `.attribution` : via/credit line.

#### Color System (Section Palettes)

| Section | Class | Background | Accent |
|---------|-------|------------|--------|
| News | `.sec-news` | cream | `--rust` |
| Community | `.sec-community` | green gradient | `--green` |
| AI × Gov | `.sec-aigov` | dark green | `--peach` (light-on-dark) |
| Civic Tools | `.sec-tools` | ink/black | `--butter` (light-on-dark) |
| Methods | `.sec-methods` | butter wash | `#a87a1f` gold |
| Learning | `.sec-learning` | peach wash | `--rust` / `--peach` |

**Dark sections** (`.sec-aigov`, `.sec-tools`) MUST override: slide-date dot color, source-line colors, thread-note colors, link-btn colors. Light text on dark background. Test contrast.

#### Data Attributes

Every slide `<article>` in Digest Mode must carry:

- `data-slide="N"` : 1-indexed position
- `data-time` : read time string, shown BIG in footer (e.g., "6 min read")
- `data-type` : content type string, shown small in footer (e.g., "News · Essay")
- `data-content-type` : powers the cover overlay pill filter
- `data-title` : shown in the bottom-bar note area + accessibility

#### Cover Slide Specifics

- **No topmeta eyebrow.** No "[Org] · Weekly Digest" header. The title and sig make it obvious.
- **Title on one line.** No forced `<br/>` in the `<h1>`. "What [Org] is reading." fits on a single line. The `.week` span sits below it naturally.
- **Content order:** `h1` (title + week span) → type pills → subtext paragraph → sig. Pills come immediately after the title so the reader sees the digest's shape before the description.
- `data-time="~N min browse"` on the cover slide. Shows total browse time in the bottom bar. `data-type=""` (empty on cover).
- **Type pills must be `<button class="type-pill">` elements** with `data-filter` attribute matching a `data-content-type` value. Each pill shows a count badge. Clicking a pill opens a **bottom-sheet type overlay** (`.type-overlay`) that lists all slides of that type with title, source, and time. Clicking an item navigates to that slide. Overlay closes on backdrop click or Escape. The overlay HTML structure: `.type-overlay > .backdrop + .sheet > (.sheet-handle + .sheet-title + .sheet-count + .sheet-items)`. Items built dynamically from `data-content-type` index.
- **Sig at bottom:** "a weekly digest" on the left, clickable `<a>` GitHub link on the right (`href`, `target="_blank"`, `rel="noopener noreferrer"`).
- **Descender clearance.** DM Serif Display has long descenders on `g`, `p`, `y`. With the cover h1's tight `line-height: 0.94`, descenders crash into the `.week` subtitle below. Required: `padding-bottom: 0.18em` on `.s1 h1` AND `margin-top: 0.32em` (with `line-height: 1.15`) on `.s1 h1 .week`. Without these, "reading." overlaps "Week of April 7, 2026."
- **Sig responsive stacking.** `.s1 .sig` is a horizontal flex (`space-between`) by default. At narrow widths the right-side URL/link crashes into the left-side Caveat handwriting. Required at `@media (max-width: 720px)`: `.s1 .sig { flex-direction: column; align-items: flex-start; gap: 8px; }`. Without this, the sig breaks layout on phone portrait.

#### Attribution Rules

- **Source attribution** (per slide): credits the author/org who created the resource. Uses `.source-line` with "by" prefix and `.attribution` for via/credit.
- **Compilation attribution** is collective: "[community]" or just "[Org]." Never attribute compilation to a named individual in the rendered frame. Individual compiler credits live in the cut config only, not in the public-facing HTML.
- Cover `.sig`: "a weekly digest" + clickable [Org] GitHub link.
- Close `.signed`: "xo, [Org]" : collective sign-off.

### Per-slide attributes

Each `<article>` slide element requires:

- `data-slide="N"` : 1-indexed slide number (for debugging and styling hooks)
- `data-title="..."` : 3-6 word title shown in the bottom-bar note. Plain text. HTML allowed if you want an italic emphasis.
- `class="slide sN"` : `sN` is the per-slide style hook (s1, s2, s3, …)

### The slide contract

Each slide holds:

- **title** : 1 to 6 words. The anchor of the slide. If it has no title, it has no job.
- **body** : ~60 words preferred, up to 120 if scroll-justified. Short sentences, fragments welcome. Never a wall of prose.
- **visual** (optional) : icon, image, inline component (mock UI, comparison, diagram). The visual can do as much work as the copy, or more.
- **accent** (optional) : one token from the design system. Rotates across the reel for visual rhythm.
- **unique layout** : each slide composes itself. No cookie-cutter template. The reel lens is editorial, not deck-like.

### Slide roles

A reel is a sequence, not a list. Each slide has a role:

- **Hook** (slide 1) : pulls the reader in. A question, claim, or tension.
- **Context** (slides 2-3) : the problem, the feeling, the why.
- **Reveal** (middle) : the thing. The object, mechanism, or answer.
- **Proof** (after reveal) : show it. A visual, number, or receipt.
- **Implication** (near end) : what this means for the reader.
- **Signature / Colophon** (optional, near end) : the splash credit. Who made this, and with what.
- **Invite** (last) : the action. A link, a question, a meeting.

Not every reel uses every role. Every slide should have an identifiable job.

---

## Voice and Content

### Voice

Voice resolves from the narrative file. The Reel lens has no default voice. If no narrative is specified, voice must be provided inline in the cut body.

### Content source

The cut specifies one `content-tag`. Every vault file whose `visibility:` array contains that tag is available as source material. Source files supply facts, framings, quotes. The reel distills them into slide copy.

Unlike Explainer, the Reel does not inline source files. There are no pull points. No citations, no expandable panels, no side views. The reel is a distillation.

---

## Visual Contract

- **Edge to edge.** No card framing, no rounded reel box. The viewport IS the frame.
- **Paper texture.** Subtle SVG noise overlay (~4% opacity via multiply blend) inside the reel creates a printed-page feel.
- **Warm base.** Cream (`#ece5d6`) is the default background with warm variants for depth. Palette breaks on splash slides are encouraged (deep green, dark ink, whatever the moment wants).
- **Per-slide typography can go big.** Titles scale from `clamp(36px, 7.6vmin, 68px)` up to `clamp(60px, 13vmin, 128px)` for splash moments. Body sits at `clamp(18px, 2.8vmin, 24px)` minimum for phone readability.
- **Three font families.** Sans (Plus Jakarta Sans), Serif (DM Serif Display), Monospace (JetBrains Mono). Mix within a slide for editorial contrast. Caveat is available for handwritten-feel annotations.
- **Bottom bar is quiet.** Small mono counter. Small sans title. Small rounded arrow buttons. Its job is to not compete with the slide.

---

## Lens vs. Style

### Lens decisions (permanent, travel with the lens)

- Full viewport. No fixed aspect ratio. No centered card.
- Bottom bar for navigation. Arrows flank a counter + title note.
- Left/right navigation: buttons, keyboard, swipe.
- Slides are vertically scrollable. Scroll resets on navigation.
- 5 to 9 slides. Each is an `<article>` with `data-slide` and `data-title`.
- No pull points. No supplements. No side panels. No indicator dots.
- Each slide works as a standalone screenshot.

### Style decisions (design system)

- Which fonts, colors, textures, motion
- Whether slides have visible transitions (fade, slide, cross)
- Typography scales and weights
- How the accent is applied (background, border, text highlight)
- Whether to include paper texture
- Whether the bottom bar has a top border, shadow, or break in palette

---

## Input Contract

| Input | Source | Required |
|-------|--------|----------|
| Narrative file | `narrative:` field in cut config | Preferred |
| Source files | Vault files whose visibility array contains `content-tag` | Yes |
| Slide count and order | Cut config body `## Slides` section | Yes |
| Per-slide title for note | Cut config body (derived into `data-title` at render) | Yes |
| Slide copy | Cut config body or derived from source files | Yes |
| Design tokens | `style-source` in cut config | Yes |

If the cut config body contains a `## Slides` section with an ordered outline including slide titles, the renderer uses it as the structural spine and derives `data-title` from each slide heading. Otherwise the renderer infers slide roles from source files and narrative, which is lower fidelity.

---

## Failure Modes

- **More than 9 slides.** The reel becomes a deck. Cut it.
- **Any slide missing a `data-title`.** The bottom-bar note falls back to the slide number only : anemic. Always set a title.
- **A slide with no title in the content.** The slide has no job. Cut it or add one.
- **Scrolling multiple screens per slide.** Scroll is for overflow, not for long-form. If a slide needs 3 viewport heights of scroll, it is three slides.
- **Two accent colors fighting on one slide.** Pick one.
- **Last slide is a summary.** The last slide is an invite. Summaries belong on the cover.
- **Copy that could appear in any reel.** If a slide could be lifted into an unrelated piece without notice, it is filler.
- **Every slide with the same layout.** Defeats the lens. Vary composition per slide : editorial, not template.

---

## Engagement Principles

The Reel lens inherits engagement principles from the vault's your project's pattern library (if you maintain one) and Nicky Case's design-principles canon. All reels follow these:

1. **The interaction mechanic carries meaning.** In a Reel, the arrow is the reader's act of moving on from a discovered thing. Navigation IS the argument. Design each slide so the reader arriving *is* the reader receiving. A reel is a Step Sequence pattern, not a deck.

2. **Click affordance is non-negotiable.** If a slide has a clickable element, the reader must know. Filled buttons with all-caps labels and arrow icons are the CTA standard. Inline links use the rust accent. The UI communicates affordance through visual design alone : no text instructions like "tap to open" or "click here" (see Digest Mode: Show Don't Tell). Buttons look like buttons. Arrow icons signal direction. The design teaches the interaction without narrating it.

3. **Touch targets meet WCAG 2.5.8.** All tappable elements are minimum **44px × 44px**. Arrows, link buttons, tab indicators. No exceptions.

4. **Progressive enrichment, not hidden primary info.** Hover and long-press reveal secondary information (URL, longer descriptor). The primary label is always visible without interaction. Never require hover to learn what something does.

5. **Scroll within a slide is cued.** Per v0.2. Thin rust-accent scrollbar. When content exceeds viewport, a subtle gradient mask at the bottom signals "more below" so the reader doesn't miss overflow content.

6. **Context-aware opening (optional).** The cover slide can acknowledge time of day, pull a URL param for a reader's name, or adapt to viewport. Use sparingly. Never mandatory.

7. **Teach the interaction once.** The click-hint on the cover is one form. A subtle pulse or tap-indicator on the first content slide's button is another. Prove the interaction works before asking the reader to trust it repeatedly.

8. **Teach in isolation before combining.** Complex slide compositions (stat walls, call-response blocks, multi-card pinboards, floating cards) land because earlier slides established the visual vocabulary. Don't front-load a complex slide.

9. **End with something that requires everything.** The close slide (colophon, signature, feedback request, subscribe CTA) should feel like a conclusion only possible after the journey. Summary belongs on the cover, not the close.

10. **Respect reduced-motion.** All animations, transitions, and pulses honor `prefers-reduced-motion: reduce` with graceful fallbacks.

**See also:** your project's pattern library (if you maintain one) (full interaction pattern catalog with 60+ examples), your build-frame conventions (pipeline, accessibility, and responsive rules).

---

## Reference Implementation

Canonical production reel: `03_outbox/frames/20260415_chatgpt-transformer-creator-reel.html`

Use it as the starting point for any new reel. Preserve:

- HTML skeleton (see below)
- `data-title` on every slide article
- Bottom-bar note structure (counter + title)
- JS pattern: `update()` reads the active slide's `data-title` into `#noteTitle` and resets `scrollTop` on navigation
- Paper texture overlay on `.reel::after`
- Responsive media query at 720px for per-slide mobile fallbacks

## HTML Skeleton

```html
<main class="stage" role="main">
  <section class="reel" tabindex="0" id="reel">
    <div class="slides" id="slides">
      <article class="slide s1 active"
               data-slide="1"
               data-title="Cover"
               aria-hidden="false">
        <!-- slide 1 content : any layout -->
      </article>
      <article class="slide s2"
               data-slide="2"
               data-title="The reframe"
               aria-hidden="true">
        <!-- slide 2 content : different layout -->
      </article>
      <!-- ... -->
    </div>
  </section>
  <footer class="bottom-bar">
    <button class="arrow" id="prev" aria-label="Previous slide">◀</button>
    <div class="note" aria-live="polite">
      <span class="counter" id="counter">01 / 08</span>
      <span class="title" id="noteTitle">Cover</span>
    </div>
    <button class="arrow" id="next" aria-label="Next slide">▶</button>
  </footer>
</main>
```

## JS Core Pattern

```js
function update() {
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === index);
    s.classList.toggle('prev', i < index);
    s.setAttribute('aria-hidden', i !== index);
    if (i === index) s.scrollTop = 0;      // reset scroll
  });
  counter.textContent = `${String(index + 1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
  noteTitle.innerHTML = slides[index].getAttribute('data-title') || '';
  prev.disabled = (index === 0);
  next.disabled = (index === total - 1);
}
```

Navigation bindings: click on arrows, keyboard `ArrowLeft/Right/Home/End`, touchstart/touchend with 40px horizontal threshold.

---

## Version History

**v0.1** (2026-04-15): Initial spec. Square aspect ratio (1080×1080), in-reel arrows + indicator dots, no scroll within slides.

**v0.4.1** (2026-04-16): Cover Slide Specifics expanded with two hard-won spacing rules from live mobile testing. (1) **Descender clearance**: DM Serif Display g/p/y descenders crash into the `.week` subtitle when the cover h1 uses tight `line-height: 0.94`. Fix: `padding-bottom: 0.18em` on h1 + `margin-top: 0.32em` and `line-height: 1.15` on `.week`. (2) **Sig responsive stacking**: cover `.s1 .sig` flex must switch to `flex-direction: column` at `max-width: 720px` or the URL crashes into the Caveat handwriting on phone portrait. First validated by the [Org] aurora frame.

**v0.4** (2026-04-16): **Digest Mode rendering specification.** Bakes in hard-won decisions from live mobile testing into the lens spec so future frames render correctly without re-discovery. Critical rendering notes (no `position: fixed`, no `inset` shorthand, no pre-doctype content, ~85KB cap). Template structure locked: fixed vs. dynamic elements enumerated. Show-don't-tell principle replaces click-hint text. Bottom bar upgraded to three-tier hierarchy (TIME → TYPE → DOTS). Slide content hierarchy codified (8 elements in exact order, thread-notes promoted above body). Color system table with dark-section override requirements. Data attributes spec (`data-time`, `data-type`, `data-content-type`). Cover type pills as `<button>` elements with `data-filter` triggering a bottom-sheet overlay (full spec: HTML structure, JS index builder, open/close/navigate). Cover `data-time` shows browse time, `data-type` empty. Clickable `<a>` GitHub link in cover sig. Attribution rules formalized: source attribution per slide, compilation attribution is collective [Org] (never individual in rendered frames). Arrow buttons: dark ink bg, cream icon. Button styling: weight 800, 2.5px border, 6px shadow. Title wrapped in hyperlink. Source-lines prefixed with "by."

**v0.3** (2026-04-16): Engagement Principles added (10 principles from Pattern Vocabulary + Nicky Case canon). Cover click-hint pattern formalized : every reel includes a small dashed micro-instruction near the cover's section markers to teach the interaction. WCAG 2.5.8 touch-target minimum (44px) explicit. Overflow gradient mask for scrollable slides added to visual contract. Reduced-motion compliance required. Validated by the [Org] Digest reel (Week of April 7, 2026) : first Digest Mode production reel, 14 slides including internal-facing feedback slide.

**v0.2** (2026-04-16): **Major revision.** Validated by building a weekly-digest reel and iterating live on a phone:
- **Ditched the square constraint.** The reel now fills the full viewport. Square was leaving 45% of the screen as empty margin on portrait mobile.
- **Moved navigation to a persistent bottom bar.** In-reel arrows were eating card content. The bottom bar holds arrows + a center "note" (counter + slide title) and never overlaps slides.
- **Slides are vertically scrollable.** Reel pacing still favors tight content, but overflow is allowed and styled (thin rust scrollbar). Scroll resets on navigation.
- **Removed indicator dots.** The bottom-bar note does the work.
- **Per-slide dynamic layouts confirmed.** No cookie-cutter template. Each slide is its own composition.
- First production reel: `03_outbox/frames/20260415_chatgpt-transformer-creator-reel.html`.

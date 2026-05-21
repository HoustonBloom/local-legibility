---
type: lens
name: company-website
for: [human, ai]
visibility: local
status: pending
---
# Lens: Company Website

A multi-page marketing site for a company with multiple product lines or offerings. Bundled as a single shareable HTML file via a build script. No external file dependencies in the shipped output.

The multi-page sibling of [[Product Website]] (which is single-page).

## Canonical Reference

- **Window:** the bundled HTML deliverable (e.g. `03_cuts/<Your Project>.html`)
- **Frames:** one HTML file per page, named with date prefix (e.g. `03_cuts/frames/YYYYMMDD_<your-project>-<page>.html`)
- **Build pattern:** copy `01_tools/00_overview/build-window-frames.mjs` as a template, point its `FRAMES` array at your per-page files, set `OUT` to the bundled path
- **Window manifest:** `03_cuts/_window-<YourProject>.md` (lists frames + tab order)

When building a new instance, copy the scaffold and adapt content. The structure, voice, palette, and animation patterns are tested.

## When to Use

- Company has 2+ distinct product lines or service offerings
- Buyer needs a structured exploration (home → offerings → details → about)
- The deliverable needs to be sent as a single HTML file (email, DM, attachment)
- Audience: serious buyers who will spend 2–10 minutes with it
- You want a sense of "this is a real company" without standing up a real domain

If there's only one offering and the page is short, use the [[Product Website]] lens instead.

## Audience Contract

- One primary buyer persona drives voice across all pages
- Each page answers a different question for that persona
- They can leave at any tab and the site still made its case
- Specificity beats scope. Real numbers, real process, real people beat generic value props.

## Page Architecture

Five pages typical:

1. **Home** — the thesis, the offer, the bridge to detail
2. **Offering A** (foundation product, e.g. hardware) — one of N
3. **Offering B** (workflow/service product) — one of N
4. **Offering deep dive** — flagship offering with its own page (optional, linked from B)
5. **About** — vision, philosophy, person, lineage

All pages linked through a window shell with sticky nav.

## Window Shell

- Sticky nav, single row, ~60px tall
- LEFT: brand link (no underline, color accent on second word like `[Your Project]` with sage on `Technologies`)
- RIGHT: tab buttons + primary CTA, ~24px gap between nav and CTA
- "Offerings" is a dropdown showing each offering with a one-line description
- Mobile (≤720px): nav-right collapses to hamburger; opens a full-width sheet with all options + CTA
- Iframe-aware: each frame's per-page nav hides when loaded inside the window
- Cross-frame nav via `postMessage`: in-frame "Learn more" links message the window to switch tabs

## Per-Page Patterns

### Home (Landing)

1. **Hero** — bold reframe headline, action subhead, primary CTA + ghost CTA
2. **Differentiate** (dark bg) — "what your X becomes" with 4 outcome cards (icon + 1-line claim + 2-line proof). Cards pop in on scroll via IntersectionObserver.
3. **Product lines** (light bg) — N cards, one per offering, with prominent SVG icon, link to deep page
4. **How it works** — 4 numbered process steps, framed as service ("we customize the system for you, then hand you the keys")
5. **About teaser** — portrait card with short bio + Learn more link (postMessage to About tab)
6. **Final CTA** — single-action, dedicated section, soft-cream bg

### Offering Page

1. **Hero** — what this offering is, in plain language
2. **Diagram or animation** — concrete picture of what arrives at the customer (responsive HTML/CSS preferred over fixed SVG)
3. **Why this beats the alternative** — 3 value props in a triple grid
4. **Sizing/options** — 2-column comparison if there are tiers
5. **What's included / pricing** — rows or cards. TBD ranges are honest when true.
6. **CTA** back to walkthrough

### About / Vision

1. **Hero** — bold company belief statement, present tense
2. **Mission** — kicker "What we believe", body two short paragraphs
3. **Philosophy** — 4 principles in numbered cards (2x2 grid)
4. **Person card** (dark bg) — portrait + bio + role, one person responsible
5. **Lineage / What we build with** — 3 open projects or pillars in a triplet, framed as active tooling not origin story
6. **Final CTA** back to walkthrough

## Voice

- **Present-tense, action-led.** "We build" / "we believe" / "we install." Not "long-running spec" or two-year history.
- **No SaaS-speak.** No "transform," "empower," "democratize," "in today's world."
- **No em dashes.** Colons and periods. (House rule.)
- **Specific over sweeping.** "Three workshops, each 90 minutes" beats "comprehensive training."
- **Treat the reader as smart.** Don't pre-explain or hedge.
- **Bold claims, paid for with proof.** Each declarative statement gets a concrete supporting line.

## Visual System

- **Palette:** warm cream (`#faf6ee`) + sage (`#6fa67f`) + butter (`#f5d88e`) + blush (`#f9a8b8`) accents. Dark sections use `#1f1d1a`.
- **Type stack:**
  - Plus Jakarta Sans (display, headlines)
  - Space Grotesk (body)
  - Aldrich (retro/mono labels and kickers)
  - JetBrains Mono (code, prices)
  - Caveat (optional hand-script for explainer notes)
- **Neo-brutalist offset shadows** on key cards: `box-shadow: 4px 4px 0 var(--ink)` with 2px ink border
- **Dark sections** (`--ink` bg) for high-impact reframes; butter accents for kickers, paper for body text
- **SVG animations** use `transform-box: fill-box` for origin-correct scaling at any viewport size
- **Icons** are inline SVG, sage-deep stroke on cream fill (or sage-soft fill in dark sections with butter stroke)
- **Sticky table-of-contents bg blur:** `backdrop-filter: blur(10px)` with 92% opacity paper

## WCAG / Accessibility

- **AA contrast minimum** on all text:
  - `--ink-faint: #6e6760` (5.7:1 on paper)
  - `--ink-soft: #44403c` (10:1 on paper)
  - `--sage-deep: #1f5028` (8.6:1 on paper)
- Skip link styled as visible focus target
- `focus-visible` outlines on interactive elements
- ARIA on tabs (`role="tab"`, `aria-selected`), menus (`role="menu"`, `aria-haspopup`)
- Keyboard navigation: arrow keys for tabs, Esc closes dropdown/sheet
- Animations respect `prefers-reduced-motion`

## Output Contract

- Each page is a self-contained HTML file in `03_cuts/frames/`
- A Node build script bundles them into the deliverable:
  - Reads each frame
  - Inlines image assets (e.g. portraits) as base64 data URIs
  - Escapes HTML for `srcdoc` attributes
  - Wraps everything in the window shell with iframe panes
- Bundled output: ONE HTML file (~100-150 KB), opens anywhere, no folder structure required
- Re-run the build whenever frame content changes

## File Structure

```
03_cuts/
  build-window.mjs                     ← your bundler (copied from build-window-frames.mjs)
  COMPANY NAME.html                    ← bundled output
  _window-CompanyName.md               ← window manifest (frames + tab order)
  frames/
    YYYYMMDD_company-home.html
    YYYYMMDD_company-offering-a.html
    YYYYMMDD_company-offering-b.html
    YYYYMMDD_company-offering-flagship.html
    YYYYMMDD_company-about.html
    _assets/
      portrait.jpg                     ← inlined to base64 at build time
```

## Adapting the Build Script

Use `01_tools/00_overview/build-window-frames.mjs` as the template (it's the script that builds the packet's own `Getting Started.html`, applying the same multi-frame bundling pattern). To create a new instance:

1. Copy `build-window-frames.mjs` to your `03_cuts/` folder, rename to fit (e.g. `build-window.mjs`).
2. Update the `FRAMES` array with your per-page filenames and tab labels.
3. Update the `OUT` path to your bundled deliverable.
4. If you need image inlining, add an `inlineImageIfPresent` step pointing at your asset name.
5. Customize the inline window CSS/HTML in the script if your brand styling differs.
6. Run the script.

## De-emphasis

- Long origin stories
- "Trusted by..." walls before there are real customers
- Multiple competing CTAs per page
- Generic hero illustrations or stock photography
- Cookie banners, trust badges, the rest of the SaaS template uniform
- Subscription pricing as the only model (offer one-time fees where possible)
- Hidden mobile menus that hide important nav (use a sheet that shows everything)

## Length

- **Home:** 5–7 sections. Scannable in 60 seconds. Readable in 3 minutes.
- **Offering pages:** 5–7 sections. Deeper detail. Readable in 3–5 minutes.
- **About:** 5 sections. Vision-forward. Readable in 2 minutes.
- **Total bundle target:** under 150 KB

## Building your own

Run the adapter prompt at `01_tools/00_overview/ADAPTER-PROMPT.md` and ask for a Company Website cut for your project. The skill will read your content, draft the five-page architecture, and produce both the per-page frames and the bundled window file. Filename pattern: `03_cuts/frames/YYYYMMDD_<your-project-slug>-<page>.html`, with the bundled window at `03_cuts/<Your Project>.html`.

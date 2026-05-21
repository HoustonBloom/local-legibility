---
name: cut-packet
description: Generate or regenerate an intelligence packet from a cut config file. Use when the user says "regenerate this cut", "build the packet", "update the intelligence packet", mentions a cut by name, or when processing a cut config's task field with @claude instructions. Also triggers when the user asks to "cut" content, "package" session work, or create a shareable HTML snapshot of vault content.
---

# Cut Packet Generator

Generate a self-contained HTML intelligence packet from a cut configuration file.

## What This Does

A **cut** is a curated selection of vault content, defined by a config file in `03_cuts/`. Each cut config specifies:

- **content-tag**: A visibility value. Vault files with this value in their `visibility` array are included in the cut.
- **lens**: How to render the content (e.g., `reel`, `explainer`, `product-website`, `company-website`, `pitch`, `share`, `reddit`, `first-look`). Several other lenses (`observatory`, `recap`, `status-report`, `storyboard-editorial`, `activity-timeline`) are spec'd but examples are coming soon.
- **audience**: The contact (or role) the cut targets. When the audience is a specific contact with a profile in `01_tools/05_contacts/<Name>.md`, read their `Rendering Preferences` section and apply it as a contact overlay on top of the lens defaults.
- **style-source**: Which design tokens to bake in (e.g., `default-tokens`).
- **art-direction**: Tone, audience, emphasis, visual notes written in the body of the config.
- **output**: Where to write the HTML packet.

The output is a **self-contained HTML file** (an intelligence packet) that opens in any browser with no dependencies.

## Workflow

### 1. Find the Cut Config

The user will either name the cut directly or you can scan `03_cuts/frames/` for `_config.md` files with `type: cut` in their frontmatter. Window manifests (`_window-*.md`) stay at the `03_cuts/` level. Everything else lives in `frames/`.

```
03_cuts/
  README.md                                              ← system docs
  _window-SystemExplorer.md                              ← window manifest (stays at top level)
  frames/                                                ← all configs and rendered frames
    _System Explainer.html                               ← THE window
    20260331_data-sovereignty-audience-briefing_config.md     ← cut config
    20260331_data-sovereignty-audience-briefing.html          ← rendered frame
```

**Naming convention:** `YYYYMMDD_concept-descriptor_config.md` for configs, `YYYYMMDD_concept-descriptor.html` for frames. Date first for sort order. Underscore separates date from concept. Hyphens within concept/descriptor.

### 2. Read the Config

Parse the YAML frontmatter for:
- `content-tag`: the visibility value to scan for
- `lens`: which rendering approach to use
- `audience`: who the cut targets (used to resolve the contact overlay)
- `style-source`: which design tokens to apply
- `output`: where to write the HTML file

Read the markdown body for:
- **Inputs** section: intended files (for reference, but the canonical source is the visibility scan)
- **Voice** section: how to speak, the relationship to the reader
- **Emphasis** section: what to lead with, what matters most
- **De-emphasis** section: what to compact or minimize
- **Visual Direction** section: layout preferences, component choices, color/type hierarchy
- **Structure** section: how to organize the content (BLUF first, timeline-forward, walk-through, etc.)

The cut config carries its own voice direction in the body. If a body section is absent, the contact overlay or lens defaults fill it in.

### 2.5. Resolve Contact Overlay (if audience is a specific contact)

If the `audience:` field names a specific contact and a profile exists at `01_tools/05_contacts/<Name>.md`:

1. Read the profile. Look for a `Rendering Preferences` section (load-bearing when `rendering-profile: true` is set in frontmatter).
2. Parse Visual Language, Information Architecture, What to Emphasize, and What to De-emphasize subsections.
3. Store these as the contact overlay.

If no profile exists or the section is empty, skip the overlay.

### 3. Apply Voice Direction (Composition Stack)

For each art direction section (Voice, Structure, Emphasis, De-emphasis, Visual Direction), compose from top to bottom:

1. **Cut config body** (highest): If the cut config has this section with content below the heading, use it.
2. **Contact overlay** (middle): If the section is absent from the cut config and a contact overlay was resolved in step 2.5, use the contact's rendering preference.
3. **Lens defaults** (lowest): If neither provides the section, fall back to lens-level defaults.

Sections resolve independently. A cut config can override Voice while leaving Emphasis, De-emphasis, and Visual Direction to the contact overlay or the lens defaults.

Style-source tokens (color, typography, spacing) are baked in at step 6 and apply regardless of which layer provided the voice direction.

### 4. Scan for Tagged Content

Search the vault for all files where the `visibility` field in YAML frontmatter contains the `content-tag` value. Use grep to find them:

```bash
# Find files with the content-tag in their visibility field
grep -r "visibility:.*CONTENT_TAG" --include="*.md" /path/to/vault
```

Read each matched file. Extract:
- Title (from `# heading` or frontmatter)
- Content body
- Frontmatter metadata (type, project, status, date, sourceTool, trust)
- Connections

### 5. Select and Apply the Lens

Each lens is a layout pattern. The kit ships specs for the lenses below in `01_lenses/{Lens Name}.md` — read the matching spec for full structural detail. Sample renderings live in `01_lenses/_examples/` and are surfaced through the lens catalog (`00_overview/lens-catalog.html`).

**Currently shipped lens types:**

#### `reel`
A full-viewport set of 5 to 9 scrollable slides with persistent bottom-bar navigation. Audience-facing, social-shareable, non-technical. Each slide stands on its own. Full spec: `01_lenses/Reel.md`.

**Per-slide attributes:** each `<article>` slide has `data-slide="N"`, `data-title="..."` (for the bottom-bar note), and `class="slide sN"`. Layout is dynamic — each slide composes itself; no single template.

**Slide contract:** title (1–6 words), body (~60 words preferred, up to 120 if scroll-justified), optional visual, optional accent. The cut config body's `## Slides` section provides the structural spine.

**Chrome:** a persistent bottom bar holds the prev arrow, a center note (zero-padded counter `03 / 08` + slide title from `data-title`), and the next arrow.

**Navigation:** bottom-bar arrow buttons, keyboard arrows (← → plus Home/End), and swipe on touch (40px threshold). Scroll resets on navigation.

**Use when:** publishing a story your audience can scroll through on a phone — essay drop, product launch, digest of curated links, campaign explainer.

#### `explainer`
Numbered "beats" walking through a concept, with file previews and hand-written margin notes. Each beat shows the actual artifact (a file, a code block, a diagram), then annotates what matters and why. Teaches by demonstration. Full spec: `01_lenses/Explainer.md`.

**Use when:** explaining how something works to someone who'll learn faster from seeing the real thing — onboarding docs, system explanations, peer-to-peer guides.

#### `product-website`
A single-page marketing site for one product, service, or pitch. Conversion-shaped. 9 sections: hero, the trap, what we install, what members get, what your space becomes, how it works, what's included, who you're working with, closing CTA. Full spec: `01_lenses/Product Website.md`.

**Use when:** you have one offering and one buyer persona and want a fast spin-up that's emailable as a single HTML file or printable to PDF.

#### `company-website`
A multi-page marketing site for a company with multiple offerings. Bundled as one self-contained HTML using a build script copied from `01_tools/00_overview/build-window-frames.mjs` and pointed at the per-page frames. 5 pages typical: Home, 2-3 Offerings (under a dropdown), an optional flagship deep-dive, an About / Vision page. Single-row sticky nav with mobile hamburger. Full spec: `01_lenses/Company Website.md`.

**Use when:** you have multiple product lines or services and want a structured exploration. Each offering gets its own page with depth. Send the whole site as one file.

#### `observatory` *(spec only — example coming soon)*
A live-status constellation view of a project, with timeline scrubber + active-project planets. Spec ships in `01_lenses/Observatory.md`; rendered example is being rebuilt — don't invoke this lens yet.

**Use when (once shipped):** you want a "where things are right now" snapshot that's denser than a Recap but lighter than a full project hub.

#### `pitch`
Story-driven slideshow for live narrated pitch delivery. 11 slides across five movements (Title · Shift · Stakes · Promised Land · Why Now · Experience · Magic Gifts · Evidence · Peak · Ask · Close). Keyboard, click, and swipe nav. Presenter mode (P · speaker notes, T · count-up timer, F · fullscreen). Mobile-first responsive at 375px. Full spec: `01_lenses/Pitch.md`.

**Required cut config fields:** `audience:` (named person or role), `audience-type:` (one of `vc` · `impact` · `grant` · `crowdfund` · `steward`).

**Optional cut config fields:** `time-budget:` (`3min` · `5min` default · `10min`), `capital-stage:` (`pre-seed` · `seed` · `series-a` · `grant` · `community`).

**Filename rule:** rendered output must end with `-pitch.html` (lens slug as final segment, per the lens-in-filename rule). Example: `20260504_yourproject-impact-pitch.html`.

**Generation protocol** (run before rendering, per spec §Generation Protocol):
1. Strategic narrative foundation · Old Game, Stakes, Promised Land, Magic Gifts, Evidence
2. Capital match · validate the audience-type fits the project's economic shape
3. Format choice · apply time-budget (3min compresses to 5-7 slides; 5min default 11; 10min adds detail)
4. Sparkline storyboard · sequence the slides as alternating "what is" / "what could be"
5. Audience-specific adjustments · apply variant emphasis from the spec's Capital-Type Variants section
6. Stress-test against the hard questions · scale, exit, moat, why-now, why-you, cost of inaction

**If `audience-type:` is missing from the cut config, ask the user before generating.** The deck shape depends on it. Same project, five different pitches by capital type.

**Use when:** the user needs to persuade live. Pitch competitions, investor meetings, partner buy-in, foundation pitches, internal stakeholder asks. The Pitch lens is presentation-mode (live narration); for asynchronous send-ahead pre-reads of 15+ slides, the pre-read variant is on the v1.1 roadmap.

**Do not use when:** the goal is comprehension (use Explainer), session record (use Recap or Status Report), operations dashboard (use Observatory), or a one-page conversion website (use Product Website).

#### `share`
A preview-forward, one-item-at-a-time stumble through a set of captured items (markdown, HTML, PDFs, external URLs), closed by a synthesis recap that weaves threads across the items. Full spec: `01_lenses/Share.md`.

**Per-item display modes:** each content slide renders the item in one of three modes — `inline` (markdown rendered natively inside the slide frame), `iframe` (HTML / PDF / URL embedded with sandbox and lazy-load), or `summary` (title + source + "why this matters" hero + "holding the thread" scrawl + button to the source). The system auto-picks the mode by content type and auto-falls back from iframe to summary when an X-Frame-Options / CSP block is detected. Manual override is available per-item via `display-mode:` in the cut config's item list.

**Opener modes:** either `bluff` (a single framing statement) or `categories` (a chip row with counts and a `category-map` that accents each category with a token). Required field in the cut config: `opener-mode: bluff | categories`.

**Recap:** the closing slide weaves the items into a set of `threads` (an array of short phrases declared in the cut config) and surfaces a "primes for next time" note. The recap body can be supplied inline via `recap:` in the cut config, or composed at render time from the item list + threads.

**Chrome:** a fixed top chip shows the current item's category + counter; a fixed bottom bar holds prev / progress / "↓ recap" jump / next. Keyboard: ← → Home End plus `r` to jump to the recap. Swipe: 40px threshold. No `localStorage`. Sandboxed iframes with `loading="lazy"`. `prefers-reduced-motion` collapses the slide transition.

**Per-item fields** (in the cut config's `items:` list): `path` (source file), `display-mode` (optional override), `category` (maps to `category-map` entry), `title` (optional override), `why` (the "why this matters" hero copy), `thread` (the handwritten "holding the thread" note, summary mode only), `action` (one of `needs review`, `in progress`, `parked`, `shipped`), `source-note` (small mono-font source attribution).

**Use when:** closing out a session and sharing the work product with a collaborator, handing a reviewer a batch of items in one URL without asking them to chase wikilinks, threading a week of captures into one artifact that shows the actual content of each item, or sharing a Slow Water queue externally. Distinct from Reel · Digest Mode — Reel · Digest Mode is big-link-button to an external source; Share is preview-in-place of your own or your circle's captured material.

**Do not use when:** every item is an external link meant to be opened away (use Reel · Digest Mode), you are building a single-argument narrative across slides (use Reel), the content is one cohesive essay (use Explainer), you want a conversion-shaped landing page (use Product Website or Pitch), or there are fewer than 3 items (the stumble doesn't earn its chrome — just send the content).

#### `reddit`
Vault content rendered as an authentic-feeling Reddit home feed. A feed of post cards using real Reddit chrome (orange snoo, `#DAE0E6` grey background, subreddit icons, native typography) that each open to an individual post page with threaded comments between configured personas. Every butter-highlighted claim in post bodies and comments is a hyperlink that opens the source markdown in an iframe modal, scrolled to the referenced section. Usernames encode provenance — before clicking, the handle tells the reader what kind of source. Full spec: `01_lenses/Reddit.md`.

**Voice:** authentic Reddit, not essay voice. Flair prefixes (`[Field Report]` `[Showcase]` `[Discussion]` `[Rant]`), lowercase openings, specific numbers, self-deprecation. Comments poke holes, never amplify. Each persona has a stake. No fabricated collective voice.

**Required:** cut config must specify `audience:` (one reader, named) and provide a persona roster (or accept the default four: primary author / secondary author / AI persona with `[BOT]` flair / two background voices who only comment). Hand-authored post titles and comment threads (6–11 comments per post).

**Use when:** the target reader prefers discussion-forum reading over essay reading, content benefits from multi-perspective surfacing, or a specific contact has "Reddit" in their Preferred Lens slot (check `05_contacts/<Name>.md`). First field-tested with [a named contact], who believed the frame was Reddit on sight and read all titles on the landing page.

**Do not use when:** the deliverable is formal (board packets, grant reports, compliance), the reader distrusts Reddit-coded UI aesthetically, content requires linear reading, or fewer than 5 vault files are being surfaced (feed feels empty below that).

#### `storyboard-editorial` *(spec only — example coming soon)*
Editorial storyboard frames for narrative use cases. Each frame carries one scene, one narrative, and one set of design principles, composed in a warm cream editorial aesthetic with hand-crafted SVG illustration. Frames render alone or stack inside a storybook-carousel window. Structure per frame: eyebrow label, serif italic title, italic dek, full-width SVG scene, sans-serif caption, prose body, principle chip row, rule with "how the data moves" eyebrow, flow strip SVG, right-aligned footer attribution. Four bracket corners mark the frame's edges. Full spec: `01_lenses/Storyboard Editorial.md`.

**Use when:** walking a reader through a scene before explaining the system behind it — narrative use case storyboarding, presentations, pitches, any content where illustration must carry emotional register, not decorate. Do NOT use for technical docs where illustration would mislead, or data-heavy content where charts would carry the meaning.

**Status:** Reference implementation (`20260419_relational-space-storyboards-v2`) is not yet rendered. The spec is complete and the lens can be invoked, but there's no canonical example yet. Flag this if the cut-packet skill is asked to render with this lens and no sample exists to reference.

#### Future lenses (not yet implemented)
- `trust-dashboard` — Provenance audit view across multiple cuts
- `project-overview` — Single project deep dive (different from observatory: archival vs live)
- `diff-lens` — What changed between two dates
- `research-brief` — Academic-style summary


### 6. Apply Style Tokens

Read the style source reference file at `../../03_design-system/<style-source>.md` (relative to the workflows folder) if it exists. Otherwise use defaults.

#### `default-tokens` tokens (default)

Fonts:
- Body: Space Grotesk
- Display: Plus Jakarta Sans
- Retro: Aldrich
- Mono: JetBrains Mono

Colors:
- Ink: #09090b, Paper: #fafafa
- Lavender: #c4b5fd (initiative), Sage: #86c195 (product), Sky: #7dd3fc (research)
- Butter: #f5d88e, Blush: #f9a8b8
- Light variants: lavender-light #ede9fe, sage-light #dcfce7, sky-light #e0f2fe, butter-light #fef9c3, blush-light #fce7f3

Visual patterns:
- Retro offset shadows: `4px 4px 0 var(--color-ink)`
- Border: `2px solid var(--color-ink)`, border-radius: 6px
- Cards: border + shadow + white background
- Type badges: colored dot + uppercase label

### 7. Generate the HTML

Build a single self-contained HTML file with:
- All CSS inline in a `<style>` block (tokens as CSS custom properties)
- Google Fonts loaded via `<link>` tags
- All content rendered as semantic HTML
- A provenance footer showing: source tool, trust level, cut ID, lens name, style source (marked "baked")
- Responsive layout (works on mobile)

Write the file to the `output` path specified in the cut config.

### 8. Present the Packet

After generating, do BOTH of these:

1. Use `present_files` to show the HTML to the user so they can open it in their browser.
2. End your chat reply with the EXACT absolute path to the generated HTML file, on its own line, labeled:

   > Your frame is at: `<absolute-path>/03_cuts/frames/<filename>.html`

   The path must be literal (not a bracketed placeholder) so the user can navigate to the file directly. This applies to every frame you produce — including First Look, reels, explainers, and all other lenses.

## Regeneration

When regenerating an existing packet:
1. Re-read the cut config (it may have changed)
2. Re-resolve the contact overlay if the audience is a specific contact (their profile may have been updated)
3. Re-scan for tagged files (new files may have been tagged)
4. Re-apply art direction using the composition stack (cut body > contact overlay > lens defaults > style-source tokens)
5. Overwrite the existing HTML at the output path
6. Present the updated file

The packet is always a pure function of: tagged content + art direction + lens + style tokens. Same inputs, same output. Change any input, the output changes.

## Adding Files to a Cut

To add a file to a cut, add the cut's `content-tag` value to the file's `visibility` array:

```yaml
# Before
visibility: local

# After (file is now in the data-layer-session cut)
visibility: [local, data-layer-session]
```

The human decides what's in. The system reads the tags.

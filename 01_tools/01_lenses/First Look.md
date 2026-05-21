---
type: lens
name: first-look
for: [human, ai]
visibility: local
status: active
---
# Lens: First Look

The kit's onboarding lens. Produced automatically by the adapter prompt the moment a new user runs it against their folder. Lands in their folder at `03_cuts/first-look.html`.

The First Look frame is the user's first artifact. It tells them what their folder contains, what the packet can do for them right now, and offers one-click copy buttons to try each available lens.

## Canonical Reference

- **Example rendering:** `lenses/_examples/example-first-look.html`
- **Trigger:** the adapter prompt's Step 2 (MANDATORY — produced before the conversational reply)
- **Output location:** the user's `03_cuts/` folder, as `first-look.html`. The AI must reference this file by its absolute path in its closing reply.

## When to Use

- Always, on first contact with a folder. The adapter prompt produces this automatically.
- Optionally, again later, after the user has added new content or restructured. Re-running gives them an updated assessment.

Don't use this lens for general-purpose framing. It's specifically for the onboarding moment.

## Audience Contract

- One reader: the packet user themselves
- They've just pasted the adapter prompt
- They want a quick read of their own folder + clear next steps
- They don't want a wall of text. Stat cards, ranked lenses, copy buttons.

## Structure (6 sections)

1. **Hero** — `First Look · Kit Setup Report` stamp, claim ("Your folder, ready to publish"), 1-line scan summary.
2. **What we found** — short prose assessment + 4 stat cards (file count, files with frontmatter, project hubs, daily notes — adjust to what was actually found).
3. **What we wired up** — transparency on what the adapter changed. 2x2 grid of cards covering: source folder mapping, frontmatter additions (which files), skill installation location, path constants updated. Each card has a `from → to` line in mono and a short why. Educates the user as it informs them. **Skip cards that don't apply.**
4. **Growth guide** — numbered list of things to do *as you scale*, not right now. Max 3 items. **The section is education, not a to-do list.** It teaches the user when each change becomes needed so they make it at the right time. Section kicker: `Growth guide · know what to add, and when`. Section heading: `Make the system work better as you grow.` Each item has:
   - **Title** — the concrete change, in-context
   - **Scale badge** — one of three visual urgency signals (see below)
   - **Capacity bar** — only if the threshold is quantitative (e.g., file counts). Shows current value / threshold / fill percentage / short note about runway.
   - **Why it matters** — one-sentence explanation of what the change unlocks
   - **When it matters** — one-sentence explanation of the current state vs. the threshold at which this becomes needed
   - **Code card** — optional, for YAML snippets with a copy-snippet button

   **Scale badge variants (CSS classes on `.scale-badge`):**
   - `.required` (red/blush) — blocking; the user cannot achieve their stated goal without this
   - `.at-scale` (butter/yellow) — fine now, becomes needed past a quantitative threshold (show a capacity bar)
   - `.nice` (sage/green) — optional; unlocks a specific feature or quality-of-life improvement

   **Capacity bar component:** wraps `.capacity-labels` (current value + threshold), `.capacity-track` with `.capacity-fill` (width = current/threshold * 100%), and `.capacity-note` (plain-English interpretation like "20% of threshold. Plenty of runway."). The fill gets an extra class of `.warning` past 60% or `.critical` past 85%.

   **Skip the section entirely if nothing applies** — an empty growth guide is worse than none.
5. **Suggested next** — a lens-grid of cards, one per ranked lens, adopting the same card shape as the Packet's Lenses-tab catalog (`.lens` sections with `.preview` + `.lens-body`). Each card has an SVG preview on the left and a body on the right: `.lens-meta` (badge + "Lens · Name"), heading, tagline, "What is it" block, "Why use it" block (personalized to the user's folder), and a `Preview lens` button wired to `data-example` / `data-lens` / `data-prompt` so the embedded modal can open a live example without spending AI tokens.
   - **Top-ranked card** gets `class="lens top-ranked"`, a `★ Best fit` badge in its `.lens-meta`, a `.winner-note` line reading `★ Best fit — this is the lens we'd produce first.`, and heavier visual weight on the preview (`2.5px` border, `6px 6px 0` shadow).
   - **Subsequent cards** use the standard `Ready` badge.
   - **Company Website** carries a `<span class="plan-flag">High token cost</span>` pill inside its `.lens-meta`. Apply the same flag to Reel if slides >9.
   - **Observatory** is shown as a 7th card with a `Coming soon` badge and a `.soon-pill` reading `Example coming soon` instead of a Preview button.
   - Do not include stars, rating dots, or a compact "others" table — those have been removed. No "produce my first frame" secondary button in this section either; that CTA lives only in the final section.
6. **Final CTA** (dark) — "Want us to produce the top-ranked frame right now?" + big primary button that triggers a toast telling the user the exact copy-paste prompt (`Cut me a frame using the [Winner] lens.`).

## Token Cost Reference (empirical, from reference vault)

| Phase | Cost | Notes |
|---|---|---|
| Input: skill + spec docs | ~10K tokens | Constant per run |
| Input: vault file reading | 15–40K tokens | Depends how many files the cut sources |
| **Subtotal: input** | **25–50K tokens** | |
| Output: light lens (Product Website, Explainer, Pitch) | 5–10K tokens | Per single frame |
| Output: medium (Recap, Status Report) | 10–15K tokens | Per single frame |
| Output: heavy (Reel) | 20–30K tokens | Variable: ~3–5K per slide |
| Output: bundled multi-page (Company Website) | 80K+ tokens | **5 separate frame runs**, then bundled |
| **Per-frame total** | **30–100K tokens** | |

Source: HTML byte counts of 30+ rendered frames in the reference vault. Token estimates assume ~3.5 tokens per HTML byte average.

## High-Token-Cost Flagging

**No stars, no rating dots — they confused users.** Instead, flag a lens ONLY when its token cost reliably exceeds what a typical consumer AI session can deliver in one go.

Consumer AI sessions give roughly 250–500K tokens before rate-limit slowdowns. Most lenses fit comfortably:

- Single light/medium/heavy frame: fits in one session
- **Multi-page bundles run the skill 5x** — these can hit 80–100% of session capacity

**Apply the `<span class="plan-flag">High token cost</span>` flag ONLY to:**
- Company Website (bundled output across 5+ pages)
- Reels with >9 slides on a content-heavy folder

Skip the flag on every other lens. Don't pre-warn for "medium" cost — users can handle a single frame on any plan. The flag signals effort, not billing — the packet itself is free.

## Voice

- Plainspoken, encouraging, never demanding.
- Lead with what works. Suggested changes come last and are framed as optional.
- Specific. "Reel — your daily notes are perfect for this" beats "the Reel lens may suit your content."
- Treat the reader as smart. They know their folder.

## Visual Direction

- Same warm-cream design system as the rest of the packet.
- Stat cards: neo-brutalist with offset shadow, color variants (sage / butter / sky / paper).
- Lens rankings: numbered, fit badges with stars, prompt preview in mono dim text, primary copy button.
- Code cards (for YAML snippets): monospace body with syntax-tinted keys, copy button in head bar.
- Final CTA: dark inverted section with butter accents, big primary button with thick offset shadow.
- Toast notification on successful copy ("Prompt copied — paste into your AI").

## What the AI Should Personalize

When generating a First Look frame for a real user, replace the example values with actual scan results. **Treat the HTML as a template — only the values below change.**

- **Hero meta line:** real file count, folder count, suggested overhaul count
- **Stat cards:** real numbers from the scan
- **What-we-found prose:** specific to what was found (e.g., "Most files have clear titles. You have a daily notes pattern but no changelog yet.")
- **Growth guide items:** ONLY include items that actually apply to this folder's current or near-future state. Assign each the right scale badge (`required` / `at-scale` / `nice`) and, for `at-scale` items, populate the capacity bar with the user's real current value (e.g., their actual non-markdown file count) vs. the threshold at which that overhaul becomes needed. The "When it matters" prose should reference their real numbers. If frontmatter is fine, don't suggest adding it. Skip the section entirely if zero items apply.
- **Top-ranked card (`.lens.top-ranked`):** lens name, 1-sentence why-this-fits in the `.why` block, `★ Best fit` badge, `.winner-note` line, `data-prompt` on the Preview button. The card structure stays.
- **Subsequent lens cards:** lens name, 1-line why (personalized to the user's folder), `data-prompt` on the Preview button. Re-use the SVG previews and "What is it" copy from the Packet's `lens-catalog.html` verbatim — don't reinvent them.
- **Prompt format (all lenses, consistent):** `Cut me a frame using the [lens-name] lens. [one-line qualifier]. Save to 03_cuts/frames/ and tell me the exact path.` Do not vary the wrapper — only the qualifier changes per lens.

## Token Efficiency

This lens is generated on every adapter run, so HTML output cost matters. Built-in efficiencies:

- **Re-use SVG previews and "What is it" copy from `lens-catalog.html` verbatim.** The First Look frame embeds those assets; don't regenerate them per user.
- **Prompt text and the `.why` (one-line fit rationale) are the only fields that vary meaningfully per lens.** Keep each short (1-2 sentences).
- **Embedded modal + `<template>` tags are baked in by the build script.** Each Preview button hands the modal the template id plus `data-lens` / `data-prompt` — no per-user work needed.
- **Skip overhauls section if not needed.** Don't generate placeholder content.
- **Don't repeat lens descriptions from the catalog.** The First Look frame's job is to RANK, not document. Refer the reader to the Lenses tab for full descriptions.

A typical First Look frame should be ~350 lines of HTML, including all CSS. The example reference is the upper bound — real outputs can be shorter.

## Output Contract

- Self-contained HTML (no external dependencies beyond Google Fonts).
- Saves to user's `03_cuts/first-look.html`.
- Opens in any browser. Functional offline.
- Copy buttons work via Clipboard API.

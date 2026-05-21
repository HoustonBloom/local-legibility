---
type: lens
name: reddit
for: [human, ai]
visibility: local
status: active
---

# Lens: Reddit

A lens that renders vault content as an authentic-feeling Reddit home feed. Each source becomes a post card. Click a card → individual post page with threaded comments. Every claim in post bodies and comments is a hyperlink to the source markdown, rendered in an iframe modal scrolled to the relevant section.

The trick: the medium is the ask. A reader who usually skips long-form vault docs engages because the chrome is familiar. The content is the work surfacing in a form they already scroll.

---

## When to use

- Audiences who prefer discussion-forum reading over essay reading.
- Readers who appreciate skepticism, pressure-testing, receipts in comments.
- Content that benefits from multi-perspective surfacing (one claim, many angles).
- Situations where engagement beats completion. Feed reading is browsing, not finishing.
- **Contact has Reddit lens in their preferred-lens slot.** Check their `05_contacts/<Name>.md` for a Preferred Lens section. Default to this lens when it's named there.

## When NOT to use

- Formal deliverables to institutional audiences (board packets, grant reports, compliance docs).
- First-contact introductions where the receiver doesn't know the personas or the vault.
- Content that requires linear reading — arguments that build sequentially, long-form proofs, walkthrough tutorials (use Explainer instead).
- Audiences who distrust Reddit-coded UI aesthetically. Corporate buyers, academic reviewers, older readers who associate Reddit with toxicity.

## The question it answers

"What's the conversation around this body of work if the right people were scrolling it on a Tuesday night?"

Not "what is this" (Overview) or "how does this work" (Explainer). The Reddit lens answers a question about ambient engagement: what would a curious peer notice, poke at, link to, and respond to if they stumbled into this on a normal day? The comment threads are not decoration — they ARE the reading experience. The post is the invitation. The thread is the conversation.

---

## Visual language

Real Reddit chrome, mobile-first, light mode. Not "inspired by" — visually indistinguishable at first glance.

**Colors:**
- Page background: `#DAE0E6` (classic Reddit grey)
- Card: white (`#FFFFFF`)
- Border: `#EDEFF1`
- Primary orange: `#FF4500`
- Link blue: `#0079D3`
- Grey text: `#787C7E`
- Text: `#1A1A1B`

**Typography:** system font stack matching Reddit mobile (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial`). The vault's own design system (Plus Jakarta Sans, Space Grotesk) ONLY surfaces inside the source modal — a deliberate tonal shift signaling "you left the feed, you're in the source now."

**Chrome elements:**
- Orange snoo logo circle + "reddit" wordmark (wordmark hidden below 480px width)
- Search input (disabled — decoration)
- Bell / message / avatar icons on the right
- Sticky feed tabs: Home / Popular / All / Latest
- Subreddit icons: colored circles containing `r/`
- Post cards: rounded corners, subtle border
- Vote bar: ▲ count ▼
- Comment action row: vote bar + 💬 count + Share + Save

**Source modal break:** when a claim is clicked, the modal switches to a pastel design system (Plus Jakarta Sans, lavender/sage/butter accents). Reddit outside, vault inside.

---

## Structure

### Home view

A feed of post cards. Each card:

- Subreddit icon + name (e.g., `r/LocalFirstAI`)
- `Posted by u/<username> <age> ago`
- Title (17px, semibold, 4-line clamp)
- Body preview (truncated, 4-line clamp)
- Action row: vote bar, comment count, Share, Save

Feed renders 5–10 posts. More than 12 dilutes the feed. Fewer than 5 feels empty.

### Post view

Click a card → individual post page.

- Back link
- Full post card (title + full body)
- Comments header: `<N> Comments` + sort chip
- Threaded comments (persona avatars, user handles, timestamps, scores, comment bodies, reply/share actions)

URL updates to `#post=<id>`. Browser back works as expected.

### Source modal

Click any butter-highlighted claim or section reference → modal opens with the source markdown rendered as HTML, auto-scrolled to the referenced section. Breadcrumb shows `source / <file> / <section>`. Close, back, or outside-click dismisses.

### User popup

Click any username → popup with the persona's handle, display name, banner color, and one-sentence description of who they are and what content they post. Serves as a legend for readers who don't decode the provenance scheme automatically.

---

## The username / provenance system

**Usernames encode who authored the underlying content.** Before the reader clicks, the handle tells them what kind of source.

The default persona roster is four:

| Handle pattern | Role | Voice | Posts content sourced from |
|---|---|---|---|
| **Primary author** (Owner's pen name or alias) | The content's human owner | Dry, specific, hardware-brained, "my partner/colleague" framing | Files about the owner's own work |
| **Secondary author** (Operator's handle) | The operator publishing the frame | Direct, confident, systems-literate, occasionally fed-up | Operator's own proposals and research |
| **AI persona** (Primary agent identity) | AI-generated content with `[BOT]` flair | Analytical, cites receipts, surfaces data | AI research dumps, compass artifacts, cross-references |
| **Background voices** (2 handles minimum) | Never OP — comments only | Curious (handle 1), argumentative (handle 2) | N/A (never surface as posts) |

**Adapt for your vault:** replace the default roster with handles that fit your body of work. For your vault, the roster is `u/[contact-handle]` ([a named contact]), `u/your-handle` (the user), `u/[bot-handle]` (AI), `u/[bg-1]` + `u/[bg-2]` (background).

**Adding more personas:** for posts that don't fit the core four, use thematic secondary handles named for the source's energy (`u/spine_keeper`, `u/substrate_nerd`). Use sparingly.

---

## Headline voice

Authentic Reddit titles have specific tics.

**Forms that work:**
- Flair prefixes: `[Field Report]` `[Showcase]` `[Discussion]` `[Rant]` `[Update]` `[PSA]` `[Meta]` `[Help]` `[Proposal]`
- Lowercase openings when natural
- Specific numbers: "10 min", "48GB VRAM", "n=1", "~80%"
- Quote-as-title in lowercase
- Self-deprecation: "anyone else...", "am i the only one...", "i have no idea what i'm doing but..."
- Over-honest framing: "making the case below. pretty sure it doesn't hold", "(hear me out, 90 seconds)"
- Occasional run-on sentences with commas and ellipses

**Forms that kill authenticity:**
- Essay voice. "Here is how I think about X."
- Title Case Beyond First Word.
- Corporate softening. "A Framework for..."
- Polished rhetorical questions ("Is X important?" ... yes, we know)
- **Em dashes of any kind.** Authentic Reddit does use them, but this vault does not. The vault rule overrides the platform tic. Use periods, commas, colons, or ellipses instead. See `CLAUDE.md` Writing Rules.

**Length range:** 40–180 characters. Short-punchy OR long-and-specific. Mid-length tidy reads like marketing copy.

---

## Comment banter guide (load-bearing)

The threads are not decoration. They are the reading experience. Get them wrong and the lens collapses into "Reddit-styled" rather than "Reddit." These rules are non-negotiable.

### Principles

1. **Poke holes, don't amplify.** Default comment posture is skeptical. If any persona says "yes great point" twice in a row, rewrite.
2. **Each persona has a stake.** Curious voice asks. Argumentative voice pushes back. Owner adds hardware/pragmatic framing. AI brings receipts. Operator defends or concedes. Never collective voice.
3. **Never fabricate collective voice.** No "we all think," "half of us," "the consensus." One person at a time.
4. **Specific beats general.** "80% reduction per event, sourced from Doodle usage studies" beats "significant time savings."
5. **Cite receipts in comments.** When a persona claims data, link it inline with `<a class="claim" data-file="..." data-section="...">snippet →</a>`.
6. **Dry humor, not jokes.** Reddit's funniest comments are usually deadpan observations, not setups-and-punchlines.
7. **Counter-arguments welcome.** A thread without at least one "counter:" feels staged.
8. **Let OP concede.** "Fair. tension i haven't resolved." Vulnerability reads as real.

### Tic patterns that work

- `"counter-argument: X"` — standard Reddit pushback opener
- `"fair but Y"` — partial concession
- `"put a number on it"` — demanding evidence
- `"<persona> is doing too much work in that title"` — critiquing framing
- `"pinning this. come back in 2 years."` — bookmark-as-respect
- `"taking this to my co-op. will report back."` — real-world adoption
- `"write that up."` — reader encouragement as minimal comment
- `"am i reading this right that X?"` — clarifying question
- `"is there a word for this?"` — naming-the-concept question
- `"honestly why not just [simpler thing]?"` — devil's-advocate alternative
- `"fwiw"` / `"imo"` / `"tbh"` — hedges that read as earnest

### Tic patterns to avoid

- "Great post!" alone — doesn't happen on real Reddit
- "Thanks for sharing" — LinkedIn tell
- "This is a must-read" — SEO tell
- Emoji strings — Reddit uses maybe one emoji per comment
- "Here's my take in three points:" — too structured
- Consensus-seeking closers unless OP

### Thread shape

Aim for 6–11 comments per post. More feels forced. Fewer feels empty.

**Typical arc:**
1. Curious background voice asks a clarifying or expanding question
2. OP responds with specifics (usually a linked claim)
3. Argumentative background voice pushes back or demands evidence
4. Owner adds hardware/pragmatic angle
5. AI persona drops a data point with receipt
6. OP concedes or sharpens
7. A background voice closes with real-world action or bookmark

Vary it. Single-persona threads fine when the topic is narrow. Not every thread needs all five.

### The AI bot flair

The AI persona's comments get a `[BOT]` pill. Voice stays in-persona (not fake-robotic). The flair signals provenance: AI-generated. Use it to cite receipts, surface data, cross-reference patterns. Never use it to take opinion positions — bot-flair plus opinion reads wrong.

---

## Config Schema

```yaml
---
type: cut
lens: reddit
date: YYYY-MM-DD
project: Project Name
audience: [Name of target reader]
content-tag: [tag selecting source files]
output: 03_cuts/frames/YYYYMMDD_slug.html
tags: [cut, reddit, project-tag]
visibility: local
last-updated: YYYY-MM-DD
---
```

**Required fields beyond standard cut config:**
- `audience:` — the specific reader this frame is optimized for. A Reddit frame without a named audience is a chrome exercise.

**Optional body sections (override lens defaults):**
- **## Subreddits used** — list of r/SubredditName values with color hints (c1–c7) and plausible member counts.
- **## Personas** — override the default roster. Specify handles, banner colors, and one-line descriptions.
- **## Posts** — one entry per post with title, author handle, body (with inline claim links), and thread of comments.
- **## Voice overrides** — if the content demands a different banter tone, specify here.

If any of these body sections are absent, the lens applies its defaults or pulls from the contact overlay (see below).

---

## Input contract

| Input | Where it comes from | Required? |
|---|---|---|
| Audience identity | Cut config `audience:` + contact profile if present | Yes |
| 5–10 vault files to turn into posts | `content-tag` scan + conversation | Yes |
| Persona roster | Default + vault-specific overrides | Yes |
| Post titles (Reddit-voice) | Operator authors by hand, following the headline voice guide above | Yes |
| Comment threads (6–11 per post) | Operator authors by hand, following the banter guide | Yes |
| Claim links inline | Every post body + comment that references a source file | Yes |
| Simulated vote counts | Plausible ranges (890–4200 for posts, 14–201 for comments) | Yes |
| Subreddit names | Real Reddit subs when plausible; fictional when a real one doesn't fit | Yes |

**Voice direction composes:** cut config body > contact overlay > lens defaults.

---

## Output contract

What the rendered frame guarantees:

- Self-contained HTML: no external fetches, no CDNs, no broken assets.
- Mobile-first: tested at 375px (iPhone SE). Cards scale, tabs scroll horizontally, modal goes full-screen.
- Safe-area-inset aware.
- Keyboard navigation: Escape closes modal. Browser back/forward works for post navigation.
- Inline markdown renderer (minimal: headings, lists, bold/italic, code, blockquotes, links, wikilinks, hr). Code fences and nested structures handled.
- Every `<a class="claim">` opens the modal with the correct source + section.
- File size envelope: ~170–300KB depending on source corpus size.
- Accessibility: semantic HTML, aria labels on interactive elements, focus-visible states, reduced-motion honored.

---

## Interaction model

**Home feed → Post view:** click anywhere in a post card.

**Post view → Home feed:** click "Back to Home" link or browser back.

**Any claim (butter-highlighted phrase) → Source modal:** click opens modal with iframe loaded via srcdoc, auto-scrolling to the section anchor.

**Close source modal:** click X, click outside the panel, press Escape, or browser back.

**Any username → Persona popup:** click opens small card with persona description. Click outside or the Close button dismisses.

**Tabs (Home / Popular / All / Latest):** decorative only in v1. Clicking does nothing. Can be wired up to filter posts in future iterations.

---

## Token consumption

This lens mostly bypasses the packet's design-system tokens and uses Reddit's native visual language inline. The exceptions:

- **Source modal** uses the packet's design system fully (Plus Jakarta Sans, lavender/sage/butter palette, Aldrich for monospace). Deliberate tonal shift.
- **Claim highlight color** (butter `#FFE577`) derives from the packet's `--butter` token. Swapping this breaks the highlight convention.

---

## Reference implementation

Sample render: [[_examples/example-reddit|example-reddit.html]]

> **Note:** the example HTML at `_examples/example-reddit.html` is a placeholder template, not a populated frame. Run the adapter prompt against your own content to generate a real Reddit-lens output with personas you choose.

---

## Notes on edge cases

- **Short corpus (fewer than 5 posts):** feels empty. Either consolidate into fewer, richer posts or pick a different lens.
- **Long post bodies:** the 4-line clamp on the home feed preview truncates. Place the most compelling sentence first in the body — that's what appears on the card.
- **Claim references that don't resolve:** modal shows "Source not found: <slug>". Always verify source slugs match the keys in the inlined `SOURCES` object. Build script (`build-v2.mjs` in the original build path) should fail loudly if a referenced source is missing.
- **Section slugs:** must match the renderer's slugify rule (`text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')`). `## 1. The Mission Is Private` becomes `1-the-mission-is-private`. Double-check when authoring.
- **Wikilinks in source modal:** render as styled pills but don't resolve (no vault context inside iframe). Fine for preview. If live resolution matters, use the Share lens instead.
- **Vote counts:** simulated. Plausible but fake. Add a `[simulated]` ribbon if transparency matters; otherwise leave alone.

---

## Anti-patterns

1. **Essay posts in Reddit chrome.** The card format demands Reddit title voice. Don't paste long-form prose into a body and call it a Reddit post. Rewrite the title first.
2. **Agreement threads.** If every comment nods, the lens has collapsed. Gardeners must push back. AI must cite receipts. OP must concede at least once.
3. **Fake consensus voice.** "Half of us think..." "The cohort believes..." — never. One person, one stake, one comment.
4. **Missing receipts.** An AI-persona comment with `[BOT]` flair that doesn't cite a source is broken. The flair means "I cite receipts." Cite one.
5. **Over-populated feed.** Fifteen posts is too many. The reader scrolls once and bounces. Keep to 5–10.
6. **Cute subreddit names.** `r/PostExtractiveInfrastructure` is tell-tale. Use real subs (r/LocalLLaMA, r/ObsidianMD, r/CivicTech) or plausible fictional ones (r/LocalFirstAI). The reader should not notice the sub name unless it lands.

---

## Version history

- **v0.1** (2026-04-21): Initial shipped spec. Reddit chrome, 4-persona default roster, banter guide formalized from field observation with [a named contact] as first external reader (field-report: he thought it was Reddit, read all titles, vote counts held). See vault-level experiment log at `03_cuts/_lenses/reddit-lens.md` for ongoing observations and return-engagement test results.

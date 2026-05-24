---
type: lens
name: pitch
for: [human, ai]
visibility: local
status: active
last-updated: 2026-05-04
---

# Lens: Pitch

A lens for making someone care, then act. Not explaining. Not documenting. Persuading. The audience is the hero. The content exists to change what they believe, want, or decide.

The Pitch lens produces a 10-12 slide HTML slideshow with presenter mode, designed for live narrated delivery (pitch competitions, investor meetings, partner conversations). It encodes a story-driven structure derived from the canonical literature on persuasion and pitching: Andy Raskin's strategic narrative, Nancy Duarte's sparkline, Donald Miller's StoryBrand, Stanford's NABC, Pixar's Story Spine, Kahneman's peak-end rule.

The same project gets pitched differently to different capital types. The lens ships five variants (VC/Angel, Impact, Grant/Foundation/PRI, Crowdfunding, Steward/Cooperative) that adjust emphasis, evidence selection, and ask shape without changing the underlying narrative spine.

---

## When to Use

When the goal is action, not understanding. When someone needs to believe something is worth their time, capital, or partnership. When the content has a specific audience and that audience has a specific decision to make.

Good for:
- Pitch competitions (Demo Day, accelerator showcases, university competitions)
- Investor meetings (VC, angel, impact, crowdfunding lead conversations)
- Foundation and grant pitches (program officer meetings, IRB reviews)
- Partner buy-in (channel partners, technical partners, distribution partners)
- Internal pitches (executive approval, cross-team adoption)

Not for:
- Documentation (use Overview)
- Explaining complex systems (use Explainer)
- Session records (use Debrief)
- Operations dashboards (use Observatory)
- Send-ahead investor pre-reads of 15+ slides (the Pitch lens is presentation-mode; a separate pre-read variant is on the v1.1 roadmap)

If the reader's response should be "I understand," use a different lens. If it should be "I'm in," use this one.

---

## The Question It Answers

"Why does this matter to me, and what changes if I act?"

Not "what is this." Not "what should I understand." Not "what happened." The Pitch lens answers a question about the audience's future, not about the content's present.

---

## Output Contract

A single self-contained HTML file rendered at `03_outbox/frames/YYYYMMDD_<slug>-pitch.html` (the lens slug `-pitch` is mandatory as the final segment of the filename per the vault's lens-in-filename rule).

The file:
- Contains 10-12 slides (default 11; configurable via `time-budget` field)
- Navigation: keyboard (← → Space, Home/End), click-anywhere-advances, mobile swipe
- Slide counter and thin top progress bar always visible
- Presenter mode: `P` toggles speaker notes, `T` toggles count-up timer, `F` enters fullscreen, `Esc` exits
- Mobile-first responsive: works at 375px viewport, swipe to advance, no horizontal scroll, all text readable without zoom
- All styles inline. Google Fonts as the only external dependency. No build step.
- Token palette and typography match the design system (`--ink`, `--paper`, `--sage`, `--butter`, `--blush`, Plus Jakarta Sans display, Space Grotesk body, Aldrich kicker, JetBrains Mono mono)
- Zero em dashes anywhere in slide content, speaker notes, or markup. Use periods, colons, commas, or ` · ` separators.
- Every number traces to source material or is marked "not yet measured" with the instrument that would produce it (per the no-fabricated-data hard rule).
- **Centering pattern (mandatory):** the outer `.slide` element is a scroll container (`overflow-y: auto`). Vertical centering lives on the `.slide-inner` element via `min-height: 100%` + `display: flex; flex-direction: column; justify-content: center`. Do NOT put `align-items: center` on `.slide` directly. Flex centering on a scroll container pushes overflowing content above the scrollable area, cutting off the top of the slide. The `_examples/example-pitch.html` reference includes a CSS comment naming this constraint.
- **Scroll reset on slide change (mandatory):** the `show()` function in the slide-nav script must set `slides[current].scrollTop = 0` after activating a new slide, so the audience never returns to a slide mid-scroll.

---

## Structure: Five Movements, Eleven Slides

The narrative spine is five movements (Shift / Gap / Experience / Peak / Close) sequenced into eleven slides. The order is not flexible. Persuasion has a sequence: you cannot close before you open the gap, and you cannot open the gap before the audience feels the shift.

| # | Slide | Movement | Time |
|---|---|---|---|
| 1 | Title | (Frame) | 5s |
| 2 | The Shift | M1: Shift | 30s |
| 3 | The Stakes | M2a: Gap, what is | 30s |
| 4 | The Promised Land | M2b: Gap, what could be | 30s |
| 5 | Why Now | M2c: timing | 30s |
| 6 | The Experience | M3a: demo or visceral artifact | 60s |
| 7 | Magic Gifts | M3b: what equips the audience | 45s |
| 8 | Evidence | M4a: proof stack | 45s |
| 9 | The Peak | M4b: designed climax | 30s |
| 10 | The Ask | M5a: specific, milestone-linked | 30s |
| 11 | The Close | M5b: repeatable sentence + next step | 15s |

Total: ~5 minutes for live delivery. Compress to 5-7 slides for Demo Day format (combine 3+4, 6+7, 8+9, 10+11) by setting `time-budget: 3min` in the cut config.

### Movement 1: The Shift (Slide 2)

Names a change in the world the audience already senses but has not articulated. Not the product. Not the company. A structural shift that creates new stakes.

The audience nods. They recognize the shift from their own experience. The shift is undeniable: not "we believe X is changing" but "X has changed. Here is the evidence." The shift creates urgency without the presenter claiming urgency.

Required:
- One clear statement of the shift (1-2 sentences max)
- Evidence the audience can verify from their own experience
- No mention of the product, solution, or proposal yet

Fails when: starting with the product, starting with "we," making a claim the audience does not already feel, hedging.

### Movement 2: The Gap (Slides 3, 4, 5)

Opens the distance between where the audience is and where they could be. Three slides:
- **Stakes (3):** what is. The current painful state, specific and felt. Not abstract.
- **Promised Land (4):** what could be. Concrete and desirable. Named in 5-10 words per Raskin.
- **Why Now (5):** the timing-bounded shift that makes this the moment. Per Sequoia and DocSend research, "Why Now" is among the slides investors spend the most time on. Vague timing arguments fail. Specific recent shifts succeed.

The audience feels the pull between comfort (known) and possibility (unknown). The gap must be about the audience's world, not the presenter's.

Fails when: only one oscillation (feels flat), abstract language, gap about the solution rather than the audience's tension, revealing the solution too early.

### Movement 3: The Experience (Slides 6, 7)

The audience discovers the solution. Two slides:
- **The Experience (6):** the demo, the explorable, the visceral artifact. A working prototype, a live demo, a single image that anchors a 30-second show-don't-tell moment. The interaction (or visual) IS the argument, not a feature tour.
- **Magic Gifts (7):** what specifically equips the audience to reach the Promised Land. The product, the curriculum, the service, the platform. Per Raskin, these are "magic gifts" in Joseph Campbell's Hero's Journey sense: the audience is Luke, the operator is Yoda, the gifts are the lightsaber.

Active engagement creates 75% retention vs. 5% for passive reception. When someone discovers an insight through interaction, they believe it more strongly than when told the same insight.

Fails when: feature walkthrough, instructions longer than one sentence, showing everything at once (working memory holds 4-9 items), making the demo about capabilities rather than the audience's possibilities.

### Movement 4: The Peak (Slides 8, 9)

The proof and the climax. Two slides:
- **Evidence (8):** the proof stack. Traction, propagation events, named partners, founder-market fit, customer quotes. Per DocSend data, investors spend the most time on financials, team, competition, why-now, business model, and traction (in that order). Show real evidence, not generic claims.
- **The Peak (9):** the single most emotionally resonant moment. Per Kahneman's peak-end rule, the audience will judge the entire experience by this moment and the close. A pull-quote, a single visualization that makes scale undeniable, a connection between their work and someone else's they had not seen.

The peak is not the biggest feature or the most impressive stat. It is the moment of highest emotional charge: the insight that reframes everything.

Fails when: no designed peak (remembered as flat), multiple competing peaks (diffuses impact), peak about the presenter rather than the audience, data without emotional framing.

### Movement 5: The Close (Slides 10, 11)

The next step feels inevitable. Two slides:
- **The Ask (10):** specific, milestone-linked, capital-type-shaped. PitchBob.AI's analysis found "use of funds" was the worst-performing slide in over half of decks reviewed. Fix: tie use of funds to the next milestone and next funding round. Bad: "$500K for marketing." Good: "$200K to hire a head of sales and two AEs by Q2 2026 to win our five named target customers and reach $1.5M ARR for Series A readiness."
- **The Close (11):** the repeatable sentence and the one next step. Per the recency effect, the close is the second-most-remembered part of the pitch (after the opening). The audience must leave with a clear answer to "What do I do now?" and "What do I tell my colleagues this was about?"

Fails when: trailing off, summarizing (the audience already experienced it), multiple calls to action (creates decision paralysis), ending on logistics rather than vision, close about the presenter's needs rather than the audience's future.

---

## Capital-Type Variants

Per research §4 and §10D, the same project pitched to different capital types is functionally five different pitches. The narrative spine and slide structure stay constant; the emphasis, evidence type, and ask shape change. Set `audience-type:` in the cut config to one of the following.

### vc (Venture Capital / Angel)

- **Shift framing:** market transformation, technology inflection, behavior shift at scale
- **Stakes/Promised Land:** unmet need at scale, large defensible market
- **Evidence emphasis:** traction (revenue, growth rate, retention, CAC/LTV), founder-market fit, capital efficiency (burn multiple, gross margin, NRR), insight about market shift
- **Ask shape:** specific raise amount, valuation range or convertible note terms, milestone-linked use of funds, named lead vs. follow check sizes, target Series A readiness
- **Anti-patterns:** non-VC-shaped unit economics (don't pitch local-only to scaling VCs), AI mentioned more than three times (counter-signal in 2026), hockey-stick projections without bottom-up logic
- **Cite when relevant:** Sequoia's "Why Now" template, Kawasaki 10/20/30, YC Demo Day clarity-excitement-momentum-credibility

### impact (Impact / Mission-Aligned)

- **Targets:** RSF Social Finance, Toniic, ImpactAssets, Calvert Impact, Better Ventures, New Media Ventures (civic tech), Spring Lane, Vital Capital
- **Shift framing:** civilizational shift the audience already cares about (extraction, inequity, climate, infrastructure rot)
- **Stakes/Promised Land:** theory of change made concrete; the world that exists if this works
- **Evidence emphasis:** outcome metrics (not just outputs), beneficiary stories, integrity of governance, alignment of incentives, capacity to measure and report
- **Ask shape:** mission lock as moat (legally enshrined values reduce mission-drift risk), capped returns or recoverable structures, blended capital stack
- **Cite when relevant:** RSF's borrower criteria (social/ecological impact, advocacy for change, capacity to accomplish, financial sustainability)

### grant (Grant / Foundation / PRI)

- **Targets:** Knight Foundation, Kresge, Ford, MacArthur, Gates, Mozilla, civic-tech funders
- **Shift framing:** public benefit at stake, alignment with funder's portfolio thesis
- **Structure:** logic model is mandatory · inputs → activities → outputs → outcomes → impact (per W.K. Kellogg Foundation canonical guide)
- **Evidence emphasis:** needs assessment, prior pilot data, partner letters of support, organizational capacity, sustainability plan, theory of change explaining the causal mechanism
- **Ask shape:** recoverable grant structure, PRI (program-related investment) tied to charitable purpose, milestone-linked tranches, repayment conditional on milestones
- **Note:** pre-LOI conversations matter more than a polished proposal · the pitch is often a relationship-builder for follow-on diligence

### crowdfund (Crowdfunding / Community Equity)

- **Platforms:** Wefunder (dominant Reg CF, ~$700M-1B+ historical raises), Republic (selective, ~5% application acceptance), StartEngine, Kickstarter, Indiegogo
- **Shift framing:** "the people who use this should own it"
- **Evidence emphasis:** pre-launched community, community-investor alignment, perks tier strategy, viral hook, founder origin story tied to community
- **Ask shape:** Reg CF-compliant raise (Form C, audited financials at scale), perks tiers, community round alongside institutional capital (precedents: Substack, Mercury, Replit)
- **Cite when relevant:** Pebble Watch, Exploding Kittens, Oculus Rift (viral product + pre-built audience + visceral video)

### steward (Steward-Ownership / Cooperative)

- **Targets:** Purpose Foundation, Purpose US, Common Trust, Armillaria, Organizational Maturity Working Group, RSF, 2050 Venture Fund, Natural Investments
- **Shift framing:** mission lock as a moat and trust asset; "100-year company" as competitive advantage
- **Structural emphasis:** decoupled voting and economic rights, perpetual purpose trust, exit-to-community pathway
- **Evidence emphasis:** long-term resilience, stakeholder alignment, durable but capped returns, precedents (Patagonia, Bosch, Mozilla, Novo Nordisk, Organically Grown Company, Sharetribe)
- **Ask shape:** capped-returns vehicle, perpetual purpose trust structure, single-digit IRR in exchange for permanence
- **Cite when relevant:** Delaware/New Hampshire/Wyoming/Maine/Oregon stewardship trust statutes, Indie.vc cautionary tale (strong returns, failed to raise from LPs because asset class lacked shared narrative)

---

## Invariant Principles

These hold across all capital types and all variants. Per research §10A.

1. **The audience is the hero.** Per StoryBrand and Raskin. The presenter is the mentor (Yoda, not Luke). If a slide starts with "we built," rewrite it.
2. **Lead with a shift in the world, not your product.** Per Raskin's strategic narrative, Sequoia's "Why Now," Duarte's sparkline.
3. **Name the Promised Land in 5-10 words.** Per Raskin. A phrase the audience can repeat.
4. **Use contrast.** Sparkline structure: alternate "what is" and "what could be" until the gap is felt.
5. **One idea per slide.** Per YC Hale (legible, simple, obvious), Duarte, Kawasaki. Working memory holds 4-9 items.
6. **Show founder-market fit.** Per DocSend research (experience 37% of mentions, industry-specific skills 23%). "Why this team for this problem" beats "Stanford + Google."
7. **Specific evidence beats general claims.** Bottom-up market sizing, named customers with specifics, quantified achievements.
8. **Match capital type to model.** A wrong-shape pitch burns trust on both sides. Don't pitch traditional VC for non-VC-shaped work.
9. **Make the deck legible without you.** ~30% of decks resulting in a meeting are shared internally first. Self-contained slide headlines.
10. **Have a specific, milestone-linked ask.** PitchBob.AI: most-failed slide in over half of decks reviewed.

---

## Anti-Patterns

Named failure modes. If the agent catches itself doing any of these while rendering, stop and restructure. Per research §7.

1. **Buzzword bingo.** "AI-powered platform" is a near-instant disqualifier in 2026. Show, don't claim.
2. **Hockey-stick projections** with no bottom-up logic. Three-scenario modeling (conservative/realistic/optimistic) is table stakes.
3. **Over-explaining the technology, under-explaining the wedge.** Lead with a specific paying customer with a specific problem.
4. **Failing to articulate "why now."** ~92% of successful decks have this. Vague timing arguments are worse than no argument.
5. **Burying the lede.** If you have $5M in revenue, don't put it on slide 12.
6. **Weak openings.** First 30 seconds determine whether the deck gets read further.
7. **Weak closes.** No specific ask, no clear next steps, no urgency.
8. **Wall-of-text slides.** More than 40-60 words per slide triggers cognitive fatigue. Investors scan, not read.
9. **No competition slide / "we have no competition."** Universally read as inexperience or dishonesty. Inertia is always competition.
10. **Generic team slides.** Resume bullets without role clarity or founder-market fit. Use logos, not paragraphs.
11. **Cap table mess.** A friend or family member with 15% from a $10K loan signals an uninvestable structure.
12. **Mismatched deck format.** Sending a presentation deck for asynchronous review (or 30 slides for a 5-minute slot).
13. **Q&A failures.** Defensive, evasive, or rambling. The fix: practice the Top 20 Hard Questions; respond with structure ("Three things: first... second... third...").
14. **Claiming no risk.** "VCs are paid to underwrite risk. Tell them what the risk is and let them decide if they're willing to underwrite it."

The lens-specific anti-patterns from prior versions also still apply:

- **The Feature Tour.** Walking through capabilities instead of guiding the audience to discover value.
- **The Academic Paper.** Comprehensive, precise, unpersuasive. Find the sparkline.
- **The We Show.** "We built. We designed. We believe." The company is the hero. Find-and-replace "we" with the audience's name.
- **The Data Dump.** Charts and numbers without emotional framing. Frame every data point in terms of felt consequence.
- **The Soft Close.** Trailing off, summarizing, multiple options. One sentence, one action, one future.
- **The Missing Peak.** Everything at the same emotional intensity. Design the moment the audience must remember a week later.

---

## Generation Protocol

Six steps the cut-packet skill runs when producing a pitch frame. Per research §10C.

### Step 1: Strategic Narrative Foundation (Raskin Method)

Before opening any slide tool, articulate (in the cut config or working notes):
- **The Old Game:** how the world worked. Why it broke.
- **The Stakes:** what is lost if we don't fix it.
- **The New Game / Promised Land:** future state, named in 5-10 words.
- **The Magic Gifts:** how we equip the hero (the audience) to reach the Promised Land.
- **The Evidence:** proof we can deliver.

### Step 2: Capital Match

Ask the user (or confirm from cut config): which of the five capital types best fits this project's economic shape? Be honest. Many place-based or mission-aligned projects are best matched by some combination of foundation grants, PRIs, RBF, community equity, and cooperative capital, not VC. If pitching multiple capital types, write multiple pitches.

### Step 3: Format Choice

Confirm `time-budget` from cut config (3min / 5min / 10min). Default 5min = 11 slides. Compress to 5-7 slides for Demo Day (combine 3+4, 6+7, 8+9, 10+11). Expand to 15+ slides only if user explicitly requests pre-read variant (not in 1.0.0 scope).

### Step 4: Storyboard with the Sparkline

Sequence the 11 slides as a sparkline: Slides 3 and 4 oscillate "what is" / "what could be." Slide 5 names the timing. Slides 6-9 build the resolution: experience, gifts, evidence, peak. Slide 10 makes the ask inevitable. Slide 11 leaves the audience with the repeatable sentence.

### Step 5: Audience-Specific Adjustments

Apply the variant from Step 2:
- **vc:** maximize defensibility, market size, founder-market fit, traction, capital efficiency
- **impact:** maximize theory of change, outcome measurement, alignment with funder priorities, governance integrity
- **grant:** maximize logic model clarity, evidence base, partnership endorsements, charitable purpose
- **crowdfund:** maximize community resonance, perks design, pre-launch audience
- **steward:** maximize mission lock as moat, long-term resilience, stakeholder alignment

### Step 6: Stress-Test Against the Hard Questions

Before rendering, run the deck against this fixed list:
- "How do you scale?" Answer with scale-up vs. scale-out distinction.
- "What's the exit?" Conventional exit, exit-to-community, perpetual ownership, or no exit by design.
- "What's the moat?" Trust, mission lock, community embeddedness, network effects across instances, IP, regulatory.
- "Why now?" Specific, time-bounded shift.
- "Why you?" Founder-market fit, lived experience, network access.
- "What if we don't fund this?" The cost of inaction. The villain wins.

If any answer is weak, fix it before rendering.

---

## Config Schema

```yaml
---
type: cut
lens: pitch
date: YYYY-MM-DD
project: Project Name
audience: [Name or role of the specific decision-maker]
audience-type: vc | impact | grant | crowdfund | steward
time-budget: 3min | 5min | 10min   # default 5min
capital-stage: pre-seed | seed | series-a | grant | community
status: active
visibility: [audience-tag]
output: 03_outbox/frames/YYYYMMDD_<slug>-pitch.html
tags: [cut, project-tag, pitch]
last-updated: YYYY-MM-DD
---
```

**Required fields beyond standard cut config:**
- `audience:` · the specific person or role this pitch targets. A pitch without a named audience is a brochure.
- `audience-type:` · which of the five variants to apply.

**Optional body sections (override lens defaults):**
- **The Shift:** what world-change does this audience already sense?
- **The Gap:** stakes (what is) and Promised Land (what could be)
- **Why Now:** the specific timing-bounded shift
- **The Experience:** the demo, the visceral artifact
- **Magic Gifts:** what equips the audience
- **Evidence:** the proof stack for this audience-type
- **The Peak:** the single moment they remember
- **The Ask:** specific, milestone-linked
- **The Close:** repeatable sentence + next step

---

## Input Contract

| Input | Source | Required? |
|---|---|---|
| Audience identity and context | Cut config `audience:` field + conversation | Yes |
| Audience-type variant | Cut config `audience-type:` (or asked at generation) | Yes |
| Time budget | Cut config `time-budget:` (default 5min) | No |
| The world-shift | Agent synthesis from project docs + conversation | Yes |
| Stakes and Promised Land | Project vision and operational docs | Yes |
| Why-now shift (timing-bounded) | Conversation + research | Yes |
| Experience artifact (demo, image, prototype link) | Built for this pitch or linked from existing frames | Yes |
| Magic Gifts (specific offerings) | Product/service/curriculum docs | Yes |
| Evidence (audience-type-shaped) | Traction docs, partner letters, customer quotes, financial models | Yes |
| Peak moment | Agent designs from content | Yes |
| Ask (specific, milestone-linked) | Conversation with project owner | Yes |
| Repeatable sentence | Agent proposes, owner approves | Yes |

---

## Elevator Pitch Formats

For the title slide and the close, the agent should generate two compact framings the user can refine. Per research §8.

**Mad Libs (Adeo Ressi, Founder Institute):**
> My company [name] is developing [a defined offering] to help [a defined audience] [solve a problem] with [secret sauce].

**Outcome-focused (Upflowy variant):**
> Because we believe [ambitious vision], [my company] is [building/launching] [offering] to enable [persona] to [achieve outcome] by leveraging [unique asset].

**Logline (screenwriting borrow):**
> For [audience] who struggles with [problem], we [solution] so they can [outcome] · unlike [alternative].

The repeatable sentence on Slide 11 should be derivable from one of these formats and under 15 words.

---

## Visual Direction

Reuse the existing token palette:

- `--ink: #1f1d1a` (primary text, dark slide backgrounds)
- `--paper: #faf6ee` (default slide background)
- `--paper-warm: #f5eede` (alt background)
- `--paper-deep: #ece1c7` (alt background)
- `--sage: #6fa67f` (Shift slide accent)
- `--sage-deep: #1f5028` (sage emphasis)
- `--sage-soft: #dcebd7` (sage backgrounds)
- `--butter: #f5d88e` (highlight, evidence accents)
- `--butter-soft: #fbefc8` (warm backgrounds)
- `--blush: #f9a8b8` (Stakes slide accent)
- `--blush-soft: #fcdee4` (blush backgrounds)
- `--blush-text: #7a2c3c` (blush text emphasis)
- `--rule: #e7dec9` (dividers)

Typography:
- Display headers: Plus Jakarta Sans 800 weight
- Body: Space Grotesk
- Kicker labels: Aldrich (uppercase, letter-spaced)
- Mono (data, code, timer): JetBrains Mono

Slide background mapping (default):
- Slide 1 (Title): paper with sage accent
- Slide 2 (Shift): sage-soft
- Slide 3 (Stakes): blush-soft
- Slide 4 (Promised Land): sage-soft
- Slide 5 (Why Now): paper-warm
- Slide 6 (Experience): paper-deep (or full-bleed visual)
- Slide 7 (Magic Gifts): paper
- Slide 8 (Evidence): butter-soft
- Slide 9 (Peak): ink (dark, full-bleed pull-quote)
- Slide 10 (Ask): ink (dark with butter CTA)
- Slide 11 (Close): paper

The dark Peak and Ask slides create a cinematic crescendo into the Close. The Close returns to paper for clarity.

---

## Rendering Protocol

Before rendering a new Pitch frame:

1. **Confirm audience-type.** If not in cut config, ask the user before any slide generation. The deck shape depends on it.
2. **Read the source content.** Project hub, vision docs, operational specs, traction data. Synthesize into the strategic narrative components (Step 1 of the Generation Protocol).
3. **Run the six-step generation protocol.** Strategic narrative foundation → capital match → format choice → sparkline storyboard → audience-specific adjustments → stress-test.
4. **Design the peak before anything else.** Identify the single most resonant moment. Build the rest of the pitch to set it up. If you cannot name the peak, you do not yet understand what the pitch is about.
5. **Write the repeatable sentence before rendering.** Under 15 words. The one phrase the audience uses when someone asks "what was that about?"
6. **Stress-test against the hard questions.** Step 6 of the Generation Protocol. Fix weak answers before rendering.
7. **Render to HTML.** Use the example at `_examples/example-pitch.html` as the structural reference. Replace content; keep mechanics (nav, presenter mode, mobile, tokens) intact.
8. **Read-through pass.** Top to bottom, every slide, every speaker note. Every header should be a self-contained claim. Zero em dashes. Zero fabricated data.

**Rendered frames:**
(none yet · v0.2 release)

---

## Lens vs. Style

### Lens decisions (permanent, travel with the lens)
- Five movements in fixed order, eleven slides default
- Audience named in config, treated as hero throughout
- Audience-type required (one of five variants)
- Designed peak required (Slide 9)
- Specific milestone-linked ask required (Slide 10)
- Repeatable sentence required (Slide 11)
- Presenter mode required in output (P, T, F keys)
- Mobile-first responsive (works at 375px)

### Style decisions (defined by design system, swappable)
- Color palette and visual treatment per token file
- Typography for display vs. body vs. data
- Transition behavior between slides (fade default, configurable)
- Slide background mapping (per-movement defaults, override per slide)
- Animation and motion vocabulary

---

## Open Questions

- **Pre-read variant.** When a pitch needs to be sent ahead in 15-20 slide format with full body copy (the asynchronous-review use case from the research), should that be a `mode: pre-read` field on this lens, or a sibling lens? Deferred to v1.1.
- **Two-document strategy.** Per research §9 (2024-2026 shift), modern fundraising often requires both a narrative deck and a memo. Should the Pitch lens have a paired Memo lens? Possibly future work.
- **Send-ahead vs. live.** Same content, different pacing. The current lens optimizes live; the example demonstrates the live form.
- **Measurement.** Activity data from the slideshow (which slides got revisited, how long the audience spent) could feed back into the next iteration. Not in 1.0.0 scope.

---

## Version History

**v0.2.1** (2026-05-04, hotfix): Centering bug discovered during real-world use. Slide content taller than the viewport was getting cut off at the top because flex centering on the outer `.slide` element pushed overflow above the scrollable area. Fix: moved centering to `.slide-inner` via `min-height: 100%` + flex column. Added scroll-reset on slide change. Output Contract section updated to mandate the pattern. Reference implementation comment added in `_examples/example-pitch.html`. All extant pitch frames patched.

**v0.2** (2026-05-04, first release prep): Major rewrite for v1.0. Output contract changed from single-page scroll to 10-12 slide HTML slideshow with presenter mode (P toggles speaker notes, T toggles timer, F goes fullscreen, mobile swipe nav). Five-movement narrative spine preserved. Slide map formalized to 11 slides. Five capital-type variants documented (vc, impact, grant, crowdfund, steward). Invariant principles, anti-pattern catalog, and six-step generation protocol synthesized from canonical sources (Raskin, Duarte, Sequoia, Kawasaki, DocSend, Heath, Kahneman). Mad Libs and logline elevator-pitch formats added. Spec written for the pitch competition target persona (someone prepping for a live narrated pitch from their project content).

**v0.1** (2026-04-02, Session 5): Lens defined. Five-movement persuasion structure formalized from pitch research synthesis. Informed by Andy Raskin (strategic narrative), Nancy Duarte (sparkline), Kahneman (peak-end rule, System 1/2), Bret Victor (explorable explanations), DocSend data (2:24 average review time), and cognitive science on active vs. passive engagement. Distinguished from Explainer (information-structured, comprehensive) and Overview (state-structured, dashboard). The audience is the hero, not the content.

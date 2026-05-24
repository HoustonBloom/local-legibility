---
type: lens
name: product-website
for: [human, ai]
visibility: local
status: active
---
# Lens: Product Website

A single-page marketing website for a product or company. Optimized for conversion: the reader is a specific buyer persona who should finish the page understanding what it is, why it matters to them specifically, and what the next step is.

## When to Use

- Launching a new product, service, or company
- Generating a tailored pitch for a specific buyer segment (same product, different audience)
- Producing a standalone HTML artifact you can share directly (email, DM, print to PDF)

## Audience Contract

The lens assumes:

- One buyer persona per frame (if there are two audiences, make two frames)
- The reader is skeptical, time-poor, and has seen every "AI for your business" pitch already
- Specificity beats scope. Real numbers, real process, real people beat generic value props.

## Structure (9 sections)

Each section answers one question. If a section doesn't answer its question concretely, cut it.

1. **Hero** : What is this and why am I here?
   - Headline (one line, bold claim or reframe)
   - Subhead (one sentence, who it's for and what it does)
   - Primary CTA button
2. **The trap** : Why should I care right now?
   - Pain stated in the buyer's own language
   - Concrete enough that the buyer nods
3. **What we install** : What's the actual thing?
   - Diagram or photo of the deliverable
   - 3-4 capability points, each one sentence
4. **What members get** : How does this become a member benefit?
   - Named offerings (workshops, sessions, resources)
   - Each with a one-line description of the outcome
5. **What your space becomes** : What's the differentiation?
   - Reframe from "feature list" to "new category"
   - One declarative sentence that sticks
6. **How it works** : What does buying look like?
   - 3-5 numbered steps
   - Each step names the output, not the activity
7. **What's included** : What does it cost?
   - Ranges OK. Placeholders like "TBD" are honest when true.
   - Three lines max. Bundle, don't itemize.
8. **Who you're working with** : Who am I trusting?
   - Real person, real credentials, real lineage
   - Skip generic "about us" corporate voice
9. **Closing CTA** : What's the next step?
   - One specific action. "Book a 30-minute walkthrough" beats "Get in touch."
   - Single button. No form unless you'll actually read the submissions.

## Voice

- Plainspoken. No SaaS-speak ("democratize," "empower," "transform," "revolutionize"). No "in today's world."
- Specific over sweeping. "Three workshops, each 90 minutes" beats "comprehensive training."
- No em dashes. Colons and periods.
- Active voice. Short sentences. One idea per paragraph.
- The reader is smart. Treat them like it.

## Visual Direction

- **Palette:** warm cream paper, sage + butter + blush accents. Not SaaS-corporate (no cyan/purple gradient hero). Not zine (too casual for a B2B buyer).
- **Type:** bold display for headlines (Plus Jakarta Sans 700+), clean sans for body (Space Grotesk), retro/mono for small caps labels (Aldrich).
- **Layout:** generous vertical rhythm, mobile-first. Each section has room to breathe. Viewport-per-section feel without actually being slide-locked.
- **Diagrams over stock imagery.** A labeled SVG of the actual deliverable (the rig, the process) is always stronger than a photo or illustration.
- **Process diagrams** are horizontal on desktop, vertical on mobile, with numbered nodes.
- **Pricing** lives in a simple 3-column card layout with clear ranges or TBD.
- **CTAs** are filled buttons with strong contrast and pressed states. Primary color, not gradient.

## De-emphasis

- Long about-us histories. The buyer wants to know who's responsible, not your founding story.
- Generic social proof ("Trusted by hundreds of businesses"). Use specific logos/names or skip.
- Feature lists without outcomes. "50GB storage" is not a feature; "hold every document you've ever written" is.
- Testimonial walls before you have real testimonials.
- Nested navigation. This is a single-page site. One scroll.

## Length

Keep the finished frame scannable in 2 minutes, readable in 5. If it takes longer, the reader is already gone.

## Output Contract

Self-contained HTML file. All CSS inline. Google Fonts via `<link>`. No JS required (smooth scroll and one intersection-observer for section reveals is the ceiling). Prints cleanly to PDF for offline sharing.

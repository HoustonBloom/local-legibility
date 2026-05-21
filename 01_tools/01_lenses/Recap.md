---
type: source-doc
category: lens
version: v1.0.0
for: [human, ai]
visibility: local
---
# Recap

A day-summary or short update you hand to someone. Casual register. The shape of "here's what I've been figuring out, here's what's working, here's what's still open." Not a status report for a stakeholder; a conversation-shaped update for a collaborator, peer, or community.

**Use when:** you want to share what you've been learning with someone who'll engage with the *thinking*, not just the outcomes. The recap's job is to surface **insights**, show the **connections** between them, and get the reader there in a way they can follow.

## Distinction from Status Report

| | Status Report | Recap |
|---|---|---|
| Register | Formal, numbers-first | Casual, insight-first |
| Reader | Stakeholder keeping tabs | Peer who'll engage |
| Shape | Roadmap + proof points + cost | Here's what I figured out, connected |
| Format default | Dashboard render | Post or thread render |
| What matters most | State, status, progress | Insights, connections, reasoning path |

A Recap can render as a Reddit post, a long-form tweet thread, a group-chat recap, an email, a dev journal entry. The format follows the place you'd share it.

## Core rules (inherited from Status Report + sharpened)

### 1. Never fabricate data

Same rule. If a metric isn't tracked, say so. No `[est]` without method.

### 2. Every artifact includes provenance

Lightweight for a Recap: a footer that names the sources the recap drew from. If the format itself is a mockup (like Reddit chrome around real content), the footer declares that clearly. The content inside can be real and cited; the Reddit thread around it is a rendering experiment.

### 3. Titles carry information · read-through mandatory

Same rule. Title must tell you what the recap is about. After authoring, read every title and heading in sequence.

### 4. Insights, connections, followable

**The load-bearing rule specific to Recap.**

- **Insights** — pull out the non-obvious takeaway. Not "X happened," but "what I noticed from X that wasn't obvious going in." If the recap just lists events, rewrite it.
- **Connections** — name how one thing relates to another. "This is interesting because of that" is the form. Connections are the spine of a recap; without them it's a log.
- **Followable** — show the reasoning path. The reader should trace how you got from observation to insight without a decoder ring. If you jump from data to conclusion without the middle step, someone out of context is lost.

Mechanics that help:
- Lead with the punchiest insight. Hook first.
- Present evidence close to the claim it supports, not in a separate section.
- Use comparison when it clarifies ("X got us 74%, Y got 68.5% — the simpler approach won").
- Where you know there's a genuine question still open, name it. Don't round off uncertainty to false confidence.

### 5. The closing invites response

A Recap ends with something the reader can engage with: a question, a request for counter-evidence, an open thread. "Have you hit this?" reads better than "Let me know what you think." Give them something specific to react to.

## Formats (renderings)

A Recap is format-agnostic. The lens defines the shape; the render adapts to the channel.

### Reddit post render

- Subreddit header (plausible subreddit for the content)
- OP metadata row (username, avatar, timestamp, post flair)
- Title (punchy, scannable)
- Body (lead → sections → closing invitation)
- Vote column + action row (upvote/downvote/comments/share/save)
- Comments thread with plausible personas

The Reddit render is a mockup. Comments are fabricated personas. The **content of the OP post** is real and cited; the community around it is the rendering experiment. Footer declares this clearly.

**Link-preview modal:** Comments can contain links. Clicking a link opens a modal with an iframe previewing the linked artifact. Useful when a claim in a comment benefits from seeing the actual document rather than reading a paraphrase in the thread. Hooks into the "getting people there in a way they can follow" rule.

### Home-feed render (stretch)

A Reddit-style home feed with multiple generated post cards. Clicking one opens it. Surfaces posts the reader hasn't seen. **Not implemented in v1.0.** Placeholder for when there are 3+ Recap renders to choose from.

### Other formats (not yet specified)

- Tweet-thread render
- Email recap render
- Group-chat recap render
- Dev journal render

Each needs its own spec section when built. All inherit the four core rules above.

## Required fields in the cut config

```yaml
type: cut
slug: YYYYMMDD_concept-descriptor
audience: [Name or Role]
content-tag: [tag selecting source files]
lens: recap
format: reddit-post        # or: tweet-thread, email, chat-recap, journal
subreddit: [e.g. LocalLLaMA]   # format-specific
op-persona: [username or "self"]   # format-specific
style-source: default-tokens
output: 03_cuts/frames/YYYYMMDD_concept-descriptor.html
date: YYYY-MM-DD
title: "Recap · [Topic] · YYYY-MM-DD"
```

## Voice (defaults)

Conversational but dense. The way you'd write if you were actually posting to the subreddit you named — not the user-at-her-most-formal, not the user-at-her-most-marketing, but the user-as-technical-peer. Direct claims. Numbers when you have them. Questions when you don't.

No em dashes. Colons and periods.

## Composition stack note

Standard: cut body > contact overlay > lens defaults > style-source tokens.

Contact overlay matters more in Recap than Status Report because the recap targets a specific reader. When `audience: [a named contact]`, the rendering absorbs his preferences (BLUF-first, density, file paths as first-class). The Reddit-post chrome stays; the voice inside the post and the nature of the comments shift to match who [a named contact] would engage with in that community.

## Measure of success

Recap succeeds when the intended reader actually reads it and engages. For a Reddit-post render to [a named contact]: he scans it, he clicks in, he reads. If he asks a question or pushes back, the recap did its job.

This is harder to measure than "a metric hit" but easier to check: did they reply? Did they forward it? Did they quote back something specific? Those are the signals.

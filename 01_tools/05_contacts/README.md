---
type: instructions
subject: contacts
for: [human, ai]
visibility: local
---
# Contacts

**Keep a profile per contact so the packet can render content that actually sounds right to each one of them.** When a cut is aimed at a specific person, the cut-packet skill reads their profile and applies their communication preferences on top of the lens defaults. Same content, tuned delivery.

Each profile carries:

- **Relationship context.** Who they are, how you know them, what's shared.
- **Shared work.** Projects they contribute to, overlaps in your body of work.
- **Communication preferences.** How they like to receive information. Typography and layout preferences (the "rendering profile").
- **Exchange log.** Running record of what's been shared, discussed, decided.
- **Open threads.** What's next between you.

## How to add a person

1. **Copy `_template.md` to `<Full Name>.md`.** Example: `Jane Smith.md`.
2. **Fill the frontmatter.** Role, org, location, met-through, first-contact.
3. **Write the basics.** `Who They Are`, `Shared Work` (or `Opportunity`), and initial notes on `How to Talk to Them`.
4. **Leave `Rendering Preferences` blank at first.** Fill it in only once you've worked together enough to know what actually fits them. When you do, set `rendering-profile: true` in the frontmatter so the cut-packet skill knows the section is load-bearing.

Do not invent a person's communication preferences from a single interaction. Wait until the pattern is clear. Guessing wrong costs trust.

## File conventions

- **Filename.** `<Full Name>.md` using their preferred display name.
- **Assets.** `_assets/` for headshots, reference screenshots, images tied to any person.
- **Deprecation.** If a profile goes stale (relationship ended, person moved on), set `status: archived` in the frontmatter. Do not delete. History is still useful.

## What goes here vs. elsewhere

**Here:** the person, their preferences, your relationship, shared work connections.

**Not here:**
- **Meeting notes.** Those go in `daily/meetings/` or the relevant project folder.
- **Emails and message threads.** Those are context, not profile.
- **Access-control visibility tags.** Those live in `_reference/visibility/` (separate system).
- **Person-specific voice direction.** That lives in this profile's `Rendering Preferences` section. When a cut targets this contact, the skill reads that section and applies it as a contact overlay on top of the lens defaults.

## About this placeholder

This folder ships empty. Your real contact profiles will live here once you install the packet in your own folder and start filling them in. The `_template.md` file is ready to copy.
